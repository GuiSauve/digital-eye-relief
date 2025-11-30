import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');

const sourceIcon = path.join(rootDir, 'attached_assets', 'generated_images', 'eye_care_extension_icon.png');
const outputDir = path.join(rootDir, 'extension', 'icons');

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

const sizes = [16, 32, 48, 128];

async function createIcons() {
  for (const size of sizes) {
    await sharp(sourceIcon)
      .resize(size, size, {
        kernel: sharp.kernel.lanczos3,
        fit: 'contain',
        background: { r: 255, g: 255, b: 255, alpha: 0 }
      })
      .png()
      .toFile(path.join(outputDir, `icon-${size}.png`));
    
    console.log(`✅ Created icon-${size}.png`);
  }
  
  console.log('🎉 All extension icons created successfully!');
}

createIcons().catch(console.error);
