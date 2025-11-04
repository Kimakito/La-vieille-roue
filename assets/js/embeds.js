// Basic embed loader: listens for 'elementInView' or cookieConsentChanged to load 3rd party embeds
(function(){
  function loadEmbed(el){
    if(!el) return;
    // If it's an iframe placeholder with data-src, set src
    const iframe = el.querySelector && el.querySelector('iframe[data-src]');
    if(iframe && !iframe.src){ iframe.src = iframe.getAttribute('data-src'); }
    // generic data-embed loaders (e.g., facebook) can be placed here
  }

  window.addEventListener('elementInView', function(e){ loadEmbed(e.detail && e.detail.element); });
  window.addEventListener('cookieConsentChanged', function(){
    document.querySelectorAll('[data-consent-embed]').forEach(loadEmbed);
  });
  // on load, also try to hydrate any placeholders if consent already given
  document.addEventListener('DOMContentLoaded', function(){
    try{ const c = (typeof window.getCookieConsent==='function')?window.getCookieConsent():{}; if(c.marketing) document.querySelectorAll('[data-consent-embed]').forEach(loadEmbed); }catch(e){}
  });
})();
// embeds.js — facebook SDK loader and consent gating
(function(){
  function ready(fn){ if(document.readyState !== 'loading') fn(); else document.addEventListener('DOMContentLoaded', fn); }
  ready(function(){
    const pageUrl = 'https://www.facebook.com/profile.php?id=61581564816236';
    function loadFacebookSDK(){ if(document.getElementById('facebook-jssdk')) return; var js=document.createElement('script'); js.id='facebook-jssdk'; js.src='https://connect.facebook.net/fr_FR/sdk.js#xfbml=1&version=v16.0'; js.async=true; js.defer=true; document.body.appendChild(js); }
    function renderPagePlugin(){ const container = document.getElementById('fb-container'); if(!container) return; if(container.querySelector('.fb-page')) return; container.innerHTML=''; const wrapper=document.createElement('div'); wrapper.className='fb-page'; wrapper.setAttribute('data-href', pageUrl); wrapper.setAttribute('data-tabs','timeline'); wrapper.setAttribute('data-small-header','false'); wrapper.setAttribute('data-adapt-container-width','true'); wrapper.setAttribute('data-hide-cover','false'); wrapper.setAttribute('data-show-facepile','true'); wrapper.style.cssText='width:100%; min-height:360px; max-width:100%; overflow:hidden; display:inline-block; margin:0 auto;'; const fbBlockquote=document.createElement('blockquote'); fbBlockquote.className='fb-xfbml-parse-ignore'; fbBlockquote.innerHTML=`<a href="${pageUrl}" target="_blank" rel="noopener noreferrer">La Vieille Roue</a>`; wrapper.appendChild(fbBlockquote); container.appendChild(wrapper); if(window.FB && FB.XFBML && typeof FB.XFBML.parse === 'function'){ FB.XFBML.parse(container); } }
    function checkConsentAndMaybeLoad(){ try{ var consent=null; if(typeof window.getCookieConsent === 'function') consent = window.getCookieConsent(); else { const raw = localStorage.getItem('cookieConsent'); consent = raw ? JSON.parse(raw) : null; } if(consent && (consent.marketing===true || consent.social===true)){ loadFacebookSDK(); window.addEventListener('fb_init', renderPagePlugin); setTimeout(renderPagePlugin, 1200); return true; } }catch(e){ console.warn('Facebook integration: consent check failed', e); } return false; }
    var loadedByConsent = checkConsentAndMaybeLoad();
    if(!loadedByConsent){ const fallback = document.getElementById('fb-fallback'); if(fallback){ const enableBtn = document.getElementById('fb-local-enable') || document.createElement('button'); enableBtn.className = enableBtn.className || 'mt-4 bg-accent text-primary-dark font-bold py-2 px-4 rounded'; enableBtn.textContent = enableBtn.textContent || 'Afficher le fil Facebook (autoriser)'; if(!document.getElementById('fb-local-enable')) fallback.appendChild(enableBtn); enableBtn.onclick = function(){ try{ const current = (typeof window.getCookieConsent === 'function') ? window.getCookieConsent() : (JSON.parse(localStorage.getItem('cookieConsent') || '{}')); const updated = Object.assign({}, current || {}, { marketing: true }); localStorage.setItem('cookieConsent', JSON.stringify(updated)); window.dispatchEvent(new CustomEvent('cookieConsentChanged', { detail: updated })); }catch(e){ localStorage.setItem('cookieConsent', JSON.stringify({ essential:true, analytics:false, marketing:true })); window.dispatchEvent(new CustomEvent('cookieConsentChanged', { detail: { essential:true, analytics:false, marketing:true } })); } loadFacebookSDK(); setTimeout(renderPagePlugin, 800); }; window.addEventListener('cookieConsentChanged', function(e){ const detail = e && e.detail ? e.detail : null; if(detail && (detail.marketing===true || detail.social===true)){ loadFacebookSDK(); setTimeout(renderPagePlugin, 1000); } }); } }
    var observer = new MutationObserver(function(mutationsList, observer){ if(window.FB && FB.XFBML && typeof FB.XFBML.parse === 'function'){ window.dispatchEvent(new Event('fb_init')); observer.disconnect(); } });
    observer.observe(document.documentElement, { childList: true, subtree: true });
  });
})();
