'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { TOPIC_META } from '@/lib/questions/types';

type Task = {
  id: string;
  title: string;
  topic: string;
  format: string;
  suggested_format: string;
  priority: string;
  classification: string;
  status: string;
  coverage: number;
  question_ids: string[];
  rationale: string;
  media_status: string;
};

type Totals = {
  tasks: number;
  questions_covered: number;
  unfinished: number;
  by_status: Record<string, number>;
  by_format: Record<string, number>;
  by_priority: Record<string, number>;
};

type Asset = {
  id: string;
  kind: string;
  title: string;
  language: string | null;
  status: string;
  shared_visual: boolean;
  public_url: string;
};

export default function ContentProductionPage() {
  const router = useRouter();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [totals, setTotals] = useState<Totals | null>(null);
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<string | null>(null);
  const [preview, setPreview] = useState<Record<string, unknown> | null>(null);
  const [topic, setTopic] = useState('');
  const [format, setFormat] = useState('');
  const [priority, setPriority] = useState('');
  const [status, setStatus] = useState('');
  const [coverage, setCoverage] = useState('');
  const [manualTitle, setManualTitle] = useState('');
  const [manualTopic, setManualTopic] = useState('safety-margins');
  const [manualFormat, setManualFormat] = useState('diagram');
  const [manualIds, setManualIds] = useState('');
  const [assetTitle, setAssetTitle] = useState('');
  const [assetKind, setAssetKind] = useState('image');
  const [assetLang, setAssetLang] = useState('');

  const query = useMemo(() => {
    const params = new URLSearchParams();
    if (topic) params.set('topic', topic);
    if (format) params.set('format', format);
    if (priority) params.set('priority', priority);
    if (status) params.set('status', status);
    if (coverage) params.set('coverage', coverage);
    return params.toString();
  }, [topic, format, priority, status, coverage]);

  const load = useCallback(async () => {
    setLoading(true);
    const [taskRes, mediaRes] = await Promise.all([
      fetch(`/api/admin/content-production/tasks?${query}`),
      fetch('/api/admin/content-production/media'),
    ]);
    const taskData = await taskRes.json();
    const mediaData = await mediaRes.json();
    if (!taskRes.ok) {
      setTasks([]);
      setTotals(null);
      setAssets([]);
      setMessage(
        taskData.error ||
          'Content production is unavailable. Migration 0010 may be unapplied. The live question bank was not changed.'
      );
      setLoading(false);
      return;
    }
    setTasks(taskData.tasks || []);
    setTotals(taskData.totals || null);
    setAssets(mediaData.assets || []);
    setLoading(false);
  }, [query]);

  useEffect(() => {
    void load();
  }, [load]);

  const previewQueue = async () => {
    const res = await fetch('/api/admin/content-production/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'preview', dry_run: true }),
    });
    const data = await res.json();
    setPreview(data);
    setMessage(
      res.ok && data.ok
        ? `Dry-run: ${data.group_count} groups covering ${data.questions_covered} questions. Would create ${data.would_create}. Missing IDs: ${data.missing_ids?.length || 0}. Duplicate coverage: ${data.duplicate_coverage_count || 0}. Nothing written.`
        : data.error || 'Preview failed'
    );
  };

  const seed = async () => {
    if (
      !window.confirm(
        'Build the production queue from the 758 official V2 recommendations? This writes concept tasks only. It does not publish Learning Cards or change DVSA wording.'
      )
    ) {
      return;
    }
    const res = await fetch('/api/admin/content-production/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'seed' }),
    });
    const data = await res.json();
    setPreview(data);
    setMessage(
      res.ok
        ? `Queue built: ${data.created} new concept tasks (${data.skipped} already present). No explanations generated. Cards not published.`
        : data.error || 'Seed failed'
    );
    void load();
  };

  const nextTask = async () => {
    const res = await fetch(`/api/admin/content-production/next?${query}`);
    const data = await res.json();
    if (data.task?.id) {
      router.push(`/admin/content-production/${data.task.id}`);
      return;
    }
    setMessage('No unfinished task matches the current filters.');
  };

  const createManual = async () => {
    const res = await fetch('/api/admin/content-production/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: manualTitle,
        topic: manualTopic,
        format: manualFormat,
        question_ids: manualIds,
      }),
    });
    const data = await res.json();
    if (res.ok && data.task?.id) {
      router.push(`/admin/content-production/${data.task.id}`);
      return;
    }
    setMessage(data.error || 'Could not create task');
  };

  const createAsset = async () => {
    const res = await fetch('/api/admin/content-production/media', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        kind: assetKind,
        title: assetTitle,
        language: assetKind === 'voiceover' ? assetLang || 'ar' : null,
      }),
    });
    const data = await res.json();
    setMessage(res.ok ? `Asset created (${data.asset?.kind}). Not published to learners.` : data.error);
    setAssetTitle('');
    void load();
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="lt-kicker mb-1">Daily workspace</p>
          <h1 className="text-2xl font-bold">Content production</h1>
          <p className="text-sm text-[var(--text-secondary)] mt-1 max-w-2xl">
            Produce explanations, images, diagrams, videos, voiceovers and translations from the 758
            recommendations. Related questions share one reusable concept. Official DVSA wording stays
            locked. Mock Test stays exam-clean. Practice only sees published Learning Cards.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button type="button" className="lt-btn-primary px-4 py-2.5 text-sm" onClick={() => void nextTask()}>
            Next task
          </button>
          <button type="button" className="lt-btn-secondary px-4 py-2.5 text-sm" onClick={() => void previewQueue()}>
            Preview queue (dry-run)
          </button>
          <button type="button" className="lt-btn-secondary px-4 py-2.5 text-sm" onClick={() => void seed()}>
            Build queue from recommendations
          </button>
        </div>
      </div>

      {message ? (
        <p className="text-sm rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--surface-secondary)] px-3 py-2">
          {message}
        </p>
      ) : null}

      {preview ? (
        <div className="lt-card p-4 text-sm space-y-1">
          <p className="font-semibold">Seed preview</p>
          <p>Groups: {String(preview.group_count ?? '—')} (expected 307, coarse 71)</p>
          <p>Questions covered: {String(preview.questions_covered ?? '—')}</p>
          <p>Would create: {String(preview.would_create ?? preview.created ?? '—')}</p>
          <p>Missing official IDs: {Array.isArray(preview.missing_ids) ? preview.missing_ids.length : 0}</p>
          <p>Incomplete stems: {Array.isArray(preview.incomplete_stems) ? preview.incomplete_stems.length : 0}</p>
          <p>Duplicate coverage: {String(preview.duplicate_coverage_count ?? 0)}</p>
          <p>Wrote: {String(preview.wrote === true)}</p>
          <p>Source: {String(preview.source || '—')}</p>
        </div>
      ) : null}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Stat label="Concept tasks" value={String(totals?.tasks ?? 0)} />
        <Stat label="Questions covered" value={String(totals?.questions_covered ?? 0)} />
        <Stat label="Unfinished" value={String(totals?.unfinished ?? 0)} />
        <Stat label="High priority" value={String(totals?.by_priority?.high ?? 0)} />
      </div>

      <div className="lt-card p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        <select className="lt-input" value={topic} onChange={(e) => setTopic(e.target.value)}>
          <option value="">All topics</option>
          {TOPIC_META.map((t) => (
            <option key={t.id} value={t.id}>
              {t.label_en}
            </option>
          ))}
        </select>
        <select className="lt-input" value={format} onChange={(e) => setFormat(e.target.value)}>
          <option value="">All formats</option>
          <option value="text">text</option>
          <option value="diagram">diagram</option>
          <option value="image">image</option>
          <option value="video">video</option>
        </select>
        <select className="lt-input" value={priority} onChange={(e) => setPriority(e.target.value)}>
          <option value="">All priorities</option>
          <option value="high">high</option>
          <option value="medium">medium</option>
          <option value="low">low</option>
        </select>
        <select className="lt-input" value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="">All statuses</option>
          {['not_started', 'in_progress', 'ready_for_review', 'approved', 'published', 'skipped'].map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
        <select className="lt-input" value={coverage} onChange={(e) => setCoverage(e.target.value)}>
          <option value="">Any coverage</option>
          <option value="multi">Reusable (2+ questions)</option>
          <option value="single">Single question</option>
        </select>
      </div>

      <div className="lt-card overflow-x-auto">
        <table className="w-full text-sm min-w-[980px]">
          <thead>
            <tr className="border-b border-[var(--border)] text-left text-[11px] uppercase tracking-wider text-[var(--text-secondary)]">
              <th className="px-4 py-3">Concept</th>
              <th className="px-3 py-3">Topic</th>
              <th className="px-3 py-3">Format</th>
              <th className="px-3 py-3">Priority</th>
              <th className="px-3 py-3">Status</th>
              <th className="px-3 py-3">Coverage</th>
              <th className="px-3 py-3">DVSA IDs</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center">
                  Loading…
                </td>
              </tr>
            ) : !tasks.length ? (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-[var(--text-secondary)]">
                  No tasks yet. Build the queue from the 758 recommendations, or create a manual task.
                </td>
              </tr>
            ) : (
              tasks.map((task) => (
                <tr key={task.id} className="border-b border-[var(--border)] align-top">
                  <td className="px-4 py-3">
                    <Link
                      href={`/admin/content-production/${task.id}`}
                      className="font-semibold text-[var(--lingo-red)]"
                    >
                      {task.title}
                    </Link>
                    <p className="text-xs text-[var(--text-secondary)] mt-1 line-clamp-2">{task.rationale}</p>
                  </td>
                  <td className="px-3 py-3">{task.topic}</td>
                  <td className="px-3 py-3">
                    {task.format}
                    {task.format !== task.suggested_format ? (
                      <span className="block text-[10px] text-[var(--text-secondary)]">
                        rec {task.suggested_format}
                      </span>
                    ) : null}
                  </td>
                  <td className="px-3 py-3">{task.priority}</td>
                  <td className="px-3 py-3">
                    {task.status}
                    <span className="block text-[10px] text-[var(--text-secondary)]">
                      media {task.media_status}
                    </span>
                  </td>
                  <td className="px-3 py-3 tabular-nums">{task.coverage}</td>
                  <td className="px-3 py-3 font-mono text-xs">
                    {task.question_ids.slice(0, 4).join(', ')}
                    {task.question_ids.length > 4 ? ` +${task.question_ids.length - 4}` : ''}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="lt-card p-4 space-y-3">
          <h2 className="text-sm font-bold">Create manual task</h2>
          <input
            className="lt-input"
            placeholder="Title"
            value={manualTitle}
            onChange={(e) => setManualTitle(e.target.value)}
          />
          <select className="lt-input" value={manualTopic} onChange={(e) => setManualTopic(e.target.value)}>
            {TOPIC_META.map((t) => (
              <option key={t.id} value={t.id}>
                {t.label_en}
              </option>
            ))}
          </select>
          <select className="lt-input" value={manualFormat} onChange={(e) => setManualFormat(e.target.value)}>
            <option value="text">text</option>
            <option value="diagram">diagram</option>
            <option value="image">image</option>
            <option value="video">video</option>
          </select>
          <input
            className="lt-input"
            placeholder="DVSA IDs, comma-separated"
            value={manualIds}
            onChange={(e) => setManualIds(e.target.value)}
          />
          <button type="button" className="lt-btn-secondary px-3 py-2 text-sm" onClick={() => void createManual()}>
            Create task
          </button>
        </div>

        <div className="lt-card p-4 space-y-3">
          <h2 className="text-sm font-bold">Media library</h2>
          <p className="text-xs text-[var(--text-secondary)]">
            Shared visuals work across languages. Voiceovers are language-specific. Media status is
            independent of DVSA approval and card publication.
          </p>
          <input
            className="lt-input"
            placeholder="Asset title"
            value={assetTitle}
            onChange={(e) => setAssetTitle(e.target.value)}
          />
          <select className="lt-input" value={assetKind} onChange={(e) => setAssetKind(e.target.value)}>
            <option value="image">image</option>
            <option value="diagram">diagram</option>
            <option value="video">video</option>
            <option value="voiceover">voiceover</option>
          </select>
          {assetKind === 'voiceover' ? (
            <input
              className="lt-input"
              placeholder="Language code (ar, ur, …)"
              value={assetLang}
              onChange={(e) => setAssetLang(e.target.value)}
            />
          ) : null}
          <button type="button" className="lt-btn-secondary px-3 py-2 text-sm" onClick={() => void createAsset()}>
            Add library asset
          </button>
          <ul className="text-sm divide-y divide-[var(--border)] max-h-48 overflow-auto">
            {assets.map((asset) => (
              <li key={asset.id} className="py-2 flex justify-between gap-2">
                <span>
                  <strong>{asset.title}</strong>{' '}
                  <span className="text-xs text-[var(--text-secondary)]">
                    {asset.kind}
                    {asset.language ? `/${asset.language}` : ' · shared visual'} · {asset.status}
                  </span>
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="lt-card p-3">
      <p className="text-[11px] uppercase tracking-wider text-[var(--text-secondary)]">{label}</p>
      <p className="text-xl font-bold tabular-nums">{value}</p>
    </div>
  );
}
