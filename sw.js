/* Rizanta Store service worker — network-first agar update web langsung terlihat.
   Push notification (OneSignal) dimuat lewat importScripts di bawah. */
try{ importScripts('https://cdn.onesignal.com/sdks/web/v16/OneSignalSDK.sw.js'); }catch(e){}
const CACHE='rizanta-v2';
const SHELL=['/','/icon-192.png','/icon-512.png','/manifest.webmanifest'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(SHELL)).then(()=>self.skipWaiting()));});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==CACHE).map(x=>caches.delete(x)))).then(()=>self.clients.claim()));});
self.addEventListener('fetch',e=>{
  const r=e.request,u=new URL(r.url);
  if(r.method!=='GET'||u.origin!==location.origin)return;   // jangan cache Google Sheets/Apps Script
  e.respondWith(fetch(r).then(res=>{
    if(res.ok){const cp=res.clone();caches.open(CACHE).then(c=>c.put(r.mode==='navigate'?'/':r,cp));}
    return res;
  }).catch(()=>caches.match(r.mode==='navigate'?'/':r).then(x=>x||caches.match('/'))));
});
