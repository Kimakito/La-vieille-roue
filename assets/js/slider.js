// Simple slider stub: advance slides every 4s if .simple-slider exists
document.addEventListener('DOMContentLoaded', function(){
  try{
    const s = document.querySelector('.simple-slider');
    if(!s) return;
    const items = Array.from(s.querySelectorAll('.slide'));
    if(items.length<2) return;
    let i=0; setInterval(()=>{ items[i].classList.remove('active'); i=(i+1)%items.length; items[i].classList.add('active'); }, 4000);
  }catch(e){console.warn('slider.js',e)}
});
// slider.js — small helper for slider components (Clio)
(function(){
  function ready(fn){ if(document.readyState !== 'loading') fn(); else document.addEventListener('DOMContentLoaded', fn); }
  ready(function(){
    const sliderClio = document.getElementById('slider-clio');
    if(!sliderClio) return;
    const totalSlidesClio = sliderClio.children.length;
    let indexClio = 0;
    function showSlideClio(){ sliderClio.style.transform = `translateX(-${indexClio * 100}%)`; }
    window.nextClio = function(){ indexClio = (indexClio + 1) % totalSlidesClio; showSlideClio(); };
    window.prevClio = function(){ indexClio = (indexClio - 1 + totalSlidesClio) % totalSlidesClio; showSlideClio(); };
  });
})();
