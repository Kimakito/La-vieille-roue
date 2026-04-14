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
                'gradient-body': 'linear-gradient(180deg, #0D1A2F 0%, #0F1E35 100%)',
            },
            colors: {
                // Couleurs de fond et de texte
                "background-light": "#F7FBFD", // blanc légèrement bleuté
                "background-dark": "#0D1A2F", // bleu nuit presque noir
                "text-dark": "#1C1F2E",       // gris-bleu très sombre
                "text-light": "#F2F8FA",      // blanc bleuté

                // Couleurs principales
                "primary-light": "#61D4E8", // bleu clair officiel
                "primary-medium": "#3B5BDC", // bleu intermédiaire
                "primary-dark": "#2B3ABF",   // bleu profond officiel

                // Couleur d'accent (complémentaire)
                accent: "#FFB703",       // orange vif
                "accent-hover": "#E89C02", // orange plus foncé
                "accent-dark": "#CC9302",   // version plus foncée

                // Couleurs secondaires / neutres
                "neutral-light": "#F2F2F2",
                "neutral-medium": "#C0C0C0",
                "neutral-dark": "#4A4A4A",

                // Couleurs d'état
                success: "#1F7A48",
                error: "#DC143C",
                warning: "#FFD700",
            },
        },
    },
    plugins: [],
};
