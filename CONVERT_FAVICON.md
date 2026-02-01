# Convert SVG to Favicon Formats

## Quick Conversion (Recommended)

### Using Online Tools

1. **RealFaviconGenerator** (Best option):
   - Go to: https://realfavicongenerator.net/
   - Upload `app/icon.svg`
   - Download the generated package
   - Extract `favicon.ico` to `app/favicon.ico`

2. **Favicon.io**:
   - Go to: https://favicon.io/favicon-converter/
   - Upload `app/icon.svg`
   - Download and extract `favicon.ico`

### Using Command Line (ImageMagick)

```bash
# Install ImageMagick first: https://imagemagick.org/

# Convert SVG to PNG (512x512)
magick convert -background none -resize 512x512 app/icon.svg app/icon-512.png

# Convert to ICO (multi-size: 16, 32, 48, 64, 128, 256)
magick convert app/icon-512.png -define icon:auto-resize=256,128,96,64,48,32,16 app/favicon.ico
```

### Using Node.js (Sharp)

```bash
npm install --save-dev sharp
```

Create `scripts/generate-favicon.js`:
```javascript
const sharp = require('sharp');
const fs = require('fs');

async function generateFavicon() {
  // Convert SVG to PNG
  await sharp('app/icon.svg')
    .resize(512, 512)
    .png()
    .toFile('app/icon-512.png');
  
  console.log('✅ Generated icon-512.png');
  console.log('⚠️  Use online tool to convert PNG to ICO: https://realfavicongenerator.net/');
}

generateFavicon();
```

Run: `node scripts/generate-favicon.js`

## Design Options Created

I've created 3 SVG designs for you:

1. **`app/icon.svg`** (Recommended) - Stylized "L" letter
2. **`app/favicon-road.svg`** - Road/track symbol
3. **`app/favicon-check.svg`** - Checkmark (theory test symbol)

Choose your favorite and rename it to `app/icon.svg` if you want to use a different design.

## Next.js App Router Support

Next.js 13+ App Router automatically serves:
- `app/icon.svg` or `app/icon.png` - Main favicon
- `app/favicon.ico` - Fallback for older browsers
- `app/apple-icon.png` - Apple touch icon (optional)

## Current Setup

The `layout.tsx` is configured to use:
- `/icon.svg` as the main favicon (SVG, modern browsers)
- `/favicon.ico` as fallback (ICO, older browsers)

## Testing

1. Place `favicon.ico` in `app/` directory
2. Restart Next.js dev server: `npm run dev`
3. Check browser tab - favicon should appear
4. Test in different browsers and sizes

## Color Reference

- **Deep Red**: `#DC2626` (UK road signs red, Tailwind `red-600`)
- **White**: `#FFFFFF`

