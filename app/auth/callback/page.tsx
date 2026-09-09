'use client';

import { useEffect, useRef, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import type { EmailOtpType } from '@supabase/supabase-js';
import { createClient } from '@/lib/supabase/client';

const OTP_TYPES = new Set<EmailOtpType>([
  'signup',
  'invite',
  'magiclink',
  'recovery',
  'email_change',
  'email',
]);

function asOtpType(value: string | null): EmailOtpType | null {
  if (value && OTP_TYPES.has(value as EmailOtpType)) {
    return value as EmailOtpType;
  }
  return null;
}

function looksLikeConsumedOrExpiredAuthError(message: string | undefined): boolean {
  if (!message) {
    return false;
  }
  const m = message.toLowerCase();
  return (
    m.includes('expired') ||
    m.includes('invalid flow state') ||
    m.includes('code verifier') ||
    m.includes('already been used') ||
    m.includes('otp_expired') ||
    m.includes('invalid or has expired')
  );
}

function CallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createClient();
  const ran = useRef(false);

  useEffect(() => {
    if (ran.current) {
      return;
    }
    ran.current = true;

    const handleCallback = async () => {
      const code = searchParams.get('code');
      const tokenHash = searchParams.get('token_hash');
      const typeParam = searchParams.get('type');
      const error = searchParams.get('error');
      const errorCode = searchParams.get('error_code');
      const errorDescription = searchParams.get('error_description');

      const goConfirmedNoSession = () => {
        router.replace('/auth?confirmed=1');
      };

      const goSuccess = async () => {
        try {
          await fetch('/api/access/status', {
            cache: 'no-store',
            headers: {
              'Cache-Control': 'no-cache',
            },
          });
        } catch (err) {
          console.error('[Callback] Error checking profile:', err);
        }
        router.replace('/dashboard');
      };

      const establishedUser = async () => {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        return user ?? null;
      };

      if (error) {
        const user = await establishedUser();
        if (user) {
          await goSuccess();
          return;
        }

        const alreadyResolved =
          errorCode === 'otp_expired' ||
          looksLikeConsumedOrExpiredAuthError(errorDescription || error);
        if (alreadyResolved) {
          goConfirmedNoSession();
          return;
        }

        router.replace('/auth?error=confirm_failed');
        return;
      }

      if (code) {
        const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
        if (exchangeError) {
          const user = await establishedUser();
          if (user) {
            await goSuccess();
            return;
          }
          if (looksLikeConsumedOrExpiredAuthError(exchangeError.message)) {
            goConfirmedNoSession();
            return;
          }
          router.replace('/auth?error=confirm_failed');
          return;
        }
        await goSuccess();
        return;
      }

      if (tokenHash) {
        const otpType = asOtpType(typeParam) ?? 'email';
        const { error: otpError } = await supabase.auth.verifyOtp({
          token_hash: tokenHash,
          type: otpType,
        });
        if (!otpError) {
          await goSuccess();
          return;
        }
        const user = await establishedUser();
        if (user) {
          await goSuccess();
          return;
        }
        if (looksLikeConsumedOrExpiredAuthError(otpError.message)) {
          goConfirmedNoSession();
          return;
        }
        router.replace('/auth?error=confirm_failed');
        return;
      }

      const user = await establishedUser();
      if (user) {
        await goSuccess();
        return;
      }

      goConfirmedNoSession();
    };

    void handleCallback();
  }, [searchParams, router, supabase]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
        <p className="text-slate-600">Processing authentication...</p>
      </div>
    </div>
  );
}

export default function CallbackPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Loading...</p>
        </div>
      </div>
    }>
      <CallbackContent />
    </Suspense>
  );
}
