// Define um nome e versão para o nosso cache
const CACHE_NAME = 'iviewer-ai-cache-v1';

// Lista de arquivos que compõem o "app shell" (a estrutura básica do app)
// Estes são os arquivos essenciais para o seu app funcionar.
const urlsToCache = [
  './', // A raiz, que geralmente serve o index.html
  './index.html',
  './style.css',
  './script.js',
  './iview.png',
  './assinatura.png' // Sua imagem de assinatura
];

// Evento 'install': é disparado quando o Service Worker é instalado pela primeira vez.
self.addEventListener('install', event => {
  // Espera até que o cache seja aberto e todos os nossos arquivos sejam armazenados.
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Cache aberto');
        return cache.addAll(urlsToCache);
      })
  );
});

// Evento 'fetch': é disparado para cada requisição que a página faz (imagens, scripts, etc.).
self.addEventListener('fetch', event => {
  event.respondWith(
    // Tenta encontrar a requisição no cache primeiro.
    caches.match(event.request)
      .then(response => {
        // Se a requisição for encontrada no cache, retorna a resposta do cache.
        if (response) {
          return response;
        }
        // Se não for encontrada no cache, faz a requisição à rede.
        return fetch(event.request);
      }
    )
  );
});

// Evento 'activate': é disparado quando o Service Worker é ativado.
// Usado para limpar caches antigos e garantir que o app use a versão mais recente.
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            // Se o nome do cache não estiver na nossa lista de permissões, delete-o.
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});