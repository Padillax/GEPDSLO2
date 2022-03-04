var cacheName = 'weatherPWA-v1';
var filesToCache = [
    '/',
    '/index.html',
    '/scripts/app.js',
    '/scripts/localforage-1.4.0.js',
    '/styles/ud811.css',
    '/images/clear.png',
    '/images/cloudy-scattered-showers.png',
    '/images/cloudy.png',
    '/images/fog.png',
    '/images/ic_add_white_24px.svg',
    '/images/ic_refresh_white_24px.svg',
    '/images/partly-cloudy.png',
    '/images/rain.png',
    '/images/scattered-showers.png',
    '/images/sleet.png',
    '/images/snow.png',
    '/images/thunderstorm.png',
    '/images/wind.png'
];





///Basicamente despues de cerrar la consola Shell, para que no se 
//borre lo escrito utiliza la función “addeventlistener” 
///que pone a escuchar, que en este caso “escucho el texto” y 
//lo guardo, pero como cache, entonces espera hasta que abra 
///la ubicación del proyecto y lo guarda en un archivo log, 
//entonces el service worker se encarga de guardarla y la regresa en .log en la ubicación.


self.addEventListener('install', function(e) {
    console.log('[ServiceWorker] Install');
    e.waitUntil(
        caches.open(cacheName).then(function(cache) {
            console.log('[ServiceWorker] Caching app shell');
            return cache.addAll(filesToCache);
        })
    );
});


///En caso de que se hagan cambios, reutiliza el add eventlister y entonces 
//en caso de que si los tenga elimina el cache con el mismo nombre y lo remplaza por otra version nueva

self.addEventListener('activate', function(e) {
    console.log('[ServiceWorker] Activate');
    e.waitUntil (
      caches.keys().then(function(keyList) {
        return Promise.all(keyList.map(function(key) {
          if (key !== cacheName) {
            console.log('[ServiceWorker] Removing old cache', key);
            return caches.delete(key);
          }
        }));
      })
    );
  });


//Basicamente pone por ultima vez la funcion de listener, entonces con "fetch" empieza a buscar el log, 
//a cierto url entonces empieza a hacer una comparacion, en caso de que la encuentre la manda como respuesta a la URL

  self.addEventListener('fetch', function(e){
    console.log('[ServiceWorker] Fetch', e.request.url);
    e.respondWith(
      caches.match(e.request).then(function(response){
        return response || fetch(e.request);
      })
    );
  });