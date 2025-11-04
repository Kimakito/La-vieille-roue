const fs = require('fs');
const path = require('path');

async function copyDir(src, dest){
  if(!fs.existsSync(src)) return false;
  await fs.promises.mkdir(dest, { recursive: true });
  const entries = await fs.promises.readdir(src, { withFileTypes: true });
  for(const ent of entries){
    const s = path.join(src, ent.name);
    const d = path.join(dest, ent.name);
    if(ent.isDirectory()){
      await copyDir(s, d);
    } else if(ent.isFile()){
      await fs.promises.copyFile(s, d);
    }
  }
  return true;
}

async function main(){
  try{
    const root = process.cwd();
    const src = path.join(root, 'assets', 'images', 'generated');
    const dest = path.join(root, '_site', 'assets', 'images', 'generated');
    const ok = await copyDir(src, dest);
    if(ok) {
      console.log('Copied generated images to _site assets.');
      // Also copy generated manifest to a root-accessible manifest to avoid 404s from older clients/scripts
      const genManifest = path.join(src, 'manifest.json');
      const siteManifest = path.join(root, '_site', 'assets', 'images', 'manifest.json');
      const repoManifest = path.join(root, 'assets', 'images', 'manifest.json');
      if(fs.existsSync(genManifest)){
        try{
          await fs.promises.copyFile(genManifest, siteManifest);
          console.log('Copied manifest to', siteManifest);
        }catch(e){ console.warn('Could not copy manifest to _site:', e); }
        try{
          // create repo-level manifest for local dev (non-destructive if exists)
          if(!fs.existsSync(repoManifest)){
            await fs.promises.copyFile(genManifest, repoManifest);
            console.log('Created assets/images/manifest.json in repo to reduce 404 noise.');
          }
        }catch(e){ console.warn('Could not create repo manifest:', e); }
      }
      process.exit(0);
    } else {
      console.log('No generated images to copy (source not found):', src);
      process.exit(0);
    }
  }catch(err){
    console.error('Error copying generated images:', err);
    process.exit(2);
  }
}

main();
