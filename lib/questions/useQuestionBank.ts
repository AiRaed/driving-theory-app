'use client';

import { useEffect, useState } from 'react';
import { questions as staticQuestions, type Question } from '@/data/questions';
import {
  loadUrduTranslations,
  type TranslationData,
} from '@/lib/translations';

export function useQuestionBank() {
  const [questions, setQuestions] = useState<Question[]>(staticQuestions);
  const [urTranslations, setUrTranslations] = useState<TranslationData | null>(null);
  const [source, setSource] = useState<'static' | 'database'>('static');
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const res = await fetch('/api/questions/bank');
        if (res.ok) {
          const data = await res.json();
          if (!cancelled && Array.isArray(data.questions) && data.questions.length > 0) {
            setQuestions(data.questions);
            setSource(data.source === 'database' ? 'database' : 'static');
            if (data.source === 'database' && data.urduByTopic) {
              setUrTranslations(data.urduByTopic);
              setReady(true);
              return;
            }
          }
        }
      } catch {
        // fall through to static + locale file
      }

      try {
        const ur = await loadUrduTranslations();
        if (!cancelled) setUrTranslations(ur);
      } catch {
        if (!cancelled) setUrTranslations({});
      } finally {
        if (!cancelled) setReady(true);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  return { questions, urTranslations, source, ready };
}
