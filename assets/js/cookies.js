// Lightweight cookie consent API shim
(function(){
  function read(){
    try{ return JSON.parse(localStorage.getItem('cookieConsent')||'{}'); }catch(e){return{}};
  }
  function save(v){ localStorage.setItem('cookieConsent', JSON.stringify(v)); window.dispatchEvent(new CustomEvent('cookieConsentChanged',{detail:v})); }
  window.getCookieConsent = window.getCookieConsent || function(){ return read(); };
  window.setCookieConsent = window.setCookieConsent || function(obj){ save(Object.assign(read(), obj)); };
  // expose a small UI hook if one exists
  document.addEventListener('click', function(e){
    const b = e.target.closest && e.target.closest('[data-cookie-set]');
    if(!b) return;
    try{ const json = JSON.parse(b.getAttribute('data-cookie-set')); window.setCookieConsent(json); }catch(e){ console.warn('cookies.js: bad data-cookie-set', e); }
  });
})();
// cookies.js — cookie consent UI and API
(function(){
  function ready(fn){ if(document.readyState !== 'loading') fn(); else document.addEventListener('DOMContentLoaded', fn); }
  ready(function(){
    const banner = document.getElementById('cookie-banner');
    if(!banner) return;
    const chkAnalytics = document.getElementById('cookie-analytics');
    const chkMarketing = document.getElementById('cookie-marketing');
    const btnSave = document.getElementById('save-cookies');
    const btnAcceptAll = document.getElementById('accept-all-cookies');
    const btnRejectAll = document.getElementById('reject-all-cookies');

    const defaultConsent = { essential: true, analytics: false, marketing: false };

    function readConsent(){ try{ const raw = localStorage.getItem('cookieConsent'); if(!raw) return null; return JSON.parse(raw);}catch(e){ console.warn('cookieConsent read error', e); return null; } }
    function writeConsent(consent){ try{ localStorage.setItem('cookieConsent', JSON.stringify(consent)); window.dispatchEvent(new CustomEvent('cookieConsentChanged', { detail: consent })); }catch(e){ console.warn('cookieConsent write error', e); } }
    function applyConsentToUI(consent){ chkAnalytics.checked = !!consent.analytics; chkMarketing.checked = !!consent.marketing; }
    function hideBanner(){ banner.classList.add('translate-y-full'); setTimeout(()=>{ banner.style.display='none'; }, 500); }

    const stored = readConsent();
    if(!stored){ setTimeout(()=>{ banner.classList.remove('translate-y-full'); }, 250); applyConsentToUI(defaultConsent); }
    else { hideBanner(); applyConsentToUI(stored); }

    btnSave?.addEventListener('click', ()=>{ const consent={ essential:true, analytics: !!chkAnalytics.checked, marketing: !!chkMarketing.checked }; writeConsent(consent); hideBanner(); console.log('Cookies saved', consent); });
    btnAcceptAll?.addEventListener('click', ()=>{ const consent={ essential:true, analytics:true, marketing:true }; writeConsent(consent); hideBanner(); console.log('Accepted all cookies'); });
    btnRejectAll?.addEventListener('click', ()=>{ const consent={ essential:true, analytics:false, marketing:false }; writeConsent(consent); hideBanner(); console.log('Rejected non-essential cookies'); });

    // Expose getter
    window.getCookieConsent = function(){ return readConsent() || defaultConsent; };
  });
})();
