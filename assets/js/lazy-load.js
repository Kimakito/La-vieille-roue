/**
 * Lazy Loading optimisé avec Intersection Observer
 * Améliore les performances en chargeant les images uniquement quand nécessaire
 */

(function() {
  'use strict';
  
  // Configuration
  const CONFIG = {
    rootMargin: '50px 0px', // Commence à charger 50px avant que l'image soit visible
    threshold: 0.01,
    fadeInDuration: 300
  };
  
  // Vérifier le support de l'Intersection Observer
  if (!('IntersectionObserver' in window)) {
    console.warn('IntersectionObserver non supporté, chargement immédiat des images');
    loadAllImages();
    return;
  }
  
  /**
   * Observer pour le lazy loading
   */
  const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        loadImage(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, CONFIG);
  
  /**
   * Charge une image avec effet de fondu
   */
  function loadImage(img) {
    // Pour les <picture>, charger la <img> à l'intérieur
    const actualImg = img.tagName === 'PICTURE' ? img.querySelector('img') : img;
    if (!actualImg) return;
    
    // Éviter de charger deux fois
    if (actualImg.dataset.loaded === 'true') return;
    
    // Gérer les srcset et src
    if (actualImg.dataset.srcset) {
      actualImg.srcset = actualImg.dataset.srcset;
      actualImg.removeAttribute('data-srcset');
    }
    
    if (actualImg.dataset.src) {
      actualImg.src = actualImg.dataset.src;
      actualImg.removeAttribute('data-src');
    }
    
    // Pour les <source> dans <picture>
    if (img.tagName === 'PICTURE') {
      img.querySelectorAll('source[data-srcset]').forEach(source => {
        source.srcset = source.dataset.srcset;
        source.removeAttribute('data-srcset');
      });
    }
    
    // Effet de fondu au chargement
    actualImg.style.opacity = '0';
    actualImg.style.transition = `opacity ${CONFIG.fadeInDuration}ms ease-in-out`;
    
    actualImg.addEventListener('load', function onLoad() {
      actualImg.style.opacity = '1';
      actualImg.dataset.loaded = 'true';
      actualImg.removeEventListener('load', onLoad);
      
      // Dispatch event pour analytics ou autres
      actualImg.dispatchEvent(new CustomEvent('lazyloaded', { bubbles: true }));
    });
    
    // Gestion des erreurs
    actualImg.addEventListener('error', function onError() {
      console.error('Erreur de chargement:', actualImg.src || actualImg.srcset);
      actualImg.removeEventListener('error', onError);
    });
  }
  
  /**
   * Fallback: charge toutes les images immédiatement
   */
  function loadAllImages() {
    document.querySelectorAll('img[data-src], img[data-srcset], picture').forEach(img => {
      loadImage(img);
    });
  }
  
  /**
   * Initialise le lazy loading
   */
  function init() {
    // Sélectionner toutes les images avec data-src ou data-srcset
    const lazyImages = document.querySelectorAll('img[data-src], img[data-srcset]');
    const lazyPictures = document.querySelectorAll('picture');
    
    // Observer chaque image
    lazyImages.forEach(img => {
      // Ne pas lazy-load les images critiques (hero, above-fold)
      if (img.loading === 'eager' || img.fetchPriority === 'high') {
        loadImage(img);
      } else {
        img.loading = 'lazy'; // Utiliser le lazy loading natif en complément
        imageObserver.observe(img);
      }
    });
    
    // Observer les pictures
    lazyPictures.forEach(picture => {
      const img = picture.querySelector('img');
      if (img && (img.loading !== 'eager' && img.fetchPriority !== 'high')) {
        imageObserver.observe(picture);
      }
    });
    
    console.log(`🖼️ Lazy loading activé pour ${lazyImages.length + lazyPictures.length} éléments`);
  }
  
  /**
   * Précharge les images critiques
   */
  function preloadCriticalImages() {
    const criticalImages = document.querySelectorAll('img[fetchpriority="high"], img[loading="eager"]');
    criticalImages.forEach(img => {
      if (img.dataset.src) {
        img.src = img.dataset.src;
        img.removeAttribute('data-src');
      }
      if (img.dataset.srcset) {
        img.srcset = img.dataset.srcset;
        img.removeAttribute('data-srcset');
      }
    });
  }
  
  // Initialisation au chargement du DOM
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      preloadCriticalImages();
      init();
    });
  } else {
    preloadCriticalImages();
    init();
  }
  
  // Support du lazy loading pour le contenu chargé dynamiquement
  window.lazyLoadObserver = imageObserver;
  
})();
