import { Suspense } from 'react';
import ChooseLanguageClient from './ChooseLanguageClient';

export default function ChooseLanguagePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[calc(100vh-64px)] flex items-center justify-center text-[var(--text-secondary)]">
          Loading...
        </div>
      }
    >
      <ChooseLanguageClient />
    </Suspense>
  );
}
