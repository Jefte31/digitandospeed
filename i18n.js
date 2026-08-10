(() => {
  "use strict";

  const KEY = "digitandoSpeedLanguage";
  const LANGS = {
    pt: { label: "Português", short: "PT-BR", html: "pt-BR" },
    en: { label: "English", short: "EN", html: "en" },
    fr: { label: "Français", short: "FR", html: "fr" },
    es: { label: "Español", short: "ES", html: "es" }
  };
  let lang = localStorage.getItem(KEY) || "pt";
  if (!LANGS[lang]) lang = "pt";
  const modality = location.pathname.toLowerCase().includes("numpad") ? "numpad" : "words";

  const T = {
    pt: {
      points:"PONTOS", level:"NÍVEL", metric:"PPM", accuracy:"PRECISÃO", shield:"ESCUDO", combo:"COMBO", training:"TREINO", mode:"MODO",
      words:"Palavras", wordsUpper:"PALAVRAS", numpad:"NUMPAD", language:"IDIOMA", chooseTraining:"ESCOLHA O TIPO DE TREINO", trainingType:"TIPO DE TREINO", chooseDifficulty:"ESCOLHA A DIFICULDADE",
      easy:"Fácil", medium:"Médio", hard:"Difícil", extreme:"Extremo", easyDesc:"Mais tempo para digitar", mediumDesc:"Experiência padrão", hardDesc:"Mais rápido e intenso", extremeDesc:"Para digitadores velozes",
      heroWords:"TREINE • ACELERE • DOMINE", leadWords:"Destrua as ameaças digitando as palavras antes que elas alcancem sua nave.", vocab:"Vocabulário brasileiro", progressive:"Dificuldade progressiva", realtime:"Velocidade em tempo real", precisionCombo:"Precisão e combo",
      wordsDesc:"Letras, acentos e frases", numpadDesc:"Teclado numérico 0–9", startWords:"INICIAR MISSÃO", tipWords:'Comece digitando qualquer palavra • <kbd>Tab</kbd> pausa/continua • <kbd>Espaço</kbd> faz parte das frases • <kbd>Backspace</kbd> reinicia o alvo', localRecord:"Recorde local:",
      heroNumpad:"TREINO DO TECLADO NUMÉRICO", leadNumpad:"Destrua as sequências usando apenas os números de 0 a 9 antes que elas alcancem sua nave.", numericKeyboard:"Teclado numérico", moreDigits:"Mais dígitos por nível", bonusBoss:"Bônus e chefões", backWords:"Voltar ao treino de palavras", nums09:"Números de 0 a 9", easyNum:"1–2 dígitos no início", mediumNum:"Sequências progressivas", hardNum:"Sequências maiores", extremeNum:"Alta velocidade numérica", startNumpad:"INICIAR TREINO NUMÉRICO", tipNumpad:'Digite apenas <kbd>0–9</kbd> • <kbd>Tab</kbd> pausa/continua • <kbd>Backspace</kbd> reinicia o alvo', numpadRecord:"Recorde Numpad:",
      pausedEyebrow:"MISSÃO SUSPENSA", pausedNumpad:"TREINO SUSPENSO", paused:"Jogo pausado", progressSafe:"Seu progresso está seguro.", continue:"CONTINUAR", backMenu:"VOLTAR AO MENU",
      ended:"MISSÃO ENCERRADA", endedNumpad:"TREINO ENCERRADO", gameOver:"Fim de jogo", score:"PONTUAÇÃO", newRecord:"NOVO RECORDE!", newRecordNumpad:"NOVO RECORDE NUMPAD!", playAgain:"JOGAR NOVAMENTE",
      commander:"COMANDANTE DA MISSÃO", commanderPlaceholder:"Digite o nome do jogador", commanderError:"Informe o nome do comandante para iniciar.", ranking:"🏆 VER RANKING", history:"HISTÓRICO DE DESEMPENHO", rankingWords:"Ranking Palavras", rankingNumpad:"Ranking Numpad", rankingSubtitle:"Melhores comandantes deste navegador, separados por dificuldade e nível alcançado.", filterLevel:"FILTRAR POR NÍVEL ALCANÇADO", allLevels:"Todos os níveis", commanderCol:"Comandante", rankingNote:"Ranking local: nomes e resultados ficam salvos somente neste navegador.", anonymous:"Anônimo",
      sound:"Som", pauseTitle:"Pausar (Tab)"
    },
    en: {
      points:"POINTS", level:"LEVEL", metric:"WPM", accuracy:"ACCURACY", shield:"SHIELD", combo:"COMBO", training:"TRAINING", mode:"MODE",
      words:"Words", wordsUpper:"WORDS", numpad:"NUMPAD", language:"LANGUAGE", chooseTraining:"CHOOSE TRAINING TYPE", trainingType:"TRAINING TYPE", chooseDifficulty:"CHOOSE DIFFICULTY",
      easy:"Easy", medium:"Medium", hard:"Hard", extreme:"Extreme", easyDesc:"More time to type", mediumDesc:"Standard experience", hardDesc:"Faster and more intense", extremeDesc:"For fast typists",
      heroWords:"TRAIN • ACCELERATE • MASTER", leadWords:"Destroy the threats by typing the words before they reach your ship.", vocab:"English vocabulary", progressive:"Progressive difficulty", realtime:"Real-time speed", precisionCombo:"Accuracy and combo",
      wordsDesc:"Letters, accents and phrases", numpadDesc:"Numeric keypad 0–9", startWords:"START MISSION", tipWords:'Start typing any word • <kbd>Tab</kbd> pauses/resumes • <kbd>Space</kbd> is part of phrases • <kbd>Backspace</kbd> resets the target', localRecord:"Local record:",
      heroNumpad:"NUMERIC KEYPAD TRAINING", leadNumpad:"Destroy the sequences using only numbers 0 through 9 before they reach your ship.", numericKeyboard:"Numeric keypad", moreDigits:"More digits per level", bonusBoss:"Bonuses and bosses", backWords:"Back to word training", nums09:"Numbers 0 through 9", easyNum:"1–2 digits at first", mediumNum:"Progressive sequences", hardNum:"Longer sequences", extremeNum:"High numeric speed", startNumpad:"START NUMERIC TRAINING", tipNumpad:'Type only <kbd>0–9</kbd> • <kbd>Tab</kbd> pauses/resumes • <kbd>Backspace</kbd> resets the target', numpadRecord:"Numpad record:",
      pausedEyebrow:"MISSION PAUSED", pausedNumpad:"TRAINING PAUSED", paused:"Game paused", progressSafe:"Your progress is safe.", continue:"CONTINUE", backMenu:"BACK TO MENU",
      ended:"MISSION ENDED", endedNumpad:"TRAINING ENDED", gameOver:"Game over", score:"SCORE", newRecord:"NEW RECORD!", newRecordNumpad:"NEW NUMPAD RECORD!", playAgain:"PLAY AGAIN",
      commander:"MISSION COMMANDER", commanderPlaceholder:"Enter player name", commanderError:"Enter the commander's name to start.", ranking:"🏆 VIEW RANKING", history:"PERFORMANCE HISTORY", rankingWords:"Word Ranking", rankingNumpad:"Numpad Ranking", rankingSubtitle:"Best commanders on this browser, separated by difficulty and level reached.", filterLevel:"FILTER BY LEVEL REACHED", allLevels:"All levels", commanderCol:"Commander", rankingNote:"Local ranking: names and results are stored only in this browser.", anonymous:"Anonymous",
      sound:"Sound", pauseTitle:"Pause (Tab)"
    },
    fr: {
      points:"POINTS", level:"NIVEAU", metric:"MPM", accuracy:"PRÉCISION", shield:"BOUCLIER", combo:"COMBO", training:"ENTRAÎNEMENT", mode:"MODE",
      words:"Mots", wordsUpper:"MOTS", numpad:"PAVÉ NUM.", language:"LANGUE", chooseTraining:"CHOISISSEZ LE TYPE D'ENTRAÎNEMENT", trainingType:"TYPE D'ENTRAÎNEMENT", chooseDifficulty:"CHOISISSEZ LA DIFFICULTÉ",
      easy:"Facile", medium:"Moyen", hard:"Difficile", extreme:"Extrême", easyDesc:"Plus de temps pour taper", mediumDesc:"Expérience standard", hardDesc:"Plus rapide et intense", extremeDesc:"Pour les dactylos rapides",
      heroWords:"ENTRAÎNEZ • ACCÉLÉREZ • MAÎTRISEZ", leadWords:"Détruisez les menaces en tapant les mots avant qu'elles n'atteignent votre vaisseau.", vocab:"Vocabulaire français", progressive:"Difficulté progressive", realtime:"Vitesse en temps réel", precisionCombo:"Précision et combo",
      wordsDesc:"Lettres, accents et phrases", numpadDesc:"Pavé numérique 0–9", startWords:"DÉMARRER LA MISSION", tipWords:'Commencez à taper un mot • <kbd>Tab</kbd> pause/reprend • <kbd>Espace</kbd> fait partie des phrases • <kbd>Backspace</kbd> réinitialise la cible', localRecord:"Record local :",
      heroNumpad:"ENTRAÎNEMENT AU PAVÉ NUMÉRIQUE", leadNumpad:"Détruisez les séquences avec les chiffres de 0 à 9 avant qu'elles n'atteignent votre vaisseau.", numericKeyboard:"Pavé numérique", moreDigits:"Plus de chiffres par niveau", bonusBoss:"Bonus et boss", backWords:"Retour à l'entraînement des mots", nums09:"Chiffres de 0 à 9", easyNum:"1–2 chiffres au début", mediumNum:"Séquences progressives", hardNum:"Séquences plus longues", extremeNum:"Grande vitesse numérique", startNumpad:"DÉMARRER L'ENTRAÎNEMENT", tipNumpad:'Tapez seulement <kbd>0–9</kbd> • <kbd>Tab</kbd> pause/reprend • <kbd>Backspace</kbd> réinitialise la cible', numpadRecord:"Record pavé num. :",
      pausedEyebrow:"MISSION EN PAUSE", pausedNumpad:"ENTRAÎNEMENT EN PAUSE", paused:"Jeu en pause", progressSafe:"Votre progression est sauvegardée.", continue:"CONTINUER", backMenu:"RETOUR AU MENU",
      ended:"MISSION TERMINÉE", endedNumpad:"ENTRAÎNEMENT TERMINÉ", gameOver:"Fin de partie", score:"SCORE", newRecord:"NOUVEAU RECORD !", newRecordNumpad:"NOUVEAU RECORD NUMÉRIQUE !", playAgain:"REJOUER",
      commander:"COMMANDANT DE MISSION", commanderPlaceholder:"Entrez le nom du joueur", commanderError:"Entrez le nom du commandant pour commencer.", ranking:"🏆 VOIR LE CLASSEMENT", history:"HISTORIQUE DES PERFORMANCES", rankingWords:"Classement Mots", rankingNumpad:"Classement Pavé numérique", rankingSubtitle:"Meilleurs commandants de ce navigateur, classés par difficulté et niveau atteint.", filterLevel:"FILTRER PAR NIVEAU ATTEINT", allLevels:"Tous les niveaux", commanderCol:"Commandant", rankingNote:"Classement local : noms et résultats sont enregistrés uniquement dans ce navigateur.", anonymous:"Anonyme",
      sound:"Son", pauseTitle:"Pause (Tab)"
    },
    es: {
      points:"PUNTOS", level:"NIVEL", metric:"PPM", accuracy:"PRECISIÓN", shield:"ESCUDO", combo:"COMBO", training:"ENTRENAMIENTO", mode:"MODO",
      words:"Palabras", wordsUpper:"PALABRAS", numpad:"NUMPAD", language:"IDIOMA", chooseTraining:"ELIGE EL TIPO DE ENTRENAMIENTO", trainingType:"TIPO DE ENTRENAMIENTO", chooseDifficulty:"ELIGE LA DIFICULTAD",
      easy:"Fácil", medium:"Medio", hard:"Difícil", extreme:"Extremo", easyDesc:"Más tiempo para escribir", mediumDesc:"Experiencia estándar", hardDesc:"Más rápido e intenso", extremeDesc:"Para mecanógrafos veloces",
      heroWords:"ENTRENA • ACELERA • DOMINA", leadWords:"Destruye las amenazas escribiendo las palabras antes de que alcancen tu nave.", vocab:"Vocabulario español", progressive:"Dificultad progresiva", realtime:"Velocidad en tiempo real", precisionCombo:"Precisión y combo",
      wordsDesc:"Letras, acentos y frases", numpadDesc:"Teclado numérico 0–9", startWords:"INICIAR MISIÓN", tipWords:'Empieza escribiendo cualquier palabra • <kbd>Tab</kbd> pausa/continúa • <kbd>Espacio</kbd> forma parte de las frases • <kbd>Backspace</kbd> reinicia el objetivo', localRecord:"Récord local:",
      heroNumpad:"ENTRENAMIENTO DEL TECLADO NUMÉRICO", leadNumpad:"Destruye las secuencias usando solo los números del 0 al 9 antes de que alcancen tu nave.", numericKeyboard:"Teclado numérico", moreDigits:"Más dígitos por nivel", bonusBoss:"Bonos y jefes", backWords:"Volver al entrenamiento de palabras", nums09:"Números del 0 al 9", easyNum:"1–2 dígitos al inicio", mediumNum:"Secuencias progresivas", hardNum:"Secuencias más largas", extremeNum:"Alta velocidad numérica", startNumpad:"INICIAR ENTRENAMIENTO NUMÉRICO", tipNumpad:'Escribe solo <kbd>0–9</kbd> • <kbd>Tab</kbd> pausa/continúa • <kbd>Backspace</kbd> reinicia el objetivo', numpadRecord:"Récord Numpad:",
      pausedEyebrow:"MISIÓN EN PAUSA", pausedNumpad:"ENTRENAMIENTO EN PAUSA", paused:"Juego pausado", progressSafe:"Tu progreso está seguro.", continue:"CONTINUAR", backMenu:"VOLVER AL MENÚ",
      ended:"MISIÓN FINALIZADA", endedNumpad:"ENTRENAMIENTO FINALIZADO", gameOver:"Fin del juego", score:"PUNTUACIÓN", newRecord:"¡NUEVO RÉCORD!", newRecordNumpad:"¡NUEVO RÉCORD NUMPAD!", playAgain:"JUGAR DE NUEVO",
      commander:"COMANDANTE DE LA MISIÓN", commanderPlaceholder:"Escribe el nombre del jugador", commanderError:"Escribe el nombre del comandante para comenzar.", ranking:"🏆 VER RANKING", history:"HISTORIAL DE RENDIMIENTO", rankingWords:"Ranking de Palabras", rankingNumpad:"Ranking Numpad", rankingSubtitle:"Mejores comandantes de este navegador, separados por dificultad y nivel alcanzado.", filterLevel:"FILTRAR POR NIVEL ALCANZADO", allLevels:"Todos los niveles", commanderCol:"Comandante", rankingNote:"Ranking local: nombres y resultados se guardan solo en este navegador.", anonymous:"Anónimo",
      sound:"Sonido", pauseTitle:"Pausar (Tab)"
    }
  };

  const tr = (key) => T[lang]?.[key] ?? T.pt[key] ?? key;
  window.DS_LANGUAGE = lang;
  window.DS_T = tr;
  document.documentElement.lang = LANGS[lang].html;

  function setText(selector, text) {
    const el = document.querySelector(selector);
    if (el && text != null) el.textContent = text;
  }
  function setHTML(selector, html) {
    const el = document.querySelector(selector);
    if (el && html != null) el.innerHTML = html;
  }

  function injectLanguagePicker() {
    if (document.getElementById("languagePicker")) return;
    const hero = document.querySelector("#startScreen .hero-panel");
    if (!hero) return;
    const lead = hero.querySelector(".lead");
    const box = document.createElement("div");
    box.id = "languagePicker";
    box.className = "language-picker";
    box.innerHTML = `<p class="language-title">${tr("language")}</p><div class="language-options">${Object.entries(LANGS).map(([key, meta]) => `<button type="button" class="language-btn${key === lang ? " active" : ""}" data-language="${key}" aria-pressed="${key === lang}"><strong>${meta.short}</strong><span>${meta.label}</span></button>`).join("")}</div>`;
    lead?.insertAdjacentElement("afterend", box);
    box.querySelectorAll("[data-language]").forEach((button) => button.addEventListener("click", () => {
      const next = button.dataset.language;
      if (!LANGS[next] || next === lang) return;
      localStorage.setItem(KEY, next);
      location.reload();
    }));
  }

  function applyDifficultyOverlay() {
    const active = document.querySelector(".difficulty-btn.active")?.dataset.difficulty || "medium";
    const current = document.getElementById("currentDifficulty");
    if (!current) return;
    current.classList.add("localized-difficulty");
    current.dataset.display = tr(active);
  }

  function applyStatic() {
    setText(".hud-left .stat-score .label", tr("points"));
    setText(".hud-left .stat:not(.stat-score) .label", tr("level"));
    setText(".hud-right .stat:nth-child(1) .label", tr("metric"));
    setText(".hud-right .stat:nth-child(2) .label", tr("accuracy"));
    setText(".lives .label", tr("shield"));
    setText(".combo-wrap .label", tr("combo"));
    setText(".training-pill .label", tr("training"));
    setText(".difficulty-pill .label", tr("mode"));
    setText(".training-pill strong", modality === "numpad" ? tr("numpad") : tr("words"));
    const sound = document.getElementById("soundBtn"); if (sound) { sound.title = tr("sound"); sound.setAttribute("aria-label", tr("sound")); }
    const pause = document.getElementById("pauseBtn"); if (pause) { pause.title = tr("pauseTitle"); pause.setAttribute("aria-label", tr("pauseTitle")); }

    const hero = document.querySelector("#startScreen .hero-panel");
    if (hero) {
      setText("#startScreen .difficulty-picker .difficulty-title", tr("chooseDifficulty"));
      const db = [...document.querySelectorAll("#startScreen .difficulty-btn")];
      const order = ["easy","medium","hard","extreme"];
      db.forEach((b,i) => { const key = b.dataset.difficulty || order[i]; const strong=b.querySelector("strong"), span=b.querySelector("span"); if(strong) strong.textContent=tr(key); if(span) span.textContent=tr(modality === "numpad" ? ({easy:"easyNum",medium:"mediumNum",hard:"hardNum",extreme:"extremeNum"}[key]) : ({easy:"easyDesc",medium:"mediumDesc",hard:"hardDesc",extreme:"extremeDesc"}[key])); });
    }

    if (modality === "words") {
      setText("#startScreen .eyebrow", tr("heroWords"));
      setText("#startScreen .lead", tr("leadWords"));
      const f=[...document.querySelectorAll("#startScreen .feature-grid > div")];
      if(f[0]){f[0].querySelector("strong").textContent=LANGS[lang].short;f[0].querySelector("span").textContent=tr("vocab");}
      if(f[1])f[1].querySelector("span").textContent=tr("progressive");
      if(f[2]){f[2].querySelector("strong").textContent=tr("metric");f[2].querySelector("span").textContent=tr("realtime");}
      if(f[3])f[3].querySelector("span").textContent=tr("precisionCombo");
      setText("#startScreen .training-picker .difficulty-title", tr("chooseTraining"));
      const tb=[...document.querySelectorAll("#startScreen .training-btn")];
      if(tb[0]){tb[0].querySelector("strong").textContent=tr("wordsUpper");tb[0].querySelector("span").textContent=tr("wordsDesc");}
      if(tb[1]){tb[1].querySelector("strong").textContent=tr("numpad");tb[1].querySelector("span").textContent=tr("numpadDesc");}
      setText("#startBtn", tr("startWords"));
      setHTML("#startScreen .keyboard-tip", tr("tipWords"));
      const rec=document.querySelector("#startScreen .record"); if(rec){const value=document.getElementById("bestScore")?.textContent||"0";rec.innerHTML=`${tr("localRecord")} <strong id="bestScore">${value}</strong>`;}
    } else {
      setText("#startScreen .eyebrow", tr("heroNumpad"));
      setText("#startScreen .lead", tr("leadNumpad"));
      const f=[...document.querySelectorAll("#startScreen .feature-grid > div")];
      if(f[0])f[0].querySelector("span").textContent=tr("numericKeyboard");
      if(f[1])f[1].querySelector("span").textContent=tr("moreDigits");
      if(f[2]){f[2].querySelector("strong").textContent=tr("metric");f[2].querySelector("span").textContent=tr("realtime");}
      if(f[3])f[3].querySelector("span").textContent=tr("bonusBoss");
      setText("#startScreen .training-picker .difficulty-title", tr("trainingType"));
      const tb=[...document.querySelectorAll("#startScreen .training-btn")];
      if(tb[0]){tb[0].querySelector("strong").textContent=tr("wordsUpper");tb[0].querySelector("span").textContent=tr("backWords");}
      if(tb[1]){tb[1].querySelector("strong").textContent=tr("numpad");tb[1].querySelector("span").textContent=tr("nums09");}
      setText("#startBtn", tr("startNumpad"));
      setHTML("#startScreen .keyboard-tip", tr("tipNumpad"));
      const rec=document.querySelector("#startScreen .record"); if(rec){const value=document.getElementById("bestScore")?.textContent||"0";rec.innerHTML=`${tr("numpadRecord")} <strong id="bestScore">${value}</strong>`;}
    }

    setText("#pauseScreen .eyebrow", modality === "numpad" ? tr("pausedNumpad") : tr("pausedEyebrow"));
    setText("#pauseScreen h2", tr("paused")); setText("#pauseScreen p", tr("progressSafe")); setText("#resumeBtn", tr("continue"));
    const pauseBack=document.querySelector("#pauseScreen .secondary-button"); if(pauseBack) pauseBack.textContent=tr("backMenu");
    setText("#gameOverScreen .eyebrow", modality === "numpad" ? tr("endedNumpad") : tr("ended")); setText("#gameOverScreen h2", tr("gameOver"));
    const results=[...document.querySelectorAll("#gameOverScreen .results > div span")]; if(results[0])results[0].textContent=tr("score"); if(results[1])results[1].textContent=tr("metric"); if(results[2])results[2].textContent=tr("accuracy"); if(results[3])results[3].textContent=tr("level");
    setText("#newRecord", modality === "numpad" ? tr("newRecordNumpad") : tr("newRecord")); setText("#restartBtn", tr("playAgain"));
    const gameBack=document.querySelector("#gameOverScreen .secondary-button"); if(gameBack) gameBack.textContent=tr("backMenu");
    applyDifficultyOverlay();
  }

  function translateInjected() {
    const commanderLabel=document.querySelector(".commander-box label"); if(commanderLabel) commanderLabel.textContent=tr("commander");
    const ci=document.getElementById("commanderName"); if(ci) ci.placeholder=tr("commanderPlaceholder");
    setText("#commanderError",tr("commanderError"));
    document.querySelectorAll(".ranking-button").forEach(b=>b.textContent=tr("ranking"));
    setText("#rankingOverlay .eyebrow",tr("history")); setText("#rankingTitle",modality==="numpad"?tr("rankingNumpad"):tr("rankingWords")); setText("#rankingOverlay .ranking-subtitle",tr("rankingSubtitle")); setText("#rankingOverlay .ranking-filters label",tr("filterLevel")); setText("#rankingOverlay .ranking-note",tr("rankingNote"));
    document.querySelectorAll("[data-ranking-difficulty]").forEach(b=>b.textContent=tr(b.dataset.rankingDifficulty));
    const select=document.getElementById("rankingLevel"); if(select){[...select.options].forEach(o=>{if(o.value==="all")o.textContent=tr("allLevels");else o.textContent=`${tr("level")} ${o.value}`;});}
    const heads=[...document.querySelectorAll(".ranking-table th")]; if(heads.length>=6){heads[1].textContent=tr("commanderCol");heads[2].textContent=tr("level");heads[3].textContent=tr("points");heads[4].textContent=tr("metric");heads[5].textContent=tr("accuracy");}
    document.querySelectorAll(".ranking-table tbody tr").forEach(row=>{const cells=row.querySelectorAll("td");if(cells[1]&&cells[1].textContent.trim()==="Anônimo")cells[1].textContent=tr("anonymous");if(cells[2]){const m=cells[2].textContent.match(/\d+/);if(m)cells[2].textContent=`${tr("level")} ${m[0]}`;}});
    const empty=document.querySelector(".ranking-empty"); if(empty){const diff=document.querySelector("[data-ranking-difficulty].active")?.dataset.rankingDifficulty||"medium";const level=document.getElementById("rankingLevel")?.value||"all";const messages={pt:`Ainda não há partidas registradas em <strong>${tr(diff)}</strong>${level==="all"?"":` no nível ${level}`}. Jogue uma partida para inaugurar o ranking.`,en:`No runs recorded yet on <strong>${tr(diff)}</strong>${level==="all"?"":` at level ${level}`}. Play a match to start the ranking.`,fr:`Aucune partie enregistrée en <strong>${tr(diff)}</strong>${level==="all"?"":` au niveau ${level}`}. Jouez une partie pour inaugurer le classement.`,es:`Aún no hay partidas registradas en <strong>${tr(diff)}</strong>${level==="all"?"":` en el nivel ${level}`}. Juega una partida para inaugurar el ranking.`};empty.innerHTML=messages[lang];}
  }

  function dynamicMessage(text) {
    if (lang === "pt") return text;
    const d = T[lang];
    const diffMap={"FÁCIL":d.easy.toUpperCase(),"MÉDIO":d.medium.toUpperCase(),"DIFÍCIL":d.hard.toUpperCase(),"EXTREMO":d.extreme.toUpperCase()};
    let out=text;
    const simple = {
      "ERRO • FRASE LIBERADA": lang==="en"?"ERROR • PHRASE RELEASED":lang==="fr"?"ERREUR • PHRASE LIBÉRÉE":"ERROR • FRASE LIBERADA",
      "ERRO • ALVO LIBERADO": lang==="en"?"ERROR • TARGET RELEASED":lang==="fr"?"ERREUR • CIBLE LIBÉRÉE":"ERROR • OBJETIVO LIBERADO",
      "ERRO • SEQUÊNCIA LIBERADA": lang==="en"?"ERROR • SEQUENCE RELEASED":lang==="fr"?"ERREUR • SÉQUENCE LIBÉRÉE":"ERROR • SECUENCIA LIBERADA",
      "ERRO • NÚMERO LIBERADO": lang==="en"?"ERROR • NUMBER RELEASED":lang==="fr"?"ERREUR • NOMBRE LIBÉRÉ":"ERROR • NÚMERO LIBERADO",
      "PALAVRA REINICIADA":lang==="en"?"WORD RESET":lang==="fr"?"MOT RÉINITIALISÉ":"PALABRA REINICIADA",
      "FRASE REINICIADA":lang==="en"?"PHRASE RESET":lang==="fr"?"PHRASE RÉINITIALISÉE":"FRASE REINICIADA",
      "NÚMERO REINICIADO":lang==="en"?"NUMBER RESET":lang==="fr"?"NOMBRE RÉINITIALISÉ":"NÚMERO REINICIADO",
      "SEQUÊNCIA REINICIADA":lang==="en"?"SEQUENCE RESET":lang==="fr"?"SÉQUENCE RÉINITIALISÉE":"SECUENCIA REINICIADA",
      "ESCUDO DANIFICADO":lang==="en"?"SHIELD DAMAGED":lang==="fr"?"BOUCLIER ENDOMMAGÉ":"ESCUDO DAÑADO",
      "ESCUDO RESTAURADO!":lang==="en"?"SHIELD RESTORED!":lang==="fr"?"BOUCLIER RESTAURÉ !":"¡ESCUDO RESTAURADO!",
      "CHEFÃO DESTRUÍDO!":lang==="en"?"BOSS DESTROYED!":lang==="fr"?"BOSS DÉTRUIT !":"¡JEFE DESTRUIDO!",
      "BÔNUS DE LIMPEZA!":lang==="en"?"CLEAR BONUS!":lang==="fr"?"BONUS DE NETTOYAGE !":"¡BONO DE LIMPIEZA!"
    };
    if(simple[out]) return simple[out];
    Object.entries(diffMap).forEach(([a,b])=>{out=out.replace(a,b);});
    out=out.replace(/^NÍVEL (\d+)$/,`${d.level} $1`);
    out=out.replace(/^MISSÃO • /,lang==="en"?"MISSION • ":lang==="fr"?"MISSION • ":"MISIÓN • ");
    out=out.replace(/^BÔNUS • /,lang==="en"?"BONUS • ":lang==="fr"?"BONUS • ":"BONO • ");
    out=out.replace(/LIMPEZA TOTAL/g,lang==="en"?"TOTAL CLEAR":lang==="fr"?"NETTOYAGE TOTAL":"LIMPIEZA TOTAL");
    out=out.replace(/CÂMERA LENTA/g,lang==="en"?"SLOW MOTION":lang==="fr"?"RALENTI":"CÁMARA LENTA");
    out=out.replace(/ESCUDO/g,d.shield);
    out=out.replace(/CHEFÃO NUMÉRICO/g,lang==="en"?"NUMERIC BOSS":lang==="fr"?"BOSS NUMÉRIQUE":"JEFE NUMÉRICO");
    out=out.replace(/CHEFÃO/g,lang==="en"?"BOSS":lang==="fr"?"BOSS":"JEFE");
    out=out.replace(/NÍVEL/g,d.level);
    out=out.replace(/10 SEGUNDOS/g,lang==="en"?"10 SECONDS":lang==="fr"?"10 SECONDES":"10 SEGUNDOS");
    out=out.replace(/BÔNUS PERDIDO • MISSÃO CONTINUA/g,lang==="en"?"BONUS MISSED • MISSION CONTINUES":lang==="fr"?"BONUS MANQUÉ • LA MISSION CONTINUE":"BONO PERDIDO • LA MISIÓN CONTINÚA");
    out=out.replace(/BÔNUS PERDIDO • TREINO CONTINUA/g,lang==="en"?"BONUS MISSED • TRAINING CONTINUES":lang==="fr"?"BONUS MANQUÉ • L'ENTRAÎNEMENT CONTINUE":"BONO PERDIDO • EL ENTRENAMIENTO CONTINÚA");
    out=out.replace(/ESCAPOU/g,lang==="en"?"ESCAPED":lang==="fr"?"S'EST ÉCHAPPÉ":"ESCAPÓ");
    out=out.replace(/DANIFICADO/g,lang==="en"?"DAMAGED":lang==="fr"?"ENDOMMAGÉ":"DAÑADO");
    out=out.replace(/AMEAÇAS ELIMINADAS/g,lang==="en"?"THREATS ELIMINATED":lang==="fr"?"MENACES ÉLIMINÉES":"AMENAZAS ELIMINADAS");
    out=out.replace(/AMEAÇAS/g,lang==="en"?"THREATS":lang==="fr"?"MENACES":"AMENAZAS");
    out=out.replace(/ALVOS ELIMINADOS/g,lang==="en"?"TARGETS ELIMINATED":lang==="fr"?"CIBLES ÉLIMINÉES":"OBJETIVOS ELIMINADOS");
    out=out.replace(/ALVOS/g,lang==="en"?"TARGETS":lang==="fr"?"CIBLES":"OBJETIVOS");
    out=out.replace(/ATIVO/g,lang==="en"?"ACTIVE":lang==="fr"?"ACTIF":"ACTIVO");
    out=out.replace(/JÁ ESTAVA COMPLETO/g,lang==="en"?"WAS ALREADY FULL":lang==="fr"?"ÉTAIT DÉJÀ COMPLET":"YA ESTABA COMPLETO");
    out=out.replace(/COMPLETO/g,lang==="en"?"FULL":lang==="fr"?"COMPLET":"COMPLETO");
    return out;
  }

  function observeDynamic() {
    const toast=document.getElementById("toast");
    if(toast) new MutationObserver(()=>{const translated=dynamicMessage(toast.textContent);if(translated!==toast.textContent)toast.textContent=translated;}).observe(toast,{childList:true,subtree:true,characterData:true});
    new MutationObserver(()=>{applyDifficultyOverlay();translateInjected();}).observe(document.body,{childList:true,subtree:true,attributes:true,attributeFilter:["class"]});
    document.querySelectorAll(".difficulty-btn").forEach(b=>b.addEventListener("click",()=>setTimeout(applyDifficultyOverlay,0)));
  }

  const originalFillText=CanvasRenderingContext2D.prototype.fillText;
  CanvasRenderingContext2D.prototype.fillText=function(text,...args){return originalFillText.call(this,dynamicMessage(String(text)),...args);};

  injectLanguagePicker();
  applyStatic();
  translateInjected();
  observeDynamic();
})();
