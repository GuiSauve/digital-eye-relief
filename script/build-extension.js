import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');

// Copy manifest.json
fs.copyFileSync(
  path.join(rootDir, 'extension', 'manifest.json'),
  path.join(rootDir, 'dist-extension', 'manifest.json')
);

// Copy background.js
fs.copyFileSync(
  path.join(rootDir, 'extension', 'background.js'),
  path.join(rootDir, 'dist-extension', 'background.js')
);

// Copy icons directory
const iconsSource = path.join(rootDir, 'extension', 'icons');
const iconsDest = path.join(rootDir, 'dist-extension', 'icons');

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
