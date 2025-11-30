import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');
const distDir = path.join(rootDir, 'dist-extension');

// Move HTML files from extension/ subdirectory to root
const htmlFiles = ['popup.html', 'options.html'];
htmlFiles.forEach(file => {
  const source = path.join(distDir, 'extension', file);
  const dest = path.join(distDir, file);
  if (fs.existsSync(source)) {
    fs.renameSync(source, dest);
  }
});

// Remove empty extension directory
const extensionDir = path.join(distDir, 'extension');
if (fs.existsSync(extensionDir) && fs.readdirSync(extensionDir).length === 0) {
  fs.rmdirSync(extensionDir);
}

// Copy manifest.json
fs.copyFileSync(
  path.join(rootDir, 'extension', 'manifest.json'),
  path.join(distDir, 'manifest.json')
);

// Copy background.js
fs.copyFileSync(
  path.join(rootDir, 'extension', 'background.js'),
  path.join(distDir, 'background.js')
);

// Copy icons directory
const iconsSource = path.join(rootDir, 'extension', 'icons');
const iconsDest = path.join(distDir, 'icons');

if (fs.existsSync(iconsSource)) {
  if (!fs.existsSync(iconsDest)) {
    fs.mkdirSync(iconsDest, { recursive: true });
  }
  
  fs.readdirSync(iconsSource).forEach(file => {
    fs.copyFileSync(
      path.join(iconsSource, file),
      path.join(iconsDest, file)
    );
  });
}

console.log('✅ Extension build complete! Output in dist-extension/');
console.log('📦 Load the extension:');
console.log('   1. Open Chrome and go to chrome://extensions/');
console.log('   2. Enable "Developer mode"');
console.log('   3. Click "Load unpacked"');
console.log('   4. Select the dist-extension folder');
