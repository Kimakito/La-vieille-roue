// Minimal navbar behavior: toggle mobile menu
document.addEventListener('DOMContentLoaded', function(){
  try{
    const btn = document.querySelector('.nav-toggle');
    const nav = document.querySelector('.site-nav');
    if(btn && nav){
      btn.addEventListener('click', ()=> nav.classList.toggle('open'));
    }
  }catch(e){console.warn('navbar.js error',e)}
});
// navbar.js — mobile burger and active link highlighting
(function(){
  function ready(fn){ if(document.readyState !== 'loading') fn(); else document.addEventListener('DOMContentLoaded', fn); }
  ready(function(){
    const burger = document.getElementById('burgerMenu');
    const mobileMenu = document.getElementById('mobileMenu');
    burger?.addEventListener('click', ()=> mobileMenu.classList.toggle('hidden'));

    const currentPath = window.location.pathname;
    const links = document.querySelectorAll('.page');
    links.forEach(link => {
      if (link.getAttribute('href') === currentPath) link.classList.add('text-accent','underline'); else link.classList.remove('text-accent','underline');
    });
  });
})();
