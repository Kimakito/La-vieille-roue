#!/usr/bin/env node
/**
 * Script d'optimisation des images existantes
 * Optimise toutes les images dans le dossier generated/
 */

const sharp = require('sharp');
const fs = require('fs').promises;
const path = require('path');

const CONFIG = {
  inputDir: path.join(__dirname, '..', 'assets', 'images', 'generated'),
  quality: {
    avif: 65,
    webp: 80,
    jpeg: 85,
    png: 95
  }
};

/**
 * Obtient tous les fichiers images
 */
async function getImageFiles(dir) {
  const files = await fs.readdir(dir);
  return files
    .filter(file => /\.(avif|webp|jpe?g|png)$/i.test(file))
    .map(file => path.join(dir, file));
}

/**
 * Optimise une image en place
 */
async function optimizeImage(filePath) {
  const ext = path.extname(filePath).toLowerCase().replace('.', '');
  const filename = path.basename(filePath);
  
  console.log(`🔧 Optimisation: ${filename}`);
  
  try {
    const statsBefore = await fs.stat(filePath);
    const sizeBefore = statsBefore.size;
    
    // Créer une version temporaire
    const tempPath = filePath + '.tmp';
    
    // Optimiser selon le format
    const image = sharp(filePath);
    
    switch(ext) {
      case 'avif':
        await image.avif({ quality: CONFIG.quality.avif, effort: 6 }).toFile(tempPath);
        break;
      case 'webp':
        await image.webp({ quality: CONFIG.quality.webp, effort: 4 }).toFile(tempPath);
        break;
      case 'jpg':
      case 'jpeg':
        await image.jpeg({ quality: CONFIG.quality.jpeg, mozjpeg: true }).toFile(tempPath);
        break;
      case 'png':
        await image.png({ quality: CONFIG.quality.png, compressionLevel: 9 }).toFile(tempPath);
        break;
    }
    
    const statsAfter = await fs.stat(tempPath);
    const sizeAfter = statsAfter.size;
    
    // Ne remplacer que si l'optimisation a réduit la taille
    if (sizeAfter < sizeBefore) {
      await fs.rename(tempPath, filePath);
      const reduction = ((1 - sizeAfter / sizeBefore) * 100).toFixed(1);
      console.log(`  ✓ ${(sizeBefore / 1024).toFixed(1)} KB → ${(sizeAfter / 1024).toFixed(1)} KB (-${reduction}%)`);
    } else {
      await fs.unlink(tempPath);
      console.log(`  ℹ️  Déjà optimale (${(sizeBefore / 1024).toFixed(1)} KB)`);
    }
    
  } catch (error) {
    console.error(`  ❌ Erreur:`, error.message);
  }
}

/**
 * Fonction principale
 */
async function main() {
  console.log('🚀 Optimisation des images existantes...\n');
  
  try {
    const imageFiles = await getImageFiles(CONFIG.inputDir);
    
    if (imageFiles.length === 0) {
      console.log('ℹ️  Aucune image trouvée dans', CONFIG.inputDir);
      return;
    }
    
    console.log(`📁 ${imageFiles.length} images trouvées\n`);
    
    let totalBefore = 0;
    let totalAfter = 0;
    
    for (const filePath of imageFiles) {
      await optimizeImage(filePath);
    }
    
    console.log('\n✅ Optimisation terminée !');
    
  } catch (error) {
    console.error('❌ Erreur fatale:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = { optimizeImage };
