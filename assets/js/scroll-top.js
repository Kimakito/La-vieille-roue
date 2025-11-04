// Small scroll-to-top helper
document.addEventListener('DOMContentLoaded', function(){
  try{
    const btn = document.querySelector('.scroll-top-btn');
    if(!btn) return;
    btn.addEventListener('click', function(e){ e.preventDefault(); window.scrollTo({top:0,behavior:'smooth'}); });
  }catch(e){console.warn('scroll-top.js',e)}
});
// scroll-top.js — show/hide scroll-to-top button and smooth scroll
(function(){
  function ready(fn){ if(document.readyState !== 'loading') fn(); else document.addEventListener('DOMContentLoaded', fn); }
  ready(function(){
    const scrollTopBtn = document.getElementById('scrollTopBtn');
    if(!scrollTopBtn) return;
    window.addEventListener('scroll', ()=>{
      if(window.scrollY > 200){ scrollTopBtn.classList.remove('hidden'); scrollTopBtn.classList.add('block'); }
      else { scrollTopBtn.classList.add('hidden'); scrollTopBtn.classList.remove('block'); }
    });
    scrollTopBtn.addEventListener('click', ()=> window.scrollTo({ top:0, behavior:'smooth' }));
  });
})();
