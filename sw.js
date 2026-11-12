// 積算システム: オフライン対応（ネット優先、つながらないときだけ保存分を使う＝古い版が残りにくい）
const CACHE="sekisan-v1";
const CORE=["./","index.html","manifest.webmanifest","icon-192.png","icon-512.png"];
self.addEventListener("install",e=>{ e.waitUntil(caches.open(CACHE).then(c=>c.addAll(CORE)).catch(()=>{})); self.skipWaiting(); });
self.addEventListener("activate",e=>{ e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())); });
self.addEventListener("fetch",e=>{
  const req=e.request; if(req.method!=="GET") return;
  const u=new URL(req.url);
  if(u.hostname==="generativelanguage.googleapis.com") return;           // AIへの通信は触らない
  e.respondWith(fetch(req).then(res=>{ if(res.ok&&(u.origin===location.origin||u.hostname==="cdnjs.cloudflare.com")){ const cp=res.clone(); caches.open(CACHE).then(c=>c.put(req,cp)); } return res; })
    .catch(()=>caches.match(req).then(r=>r||caches.match("index.html"))));
});
