'use client';

import DashboardClient from './DashboardClient';

// For static export, we use client component to avoid cookies() usage
// Profile creation is handled via API routes or client-side checks
export default function DashboardPage() {
  return <DashboardClient />;
}

