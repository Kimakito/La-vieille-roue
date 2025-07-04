document.addEventListener('DOMContentLoaded', () => {
    // ============================ //
    //          SLIDER HANDLER      //
    // ============================ //
     document.addEventListener('DOMContentLoaded', () => {
        const rangeInput = document.getElementById('rangeInput');
        const distanceValue = document.getElementById('distanceValue');

        // Vérification des éléments
        if (rangeInput && distanceValue) {
            rangeInput.addEventListener('input', () => {
                distanceValue.textContent = `${rangeInput.value} km`;
            });
        } else {
            console.error('Les éléments avec les IDs rangeInput ou distanceValue sont manquants.');
        }
    });


    // ============================ //
    //          SHOW MORE BTN       //
    // ============================ //
        document.querySelectorAll('.showMoreBtn').forEach(button => {
        button.addEventListener('click', () => {
            const parent = button.closest('div'); // Trouve le parent contenant les éléments
            const dots = parent.querySelector('.dots');
            const more = parent.querySelector('.more');

            if (dots.style.display === 'none') {
                dots.style.display = 'inline';
                more.style.display = 'none';
                button.textContent = 'Afficher plus';
            } else {
                dots.style.display = 'none';
                more.style.display = 'inline';
                button.textContent = 'Afficher moins';
            }
        });
    });


   // ================================== //
    //          Gestion des favoris       //
    // ================================== //

    // Fonction pour lire les cookies
    function getCookie(name) {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
        return null;
    }

    // Fonction pour définir un cookie
    function setCookie(name, value, days) {
        const expires = new Date();
        expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000));
        document.cookie = `${name}=${value}; path=/; expires=${expires.toUTCString()}; SameSite=Lax; Secure`;
    }

    // Fonction pour supprimer un cookie
    function deleteCookie(name) {
        document.cookie = `${name}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;`;
    }

    // Gestion des favoris : ajout/suppression
    function handleFavoriteButton(button) {
        const annonceId = parseInt(button.getAttribute('data-id-annonce'), 10);
        const heartIcon = button.querySelector('span');
        let favoris = [];
        try {
            favoris = JSON.parse(getCookie('favoris') || '[]').map(id => parseInt(id, 10));
        } catch (e) {
            console.error("Erreur lors de la lecture des favoris :", e);
        }

        const isFavori = favoris.includes(annonceId);

        // Ajout ou suppression dans les favoris
        if (isFavori) {
            favoris = favoris.filter(id => id !== annonceId);
        } else {
            favoris.push(annonceId);
        }

        // Mise à jour des cookies
        setCookie('favoris', JSON.stringify(favoris), 30);

        // Mise à jour des classes du bouton
        if (isFavori) {
            heartIcon.classList.remove('icon-heart-full');
            heartIcon.classList.add('icon-coeur');
        } else {
            heartIcon.classList.remove('icon-coeur');
            heartIcon.classList.add('icon-heart-full');
        }

        // Met à jour dynamiquement la section des favoris si elle existe
        refreshFavoritesSection();
    }

    // Rafraîchissement dynamique des favoris
    function refreshFavoritesSection() {
        const favoris = JSON.parse(getCookie('favoris') || '[]');
        const favoritesContainer = document.getElementById('favoritesContainer');
        if (!favoritesContainer) return; // Si le conteneur n'existe pas

        // Si aucun favori, afficher un message
        if (favoris.length === 0) {
            favoritesContainer.innerHTML = `
                <p class="text-center text-gray-500">Aucune annonce favorite trouvée.</p>
            `;
            return;
        }

        // Ajouter les gestionnaires pour les boutons "Supprimer"
        document.querySelectorAll('.removeFavorite').forEach(button => {
            button.addEventListener('click', () => handleRemoveFavorite(button));
        });
    }

    // Gestion de la suppression d'un favori spécifique
    function handleRemoveFavorite(annonceId) {
        let favorites = JSON.parse(getCookie('favoris') || '[]');

        // Suppression
        favorites = favorites.filter(id => id !== annonceId);
        setCookie('favoris', JSON.stringify(favorites), 30);


        // Mise à jour visuelle
        const elementToRemove = document.querySelector(`[data-id="${annonceId}"]`).closest('.favorite-item');
        if (elementToRemove) {
            elementToRemove.remove();
        }
    }
    document.querySelectorAll('.removeFavorite').forEach(button => {
        button.addEventListener('click', function () {
            const annonceId = parseInt(this.getAttribute('data-id'), 10);
            handleRemoveFavorite(annonceId);
        });
    });

    // Gestion de la suppression de tous les favoris
    function handleClearAllFavorites() {
        deleteCookie('favoris');

        // Vider dynamiquement la section des favoris
        const favoritesContainer = document.getElementById('favoritesContainer');
        if (favoritesContainer) {
            favoritesContainer.innerHTML = `
                <p class="text-center text-gray-500">Aucune annonce favorite trouvée.</p>
            `;
        }
        // Recharger la page pour refléter les changements
        location.reload();
    }

    // Initialisation des événements
    document.querySelectorAll('.heartBtn').forEach(button => {
        button.addEventListener('click', () => handleFavoriteButton(button));
    });

    // Gestion de la suppression de tous les favoris
    const clearFavoritesBtn = document.getElementById('clearFavoritesBtn');
    if (clearFavoritesBtn) {
        clearFavoritesBtn.addEventListener('click', handleClearAllFavorites);
    }

    // Initialisation au chargement pour refléter les favoris existants
    function initializeFavorites() {
        const favoris = JSON.parse(getCookie('favoris') || '[]').map(id => parseInt(id, 10));
        document.querySelectorAll('.heartBtn').forEach(button => {
            const annonceId = parseInt(button.getAttribute('data-id-annonce'), 10);
            const heartIcon = button.querySelector('span');
            if (favoris.includes(annonceId)) {
                heartIcon.classList.add('icon-heart-full');
                heartIcon.classList.remove('icon-coeur');
            } else {
                heartIcon.classList.add('icon-coeur');
                heartIcon.classList.remove('icon-heart-full');
            }
        });
    }

    // Appeler l'initialisation
    initializeFavorites();
    
});
