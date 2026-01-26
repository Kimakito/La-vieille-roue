#!/usr/bin/env node
/**
 * Script de minification JavaScript
 * Minifie tous les fichiers JS pour la production
 */

const { minify } = require('terser');
const fs = require('fs').promises;
const path = require('path');

const CONFIG = {
  inputDir: path.join(__dirname, '..', 'assets', 'js'),
  outputDir: path.join(__dirname, '..', '_site', 'assets', 'js'),
  exclude: ['*.min.js'], // Fichiers déjà minifiés
  terserOptions: {
    compress: {
      drop_console: true, // Supprimer les console.log en production
      drop_debugger: true,
      pure_funcs: ['console.log', 'console.info', 'console.debug'],
      passes: 2
    },
    mangle: {
      toplevel: true
    },
    format: {
      comments: false
    },
    sourceMap: false
  }
};

/**
 * Obtient tous les fichiers JS
 */
async function getJSFiles(dir, fileList = []) {
  try {
    const files = await fs.readdir(dir, { withFileTypes: true });
    
    for (const file of files) {
      const filePath = path.join(dir, file.name);
      
      if (file.isDirectory()) {
        await getJSFiles(filePath, fileList);
      } else if (file.name.endsWith('.js') && !file.name.endsWith('.min.js')) {
        fileList.push(filePath);
      }
    }
  } catch (error) {
    // Dossier n'existe pas encore
  }
  
  return fileList;
}

/**
 * Minifie un fichier JavaScript
 */
async function minifyFile(inputPath) {
  const relativePath = path.relative(CONFIG.inputDir, inputPath);
  const outputPath = path.join(CONFIG.outputDir, relativePath);
  
  console.log(`🔨 Minification: ${relativePath}`);
  
  try {
    // Lire le fichier source
    const code = await fs.readFile(inputPath, 'utf8');
    
    // Minifier avec Terser
    const result = await minify(code, CONFIG.terserOptions);
    
    if (result.error) {
      throw result.error;
    }
    
    // Créer le dossier de sortie si nécessaire
    await fs.mkdir(path.dirname(outputPath), { recursive: true });
    
    // Écrire le fichier minifié
    await fs.writeFile(outputPath, result.code);
    
    // Calculer la réduction
    const originalSize = Buffer.byteLength(code, 'utf8');
    const minifiedSize = Buffer.byteLength(result.code, 'utf8');
    const reduction = ((1 - minifiedSize / originalSize) * 100).toFixed(1);
    
    console.log(`  ✓ ${(originalSize / 1024).toFixed(1)} KB → ${(minifiedSize / 1024).toFixed(1)} KB (-${reduction}%)`);
    
  } catch (error) {
    console.error(`❌ Erreur lors de la minification de ${relativePath}:`, error.message);
  }
}

/**
 * Fonction principale
 */
async function main() {
  console.log('🚀 Démarrage de la minification JavaScript...\n');
  
  try {
    const jsFiles = await getJSFiles(CONFIG.inputDir);
    
    if (jsFiles.length === 0) {
      console.log('ℹ️ Aucun fichier JavaScript à minifier');
      return;
    }
    
    console.log(`📁 ${jsFiles.length} fichiers JavaScript trouvés\n`);
    
    // Minifier chaque fichier
    for (const filePath of jsFiles) {
      await minifyFile(filePath);
    }
    
    console.log('\n✅ Minification terminée !');
    
  } catch (error) {
    console.error('❌ Erreur fatale:', error);
    process.exit(1);
  }
}

// Exécuter le script
if (require.main === module) {
  main();
}

module.exports = { minifyFile };
