const fs = require('fs');
const path = require('path');

// Check if sharp is available
let sharp;
try {
  sharp = require('sharp');
} catch (e) {
  console.error('Error: sharp package is required.');
  console.error('Please run: npm install --save-dev sharp');
  process.exit(1);
}

const sourceLogo = path.join(__dirname, '../public/logo-lingotheory.png');
const pwaDir = path.join(__dirname, '../public/pwa');

// Ensure pwa directory exists
if (!fs.existsSync(pwaDir)) {
  fs.mkdirSync(pwaDir, { recursive: true });
}

// Check if source logo exists
if (!fs.existsSync(sourceLogo)) {
  console.error(`Source logo not found: ${sourceLogo}`);
  process.exit(1);
}

async function generateIcons() {
  console.log('Generating PWA icons from logo-lingotheory.png...');
  
  try {
    // Read source logo
    const image = sharp(sourceLogo);
    const metadata = await image.metadata();
    console.log(`Source logo: ${metadata.width}x${metadata.height}`);

    // Generate icon-192.png
    await image
      .clone()
      .resize(192, 192, {
        fit: 'contain',
        background: { r: 255, g: 255, b: 255, alpha: 1 }
      })
      .png()
      .toFile(path.join(pwaDir, 'icon-192.png'));
    console.log('✅ Generated: pwa/icon-192.png');

    // Generate icon-512.png
    await image
      .clone()
      .resize(512, 512, {
        fit: 'contain',
        background: { r: 255, g: 255, b: 255, alpha: 1 }
      })
      .png()
      .toFile(path.join(pwaDir, 'icon-512.png'));
    console.log('✅ Generated: pwa/icon-512.png');

    // Generate icon-192-maskable.png (with safe zone for maskable icons)
    // Maskable icons need 80% safe zone, so we'll resize to 80% and center it
    await image
      .clone()
      .resize(154, 154, { // 80% of 192
        fit: 'contain',
        background: { r: 255, g: 255, b: 255, alpha: 1 }
      })
      .extend({
        top: 19,
        bottom: 19,
        left: 19,
        right: 19,
        background: { r: 255, g: 255, b: 255, alpha: 1 }
      })
      .png()
      .toFile(path.join(pwaDir, 'icon-192-maskable.png'));
    console.log('✅ Generated: pwa/icon-192-maskable.png');

    // Generate icon-512-maskable.png (with safe zone for maskable icons)
    await image
      .clone()
      .resize(410, 410, { // 80% of 512
        fit: 'contain',
        background: { r: 255, g: 255, b: 255, alpha: 1 }
      })
      .extend({
        top: 51,
        bottom: 51,
        left: 51,
        right: 51,
        background: { r: 255, g: 255, b: 255, alpha: 1 }
      })
      .png()
      .toFile(path.join(pwaDir, 'icon-512-maskable.png'));
    console.log('✅ Generated: pwa/icon-512-maskable.png');

    console.log('\n✅ All PWA icons generated successfully!');
  } catch (error) {
    console.error('Error generating icons:', error);
    process.exit(1);
  }
}

generateIcons();

