/**
 * Learning Cards write/activation guards (Phase 5C).
 *
 * App admin APIs may use Supabase after 0009 is applied.
 * The import tool must not write live data without an explicit confirm flag.
 * Seeds and imports never publish.
 */

import { learningCardsBackend } from './backend';

export function assertLocalLearningCardsOnly(): void {
  // Kept for older callers. Phase 5C allows a Supabase backend; production
  // never uses gitignored JSON. Live import still requires a confirm flag.
  void learningCardsBackend();
}

export function assertImportConfirm(argv: string[]): void {
  const confirm = argv.includes('--confirm-shared-supabase');
  const apply = argv.includes('--apply');
  if (apply && !confirm) {
    throw new Error(
      'Refusing live import. Pass --dry-run (default) or --apply --confirm-shared-supabase.'
    );
  }
  if (argv.includes('--publish') || argv.includes('--status=published')) {
    throw new Error('Import must never publish cards.');
  }
}
