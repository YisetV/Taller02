const CACHE_NAME = "ahorcado-v1";
const FILES_TO_CACHE = [
  "/",
  "/index.html",
  "/manifest.json",
  "/app.js", // si separas la lógica en este archivo
  "/icons/icon-192x192.png",
  "/icons/icon-512x512.png"
];

// Instalación del SW y guardado de caché
self.addEventListener("install", (event) => {
  console.log("[ServiceWorker] Instalando...");
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("[ServiceWorker] Archivos en caché");
      return cache.addAll(FILES_TO_CACHE);
    })
  );
  self.skipWaiting();
});

// Activación del SW (limpiar versiones viejas de caché)
self.addEventListener("activate", (event) => {
  console.log("[ServiceWorker] Activado");
  event.waitUntil(
    caches.keys().then((cacheNames) =>
      Promise.all(
        cacheNames.map((name) => {
          if (name !== CACHE_NAME) {
            console.log("[ServiceWorker] Borrando caché vieja:", name);
            return caches.delete(name);
          }
        })
      )
    )
  );
  self.clients.claim();
});

// Interceptar peticiones y responder desde caché o red
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      // Si existe en caché, devuelve; si no, ve a la red
      return response || fetch(event.request);
    })
  );
});
