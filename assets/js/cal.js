// Minimal stub for cal.js — consent-aware loader placeholder
// The real integration (Cal.com) is optional and consent-dependent.
(function(){
  // Provide a no-op loader so pages referencing /assets/js/cal.js won't 404.
  // If you later want to insert the real Cal.com widget, replace this file with the real implementation.
  window.loadCalWidget = window.loadCalWidget || function(){
    // placeholder: returns a resolved promise for compatibility
    return Promise.resolve();
  };
  // If a DOM element with id 'my-cal-inline-rdv-jantes' exists, we keep it empty.
  document.addEventListener('DOMContentLoaded', function(){
    try{
      var el = document.getElementById('my-cal-inline-rdv-jantes');
      if(el && !el.dataset.calLoaded){
        // optional: append a small fallback CTA
        var a = document.createElement('a');
        a.href = 'https://cal.com/lavieilleroue/rdv-renovation-de-jante';
        a.target = '_blank';
        a.rel = 'noopener noreferrer';
        a.textContent = 'Prendre rendez-vous (ouvrir Cal.com)';
        a.className = 'inline-block bg-accent text-primary-dark px-4 py-2 rounded';
        el.appendChild(a);
        el.dataset.calLoaded = '1';
      }
    }catch(e){/* ignore */}
  });
})();
// cal.js — consent-aware Cal.com embed loader (contact / jantes pages)
(function(){
  function ready(fn){ if(document.readyState !== 'loading') fn(); else document.addEventListener('DOMContentLoaded', fn); }
  ready(function(){
    const calContainerId = 'my-cal-inline-rdv-jantes';
    if(!document.getElementById(calContainerId)) return;

    function loadCalScriptAndInit(){
      if(window.Cal && window.Cal.loaded){ initCal(); return; }
      (function (C,A,L){ let p=function(a,ar){ a.q.push(ar); }; let d=C.document; C.Cal=C.Cal||function(){ let cal=C.Cal; let ar=arguments; if(!cal.loaded){ cal.ns={}; cal.q=cal.q||[]; d.head.appendChild(d.createElement('script')).src=A; cal.loaded=true; } if(ar[0]===L){ const api=function(){ p(api,arguments); }; const namespace=ar[1]; api.q=api.q||[]; if(typeof namespace==='string'){ cal.ns[namespace]=cal.ns[namespace]||api; p(cal.ns[namespace],ar); p(cal,['initNamespace',namespace]); } else p(cal,ar); return; } p(cal,ar); }; })(window,'https://app.cal.com/embed/embed.js','init');
      setTimeout(initCal,600);
    }

    function initCal(){ try{ Cal('init','rdv-jantes',{ origin: 'https://app.cal.com' }); Cal.ns['rdv-jantes']('inline',{ elementOrSelector:'#'+calContainerId, config:{ layout:'month_view', styles:{ branding:{ shouldDisplayBranding:false }, enableResponsive:true } }, calLink:'la-vieille-roue/rdv-jantes' }); }catch(e){ console.warn('Cal init failed', e); } }

    function checkConsentAndMaybeLoad(){ try{ let consent=null; if(typeof window.getCookieConsent==='function') consent=window.getCookieConsent(); else { const raw=localStorage.getItem('cookieConsent'); consent = raw? JSON.parse(raw): null; } if(consent && consent.marketing===true){ loadCalScriptAndInit(); return true; } }catch(e){ } return false; }

    const loaded = checkConsentAndMaybeLoad();
    if(!loaded){ const container=document.getElementById(calContainerId); if(container){ container.innerHTML = '<div class="p-6 text-center"><p class="mb-3">Module de prise de rendez-vous désactivé (consentement requis).</p></div>'; const btn = document.createElement('button'); btn.className='mt-4 bg-accent text-primary-dark font-bold py-2 px-4 rounded'; btn.textContent='Afficher le module de rendez-vous (autoriser)'; btn.onclick = function(){ try{ const current = (typeof window.getCookieConsent==='function') ? window.getCookieConsent() : (JSON.parse(localStorage.getItem('cookieConsent')||'{}')); const updated = Object.assign({}, current||{}, { marketing:true }); localStorage.setItem('cookieConsent', JSON.stringify(updated)); window.dispatchEvent(new CustomEvent('cookieConsentChanged', { detail: updated })); }catch(e){ localStorage.setItem('cookieConsent', JSON.stringify({ essential:true, analytics:false, marketing:true })); window.dispatchEvent(new CustomEvent('cookieConsentChanged', { detail: { essential:true, analytics:false, marketing:true } })); } loadCalScriptAndInit(); }; container.appendChild(btn); window.addEventListener('cookieConsentChanged', function(e){ const detail = e && e.detail ? e.detail : null; if(detail && detail.marketing === true) loadCalScriptAndInit(); }); } }
  });
})();
