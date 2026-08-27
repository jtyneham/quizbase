export class Lifecycle {
  #cleanups = [];

  add(cleanup) {
    if (typeof cleanup === "function") this.#cleanups.push(cleanup);
    return cleanup;
  }

  listen(target, type, listener, options) {
    target.addEventListener(type, listener, options);
    return this.add(() => target.removeEventListener(type, listener, options));
  }

  interval(callback, milliseconds) {
    const id = window.setInterval(callback, milliseconds);
    return this.add(() => window.clearInterval(id));
  }

  timeout(callback, milliseconds) {
    const id = window.setTimeout(callback, milliseconds);
    return this.add(() => window.clearTimeout(id));
  }

  clear() {
    for (const cleanup of this.#cleanups.splice(0).reverse()) {
      try { cleanup(); } catch (error) { console.warn(error); }
    }
  }
}
