// Effets visuels avancés : particules, compteur animé, parallax
(function() {
    'use strict';

    // Attendre que le DOM soit chargé
    function ready(fn) {
        if (document.readyState !== 'loading') fn();
        else document.addEventListener('DOMContentLoaded', fn);
    }

    ready(function() {
        
        /* ========== 1. COMPTEUR ANIMÉ POUR LES AVIS ========== */
        function animateCounter() {
            const ratingDisplay = document.querySelector('.reviews-rating-display');
            if (!ratingDisplay) return;
            
            const targetRating = 4.9;
            const duration = 2000; // 2 secondes
            const steps = 60;
            const increment = targetRating / steps;
            const stepTime = duration / steps;
            let current = 0;
            
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting && current === 0) {
                        const counter = setInterval(() => {
                            current += increment;
                            if (current >= targetRating) {
                                current = targetRating;
                                clearInterval(counter);
                            }
                            ratingDisplay.textContent = current.toFixed(1) + '/5';
                        }, stepTime);
                        observer.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.5 });
            
            observer.observe(ratingDisplay);
        }
        
        animateCounter();

        /* ========== 2. PARTICULES DORÉES (légères, optimisées) ========== */
        function createParticles() {
            const heroSections = document.querySelectorAll('section[role="banner"], .restauration-hero');
            if (heroSections.length === 0) return;
            
            heroSections.forEach(section => {
                // Créer le conteneur de particules
                const particlesContainer = document.createElement('div');
                particlesContainer.className = 'particles-container';
                particlesContainer.setAttribute('aria-hidden', 'true');
                section.style.position = 'relative';
                section.appendChild(particlesContainer);
                
                // Créer seulement 15 particules (performance)
                for (let i = 0; i < 15; i++) {
                    const particle = document.createElement('div');
                    particle.className = 'particle';
                    
                    // Position et taille aléatoires
                    const size = Math.random() * 4 + 2;
                    const left = Math.random() * 100;
                    const duration = Math.random() * 10 + 15;
                    const delay = Math.random() * 5;
                    
                    particle.style.cssText = `
                        left: ${left}%;
                        width: ${size}px;
                        height: ${size}px;
                        animation-duration: ${duration}s;
                        animation-delay: ${delay}s;
                    `;
                    
                    particlesContainer.appendChild(particle);
                }
            });
        }
        
        // Créer les particules seulement sur desktop (performance)
        if (window.innerWidth > 768) {
            createParticles();
        }

        /* ========== 3. PARALLAX LÉGER SUR LES IMAGES HERO ========== */
        function initParallax() {
            const heroImages = document.querySelectorAll('.hero-img');
            if (heroImages.length === 0) return;
            
            let ticking = false;
            
            function updateParallax() {
                const scrolled = window.pageYOffset;
                
                heroImages.forEach(img => {
                    const rect = img.getBoundingClientRect();
                    if (rect.top < window.innerHeight && rect.bottom > 0) {
                        // Parallax subtil : 30% de la vitesse du scroll
                        const yPos = scrolled * 0.3;
                        img.style.transform = `translateY(${yPos}px)`;
                    }
                });
                
                ticking = false;
            }
            
            window.addEventListener('scroll', function() {
                if (!ticking) {
                    window.requestAnimationFrame(updateParallax);
                    ticking = true;
                }
            }, { passive: true });
        }
        
        // Activer parallax seulement sur desktop
        if (window.innerWidth > 768) {
            initParallax();
        }

        /* ========== 4. BARRE DE PROGRESSION DU SCROLL ========== */
        function createScrollProgress() {
            const progressBar = document.createElement('div');
            progressBar.className = 'scroll-progress-bar';
            progressBar.setAttribute('aria-hidden', 'true');
            document.body.appendChild(progressBar);
            
            let ticking = false;
            
            function updateProgress() {
                const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
                const scrolled = (window.pageYOffset / windowHeight) * 100;
                progressBar.style.width = scrolled + '%';
                ticking = false;
            }
            
            window.addEventListener('scroll', function() {
                if (!ticking) {
                    window.requestAnimationFrame(updateProgress);
                    ticking = true;
                }
            }, { passive: true });
        }
        
        createScrollProgress();

        /* ========== 5. EFFET 3D SUR LES CARTES AU SURVOL ========== */
        function init3DCards() {
            const cards = document.querySelectorAll('.review-card, .masonry-gallery .gallery-item');
            
            cards.forEach(card => {
                card.addEventListener('mousemove', function(e) {
                    if (window.innerWidth <= 768) return; // Pas sur mobile
                    
                    const rect = card.getBoundingClientRect();
                    const x = e.clientX - rect.left;
                    const y = e.clientY - rect.top;
                    
                    const centerX = rect.width / 2;
                    const centerY = rect.height / 2;
                    
                    const rotateX = (y - centerY) / 20;
                    const rotateY = (centerX - x) / 20;
                    
                    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
                });
                
                card.addEventListener('mouseleave', function() {
                    card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(1)';
                });
            });
        }
        
        // Activer l'effet 3D seulement sur desktop
        if (window.innerWidth > 768) {
            init3DCards();
        }

        /* ========== 6. TRAÎNÉE LUMINEUSE SUR LES BOUTONS ========== */
        function initButtonTrails() {
            const buttons = document.querySelectorAll('a.bg-accent, button.bg-accent');
            
            buttons.forEach(button => {
                button.addEventListener('mousemove', function(e) {
                    if (window.innerWidth <= 768) return;
                    
                    const rect = button.getBoundingClientRect();
                    const x = e.clientX - rect.left;
                    const y = e.clientY - rect.top;
                    
                    const ripple = document.createElement('span');
                    ripple.className = 'button-ripple';
                    ripple.style.left = x + 'px';
                    ripple.style.top = y + 'px';
                    
                    button.appendChild(ripple);
                    
                    setTimeout(() => ripple.remove(), 600);
                });
            });
        }
        
        initButtonTrails();

    });
})();
