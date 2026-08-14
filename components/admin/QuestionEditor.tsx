'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  KNOWN_LANGS,
  TOPIC_META,
  emptyQuestionForm,
  emptyTranslation,
  formToDbPayload,
  getTranslation,
  langBadgeStatus,
  removeTranslation,
  rowToForm,
  rowToLearnerQuestion,
  setTranslation,
  type LangCode,
  type QuestionFormData,
  type QuestionRow,
  type QuestionStatus,
  type QuestionTranslation,
} from '@/lib/questions/types';

type Props = {
  mode: 'create' | 'edit';
  questionId?: string;
  initialPreview?: boolean;
};

type TabId = 'en' | LangCode;

export default function QuestionEditor({ mode, questionId, initialPreview }: Props) {
  const router = useRouter();
  const [form, setForm] = useState<QuestionFormData>(emptyQuestionForm());
  const [loading, setLoading] = useState(mode === 'edit');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(!!initialPreview);
  const [updatedAt, setUpdatedAt] = useState<string | null>(null);
  const [tab, setTab] = useState<TabId>('en');
  const [previewLang, setPreviewLang] = useState<TabId>('en');
  const [previewSelected, setPreviewSelected] = useState<number | null>(null);
  const [addLang, setAddLang] = useState('');
  const [customLang, setCustomLang] = useState('');

  useEffect(() => {
    if (mode !== 'edit' || !questionId) return;
    setLoading(true);
    fetch(`/api/admin/questions/${encodeURIComponent(questionId)}`)
      .then(async (r) => {
        const data = await r.json();
        if (!r.ok) throw new Error(data.error || 'Failed to load');
        const row = data.question as QuestionRow;
        setForm(rowToForm(row));
        setUpdatedAt(row.updated_at || null);
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [mode, questionId]);

  const setField = <K extends keyof QuestionFormData>(key: K, value: QuestionFormData[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const translationCodes = useMemo(
    () => Object.keys(form.translations || {}).sort((a, b) => a.localeCompare(b)),
    [form.translations]
  );

  const syncFlatFromMap = (next: QuestionFormData): QuestionFormData => {
    const ar = getTranslation(next.translations, 'ar') || emptyTranslation();
    const ur = getTranslation(next.translations, 'ur') || emptyTranslation();
    return {
      ...next,
      question_ar: ar.question,
      question_ur: ur.question,
      answer_1_ar: ar.answers[0],
      answer_2_ar: ar.answers[1],
      answer_3_ar: ar.answers[2],
      answer_4_ar: ar.answers[3],
      answer_1_ur: ur.answers[0],
      answer_2_ur: ur.answers[1],
      answer_3_ur: ur.answers[2],
      answer_4_ur: ur.answers[3],
      explanation_ar: ar.explanation,
      explanation_ur: ur.explanation,
    };
  };

  const updateLang = (code: LangCode, patch: Partial<QuestionTranslation>) => {
    setForm((prev) => {
      const current = getTranslation(prev.translations, code) || emptyTranslation();
      const merged: QuestionTranslation = {
        question: patch.question ?? current.question,
        answers: patch.answers ?? current.answers,
        explanation: patch.explanation ?? current.explanation,
      };
      const withMap = { ...prev, translations: setTranslation(prev.translations, code, merged) };
      return syncFlatFromMap(withMap);
    });
  };

  const updateLangAnswer = (code: LangCode, index: number, value: string) => {
    setForm((prev) => {
      const current = getTranslation(prev.translations, code) || emptyTranslation();
      const answers = [...current.answers] as [string, string, string, string];
      answers[index] = value;
      const withMap = {
        ...prev,
        translations: setTranslation(prev.translations, code, { ...current, answers }),
      };
      return syncFlatFromMap(withMap);
    });
  };

  const handleAddTranslation = () => {
    const code = (addLang === '__custom' ? customLang : addLang || '').trim().toLowerCase();
    if (!/^[a-z]{2,5}$/.test(code)) {
      setError('Enter a valid language code (e.g. fr, es)');
      return;
    }
    if (code === 'en') {
      setError('English is the base language, not a translation');
      return;
    }
    setForm((prev) => {
      if (prev.translations[code]) return prev;
      return syncFlatFromMap({
        ...prev,
        translations: setTranslation(prev.translations, code, emptyTranslation()),
      });
    });
    setTab(code);
    setAddLang('');
    setCustomLang('');
    setError(null);
  };

  const handleRemoveTranslation = (code: LangCode) => {
    if (!confirm(`Remove ${code.toUpperCase()} translation from this question?`)) return;
    setForm((prev) =>
      syncFlatFromMap({
        ...prev,
        translations: removeTranslation(prev.translations, code),
      })
    );
    if (tab === code) setTab('en');
  };

  const previewQuestion = useMemo(() => {
    const row = {
      ...formToDbPayload(form),
      id: form.id || 'PREVIEW',
      sort_order: 0,
      created_at: undefined,
      updated_at: undefined,
    } as QuestionRow;
    return rowToLearnerQuestion(row);
  }, [form]);

  const previewTranslation =
    previewLang === 'en' ? null : getTranslation(form.translations, previewLang);

  const uploadImage = async (file: File) => {
    const body = new FormData();
    body.append('file', file);
    const res = await fetch('/api/admin/images', { method: 'POST', body });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || data.hint || 'Upload failed');
    setField('image_url', data.url);
    if (!form.image_alt) setField('image_alt', file.name.replace(/\.[^.]+$/, ''));
  };

  const save = async (status?: QuestionStatus) => {
    setSaving(true);
    setError(null);
    setMessage(null);
    try {
      const payload = syncFlatFromMap({ ...form, status: status || form.status });
      const res = await fetch(
        mode === 'create'
          ? '/api/admin/questions'
          : `/api/admin/questions/${encodeURIComponent(questionId!)}`,
        {
          method: mode === 'create' ? 'POST' : 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Save failed');
      setMessage(status === 'published' ? 'Published.' : 'Saved.');
      if (mode === 'create' && data.question?.id) {
        router.replace(`/admin/questions/${encodeURIComponent(data.question.id)}`);
      } else if (data.question) {
        setForm(rowToForm(data.question));
        setUpdatedAt(data.question.updated_at || null);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <p className="text-sm text-[var(--text-secondary)]">Loading question…</p>;
  }

  const answerBlocks = [1, 2, 3, 4] as const;
  const badges = langBadgeStatus({
    ...formToDbPayload(form),
    id: form.id || 'PREVIEW',
    sort_order: 0,
  } as QuestionRow);

  const availableToAdd = KNOWN_LANGS.filter((l) => !form.translations[l.code]);

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">
            {mode === 'create' ? 'Add question' : `Edit ${questionId}`}
          </h1>
          {updatedAt && (
            <p className="text-xs text-[var(--text-secondary)] mt-1">
              Last updated {new Date(updatedAt).toLocaleString()} · Status: {form.status}
            </p>
          )}
          <p className="text-xs text-[var(--text-secondary)] mt-1">
            Languages: EN
            {badges.ar ? ' · AR' : ''}
            {badges.ur ? ' · UR' : ''}
            {badges.extra.length ? ` · ${badges.extra.map((c) => c.toUpperCase()).join(' · ')}` : ''}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            className="lt-btn-ghost px-4 py-2 text-sm"
            onClick={() => {
              setShowPreview((v) => !v);
              setPreviewSelected(null);
            }}
          >
            {showPreview ? 'Hide preview' : 'Preview'}
          </button>
          <button
            type="button"
            disabled={saving}
            className="lt-btn-ghost px-4 py-2 text-sm"
            onClick={() => void save('draft')}
          >
            Save Draft
          </button>
          <button
            type="button"
            disabled={saving}
            className="lt-btn-primary px-4 py-2 text-sm"
            onClick={() => void save('published')}
          >
            Publish
          </button>
        </div>
      </div>

      {error && (
        <div className="rounded-[var(--radius-md)] border border-[var(--wrong)]/30 bg-[var(--wrong-soft)] px-4 py-3 text-sm text-[var(--wrong)]">
          {error}
        </div>
      )}
      {message && (
        <div className="rounded-[var(--radius-md)] border border-[var(--correct)]/30 bg-[var(--correct-soft)] px-4 py-3 text-sm text-[var(--correct)]">
          {message}
        </div>
      )}

      {showPreview && (
        <div className="lt-card-accent p-5 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="lt-kicker">Learner preview (not counted as progress)</p>
            <select
              className="lt-input w-auto text-sm py-1.5"
              value={previewLang}
              onChange={(e) => {
                setPreviewLang(e.target.value);
                setPreviewSelected(null);
              }}
            >
              <option value="en">English</option>
              {translationCodes.map((c) => (
                <option key={c} value={c}>
                  {KNOWN_LANGS.find((k) => k.code === c)?.label || c.toUpperCase()}
                </option>
              ))}
            </select>
          </div>
          {previewQuestion.image && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={previewQuestion.image}
              alt={form.image_alt || 'Question image'}
              className="max-h-40 w-auto mx-auto object-contain"
            />
          )}
          <p className="font-semibold text-[var(--text-primary)]">{previewQuestion.promptEn}</p>
          {previewTranslation?.question ? (
            <p
              className="text-sm text-[var(--text-secondary)]"
              dir={['ar', 'ur', 'fa', 'he'].includes(previewLang) ? 'rtl' : 'ltr'}
            >
              {previewTranslation.question}
            </p>
          ) : null}
          <ul className="space-y-2">
            {previewQuestion.options.map((o, i) => {
              const shown = previewSelected !== null;
              const isCorrect = o.correct;
              const isChosen = previewSelected === i;
              return (
                <li key={i}>
                  <button
                    type="button"
                    className={`lt-option w-full text-left ${
                      shown && isCorrect
                        ? 'border-[var(--correct)] bg-[var(--correct-soft)]'
                        : shown && isChosen && !isCorrect
                          ? 'border-[var(--wrong)] bg-[var(--wrong-soft)]'
                          : ''
                    }`}
                    onClick={() => setPreviewSelected(i)}
                  >
                    <span className="font-medium">{o.en}</span>
                    {previewTranslation?.answers?.[i] ? (
                      <span
                        className="block text-sm text-[var(--text-secondary)] mt-0.5"
                        dir={['ar', 'ur', 'fa', 'he'].includes(previewLang) ? 'rtl' : 'ltr'}
                      >
                        {previewTranslation.answers[i]}
                      </span>
                    ) : null}
                  </button>
                </li>
              );
            })}
          </ul>
          {previewSelected !== null && (form.explanation_en || previewTranslation?.explanation) && (
            <div className="text-sm text-[var(--text-secondary)] border-t border-[var(--border)] pt-3 space-y-1">
              {form.explanation_en && <p>{form.explanation_en}</p>}
              {previewTranslation?.explanation ? (
                <p dir={['ar', 'ur', 'fa', 'he'].includes(previewLang) ? 'rtl' : 'ltr'}>
                  {previewTranslation.explanation}
                </p>
              ) : null}
            </div>
          )}
        </div>
      )}

      <div className="lt-card p-5 space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <label className="block text-sm">
            <span className="font-medium text-[var(--text-primary)]">Topic</span>
            <select
              className="lt-input mt-1.5"
              value={form.topic_id}
              onChange={(e) => setField('topic_id', e.target.value)}
            >
              {TOPIC_META.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.label_en}
                </option>
              ))}
            </select>
          </label>
          <label className="block text-sm">
            <span className="font-medium text-[var(--text-primary)]">Status</span>
            <select
              className="lt-input mt-1.5"
              value={form.status}
              onChange={(e) => setField('status', e.target.value as QuestionStatus)}
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
              <option value="archived">Archived</option>
            </select>
          </label>
        </div>

        <div className="flex flex-wrap gap-2 border-b border-[var(--border)] pb-2">
          <button
            type="button"
            className={`px-3 py-1.5 text-sm rounded-[var(--radius-sm)] ${
              tab === 'en'
                ? 'bg-[var(--lingo-red)] text-white font-semibold'
                : 'text-[var(--text-secondary)] hover:bg-[var(--surface-secondary)]'
            }`}
            onClick={() => setTab('en')}
          >
            English
          </button>
          {translationCodes.map((code) => (
            <button
              key={code}
              type="button"
              className={`px-3 py-1.5 text-sm rounded-[var(--radius-sm)] ${
                tab === code
                  ? 'bg-[var(--lingo-red)] text-white font-semibold'
                  : 'text-[var(--text-secondary)] hover:bg-[var(--surface-secondary)]'
              }`}
              onClick={() => setTab(code)}
            >
              {KNOWN_LANGS.find((k) => k.code === code)?.label || code.toUpperCase()}
            </button>
          ))}
        </div>

        {tab === 'en' ? (
          <div className="space-y-4">
            <label className="block text-sm">
              <span className="font-medium">Question (English)</span>
              <textarea
                className="lt-input mt-1.5 min-h-[72px]"
                value={form.question_en}
                onChange={(e) => setField('question_en', e.target.value)}
              />
            </label>
            <fieldset className="space-y-3">
              <legend className="text-sm font-bold text-[var(--text-primary)]">
                Answers (select one correct)
              </legend>
              {answerBlocks.map((n) => (
                <div
                  key={n}
                  className="rounded-[var(--radius-md)] border border-[var(--border)] p-3 space-y-2"
                >
                  <label className="flex items-center gap-2 text-sm font-semibold">
                    <input
                      type="radio"
                      name="correct_answer"
                      checked={form.correct_answer === n}
                      onChange={() => setField('correct_answer', n)}
                    />
                    Answer {String.fromCharCode(64 + n)}
                    {form.correct_answer === n ? ' (correct)' : ''}
                  </label>
                  <input
                    className="lt-input"
                    placeholder="English"
                    value={form[`answer_${n}_en` as const]}
                    onChange={(e) => setField(`answer_${n}_en`, e.target.value)}
                  />
                </div>
              ))}
            </fieldset>
            <label className="block text-sm">
              <span className="font-medium">Explanation (English)</span>
              <textarea
                className="lt-input mt-1.5 min-h-[56px]"
                value={form.explanation_en}
                onChange={(e) => setField('explanation_en', e.target.value)}
              />
            </label>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="text-sm font-bold text-[var(--text-primary)]">
                {KNOWN_LANGS.find((k) => k.code === tab)?.label || tab.toUpperCase()} translation
              </p>
              <button
                type="button"
                className="text-xs text-[var(--wrong)] hover:underline"
                onClick={() => handleRemoveTranslation(tab)}
              >
                Remove translation
              </button>
            </div>
            <label className="block text-sm">
              Translated question
              <textarea
                className="lt-input mt-1.5 min-h-[72px]"
                dir={['ar', 'ur', 'fa', 'he'].includes(tab) ? 'rtl' : 'ltr'}
                value={getTranslation(form.translations, tab)?.question || ''}
                onChange={(e) => updateLang(tab, { question: e.target.value })}
              />
            </label>
            {answerBlocks.map((n) => (
              <label key={n} className="block text-sm">
                Answer {String.fromCharCode(64 + n)}
                <input
                  className="lt-input mt-1.5"
                  dir={['ar', 'ur', 'fa', 'he'].includes(tab) ? 'rtl' : 'ltr'}
                  value={getTranslation(form.translations, tab)?.answers[n - 1] || ''}
                  onChange={(e) => updateLangAnswer(tab, n - 1, e.target.value)}
                />
              </label>
            ))}
            <label className="block text-sm">
              Translated explanation
              <textarea
                className="lt-input mt-1.5 min-h-[56px]"
                dir={['ar', 'ur', 'fa', 'he'].includes(tab) ? 'rtl' : 'ltr'}
                value={getTranslation(form.translations, tab)?.explanation || ''}
                onChange={(e) => updateLang(tab, { explanation: e.target.value })}
              />
            </label>
          </div>
        )}

        <div className="rounded-[var(--radius-md)] border border-dashed border-[var(--border)] p-3 space-y-2">
          <p className="text-sm font-bold text-[var(--text-primary)]">+ Add translation</p>
          <div className="flex flex-wrap gap-2">
            <select
              className="lt-input w-auto"
              value={addLang}
              onChange={(e) => setAddLang(e.target.value)}
            >
              <option value="">Select language…</option>
              {availableToAdd.map((l) => (
                <option key={l.code} value={l.code}>
                  {l.label} ({l.code})
                </option>
              ))}
              <option value="__custom">Custom code…</option>
            </select>
            {addLang === '__custom' && (
              <input
                className="lt-input w-28"
                placeholder="e.g. de"
                value={customLang}
                onChange={(e) => setCustomLang(e.target.value.toLowerCase())}
              />
            )}
            <button type="button" className="lt-btn-secondary px-3 py-2 text-sm" onClick={handleAddTranslation}>
              Add
            </button>
          </div>
          <p className="text-xs text-[var(--text-secondary)]">
            Extra languages beyond Arabic/Urdu require migration 0005 (`translations` JSONB). Arabic/Urdu
            also sync to flat columns for search and learners.
          </p>
        </div>

        <fieldset className="space-y-3">
          <legend className="text-sm font-bold text-[var(--text-primary)]">Image</legend>
          {form.image_url ? (
            <div className="space-y-2">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={form.image_url}
                alt={form.image_alt || 'Preview'}
                className="max-h-40 w-auto object-contain border border-[var(--border)] rounded-[var(--radius-md)] bg-[var(--surface-secondary)] p-2"
              />
              <div className="flex flex-wrap gap-2">
                <label className="lt-btn-ghost px-3 py-1.5 text-xs cursor-pointer">
                  Replace image
                  <input
                    type="file"
                    accept="image/jpeg,image/jpg,image/png,image/webp"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      void uploadImage(file).catch((err) =>
                        setError(err instanceof Error ? err.message : 'Upload failed')
                      );
                    }}
                  />
                </label>
                <button
                  type="button"
                  className="lt-btn-ghost px-3 py-1.5 text-xs"
                  onClick={() => {
                    setField('image_url', '');
                    setField('image_alt', '');
                  }}
                >
                  Remove image
                </button>
              </div>
            </div>
          ) : (
            <label className="block text-sm">
              Add image
              <input
                type="file"
                accept="image/jpeg,image/jpg,image/png,image/webp"
                className="mt-1.5 block w-full text-sm"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  void uploadImage(file).catch((err) =>
                    setError(err instanceof Error ? err.message : 'Upload failed')
                  );
                }}
              />
            </label>
          )}
          <input
            className="lt-input"
            placeholder="Image URL (public path or uploaded URL)"
            value={form.image_url}
            onChange={(e) => setField('image_url', e.target.value)}
          />
          <input
            className="lt-input"
            placeholder="Image alt text"
            value={form.image_alt}
            onChange={(e) => setField('image_alt', e.target.value)}
          />
        </fieldset>
      </div>
    </div>
  );
}
