import Link from 'next/link';
import { requireAdmin } from '@/lib/admin/auth';

export const dynamic = 'force-dynamic';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireAdmin();

  return (
    <div className="min-h-[calc(100vh-64px)] bg-[var(--background)]">
      <div className="border-b border-[var(--border)] bg-[var(--navy)]">
        <div className="max-w-6xl mx-auto px-4 py-3 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-4 min-w-0">
            <Link href="/admin" className="text-sm font-bold text-white tracking-tight">
              Admin
            </Link>
            <nav className="flex items-center gap-1 text-sm overflow-x-auto hide-scrollbar">
              <Link
                href="/admin"
                className="inline-flex min-h-11 items-center whitespace-nowrap rounded-xl px-3 text-white/75 hover:bg-white/10 hover:text-white"
              >
                Dashboard
              </Link>
              <Link
                href="/admin/users"
                className="inline-flex min-h-11 items-center whitespace-nowrap rounded-xl px-3 text-white/75 hover:bg-white/10 hover:text-white"
              >
                Users
              </Link>
              <Link
                href="/admin/questions"
                className="inline-flex min-h-11 items-center whitespace-nowrap rounded-xl px-3 text-white/75 hover:bg-white/10 hover:text-white"
              >
                Questions
              </Link>
              <Link
                href="/admin/content-review"
                className="inline-flex min-h-11 items-center whitespace-nowrap rounded-xl px-3 text-white/75 hover:bg-white/10 hover:text-white"
              >
                V2 Review
              </Link>
              <Link
                href="/admin/learning-cards"
                className="inline-flex min-h-11 items-center whitespace-nowrap rounded-xl px-3 text-white/75 hover:bg-white/10 hover:text-white"
              >
                Explanation hints
              </Link>
              <Link
                href="/admin/keyword-cards"
                className="inline-flex min-h-11 items-center whitespace-nowrap rounded-xl px-3 text-white/75 hover:bg-white/10 hover:text-white"
              >
                Keyword Cards
              </Link>
              <Link
                href="/admin/content-production"
                className="inline-flex min-h-11 items-center whitespace-nowrap rounded-xl px-3 text-white/75 hover:bg-white/10 hover:text-white"
              >
                Production
              </Link>
              <Link
                href="/admin/translations"
                className="inline-flex min-h-11 items-center whitespace-nowrap rounded-xl px-3 text-white/75 hover:bg-white/10 hover:text-white"
              >
                Arabic review
              </Link>
              <Link
                href="/admin/questions/new"
                className="inline-flex min-h-11 items-center whitespace-nowrap rounded-xl px-3 text-white/75 hover:bg-white/10 hover:text-white"
              >
                Add
              </Link>
            </nav>
          </div>
          <Link href="/dashboard" className="text-xs font-medium text-white/80 hover:text-white">
            ← Back to app
          </Link>
        </div>
      </div>
      <div className="max-w-6xl mx-auto px-4 py-6">{children}</div>
    </div>
  );
}
