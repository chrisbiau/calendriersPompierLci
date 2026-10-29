const V='s220-v1';
const CORE=['./','index.html','data.js','manifest.json','icon-192.png','icon-512.png',
 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.js','https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.css'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(V).then(c=>c.addAll(CORE)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==V&&k!=='s220-tiles').map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{const u=e.request.url;if(e.request.method!=='GET')return;
  if(u.includes('tile.openstreetmap.org')){ // fond de carte : cache au fil de la consultation
    e.respondWith(caches.open('s220-tiles').then(c=>c.match(e.request).then(r=>r||fetch(e.request).then(n=>{if(n.ok||n.type==='opaque')c.put(e.request,n.clone());return n}))));return}
  // appli : réseau d'abord (mises à jour), cache si hors ligne
  e.respondWith(fetch(e.request).then(n=>{if(n.ok){const cl=n.clone();caches.open(V).then(c=>c.put(e.request,cl))}return n}).catch(()=>caches.match(e.request,{ignoreSearch:true}).then(r=>r||caches.match('index.html'))));});
