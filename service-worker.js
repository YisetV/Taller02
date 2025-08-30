const CACHE_NAME = "ahorcado-v1";
const FILES_TO_CACHE = [
  "/",
  "/index.html",
  "/manifest.json",
  "/juego-del-ahorcado.png"
];

// Instalación del SW y guardado en caché
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

// Activación del SW (eliminar versiones antiguas)
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
      return response || fetch(event.request);
    })
  );
});
