(() => {
  "use strict";

  const modality = location.pathname.toLowerCase().includes("numpad") ? "numpad" : "words";
  const storageKey = modality === "numpad" ? "digitandoSpeedRankingNumpad" : "digitandoSpeedRankingWords";
  const commanderKey = "digitandoSpeedCommanderName";
  const labels = { easy: "Fácil", medium: "Médio", hard: "Difícil", extreme: "Extremo" };
  const labelToKey = { "Fácil": "easy", "Médio": "medium", "Difícil": "hard", "Extremo": "extreme" };
  let selectedDifficulty = "medium";
  let selectedLevel = "all";
  let gameOverWasVisible = false;

  const read = () => {
    try {
      const parsed = JSON.parse(localStorage.getItem(storageKey) || "[]");
      return Array.isArray(parsed) ? parsed : [];
    } catch (_) {
      return [];
    }
  };

  const write = (records) => {
    try { localStorage.setItem(storageKey, JSON.stringify(records.slice(-250))); } catch (_) {}
  };

  const numberFromText = (text) => Number(String(text || "0").replace(/\./g, "").replace(/,/g, ".").replace(/[^0-9.-]/g, "")) || 0;
  const normalizeCommander = (value) => String(value || "").trim().replace(/\s+/g, " ").slice(0, 28);
  const escapeHtml = (value) => String(value ?? "").replace(/[&<>'"]/g, (char) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;"
  })[char]);

  function currentDifficultyKey() {
    const text = document.getElementById("currentDifficulty")?.textContent?.trim();
    return labelToKey[text] || "medium";
  }

  function currentCommander() {
    const input = document.getElementById("commanderName");
    const name = normalizeCommander(input?.value || localStorage.getItem(commanderKey));
    return name || "Anônimo";
  }

  function persistCommander() {
    const input = document.getElementById("commanderName");
    if (!input) return "";
    const name = normalizeCommander(input.value);
    input.value = name;
    if (name) {
      localStorage.setItem(commanderKey, name);
      input.classList.remove("invalid");
      document.getElementById("commanderError")?.classList.remove("visible");
    }
    return name;
  }

  function saveCurrentRun() {
    const score = numberFromText(document.getElementById("finalScore")?.textContent);
    const ppm = numberFromText(document.getElementById("finalWpm")?.textContent);
    const accuracy = numberFromText(document.getElementById("finalAccuracy")?.textContent);
    const level = Math.max(1, Math.round(numberFromText(document.getElementById("finalLevel")?.textContent)));
    const difficulty = currentDifficultyKey();
    const commander = currentCommander();
    if (!score && !ppm && level <= 1) return;

    const record = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      commander,
      score: Math.round(score), ppm: Math.round(ppm), accuracy: Math.round(accuracy),
      level, difficulty, createdAt: Date.now()
    };
    const records = read();
    records.push(record);
    write(records);
  }

  function injectCommanderField() {
    const startBtn = document.getElementById("startBtn");
    if (!startBtn || document.getElementById("commanderName")) return;

    const box = document.createElement("div");
    box.className = "commander-box";
    box.innerHTML = `
      <label for="commanderName">COMANDANTE DA MISSÃO</label>
      <div class="commander-input-wrap">
        <span class="commander-icon">⌁</span>
        <input id="commanderName" class="commander-input" type="text" maxlength="28" autocomplete="name" spellcheck="false" placeholder="Digite o nome do jogador" />
      </div>
      <p id="commanderError" class="commander-error">Informe o nome do comandante para iniciar.</p>`;
    startBtn.insertAdjacentElement("beforebegin", box);

    const input = document.getElementById("commanderName");
    input.value = normalizeCommander(localStorage.getItem(commanderKey));
    input.addEventListener("input", () => {
      if (normalizeCommander(input.value)) {
        input.classList.remove("invalid");
        document.getElementById("commanderError")?.classList.remove("visible");
      }
    });
    input.addEventListener("change", persistCommander);
    input.addEventListener("blur", persistCommander);
  }

  function injectButtons() {
    const startBtn = document.getElementById("startBtn");
    if (startBtn && !document.querySelector(".ranking-launch")) {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "ranking-button ranking-launch";
      btn.textContent = "🏆 VER RANKING";
      btn.addEventListener("click", openRanking);
      startBtn.insertAdjacentElement("afterend", btn);
    }

    document.querySelectorAll(".panel-actions").forEach((actions) => {
      if (actions.querySelector(".ranking-button")) return;
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "ranking-button";
      btn.textContent = "🏆 VER RANKING";
      btn.addEventListener("click", openRanking);
      actions.insertBefore(btn, actions.lastElementChild || null);
    });
  }

  function injectOverlay() {
    if (document.getElementById("rankingOverlay")) return;
    const overlay = document.createElement("section");
    overlay.id = "rankingOverlay";
    overlay.className = "ranking-overlay";
    overlay.setAttribute("aria-hidden", "true");
    overlay.innerHTML = `
      <div class="ranking-panel" role="dialog" aria-modal="true" aria-labelledby="rankingTitle">
        <div class="ranking-head">
          <div>
            <div class="eyebrow">HISTÓRICO DE DESEMPENHO</div>
            <h2 id="rankingTitle">Ranking ${modality === "numpad" ? "Numpad" : "Palavras"}</h2>
            <p class="ranking-subtitle">Melhores comandantes deste navegador, separados por dificuldade e nível alcançado.</p>
          </div>
          <button id="rankingClose" class="ranking-close" type="button" aria-label="Fechar ranking">×</button>
        </div>
        <div class="ranking-difficulties">
          ${Object.entries(labels).map(([key, label]) => `<button type="button" class="ranking-diff${key === selectedDifficulty ? " active" : ""}" data-ranking-difficulty="${key}">${label}</button>`).join("")}
        </div>
        <div class="ranking-filters">
          <label for="rankingLevel">FILTRAR POR NÍVEL ALCANÇADO</label>
          <select id="rankingLevel" class="ranking-level"></select>
        </div>
        <div id="rankingContent"></div>
        <p class="ranking-note">Ranking local: nomes e resultados ficam salvos somente neste navegador.</p>
      </div>`;
    document.body.appendChild(overlay);

    document.getElementById("rankingClose").addEventListener("click", closeRanking);
    overlay.addEventListener("pointerdown", (event) => { if (event.target === overlay) closeRanking(); });
    document.querySelectorAll("[data-ranking-difficulty]").forEach((btn) => btn.addEventListener("click", () => {
      selectedDifficulty = btn.dataset.rankingDifficulty;
      selectedLevel = "all";
      document.querySelectorAll("[data-ranking-difficulty]").forEach((b) => b.classList.toggle("active", b === btn));
      renderRanking();
    }));
    document.getElementById("rankingLevel").addEventListener("change", (event) => {
      selectedLevel = event.target.value;
      renderTable();
    });
  }

  function sortedRecords() {
    return read()
      .filter((r) => r && r.difficulty === selectedDifficulty)
      .sort((a, b) => b.score - a.score || b.accuracy - a.accuracy || b.ppm - a.ppm || b.createdAt - a.createdAt);
  }

  function renderRanking() {
    const records = sortedRecords();
    const levels = [...new Set(records.map((r) => Number(r.level)).filter(Number.isFinite))].sort((a, b) => a - b);
    const select = document.getElementById("rankingLevel");
    select.innerHTML = `<option value="all">Todos os níveis</option>${levels.map((level) => `<option value="${level}">Nível ${level}</option>`).join("")}`;
    if (selectedLevel !== "all" && !levels.includes(Number(selectedLevel))) selectedLevel = "all";
    select.value = selectedLevel;
    renderTable();
  }

  function renderTable() {
    let records = sortedRecords();
    if (selectedLevel !== "all") records = records.filter((r) => Number(r.level) === Number(selectedLevel));
    records = records.slice(0, 10);
    const content = document.getElementById("rankingContent");
    if (!records.length) {
      content.innerHTML = `<div class="ranking-empty">Ainda não há partidas registradas em <strong>${labels[selectedDifficulty]}</strong>${selectedLevel === "all" ? "" : ` no nível ${selectedLevel}`}. Jogue uma partida para inaugurar o ranking.</div>`;
      return;
    }

    content.innerHTML = `<div class="ranking-table-wrap"><table class="ranking-table">
      <thead><tr><th>#</th><th>Comandante</th><th>Nível</th><th>Pontos</th><th>PPM</th><th>Precisão</th></tr></thead>
      <tbody>${records.map((r, i) => `<tr><td>${i + 1}</td><td class="ranking-commander">${escapeHtml(normalizeCommander(r.commander) || "Anônimo")}</td><td>Nível ${r.level}</td><td>${Number(r.score).toLocaleString("pt-BR")}</td><td>${r.ppm}</td><td>${r.accuracy}%</td></tr>`).join("")}</tbody>
    </table></div>`;
  }

  function openRanking() {
    selectedDifficulty = currentDifficultyKey();
    selectedLevel = "all";
    injectOverlay();
    document.querySelectorAll("[data-ranking-difficulty]").forEach((btn) => btn.classList.toggle("active", btn.dataset.rankingDifficulty === selectedDifficulty));
    renderRanking();
    const overlay = document.getElementById("rankingOverlay");
    overlay.classList.add("visible");
    overlay.setAttribute("aria-hidden", "false");
  }

  function closeRanking() {
    const overlay = document.getElementById("rankingOverlay");
    if (!overlay) return;
    overlay.classList.remove("visible");
    overlay.setAttribute("aria-hidden", "true");
  }

  function watchGameOver() {
    const gameOver = document.getElementById("gameOverScreen");
    if (!gameOver) return;
    const check = () => {
      const visible = gameOver.classList.contains("visible");
      if (visible && !gameOverWasVisible) saveCurrentRun();
      gameOverWasVisible = visible;
    };
    new MutationObserver(check).observe(gameOver, { attributes: true, attributeFilter: ["class"] });
    check();
  }

  document.addEventListener("click", (event) => {
    if (event.target?.id !== "startBtn") return;
    const name = persistCommander();
    if (name) return;

    event.preventDefault();
    event.stopImmediatePropagation();
    const input = document.getElementById("commanderName");
    input?.classList.add("invalid");
    document.getElementById("commanderError")?.classList.add("visible");
    input?.focus();
  }, true);

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && document.getElementById("rankingOverlay")?.classList.contains("visible")) {
      event.preventDefault();
      closeRanking();
    }
  });

  injectCommanderField();
  injectButtons();
  injectOverlay();
  watchGameOver();
})();
