(() => {
  "use strict";

  const canvas = document.getElementById("gameCanvas");
  const ctx = canvas.getContext("2d");
  const $ = (id) => document.getElementById(id);

  const ui = {
    score: $("score"), level: $("level"), wpm: $("wpm"), accuracy: $("accuracy"),
    lives: $("lives"), combo: $("combo"), comboFill: $("comboFill"), currentDifficulty: $("currentDifficulty"),
    startScreen: $("startScreen"), pauseScreen: $("pauseScreen"), gameOverScreen: $("gameOverScreen"),
    startBtn: $("startBtn"), pauseBtn: $("pauseBtn"), resumeBtn: $("resumeBtn"), restartBtn: $("restartBtn"),
    soundBtn: $("soundBtn"), bestScore: $("bestScore"), finalScore: $("finalScore"),
    finalWpm: $("finalWpm"), finalAccuracy: $("finalAccuracy"), finalLevel: $("finalLevel"),
    newRecord: $("newRecord"), toast: $("toast")
  };

  const difficultyButtons = [...document.querySelectorAll(".difficulty-btn")];
  const WORDS = window.DIGITANDO_WORDS;
  const TAU = Math.PI * 2;
  const MAX_LIVES = 3;
  const BONUS_EVERY_KILLS = 10;
  const BOSS_EVERY_LEVELS = 5;
  const POWER_DURATION = 10;
  const bestKey = "digitandoSpeedBestScore";
  const difficultyKey = "digitandoSpeedDifficulty";

  const DIFFICULTIES = {
    easy:    { label: "Fácil",   speed: 0.42, spawn: 1.85, minSpawn: 2.15, levelStep: 15, wordBias: -6 },
    medium:  { label: "Médio",   speed: 1.00, spawn: 1.00, minSpawn: 0.72, levelStep: 7,  wordBias: 0 },
    hard:    { label: "Difícil", speed: 1.22, spawn: 0.82, minSpawn: 0.58, levelStep: 6,  wordBias: 2 },
    extreme: { label: "Extremo", speed: 1.48, spawn: 0.64, minSpawn: 0.43, levelStep: 5,  wordBias: 5 }
  };

  const BONUS_TYPES = ["clear", "combo", "slow", "shield"];
  const BONUS_LABELS = {
    clear: "LIMPEZA TOTAL",
    combo: "COMBO ×2",
    slow: "CÂMERA LENTA",
    shield: "ESCUDO"
  };

  let selectedDifficulty = localStorage.getItem(difficultyKey);
  if (!DIFFICULTIES[selectedDifficulty]) selectedDifficulty = "medium";

  let dpr = 1, width = 0, height = 0, lastTime = performance.now(), animationId = 0, toastTimer = 0;
  let audio = null, muted = false;
  let enemies = [], stars = [], particles = [], lasers = [], shockwaves = [];

  const state = {
    mode: "menu", score: 0, level: 1, lives: MAX_LIVES, kills: 0,
    correctChars: 0, totalChars: 0, streak: 0, bestStreak: 0,
    elapsed: 0, spawnClock: 0, target: null, shake: 0, flash: 0, lastLevel: 1,
    difficulty: selectedDifficulty, nextBonusAt: BONUS_EVERY_KILLS, nextBossLevel: BOSS_EVERY_LEVELS,
    combo2Until: 0, slowUntil: 0
  };

  const typingInput = document.createElement("input");
  typingInput.type = "text";
  typingInput.autocomplete = "off";
  typingInput.autocapitalize = "off";
  typingInput.spellcheck = false;
  typingInput.setAttribute("aria-hidden", "true");
  Object.assign(typingInput.style, {
    position: "fixed", left: "-9999px", top: "0", width: "1px", height: "1px",
    opacity: "0", pointerEvents: "none"
  });
  document.body.appendChild(typingInput);

  const getBest = () => Number(localStorage.getItem(bestKey) || 0);
  const formatNumber = (n) => Math.round(n).toLocaleString("pt-BR");
  const difficulty = () => DIFFICULTIES[state.difficulty || selectedDifficulty] || DIFFICULTIES.medium;
  const makeId = () => (globalThis.crypto?.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`);
  const isCombo2 = () => state.elapsed < state.combo2Until;
  const isSlow = () => state.elapsed < state.slowUntil;
  const isEasy = () => state.difficulty === "easy";
  ui.bestScore.textContent = formatNumber(getBest());

  function focusTypingInput() {
    if (state.mode !== "playing") return;
    try { typingInput.focus({ preventScroll: true }); } catch (_) { typingInput.focus(); }
  }

  function updateDifficultyUi() {
    difficultyButtons.forEach((button) => {
      const active = button.dataset.difficulty === selectedDifficulty;
      button.classList.toggle("active", active);
      button.setAttribute("aria-pressed", active ? "true" : "false");
    });
    if (ui.currentDifficulty) ui.currentDifficulty.textContent = DIFFICULTIES[selectedDifficulty].label;
  }

  function setDifficulty(key) {
    if (!DIFFICULTIES[key] || state.mode === "playing" || state.mode === "paused") return;
    selectedDifficulty = key;
    localStorage.setItem(difficultyKey, key);
    updateDifficultyUi();
  }

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    createStars();
  }

  function createStars() {
    const count = Math.max(90, Math.floor((width * height) / 9000));
    stars = Array.from({ length: count }, () => ({
      x: Math.random() * width, y: Math.random() * height,
      size: Math.random() * 1.7 + 0.25, speed: Math.random() * 14 + 5,
      alpha: Math.random() * 0.65 + 0.18, layer: Math.random()
    }));
  }

  function resetGame() {
    Object.assign(state, {
      mode: "playing", score: 0, level: 1, lives: MAX_LIVES, kills: 0,
      correctChars: 0, totalChars: 0, streak: 0, bestStreak: 0,
      elapsed: 0, spawnClock: 0.4, target: null, shake: 0, flash: 0, lastLevel: 1,
      difficulty: selectedDifficulty, nextBonusAt: BONUS_EVERY_KILLS, nextBossLevel: BOSS_EVERY_LEVELS,
      combo2Until: 0, slowUntil: 0
    });
    enemies = []; particles = []; lasers = []; shockwaves = [];
    hideAllOverlays();
    updateHud();
    showToast(`MISSÃO • ${difficulty().label.toUpperCase()}`);
    sfx("start");
    setTimeout(focusTypingInput, 0);
  }

  function hideAllOverlays() {
    ui.startScreen.classList.remove("visible");
    ui.pauseScreen.classList.remove("visible");
    ui.gameOverScreen.classList.remove("visible");
  }

  function togglePause(force) {
    if (state.mode === "menu" || state.mode === "gameover") return;
    const shouldPause = typeof force === "boolean" ? force : state.mode === "playing";
    if (shouldPause && state.mode === "playing") {
      state.mode = "paused";
      typingInput.blur();
      ui.pauseScreen.classList.add("visible");
      ui.pauseBtn.textContent = "▶";
    } else if (!shouldPause && state.mode === "paused") {
      state.mode = "playing";
      ui.pauseScreen.classList.remove("visible");
      ui.pauseBtn.textContent = "Ⅱ";
      lastTime = performance.now();
      setTimeout(focusTypingInput, 0);
    }
  }

  function endGame() {
    state.mode = "gameover";
    state.target = null;
    typingInput.blur();
    const previous = getBest();
    if (state.score > previous) localStorage.setItem(bestKey, String(Math.round(state.score)));
    ui.finalScore.textContent = formatNumber(state.score);
    ui.finalWpm.textContent = getWpm();
    ui.finalAccuracy.textContent = `${getAccuracy()}%`;
    ui.finalLevel.textContent = state.level;
    ui.newRecord.hidden = state.score <= previous;
    ui.bestScore.textContent = formatNumber(Math.max(previous, state.score));
    ui.gameOverScreen.classList.add("visible");
    ui.pauseBtn.textContent = "Ⅱ";
    sfx("gameover");
  }

  function getWpm() {
    return state.elapsed <= 1 ? 0 : Math.max(0, Math.round((state.correctChars / 5) / (state.elapsed / 60)));
  }

  function getAccuracy() {
    return state.totalChars ? Math.round((state.correctChars / state.totalChars) * 100) : 100;
  }

  function getMultiplier() {
    const normal = Math.min(8, 1 + Math.floor(state.streak / 15));
    return normal * (isCombo2() ? 2 : 1);
  }

  function updateHud() {
    ui.score.textContent = formatNumber(state.score);
    ui.level.textContent = state.level;
    ui.wpm.textContent = getWpm();
    ui.accuracy.textContent = `${getAccuracy()}%`;
    ui.combo.textContent = `x${getMultiplier()}`;
    ui.comboFill.style.width = `${((state.streak % 15) / 15) * 100}%`;
    if (ui.currentDifficulty) ui.currentDifficulty.textContent = difficulty().label;
    ui.lives.innerHTML = "";
    for (let i = 0; i < MAX_LIVES; i++) {
      const life = document.createElement("span");
      life.className = `life${i >= state.lives ? " off" : ""}`;
      ui.lives.appendChild(life);
    }
  }

  function wordPoolForLevel(level) {
    if (isEasy()) {
      if (level <= 5) return [...WORDS.easy];
      if (level <= 10) return [...WORDS.easy, ...WORDS.medium.slice(0, 25)];
      if (level <= 15) return [...WORDS.easy, ...WORDS.medium];
      return [...WORDS.medium, ...WORDS.hard.slice(0, 18)];
    }

    const effective = Math.max(1, level + difficulty().wordBias);
    if (effective <= 2) return [...WORDS.easy, ...WORDS.medium.slice(0, 12)];
    if (effective <= 5) return [...WORDS.easy, ...WORDS.medium];
    if (effective <= 8) return [...WORDS.medium, ...WORDS.hard];
    if (effective <= 12) return [...WORDS.medium.slice(20), ...WORDS.hard, ...WORDS.expert.slice(0, 14)];
    return [...WORDS.hard, ...WORDS.expert];
  }

  function wordInitial(word) {
    return [...word][0]?.toLocaleLowerCase("pt-BR");
  }

  function chooseWord() {
    const pool = wordPoolForLevel(state.level);
    const specialInitials = new Set(enemies.filter((e) => e.kind !== "normal").map((e) => wordInitial(e.word)));
    for (let attempt = 0; attempt < 24; attempt++) {
      const word = pool[Math.floor(Math.random() * pool.length)];
      if (specialInitials.has(wordInitial(word))) continue;
      if (!enemies.some((e) => e.word === word && e.y < height * 0.55)) return word;
    }
    return pool.find((word) => !specialInitials.has(wordInitial(word))) || pool[Math.floor(Math.random() * pool.length)];
  }

  function chooseBonusWord() {
    let pool = WORDS.bonus?.length ? WORDS.bonus : WORDS.expert;
    if (isEasy()) pool = [...pool].sort((a, b) => a.length - b.length).slice(0, 12);
    const usedInitials = new Set(enemies.map((e) => wordInitial(e.word)));
    const unused = pool.filter((word) => !usedInitials.has(wordInitial(word)));
    const candidates = unused.length ? unused : pool;
    return candidates[Math.floor(Math.random() * candidates.length)];
  }

  function chooseBossPhrase() {
    let pool = WORDS.boss?.length ? WORDS.boss : ["concentração e velocidade conduzem à vitória"];
    if (isEasy()) pool = [...pool].sort((a, b) => a.length - b.length).slice(0, 6);
    return pool[Math.floor(Math.random() * pool.length)];
  }

  function spawnEnemy() {
    if (width < 1 || height < 1 || enemies.some((e) => e.kind === "boss")) return;
    if (isEasy() && enemies.filter((e) => e.kind === "normal").length >= 3) return;

    const word = chooseWord();
    const margin = Math.min(145, Math.max(70, width * 0.1));
    const x = margin + Math.random() * Math.max(1, width - margin * 2);
    const levelGrowth = isEasy() ? 0.45 : 2.35;
    const baseSpeed = (18 + state.level * levelGrowth) * difficulty().speed;
    enemies.push({
      id: makeId(), kind: "normal", word, typed: 0, x, y: -40,
      speed: baseSpeed * (0.82 + Math.random() * 0.34),
      radius: 15 + Math.min(word.length, 14) * 0.45,
      phase: Math.random() * TAU, rot: Math.random() * TAU,
      rotSpeed: (Math.random() - 0.5) * 0.8, pulse: 0, hit: 0
    });
  }

  function spawnBonus() {
    if (enemies.some((e) => e.kind !== "normal") || !WORDS.bonus?.length) return false;
    const word = chooseBonusWord();
    const bonusType = BONUS_TYPES[Math.floor(Math.random() * BONUS_TYPES.length)];
    const margin = Math.min(190, Math.max(100, width * 0.16));
    const x = margin + Math.random() * Math.max(1, width - margin * 2);
    const levelGrowth = isEasy() ? 0.45 : 2.1;
    const baseSpeed = (18 + state.level * levelGrowth) * difficulty().speed;
    enemies.push({
      id: makeId(), kind: "bonus", bonusType, word, typed: 0, x, y: -58,
      speed: baseSpeed * (isEasy() ? 0.42 : 0.68),
      radius: 27 + Math.min(word.length, 22) * 0.32,
      phase: Math.random() * TAU, rot: Math.random() * TAU,
      rotSpeed: (Math.random() - 0.5) * 0.28, pulse: 0, hit: 0
    });
    state.nextBonusAt += BONUS_EVERY_KILLS;
    showToast(`BÔNUS • ${BONUS_LABELS[bonusType]}`);
    sfx("bonusAppear");
    return true;
  }

  function spawnBoss() {
    if (enemies.some((e) => e.kind !== "normal")) return false;
    const phrase = chooseBossPhrase();
    const levelGrowth = isEasy() ? 0.35 : 1.75;
    const baseSpeed = (18 + state.level * levelGrowth) * difficulty().speed;
    enemies.push({
      id: makeId(), kind: "boss", word: phrase, typed: 0,
      x: width / 2, y: -82, speed: baseSpeed * (isEasy() ? 0.26 : 0.52),
      radius: Math.min(52, 39 + phrase.length * 0.18),
      phase: Math.random() * TAU, rot: 0, rotSpeed: 0.08,
      pulse: 0, hit: 0, bossLevel: state.nextBossLevel
    });
    state.nextBossLevel += BOSS_EVERY_LEVELS;
    state.spawnClock = 0;
    showToast(`⚠ CHEFÃO • NÍVEL ${state.level} ⚠`);
    sfx("bossAppear");
    return true;
  }

  function maybeSpawnSpecial() {
    if (state.mode !== "playing" || enemies.some((e) => e.kind !== "normal")) return;
    if (state.level >= state.nextBossLevel) {
      spawnBoss();
      return;
    }
    if (state.kills >= state.nextBonusAt) spawnBonus();
  }

  function spawnInterval() {
    if (isEasy()) return Math.max(2.15, 3.35 - state.level * 0.025);
    const d = difficulty();
    return Math.max(d.minSpawn, (2.25 - state.level * 0.105) * d.spawn);
  }

  function damage(amount = 1) {
    state.lives = Math.max(0, state.lives - amount);
    state.streak = 0;
    state.target = null;
    state.shake = 12;
    state.flash = 0.34;
    sfx("damage");
    updateHud();
    if (state.lives <= 0) endGame(); else showToast("ESCUDO DANIFICADO");
  }

  function clearOtherEnemies(source, golden = false) {
    const others = enemies.filter((e) => e !== source);
    for (const other of others) explosion(other.x, other.y, other.radius, golden || other.kind === "bonus");
    return others.length;
  }

  function destroyEnemy(enemy) {
    if (enemy.kind === "bonus") {
      destroyBonus(enemy);
      return;
    }
    if (enemy.kind === "boss") {
      destroyBoss(enemy);
      return;
    }

    const index = enemies.indexOf(enemy);
    if (index >= 0) enemies.splice(index, 1);
    if (state.target === enemy) state.target = null;

    state.kills += 1;
    state.score += Math.round((90 + enemy.word.length * 22 + state.level * 12) * getMultiplier());
    state.level = 1 + Math.floor(state.kills / difficulty().levelStep);
    explosion(enemy.x, enemy.y, enemy.radius);
    shockwaves.push({ x: enemy.x, y: enemy.y, r: 5, alpha: 0.8, color: "#79ecff" });
    sfx("destroy");

    if (state.level > state.lastLevel) {
      state.lastLevel = state.level;
      showToast(`NÍVEL ${state.level}`);
      sfx("level");
    }
    maybeSpawnSpecial();
    updateHud();
  }

  function destroyBonus(enemy) {
    const type = enemy.bonusType;
    const index = enemies.indexOf(enemy);
    if (index >= 0) enemies.splice(index, 1);
    state.target = null;
    explosion(enemy.x, enemy.y, enemy.radius * 1.35, true);
    shockwaves.push({ x: enemy.x, y: enemy.y, r: 8, alpha: 1, color: "#facc15" });
    state.score += Math.round((800 + enemy.word.length * 45) * getMultiplier());

    if (type === "clear") {
      const cleared = clearOtherEnemies(enemy, true);
      enemies = [];
      state.score += cleared * 140;
      showToast(cleared ? `LIMPEZA TOTAL • ${cleared} AMEAÇAS` : "BÔNUS DE LIMPEZA!");
    } else if (type === "combo") {
      state.combo2Until = Math.max(state.combo2Until, state.elapsed) + POWER_DURATION;
      showToast("COMBO ×2 ATIVO • 10 SEGUNDOS");
    } else if (type === "slow") {
      state.slowUntil = Math.max(state.slowUntil, state.elapsed) + POWER_DURATION;
      showToast("CÂMERA LENTA • 10 SEGUNDOS");
    } else if (type === "shield") {
      const restored = MAX_LIVES - state.lives;
      state.lives = MAX_LIVES;
      state.score += restored ? restored * 180 : 250;
      showToast(restored ? "ESCUDO RESTAURADO!" : "ESCUDO JÁ ESTAVA COMPLETO • +250");
    }

    state.shake = Math.max(state.shake, 6);
    sfx("bonus");
    updateHud();
    setTimeout(maybeSpawnSpecial, 0);
  }

  function destroyBoss(enemy) {
    const cleared = clearOtherEnemies(enemy, true);
    explosion(enemy.x, enemy.y, enemy.radius * 1.7, true);
    enemies = [];
    state.target = null;
    state.score += Math.round((2200 + enemy.word.replace(/\s/g, "").length * 75 + cleared * 160) * getMultiplier());
    state.shake = Math.max(state.shake, 14);
    state.flash = Math.max(state.flash, 0.18);
    shockwaves.push({ x: enemy.x, y: enemy.y, r: 12, alpha: 1, color: "#fb7185" });
    showToast(cleared ? `CHEFÃO DESTRUÍDO • ${cleared} AMEAÇAS ELIMINADAS` : "CHEFÃO DESTRUÍDO!");
    sfx("boss");
    updateHud();
    setTimeout(maybeSpawnSpecial, 0);
  }

  function explosion(x, y, radius, golden = false) {
    const amount = 15 + Math.floor(radius / 2);
    for (let i = 0; i < amount; i++) {
      const a = Math.random() * TAU, speed = 35 + Math.random() * 135;
      particles.push({
        x, y, vx: Math.cos(a) * speed, vy: Math.sin(a) * speed,
        life: 0.35 + Math.random() * 0.55, maxLife: 0.9, size: 1 + Math.random() * 3,
        hue: golden ? (42 + Math.random() * 12) : (Math.random() > 0.35 ? 188 : 257)
      });
    }
  }

  function shipPosition() {
    return { x: width / 2, y: height - Math.max(78, Math.min(108, height * 0.105)) };
  }

  function fireLaser(enemy) {
    const ship = shipPosition();
    lasers.push({
      x1: ship.x, y1: ship.y - 19, x2: enemy.x, y2: enemy.y,
      life: 0.13, maxLife: 0.13,
      color: enemy.kind === "boss" ? "#fb7185" : (enemy.kind === "bonus" ? "#fde047" : "#78efff")
    });
    enemy.hit = 0.15;
    enemy.pulse = 0.2;
    sfx("type");
  }

  function skipPhraseSpaces(enemy) {
    if (enemy.kind !== "boss") return;
    const letters = [...enemy.word];
    while (enemy.typed < letters.length && letters[enemy.typed] === " ") enemy.typed += 1;
  }

  function processKey(rawKey) {
    if (state.mode !== "playing") return;
    const key = rawKey.toLocaleLowerCase("pt-BR");
    if (!key || [...key].length !== 1 || key === " ") return;
    state.totalChars += 1;

    if (!state.target || !enemies.includes(state.target)) {
      const candidates = enemies
        .filter((e) => wordInitial(e.word) === key)
        .sort((a, b) => {
          const priority = (e) => e.kind === "boss" ? 3 : (e.kind === "bonus" ? 2 : 1);
          return priority(b) - priority(a) || b.y - a.y;
        });
      state.target = candidates[0] || null;
    }

    const target = state.target;
    if (target) {
      skipPhraseSpaces(target);
      const letters = [...target.word];
      const expected = letters[target.typed]?.toLocaleLowerCase("pt-BR");
      if (key === expected) {
        target.typed += 1;
        skipPhraseSpaces(target);
        state.correctChars += 1;
        state.streak += 1;
        state.bestStreak = Math.max(state.bestStreak, state.streak);
        const charPoints = target.kind === "boss" ? 14 : (target.kind === "bonus" ? 10 : 6);
        state.score += charPoints * getMultiplier();
        fireLaser(target);
        if (target.typed >= letters.length) destroyEnemy(target);
        updateHud();
        return;
      }

      state.streak = 0;
      target.typed = 0;
      const firstLetter = letters[0]?.toLocaleLowerCase("pt-BR");
      if (key === firstLetter) {
        target.typed = 1;
        skipPhraseSpaces(target);
        state.correctChars += 1;
        fireLaser(target);
      }
      state.shake = Math.max(state.shake, 2.5);
      showToast(target.kind === "boss" ? "ERRO • REDIGITE A FRASE" : "ERRO • REDIGITE A PALAVRA");
      sfx("error");
      updateHud();
      return;
    }

    state.streak = 0;
    state.shake = Math.max(state.shake, 2.5);
    sfx("error");
    updateHud();
  }

  function update(dt) {
    updateStars(dt);
    updateEffects(dt);
    if (state.mode !== "playing") return;

    state.elapsed += dt;
    const gameDt = dt * (isSlow() ? 0.48 : 1);
    state.spawnClock += gameDt;

    maybeSpawnSpecial();
    if (!enemies.some((e) => e.kind === "boss") && state.spawnClock >= spawnInterval()) {
      state.spawnClock = 0;
      spawnEnemy();
    }

    for (const enemy of [...enemies]) {
      enemy.phase += gameDt * 1.35;
      enemy.rot += enemy.rotSpeed * gameDt;
      enemy.y += enemy.speed * gameDt;
      enemy.x += Math.sin(enemy.phase) * (enemy.kind === "boss" ? 1.4 : (enemy.kind === "bonus" ? 3.2 : 5.5)) * gameDt;
      if (enemy.kind === "boss") enemy.x = width / 2 + Math.sin(enemy.phase * 0.55) * Math.min(width * 0.18, 150);
      enemy.hit = Math.max(0, enemy.hit - gameDt);
      enemy.pulse = Math.max(0, enemy.pulse - gameDt);

      if (enemy.y > height - 64) {
        enemies.splice(enemies.indexOf(enemy), 1);
        if (state.target === enemy) state.target = null;

        if (enemy.kind === "bonus") {
          explosion(enemy.x, height - 66, enemy.radius, true);
          showToast("BÔNUS PERDIDO • MISSÃO CONTINUA");
          sfx("bonusMiss");
          continue;
        }

        if (enemy.kind === "boss") {
          explosion(enemy.x, height - 66, enemy.radius, true);
          damage(1);
          if (state.mode === "playing") showToast("CHEFÃO ESCAPOU • ESCUDO DANIFICADO");
          sfx("bossMiss");
          continue;
        }

        explosion(enemy.x, height - 66, enemy.radius);
        damage();
        if (state.mode !== "playing") break;
      }
    }

    state.shake = Math.max(0, state.shake - dt * 28);
    state.flash = Math.max(0, state.flash - dt);
    updateHud();
  }

  function updateStars(dt) {
    const multiplier = state.mode === "playing" ? 1 + Math.min(state.level * 0.025, 0.35) : 0.35;
    const slowVisual = isSlow() ? 0.5 : 1;
    for (const star of stars) {
      star.y += star.speed * multiplier * slowVisual * dt;
      if (star.y > height + 3) { star.y = -3; star.x = Math.random() * width; }
    }
  }

  function updateEffects(dt) {
    lasers = lasers.filter((l) => (l.life -= dt) > 0);
    particles = particles.filter((p) => {
      p.life -= dt; p.x += p.vx * dt; p.y += p.vy * dt;
      p.vx *= Math.pow(0.985, dt * 60); p.vy *= Math.pow(0.985, dt * 60);
      return p.life > 0;
    });
    shockwaves = shockwaves.filter((s) => { s.r += 115 * dt; s.alpha -= 1.8 * dt; return s.alpha > 0; });
  }

  function draw() {
    ctx.save();
    ctx.clearRect(0, 0, width, height);
    ctx.translate(
      state.shake ? (Math.random() - 0.5) * state.shake : 0,
      state.shake ? (Math.random() - 0.5) * state.shake : 0
    );
    drawBackground();
    drawStars();
    drawLane();
    for (const enemy of enemies) drawEnemy(enemy);
    drawLasers();
    drawParticles();
    drawShip();
    drawTargetLink();
    drawPowerStatus();
    if (state.flash > 0) {
      ctx.fillStyle = `rgba(251,113,133,${Math.min(0.12, state.flash * 0.35)})`;
      ctx.fillRect(-20, -20, width + 40, height + 40);
    }
    ctx.restore();
  }

  function drawBackground() {
    const gradient = ctx.createRadialGradient(width / 2, height * 0.72, 0, width / 2, height * 0.72, Math.max(width, height) * 0.72);
    gradient.addColorStop(0, isSlow() ? "rgba(40,70,125,.22)" : "rgba(11,39,78,.16)");
    gradient.addColorStop(0.48, "rgba(6,15,39,.1)");
    gradient.addColorStop(1, "rgba(2,5,16,0)");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);
  }

  function drawStars() {
    for (const star of stars) {
      ctx.globalAlpha = star.alpha;
      ctx.fillStyle = star.layer > 0.84 ? "#b8f4ff" : "#93a7bf";
      ctx.fillRect(star.x, star.y, star.size, star.size * (1 + star.layer * 0.8));
    }
    ctx.globalAlpha = 1;
  }

  function drawLane() {
    const ship = shipPosition();
    ctx.save();
    ctx.strokeStyle = "rgba(103,232,249,.035)";
    ctx.lineWidth = 1;
    ctx.setLineDash([2, 12]);
    ctx.beginPath(); ctx.moveTo(ship.x, 95); ctx.lineTo(ship.x, ship.y - 40); ctx.stroke();
    ctx.restore();
  }

  function drawEnemy(enemy) {
    if (enemy.kind === "bonus") return drawBonusEnemy(enemy);
    if (enemy.kind === "boss") return drawBossEnemy(enemy);
    drawNormalEnemy(enemy);
  }

  function drawNormalEnemy(enemy) {
    const isTarget = state.target === enemy;
    ctx.save();
    ctx.translate(enemy.x, enemy.y);
    ctx.rotate(enemy.rot);
    if (isTarget) {
      const halo = ctx.createRadialGradient(0, 0, 3, 0, 0, enemy.radius * 3.1);
      halo.addColorStop(0, "rgba(103,232,249,.17)");
      halo.addColorStop(1, "rgba(103,232,249,0)");
      ctx.fillStyle = halo; ctx.beginPath(); ctx.arc(0, 0, enemy.radius * 3.1, 0, TAU); ctx.fill();
    }
    ctx.rotate(-enemy.rot);
    ctx.shadowBlur = enemy.hit > 0 ? 22 : (isTarget ? 14 : 5);
    ctx.shadowColor = isTarget ? "rgba(103,232,249,.9)" : "rgba(111,129,160,.35)";
    ctx.fillStyle = enemy.hit > 0 ? "rgba(191,248,255,.98)" : "rgba(15,27,51,.96)";
    ctx.strokeStyle = isTarget ? "rgba(103,232,249,.78)" : "rgba(129,152,184,.28)";
    ctx.lineWidth = isTarget ? 1.4 : 1;
    ctx.beginPath();
    for (let i = 0; i < 6; i++) {
      const a = (i / 6) * TAU - Math.PI / 2;
      const r = enemy.radius * (i % 2 ? 0.86 : 1);
      const px = Math.cos(a) * r, py = Math.sin(a) * r;
      i ? ctx.lineTo(px, py) : ctx.moveTo(px, py);
    }
    ctx.closePath(); ctx.fill(); ctx.stroke();
    ctx.shadowBlur = 0;
    ctx.fillStyle = isTarget ? "rgba(103,232,249,.8)" : "rgba(133,151,176,.5)";
    ctx.beginPath(); ctx.arc(0, 0, 2.4, 0, TAU); ctx.fill();
    ctx.restore();
    drawTextForEnemy(enemy, isTarget);
  }

  function drawBonusEnemy(enemy) {
    const isTarget = state.target === enemy;
    ctx.save();
    ctx.translate(enemy.x, enemy.y);
    const halo = ctx.createRadialGradient(0, 0, 2, 0, 0, enemy.radius * (isTarget ? 4.1 : 3.2));
    halo.addColorStop(0, isTarget ? "rgba(250,204,21,.32)" : "rgba(250,204,21,.2)");
    halo.addColorStop(1, "rgba(250,204,21,0)");
    ctx.fillStyle = halo; ctx.beginPath(); ctx.arc(0, 0, enemy.radius * (isTarget ? 4.1 : 3.2), 0, TAU); ctx.fill();
    ctx.rotate(enemy.rot);
    ctx.shadowBlur = enemy.hit > 0 ? 32 : 22;
    ctx.shadowColor = "rgba(250,204,21,.72)";
    ctx.fillStyle = enemy.hit > 0 ? "#fff1a6" : "rgba(77,54,8,.96)";
    ctx.strokeStyle = "#facc15";
    ctx.lineWidth = isTarget ? 2.5 : 1.8;
    ctx.beginPath();
    for (let i = 0; i < 8; i++) {
      const a = (i / 8) * TAU - Math.PI / 2;
      const r = enemy.radius * (i % 2 ? 0.78 : 1);
      const px = Math.cos(a) * r, py = Math.sin(a) * r;
      i ? ctx.lineTo(px, py) : ctx.moveTo(px, py);
    }
    ctx.closePath(); ctx.fill(); ctx.stroke();
    ctx.restore();
    drawTextForEnemy(enemy, isTarget);
  }

  function drawBossEnemy(enemy) {
    const isTarget = state.target === enemy;
    ctx.save();
    ctx.translate(enemy.x, enemy.y);
    const halo = ctx.createRadialGradient(0, 0, 4, 0, 0, enemy.radius * 4.2);
    halo.addColorStop(0, isTarget ? "rgba(251,113,133,.3)" : "rgba(168,85,247,.2)");
    halo.addColorStop(1, "rgba(251,113,133,0)");
    ctx.fillStyle = halo; ctx.beginPath(); ctx.arc(0, 0, enemy.radius * 4.2, 0, TAU); ctx.fill();

    ctx.rotate(enemy.rot);
    ctx.shadowBlur = enemy.hit > 0 ? 38 : 26;
    ctx.shadowColor = "rgba(251,113,133,.75)";
    ctx.fillStyle = enemy.hit > 0 ? "#ffe4e6" : "rgba(61,18,48,.98)";
    ctx.strokeStyle = isTarget ? "#fda4af" : "#fb7185";
    ctx.lineWidth = isTarget ? 3 : 2;
    ctx.beginPath();
    for (let i = 0; i < 12; i++) {
      const a = (i / 12) * TAU - Math.PI / 2;
      const r = enemy.radius * (i % 2 ? 0.72 : 1.05);
      const px = Math.cos(a) * r, py = Math.sin(a) * r;
      i ? ctx.lineTo(px, py) : ctx.moveTo(px, py);
    }
    ctx.closePath(); ctx.fill(); ctx.stroke();
    ctx.shadowBlur = 0;
    ctx.fillStyle = "#fda4af";
    ctx.beginPath(); ctx.arc(0, 0, 7, 0, TAU); ctx.fill();
    ctx.restore();
    drawTextForEnemy(enemy, isTarget);
  }

  function drawTextForEnemy(enemy, isTarget) {
    const chars = [...enemy.word];
    const typed = chars.slice(0, enemy.typed).join("");
    const rest = chars.slice(enemy.typed).join("");
    const special = enemy.kind !== "normal";
    let fontSize = enemy.kind === "boss" ? Math.max(17, Math.min(24, width / 54)) : (enemy.kind === "bonus" ? Math.max(20, Math.min(27, width / 52)) : Math.max(14, Math.min(18, width / 75)));

    ctx.save();
    ctx.font = `${special ? 950 : 800} ${fontSize}px ui-monospace, SFMono-Regular, Menlo, Consolas, monospace`;
    let typedW = ctx.measureText(typed).width;
    let restW = ctx.measureText(rest).width;
    let totalW = typedW + restW;
    const maxW = Math.max(120, width - 32);
    if (totalW > maxW) {
      fontSize *= maxW / totalW;
      ctx.font = `${special ? 950 : 800} ${fontSize}px ui-monospace, SFMono-Regular, Menlo, Consolas, monospace`;
      typedW = ctx.measureText(typed).width;
      restW = ctx.measureText(rest).width;
      totalW = typedW + restW;
    }
    ctx.textBaseline = "middle";
    const x = enemy.x - totalW / 2;
    const y = enemy.y - enemy.radius - (special ? 29 : 20);

    if (enemy.kind === "bonus") {
      ctx.textAlign = "center";
      ctx.font = `900 ${Math.max(8, fontSize * 0.42)}px ui-sans-serif, system-ui, sans-serif`;
      ctx.fillStyle = "rgba(250,204,21,.92)";
      ctx.fillText(`★ BÔNUS • ${BONUS_LABELS[enemy.bonusType]} ★`, enemy.x, y - fontSize * 0.95);
      ctx.textAlign = "left";
      ctx.font = `950 ${fontSize}px ui-monospace, SFMono-Regular, Menlo, Consolas, monospace`;
    } else if (enemy.kind === "boss") {
      ctx.textAlign = "center";
      ctx.font = `950 ${Math.max(9, fontSize * 0.48)}px ui-sans-serif, system-ui, sans-serif`;
      ctx.fillStyle = "#fb7185";
      ctx.fillText(`⚠ CHEFÃO • NÍVEL ${enemy.bossLevel} ⚠`, enemy.x, y - fontSize * 1.05);
      ctx.textAlign = "left";
      ctx.font = `950 ${fontSize}px ui-monospace, SFMono-Regular, Menlo, Consolas, monospace`;
    }

    if (isTarget) {
      ctx.fillStyle = enemy.kind === "boss" ? "rgba(45,11,35,.86)" : (enemy.kind === "bonus" ? "rgba(56,39,4,.82)" : "rgba(4,14,31,.74)");
      roundRect(ctx, x - 9, y - fontSize / 2 - 6, totalW + 18, fontSize + 12, 7);
      ctx.fill();
      ctx.strokeStyle = enemy.kind === "boss" ? "rgba(251,113,133,.6)" : (enemy.kind === "bonus" ? "rgba(250,204,21,.5)" : "rgba(103,232,249,.12)");
      ctx.stroke();
    }

    const typedColor = enemy.kind === "boss" ? "#fecdd3" : (enemy.kind === "bonus" ? "#fff3a3" : (isTarget ? "#62dfee" : "rgba(121,143,168,.7)"));
    const restColor = enemy.kind === "boss" ? "#fb7185" : (enemy.kind === "bonus" ? "#facc15" : (isTarget ? "#edfaff" : "#c4d0dd"));
    ctx.fillStyle = typedColor; ctx.fillText(typed, x, y);
    ctx.fillStyle = restColor; ctx.fillText(rest, x + typedW, y);
    ctx.restore();
  }

  function roundRect(context, x, y, w, h, r) {
    const rr = Math.min(r, w / 2, h / 2);
    context.beginPath();
    context.moveTo(x + rr, y);
    context.arcTo(x + w, y, x + w, y + h, rr);
    context.arcTo(x + w, y + h, x, y + h, rr);
    context.arcTo(x, y + h, x, y, rr);
    context.arcTo(x, y, x + w, y, rr);
    context.closePath();
  }

  function drawShip() {
    const { x, y } = shipPosition();
    ctx.save(); ctx.translate(x, y);
    const engine = ctx.createRadialGradient(0, 19, 0, 0, 19, 48);
    engine.addColorStop(0, "rgba(70,205,255,.34)");
    engine.addColorStop(1, "rgba(70,205,255,0)");
    ctx.fillStyle = engine; ctx.beginPath(); ctx.arc(0, 18, 48, 0, TAU); ctx.fill();
    ctx.shadowBlur = 24; ctx.shadowColor = "rgba(90,222,255,.34)";
    ctx.fillStyle = "#d8f8ff"; ctx.strokeStyle = "rgba(103,232,249,.8)"; ctx.lineWidth = 1.4;
    ctx.beginPath(); ctx.moveTo(0, -27); ctx.lineTo(21, 20); ctx.lineTo(8, 14); ctx.lineTo(0, 22); ctx.lineTo(-8, 14); ctx.lineTo(-21, 20); ctx.closePath(); ctx.fill(); ctx.stroke();
    ctx.shadowBlur = 0; ctx.fillStyle = "#09233b";
    ctx.beginPath(); ctx.moveTo(0, -16); ctx.lineTo(6, 8); ctx.lineTo(0, 13); ctx.lineTo(-6, 8); ctx.closePath(); ctx.fill();
    ctx.fillStyle = "#67e8f9"; ctx.fillRect(-5, 20, 3, 7); ctx.fillRect(2, 20, 3, 7);
    ctx.restore();
  }

  function drawTargetLink() {
    if (!state.target || state.mode !== "playing") return;
    const ship = shipPosition();
    ctx.save();
    ctx.strokeStyle = state.target.kind === "boss" ? "rgba(251,113,133,.22)" : (state.target.kind === "bonus" ? "rgba(250,204,21,.16)" : "rgba(103,232,249,.055)");
    ctx.setLineDash([3, 8]);
    ctx.beginPath(); ctx.moveTo(ship.x, ship.y - 30); ctx.lineTo(state.target.x, state.target.y + 16); ctx.stroke();
    ctx.restore();
  }

  function drawLasers() {
    for (const l of lasers) {
      ctx.save();
      ctx.globalAlpha = Math.max(0, l.life / l.maxLife);
      ctx.strokeStyle = l.color;
      ctx.shadowBlur = 13;
      ctx.shadowColor = l.color;
      ctx.lineWidth = l.color === "#78efff" ? 2 : 2.6;
      ctx.beginPath(); ctx.moveTo(l.x1, l.y1); ctx.lineTo(l.x2, l.y2); ctx.stroke();
      ctx.restore();
    }
  }

  function drawParticles() {
    for (const p of particles) {
      const alpha = Math.max(0, Math.min(1, p.life / p.maxLife));
      ctx.fillStyle = `hsla(${p.hue},92%,70%,${alpha})`;
      ctx.fillRect(p.x, p.y, p.size, p.size);
    }
    for (const s of shockwaves) {
      ctx.save();
      ctx.globalAlpha = s.alpha;
      ctx.strokeStyle = s.color || "#79ecff";
      ctx.lineWidth = s.color ? 2.3 : 1.4;
      ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, TAU); ctx.stroke();
      ctx.restore();
    }
  }

  function drawPowerStatus() {
    const effects = [];
    if (isCombo2()) effects.push({ label: "COMBO ×2", remaining: state.combo2Until - state.elapsed, color: "#facc15" });
    if (isSlow()) effects.push({ label: "CÂMERA LENTA", remaining: state.slowUntil - state.elapsed, color: "#93c5fd" });
    if (!effects.length) return;

    ctx.save();
    ctx.font = "800 11px ui-sans-serif, system-ui, sans-serif";
    ctx.textAlign = "right";
    let y = 112;
    for (const effect of effects) {
      const text = `${effect.label} • ${Math.max(0, effect.remaining).toFixed(1)}s`;
      const w = ctx.measureText(text).width + 20;
      ctx.fillStyle = "rgba(5,10,27,.76)";
      roundRect(ctx, width - w - 18, y - 14, w, 26, 10);
      ctx.fill();
      ctx.strokeStyle = effect.color;
      ctx.globalAlpha = 0.55;
      ctx.stroke();
      ctx.globalAlpha = 1;
      ctx.fillStyle = effect.color;
      ctx.fillText(text, width - 28, y);
      y += 32;
    }
    ctx.restore();
  }

  function loop(now) {
    const dt = Math.min((now - lastTime) / 1000, 0.05);
    lastTime = now;
    update(dt);
    draw();
    animationId = requestAnimationFrame(loop);
  }

  function showToast(text) {
    ui.toast.textContent = text;
    ui.toast.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => ui.toast.classList.remove("show"), 1550);
  }

  function ensureAudio() {
    if (!audio) audio = new (window.AudioContext || window.webkitAudioContext)();
    if (audio.state === "suspended") audio.resume();
  }

  function tone(freq, duration, volume = 0.035, type = "sine", slide = 0) {
    if (muted) return;
    ensureAudio();
    const t = audio.currentTime, osc = audio.createOscillator(), gain = audio.createGain();
    osc.type = type; osc.frequency.setValueAtTime(freq, t);
    if (slide) osc.frequency.exponentialRampToValueAtTime(Math.max(30, freq + slide), t + duration);
    gain.gain.setValueAtTime(volume, t);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + duration);
    osc.connect(gain); gain.connect(audio.destination); osc.start(t); osc.stop(t + duration);
  }

  function sfx(name) {
    if (muted) return;
    try {
      if (name === "type") tone(500 + Math.random() * 80, 0.055, 0.018, "square", 170);
      else if (name === "error") tone(145, 0.08, 0.025, "sawtooth", -50);
      else if (name === "destroy") { tone(260, 0.12, 0.025, "triangle", 180); setTimeout(() => tone(520, 0.08, 0.018, "sine", 140), 35); }
      else if (name === "damage") tone(110, 0.26, 0.045, "sawtooth", -45);
      else if (name === "level") { tone(420, 0.1, 0.028, "triangle", 160); setTimeout(() => tone(620, 0.15, 0.025, "triangle", 220), 90); }
      else if (name === "start") { tone(330, 0.12, 0.02, "sine", 180); setTimeout(() => tone(620, 0.18, 0.02, "sine", 280), 100); }
      else if (name === "bonusAppear") { tone(520, 0.12, 0.025, "triangle", 220); setTimeout(() => tone(780, 0.16, 0.022, "sine", 180), 100); }
      else if (name === "bonus") { tone(440, 0.14, 0.03, "triangle", 260); setTimeout(() => tone(720, 0.18, 0.028, "triangle", 260), 90); setTimeout(() => tone(980, 0.24, 0.024, "sine", 260), 190); }
      else if (name === "bonusMiss") tone(220, 0.16, 0.018, "triangle", -70);
      else if (name === "bossAppear") { tone(130, 0.34, 0.042, "sawtooth", -35); setTimeout(() => tone(195, 0.3, 0.032, "triangle", 95), 230); }
      else if (name === "boss") { tone(180, 0.18, 0.04, "sawtooth", 220); setTimeout(() => tone(480, 0.24, 0.032, "triangle", 300), 120); setTimeout(() => tone(820, 0.35, 0.026, "sine", 240), 280); }
      else if (name === "bossMiss") tone(95, 0.45, 0.045, "sawtooth", -35);
      else if (name === "gameover") tone(240, 0.5, 0.035, "triangle", -150);
    } catch (_) {}
  }

  typingInput.addEventListener("input", () => {
    const value = typingInput.value;
    typingInput.value = "";
    if (state.mode !== "playing") return;
    for (const char of [...value]) {
      if (char !== " " && char !== "\n" && char !== "\r") processKey(char);
    }
  });

  window.addEventListener("keydown", (event) => {
    if (event.code === "Space") {
      event.preventDefault();
      togglePause();
      return;
    }
    if (event.ctrlKey || event.metaKey || event.altKey) return;

    if (event.key === "Backspace" && state.mode === "playing" && state.target) {
      event.preventDefault();
      state.target.typed = 0;
      state.streak = 0;
      typingInput.value = "";
      showToast(state.target.kind === "boss" ? "FRASE REINICIADA" : "PALAVRA REINICIADA");
      updateHud();
      focusTypingInput();
      return;
    }

    if (event.key.length === 1 && document.activeElement !== typingInput) {
      event.preventDefault();
      processKey(event.key);
      setTimeout(focusTypingInput, 0);
    }
  }, { passive: false });

  window.addEventListener("blur", () => { if (state.mode === "playing") togglePause(true); });
  window.addEventListener("resize", resize);
  canvas.addEventListener("pointerdown", () => setTimeout(focusTypingInput, 0));

  difficultyButtons.forEach((button) => button.addEventListener("click", () => setDifficulty(button.dataset.difficulty)));
  ui.startBtn.addEventListener("click", resetGame);
  ui.restartBtn.addEventListener("click", resetGame);
  ui.resumeBtn.addEventListener("click", () => togglePause(false));
  ui.pauseBtn.addEventListener("click", () => togglePause());
  ui.soundBtn.addEventListener("click", () => {
    muted = !muted;
    ui.soundBtn.classList.toggle("muted", muted);
    ui.soundBtn.textContent = muted ? "×" : "♪";
    if (!muted) sfx("type");
    setTimeout(focusTypingInput, 0);
  });

  updateDifficultyUi();
  resize();
  updateHud();
  cancelAnimationFrame(animationId);
  animationId = requestAnimationFrame(loop);
})();
