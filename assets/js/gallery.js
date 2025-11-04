// gallery.js — lightbox & gallery behaviors
(function(){
  function ready(fn){ if(document.readyState !== 'loading') fn(); else document.addEventListener('DOMContentLoaded', fn); }
  ready(function(){
    const items = Array.from(document.querySelectorAll('.gallery-item-btn, .flyer-item-btn'));
    if(!items || items.length === 0) return;
    const lightbox = document.getElementById('gallery-lightbox');
    const lbImage = document.getElementById('lb-image');
    const lbCaption = document.getElementById('lb-caption');
    const lbClose = document.getElementById('lb-close');
    const lbNext = document.getElementById('lb-next');
    const lbPrev = document.getElementById('lb-prev');
    let current = 0;
    if(!lightbox || !lbImage) return;

    items.forEach(btn => {
      const img = btn.querySelector('img');
      if(img){
        const caption = document.createElement('div');
        caption.className = 'caption';
        caption.textContent = img.alt || '';
        const galleryItem = btn.closest('.gallery-item');
        if(galleryItem) galleryItem.appendChild(caption);
      }
    });

    function openAt(i){
      const btn = items[i]; if(!btn) return;
      const img = btn.querySelector('img');
      lbImage.src = img.dataset.full || img.src; lbImage.alt = img.alt || '';
      if(lbCaption) lbCaption.textContent = img.alt || '';
      lightbox.classList.add('open'); lightbox.setAttribute('aria-hidden','false'); current = i;
      if(lbClose) lbClose.focus();
    }
    function closeLB(){ lightbox.classList.remove('open'); lightbox.setAttribute('aria-hidden','true'); lbImage.src = ''; if(lbCaption) lbCaption.textContent = ''; }
    items.forEach((btn, idx) => { btn.addEventListener('click', e=>{ e.preventDefault(); openAt(idx); }); btn.addEventListener('keyup', e=>{ if(e.key==='Enter'||e.key===' ') openAt(idx); }); });
    if(lbClose) lbClose.addEventListener('click', closeLB);
    if(lightbox) lightbox.addEventListener('click', e=>{ if(e.target===lightbox) closeLB(); });
    document.addEventListener('keydown', e=>{ if(lightbox.classList.contains('open')){ if(e.key==='Escape') closeLB(); if(e.key==='ArrowRight') openAt((current+1)%items.length); if(e.key==='ArrowLeft') openAt((current-1+items.length)%items.length); } });
    if(lbNext) lbNext.addEventListener('click', ()=> openAt((current+1)%items.length));
    if(lbPrev) lbPrev.addEventListener('click', ()=> openAt((current-1+items.length)%items.length));
  });
})();
