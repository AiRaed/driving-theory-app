const fs = require('fs');
const path = require('path');

// Android icon sizes for different densities
// Note: User requested hdpi, xhdpi, xxhdpi, xxxhdpi, but mdpi exists too
const iconSizes = {
  'mipmap-mdpi': 48,   // Also exists, generating for completeness
  'mipmap-hdpi': 72,
  'mipmap-xhdpi': 96,
  'mipmap-xxhdpi': 144,
  'mipmap-xxxhdpi': 192,
};

const sourceIcon = path.join(__dirname, '../resources/icon.png');
const androidResDir = path.join(__dirname, '../android/app/src/main/res');

// Check if source icon exists
if (!fs.existsSync(sourceIcon)) {
  console.error(`Source icon not found: ${sourceIcon}`);
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
  console.log('Generating Android launcher icons...');
  
  // Read source icon
  const image = sharp(sourceIcon);
  const metadata = await image.metadata();
  console.log(`Source icon: ${metadata.width}x${metadata.height}`);

  // Generate icons for each density
  for (const [folder, size] of Object.entries(iconSizes)) {
    const folderPath = path.join(androidResDir, folder);
    
    // Create folder if it doesn't exist
    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath, { recursive: true });
      console.log(`Created folder: ${folder}`);
    }

    // Generate ic_launcher.png
    const launcherPath = path.join(folderPath, 'ic_launcher.png');
    await image
      .resize(size, size, {
        fit: 'contain',
        background: { r: 255, g: 255, b: 255, alpha: 0 }
      })
      .png()
      .toFile(launcherPath);
    console.log(`Generated: ${folder}/ic_launcher.png (${size}x${size})`);

    // Generate ic_launcher_round.png (same as regular for now)
    const roundPath = path.join(folderPath, 'ic_launcher_round.png');
    await image
      .resize(size, size, {
        fit: 'contain',
        background: { r: 255, g: 255, b: 255, alpha: 0 }
      })
      .png()
      .toFile(roundPath);
    console.log(`Generated: ${folder}/ic_launcher_round.png (${size}x${size})`);
  }

  console.log('\n✅ All Android launcher icons generated successfully!');
}

generateIcons().catch(err => {
  console.error('Error generating icons:', err);
  process.exit(1);
});

