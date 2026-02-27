const fs = require('fs');
const path = require('path');

// PWA icon sizes: pwa/ (maskable) and icons/ (manifest + apple-touch-icon)
const iconSizes = {
  'icon-192.png': 192,
  'icon-512.png': 512,
  'icon-192-maskable.png': 192,  // Maskable with safe padding
  'icon-512-maskable.png': 512,  // Maskable with safe padding
  'apple-touch-icon.png': 180,   // iOS recommended 180x180
};

const sourceLogo = path.join(__dirname, '../public/logo-lingotheory.png');
const outputDir = path.join(__dirname, '../public/pwa');
const iconsDir = path.join(__dirname, '../public/icons');

// Check if source logo exists
if (!fs.existsSync(sourceLogo)) {
  console.error(`Source logo not found: ${sourceLogo}`);
  process.exit(1);
}

// Check if sharp is available
let sharp;
try {
  sharp = require('sharp');
} catch (e) {
  console.error('sharp package is required. Installing...');
  console.error('Please run: npm install --save-dev sharp');
  process.exit(1);
}

async function generateIcons() {
  console.log('Generating PWA icons with white background...');
  
  // Ensure output directories exist
  [outputDir, iconsDir].forEach((dir) => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
      console.log(`Created directory: ${path.relative(path.join(__dirname, '..'), dir)}`);
    }
  });

  // Read source logo
  const image = sharp(sourceLogo);
  const metadata = await image.metadata();
  console.log(`Source logo: ${metadata.width}x${metadata.height}`);

  // Generate each icon
  for (const [filename, size] of Object.entries(iconSizes)) {
    const isForIconsDir = filename === 'icon-192.png' || filename === 'icon-512.png' || filename === 'apple-touch-icon.png';
    const outputPath = path.join(isForIconsDir ? iconsDir : outputDir, filename);
    const isMaskable = filename.includes('maskable');
    
    if (isMaskable) {
      // Maskable icons need safe padding (80% of canvas)
      // The logo should occupy 80% of the canvas, centered
      const safeArea = Math.floor(size * 0.8);
      const padding = Math.floor((size - safeArea) / 2);
      
      await image
        .resize(safeArea, safeArea, {
          fit: 'contain',
          background: { r: 255, g: 255, b: 255, alpha: 1 } // White background
        })
        .extend({
          top: padding,
          bottom: padding,
          left: padding,
          right: padding,
          background: { r: 255, g: 255, b: 255, alpha: 1 } // White padding
        })
        .png()
        .toFile(outputPath);
      
      console.log(`Generated: ${filename} (${size}x${size}, maskable with safe padding)`);
    } else {
      // Regular icons: logo on white background, centered
      await image
        .resize(size, size, {
          fit: 'contain',
          background: { r: 255, g: 255, b: 255, alpha: 1 } // Explicit white background
        })
        .png()
        .toFile(outputPath);
      
      console.log(`Generated: ${filename} (${size}x${size})`);
    }
  }

  console.log('\n✅ All PWA icons generated successfully!');
  console.log(`Icons saved to: ${outputDir}`);
  console.log('\nNext steps:');
  console.log('1. Verify icons have white backgrounds');
  console.log('2. Clear browser cache and service worker');
  console.log('3. Reinstall PWA to see new icons');
}

generateIcons().catch(err => {
  console.error('Error generating icons:', err);
  process.exit(1);
});

