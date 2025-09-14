// Define the cache name and version
const CACHE_NAME = "second-brain-cache-v1";

// Define the essential files to be cached when the app is first installed.
// Make sure the path to your main CSS file is correct.
const urlsToCache = [
  "/",
  "/css/style.css", // Example: if your CSS is at /css/main.css, change this.
];

// Fired when the Service Worker is installed
self.addEventListener("install", (event) => {
  // Open the cache and add the essential files.
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("Cache opened and core assets added.");
      return cache.addAll(urlsToCache);
    }),
  );
});

// Fired whenever a page or file is requested (fetch)
self.addEventListener("fetch", (event) => {
  event.respondWith(
    // First, check if a response for this request already exists in the cache.
    caches.match(event.request).then((response) => {
      // If a response is found in the cache, return it directly.
      if (response) {
        return response;
      }
      // If not found in the cache, proceed to fetch it from the network.
      return fetch(event.request);
    }),
  );
});
