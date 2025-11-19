self.addEventListener("install", () => {
  // eslint-disable-next-line no-console
  console.log("[Service Worker] Installed");
  self.skipWaiting();
});

self.addEventListener("activate", () => {
  // eslint-disable-next-line no-console
  console.log("[Service Worker] Activated");
});

self.addEventListener("fetch", (event) => {});
