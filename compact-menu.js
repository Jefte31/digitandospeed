(() => {
  "use strict";

  const startBtn = document.getElementById("startBtn");
  if (!startBtn || document.getElementById("compactStartControls")) return;

  const path = location.pathname.toLowerCase();
  const isNumpad = path.includes("numpad");
  const lang = localStorage.getItem("digitandoSpeedLanguage") || "pt";
  const pages = { pt: "index.html", en: "en.html", fr: "fr.html", es: "es.html" };
  const difficultyKey = isNumpad ? "digitandoSpeedNumpadDifficulty" : "digitandoSpeedDifficulty";
  const currentDifficulty = localStorage.getItem(difficultyKey) || "medium";

  const copy = {
    pt: {
      language: "IDIOMA", training: "TREINO", difficulty: "DIFICULDADE",
      words: "Palavras", numpad: "Numpad",
      easy: "Fácil", medium: "Médio", hard: "Difícil", extreme: "Extremo"
    },
    en: {
      language: "LANGUAGE", training: "TRAINING", difficulty: "DIFFICULTY",
      words: "Words", numpad: "Numpad",
      easy: "Easy", medium: "Medium", hard: "Hard", extreme: "Extreme"
    },
    fr: {
      language: "LANGUE", training: "ENTRAÎNEMENT", difficulty: "DIFFICULTÉ",
      words: "Mots", numpad: "Pavé num.",
      easy: "Facile", medium: "Moyen", hard: "Difficile", extreme: "Extrême"
    },
    es: {
      language: "IDIOMA", training: "ENTRENAMIENTO", difficulty: "DIFICULTAD",
      words: "Palabras", numpad: "Numpad",
      easy: "Fácil", medium: "Medio", hard: "Difícil", extreme: "Extremo"
    }
  };
  const t = copy[lang] || copy.pt;

  const controls = document.createElement("div");
  controls.id = "compactStartControls";
  controls.className = "compact-start-controls";
  controls.innerHTML = `
    <div class="compact-select-field">
      <label for="compactLanguage">${t.language}</label>
      <div class="compact-select-wrap">
        <select id="compactLanguage" class="compact-select" aria-label="${t.language}">
          <option value="pt">Português</option>
          <option value="en">English</option>
          <option value="fr">Français</option>
          <option value="es">Español</option>
        </select>
      </div>
    </div>
    <div class="compact-select-field">
      <label for="compactTraining">${t.training}</label>
      <div class="compact-select-wrap">
        <select id="compactTraining" class="compact-select" aria-label="${t.training}">
          <option value="words">${t.words}</option>
          <option value="numpad">${t.numpad}</option>
        </select>
      </div>
    </div>
    <div class="compact-select-field">
      <label for="compactDifficulty">${t.difficulty}</label>
      <div class="compact-select-wrap">
        <select id="compactDifficulty" class="compact-select" aria-label="${t.difficulty}">
          <option value="easy">${t.easy}</option>
          <option value="medium">${t.medium}</option>
          <option value="hard">${t.hard}</option>
          <option value="extreme">${t.extreme}</option>
        </select>
      </div>
    </div>`;

  const commander = document.getElementById("commanderName")?.closest(".commander-box");
  (commander || startBtn).insertAdjacentElement("beforebegin", controls);

  const languageSelect = document.getElementById("compactLanguage");
  const trainingSelect = document.getElementById("compactTraining");
  const difficultySelect = document.getElementById("compactDifficulty");

  languageSelect.value = pages[lang] ? lang : "pt";
  trainingSelect.value = isNumpad ? "numpad" : "words";
  difficultySelect.value = ["easy", "medium", "hard", "extreme"].includes(currentDifficulty) ? currentDifficulty : "medium";

  languageSelect.addEventListener("change", () => {
    const next = languageSelect.value;
    if (!pages[next]) return;
    localStorage.setItem("digitandoSpeedLanguage", next);
    const destination = isNumpad ? "numpad.html" : pages[next];
    location.href = new URL(destination, location.href).href;
  });

  trainingSelect.addEventListener("change", () => {
    if (trainingSelect.value === (isNumpad ? "numpad" : "words")) return;
    const activeLang = localStorage.getItem("digitandoSpeedLanguage") || "pt";
    const destination = trainingSelect.value === "numpad" ? "numpad.html" : (pages[activeLang] || pages.pt);
    location.href = new URL(destination, location.href).href;
  });

  difficultySelect.addEventListener("change", () => {
    const next = difficultySelect.value;
    localStorage.setItem(difficultyKey, next);
    const button = document.querySelector(`.difficulty-btn[data-difficulty="${next}"]`);
    button?.click();
  });

  document.querySelectorAll(".difficulty-btn[data-difficulty]").forEach((button) => {
    button.addEventListener("click", () => {
      if (button.dataset.difficulty) difficultySelect.value = button.dataset.difficulty;
    });
  });
})();
