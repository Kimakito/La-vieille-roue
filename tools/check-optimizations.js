#!/usr/bin/env node
/**
 * Script de vérification des optimisations
 * Vérifie que toutes les optimisations sont correctement configurées
 */

const fs = require('fs');
const path = require('path');

const checks = [];
let passed = 0;
let failed = 0;

function check(name, condition, fix = '') {
  const result = condition();
  checks.push({ name, passed: result, fix });
  
  if (result) {
    console.log(`✅ ${name}`);
    passed++;
  } else {
    console.log(`❌ ${name}`);
    if (fix) console.log(`   💡 Fix: ${fix}`);
    failed++;
  }
}

console.log('🔍 Vérification des optimisations...\n');

// Vérifier Service Worker
check(
  'Service Worker existe',
  () => fs.existsSync(path.join(__dirname, '..', 'sw.js')),
  'Le fichier sw.js devrait être à la racine du projet'
);

check(
  'Script d\'enregistrement SW existe',
  () => fs.existsSync(path.join(__dirname, '..', 'assets', 'js', 'sw-register.js'))
);

// Vérifier lazy loading
check(
  'Script de lazy loading existe',
  () => fs.existsSync(path.join(__dirname, '..', 'assets', 'js', 'lazy-load.js'))
);

// Vérifier LCP optimizer
check(
  'Optimiseur LCP existe',
  () => fs.existsSync(path.join(__dirname, '..', 'assets', 'js', 'lcp-optimizer.js'))
);

// Vérifier page offline
check(
  'Page offline existe',
  () => fs.existsSync(path.join(__dirname, '..', 'offline.html'))
);

// Vérifier netlify.toml
check(
  'Configuration Netlify existe',
  () => {
    const netlifyPath = path.join(__dirname, '..', 'netlify.toml');
    if (!fs.existsSync(netlifyPath)) return false;
    const content = fs.readFileSync(netlifyPath, 'utf8');
    return content.includes('X-Frame-Options') && content.includes('Content-Security-Policy');
  },
  'Vérifier que netlify.toml contient les headers de sécurité'
);

// Vérifier scripts dans package.json
check(
  'Scripts de build configurés',
  () => {
    const pkgPath = path.join(__dirname, '..', 'package.json');
    if (!fs.existsSync(pkgPath)) return false;
    const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
    return pkg.scripts && 
           pkg.scripts['minify:js'] && 
           pkg.scripts['images:optimize'] &&
           pkg.scripts['images:generate'];
  },
  'Vérifier package.json pour les scripts manquants'
);

// Vérifier outils
check(
  'Script de génération d\'images',
  () => fs.existsSync(path.join(__dirname, 'generate-images.js'))
);

check(
  'Script d\'optimisation d\'images',
  () => fs.existsSync(path.join(__dirname, 'optimize-existing-images.js'))
);

check(
  'Script de minification JS',
  () => fs.existsSync(path.join(__dirname, 'minify-js.js'))
);

// Vérifier header.html
check(
  'Header optimisé (fonts async)',
  () => {
    const headerPath = path.join(__dirname, '..', '_includes', 'header.html');
    if (!fs.existsSync(headerPath)) return false;
    const content = fs.readFileSync(headerPath, 'utf8');
    return content.includes('media="print"') && 
           content.includes('onload="this.media=\'all\'"') &&
           content.includes('preconnect');
  },
  'Vérifier que les fonts sont chargées de manière asynchrone'
);

// Vérifier default.html
check(
  'Layout charge les scripts d\'optimisation',
  () => {
    const layoutPath = path.join(__dirname, '..', '_layouts', 'default.html');
    if (!fs.existsSync(layoutPath)) return false;
    const content = fs.readFileSync(layoutPath, 'utf8');
    return content.includes('sw-register.js') && content.includes('lazy-load.js');
  },
  'Ajouter les scripts d\'optimisation dans _layouts/default.html'
);

// Vérifier dépendances
check(
  'Dépendance Terser installée',
  () => {
    const pkgPath = path.join(__dirname, '..', 'package.json');
    if (!fs.existsSync(pkgPath)) return false;
    const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
    return pkg.devDependencies && pkg.devDependencies.terser;
  },
  'Installer Terser: npm install --save-dev terser'
);

check(
  'Dépendance Sharp installée',
  () => {
    const pkgPath = path.join(__dirname, '..', 'package.json');
    if (!fs.existsSync(pkgPath)) return false;
    const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
    return pkg.devDependencies && pkg.devDependencies.sharp;
  },
  'Installer Sharp: npm install --save-dev sharp'
);

// Résumé
console.log('\n' + '='.repeat(50));
console.log(`📊 Résultat: ${passed} succès, ${failed} échecs`);

if (failed === 0) {
  console.log('\n🎉 Toutes les optimisations sont correctement configurées !');
  console.log('\n📝 Prochaines étapes:');
  console.log('   1. npm run images:optimize');
  console.log('   2. npm run build');
  console.log('   3. Tester en local');
  console.log('   4. Déployer sur Netlify');
} else {
  console.log('\n⚠️  Certaines optimisations nécessitent des corrections.');
  console.log('   Consultez les messages ci-dessus pour les corriger.');
  process.exit(1);
}

console.log('\n📖 Documentation complète: OPTIMIZATIONS.md');
console.log('='.repeat(50) + '\n');
