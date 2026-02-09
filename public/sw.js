// AI Bridge Service Worker (Phase 49)
self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(clients.claim());
});

self.addEventListener('push', (event) => {
  const data = event.data ? event.data.json() : {};
  const title = data.title || "AI Bridge Update";
  const options = {
    body: data.body || "Josoor has a new update for you.",
    icon: "/hero-teacher-productivity.jpg",
    badge: "/favicon.ico",
    data: data.url || "/"
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    clients.openWindow(event.notification.data)
  );
});
