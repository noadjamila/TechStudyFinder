self.addEventListener("install", () => {
  // eslint-disable-next-line no-console
  console.log("[Service Worker] Installed");
  self.skipWaiting();
});

self.addEventListener("activate", () => {
  // eslint-disable-next-line no-console
  console.log("[Service Worker] Activated");
});

// Uncomment when implementing fetch caching/offline functionality
// self.addEventListener("fetch", (event) => {
//   // Implementation for caching and offline support
// });
