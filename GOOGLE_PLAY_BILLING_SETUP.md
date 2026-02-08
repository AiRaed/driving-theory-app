# Google Play Billing Setup Guide

This guide explains how to set up Google Play Billing for the Android app.

## Prerequisites

1. Google Play Console account with app published (or in testing)
2. Service account with Google Play Developer API access
3. Product configured in Google Play Console

## Environment Variables

Add the following environment variables to your Render dashboard (or `.env.local` for local development):

```env
# Google Play Configuration
GOOGLE_PLAY_PACKAGE_NAME=io.lingotheory.mobile
GOOGLE_PLAY_PRODUCT_ID=full_access
GOOGLE_PLAY_SERVICE_ACCOUNT_JSON={"type":"service_account","project_id":"...","private_key_id":"...","private_key":"...","client_email":"...","client_id":"...","auth_uri":"...","token_uri":"...","auth_provider_x509_cert_url":"...","client_x509_cert_url":"..."}

# Optional: Override product ID from client
NEXT_PUBLIC_GOOGLE_PRODUCT_ID=full_access
```

## Setup Steps

### 1. Create Service Account

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project (or create one)
3. Navigate to **IAM & Admin** → **Service Accounts**
4. Click **Create Service Account**
5. Fill in:
   - **Name**: `google-play-billing-service`
   - **Description**: `Service account for Google Play billing verification`
6. Click **Create and Continue**
7. Skip role assignment (not needed)
8. Click **Done**

### 2. Generate Service Account Key

1. Click on the created service account
2. Go to **Keys** tab
3. Click **Add Key** → **Create new key**
4. Select **JSON** format
5. Download the JSON file
6. Copy the entire JSON content to `GOOGLE_PLAY_SERVICE_ACCOUNT_JSON` environment variable

### 3. Grant Google Play API Access

1. Go to [Google Play Console](https://play.google.com/console/)
2. Select your app
3. Navigate to **Setup** → **API access**
4. Find your service account (by email from JSON file)
5. Click **Grant access**
6. Select permissions:
   - **View financial data, orders, and cancellation survey responses**
   - **Manage orders and subscriptions**
7. Click **Invite user**

### 4. Create Product in Google Play Console

1. Go to **Monetize** → **Products** → **In-app products** (or **Subscriptions**)
2. Click **Create product**
3. Fill in:
   - **Product ID**: `full_access` (must match `GOOGLE_PLAY_PRODUCT_ID`)
   - **Name**: `Full Access`
   - **Description**: `Unlock unlimited practice questions and mock tests`
   - **Price**: £9.99 (or your price)
4. Click **Save**
5. **Activate** the product

### 5. Install Capacitor Plugin

The plugin `@capacitor-community/in-app-purchase` should already be in `package.json`. If not:

```bash
npm install @capacitor-community/in-app-purchase
npx cap sync android
```

### 6. Test Purchase Flow

1. Build and install the app on a test device
2. Use a test account (added in Google Play Console → **Setup** → **License testing**)
3. Navigate to practice page and answer 15 questions
4. Paywall should appear with "Unlock with Google Play" button
5. Complete purchase (test purchases are free for test accounts)
6. Verify:
   - Paywall disappears
   - `profiles.access_level` is set to `'paid'` in Supabase
   - Payment record exists in `payments` table

## Troubleshooting

### Purchase verification fails

- Check service account JSON is correctly formatted (no line breaks in env var)
- Verify service account has Google Play API access
- Check product ID matches in console and env var
- Ensure product is **activated** in Google Play Console

### Plugin not found error

- Run `npx cap sync android` after installing plugin
- Rebuild Android app in Android Studio
- Check plugin is in `package.json` dependencies

### Purchase completes but access not granted

- Check `/api/billing/google/verify` logs in Render
- Verify Supabase service role key is set
- Check `profiles` table update succeeded
- Ensure `GOOGLE_PLAY_PACKAGE_NAME` matches app package name

## Database Migration

Run the migration to add Google Play fields to payments table:

```sql
-- See supabase/migrations/0003_add_google_play_fields.sql
```

Or run via Supabase CLI:
```bash
supabase db push
```





