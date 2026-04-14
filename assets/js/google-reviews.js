// La Vieille Roue — Marquee avis Google
(function () {
    'use strict';

    var DATA = {
        rating: 4.9,
        total: 11,
        reviews: [
            {
                author: 'mrbenj565',
                date: 'il y a 2 semaines',
                text: 'Super travail, très arrangeant pour la prise de rendez-vous et la restitution du véhicule\u00a0! Ne pas hésiter pour la réparation de vos jantes\u00a0! 👍'
            },
            {
                author: 'Elisabeth Morardet',
                date: 'il y a 1 mois',
                text: 'Je viens de récupérer mes jantes, travail très pro vu les dégâts qu\u2019il y avait. Merci beaucoup, je recommande ce professionnel. De très bons conseils et pour sa sympathie. Encore merci.'
            },
            {
                author: 'Nicolas Jaunet',
                date: 'il y a 1 mois',
                text: 'Patron très sympa, travail rapide et efficace. Merci\u00a0!'
            },
            {
                author: 'Claire Rongvaux',
                date: 'il y a 2 mois',
                text: 'Pauvres petits belges que nous sommes, on a roulé sur une pierre qui a déformé notre jante. Après quelques adresses infructueuses, on a trouvé La Vieille Roue. Super service, notre jante en alu est comme neuve\u00a0! On espère ne pas devoir revenir\u2026 mais on note l\u2019adresse\u00a0!'
            },
            {
                author: 'Momo Shemss · Local Guide',
                date: 'il y a 2 mois',
                text: 'Service impeccable\u00a0! Jante réparée rapidement avec un résultat parfait. Équipe très professionnelle et à l\u2019écoute. Je recommande sans hésiter.'
            },
            {
                author: 'Pierre Lecomte',
                date: 'il y a 2 mois',
                text: 'Très accueillant et très professionnel. À recommander\u00a0!'
            },
            {
                author: 'Maxime Jacquemmoz',
                date: 'il y a 4 mois',
                text: 'Boulot au top, délai très court. Je recommande et reviendrai\u00a0— un vrai professionnel passionné.'
            },
            {
                author: 'Fred Rojon · Local Guide',
                date: 'il y a 5 mois',
                text: 'Super service, la rapidité et la qualité font que j\u2019ai trouvé mon réparateur de jantes. Et cerise sur le gâteau le rapport qualité/prix est top.'
            },
            {
                author: 'Florent Carrier',
                date: 'il y a 5 mois',
                text: 'Super expérience pour la réparation de ma voiture. Le travail effectué est vraiment réalisé avec soin et professionnalisme. Encore merci. Je recommande à 200\u00a0%\u00a0!'
            },
            {
                author: 'Jérôme Dou',
                date: 'il y a 5 mois',
                text: 'Professionnel au top\u00a0! Passionné\u00a0! Ils ont réalisé un super boulot sur ma voiture et la rénovation des 4 jantes, pour un tarif correct\u00a0! À recommander\u00a0!'
            }
        ]
    };

    function buildCard(review) {
        var article = document.createElement('article');
        article.className = 'review-card';
        article.setAttribute('aria-label', 'Avis de ' + review.author);
        article.innerHTML =
            '<div class="review-stars" aria-hidden="true">' +
                '<span class="review-star">\u2605</span>' +
                '<span class="review-star">\u2605</span>' +
                '<span class="review-star">\u2605</span>' +
                '<span class="review-star">\u2605</span>' +
                '<span class="review-star">\u2605</span>' +
            '</div>' +
            '<p class="review-text">\u00ab\u00a0' + review.text + '\u00a0\u00bb</p>' +
            '<p class="review-author">' + review.author + '</p>' +
            '<p class="review-date">' + review.date + '</p>';
        return article;
    }

    function init() {
        // Marquee
        var wrapper = document.querySelector('.reviews-marquee-wrapper');
        if (wrapper) {
            var track = document.createElement('div');
            track.className = 'reviews-track';
            // Doubler pour la boucle CSS infinie
            DATA.reviews.concat(DATA.reviews).forEach(function (review) {
                track.appendChild(buildCard(review));
            });
            wrapper.innerHTML = '';
            wrapper.appendChild(track);
        }

        // Méta
        document.querySelectorAll('.reviews-rating-display').forEach(function (el) {
            el.textContent = DATA.rating + '/5';
        });
        document.querySelectorAll('.reviews-count-display').forEach(function (el) {
            el.textContent = DATA.total + ' avis Google';
        });
    }

    if (document.readyState !== 'loading') {
        init();
    } else {
        document.addEventListener('DOMContentLoaded', init);
    }
})();
