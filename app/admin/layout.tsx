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
      <div className="border-b border-[var(--border)] bg-[var(--surface)]">
        <div className="max-w-6xl mx-auto px-4 py-3 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-4">
            <Link href="/admin" className="text-sm font-bold text-[var(--lingo-red)] tracking-tight">
              Admin
            </Link>
            <nav className="flex items-center gap-1 text-sm">
              <Link
                href="/admin"
                className="px-3 py-1.5 rounded-[var(--radius-sm)] text-[var(--text-secondary)] hover:bg-[var(--surface-secondary)] hover:text-[var(--text-primary)]"
              >
                Dashboard
              </Link>
              <Link
                href="/admin/users"
                className="px-3 py-1.5 rounded-[var(--radius-sm)] text-[var(--text-secondary)] hover:bg-[var(--surface-secondary)] hover:text-[var(--text-primary)]"
              >
                Users
              </Link>
              <Link
                href="/admin/questions"
                className="px-3 py-1.5 rounded-[var(--radius-sm)] text-[var(--text-secondary)] hover:bg-[var(--surface-secondary)] hover:text-[var(--text-primary)]"
              >
                Questions
              </Link>
              <Link
                href="/admin/questions/new"
                className="px-3 py-1.5 rounded-[var(--radius-sm)] text-[var(--text-secondary)] hover:bg-[var(--surface-secondary)] hover:text-[var(--text-primary)]"
              >
                Add
              </Link>
            </nav>
          </div>
          <Link href="/dashboard" className="text-xs font-medium text-[var(--text-secondary)] hover:text-[var(--lingo-red)]">
            ← Back to app
          </Link>
        </div>
      </div>
      <div className="max-w-6xl mx-auto px-4 py-6">{children}</div>
    </div>
  );
}
