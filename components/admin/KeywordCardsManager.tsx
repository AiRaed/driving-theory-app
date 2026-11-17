'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { canAdvanceCardStatus, type LearningCardStatus } from '@/lib/learning-cards/types';

type KeywordRow = {
  id: string;
  term_en: string;
  term_normalized: string;
  explanation_en: string;
  translation_ar: string;
  explanation_ar: string;
  image_url: string | null;
  image_alt: string | null;
  status: LearningCardStatus;
  notes: string | null;
};

type LinkRow = { keyword_id: string; question_id: string };

type EditorState = {
  id: string | null;
  term_en: string;
  explanation_en: string;
  translation_ar: string;
  explanation_ar: string;
  image_url: string;
  image_alt: string;
  notes: string;
  status: LearningCardStatus;
};

const EMPTY: EditorState = {
  id: null,
  term_en: '',
  explanation_en: '',
  translation_ar: '',
  explanation_ar: '',
  image_url: '',
  image_alt: '',
  notes: '',
  status: 'draft',
};

const STATUSES = ['draft', 'submitted', 'approved', 'published', 'archived'] as const;

type DraftFields = Pick<
  EditorState,
  'term_en' | 'explanation_en' | 'translation_ar' | 'explanation_ar' | 'image_url' | 'image_alt' | 'notes'
>;

function draftFields(editor: DraftFields): DraftFields {
  return {
    term_en: editor.term_en,
    explanation_en: editor.explanation_en,
    translation_ar: editor.translation_ar,
    explanation_ar: editor.explanation_ar,
    image_url: editor.image_url,
    image_alt: editor.image_alt,
    notes: editor.notes,
  };
}

type ImportFlag = {
  term_en: string;
  review_concern: string | null;
  review_note: string | null;
  question_ids: string[];
};

type ImportPreview = {
  ok: boolean;
  errors?: string[];
  error?: string;
  review_flags?: ImportFlag[];
  keyword_count?: number;
  link_count?: number;
  would_create?: number;
  would_update?: number;
  would_skip_duplicate?: number;
  would_skip_manual?: number;
  would_skip_protected?: number;
  would_link?: number;
  database?: string;
  migration_required?: string | null;
  published?: boolean;
};

type ImportResult = {
  created?: number;
  updated?: number;
  skipped?: number;
  duplicate?: number;
  failed?: number;
  linked?: number;
  published?: boolean;
  error?: string;
  failures?: Array<{ term_en: string; message: string }>;
};

function actionLabel(from: LearningCardStatus, to: LearningCardStatus): string {
  if (from === 'published' && to === 'approved') return 'Unpublish';
  if (to === 'submitted') return 'Submit for review';
  if (to === 'approved') return 'Approve';
  if (to === 'published') return 'Publish';
  if (to === 'draft') return 'Return to draft';
  return to;
}

export default function KeywordCardsManager() {
  const [rows, setRows] = useState<KeywordRow[]>([]);
  const [links, setLinks] = useState<LinkRow[]>([]);
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState('');
  const [editor, setEditor] = useState<EditorState>(EMPTY);
  const [savedDraft, setSavedDraft] = useState<DraftFields>(draftFields(EMPTY));
  const [questionId, setQuestionId] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [storage, setStorage] = useState<'local' | 'supabase' | ''>('');
  const [busy, setBusy] = useState(false);
  const [libraryOpen, setLibraryOpen] = useState(false);
  const [library, setLibrary] = useState<Array<{ url: string; label: string }>>([]);
  const [importPreview, setImportPreview] = useState<ImportPreview | null>(null);
  const [importResult, setImportResult] = useState<ImportResult | null>(null);
  const [importConfirmed, setImportConfirmed] = useState(false);
  const editorPanelRef = useRef<HTMLElement>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch('/api/admin/keyword-cards');
    const data = await res.json();
    if (!res.ok) {
      setError(data.error || 'Could not load keyword cards');
      setRows([]);
      setLinks([]);
      setStorage('');
    } else {
      setError(null);
      setRows(data.keywords || []);
      setLinks(data.links || []);
      setStorage(data.backend === 'local' || data.backend === 'supabase' ? data.backend : '');
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return rows.filter((row) => {
      if (status && row.status !== status) return false;
      if (!q) return true;
      return (
        row.term_en.toLowerCase().includes(q) ||
        row.term_normalized.includes(q) ||
        row.explanation_en.toLowerCase().includes(q) ||
        row.translation_ar.toLowerCase().includes(q) ||
        row.explanation_ar.toLowerCase().includes(q)
      );
    });
  }, [rows, query, status]);

  const statusCounts = useMemo(() => {
    const counts = new Map<string, number>();
    for (const row of rows) counts.set(row.status, (counts.get(row.status) || 0) + 1);
    return counts;
  }, [rows]);

  const linked = editor.id
    ? links.filter((link) => link.keyword_id === editor.id).map((link) => link.question_id)
    : [];

  const dirty = JSON.stringify(draftFields(editor)) !== JSON.stringify(savedDraft);

  const revealEditor = () => {
    if (typeof window === 'undefined') return;
    if (!window.matchMedia('(max-width: 1023px)').matches) return;
    window.requestAnimationFrame(() => {
      editorPanelRef.current?.scrollIntoView({ block: 'start' });
    });
  };

  const startNewKeyword = () => {
    setEditor(EMPTY);
    setSavedDraft(draftFields(EMPTY));
    setQuestionId('');
    setMessage(null);
    setError(null);
    revealEditor();
  };

  const fillEditor = (row: KeywordRow, options?: { keepNotice?: boolean }) => {
    const next: EditorState = {
      id: row.id,
      term_en: row.term_en,
      explanation_en: row.explanation_en,
      translation_ar: row.translation_ar || '',
      explanation_ar: row.explanation_ar || '',
      image_url: row.image_url || '',
      image_alt: row.image_alt || '',
      notes: row.notes || '',
      status: row.status,
    };
    setEditor(next);
    setSavedDraft(draftFields(next));
    if (!options?.keepNotice) {
      setMessage(null);
      setError(null);
    }
  };

  const payloadFrom = (next: EditorState) => ({
    term_en: next.term_en,
    explanation_en: next.explanation_en,
    translation_ar: next.translation_ar,
    explanation_ar: next.explanation_ar,
    image_url: next.image_url || null,
    image_alt: next.image_alt,
    notes: next.notes,
  });

  const persist = async (next: EditorState, success: string) => {
    setBusy(true);
    setError(null);
    setMessage(null);
    const res = await fetch(next.id ? `/api/admin/keyword-cards/${next.id}` : '/api/admin/keyword-cards', {
      method: next.id ? 'PATCH' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payloadFrom(next)),
    });
    const data = await res.json();
    setBusy(false);
    if (!res.ok) {
      setEditor(next);
      setError(data.error || 'Save failed');
      return;
    }
    fillEditor(data.keyword, { keepNotice: true });
    setMessage(success);
    await load();
  };

  const save = async () => {
    await persist(
      editor,
      editor.id ? 'Keyword card saved. Publication was not changed.' : 'Draft saved. It is not published.'
    );
  };

  const changeStatus = async (to: LearningCardStatus) => {
    if (!editor.id) return;
    if (dirty) {
      setError('Save changes before submitting, approving, publishing, or unpublishing.');
      return;
    }
    setBusy(true);
    setError(null);
    const res = await fetch(`/api/admin/keyword-cards/${editor.id}/status`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: to }),
    });
    const data = await res.json();
    setBusy(false);
    if (!res.ok) {
      setError(data.error || 'Status change failed');
      return;
    }
    setMessage(
      to === 'published'
        ? 'Published. Learners can see this on linked questions.'
        : 'Status updated. Learners only see published cards.'
    );
    fillEditor(data.keyword, { keepNotice: true });
    await load();
  };

  const remove = async () => {
    if (!editor.id) return;
    if (editor.status === 'published') {
      setError('Unpublish the keyword card before deleting it.');
      return;
    }
    const confirmed = window.confirm(
      `Delete “${editor.term_en}”? This removes ${linked.length} question link(s) and any saved copies. Official questions are not changed.`
    );
    if (!confirmed) return;
    setBusy(true);
    const res = await fetch(`/api/admin/keyword-cards/${editor.id}`, { method: 'DELETE' });
    const data = await res.json();
    setBusy(false);
    if (!res.ok) {
      setError(data.error || 'Delete failed');
      return;
    }
    setEditor(EMPTY);
    setSavedDraft(draftFields(EMPTY));
    setMessage('Keyword card deleted.');
    await load();
  };

  const linkQuestion = async () => {
    if (!editor.id) return;
    const normalized = questionId.trim().toUpperCase();
    if (linked.some((id) => id.toUpperCase() === normalized)) {
      setError('That question is already linked');
      setMessage(null);
      return;
    }
    setBusy(true);
    setError(null);
    const res = await fetch(`/api/admin/keyword-cards/${editor.id}/links`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question_id: questionId }),
    });
    const data = await res.json();
    setBusy(false);
    if (!res.ok) {
      setError(data.error || 'Could not link question');
      return;
    }
    setQuestionId('');
    setMessage(`Linked ${data.link.question_id}. The official question text was not changed.`);
    await load();
  };

  const unlinkQuestion = async (id: string) => {
    if (!editor.id) return;
    setBusy(true);
    const res = await fetch(
      `/api/admin/keyword-cards/${editor.id}/links?question_id=${encodeURIComponent(id)}`,
      { method: 'DELETE' }
    );
    const data = await res.json();
    setBusy(false);
    if (!res.ok) {
      setError(data.error || 'Could not unlink');
      return;
    }
    await load();
  };

  const uploadImage = async (file: File) => {
    if (!editor.id) return;
    setBusy(true);
    setError(null);
    const form = new FormData();
    form.set('file', file);
    form.set('image_alt', editor.image_alt || editor.term_en || 'Keyword image');
    const res = await fetch(`/api/admin/keyword-cards/${editor.id}/media`, {
      method: 'POST',
      body: form,
    });
    const data = await res.json();
    setBusy(false);
    if (!res.ok) {
      setError(data.error || 'Upload failed');
      return;
    }
    setEditor((current) => ({
      ...current,
      image_url: data.keyword.image_url || '',
      image_alt: data.keyword.image_alt || '',
      status: data.keyword.status,
    }));
    setSavedDraft((current) => ({
      ...current,
      image_url: data.keyword.image_url || '',
      image_alt: data.keyword.image_alt || '',
    }));
    setMessage('Image saved. The card was not published by this upload.');
    await load();
  };

  const clearImage = async () => {
    if (!editor.id) {
      setEditor((current) => ({ ...current, image_url: '', image_alt: '' }));
      return;
    }
    setBusy(true);
    const res = await fetch(`/api/admin/keyword-cards/${editor.id}/media`, { method: 'DELETE' });
    const data = await res.json();
    setBusy(false);
    if (!res.ok) {
      setError(data.error || 'Could not remove image');
      return;
    }
    setEditor((current) => ({
      ...current,
      image_url: '',
      image_alt: '',
      status: data.keyword.status,
    }));
    setSavedDraft((current) => ({ ...current, image_url: '', image_alt: '' }));
    setMessage('Image removed. A text-only card can still be published.');
    await load();
  };

  const openLibrary = async () => {
    setLibraryOpen(true);
    const res = await fetch('/api/admin/keyword-cards/media-library');
    const data = await res.json();
    if (!res.ok) {
      setLibrary([]);
      setError(data.error || 'Could not load the image library');
      return;
    }
    setError(null);
    setLibrary(data.images || []);
  };

  const useLibraryImage = (url: string, label: string) => {
    const next = { ...editor, image_url: url, image_alt: editor.image_alt || label };
    setLibraryOpen(false);
    if (!editor.id) {
      setEditor(next);
      setError(null);
      setMessage('Existing image selected. Save the draft to keep it. This does not publish the card.');
      return;
    }
    void persist(next, 'Existing image saved. Publication was not changed.');
  };

  const transitions = (STATUSES as readonly LearningCardStatus[]).filter(
    (to) => editor.id && to !== editor.status && canAdvanceCardStatus(editor.status, to) && to !== 'archived'
  );

  const previewImport = async () => {
    setBusy(true);
    setError(null);
    setImportResult(null);
    const res = await fetch('/api/admin/keyword-cards/import', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'preview' }),
    });
    const data = (await res.json()) as ImportPreview;
    setBusy(false);
    setImportPreview(data);
    setImportConfirmed(false);
    if (!res.ok && !data.keyword_count) {
      setError(data.error || 'Draft import preview failed');
    }
  };

  const commitImport = async () => {
    if (!importConfirmed || !importPreview?.ok || importPreview.database === 'not_migrated') return;
    setBusy(true);
    setError(null);
    const res = await fetch('/api/admin/keyword-cards/import', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'commit', confirm: 'IMPORT_DRAFTS_ONLY' }),
    });
    const data = (await res.json()) as ImportResult;
    setBusy(false);
    if (!res.ok) {
      setError(data.error || 'Draft import failed');
      setImportResult(data);
      return;
    }
    setImportResult(data);
    setMessage(
      `Draft import finished. Created ${data.created || 0}, updated ${data.updated || 0}, duplicate ${data.duplicate || 0}, skipped ${data.skipped || 0}, failed ${data.failed || 0}, linked ${data.linked || 0}. Nothing was published.`
    );
    await load();
  };

  return (
    <div className="space-y-5">
      <div>
        <p className="lt-kicker mb-1">Learning</p>
        <h1 className="text-2xl font-bold">Keyword Cards</h1>
        <p className="mt-1 text-sm text-[var(--text-secondary)]">
          Difficult theory terms, separate from Explanation Hints. Cards stay unpublished until you
          approve and publish them. An image is optional. Video is not used. Official DVSA questions
          are not edited here.
        </p>
      </div>
      <section className="lt-card space-y-3 p-4">
        <h2 className="text-sm font-bold">Import reviewed drafts</h2>
        <p className="text-sm text-[var(--text-secondary)]">
          Reads the reviewed local keyword file on the server. Preview does not write. Import creates
          unpublished drafts and their question links only after you confirm. It does not approve or
          publish, and it leaves manually edited cards unchanged. Migration 0011 must already be
          applied before a database write can succeed.
        </p>
        <button
          type="button"
          className="lt-btn-secondary px-3 py-2 text-sm"
          disabled={busy}
          onClick={() => void previewImport()}
        >
          Preview draft import
        </button>
        {importPreview ? (
          <div className="space-y-2 text-sm">
            <p>
              {importPreview.keyword_count || 0} cards, {importPreview.link_count || 0} links.
              {importPreview.database === 'not_migrated'
                ? ' The keyword tables are not migrated, so nothing can be written.'
                : ` Would create ${importPreview.would_create || 0}, update ${importPreview.would_update || 0}, duplicate ${importPreview.would_skip_duplicate || 0}, skip manual ${importPreview.would_skip_manual || 0}, skip protected ${importPreview.would_skip_protected || 0}, and add ${importPreview.would_link || 0} links.`}
            </p>
            {importPreview.errors && importPreview.errors.length > 0 ? (
              <ul className="list-disc pl-5 text-[var(--wrong)]">
                {importPreview.errors.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            ) : null}
            {importPreview.review_flags && importPreview.review_flags.length > 0 ? (
              <div>
                <p className="font-semibold">
                  {importPreview.review_flags.length} cards still need human review. Import does not
                  approve them.
                </p>
                <ul className="mt-1 space-y-1">
                  {importPreview.review_flags.map((flag) => (
                    <li key={flag.term_en}>
                      <span className="font-semibold">{flag.term_en}</span>
                      {flag.review_concern ? ` (${flag.review_concern})` : ''}: {flag.review_note}{' '}
                      <span className="text-[var(--text-secondary)]">{flag.question_ids.join(', ')}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
            <label className="flex items-start gap-2">
              <input
                type="checkbox"
                className="mt-1"
                checked={importConfirmed}
                onChange={(event) => setImportConfirmed(event.target.checked)}
                disabled={!importPreview.ok || importPreview.database === 'not_migrated'}
              />
              <span>Import these as unpublished drafts. Do not approve or publish them.</span>
            </label>
            <button
              type="button"
              className="lt-btn-primary px-3 py-2 text-sm"
              disabled={
                busy ||
                !importPreview.ok ||
                !importConfirmed ||
                importPreview.database === 'not_migrated'
              }
              onClick={() => void commitImport()}
            >
              Import drafts
            </button>
          </div>
        ) : null}
        {importResult && !importResult.error ? (
          <p className="text-sm" role="status">
            Created {importResult.created || 0}, updated {importResult.updated || 0}, duplicate{' '}
            {importResult.duplicate || 0}, skipped {importResult.skipped || 0}, failed{' '}
            {importResult.failed || 0}, linked {importResult.linked || 0}. Published:{' '}
            {String(importResult.published === true)}.
          </p>
        ) : null}
      </section>
      {error ? (
        <p className="text-sm text-[var(--wrong)]" role="alert">
          {error}
        </p>
      ) : null}
      {message ? (
        <p className="text-sm text-[var(--text-secondary)]" role="status">
          {message}
        </p>
      ) : null}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:items-start">
        <section className="lt-card space-y-3 p-4">
          <div className="flex flex-wrap items-end justify-between gap-2">
            <h2 className="text-lg font-bold" data-testid="keyword-card-count">
              {loading ? 'Loading keyword cards' : `${rows.length} keyword cards`}
            </h2>
            <button type="button" className="lt-btn-secondary px-3 py-2 text-sm" onClick={startNewKeyword}>
              New keyword
            </button>
          </div>
          {storage ? (
            <p className="text-xs text-[var(--text-secondary)]">
              {storage === 'local'
                ? 'Local development store. Refresh and restart read this file.'
                : 'Supabase. Refresh and restart read these rows.'}
            </p>
          ) : null}
          <p className="text-sm text-[var(--text-secondary)]" aria-live="polite">
            {loading
              ? 'The list will appear here.'
              : query || status
                ? `Showing ${visible.length} of ${rows.length}. Scroll the list to browse.`
                : `Scroll the list to browse all ${rows.length}.`}
          </p>
          {!loading && rows.length > 0 ? (
            <p className="text-xs font-semibold uppercase tracking-wide text-[var(--text-secondary)]">
              {STATUSES.map((item) => `${statusCounts.get(item) || 0} ${item}`).join(' · ')}
            </p>
          ) : null}
          <div className="flex flex-wrap gap-2">
            <input
              className="lt-input min-w-0 flex-1"
              placeholder="Search terms"
              value={query}
              aria-label="Search terms"
              onChange={(event) => setQuery(event.target.value)}
            />
            <select
              className="lt-input"
              aria-label="Filter by status"
              value={status}
              onChange={(event) => setStatus(event.target.value)}
            >
              <option value="">All statuses</option>
              {STATUSES.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>
          {!loading && visible.length === 0 ? (
            <p className="text-sm text-[var(--text-secondary)]">
              {rows.length === 0 ? 'No keyword cards yet.' : 'No keyword cards match this search.'}
            </p>
          ) : null}
          <ul
            className="lt-keyword-list h-[min(32rem,62vh)] space-y-2 overflow-y-scroll rounded-[var(--radius-sm)] border border-[var(--border)] bg-[var(--surface-secondary)] p-2"
            aria-label={
              loading ? 'Keyword cards' : `${visible.length} of ${rows.length} keyword cards`
            }
          >
            {visible.map((row) => (
              <li key={row.id}>
                <button
                  type="button"
                  aria-pressed={editor.id === row.id}
                  className={`w-full rounded-[var(--radius-sm)] border px-3 py-2 text-left hover:bg-[var(--surface-secondary)] ${
                    editor.id === row.id
                      ? 'border-[var(--lingo-red)] bg-[var(--surface-secondary)]'
                      : 'border-[var(--border)]'
                  }`}
                  onClick={() => {
                    fillEditor(row);
                    setQuestionId('');
                    revealEditor();
                  }}
                >
                  <span className="block font-semibold">{row.term_en}</span>
                  <span className="text-[11px] uppercase text-[var(--text-secondary)]">
                    {row.status}
                    {row.image_url ? ' · image' : ' · text only'}
                    {' · '}
                    {links.filter((link) => link.keyword_id === row.id).length} questions
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </section>
        <section ref={editorPanelRef} className="lt-card scroll-mt-4 space-y-4 p-4">
          <div>
            <h2 className="text-base font-bold">{editor.id ? 'Edit keyword' : 'New keyword'}</h2>
            <p className="mt-1 text-sm text-[var(--text-secondary)]">
              {editor.id
                ? `${editor.term_en} · ${editor.status} · ${linked.length} linked questions · ${
                    editor.image_url ? 'image attached' : 'text only'
                  }`
                : 'Blank card. The keyword list stays beside this editor.'}
            </p>
          </div>
          <form
            className="space-y-3"
            onSubmit={(event) => {
              event.preventDefault();
              void save();
            }}
          >
            <label className="block text-sm font-semibold" htmlFor="keyword-term">
              English term
            </label>
            <input
              id="keyword-term"
              className="lt-input"
              value={editor.term_en}
              onChange={(event) => setEditor({ ...editor, term_en: event.target.value })}
            />
            <label className="block text-sm font-semibold" htmlFor="keyword-en">
              Simple English explanation
            </label>
            <textarea
              id="keyword-en"
              className="lt-input min-h-[96px]"
              value={editor.explanation_en}
              onChange={(event) => setEditor({ ...editor, explanation_en: event.target.value })}
            />
            <label className="block text-sm font-semibold" htmlFor="keyword-ar-term">
              Arabic translation (optional)
            </label>
            <input
              id="keyword-ar-term"
              className="lt-input"
              dir="rtl"
              lang="ar"
              value={editor.translation_ar}
              onChange={(event) => setEditor({ ...editor, translation_ar: event.target.value })}
            />
            <label className="block text-sm font-semibold" htmlFor="keyword-ar">
              Arabic explanation (optional)
            </label>
            <textarea
              id="keyword-ar"
              className="lt-input min-h-[80px]"
              dir="rtl"
              lang="ar"
              value={editor.explanation_ar}
              onChange={(event) => setEditor({ ...editor, explanation_ar: event.target.value })}
            />
            <label className="block text-sm font-semibold" htmlFor="keyword-alt">
              Image description (optional)
            </label>
            <input
              id="keyword-alt"
              className="lt-input"
              value={editor.image_alt}
              onChange={(event) => setEditor({ ...editor, image_alt: event.target.value })}
            />
            <div className="flex flex-wrap gap-2">
              <label className="lt-btn-ghost px-3 py-2 text-sm">
                {editor.image_url ? 'Replace image' : 'Upload image'}
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp,.jpg,.jpeg,.png,.webp"
                  className="sr-only"
                  aria-label={editor.image_url ? 'Replace keyword image' : 'Upload keyword image'}
                  disabled={!editor.id || busy}
                  onChange={(event) => {
                    const file = event.target.files?.[0];
                    event.target.value = '';
                    if (file) void uploadImage(file);
                  }}
                />
              </label>
              <button type="button" className="lt-btn-ghost px-3 py-2 text-sm" onClick={() => void openLibrary()}>
                Choose existing image
              </button>
              {editor.image_url ? (
                <button type="button" className="lt-btn-ghost px-3 py-2 text-sm" onClick={() => void clearImage()}>
                  Remove image
                </button>
              ) : (
                <span className="self-center text-xs text-[var(--text-secondary)]">Text-only card</span>
              )}
            </div>
            {!editor.id ? (
              <p className="text-xs text-[var(--text-secondary)]">
                Save the draft before uploading a file. You can still create the card with no image.
              </p>
            ) : null}
            {libraryOpen ? (
              <div className="max-h-48 space-y-1 overflow-y-auto rounded border border-[var(--border)] p-2">
                {library.length === 0 ? (
                  <p className="text-xs text-[var(--text-secondary)]">No library images are available yet.</p>
                ) : (
                  library.map((item) => (
                    <button
                      key={item.url}
                      type="button"
                      className="block w-full truncate text-left text-xs hover:text-[var(--lingo-red)]"
                      onClick={() => useLibraryImage(item.url, item.label)}
                    >
                      {item.label}
                    </button>
                  ))
                )}
              </div>
            ) : null}
            <div className="flex flex-wrap gap-2">
              <button type="submit" className="lt-btn-primary px-3 py-2 text-sm" disabled={busy}>
                {editor.id ? 'Save changes' : 'Save draft'}
              </button>
              {editor.id && editor.status !== 'published' ? (
                <button type="button" className="lt-btn-ghost px-3 py-2 text-sm text-[var(--wrong)]" onClick={() => void remove()}>
                  Delete
                </button>
              ) : null}
            </div>
            {editor.status === 'published' ? (
              <p className="text-xs text-[var(--text-secondary)]">
                This card stays in the list while it is published. Unpublish it before deleting.
              </p>
            ) : null}
          </form>
          {editor.id ? (
            <div className="space-y-2 border-t border-[var(--border)] pt-3">
              <p className="text-sm font-semibold">
                Status: <span className="uppercase">{editor.status}</span>
              </p>
              {dirty ? (
                <p className="text-xs text-[var(--text-secondary)]">
                  Save changes before submitting, approving, publishing, or unpublishing.
                </p>
              ) : null}
              <div className="flex flex-wrap gap-2">
                {transitions.map((to) => (
                  <button
                    key={to}
                    type="button"
                    className="lt-btn-secondary px-3 py-2 text-sm"
                    data-testid={to === 'published' ? 'keyword-publish' : undefined}
                    disabled={busy || dirty}
                    onClick={() => void changeStatus(to)}
                  >
                    {actionLabel(editor.status, to)}
                  </button>
                ))}
              </div>
              <p className="text-xs text-[var(--text-secondary)]">
                Learners cannot see this card until it is published.
              </p>
            </div>
          ) : null}
          <div className="space-y-2 border-t border-[var(--border)] pt-3">
            <h2 className="text-sm font-bold">
              Linked official questions{editor.id ? ` (${linked.length})` : ''}
            </h2>
            {editor.id ? (
              <form
                className="flex flex-wrap gap-2"
                onSubmit={(event) => {
                  event.preventDefault();
                  void linkQuestion();
                }}
              >
                <input
                  className="lt-input min-w-0 flex-1"
                  placeholder="AB2243"
                  aria-label="Official question id"
                  value={questionId}
                  onChange={(event) => setQuestionId(event.target.value)}
                />
                <button type="submit" className="lt-btn-secondary px-3 py-2 text-sm" disabled={busy}>
                  Link
                </button>
              </form>
            ) : (
              <p className="text-xs text-[var(--text-secondary)]">Save the keyword before linking questions.</p>
            )}
            <ul className="max-h-48 space-y-1 overflow-y-auto">
              {linked.map((id) => (
                <li key={id} className="flex items-center justify-between gap-2 text-sm">
                  <span>{id}</span>
                  <button
                    type="button"
                    className="text-xs font-semibold"
                    aria-label={`Unlink ${id}`}
                    onClick={() => void unlinkQuestion(id)}
                  >
                    Unlink
                  </button>
                </li>
              ))}
            </ul>
          </div>
          <div className="space-y-2 border-t border-[var(--border)] pt-3">
            <h2 className="text-sm font-bold">Preview</h2>
            <p className="text-[11px] font-bold uppercase tracking-wide text-[var(--lingo-red)]">Keyword Card</p>
            <p dir="ltr" lang="en" className="text-lg font-bold">
              {editor.term_en || 'English term'}
            </p>
            {editor.translation_ar ? (
              <p dir="rtl" lang="ar">
                {editor.translation_ar}
              </p>
            ) : null}
            <p dir="ltr" lang="en" className="whitespace-pre-wrap text-sm">
              {editor.explanation_en || 'Simple English explanation'}
            </p>
            {editor.explanation_ar ? (
              <p dir="rtl" lang="ar" className="whitespace-pre-wrap text-sm">
                {editor.explanation_ar}
              </p>
            ) : null}
            {editor.image_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={editor.image_url}
                alt={editor.image_alt || 'Keyword image'}
                className="h-auto w-full max-h-72 object-contain rounded border border-[var(--border)]"
              />
            ) : (
              <p className="text-xs text-[var(--text-secondary)]">No image. Text-only preview.</p>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
