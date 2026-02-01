# Favicon Setup Instructions

## ✅ Completed

1. ✅ Updated `app/layout.tsx` with favicon metadata
2. ✅ Removed default Next.js `app/favicon.ico`
3. ✅ Created `public/site.webmanifest`

## 📋 Required Icon Files

You need to create the following icon files in the `public/` directory using the existing logo (`public/logo-lingotheory.png`):

### Required Files:

1. **`public/favicon.ico`** (16x16, 32x32, 48x48 sizes)
   - Classic favicon format
   - Used by browsers in tabs and bookmarks

2. **`public/icon-192.png`** (192x192 pixels)
   - PWA icon for Android
   - Used in web app manifest

3. **`public/icon-512.png`** (512x512 pixels)
   - PWA icon for Android
   - Used in web app manifest

4. **`public/apple-touch-icon.png`** (180x180 pixels)
   - iOS home screen icon
   - Used when users add to home screen on iPhone/iPad

## 🎨 Brand Colors

- Primary Red: `#E10600` (--primary-red)
- Background: `#FFFFFF` (white)
- Text: `#0B1220` (navy)

## 🛠️ How to Generate Icons

### Option 1: Online Tools
1. Use [Favicon.io](https://favicon.io/) or [RealFaviconGenerator](https://realfavicongenerator.net/)
2. Upload `public/logo-lingotheory.png`
3. Generate all required sizes
4. Download and place files in `public/` directory

### Option 2: Image Editor (Photoshop/GIMP)
1. Open `public/logo-lingotheory.png`
2. Resize to each required size:
   - favicon.ico: 16x16, 32x32, 48x48 (multi-size ICO)
   - icon-192.png: 192x192
   - icon-512.png: 512x512
   - apple-touch-icon.png: 180x180
3. Export as PNG (except favicon.ico which should be ICO format)
4. Save to `public/` directory

### Option 3: Command Line (ImageMagick)
```bash
# Install ImageMagick first, then:
cd public

# Generate favicon.ico (requires multiple sizes)
convert logo-lingotheory.png -resize 16x16 favicon-16.png
convert logo-lingotheory.png -resize 32x32 favicon-32.png
convert logo-lingotheory.png -resize 48x48 favicon-48.png
convert favicon-16.png favicon-32.png favicon-48.png favicon.ico

# Generate other icons
convert logo-lingotheory.png -resize 192x192 icon-192.png
convert logo-lingotheory.png -resize 512x512 icon-512.png
convert logo-lingotheory.png -resize 180x180 apple-touch-icon.png
```

## ✅ Verification

After creating the icon files:

1. **Test locally:**
   ```bash
   npm run dev
   ```
   - Open `http://localhost:3000`
   - Check browser tab for favicon
   - Check `http://localhost:3000/favicon.ico` loads

2. **Test on mobile:**
   - Add to home screen on iOS (should show apple-touch-icon)
   - Add to home screen on Android (should show icon-192/512)

3. **Verify files exist:**
   ```bash
   ls -la public/favicon.ico
   ls -la public/icon-192.png
   ls -la public/icon-512.png
   ls -la public/apple-touch-icon.png
   ```

## 📝 Notes

- Next.js App Router automatically serves files from `public/` directory
- The `app/favicon.ico` has been removed (Next.js default)
- All favicon references are now in `app/layout.tsx` metadata
- The web manifest is configured for PWA support

## 🚀 After Setup

Once all icon files are created, the favicon will work automatically:
- Browser tabs will show the LingoTheory logo
- Bookmarks will use the favicon
- Mobile home screen icons will display correctly
- PWA installation will show proper icons

