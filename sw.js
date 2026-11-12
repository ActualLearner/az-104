const CACHE_NAME = 'az104-hub-v5';
const ASSETS = [
  './',
  './index.html',
  './exam_simulator.html',
  './exam_questions_exam1.js',
  './exam_questions_exam2.js',
  './exam_questions_exam3.js',
  './exam_engine.js',
  './error_journal.html',
  './app_service_deployment_and_auth_master_guide.html',
  './azure_abac_role_assignment_conditions_master_guide.html',
  './council-report-20261112-120650.html',
  './azure_placement_and_boundary_matrix.html',
  './azcopy_master_guide.html',
  './entra-id-master-architecture-and-governance.html',
  './council-report-2026-11-07-exams-vs-labs.html',
  './council-report-2026-11-07-bicep-endpoints.html',
  './manifest.json',
  './icon-192.png',
  './icon-512.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  // Network first, falling back to cache
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        if (response && response.status === 200) {
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseClone);
          });
        }
        return response;
      })
      .catch(() => caches.match(event.request))
  );
});
