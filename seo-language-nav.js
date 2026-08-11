(() => {
  "use strict";

  const KEY = "digitandoSpeedLanguage";
  const pages = { pt: "index.html", en: "en.html", fr: "fr.html", es: "es.html" };
  const path = location.pathname.toLowerCase();
  if (path.includes("numpad")) return;

  const current = path.split("/").pop() || "index.html";
  const currentPage = current === "" ? "index.html" : current;
  const lang = localStorage.getItem(KEY) || "pt";
  const expected = pages[lang] || pages.pt;

  if (Object.values(pages).includes(currentPage) && currentPage !== expected) {
    location.replace(new URL(expected, location.href).href);
    return;
  }

  document.addEventListener("click", (event) => {
    const button = event.target.closest?.("[data-language]");
    if (!button) return;
    const next = button.dataset.language;
    if (!pages[next]) return;
    event.preventDefault();
    event.stopImmediatePropagation();
    localStorage.setItem(KEY, next);
    location.href = new URL(pages[next], location.href).href;
  }, true);
})();
