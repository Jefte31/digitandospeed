(() => {
  "use strict";

  const nativeSort = Array.prototype.sort;

  Array.prototype.sort = function (compareFn) {
    const isTargetList = this.length > 1 && this.every((item) => (
      item &&
      typeof item === "object" &&
      typeof item.word === "string" &&
      typeof item.y === "number" &&
      typeof item.kind === "string"
    ));

    if (isTargetList) {
      return nativeSort.call(this, (a, b) => b.y - a.y);
    }

    return nativeSort.call(this, compareFn);
  };

  document.addEventListener("keydown", (event) => {
    if (event.target?.id === "commanderName") event.stopPropagation();
  });

  if (!document.querySelector('link[href="ranking.css"]')) {
    const style = document.createElement("link");
    style.rel = "stylesheet";
    style.href = "ranking.css";
    document.head.appendChild(style);
  }

  if (!document.querySelector('link[href="compact-menu.css"]')) {
    const style = document.createElement("link");
    style.rel = "stylesheet";
    style.href = "compact-menu.css";
    document.head.appendChild(style);
  }

  if (!document.querySelector('script[src="ranking.js"]')) {
    const script = document.createElement("script");
    script.src = "ranking.js";
    document.body.appendChild(script);
  }

  if (!document.querySelector('script[src="compact-menu.js"]')) {
    const script = document.createElement("script");
    script.src = "compact-menu.js";
    document.body.appendChild(script);
  }
})();
