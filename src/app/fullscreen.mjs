export function createFullscreenService(documentRef = document) {
  const subscribers = new Set();
  const isActive = () => Boolean(documentRef.fullscreenElement || documentRef.webkitFullscreenElement);
  const notify = () => subscribers.forEach((subscriber) => subscriber(isActive()));

  documentRef.addEventListener("fullscreenchange", notify);
  documentRef.addEventListener("webkitfullscreenchange", notify);

  return {
    isActive,
    async toggle() {
      try {
        if (isActive()) {
          if (documentRef.exitFullscreen) await documentRef.exitFullscreen();
          else documentRef.webkitExitFullscreen?.();
        } else {
          const root = documentRef.documentElement;
          if (root.requestFullscreen) await root.requestFullscreen({ navigationUI: "hide" });
          else root.webkitRequestFullscreen?.();
        }
      } catch (error) {
        console.warn("Fullscreen request failed", error);
      }
    },
    subscribe(subscriber) {
      subscribers.add(subscriber);
      subscriber(isActive());
      return () => subscribers.delete(subscriber);
    }
  };
}
