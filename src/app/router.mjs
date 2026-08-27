export function createRouter({ routes, fallback = "home", windowRef = window }) {
  const subscribers = new Set();
  const normalize = (value) => routes.includes(value) ? value : fallback;
  const fromLocation = () => normalize(windowRef.location.hash.replace(/^#\/?/, "") || fallback);
  let current = fromLocation();

  const notify = () => subscribers.forEach((subscriber) => subscriber(current));
  const onPopState = () => {
    current = fromLocation();
    notify();
  };
  windowRef.addEventListener("popstate", onPopState);

  return {
    get current() { return current; },
    go(route, { replace = false } = {}) {
      const next = normalize(route);
      if (next === current) return;
      current = next;
      const url = next === fallback
        ? `${windowRef.location.pathname}${windowRef.location.search}`
        : `#/${next}`;
      windowRef.history[replace ? "replaceState" : "pushState"]({ route: next }, "", url);
      notify();
    },
    subscribe(subscriber) {
      subscribers.add(subscriber);
      subscriber(current);
      return () => subscribers.delete(subscriber);
    },
    destroy() {
      windowRef.removeEventListener("popstate", onPopState);
      subscribers.clear();
    }
  };
}
