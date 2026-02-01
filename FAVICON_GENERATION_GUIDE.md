# LingoTheory Favicon Generation Guide

## Design Specifications

### Colors
- **Background**: Deep red `#DC2626` (UK road signs red)
- **Icon**: White `#FFFFFF`
- **Style**: Flat, no gradients, no shadows

### Design Elements
- Rounded square background (24% border radius)
- Bold, stylized "L" letter
- Centered, minimal design
- Works at 16x16, 32x32, and larger sizes

## Generated Files

1. **`app/favicon.svg`** - Scalable vector version (ready to use)

## Conversion Steps

### Option 1: Online Favicon Generator (Recommended)

1. Go to: https://realfavicongenerator.net/ or https://favicon.io/
2. Upload `app/favicon.svg`
3. Download the generated package which includes:
   - `favicon.ico` (multi-size)
   - `favicon.png` (512×512)
   - Apple touch icons
   - Android icons

### Option 2: Using ImageMagick (Command Line)

```bash
# Install ImageMagick first
# Then convert SVG to PNG
magick convert -background none -resize 512x512 app/favicon.svg app/favicon.png

# Convert to ICO (multi-size)
magick convert app/favicon.png -define icon:auto-resize=256,128,96,64,48,32,16 app/favicon.ico
```

### Option 3: Using Node.js Script

```bash
npm install --save-dev sharp
```

Then create a script to convert SVG to PNG/ICO.

### Option 4: Manual Design Tools

1. Open `app/favicon.svg` in:
   - Adobe Illustrator
   - Figma
   - Inkscape (free)
   - Canva

2. Export as:
   - PNG 512×512
   - ICO (multi-size: 16, 32, 48, 64, 128, 256)

## File Placement

After generation, place files in:
- `app/favicon.ico` - Main favicon (Next.js App Router)
- `app/icon.png` - Optional, for better Next.js support
- `app/apple-icon.png` - Optional, for Apple devices

## Next.js App Router Favicon Support

Next.js 13+ App Router automatically serves:
- `app/favicon.ico`
- `app/icon.png` (or `.jpg`, `.svg`)
- `app/apple-icon.png`

## Testing

1. Place `favicon.ico` in `app/` directory
2. Restart Next.js dev server
3. Check browser tab - favicon should appear
4. Test at different sizes (16x16, 32x32, 48x48)

## Alternative Designs

If you want variations, I can create SVG files with:
- Road/track symbol instead of "L"
- Theory test symbol (checkmark, document, etc.)
- Different rounded corner radius
- Different red shade

Just ask and I'll generate the SVG!

