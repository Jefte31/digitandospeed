(() => {
  "use strict";

  const KEY = "digitandoSpeedLanguage";
  const LANGS = {
    pt: "pt-BR",
    en: "en",
    fr: "fr",
    es: "es"
  };

  let lang = localStorage.getItem(KEY) || "pt";
  if (!LANGS[lang]) lang = "pt";

  window.DS_LANGUAGE = lang;
  document.documentElement.lang = LANGS[lang];

  // Garante que o motor receba o banco correto ANTES de iniciar.
  if (window.DIGITANDO_WORDS_BY_LANGUAGE) {
    window.DIGITANDO_WORDS =
      window.DIGITANDO_WORDS_BY_LANGUAGE[lang] ||
      window.DIGITANDO_WORDS_BY_LANGUAGE.pt;
  }

  const isNumpad = location.pathname.toLowerCase().includes("numpad");
  document.title = isNumpad ? "DIGITSPEED • Numpad" : "DIGITSPEED";

  const brand = document.querySelector(".brand div");
  if (brand) brand.innerHTML = "<strong>DIGIT</strong><span>SPEED</span>";

  const heroTitle = document.querySelector("#startScreen h1");
  if (heroTitle) heroTitle.innerHTML = "DIGIT<span>SPEED</span>";
})();
