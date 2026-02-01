# Supabase Email Confirmation Setup

## Overview
This document outlines the Supabase dashboard configuration needed for email confirmation to work correctly with the `/auth/callback` route.

## 1. Email Template Configuration

### Confirm Sign-up Template

1. Go to: **Supabase Dashboard → Authentication → Email Templates**
2. Select: **"Confirm signup"** template
3. Update the confirmation button/link to include the callback redirect:

**Option A: If using a button with ConfirmationURL**
```html
<a href="{{ .ConfirmationURL }}&redirect_to={{ .SiteURL }}/auth/callback">Confirm Email</a>
```

**Option B: If ConfirmationURL already has query parameters**
You may need to check if the URL already contains parameters. Supabase typically handles this automatically, but ensure the redirect_to parameter is added:

```html
<a href="{{ .ConfirmationURL }}&redirect_to={{ .SiteURL }}/auth/callback">Confirm Email</a>
```

**Important Notes:**
- Use `{{ .ConfirmationURL }}` - this automatically includes the necessary `code` parameter for PKCE flow
- Use `{{ .SiteURL }}` - this uses the configured Site URL (don't hardcode domains)
- The `redirect_to` parameter tells Supabase where to redirect after confirmation

## 2. URL Configuration (Allow List)

1. Go to: **Supabase Dashboard → Authentication → URL Configuration**

2. **Site URL** should be set to:
   ```
   https://www.lingotheory.org
   ```
   (Or `http://localhost:3000` for local development)

3. **Redirect URLs** (Allow list) must include:
   ```
   http://localhost:3000/auth/callback
   https://www.lingotheory.org/auth/callback
   ```

   **Also ensure these existing URLs are present:**
   ```
   http://localhost:3000/auth/reset
   https://www.lingotheory.org/auth/reset
   ```

   **Important:** 
   - Do NOT use wildcards like `*` or `**`
   - Each URL must be explicitly listed
   - Include both http (for local dev) and https (for production)

## 3. How It Works

1. User signs up → receives confirmation email
2. User clicks confirmation link → Supabase processes the confirmation
3. Supabase redirects to `/auth/callback?code=...` (with PKCE code)
4. The callback page (`app/auth/callback/page.tsx`):
   - Exchanges the code for a session using `exchangeCodeForSession()`
   - Redirects to `/dashboard` if successful
   - Redirects to `/auth?confirmed=1` if no code but session exists
   - Redirects to `/auth?error=confirm_failed` if there's an error

## 4. Testing

1. **Local Development:**
   - Ensure `NEXT_PUBLIC_SITE_URL=http://localhost:3000` in `.env.local`
   - Sign up with a test email
   - Click the confirmation link
   - Should redirect to `/dashboard` or `/auth?confirmed=1`

2. **Production:**
   - Ensure `NEXT_PUBLIC_SITE_URL=https://www.lingotheory.org` in environment variables
   - Test the full flow end-to-end

## 5. Troubleshooting

- **404 on `/auth/callback`**: Ensure the route exists (`app/auth/callback/page.tsx`)
- **Redirect not working**: Check that the callback URL is in the Supabase allow list
- **Session not created**: Verify the code exchange is working (check server logs)
- **Wrong redirect**: Check that `emailRedirectTo` in signup is set to `/auth/callback`

