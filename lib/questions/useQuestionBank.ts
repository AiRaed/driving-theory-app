'use client';

import { useEffect, useState } from 'react';
import { questions as staticQuestions, type Question } from '@/data/questions';
import {
  loadRomanianTranslations,
  loadUrduTranslations,
  type TranslationData,
} from '@/lib/translations';

export function useQuestionBank() {
  const [questions, setQuestions] = useState<Question[]>(staticQuestions);
  const [urTranslations, setUrTranslations] = useState<TranslationData | null>(null);
  const [roTranslations, setRoTranslations] = useState<TranslationData | null>(null);
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
            if (data.source === 'database') {
              if (data.urduByTopic) setUrTranslations(data.urduByTopic);
              if (data.romanianByTopic) setRoTranslations(data.romanianByTopic);
              // Prefer static locale files to fill gaps when DB has no RO yet
              if (!data.romanianByTopic || Object.keys(data.romanianByTopic).length === 0) {
                try {
                  const ro = await loadRomanianTranslations();
                  if (!cancelled && ro) setRoTranslations(ro);
                } catch {
                  /* ignore */
                }
              }
              if (!data.urduByTopic || Object.keys(data.urduByTopic).length === 0) {
                try {
                  const ur = await loadUrduTranslations();
                  if (!cancelled && ur) setUrTranslations(ur);
                } catch {
                  /* ignore */
                }
              }
              setReady(true);
              return;
            }
          }
        }
      } catch {
        // fall through to static + locale files
      }

      try {
        const [ur, ro] = await Promise.all([
          loadUrduTranslations(),
          loadRomanianTranslations(),
        ]);
        if (!cancelled) {
          setUrTranslations(ur);
          setRoTranslations(ro);
        }
      } catch {
        if (!cancelled) {
          setUrTranslations({});
          setRoTranslations({});
        }
      } finally {
        if (!cancelled) setReady(true);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  return { questions, urTranslations, roTranslations, source, ready };
}
