const puppeteer = require('puppeteer');
const sharp = require('sharp');
const fs = require('fs');

async function captureScreenshots() {
  console.log('Launching browser...');
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 800 });
  
  console.log('Navigating to website...');
  await page.goto('http://localhost:5000', { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 2000));
  
  // Screenshot 1: Hero section
  await page.screenshot({ path: 'dist-extension/promo/screenshot-1-hero.png' });
  console.log('✓ Screenshot 1: Hero section');
  
  // Screenshot 2: Scroll to demo section
  await page.evaluate(() => {
    const demo = document.getElementById('demo-section');
    if (demo) demo.scrollIntoView({ behavior: 'instant' });
  });
  await new Promise(r => setTimeout(r, 1000));
  await page.screenshot({ path: 'dist-extension/promo/screenshot-2-demo.png' });
  console.log('✓ Screenshot 2: Interactive demo');
  
  // Screenshot 3: Click settings button
  try {
    await page.click('[data-testid="button-settings"]');
    await new Promise(r => setTimeout(r, 500));
    await page.screenshot({ path: 'dist-extension/promo/screenshot-3-settings.png' });
    console.log('✓ Screenshot 3: Settings view');
  } catch (e) {
    console.log('Could not click settings, using demo view');
    await page.screenshot({ path: 'dist-extension/promo/screenshot-3-settings.png' });
  }
  
  // Screenshot 4: 20-20-20 explanation section
  await page.evaluate(() => {
    window.scrollTo(0, 700);
  });
  await new Promise(r => setTimeout(r, 500));
  await page.screenshot({ path: 'dist-extension/promo/screenshot-4-features.png' });
  console.log('✓ Screenshot 4: 20-20-20 explanation');
  
  // Screenshot 5: FAQ section
  await page.evaluate(() => {
    const faq = document.querySelector('[data-testid="faq-item-1"]');
    if (faq) faq.scrollIntoView({ behavior: 'instant' });
  });
  await new Promise(r => setTimeout(r, 500));
  try {
    await page.click('[data-testid="faq-item-1"] summary');
    await new Promise(r => setTimeout(r, 300));
  } catch (e) {}
  await page.screenshot({ path: 'dist-extension/promo/screenshot-5-faq.png' });
  console.log('✓ Screenshot 5: FAQ section');
  
  await browser.close();
  
  // Resize all screenshots to exact 1280x800 with no alpha
  console.log('\nResizing screenshots...');
  const screenshots = ['screenshot-1-hero', 'screenshot-2-demo', 'screenshot-3-settings', 'screenshot-4-features', 'screenshot-5-faq'];
  
  for (const name of screenshots) {
    const inputPath = `dist-extension/promo/${name}.png`;
    const outputPath = `dist-extension/promo/${name}-1280x800.png`;
    
    if (fs.existsSync(inputPath)) {
      await sharp(inputPath)
        .flatten({ background: '#ffffff' })
        .resize(1280, 800)
        .png()
        .toFile(outputPath);
      
      // Remove temp file
      fs.unlinkSync(inputPath);
      console.log(`✓ Resized: ${name}-1280x800.png`);
    }
  }
  
  console.log('\n✅ All screenshots ready in dist-extension/promo/');
}

captureScreenshots().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
