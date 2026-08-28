'use client';

import { useEffect, useState } from 'react';
import { questions as staticQuestions, type Question } from '@/data/questions';
import {
  loadPersianTranslations,
  loadPolishTranslations,
  loadPortugueseTranslations,
  loadRomanianTranslations,
  loadUrduTranslations,
  type TranslationData,
} from '@/lib/translations';

export function useQuestionBank() {
  const [questions, setQuestions] = useState<Question[]>(staticQuestions);
  const [urTranslations, setUrTranslations] = useState<TranslationData | null>(null);
  const [roTranslations, setRoTranslations] = useState<TranslationData | null>(null);
  const [plTranslations, setPlTranslations] = useState<TranslationData | null>(null);
  const [ptTranslations, setPtTranslations] = useState<TranslationData | null>(null);
  const [faTranslations, setFaTranslations] = useState<TranslationData | null>(null);
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
              if (data.polishByTopic) setPlTranslations(data.polishByTopic);
              if (data.portugueseByTopic) setPtTranslations(data.portugueseByTopic);
              if (data.persianByTopic) setFaTranslations(data.persianByTopic);
              // Prefer static locale files to fill gaps when DB has no RO/PL/PT/FA yet
              if (!data.romanianByTopic || Object.keys(data.romanianByTopic).length === 0) {
                try {
                  const ro = await loadRomanianTranslations();
                  if (!cancelled && ro) setRoTranslations(ro);
                } catch {
                  /* ignore */
                }
              }
              if (!data.polishByTopic || Object.keys(data.polishByTopic).length === 0) {
                try {
                  const pl = await loadPolishTranslations();
                  if (!cancelled && pl) setPlTranslations(pl);
                } catch {
                  /* ignore */
                }
              }
              if (!data.portugueseByTopic || Object.keys(data.portugueseByTopic).length === 0) {
                try {
                  const pt = await loadPortugueseTranslations();
                  if (!cancelled && pt) setPtTranslations(pt);
                } catch {
                  /* ignore */
                }
              }
              if (!data.persianByTopic || Object.keys(data.persianByTopic).length === 0) {
                try {
                  const fa = await loadPersianTranslations();
                  if (!cancelled && fa) setFaTranslations(fa);
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
        const [ur, ro, pl, pt, fa] = await Promise.all([
          loadUrduTranslations(),
          loadRomanianTranslations(),
          loadPolishTranslations(),
          loadPortugueseTranslations(),
          loadPersianTranslations(),
        ]);
        if (!cancelled) {
          setUrTranslations(ur);
          setRoTranslations(ro);
          setPlTranslations(pl);
          setPtTranslations(pt);
          setFaTranslations(fa);
        }
      } catch {
        if (!cancelled) {
          setUrTranslations({});
          setRoTranslations({});
          setPlTranslations({});
          setPtTranslations({});
          setFaTranslations({});
        }
      } finally {
        if (!cancelled) setReady(true);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  return {
    questions,
    urTranslations,
    roTranslations,
    plTranslations,
    ptTranslations,
    faTranslations,
    source,
    ready,
  };
}
