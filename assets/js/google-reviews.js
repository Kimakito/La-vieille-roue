// Google Reviews Integration
// Place ID: 4223589188251940400

class GoogleReviews {
    constructor(placeId) {
        this.placeId = placeId;
        this.apiKey = null; // À configurer avec votre clé API Google Places
    }

    // Configuration pour affichage manuel des avis
    displayManualReviews() {
        const reviewsData = {
            averageRating: 5.0,
            totalReviews: 3,
            reviews: [
                {
                    rating: 5,
                    text: "Super expérience pour la réparation de ma voiture. Le travail effectué est vraiment réalisé avec soin et professionnalisme.",
                    author: "Florent Carrier",
                    date: "08/11/2025"
                },
                {
                    rating: 5,
                    text: "Professionnel au top ! Passionné ! Ils ont réalisé un super boulot sur ma voiture et la rénovation des 4 jantes, pour un tarif correct ! À recommander !",
                    author: "Jérôme Dou",
                    date: "05/11/2025"
                },
                {
                    rating: 5,
                    text: "Super service, la rapidité et la qualité font que j'ai trouvé mon réparateur de jantes. Et cerise sur le gâteau le rapport qualité/prix est top.",
                    author: "Fred Rojon",
                    date: "28/10/2025"
                }
            ]
        };

        this.updateReviewsDisplay(reviewsData);
    }

    // Mise à jour de l'affichage des avis
    updateReviewsDisplay(data) {
        // Mise à jour de la note moyenne
        const ratingElements = document.querySelectorAll('.reviews-rating-display');
        ratingElements.forEach(el => {
            el.textContent = `${data.averageRating}/5`;
        });

        // Mise à jour du nombre d'avis
        const countElements = document.querySelectorAll('.reviews-count-display');
        countElements.forEach(el => {
            el.textContent = `Basé sur ${data.totalReviews} avis Google`;
        });

        // Affichage des avis individuels
        this.displayIndividualReviews(data.reviews);
    }

    // Afficher les avis individuels
    displayIndividualReviews(reviews) {
        const reviewsGrid = document.querySelector('.reviews-grid');
        if (!reviewsGrid) return;

        reviewsGrid.innerHTML = '';
        
        reviews.forEach((review, index) => {
            const reviewCard = document.createElement('div');
            reviewCard.className = 'review-card';
            reviewCard.style.animationDelay = `${(index + 1) * 0.1}s`;
            
            reviewCard.innerHTML = `
                <div class="flex items-center mb-4">
                    <div class="review-stars mr-3">
                        ${this.generateStars(review.rating)}
                    </div>
                    <span class="text-sm text-primary font-medium">${review.rating}/5</span>
                </div>
                <p class="text-primary mb-6 leading-relaxed text-base">"${review.text}"</p>
                <div class="flex justify-between items-center text-sm">
                    <strong class="text-primary font-semibold">${review.author}</strong>
                    <span class="text-primary opacity-75">${review.date}</span>
                </div>
            `;
            
            reviewsGrid.appendChild(reviewCard);
        });
    }

    // Générer les étoiles visuelles
    generateStars(rating) {
        const fullStars = Math.floor(rating);
        let starsHtml = '';
        
        for (let i = 0; i < 5; i++) {
            if (i < fullStars) {
                starsHtml += '<span class="review-star">★</span>';
            } else {
                starsHtml += '<span class="review-star opacity-30">☆</span>';
            }
        }
        
        return starsHtml;
    }

    // Fonction pour mettre à jour avec les vrais avis (appel manuel)
    updateWithRealReviews(realReviewsData) {
        console.log('Mise à jour avec les vrais avis:', realReviewsData);
        this.updateReviewsDisplay(realReviewsData);
        
        // Sauvegarder en localStorage pour persistance
        localStorage.setItem('lavieilleroue_reviews', JSON.stringify(realReviewsData));
    }

    // Charger les avis sauvegardés
    loadSavedReviews() {
        const saved = localStorage.getItem('lavieilleroue_reviews');
        if (saved) {
            const data = JSON.parse(saved);
            this.updateReviewsDisplay(data);
            return true;
        }
        return false;
    }

    // Initialisation
    init() {
        // Essayer de charger les avis sauvegardés, sinon afficher les données manuelles
        if (!this.loadSavedReviews()) {
            this.displayManualReviews();
        }
    }
}

// Initialisation au chargement de la page
document.addEventListener('DOMContentLoaded', function() {
    const googleReviews = new GoogleReviews('4223589188251940400');
    googleReviews.init();
    
    // Exposer globalement pour mise à jour manuelle si besoin
    window.GoogleReviews = googleReviews;
});

// Fonction helper pour mise à jour rapide depuis la console
function updateReviews(averageRating, totalReviews, reviewsArray) {
    if (window.GoogleReviews) {
        window.GoogleReviews.updateWithRealReviews({
            averageRating: averageRating,
            totalReviews: totalReviews,
            reviews: reviewsArray
        });
    }
}