#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const srcDir = path.join(__dirname, '..', 'assets', 'images');
// Write generated images into a non-underscore folder so Jekyll copies it by default
const outDir = path.join(srcDir, 'generated');
const manifestPath = path.join(outDir, 'manifest.json');

// target widths (px) — constrained set requested by user
const widths = [320, 480, 768, 1024, 1600];
// output formats (order matters for fallback): AVIF and WebP
const formats = ['avif', 'webp'];
// device pixel ratios to generate (1x and 2x)
const dprs = [1, 2];
ensureDir(outDir);

function ensureDir(dir){ if(!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true }); }
function basenameNoExt(p){ return path.basename(p, path.extname(p)); }

async function processFile(file){
  const abs = path.join(srcDir, file);
  const name = basenameNoExt(file);
  const meta = { variants: {}, placeholder: null };

  const md = await sharp(abs).metadata();
  meta.original = { width: md.width, height: md.height };

  for (const w of widths){
    if (w > md.width) continue;
    meta.variants[w] = {};

    for (const dpr of dprs){
      const target = Math.round(w * dpr);
      const suffix = `${w}${dpr === 2 ? '@2x' : ''}`;
      for (const format of formats){
        const outFile = `${name}-${suffix}.${format}`;
        const outPath = path.join(outDir, outFile);
        if (fs.existsSync(outPath)) continue;

        await sharp(abs)
          .resize({ width: target })
          .toFormat(format, { quality: 70 })
          .toFile(outPath);

  meta.variants[w][format] = `/assets/images/generated/${outFile}`;
      }
    }
  }

  // placeholder
  const lqip = await sharp(abs).resize(20).blur().toFormat('webp', { quality: 40 }).toBuffer();
  meta.placeholder = `data:image/webp;base64,${lqip.toString('base64')}`;
  return { name, meta };
}

async function main(){
  const files = fs.readdirSync(srcDir).filter(f => /\.(jpe?g|png|webp)$/i.test(f));
  const manifest = {};
  for(const f of files){
    console.log('Processing', f);
    const res = await processFile(f);
    manifest[res.name] = res.meta;
  }
  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
  console.log('Done, manifest:', manifestPath);
}

main().catch(console.error);
