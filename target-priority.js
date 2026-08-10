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
})();
