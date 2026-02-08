# Google Play Billing Implementation

This document describes the complete Google Play Billing implementation for the Android app.

## Overview

- **Web**: Uses Stripe for payments (unchanged)
- **Android**: Uses Google Play Billing (one-time product) via custom Capacitor plugin
- **Single Source of Truth**: Supabase `profiles.access_level = 'paid'`
- **No localStorage**: All access decisions come from Supabase

## Architecture

### 1. Android Native Plugin

**File**: `android/app/src/main/java/io/lingotheory/mobile/billing/PlayBillingPlugin.java`

- Uses BillingClient v6.1.0 (Google Play Billing Library)
- Exposes methods to JavaScript:
  - `init()`: Connect to Google Play Billing service
  - `purchase(productId)`: Launch purchase flow for one-time product
  - `restore()`: Query existing purchases
- Auto-discovered by Capacitor 8 via `@CapacitorPlugin` annotation

### 2. Backend Verification

**File**: `app/api/billing/google/verify/route.ts`

- Verifies purchase with Google Play Developer API
- Acknowledges purchase (required for non-consumable products)
- Updates Supabase:
  - `profiles.access_level = 'paid'`
  - `profiles.paid_at = now()`
  - `payments` table with Google Play purchase details

### 3. Frontend Paywall

**File**: `components/PaywallOverlay.tsx`

- Detects platform using `Capacitor.isNativePlatform()`
- **Web**: Shows "Continue to Payment – £9.99" → Stripe flow
- **Android**: Shows "Buy on Google Play – £9.99" → Google Play Billing flow
- After successful purchase, calls `refresh()` to update access state

## Setup Requirements

### Environment Variables (Render)

```env
GOOGLE_PLAY_PACKAGE_NAME=io.lingotheory.mobile
GOOGLE_PLAY_SERVICE_ACCOUNT_JSON={"type":"service_account",...}
NEXT_PUBLIC_GOOGLE_PRODUCT_ID=full_access  # Optional, defaults to 'full_access'
```

### Google Play Console

1. Create one-time product:
   - Product ID: `full_access`
   - Type: Managed product (non-consumable)
   - Price: £9.99
   - Status: Active

2. Service Account Setup:
   - Create service account in Google Cloud Console
   - Grant Google Play Developer API access
   - Download JSON key → set as `GOOGLE_PLAY_SERVICE_ACCOUNT_JSON`

### Database Migration

Run migration to add Google Play fields:
```sql
-- See supabase/migrations/0003_add_google_play_fields.sql
```

## Purchase Flow

### Android

1. User clicks "Buy on Google Play – £9.99"
2. `PlayBillingPlugin.purchase('full_access')` launches Google Play purchase dialog
3. User completes purchase in Google Play
4. Plugin returns `{ productId, purchaseToken, orderId, ... }`
5. Frontend sends `purchaseToken` to `/api/billing/google/verify`
6. Backend:
   - Verifies purchase with Google Play API
   - Acknowledges purchase
   - Updates Supabase `profiles.access_level = 'paid'`
7. Frontend calls `refresh()` → paywall disappears

### Web

1. User clicks "Continue to Payment – £9.99"
2. Redirects to Stripe Checkout
3. After payment, Stripe webhook/redirect updates Supabase
4. Paywall disappears

## Key Features

- ✅ One-time purchase only (no subscriptions)
- ✅ Backend acknowledges purchases (required for non-consumable)
- ✅ Supabase is single source of truth
- ✅ No localStorage for access decisions
- ✅ Same user becomes paid on both Web and Android
- ✅ Paywall never shows if `access_level === 'paid'`

## Testing

1. Build Android app: `npx cap sync android`
2. Install on test device
3. Use test account (added in Google Play Console)
4. Answer 15 practice questions → paywall appears
5. Click "Buy on Google Play" → complete test purchase
6. Verify:
   - Paywall disappears
   - `profiles.access_level = 'paid'` in Supabase
   - Payment record in `payments` table

## Troubleshooting

### Plugin not found
- Run `npx cap sync android` after adding plugin
- Rebuild app in Android Studio
- Check plugin is in correct package: `io.lingotheory.mobile.billing`

### Purchase verification fails
- Check service account JSON is valid
- Verify service account has Google Play API access
- Ensure product ID matches: `full_access`
- Check product is **active** in Google Play Console

### Purchase completes but access not granted
- Check `/api/billing/google/verify` logs
- Verify Supabase service role key is set
- Check `profiles` table update succeeded





