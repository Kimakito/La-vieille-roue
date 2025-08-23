// tailwind.config.js
module.exports = {
  content: [
    "./**/*.{html,md,js}",
    "./_includes/**/*.html",
    "./_layouts/**/*.html",
    "./_posts/*.md",
    "./_nouvelles/*.md",
    "/assets/js/**/*.js",
    "./index.html",
  ],
  theme: {
    extend: {
      fontFamily: {
        k2d: ['"K2D"', "sans-serif"],
        jakarta: ['"Plus Jakarta Sans"', "sans-serif"],
      },
      colors: {
        // Couleurs de fond et de texte (légèrement ajustées pour un meilleur contraste avec les nouvelles couleurs vives)
        "background-light": "#F8F8F8", // Un blanc cassé plus pur, plus lumineux
        "background-dark": "#0F1A2B", // Un bleu nuit encore plus profond, presque noir pour un contraste maximal
        "text-dark": "#2C2C3E",       // Un gris-bleu très foncé, presque noir, pour la lisibilité sur fond clair
        "text-light": "#F0F2F5",      // Un gris très clair, presque blanc, pour le texte sur fond sombre

        // Couleurs principales (Tons de bleu profonds et dynamiques)
        "primary-light": "#6B7DE5", // Un bleu moyen éclatant, dérivé de votre bleu cible
        "primary-medium": "#595959", // anthracite pour un usage polyvalent
        "primary-dark": "#2B3ABF",  // Un bleu profond et intense, pour les éléments clés et les fonds sombres

        // Couleur d'accent (un jaune vif et énergique)
        accent: "#F1C40F",       // Votre jaune souhaité, très lumineux !
        "accent-hover": "#E6B80A", // Un jaune légèrement plus foncé pour l'effet de survol

        // Couleurs secondaires / neutres (pour équilibrer et ajouter de la texture)
        "neutral-light": "#E8ECEF", // Un gris clair et propre
        "neutral-medium": "#B0B8C0", // Un gris moyen équilibré
        "neutral-dark": "#7A8288",   // Un gris plus foncé, pour les ombres ou bordures secondaires

        // Couleurs d'état (inchangées car universelles)
        success: "#3CB371",
        error: "#DC143C",
        warning: "#FFD700",
      },
    },
  },
  plugins: [],
};
