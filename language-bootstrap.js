(() => {
  "use strict";

  const KEY = "digitandoSpeedLanguage";
  const LANGS = {
    pt: { html: "pt-BR", code: "PT-BR" },
    en: { html: "en", code: "EN" },
    fr: { html: "fr", code: "FR" },
    es: { html: "es", code: "ES" }
  };

  let lang = localStorage.getItem(KEY) || "pt";
  if (!LANGS[lang]) lang = "pt";

  window.DS_LANGUAGE = lang;
  document.documentElement.lang = LANGS[lang].html;

  // Garante que o motor receba o banco correto ANTES de iniciar.
  if (window.DIGITANDO_WORDS_BY_LANGUAGE) {
    const activeBank =
      window.DIGITANDO_WORDS_BY_LANGUAGE[lang] ||
      window.DIGITANDO_WORDS_BY_LANGUAGE.pt;
    window.DIGITANDO_WORDS = activeBank;
    window.DS_ACTIVE_WORDS = activeBank;
  }

  const isNumpad = location.pathname.toLowerCase().includes("numpad");
  // Páginas SEO usam títulos completos com "|". Não sobrescrever esses títulos.
  if (!document.title.includes("|")) {
    document.title = isNumpad ? "DIGITSPEED • Numpad" : "DIGITSPEED";
  }

  const brand = document.querySelector(".brand div");
  if (brand) brand.innerHTML = "<strong>DIGIT</strong><span>SPEED</span>";

  const heroTitle = document.querySelector("#startScreen h1");
  if (heroTitle) heroTitle.innerHTML = "DIGIT<span>SPEED</span>";

  if (!isNumpad) {
    const languageBadge = document.querySelector("#startScreen .feature-grid > div:first-child strong");
    if (languageBadge) languageBadge.textContent = LANGS[lang].code;
  }
})();
