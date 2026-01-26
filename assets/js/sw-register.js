// Service Worker Registration
// Enregistre le Service Worker pour activer le cache intelligent

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/sw.js')
      .then((registration) => {
        console.log('✅ Service Worker enregistré:', registration.scope);
        
        // Vérifier les mises à jour
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              // Nouveau SW disponible, proposer un rechargement
              if (confirm('Une nouvelle version du site est disponible. Recharger ?')) {
                newWorker.postMessage('skipWaiting');
                window.location.reload();
              }
            }
          });
        });
      })
      .catch((error) => {
        console.error('❌ Erreur Service Worker:', error);
      });
    
    // Recharger lors de l'activation d'un nouveau SW
    let refreshing = false;
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      if (!refreshing) {
        refreshing = true;
        window.location.reload();
      }
    });
  });
}
