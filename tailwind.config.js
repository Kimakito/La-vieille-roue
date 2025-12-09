// tailwind.config.js
module.exports = {
    content: [
        "./*.{html,md}",
        "./_includes/**/*.html",
        "./_layouts/**/*.html",
        "./_posts/**/*.md",
        "./_nouvelles/**/*.md",
        "./assets/js/**/*.js",
    ],
    theme: {
        extend: {
            fontFamily: {
                raleway: ['"Raleway"', "sans-serif"],
                lato: ['"Lato"', "sans-serif"],
                k2d: ['"K2D"', "sans-serif"],
            },
            backgroundImage: {
                'gradient-body': 'linear-gradient(90deg, #2B3ABF 0%, #61D4E8 100%)',
            },
            colors: {
                // Couleurs de fond et de texte
                "background-light": "#F7FBFD", // blanc légèrement bleuté, cohérent avec le bleu clair
                "background-dark": "#0D1A2F", // bleu nuit presque noir, contraste fort
                "text-dark": "#1C1F2E",       // gris-bleu très sombre pour la lisibilité
                "text-light": "#F2F8FA",      // blanc bleuté pour le texte sur fond sombre

                // Couleurs principales (autour de tes deux couleurs)
                "primary-light": "#61D4E8", // ton bleu clair officiel
                "primary-medium": "#3B5BDC", // bleu intermédiaire, entre clair et foncé
                "primary-dark": "#2B3ABF",   // ton bleu profond officiel

                // Couleur d'accent (complémentaire dynamique)
                accent: "#FFB703",       // orange vif, bon contraste avec le bleu
                "accent-hover": "#E89C02", // orange plus foncé au survol

                // Couleurs secondaires / neutres
                "neutral-light": "#F2F2F2", // gris argent clair
                "neutral-medium": "#C0C0C0", // gris alu
                "neutral-dark": "#4A4A4A",   // anthracite

                // Couleurs d'état (inchangées car universelles)
                success: "#3CB371",
                error: "#DC143C",
                warning: "#FFD700",
            },
        },
    },
    plugins: [],
};
