const fs = require('fs');
const path = require('path');

const outDir = path.join(__dirname, 'out');
const distDir = path.join(__dirname, 'extension-dist');

// 1. Clean distDir
if (fs.existsSync(distDir)) {
  fs.rmSync(distDir, { recursive: true });
}
fs.mkdirSync(distDir);

// 2. Copy outDir to distDir
function copyRecursiveSync(src, dest) {
  const exists = fs.existsSync(src);
  const stats = exists && fs.statSync(src);
  const isDirectory = exists && stats.isDirectory();
  if (isDirectory) {
    if (!fs.existsSync(dest)) fs.mkdirSync(dest);
    fs.readdirSync(src).forEach((childItemName) => {
      copyRecursiveSync(path.join(src, childItemName), path.join(dest, childItemName));
    });
  } else {
    fs.copyFileSync(src, dest);
  }
}

console.log('Copying build files...');
copyRecursiveSync(outDir, distDir);

// 3. Rename _next to next
const oldNext = path.join(distDir, '_next');
const newNext = path.join(distDir, 'next');

if (fs.existsSync(oldNext)) {
  fs.renameSync(oldNext, newNext);
  console.log('Renamed _next to next');
}

// 4. Recursively replace strings in files
function replaceInFiles(dir) {
  const files = fs.readdirSync(dir);
  files.forEach((file) => {
    const filePath = path.join(dir, file);
    const stats = fs.statSync(filePath);
    if (stats.isDirectory()) {
      replaceInFiles(filePath);
    } else if (file.endsWith('.html') || file.endsWith('.js') || file.endsWith('.css')) {
      let content = fs.readFileSync(filePath, 'utf8');

      // Fix paths
      const newContent = content
        .replace(/\/_next\//g, '/next/')
        .replace(/_next\//g, 'next/')
        .replace(/__next/g, 'next'); // Handles __next_data etc

      if (content !== newContent) {
        fs.writeFileSync(filePath, newContent, 'utf8');
        console.log(`Updated paths in: ${path.relative(distDir, filePath)}`);
      }
    }
  });
}

console.log('Fixing path references...');
replaceInFiles(distDir);

// 5. Rename files/directories with reserved leading underscore names
function collectReservedPaths(dir, acc = []) {
  for (const entry of fs.readdirSync(dir)) {
    const entryPath = path.join(dir, entry);
    const stats = fs.statSync(entryPath);

    if (stats.isDirectory()) {
      collectReservedPaths(entryPath, acc);
    }

    if (entry.startsWith('_')) {
      acc.push(entryPath);
    }
  }
  return acc;
}

function stripLeadingUnderscores(name) {
  const stripped = name.replace(/^_+/, '');
  return stripped.length ? stripped : 'reserved';
}

function renameReservedPaths(baseDir) {
  const reservedPaths = collectReservedPaths(baseDir).sort((a, b) => b.length - a.length);
  const replacements = [];

  for (const oldPath of reservedPaths) {
    if (!fs.existsSync(oldPath)) continue;

    const parent = path.dirname(oldPath);
    const oldName = path.basename(oldPath);
    const newName = stripLeadingUnderscores(oldName);
    const newPath = path.join(parent, newName);

    if (oldPath === newPath) continue;

    fs.renameSync(oldPath, newPath);
    const oldRel = path.relative(baseDir, oldPath).split(path.sep).join('/');
    const newRel = path.relative(baseDir, newPath).split(path.sep).join('/');
    replacements.push({ oldRel, newRel });
    console.log(`Renamed reserved path: ${oldRel} -> ${newRel}`);
  }

  return replacements;
}

function replaceMappedPathsInFiles(dir, replacements) {
  const entries = fs.readdirSync(dir);
  entries.forEach((entry) => {
    const entryPath = path.join(dir, entry);
    const stats = fs.statSync(entryPath);

    if (stats.isDirectory()) {
      replaceMappedPathsInFiles(entryPath, replacements);
      return;
    }

    if (!entry.endsWith('.html') && !entry.endsWith('.js') && !entry.endsWith('.css') && !entry.endsWith('.json') && !entry.endsWith('.txt')) {
      return;
    }

    let content = fs.readFileSync(entryPath, 'utf8');
    let changed = false;

    for (const { oldRel, newRel } of replacements) {
      const oldEscaped = oldRel.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const oldBaseEscaped = path.basename(oldRel).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const patterns = [
        new RegExp(oldEscaped, 'g'),
        new RegExp(`/${oldEscaped}`, 'g'),
        new RegExp(oldBaseEscaped, 'g'),
      ];

      for (const pattern of patterns) {
        const next = content.replace(pattern, (match) => {
          if (match.startsWith('/')) return `/${newRel}`;
          if (match === path.basename(oldRel)) return path.basename(newRel);
          return newRel;
        });
        if (next !== content) {
          content = next;
          changed = true;
        }
      }
    }

    if (changed) {
      fs.writeFileSync(entryPath, content, 'utf8');
      console.log(`Updated renamed refs in: ${path.relative(distDir, entryPath)}`);
    }
  });
}

function listFilesByExtension(dir, extension, acc = []) {
  for (const entry of fs.readdirSync(dir)) {
    const entryPath = path.join(dir, entry);
    const stats = fs.statSync(entryPath);
    if (stats.isDirectory()) {
      listFilesByExtension(entryPath, extension, acc);
    } else if (entry.endsWith(extension)) {
      acc.push(entryPath);
    }
  }
  return acc;
}

function externalizeInlineScripts(baseDir) {
  const htmlFiles = listFilesByExtension(baseDir, '.html');
  const inlineDir = path.join(baseDir, 'inline');
  if (!fs.existsSync(inlineDir)) fs.mkdirSync(inlineDir);

  let scriptCounter = 0;
  for (const htmlPath of htmlFiles) {
    let html = fs.readFileSync(htmlPath, 'utf8');

    html = html.replace(/<script[^>]*type=["']speculationrules["'][^>]*>[\s\S]*?<\/script>/gi, '');

    html = html.replace(/<script(?![^>]*\bsrc=)([^>]*)>([\s\S]*?)<\/script>/gi, (_match, attrs = '', scriptBody = '') => {
      const body = String(scriptBody).trim();
      if (!body) return '';

      const fileName = `inline-script-${scriptCounter}.js`;
      scriptCounter += 1;
      const outPath = path.join(inlineDir, fileName);
      fs.writeFileSync(outPath, `${body}\n`, 'utf8');

      const hasNoModule = /\bnomodule\b/i.test(attrs);
      return hasNoModule
        ? `<script src="/inline/${fileName}" noModule></script>`
        : `<script src="/inline/${fileName}"></script>`;
    });

    fs.writeFileSync(htmlPath, html, 'utf8');
    console.log(`Externalized inline scripts in: ${path.relative(baseDir, htmlPath)}`);
  }
}

console.log('Renaming reserved underscore paths...');
const renamedPaths = renameReservedPaths(distDir);
if (renamedPaths.length > 0) {
  console.log('Fixing renamed path references...');
  replaceMappedPathsInFiles(distDir, renamedPaths);
}

console.log('Externalizing inline HTML scripts...');
externalizeInlineScripts(distDir);

console.log('Build ready in extension-dist/');
