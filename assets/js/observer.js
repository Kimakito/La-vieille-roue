// Minimal IntersectionObserver utilities used for lazy animations/embeds
document.addEventListener('DOMContentLoaded', function(){
  try{
    const obs = new IntersectionObserver((entries)=>{
      entries.forEach(e=>{
        if(e.isIntersecting){
          const el = e.target; el.classList.add('in-view');
          if(el.dataset && el.dataset.embed && !el.dataset.embedLoaded){
            // dispatch event for embeds.js to pick up
            window.dispatchEvent(new CustomEvent('elementInView',{detail:{element:el}}));
            el.dataset.embedLoaded = '1';
          }
          obs.unobserve(el);
        }
      });
    }, {rootMargin:'0px 0px -10% 0px', threshold:0.1});

    document.querySelectorAll('[data-observe]').forEach(el=> obs.observe(el));
  }catch(e){console.warn('observer.js',e)}
});
// observer.js — IntersectionObserver for animations
(function(){
  function ready(fn){ if(document.readyState !== 'loading') fn(); else document.addEventListener('DOMContentLoaded', fn); }
  ready(function(){
    const animateElements = document.querySelectorAll('[data-animate]');
    if(!animateElements || animateElements.length === 0) return;
    const observer = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const element = entry.target;
          const animationType = element.dataset.animate;
          const delay = element.dataset.delay ? parseInt(element.dataset.delay) : 0;
          setTimeout(() => {
            element.classList.remove('opacity-0');
            element.classList.add(`animate-${animationType}`);
          }, delay);
          observer.unobserve(element);
        }
      });
    }, { threshold: 0.1 });

    animateElements.forEach(element => { element.classList.add('opacity-0'); observer.observe(element); });
  });
})();
