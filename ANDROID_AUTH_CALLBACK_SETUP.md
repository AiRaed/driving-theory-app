# Android Auth Callback Setup Guide

This guide explains how to complete the setup for Android App Links to handle authentication callbacks in the Capacitor Android app.

## Problem Solved

Previously, email confirmation links opened in an external browser, causing PKCE verifier/storage mismatch. The callback now opens inside the app's WebView, preserving the authentication context.

## Implementation Summary

### 1. Updated Auth Callback Page (`app/auth/callback/page.tsx`)
- Added 10-second timeout with fallback UI
- Shows "Open in Browser" button if authentication fails
- Better error handling and logging
- Handles both code exchange and session checks

### 2. Android App Links Configuration (`android/app/src/main/AndroidManifest.xml`)
- Added intent-filter for `https://www.lingotheory.org/auth/callback`
- Set `android:autoVerify="true"` for automatic verification
- App Links will open the callback URL inside the app

### 3. Digital Asset Links (`public/.well-known/assetlinks.json`)
- Created assetlinks.json file for App Links verification
- **ACTION REQUIRED**: Replace `REPLACE_WITH_YOUR_SHA256_FINGERPRINT` with your actual SHA256 fingerprint

### 4. Capacitor App URL Handler (`components/CapacitorAppUrlHandler.tsx`)
- Listens for `appUrlOpen` events
- Navigates WebView to callback URL when detected
- Preserves PKCE verifier by keeping auth flow in same WebView

## Setup Steps

### Step 1: Get SHA256 Fingerprint

You need the SHA256 fingerprint of your app's signing certificate. Use one of these methods:

#### Method A: From Keystore (Release Build)
```bash
keytool -list -v -keystore /path/to/your/keystore.jks -alias your-key-alias
```

Look for `SHA256:` in the output.

#### Method B: From Google Play Console
1. Go to Google Play Console → Your App → Setup → App Integrity
2. Find "App signing key certificate"
3. Copy the SHA-256 certificate fingerprint

#### Method C: From Debug Keystore (Development)
```bash
# Default debug keystore location
keytool -list -v -keystore ~/.android/debug.keystore -alias androiddebugkey -storepass android -keypass android
```

### Step 2: Update assetlinks.json

1. Open `public/.well-known/assetlinks.json`
2. Replace `REPLACE_WITH_YOUR_SHA256_FINGERPRINT` with your actual SHA256 fingerprint (remove colons, lowercase)
3. Example:
   ```json
   "sha256_cert_fingerprints": [
     "AA:BB:CC:DD:EE:FF:00:11:22:33:44:55:66:77:88:99:AA:BB:CC:DD:EE:FF:00:11:22:33:44:55:66:77:88:99"
   ]
   ```
   Should become:
   ```json
   "sha256_cert_fingerprints": [
     "aabbccddeeff00112233445566778899aabbccddeeff00112233445566778899"
   ]
   ```

**Important**: 
- Remove colons from the fingerprint
- Use lowercase letters
- For production, use the release keystore fingerprint
- For development, use the debug keystore fingerprint

### Step 3: Deploy assetlinks.json

The file must be accessible at:
```
https://www.lingotheory.org/.well-known/assetlinks.json
```

After deploying, verify it's accessible:
```bash
curl https://www.lingotheory.org/.well-known/assetlinks.json
```

### Step 4: Update Supabase Dashboard

1. Go to **Supabase Dashboard → Authentication → URL Configuration**
2. Ensure **Site URL** is set to:
   ```
   https://www.lingotheory.org
   ```
3. Ensure **Redirect URLs** include:
   ```
   https://www.lingotheory.org/auth/callback
   http://localhost:3000/auth/callback
   https://www.lingotheory.org
   http://localhost:3000
   ```

### Step 5: Rebuild Android App

After updating assetlinks.json and AndroidManifest.xml:

```bash
# Sync Capacitor
npx cap sync android

# Rebuild the app
cd android
./gradlew clean
./gradlew assembleRelease
```

### Step 6: Test App Links

1. Install the app on a device
2. Send a test email confirmation
3. Click the confirmation link
4. The link should open **inside the app** (not external browser)
5. Authentication should complete successfully

## Verification

### Check App Links Verification

After installing the app, verify App Links are working:

```bash
adb shell pm get-app-links io.lingotheory.mobile
```

Look for `https://www.lingotheory.org/auth/callback` in the verified domains.

### Manual Testing

1. Open the app
2. Sign up with a test email
3. Check email and click confirmation link
4. Link should open in the app (not browser)
5. Should redirect to `/dashboard` after successful authentication

## Troubleshooting

### App Links Not Working

1. **Check assetlinks.json is accessible:**
   ```bash
   curl https://www.lingotheory.org/.well-known/assetlinks.json
   ```

2. **Verify SHA256 fingerprint matches:**
   - Ensure fingerprint in assetlinks.json matches your signing certificate
   - Check for typos (no colons, lowercase)

3. **Check AndroidManifest.xml:**
   - Ensure `android:autoVerify="true"` is set
   - Verify intent-filter is correct

4. **Clear app data and reinstall:**
   ```bash
   adb uninstall io.lingotheory.mobile
   adb install app-release.apk
   ```

### Still Opening in Browser

1. Check if App Links verification passed:
   ```bash
   adb shell pm get-app-links io.lingotheory.mobile
   ```

2. If not verified, check:
   - assetlinks.json is accessible
   - SHA256 fingerprint is correct
   - App was installed after assetlinks.json was deployed

### "PKCE code verifier not found" Error

This should be fixed now, but if it persists:

1. Ensure the callback opens **inside the app** (not browser)
2. Check that `CapacitorAppUrlHandler` is loaded (check console logs)
3. Verify the WebView navigates to the callback URL

## Files Changed

1. `app/auth/callback/page.tsx` - Added timeout, fallback UI, better error handling
2. `android/app/src/main/AndroidManifest.xml` - Added App Links intent-filter
3. `public/.well-known/assetlinks.json` - Created (needs SHA256 fingerprint)
4. `components/CapacitorAppUrlHandler.tsx` - Created to handle appUrlOpen events
5. `app/layout.tsx` - Added CapacitorAppUrlHandler component
6. `package.json` - Added @capacitor/app dependency

## Notes

- The assetlinks.json file must be publicly accessible for App Links verification
- Use the **release keystore** SHA256 for production
- App Links verification happens automatically when the app is installed
- If verification fails, the link will open in the browser (fallback)

