#!/usr/bin/env node
/**
 * Vérification d'accessibilité - Contraste des couleurs
 * Vérifie que tous les contrastes respectent les normes WCAG 2.1
 */

// Couleurs du site (depuis tailwind.config.js)
const COLORS = {
  'background-light': '#F7FBFD',
  'background-dark': '#0D1A2F',
  'text-dark': '#1C1F2E',
  'text-light': '#F2F8FA',
  'primary-light': '#61D4E8',
  'primary-medium': '#3B5BDC',
  'primary-dark': '#2B3ABF',
  'accent': '#FFB703',
  'accent-hover': '#E89C02',
  'accent-dark': '#CC9302',
  'neutral-light': '#F2F2F2',
  'neutral-medium': '#C0C0C0',
  'neutral-dark': '#4A4A4A',
  'success': '#1F7A48',
  'error': '#DC143C',
  'warning': '#FFD700',
  'white': '#FFFFFF',
  'black': '#000000'
};

// Normes WCAG 2.1
const WCAG_STANDARDS = {
  AA_NORMAL: 4.5,      // Texte normal (< 18pt ou < 14pt gras)
  AA_LARGE: 3.0,       // Texte large (≥ 18pt ou ≥ 14pt gras)
  AAA_NORMAL: 7.0,     // Texte normal niveau AAA
  AAA_LARGE: 4.5       // Texte large niveau AAA
};

/**
 * Convertit hex en RGB
 */
function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}

/**
 * Calcule la luminance relative (WCAG formula)
 */
function getLuminance(hex) {
  const rgb = hexToRgb(hex);
  if (!rgb) return 0;
  
  const [r, g, b] = [rgb.r, rgb.g, rgb.b].map(val => {
    val = val / 255;
    return val <= 0.03928 ? val / 12.92 : Math.pow((val + 0.055) / 1.055, 2.4);
  });
  
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/**
 * Calcule le ratio de contraste selon WCAG
 */
function getContrastRatio(color1, color2) {
  const lum1 = getLuminance(color1);
  const lum2 = getLuminance(color2);
  const lighter = Math.max(lum1, lum2);
  const darker = Math.min(lum1, lum2);
  
  return (lighter + 0.05) / (darker + 0.05);
}

/**
 * Évalue le niveau de conformité WCAG
 */
function evaluateContrast(ratio, isLargeText = false) {
  const minRatio = isLargeText ? WCAG_STANDARDS.AA_LARGE : WCAG_STANDARDS.AA_NORMAL;
  const aaaRatio = isLargeText ? WCAG_STANDARDS.AAA_LARGE : WCAG_STANDARDS.AAA_NORMAL;
  
  if (ratio >= aaaRatio) {
    return { level: 'AAA', pass: true, icon: '🟢' };
  } else if (ratio >= minRatio) {
    return { level: 'AA', pass: true, icon: '🟡' };
  } else {
    return { level: 'FAIL', pass: false, icon: '🔴' };
  }
}

/**
 * Suggestions d'amélioration
 */
function suggestImprovement(fgColor, bgColor, ratio, targetRatio) {
  const fgLum = getLuminance(fgColor);
  const bgLum = getLuminance(bgColor);
  
  if (fgLum > bgLum) {
    return `Éclaircir le texte ou assombrir le fond pour atteindre ${targetRatio}:1`;
  } else {
    return `Assombrir le texte ou éclaircir le fond pour atteindre ${targetRatio}:1`;
  }
}

/**
 * Vérifie les combinaisons courantes
 */
function checkCommonCombinations() {
  console.log('🎨 VÉRIFICATION DES CONTRASTES DE COULEURS\n');
  console.log('Normes WCAG 2.1:');
  console.log('  • AA (normal) : 4.5:1 minimum');
  console.log('  • AA (large)  : 3.0:1 minimum');
  console.log('  • AAA (normal): 7.0:1 optimal');
  console.log('  • AAA (large) : 4.5:1 optimal\n');
  console.log('='.repeat(80) + '\n');
  
  const combinations = [
    // Texte sur fond clair
    { fg: 'text-dark', bg: 'background-light', context: 'Texte principal sur fond clair', large: false },
    { fg: 'text-dark', bg: 'white', context: 'Texte sur blanc (boutons)', large: false },
    { fg: 'primary-dark', bg: 'white', context: '"Jantes 73" sur blanc', large: true },
    { fg: 'accent', bg: 'background-light', context: 'Accent sur fond clair', large: false },
    
    // Texte sur fond sombre
    { fg: 'text-light', bg: 'background-dark', context: 'Texte sur fond sombre (footer)', large: false },
    { fg: 'text-light', bg: 'primary-dark', context: 'Texte sur fond bleu foncé', large: false },
    { fg: 'accent', bg: 'background-dark', context: 'Accent sur fond sombre', large: false },
    { fg: 'accent', bg: 'primary-dark', context: '"La Vieille Roue" sur bleu', large: true },
    
    // Boutons et éléments interactifs
    { fg: 'primary-dark', bg: 'accent', context: 'Texte bouton CTA (accent)', large: false },
    { fg: 'text-light', bg: 'primary-dark', context: 'Badge bleu foncé', large: false },
    { fg: 'primary-dark', bg: 'accent', context: 'Icônes sur accent', large: true },
    
    // États et couleurs secondaires
    { fg: 'white', bg: 'success', context: 'Texte sur succès', large: false },
    { fg: 'white', bg: 'error', context: 'Texte sur erreur', large: false },
    { fg: 'text-dark', bg: 'warning', context: 'Texte sur warning', large: false },
    
    // Liens et texte coloré
    { fg: 'primary-medium', bg: 'background-light', context: 'Liens bleus sur fond clair', large: false },
    { fg: 'neutral-dark', bg: 'background-light', context: 'Texte secondaire', large: false },
  ];
  
  let totalTests = 0;
  let passedAA = 0;
  let passedAAA = 0;
  let failed = 0;
  
  const issues = [];
  
  combinations.forEach(({ fg, bg, context, large }) => {
    const fgColor = COLORS[fg];
    const bgColor = COLORS[bg];
    
    if (!fgColor || !bgColor) {
      console.log(`⚠️  Couleur manquante: ${fg} ou ${bg}`);
      return;
    }
    
    const ratio = getContrastRatio(fgColor, bgColor);
    const evaluation = evaluateContrast(ratio, large);
    
    totalTests++;
    
    if (evaluation.level === 'AAA') passedAAA++;
    else if (evaluation.level === 'AA') passedAA++;
    else failed++;
    
    const textSize = large ? '(texte large)' : '(texte normal)';
    
    console.log(`${evaluation.icon} ${evaluation.level.padEnd(4)} | ${ratio.toFixed(2)}:1 | ${context} ${textSize}`);
    console.log(`   ${fg} (#${fgColor}) sur ${bg} (#${bgColor})`);
    
    if (!evaluation.pass) {
      const targetRatio = large ? WCAG_STANDARDS.AA_LARGE : WCAG_STANDARDS.AA_NORMAL;
      const suggestion = suggestImprovement(fgColor, bgColor, ratio, targetRatio);
      console.log(`   💡 ${suggestion}`);
      issues.push({ fg, bg, context, ratio, suggestion });
    }
    
    console.log('');
  });
  
  // Résumé
  console.log('='.repeat(80));
  console.log(`\n📊 RÉSUMÉ (${totalTests} tests)`);
  console.log(`   🟢 AAA  : ${passedAAA} (${((passedAAA/totalTests)*100).toFixed(1)}%)`);
  console.log(`   🟡 AA   : ${passedAA} (${((passedAA/totalTests)*100).toFixed(1)}%)`);
  console.log(`   🔴 ÉCHEC: ${failed} (${((failed/totalTests)*100).toFixed(1)}%)`);
  
  if (failed > 0) {
    console.log(`\n⚠️  ${failed} problème(s) d'accessibilité détecté(s)\n`);
    console.log('RECOMMANDATIONS:\n');
    issues.forEach((issue, i) => {
      console.log(`${i + 1}. ${issue.context}`);
      console.log(`   Contraste actuel: ${issue.ratio.toFixed(2)}:1`);
      console.log(`   ${issue.suggestion}\n`);
    });
  } else {
    console.log('\n✅ Toutes les combinaisons respectent au minimum le niveau AA WCAG 2.1');
  }
  
  return { totalTests, passedAA, passedAAA, failed, issues };
}

/**
 * Fonction principale
 */
function main() {
  const results = checkCommonCombinations();
  
  console.log('\n📖 Documentation: https://www.w3.org/WAI/WCAG21/Understanding/contrast-minimum.html');
  console.log('='.repeat(80) + '\n');
  
  process.exit(results.failed > 0 ? 1 : 0);
}

if (require.main === module) {
  main();
}

module.exports = { getContrastRatio, evaluateContrast, checkCommonCombinations };
