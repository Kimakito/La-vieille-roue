/**
 * Optimisation LCP (Largest Contentful Paint)
 * Améliore le temps de chargement du plus grand élément visible
 */

(function() {
  'use strict';
  
  /**
   * Précharge les ressources critiques pour le LCP
   */
  function preloadCriticalResources() {
    // Précharger les images hero en priorité
    const heroImages = document.querySelectorAll('img[fetchpriority="high"], img[loading="eager"]');
    
    heroImages.forEach(img => {
      if (img.srcset) {
        // Créer un link preload pour l'image responsive
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'image';
        link.imagesrcset = img.srcset;
        link.imagesizes = img.sizes || '100vw';
        link.fetchPriority = 'high';
        document.head.appendChild(link);
      }
    });
  }
  
  /**
   * Optimise le rendu des fonts pour éviter FOIT/FOUT
   */
  function optimizeFontLoading() {
    // Utiliser Font Loading API si disponible
    if ('fonts' in document) {
      // Précharger les fonts critiques
      const criticalFonts = [
        new FontFace('Raleway', 'url(/assets/fonts/Raleway/static/Raleway-Bold.ttf)', {
          weight: '700',
          display: 'swap'
        }),
        new FontFace('K2D', 'url(/assets/fonts/K2D/K2D-Regular.ttf)', {
          weight: '400',
          display: 'swap'
        })
      ];
      
      // Charger les fonts en parallèle
      Promise.all(criticalFonts.map(font => font.load()))
        .then(fonts => {
          fonts.forEach(font => document.fonts.add(font));
        })
        .catch(err => console.warn('Font loading error:', err));
    }
  }
  
  /**
   * Préconnexion aux domaines externes critiques
   */
  function preconnectOrigins() {
    const origins = [
      'https://fonts.googleapis.com',
      'https://fonts.gstatic.com'
    ];
    
    origins.forEach(origin => {
      // Vérifier si la préconnexion n'existe pas déjà
      const existing = document.querySelector(`link[rel="preconnect"][href="${origin}"]`);
      if (!existing) {
        const link = document.createElement('link');
        link.rel = 'preconnect';
        link.href = origin;
        link.crossOrigin = 'anonymous';
        document.head.appendChild(link);
      }
    });
  }
  
  /**
   * Évite les Layout Shifts en définissant les dimensions d'images
   */
  function preventLayoutShifts() {
    const images = document.querySelectorAll('img:not([width]):not([height])');
    
    images.forEach(img => {
      // Définir aspect-ratio si les dimensions sont connues via dataset
      if (img.dataset.width && img.dataset.height) {
        const aspectRatio = img.dataset.width / img.dataset.height;
        img.style.aspectRatio = aspectRatio;
      }
    });
  }
  
  /**
   * Mesure et log les métriques LCP
   */
  function measureLCP() {
    if ('PerformanceObserver' in window) {
      try {
        const observer = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const lastEntry = entries[entries.length - 1];
          
          console.log('🎯 LCP:', lastEntry.renderTime || lastEntry.loadTime, 'ms');
          console.log('   Element:', lastEntry.element);
          
          // Envoyer à analytics si configuré
          if (window.gtag) {
            window.gtag('event', 'LCP', {
              value: Math.round(lastEntry.renderTime || lastEntry.loadTime),
              metric_id: 'LCP',
              metric_value: lastEntry.renderTime || lastEntry.loadTime,
              metric_delta: lastEntry.renderTime || lastEntry.loadTime
            });
          }
        });
        
        observer.observe({ type: 'largest-contentful-paint', buffered: true });
      } catch (e) {
        console.warn('LCP measurement unavailable');
      }
    }
  }
  
  /**
   * Optimise les images du viewport initial
   */
  function optimizeAboveFoldImages() {
    const viewportHeight = window.innerHeight;
    const images = document.querySelectorAll('img');
    
    images.forEach(img => {
      const rect = img.getBoundingClientRect();
      const isAboveFold = rect.top < viewportHeight;
      
      if (isAboveFold) {
        // Forcer le chargement immédiat
        img.loading = 'eager';
        
        // Augmenter la priorité si c'est une grande image
        if (rect.width * rect.height > 50000) { // > 50k pixels
          img.fetchPriority = 'high';
        }
      }
    });
  }
  
  /**
   * Réduit le temps de chargement CSS critique
   */
  function optimizeCriticalCSS() {
    // Détecter et inliner le CSS critique pour le viewport initial
    // Cette partie est généralement faite au build time
    const styleSheets = document.styleSheets;
    
    // Marquer les feuilles de style non-critiques pour chargement asynchrone
    Array.from(styleSheets).forEach(sheet => {
      try {
        if (sheet.href && !sheet.href.includes('output.css')) {
          sheet.disabled = true;
          
          // Recharger de façon asynchrone après le LCP
          setTimeout(() => {
            sheet.disabled = false;
          }, 1000);
        }
      } catch (e) {
        // Cross-origin stylesheet
      }
    });
  }
  
  /**
   * Initialisation
   */
  function init() {
    // Exécuter immédiatement (avant DOMContentLoaded)
    preconnectOrigins();
    
    // Au chargement du DOM
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => {
        preloadCriticalResources();
        optimizeFontLoading();
        preventLayoutShifts();
        optimizeAboveFoldImages();
        measureLCP();
      });
    } else {
      preloadCriticalResources();
      optimizeFontLoading();
      preventLayoutShifts();
      optimizeAboveFoldImages();
      measureLCP();
    }
  }
  
  // Lancer immédiatement
  init();
  
})();
