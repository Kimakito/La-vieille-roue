// Combined utilities: gallery lightbox, Facebook consent loader, slider, and animation observer
(function(){
  // Wait for DOM
  function ready(fn){
    if(document.readyState !== 'loading') fn(); else document.addEventListener('DOMContentLoaded', fn);
  }

  ready(function(){
    /* ---------- Lightbox & gallery (works on pages that include gallery/flyer markup) ---------- */
    (function(){
      const items = Array.from(document.querySelectorAll('.gallery-item-btn, .flyer-item-btn'));
      if(!items || items.length === 0) return;

      const lightbox = document.getElementById('gallery-lightbox');
      const lbImage = document.getElementById('lb-image');
      const lbCaption = document.getElementById('lb-caption');
      const lbClose = document.getElementById('lb-close');
      const lbNext = document.getElementById('lb-next');
      const lbPrev = document.getElementById('lb-prev');
      let current = 0;

      // ensure lightbox exists
      if(!lightbox || !lbImage) return;

      // Create caption overlays from img alt for each gallery item
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
        const btn = items[i];
        if(!btn) return;
        const img = btn.querySelector('img');
        lbImage.src = img.dataset.full || img.src;
        lbImage.alt = img.alt || '';
        if(lbCaption) lbCaption.textContent = img.alt || '';
        lightbox.classList.add('open');
        lightbox.setAttribute('aria-hidden','false');
        current = i;
        // focus trap: focus close button
        if(lbClose) lbClose.focus();
      }

      function closeLB(){
        lightbox.classList.remove('open');
        lightbox.setAttribute('aria-hidden','true');
        lbImage.src = '';
        if(lbCaption) lbCaption.textContent = '';
      }

      items.forEach((btn, idx) => {
        btn.addEventListener('click', (e) => { e.preventDefault(); openAt(idx); });
        btn.addEventListener('keyup', (e) => { if(e.key === 'Enter' || e.key === ' ') { openAt(items.indexOf(btn)); } });
      });

      if(lbClose) lbClose.addEventListener('click', closeLB);
      if(lightbox) lightbox.addEventListener('click', (e)=>{ if(e.target === lightbox) closeLB(); });
      document.addEventListener('keydown', (e)=>{
        if(lightbox.classList.contains('open')){
          if(e.key === 'Escape') closeLB();
          if(e.key === 'ArrowRight') openAt((current+1)%items.length);
          if(e.key === 'ArrowLeft') openAt((current-1+items.length)%items.length);
        }
      });
      if(lbNext) lbNext.addEventListener('click', ()=> openAt((current+1)%items.length));
      if(lbPrev) lbPrev.addEventListener('click', ()=> openAt((current-1+items.length)%items.length));
    })();

    /* ---------- Facebook SDK & consent gating (index.html) ---------- */
    (function(){
      const pageUrl = 'https://www.facebook.com/profile.php?id=61581564816236';

      function loadFacebookSDK(){
        if (document.getElementById('facebook-jssdk')) return;
        var js = document.createElement('script');
        js.id = 'facebook-jssdk';
        js.src = 'https://connect.facebook.net/fr_FR/sdk.js#xfbml=1&version=v16.0';
        js.async = true;
        js.defer = true;
        document.body.appendChild(js);
      }

      function renderPagePlugin(){
        const container = document.getElementById('fb-container');
        if(!container) return;
        if(container.querySelector('.fb-page')) return; // already rendered
        container.innerHTML = '';

        const wrapper = document.createElement('div');
        wrapper.className = 'fb-page';
        wrapper.setAttribute('data-href', pageUrl);
        wrapper.setAttribute('data-tabs', 'timeline');
        wrapper.setAttribute('data-small-header', 'false');
        wrapper.setAttribute('data-adapt-container-width', 'true');
        wrapper.setAttribute('data-hide-cover', 'false');
        wrapper.setAttribute('data-show-facepile', 'true');
        wrapper.style.cssText = 'width:100%; min-height:360px; max-width:100%; overflow:hidden; display:inline-block; margin:0 auto;';

        const fbBlockquote = document.createElement('blockquote');
        fbBlockquote.className = 'fb-xfbml-parse-ignore';
        fbBlockquote.innerHTML = `<a href="${pageUrl}" target="_blank" rel="noopener noreferrer">La Vieille Roue</a>`;

        wrapper.appendChild(fbBlockquote);
        container.appendChild(wrapper);

        if(window.FB && FB.XFBML && typeof FB.XFBML.parse === 'function'){
          FB.XFBML.parse(container);
        }
      }

      function checkConsentAndMaybeLoad(){
        try{
          var consent = null;
          if(typeof window.getCookieConsent === 'function'){
            consent = window.getCookieConsent();
          } else {
            const raw = localStorage.getItem('cookieConsent');
            consent = raw ? JSON.parse(raw) : null;
          }
          if(consent && (consent.marketing === true || consent.social === true)){
            loadFacebookSDK();
            window.addEventListener('fb_init', renderPagePlugin);
            setTimeout(renderPagePlugin, 1200);
            return true;
          }
        }catch(e){ console.warn('Facebook integration: consent check failed', e); }
        return false;
      }

      var loadedByConsent = checkConsentAndMaybeLoad();

      if(!loadedByConsent){
        const fallback = document.getElementById('fb-fallback');
        if(fallback){
          const enableBtn = document.createElement('button');
          enableBtn.className = 'mt-4 bg-accent text-primary-dark font-bold py-2 px-4 rounded';
          enableBtn.textContent = 'Afficher le fil Facebook (autoriser)';
          enableBtn.onclick = function(){
            try{
              const current = (typeof window.getCookieConsent === 'function') ? window.getCookieConsent() : (JSON.parse(localStorage.getItem('cookieConsent') || '{}'));
              const updated = Object.assign({}, current || {}, { marketing: true });
              localStorage.setItem('cookieConsent', JSON.stringify(updated));
              window.dispatchEvent(new CustomEvent('cookieConsentChanged', { detail: updated }));
            }catch(e){
              localStorage.setItem('cookieConsent', JSON.stringify({ essential: true, analytics: false, marketing: true }));
              window.dispatchEvent(new CustomEvent('cookieConsentChanged', { detail: { essential: true, analytics: false, marketing: true } }));
            }
            loadFacebookSDK();
            setTimeout(renderPagePlugin, 800);
          };
          fallback.appendChild(document.createElement('br'));
          fallback.appendChild(enableBtn);

          window.addEventListener('cookieConsentChanged', function(e){
            const detail = e && e.detail ? e.detail : null;
            if(detail && (detail.marketing === true || detail.social === true)){
              loadFacebookSDK();
              setTimeout(renderPagePlugin, 1000);
            }
          });
        }
      }

      // Observe FB SDK ready
      var observer = new MutationObserver(function(mutationsList, observer){
        if(window.FB && FB.XFBML && typeof FB.XFBML.parse === 'function'){
          window.dispatchEvent(new Event('fb_init'));
          observer.disconnect();
        }
      });
      observer.observe(document.documentElement, { childList: true, subtree: true });
    })();

    /* ---------- Slider Clio (if present) ---------- */
    (function(){
      const sliderClio = document.getElementById('slider-clio');
      if(!sliderClio) return;
      const totalSlidesClio = sliderClio.children.length;
      let indexClio = 0;
      function showSlideClio(){ sliderClio.style.transform = `translateX(-${indexClio * 100}%)`; }
      window.nextClio = function(){ indexClio = (indexClio + 1) % totalSlidesClio; showSlideClio(); };
      window.prevClio = function(){ indexClio = (indexClio - 1 + totalSlidesClio) % totalSlidesClio; showSlideClio(); };
    })();

    /* ---------- IntersectionObserver for animations ---------- */
    (function(){
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
    })();

  }); // ready
})();
