
// TODO: update later to load from common cached assets
self.addEventListener("fetch", (event) => {
  event.respondWith(fetch(event.request));
});
