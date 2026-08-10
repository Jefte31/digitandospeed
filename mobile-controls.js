(() => {
  "use strict";

  const touchDevice = (navigator.maxTouchPoints || 0) > 0 && (
    window.matchMedia?.("(pointer: coarse)").matches ||
    window.matchMedia?.("(hover: none)").matches ||
    Math.min(screen.width || innerWidth, screen.height || innerHeight) <= 1024
  );

  window.DS_MOBILE = Boolean(touchDevice);
  if (!touchDevice) return;

  const isNumpad = location.pathname.toLowerCase().includes("numpad");
  const lang = localStorage.getItem("digitandoSpeedLanguage") || "pt";
  const labels = {
    pt: { keyboard: "TECLADO", open: "Abrir teclado", close: "Fechar teclado" },
    en: { keyboard: "KEYBOARD", open: "Open keyboard", close: "Close keyboard" },
    fr: { keyboard: "CLAVIER", open: "Ouvrir le clavier", close: "Fermer le clavier" },
    es: { keyboard: "TECLADO", open: "Abrir teclado", close: "Cerrar teclado" }
  };
  const copy = labels[lang] || labels.pt;

  document.documentElement.classList.add("ds-touch");

  const nativeFocus = HTMLInputElement.prototype.focus;
  HTMLInputElement.prototype.focus = function (...args) {
    if (this.getAttribute("aria-hidden") === "true" && this.id !== "dsMobileKeyboardInput") return;
    return nativeFocus.apply(this, args);
  };

  const input = document.createElement("input");
  input.id = "dsMobileKeyboardInput";
  input.type = "text";
  input.inputMode = isNumpad ? "numeric" : "text";
  input.autocomplete = "off";
  input.autocapitalize = "off";
  input.spellcheck = false;
  input.setAttribute("aria-label", copy.keyboard);
  input.setAttribute("enterkeyhint", "done");
  input.className = "ds-mobile-keyboard-input";
  document.body.appendChild(input);

  const button = document.createElement("button");
  button.id = "keyboardBtn";
  button.type = "button";
  button.className = "icon-button mobile-keyboard-button";
  button.innerHTML = `<span aria-hidden="true">⌨</span><strong>${copy.keyboard}</strong>`;
  button.title = copy.open;
  button.setAttribute("aria-label", copy.open);

  const sound = document.getElementById("soundBtn");
  const status = document.querySelector(".status-bar");
  if (status) status.insertBefore(button, sound || null);

  function viewport() {
    const vv = window.visualViewport;
    const width = Math.round(vv?.width || window.innerWidth);
    const height = Math.round(vv?.height || window.innerHeight);
    return { width: Math.max(280, width), height: Math.max(260, height) };
  }

  window.DS_getGameViewport = viewport;

  let lastW = 0;
  let lastH = 0;
  function publishViewport() {
    const size = viewport();
    document.documentElement.style.setProperty("--ds-game-width", `${size.width}px`);
    document.documentElement.style.setProperty("--ds-game-height", `${size.height}px`);
    if (size.width !== lastW || size.height !== lastH) {
      lastW = size.width;
      lastH = size.height;
      window.dispatchEvent(new Event("dsviewportchange"));
    }
  }

  function setKeyboardState(open) {
    document.documentElement.classList.toggle("ds-keyboard-open", open);
    button.classList.toggle("active", open);
    button.title = open ? copy.close : copy.open;
    button.setAttribute("aria-label", open ? copy.close : copy.open);
    publishViewport();
  }

  function openKeyboard() {
    input.value = "";
    try { nativeFocus.call(input, { preventScroll: true }); } catch (_) { nativeFocus.call(input); }
    setKeyboardState(true);
  }

  function closeKeyboard() {
    input.blur();
    setKeyboardState(false);
  }

  button.addEventListener("click", (event) => {
    event.preventDefault();
    if (document.activeElement === input) closeKeyboard();
    else openKeyboard();
  });

  input.addEventListener("focus", () => {
    setKeyboardState(true);
    setTimeout(publishViewport, 60);
    setTimeout(publishViewport, 280);
  });

  input.addEventListener("blur", () => {
    setTimeout(() => {
      if (document.activeElement !== input) setKeyboardState(false);
      publishViewport();
    }, 120);
  });

  input.addEventListener("keydown", (event) => {
    event.stopPropagation();
    if (event.key === "Backspace") {
      event.preventDefault();
      window.dispatchEvent(new KeyboardEvent("keydown", { key: "Backspace", bubbles: true, cancelable: true }));
    }
  });

  input.addEventListener("input", () => {
    const value = input.value;
    input.value = "";
    for (const char of [...value]) {
      if (char === "\n" || char === "\r") continue;
      if (isNumpad && !/^[0-9]$/.test(char)) continue;
      window.dispatchEvent(new KeyboardEvent("keydown", { key: char, bubbles: true, cancelable: true }));
    }
  });

  window.visualViewport?.addEventListener("resize", publishViewport);
  window.visualViewport?.addEventListener("scroll", publishViewport);
  window.addEventListener("orientationchange", () => setTimeout(publishViewport, 120));

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) closeKeyboard();
  });

  publishViewport();
})();
