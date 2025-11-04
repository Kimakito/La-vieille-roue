const fs = require('fs');
const path = require('path');

const repoRoot = process.cwd();
const IGNORE_DIRS = ['.git', 'node_modules', 'vendor', '_site', 'assets/images/_unused_backup', 'assets/images/generated', 'assets/images/_generated'];
const IMAGE_EXTS = ['.png','.jpg','.jpeg','.webp','.avif','.svg','.gif'];

function isIgnored(p) {
  return IGNORE_DIRS.some(d => p.includes(path.normalize(d)));
}

function walk(dir) {
  const files = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const e of entries) {
    const full = path.join(dir, e.name);
    if (isIgnored(full)) continue;
    if (e.isDirectory()) files.push(...walk(full));
    else files.push(full);
  }
  return files;
}

function isImage(file) {
  return IMAGE_EXTS.includes(path.extname(file).toLowerCase());
}

function isTextFile(file) {
  const textExts = ['.html','.htm','.js','.json','.css','.txt','.md','.markdown','.yml','.yaml','.xml','.njk','.liquid','.svg'];
  return textExts.includes(path.extname(file).toLowerCase());
}

function escapeForRegex(s){
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

(async function main(){
  try {
    console.log('Repo root:', repoRoot);
    const allFiles = walk(repoRoot);
    const imageFiles = allFiles.filter(isImage).map(f => path.relative(repoRoot,f).replace(/\\/g,'/'));
    console.log('Found image files:', imageFiles.length);

    // Build searchable corpus of text files
    const textFiles = allFiles.filter(isTextFile);
    console.log('Text files to search:', textFiles.length);

    // Read all text files into memory (may be large but repo is moderate)
    const contents = {};
    for (const f of textFiles) {
      try {
        contents[f] = fs.readFileSync(f,'utf8');
      } catch(err) {
        // ignore binary or unreadable
      }
    }

    const unused = [];

    for (const rel of imageFiles) {
      // skip if image is inside the backup or generated folders
      if (rel.startsWith('assets/images/_unused_backup') || rel.startsWith('assets/images/generated') || rel.startsWith('assets/images/_generated')) continue;

      const basename = path.basename(rel);
      const queries = [rel, '/' + rel, rel.replace(/^assets\//,'/assets/'), basename];
      let found = false;

      for (const q of queries) {
        const re = new RegExp(escapeForRegex(q), 'i');
        for (const [file, text] of Object.entries(contents)) {
          if (re.test(text)) { found = true; break; }
        }
        if (found) break;
      }

      if (!found) unused.push(rel);
    }

    if (unused.length === 0) {
      console.log('No unused images detected. Nothing to do.');
      process.exit(0);
    }

    const now = new Date();
    const stamp = now.toISOString().replace(/[:.]/g,'-');
    const backupRoot = path.join(repoRoot, 'assets', 'images', `_unused_backup_${stamp}`);

    console.log(`Found ${unused.length} unused images. Moving to backup: ${backupRoot}`);
    for (const rel of unused) {
      const src = path.join(repoRoot, rel);
      const dst = path.join(backupRoot, rel.replace(/^assets\//, '')).replace(/\\/g, '/');
      const dstDir = path.dirname(dst);
      fs.mkdirSync(dstDir, { recursive: true });
      fs.renameSync(src, dst);
      console.log('Moved:', rel, '->', path.relative(repoRoot, dst));
    }

    // Write a report file at backup root
    const report = {
      timestamp: now.toISOString(),
      moved: unused
    };
    fs.writeFileSync(path.join(backupRoot,'report.json'), JSON.stringify(report, null, 2));

    console.log('\nMoved files list written to', path.join(backupRoot,'report.json'));
    console.log('Exit code 0');
    process.exit(0);
  } catch (err) {
    console.error('ERROR', err);
    process.exit(1);
  }
})();
