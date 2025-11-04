// images.js: small helper to swap data-img-key -> src from generated manifest when available
(function(){
  async function loadManifest(){
    try{
      const res = await fetch('/assets/images/_generated/manifest.json');
      return await res.json();
    }catch(e){return null}
  }
  document.addEventListener('DOMContentLoaded', async function(){
    const manifest = await loadManifest();
    if(!manifest) return;
    document.querySelectorAll('img[data-img-key]').forEach(img=>{
      const key = img.getAttribute('data-img-key');
      if(manifest[key] && manifest[key].variants){
        // pick 1024 avif/webp if present as progressive enhancement
        const variants = manifest[key].variants;
        const w = Object.keys(variants).sort((a,b)=>b-a)[0];
        const fmt = variants[w].avif? 'avif' : (variants[w].webp? 'webp': null);
        if(fmt){ img.src = variants[w][fmt].replace('/assets','/assets'); }
      }
    });
  });
})();
// images.js — runtime enhancement: apply srcset and LQIP placeholders from manifest
(function(){
  function ready(fn){ if(document.readyState !== 'loading') fn(); else document.addEventListener('DOMContentLoaded', fn); }
  ready(async function(){
    let manifest = null;
    try{ const res = await fetch('/assets/images/manifest.json'); if(res.ok) manifest = await res.json(); }catch(e){ /* manifest missing */ }
    // Hero and other images marked with data-img-key
    const imgs = document.querySelectorAll('img[data-img-key]');
    imgs.forEach(img => {
      const key = img.dataset.imgKey;
      if(!manifest || !manifest[key]) return;
      const entry = manifest[key];
      // build srcset: avif first, then webp
      const parts = [];
      Object.keys(entry.variants).sort((a,b)=>parseInt(a)-parseInt(b)).forEach(w => {
        const v = entry.variants[w];
        if(v.avif) parts.push(`${v.avif} ${w}w`);
      });
      Object.keys(entry.variants).sort((a,b)=>parseInt(a)-parseInt(b)).forEach(w => {
        const v = entry.variants[w];
        if(v.webp) parts.push(`${v.webp} ${w}w`);
      });
      if(parts.length) img.setAttribute('srcset', parts.join(', '));
      // set sizes for full-width hero and add width/height if available
      if(!img.getAttribute('sizes')) img.setAttribute('sizes', '(max-width: 640px) 100vw, 1200px');
      if(entry.original && entry.original.width && entry.original.height){
        img.setAttribute('width', entry.original.width);
        img.setAttribute('height', entry.original.height);
      }
      // apply lqip as background while loading
      if(entry.placeholder){ img.style.backgroundImage = `url(${entry.placeholder})`; img.style.backgroundSize='cover'; img.style.backgroundPosition='center'; img.style.backgroundRepeat='no-repeat'; }
      img.addEventListener('load', ()=>{ img.style.backgroundImage='none'; });
    });
  });
})();
