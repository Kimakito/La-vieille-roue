// tailwind.config.js
module.exports = {
  content: [
    // Assure-toi que ces chemins sont corrects pour ton projet
    './*.html', // Pour les fichiers HTML à la racine (comme ta page test)
    './public/**/*.html',
    './src/**/*.{js,ts,jsx,tsx}',
    './httpdocs/**/*.php',
    './*.php',
  ],
  theme: {
    extend: {
      fontFamily: {
        k2d: ['"K2D"', 'sans-serif'],
				jakarta: ['"Plus Jakarta Sans"', 'sans-serif'],
			},
      colors: {
        // Couleurs de fond et de texte
        'background-light': '#F8F8FF',   // Un blanc très léger
        'background-dark': '#213f77',    // Le bleu marine profond (ton ancien 'background')
        'text-dark': '#333333',          // Gris très foncé pour le texte principal
        'text-light': '#FFFFFF',         // Blanc pour le texte sur fond sombre

        // Couleurs principales (ton bleu clair de référence)
        'primary-light': '#E0FFFF',      // Bleu Azur Pâle (ton "background" initial, mais maintenant le fond principal du site)
        'primary-medium': '#ADD8E6',     // Bleu Ciel Doux
        'primary-dark': '#4682B4',       // Bleu Acier

        // Couleur d'accent (pour boutons, icônes, liens actifs)
        'accent': '#00BFFF',             // Bleu Ciel Vif
        'accent-hover': '#1E90FF',       // Bleu un peu plus foncé pour le survol

        // Couleurs secondaires / neutres
        'neutral-light': '#D3D3D3',      // Gris clair
        'neutral-medium': '#B0C4DE',     // Gris-bleu clair
        'neutral-dark': '#708090',       // Gris Ardoise

        // Couleurs d'état (optionnel, pour messages succès/erreur)
        'success': '#3CB371',
        'error': '#DC143C',
        'warning': '#FFD700',
      }
    }
  },
  plugins: [],
}