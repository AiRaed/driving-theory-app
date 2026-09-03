'use client';

/**
 * @deprecated Dead store that previously hard-coded paid:true ("app is free").
 * All callers must use AccessProvider. This module now re-exports the real hook
 * so any stale import cannot grant Full Access.
 */
export { useAccess } from '@/lib/providers/AccessProvider';
