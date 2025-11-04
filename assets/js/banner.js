// Minimal banner behaviour: allow closing banners with .banner-close
document.addEventListener('click', function(e){
  const btn = e.target.closest && e.target.closest('.banner-close');
  if(!btn) return;
  const banner = btn.closest('.site-banner');
  if(banner) banner.remove();
});
// banner.js — manage opening announcement banner
(function(){
  function ready(fn){ if(document.readyState !== 'loading') fn(); else document.addEventListener('DOMContentLoaded', fn); }
  ready(function(){
    const banner = document.getElementById('opening-banner');
    if(!banner) return;
    const closeBtn = document.getElementById('close-banner-btn');
    const header = document.getElementById('navbar');
    const hasBeenClosed = localStorage.getItem('openingBannerClosed');

    const updatePositions = () => {
      const headerHeight = header ? header.offsetHeight : 0;
      const bannerHeight = banner.offsetHeight;
      banner.style.setProperty('--banner-top', headerHeight + 'px');
      document.body.style.paddingTop = (headerHeight + bannerHeight) + 'px';
    };

    if (!hasBeenClosed) {
      setTimeout(() => {
        banner.classList.remove('-translate-y-full', 'opacity-0');
        updatePositions();
      }, 1000);
    } else {
      document.body.style.paddingTop = (header ? header.offsetHeight : 0) + 'px';
    }

    closeBtn?.addEventListener('click', () => {
      banner.classList.add('-translate-y-full', 'opacity-0');
      document.body.style.paddingTop = (header ? header.offsetHeight : 0) + 'px';
      localStorage.setItem('openingBannerClosed', 'true');
    });

    window.addEventListener('resize', () => {
      if (!hasBeenClosed) updatePositions(); else document.body.style.paddingTop = (header ? header.offsetHeight : 0) + 'px';
    });
  });
})();
