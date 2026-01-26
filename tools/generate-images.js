#!/usr/bin/env node
/**
 * Script d'optimisation d'images pour La Vieille Roue
 * - Génère des versions responsive (320, 480, 768, 1024, 1200px)
 * - Convertit en formats modernes (AVIF, WebP)
 * - Optimise la compression
 * - Génère un manifest JSON pour le chargement dynamique
 */

const sharp = require('sharp');
const fs = require('fs').promises;
const path = require('path');

// Configuration
const CONFIG = {
  inputDir: path.join(__dirname, '..', 'assets', 'images'),
  outputDir: path.join(__dirname, '..', 'assets', 'images', 'generated'),
  widths: [320, 480, 768, 1024, 1200],
  formats: ['avif', 'webp'],
  quality: {
    avif: 60,  // AVIF haute compression
    webp: 75   // WebP bon équilibre
  },
  excludeDirs: ['generated', 'favicon'],
  manifest: {}
};

/**
 * Obtient tous les fichiers images récursivement
 */
async function getImageFiles(dir, fileList = []) {
  const files = await fs.readdir(dir, { withFileTypes: true });
  
  for (const file of files) {
    const filePath = path.join(dir, file.name);
    
    if (file.isDirectory()) {
      // Ignorer les dossiers exclus
      if (!CONFIG.excludeDirs.includes(file.name)) {
        await getImageFiles(filePath, fileList);
      }
    } else if (/\.(jpe?g|png|webp)$/i.test(file.name)) {
      fileList.push(filePath);
    }
  }
  
  return fileList;
}

/**
 * Optimise une image et génère toutes les variantes
 */
async function optimizeImage(inputPath) {
  const relativePath = path.relative(CONFIG.inputDir, inputPath);
  const fileName = path.basename(inputPath, path.extname(inputPath));
  const key = relativePath.replace(/\\/g, '/').replace(path.extname(relativePath), '');
  
  console.log(`📸 Traitement: ${relativePath}`);
  
  try {
    // Lire les métadonnées de l'image originale
    const metadata = await sharp(inputPath).metadata();
    
    CONFIG.manifest[key] = {
      original: {
        width: metadata.width,
        height: metadata.height,
        format: metadata.format
      },
      variants: {}
    };
    
    // Générer les variantes pour chaque largeur et format
    for (const width of CONFIG.widths) {
      // Ne pas upscaler les images
      if (width > metadata.width) continue;
      
      CONFIG.manifest[key].variants[width] = {};
      
      for (const format of CONFIG.formats) {
        const outputName = `${fileName}-${width}.${format}`;
        const outputPath = path.join(CONFIG.outputDir, outputName);
        
        await sharp(inputPath)
          .resize(width, null, {
            withoutEnlargement: true,
            fit: 'inside'
          })
          [format]({
            quality: CONFIG.quality[format],
            effort: format === 'avif' ? 6 : 4 // Plus d'effort pour AVIF
          })
          .toFile(outputPath);
        
        const stats = await fs.stat(outputPath);
        CONFIG.manifest[key].variants[width][format] = `/assets/images/generated/${outputName}`;
        
        console.log(`  ✓ ${outputName} (${(stats.size / 1024).toFixed(1)} KB)`);
      }
    }
    
    // Générer aussi des versions @2x pour les écrans retina
    for (const width of [320, 480, 768, 1024]) {
      const width2x = width * 2;
      if (width2x > metadata.width) continue;
      
      for (const format of CONFIG.formats) {
        const outputName = `${fileName}-${width}@2x.${format}`;
        const outputPath = path.join(CONFIG.outputDir, outputName);
        
        await sharp(inputPath)
          .resize(width2x, null, {
            withoutEnlargement: true,
            fit: 'inside'
          })
          [format]({
            quality: CONFIG.quality[format],
            effort: format === 'avif' ? 6 : 4
          })
          .toFile(outputPath);
        
        console.log(`  ✓ ${outputName} (@2x)`);
      }
    }
    
  } catch (error) {
    console.error(`❌ Erreur lors du traitement de ${relativePath}:`, error.message);
  }
}

/**
 * Fonction principale
 */
async function main() {
  console.log('🚀 Démarrage de l\'optimisation des images...\n');
  
  try {
    // Créer le dossier de sortie s'il n'existe pas
    await fs.mkdir(CONFIG.outputDir, { recursive: true });
    
    // Obtenir tous les fichiers images
    const imageFiles = await getImageFiles(CONFIG.inputDir);
    console.log(`📁 ${imageFiles.length} images trouvées\n`);
    
    // Traiter chaque image
    for (const imagePath of imageFiles) {
      await optimizeImage(imagePath);
    }
    
    // Sauvegarder le manifest
    const manifestPath = path.join(CONFIG.outputDir, 'manifest.json');
    await fs.writeFile(
      manifestPath,
      JSON.stringify(CONFIG.manifest, null, 2)
    );
    
    console.log(`\n✅ Optimisation terminée !`);
    console.log(`📋 Manifest sauvegardé: ${manifestPath}`);
    
  } catch (error) {
    console.error('❌ Erreur fatale:', error);
    process.exit(1);
  }
}

// Exécuter le script
if (require.main === module) {
  main();
}

module.exports = { optimizeImage, getImageFiles };
