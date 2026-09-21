import { redirect } from 'next/navigation';

/**
 * Legacy TikTok / ad entry URL.
 * Redirects to the main Landing Page and preserves all query / UTM params.
 */
export default function DownloadRedirectPage({
  searchParams,
}: {
  searchParams: Record<string, string | string[] | undefined>;
}) {
  const params = new URLSearchParams();

  for (const [key, value] of Object.entries(searchParams || {})) {
    if (Array.isArray(value)) {
      for (const item of value) {
        if (item != null && item !== '') {
          params.append(key, item);
        }
      }
    } else if (value != null && value !== '') {
      params.set(key, value);
    }
  }

  const qs = params.toString();
  redirect(qs ? `/?${qs}` : '/');
}
