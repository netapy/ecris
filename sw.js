if(!self.define){const s=s=>{"require"!==s&&(s+=".js");let e=Promise.resolve();return r[s]||(e=new Promise((async e=>{if("document"in self){const r=document.createElement("script");r.src=s,document.head.appendChild(r),r.onload=e}else importScripts(s),e()}))),e.then((()=>{if(!r[s])throw new Error(`Module ${s} didn’t register its module`);return r[s]}))},e=(e,r)=>{Promise.all(e.map(s)).then((s=>r(1===s.length?s[0]:s)))},r={require:Promise.resolve(e)};self.define=(e,i,c)=>{r[e]||(r[e]=Promise.resolve().then((()=>{let r={};const a={uri:location.origin+e.slice(1)};return Promise.all(i.map((e=>{switch(e){case"exports":return r;case"module":return a;default:return s(e)}}))).then((s=>{const e=c(...s);return r.default||(r.default=e),r}))})))}}define("./sw.js",["./workbox-c896d617"],(function(s){"use strict";self.addEventListener("message",(s=>{s.data&&"SKIP_WAITING"===s.data.type&&self.skipWaiting()})),s.precacheAndRoute([{url:"assets/add_box-24px.svg",revision:"2dd164a29b3c4eb09d0bd8bb75436ff6"},{url:"assets/blnk.gif",revision:"b4491705564909da7f9eaf749dbbfbb1"},{url:"assets/edit-24px.svg",revision:"fea011091a50450aa17afa13a6371bdc"},{url:"assets/logo_ecris_solo.svg",revision:"1dc5288f68cbb7eb8613287ac8a8141f"},{url:"assets/logo192.png",revision:"15e0ffb24f2646d79309735e52d0b701"},{url:"assets/logo192bg.png",revision:"fec3b7c7c1f682257fde019203e96744"},{url:"assets/logo512.png",revision:"98f2af5ab42dcfa428313fc85bfaf18c"},{url:"assets/no_data.svg",revision:"0776c99576ced4f83c5bcb5ea8d23c6f"},{url:"assets/save_alt-24px.svg",revision:"e50d5cdf37cdbf94dd63ecae9ca004e4"},{url:"assets/subject-24px.svg",revision:"a20b1127c8e80dd4f3ba1acc88724d52"},{url:"css/ecr.css",revision:"330a2cd7fe2df4c498b676e075bb335c"},{url:"css/quill.css",revision:"81237096d3c75338723bb8a5bc260262"},{url:"index.html",revision:"6b27ffdd8718f308196ea937551125fb"},{url:"js/ecr.js",revision:"11d47ac97bc3abfd6a93898eb8aa6c75"},{url:"js/fun.js",revision:"8bb9f931d9fb8f5ae9084325428a0f70"},{url:"js/quill.js",revision:"0fb4303f039b9ab9da2c90aaf8c56197"},{url:"js/scribby.js",revision:"cee220102393d85f4f2bdc02b5a6ddbf"},{url:"js/swal.min.js",revision:"027cdcbdb8dae2bd1a8f2befbb49dc49"},{url:"manifest.json",revision:"d4927c3a69cacfbd833f765ef5364447"}],{})}));
//# sourceMappingURL=sw.js.map