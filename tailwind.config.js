// tailwind.config.js
module.exports = {
  content: [
    // Assure-toi que ces chemins sont corrects pour ton projet
    "./*.html", // Pour les fichiers HTML à la racine (comme ta page test)
    "./public/**/*.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./httpdocs/**/*.php",
    "./*.php",
  ],
  theme: {
    extend: {
      fontFamily: {
        k2d: ['"K2D"', "sans-serif"],
        jakarta: ['"Plus Jakarta Sans"', "sans-serif"],
      },
      colors: {
        // Couleurs de fond et de texte
        "background-light": "#F0F5F9", // Un blanc cassé très doux, presque gris clair, pour un fond subtil
        "background-dark": "#0F1A2B", // Un bleu nuit très profond, presque noir, pour les sections importantes ou le footer
        "text-dark": "#2E3A4B", // Bleu marine foncé pour le texte principal, plus doux que du noir pur
        "text-light": "#E0E8F0", // Un gris très clair, presque blanc, pour le texte sur fond sombre

        // Couleurs principales (Tons de bleu profonds et élégants)
        "primary-light": "#5A7D9A", // Bleu acier doux, pour des éléments secondaires
        "primary-medium": "#3A5C78", // Bleu gris moyen, une base solide
        "primary-dark": "#1C3B53", // Bleu saphir profond, très élégant

        // Couleur d'accent (pour boutons, icônes, liens actifs - peut être un or, un bronze ou un bleu plus vif)
        // Option 1: Un Or/Bronze subtil pour le prestige
        accent: "#B8860B", // Goldenrod foncé, très chic
        "accent-hover": "#DAA520", // Goldenrod, plus clair pour le survol
        // Option 2: Un Bleu vif mais profond pour le dynamisme (si vous préférez rester dans les bleus)
        // 'accent': '#007FFF',          // Bleu Azur Profond
        // 'accent-hover': '#0066CC',    // Bleu plus foncé pour le survol

        // Couleurs secondaires / neutres (pour équilibrer et ajouter de la texture)
        "neutral-light": "#D6DBDF", // Gris perle, très doux
        "neutral-medium": "#9CAAB8", // Gris bleuté moyen
        "neutral-dark": "#617B8E", // Gris ardoise plus prononcé

        // Couleurs d'état (inchangées car universelles)
        success: "#3CB371",
        error: "#DC143C",
        warning: "#FFD700",
      },
    },
  },
  plugins: [],
};
