#!/usr/bin/env node
/**
 * LOCAL-ONLY DVSA media visual review tool (Phase 2D).
 *
 * - Binds exclusively to 127.0.0.1 (not publicly exposed)
 * - Does not modify originals or derivatives
 * - Persists review decisions under local-data/dvsa/staging/
 * - Outside the Next.js public app routes
 *
 * Launch:
 *   npm run review:dvsa-media
 *   → http://127.0.0.1:8791
 */
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '../..');
const STAGING = path.join(ROOT, 'local-data/dvsa/staging');
const MEDIA_ROOT = path.join(ROOT, 'local-data/dvsa/media/Car Images');
const MANIFEST_PATH = path.join(STAGING, 'media-conversion-manifest.json');
const REPORT_PATH = path.join(STAGING, 'media-conversion-report.json');
const QUESTIONS_PATH = path.join(STAGING, 'questions.v2.json');
const REVIEW_PATH = path.join(STAGING, 'media-visual-review.json');
const DERIVATIVES_DIR = path.join(STAGING, 'derivatives');

const HOST = '127.0.0.1';
const PORT = Number(process.env.DVSA_MEDIA_REVIEW_PORT || 8791);

const STATUSES = new Set(['approved', 'needs_fix', 'unreviewed']);

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function ensureReviewStore() {
  if (!fs.existsSync(REVIEW_PATH)) {
    const initial = {
      generated_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      phase: 'phase-2d-local-visual-media-review',
      reviews: {},
    };
    fs.writeFileSync(REVIEW_PATH, JSON.stringify(initial, null, 2) + '\n');
    return initial;
  }
  return readJson(REVIEW_PATH);
}

function writeReviewStore(store) {
  store.updated_at = new Date().toISOString();
  const tmp = REVIEW_PATH + '.tmp';
  fs.writeFileSync(tmp, JSON.stringify(store, null, 2) + '\n');
  fs.renameSync(tmp, REVIEW_PATH);
}

function buildCatalog() {
  const manifest = readJson(MANIFEST_PATH);
  const report = readJson(REPORT_PATH);
  const questionsDoc = readJson(QUESTIONS_PATH);
  const questions = Array.isArray(questionsDoc)
    ? questionsDoc
    : Array.isArray(questionsDoc.questions)
      ? questionsDoc.questions
      : [];
  const reviewStore = ensureReviewStore();

  const imageOptionIds = new Set(
    (report.validation?.image_option_audit || []).map((a) => a.id)
  );
  const imageOptionRefs = new Set();
  for (const audit of report.validation?.image_option_audit || []) {
    for (const opt of audit.options || []) {
      if (opt.image) imageOptionRefs.add(opt.image);
      if (opt.imageHiRes) imageOptionRefs.add(opt.imageHiRes);
    }
  }

  const flaggedRefs = new Set(
    (report.manual_visual_review?.items || []).map((i) => i.original_ref)
  );

  const questionPromptById = new Map();
  for (const q of questions) {
    questionPromptById.set(q.id, q.promptEn || '');
  }

  const items = (manifest.entries || []).map((entry) => {
    const ext = (entry.source_extension || '').toLowerCase();
    const flags = entry.review_flags || [];
    const reviews = reviewStore.reviews || {};
    const review = reviews[entry.original_ref] || { status: 'unreviewed' };
    const isImageOption = imageOptionRefs.has(entry.original_ref);
    const linkedImageOptionQuestions = (entry.question_ids || []).filter((id) =>
      imageOptionIds.has(id)
    );

    const priority =
      (isImageOption ? 1000 : 0) +
      (flags.includes('multipage_source_used_page0') ? 100 : 0) +
      (flags.includes('cmyk_source_converted_to_srgb') ? 40 : 0) +
      (flags.includes('eps_rasterized_review_recommended') ? 30 : 0) +
      (flags.includes('embedded_tiff_preview_warning') ? 20 : 0) +
      (flaggedRefs.has(entry.original_ref) ? 10 : 0);

    const sourceAbs = entry.source_relative_path
      ? path.join(MEDIA_ROOT, entry.source_relative_path)
      : null;
    const derivativeAbs = entry.derivative_basename
      ? path.join(DERIVATIVES_DIR, entry.derivative_basename)
      : null;

    const originalBrowserCompatible = ['.jpg', '.jpeg', '.gif', '.png', '.webp'].includes(
      ext
    );

    return {
      id: entry.original_ref,
      original_ref: entry.original_ref,
      source_extension: ext,
      source_relative_path: entry.source_relative_path || null,
      derivative_basename: entry.derivative_basename || null,
      derivative_relative_path: entry.derivative_relative_path || null,
      derivative_format: entry.derivative_format || null,
      conversion_reason: entry.conversion_reason || null,
      kinds: entry.kinds || [],
      question_ids: entry.question_ids || [],
      question_prompts: (entry.question_ids || []).map((id) => ({
        id,
        promptEn: questionPromptById.get(id) || '',
        is_image_option_question: imageOptionIds.has(id),
      })),
      review_flags: flags,
      flagged: flaggedRefs.has(entry.original_ref) || flags.length > 0,
      is_image_option_media: isImageOption,
      linked_image_option_questions: linkedImageOptionQuestions,
      source_dimensions: entry.source_dimensions || null,
      derivative_dimensions: entry.derivative_dimensions || null,
      original_browser_compatible: originalBrowserCompatible,
      original_exists: !!(sourceAbs && fs.existsSync(sourceAbs)),
      derivative_exists: !!(derivativeAbs && fs.existsSync(derivativeAbs)),
      review_status: STATUSES.has(review.status) ? review.status : 'unreviewed',
      review_note: typeof review.note === 'string' ? review.note : '',
      review_updated_at: review.updated_at || null,
      priority,
    };
  });

  items.sort((a, b) => {
    if (b.priority !== a.priority) return b.priority - a.priority;
    return a.original_ref.localeCompare(b.original_ref);
  });

  const counts = {
    total: items.length,
    flagged: items.filter((i) => i.flagged).length,
    image_option_media: items.filter((i) => i.is_image_option_media).length,
    image_option_questions: imageOptionIds.size,
    eps: items.filter((i) => i.source_extension === '.eps').length,
    tiff: items.filter((i) => i.source_extension === '.tif' || i.source_extension === '.tiff')
      .length,
    approved: items.filter((i) => i.review_status === 'approved').length,
    needs_fix: items.filter((i) => i.review_status === 'needs_fix').length,
    unreviewed: items.filter((i) => i.review_status === 'unreviewed').length,
    missing_derivative: items.filter((i) => !i.derivative_exists).length,
    missing_original: items.filter((i) => !i.original_exists).length,
  };

  return {
    generated_at: new Date().toISOString(),
    host_only: `${HOST}:${PORT}`,
    counts,
    image_option_question_ids: [...imageOptionIds].sort(),
    items,
  };
}

function sendJson(res, status, payload) {
  const body = JSON.stringify(payload);
  res.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store',
    'Content-Length': Buffer.byteLength(body),
  });
  res.end(body);
}

function sendText(res, status, text, type = 'text/plain; charset=utf-8') {
  res.writeHead(status, {
    'Content-Type': type,
    'Cache-Control': 'no-store',
    'Content-Length': Buffer.byteLength(text),
  });
  res.end(text);
}

function contentTypeFor(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  switch (ext) {
    case '.png':
      return 'image/png';
    case '.jpg':
    case '.jpeg':
      return 'image/jpeg';
    case '.gif':
      return 'image/gif';
    case '.webp':
      return 'image/webp';
    case '.svg':
      return 'image/svg+xml';
    case '.eps':
      return 'application/postscript';
    case '.tif':
    case '.tiff':
      return 'image/tiff';
    default:
      return 'application/octet-stream';
  }
}

function safeJoin(root, relativePath) {
  const resolved = path.resolve(root, relativePath);
  if (!resolved.startsWith(path.resolve(root) + path.sep) && resolved !== path.resolve(root)) {
    return null;
  }
  return resolved;
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on('data', (c) => chunks.push(c));
    req.on('end', () => {
      try {
        const raw = Buffer.concat(chunks).toString('utf8');
        resolve(raw ? JSON.parse(raw) : {});
      } catch (error) {
        reject(error);
      }
    });
    req.on('error', reject);
  });
}

const HTML_PAGE = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>DVSA Media Visual Review (localhost only)</title>
  <style>
    :root {
      --bg: #f4f2ef;
      --surface: #fff;
      --border: #e4e0da;
      --text: #1c1b1f;
      --muted: #6b6570;
      --red: #c92a24;
      --red-soft: #fbedec;
      --ok: #1f7a3f;
      --ok-soft: #e8f6ee;
      --warn: #9a6700;
      --warn-soft: #fff6e0;
      --chip: #ece8e2;
    }
    * { box-sizing: border-box; }
    body {
      margin: 0;
      font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, sans-serif;
      background: var(--bg);
      color: var(--text);
    }
    header {
      position: sticky; top: 0; z-index: 5;
      background: rgba(255,255,255,0.95);
      border-bottom: 1px solid var(--border);
      backdrop-filter: blur(8px);
      padding: 12px 16px;
    }
    h1 { margin: 0 0 4px; font-size: 18px; }
    .sub { color: var(--muted); font-size: 12px; }
    .layout {
      display: grid;
      grid-template-columns: 360px 1fr;
      gap: 0;
      min-height: calc(100vh - 110px);
    }
    @media (max-width: 960px) {
      .layout { grid-template-columns: 1fr; }
    }
    .sidebar, .detail {
      background: var(--surface);
      border-right: 1px solid var(--border);
      min-height: 0;
    }
    .sidebar { display: flex; flex-direction: column; max-height: calc(100vh - 110px); }
    .controls { padding: 12px; border-bottom: 1px solid var(--border); display: grid; gap: 8px; }
    input[type="search"], select, textarea, button {
      font: inherit;
      border: 1px solid var(--border);
      border-radius: 8px;
      padding: 8px 10px;
      background: #fff;
    }
    button { cursor: pointer; }
    button.primary { background: var(--red); color: #fff; border-color: var(--red); }
    button.ok { background: var(--ok); color: #fff; border-color: var(--ok); }
    button.warn { background: var(--warn); color: #fff; border-color: var(--warn); }
    button.ghost { background: #fff; }
    .counters {
      display: flex; flex-wrap: wrap; gap: 6px;
      padding: 0 12px 12px;
    }
    .chip {
      background: var(--chip);
      border-radius: 999px;
      padding: 3px 8px;
      font-size: 11px;
      color: var(--muted);
    }
    .chip.flag { background: var(--warn-soft); color: var(--warn); }
    .chip.ok { background: var(--ok-soft); color: var(--ok); }
    .chip.bad { background: var(--red-soft); color: var(--red); }
    .list {
      overflow: auto;
      flex: 1;
    }
    .item {
      display: grid;
      grid-template-columns: 72px 1fr;
      gap: 10px;
      padding: 10px 12px;
      border-bottom: 1px solid var(--border);
      cursor: pointer;
    }
    .item:hover, .item.active { background: #faf8f6; }
    .item img {
      width: 72px; height: 54px; object-fit: contain;
      background: #f7f5f2; border: 1px solid var(--border); border-radius: 6px;
    }
    .item .name { font-size: 12px; font-weight: 600; word-break: break-all; }
    .item .meta { font-size: 11px; color: var(--muted); margin-top: 2px; }
    .tags { display: flex; flex-wrap: wrap; gap: 4px; margin-top: 4px; }
    .tag {
      font-size: 10px; border-radius: 4px; padding: 2px 5px;
      background: var(--chip); color: var(--muted);
    }
    .tag.flag { background: var(--warn-soft); color: var(--warn); }
    .tag.opt { background: #e8eefc; color: #27408b; }
    .detail { border-right: 0; padding: 16px; overflow: auto; max-height: calc(100vh - 110px); }
    .preview-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 12px;
      margin-top: 12px;
    }
    @media (max-width: 960px) {
      .preview-grid { grid-template-columns: 1fr; }
    }
    .preview-card {
      border: 1px solid var(--border);
      border-radius: 12px;
      padding: 12px;
      background: #fff;
    }
    .preview-card h3 { margin: 0 0 8px; font-size: 13px; }
    .preview-card img {
      width: 100%; max-height: 420px; object-fit: contain;
      background: #f7f5f2; border-radius: 8px;
    }
    .note {
      font-size: 12px; color: var(--muted); margin-top: 8px; line-height: 1.4;
    }
    .actions { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 14px; }
    .empty { color: var(--muted); padding: 24px; }
    .banner {
      margin: 8px 0 0;
      padding: 8px 10px;
      border-radius: 8px;
      background: var(--red-soft);
      color: var(--red);
      font-size: 12px;
    }
  </style>
</head>
<body>
  <header>
    <h1>DVSA media visual review</h1>
    <div class="sub">Localhost only · originals &amp; derivatives are never modified · decisions saved to staging JSON</div>
  </header>
  <div class="layout">
    <aside class="sidebar">
      <div class="controls">
        <input id="search" type="search" placeholder="Search filename / question id / flag" />
        <select id="filter">
          <option value="flagged">Flagged (priority)</option>
          <option value="all">All images</option>
          <option value="image_options">Image-answer options</option>
          <option value="eps">EPS</option>
          <option value="tiff">TIFF</option>
          <option value="unreviewed">Unreviewed</option>
          <option value="approved">Approved</option>
          <option value="needs_fix">Needs Fix</option>
          <option value="missing">Missing files</option>
        </select>
      </div>
      <div class="counters" id="counters"></div>
      <div class="list" id="list"></div>
    </aside>
    <main class="detail" id="detail">
      <div class="empty">Select an asset to review.</div>
    </main>
  </div>
  <script>
    let catalog = null;
    let selectedId = null;

    const $ = (id) => document.getElementById(id);

    async function loadCatalog() {
      const res = await fetch('/api/catalog');
      catalog = await res.json();
      renderCounters();
      renderList();
      if (selectedId) renderDetail(selectedId);
    }

    function matchesFilter(item, filter) {
      switch (filter) {
        case 'flagged': return item.flagged;
        case 'image_options': return item.is_image_option_media;
        case 'eps': return item.source_extension === '.eps';
        case 'tiff': return item.source_extension === '.tif' || item.source_extension === '.tiff';
        case 'unreviewed': return item.review_status === 'unreviewed';
        case 'approved': return item.review_status === 'approved';
        case 'needs_fix': return item.review_status === 'needs_fix';
        case 'missing': return !item.derivative_exists || !item.original_exists;
        case 'all':
        default: return true;
      }
    }

    function filteredItems() {
      const q = ($('search').value || '').trim().toLowerCase();
      const filter = $('filter').value;
      return catalog.items.filter((item) => {
        if (!matchesFilter(item, filter)) return false;
        if (!q) return true;
        const hay = [
          item.original_ref,
          item.source_relative_path,
          ...(item.question_ids || []),
          ...(item.review_flags || []),
          item.review_status,
        ].join(' ').toLowerCase();
        return hay.includes(q);
      });
    }

    function renderCounters() {
      const c = catalog.counts;
      $('counters').innerHTML = [
        ['Total', c.total],
        ['Flagged', c.flagged],
        ['Image-opt media', c.image_option_media],
        ['Image-opt Qs', c.image_option_questions],
        ['Approved', c.approved],
        ['Needs fix', c.needs_fix],
        ['Unreviewed', c.unreviewed],
        ['Missing der.', c.missing_derivative],
        ['Missing orig.', c.missing_original],
      ].map(([label, value]) => {
        const cls = label.includes('Needs') || label.includes('Missing')
          ? 'chip bad'
          : label === 'Flagged'
            ? 'chip flag'
            : label === 'Approved'
              ? 'chip ok'
              : 'chip';
        return '<span class="' + cls + '">' + label + ': ' + value + '</span>';
      }).join('');
    }

    function statusChip(status) {
      if (status === 'approved') return '<span class="tag" style="background:#e8f6ee;color:#1f7a3f">approved</span>';
      if (status === 'needs_fix') return '<span class="tag" style="background:#fbedec;color:#c92a24">needs_fix</span>';
      return '<span class="tag">unreviewed</span>';
    }

    function renderList() {
      const items = filteredItems();
      if (!items.length) {
        $('list').innerHTML = '<div class="empty">No matching assets.</div>';
        return;
      }
      $('list').innerHTML = items.map((item) => {
        const thumb = item.derivative_exists
          ? '<img src="/media/derivative/' + encodeURIComponent(item.derivative_basename) + '" alt="" loading="lazy" />'
          : '<div style="width:72px;height:54px;background:#f7f5f2;border:1px solid #e4e0da;border-radius:6px"></div>';
        const tags = [];
        if (item.flagged) tags.push('<span class="tag flag">flagged</span>');
        if (item.is_image_option_media) tags.push('<span class="tag opt">image-option</span>');
        tags.push(statusChip(item.review_status));
        (item.review_flags || []).slice(0, 2).forEach((f) => {
          tags.push('<span class="tag flag">' + f.replaceAll('_', ' ') + '</span>');
        });
        return (
          '<div class="item' + (item.id === selectedId ? ' active' : '') + '" data-id="' + item.id.replaceAll('"', '&quot;') + '">' +
            thumb +
            '<div>' +
              '<div class="name">' + item.original_ref + '</div>' +
              '<div class="meta">' + (item.derivative_format || '?') +
                ' · ' + dims(item.derivative_dimensions) +
                ' · Qs: ' + (item.question_ids || []).join(', ') +
              '</div>' +
              '<div class="tags">' + tags.join('') + '</div>' +
            '</div>' +
          '</div>'
        );
      }).join('');

      [...$('list').querySelectorAll('.item')].forEach((el) => {
        el.addEventListener('click', () => {
          selectedId = el.getAttribute('data-id');
          renderList();
          renderDetail(selectedId);
        });
      });
    }

    function dims(d) {
      if (!d || !d.width || !d.height) return '—';
      return d.width + '×' + d.height;
    }

    function renderDetail(id) {
      const item = catalog.items.find((x) => x.id === id);
      if (!item) {
        $('detail').innerHTML = '<div class="empty">Asset not found.</div>';
        return;
      }

      const originalNote = item.original_browser_compatible
        ? 'Browser can display this original format directly.'
        : 'Browsers cannot reliably display EPS/TIFF. Showing the converted derivative as the review preview. Original remains on disk unchanged.';

      const originalBlock = item.original_browser_compatible && item.original_exists
        ? '<img src="/media/original/' + encodeURIComponent(item.original_ref) + '" alt="original" />'
        : '<div class="note">' +
            (item.original_exists
              ? 'Original file exists locally as <code>' + item.source_extension + '</code> but is not shown inline (unsupported in browser).'
              : 'Original file is missing on disk.') +
          '</div>';

      const derivativeBlock = item.derivative_exists
        ? '<img src="/media/derivative/' + encodeURIComponent(item.derivative_basename) + '" alt="derivative" />'
        : '<div class="note">Derivative preview is missing.</div>';

      const flags = (item.review_flags || []).map((f) => '<span class="tag flag">' + f + '</span>').join(' ') || '<span class="tag">none</span>';
      const qs = (item.question_prompts || []).map((q) =>
        '<div class="note"><strong>' + q.id + '</strong>' +
        (q.is_image_option_question ? ' <span class="tag opt">image-option Q</span>' : '') +
        '<br/>' + (q.promptEn || '') + '</div>'
      ).join('') || '<div class="note">No linked questions.</div>';

      $('detail').innerHTML =
        '<div style="display:flex;justify-content:space-between;gap:12px;flex-wrap:wrap">' +
          '<div>' +
            '<h2 style="margin:0 0 6px;font-size:18px;word-break:break-all">' + item.original_ref + '</h2>' +
            '<div class="sub">' + (item.source_relative_path || '') + '</div>' +
          '</div>' +
          statusChip(item.review_status) +
        '</div>' +
        (!item.derivative_exists || !item.original_exists
          ? '<div class="banner">Inaccessible file: ' +
              (!item.original_exists ? 'original missing. ' : '') +
              (!item.derivative_exists ? 'derivative missing.' : '') +
            '</div>'
          : '') +
        '<div class="preview-grid">' +
          '<div class="preview-card"><h3>Converted preview (review this)</h3>' + derivativeBlock +
            '<div class="note">' + dims(item.derivative_dimensions) + ' · ' + (item.derivative_format || '') + '</div></div>' +
          '<div class="preview-card"><h3>Original</h3>' + originalBlock +
            '<div class="note">' + originalNote + '<br/>' + dims(item.source_dimensions) + ' · ' + (item.source_extension || '') + '</div></div>' +
        '</div>' +
        '<div style="margin-top:14px"><strong>Flags</strong><div class="tags" style="margin-top:6px">' + flags + '</div></div>' +
        '<div style="margin-top:14px"><strong>Linked questions</strong>' + qs + '</div>' +
        '<div style="margin-top:14px"><strong>Review note</strong>' +
          '<textarea id="note" rows="3" style="width:100%;margin-top:6px">' + (item.review_note || '') + '</textarea></div>' +
        '<div class="actions">' +
          '<button class="ok" data-status="approved">Approved</button>' +
          '<button class="warn" data-status="needs_fix">Needs Fix</button>' +
          '<button class="ghost" data-status="unreviewed">Unreviewed</button>' +
        '</div>' +
        '<div class="note" style="margin-top:10px">Last updated: ' + (item.review_updated_at || '—') + '</div>';

      [...$('detail').querySelectorAll('button[data-status]')].forEach((btn) => {
        btn.addEventListener('click', async () => {
          const status = btn.getAttribute('data-status');
          const note = $('note').value || '';
          const res = await fetch('/api/review', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ original_ref: item.original_ref, status, note }),
          });
          if (!res.ok) {
            alert('Failed to save review');
            return;
          }
          await loadCatalog();
        });
      });
    }

    $('search').addEventListener('input', renderList);
    $('filter').addEventListener('change', renderList);
    loadCatalog().catch((err) => {
      $('detail').innerHTML = '<div class="banner">Failed to load catalog: ' + err.message + '</div>';
    });
  </script>
</body>
</html>`;

function handleMedia(req, res, kind, encodedName) {
  const name = decodeURIComponent(encodedName || '');
  if (!name || name.includes('..') || name.includes('/') || name.includes('\\')) {
    sendText(res, 400, 'Bad request');
    return;
  }

  if (kind === 'derivative') {
    const filePath = safeJoin(DERIVATIVES_DIR, name);
    if (!filePath || !fs.existsSync(filePath)) {
      sendText(res, 404, 'Derivative not found');
      return;
    }
    const buf = fs.readFileSync(filePath);
    res.writeHead(200, {
      'Content-Type': contentTypeFor(filePath),
      'Cache-Control': 'no-store',
      'Content-Length': buf.length,
    });
    res.end(buf);
    return;
  }

  if (kind === 'original') {
    const manifest = readJson(MANIFEST_PATH);
    const entry = (manifest.entries || []).find((e) => e.original_ref === name);
    if (!entry || !entry.source_relative_path) {
      sendText(res, 404, 'Original not found in manifest');
      return;
    }
    const ext = (entry.source_extension || path.extname(entry.original_ref) || '').toLowerCase();
    const browserCompatible = ['.jpg', '.jpeg', '.gif', '.png', '.webp'].includes(ext);
    if (!browserCompatible) {
      sendJson(res, 415, {
        error: 'Original format is not browser-displayable',
        source_extension: ext,
        message:
          'EPS/TIFF originals are preserved on disk but not inlined. Use the converted derivative for visual review.',
      });
      return;
    }
    const filePath = safeJoin(MEDIA_ROOT, entry.source_relative_path);
    if (!filePath || !fs.existsSync(filePath)) {
      sendText(res, 404, 'Original file missing on disk');
      return;
    }
    const buf = fs.readFileSync(filePath);
    res.writeHead(200, {
      'Content-Type': contentTypeFor(filePath),
      'Cache-Control': 'no-store',
      'Content-Length': buf.length,
    });
    res.end(buf);
    return;
  }

  sendText(res, 404, 'Not found');
}

async function handleApi(req, res, url) {
  if (url.pathname === '/api/catalog' && req.method === 'GET') {
    sendJson(res, 200, buildCatalog());
    return;
  }

  if (url.pathname === '/api/health' && req.method === 'GET') {
    const catalog = buildCatalog();
    sendJson(res, 200, {
      ok: true,
      host: HOST,
      port: PORT,
      counts: catalog.counts,
      review_file: path.relative(ROOT, REVIEW_PATH),
    });
    return;
  }

  if (url.pathname === '/api/review' && req.method === 'POST') {
    const body = await readBody(req);
    const originalRef = body.original_ref;
    const status = body.status;
    const note = typeof body.note === 'string' ? body.note : '';
    if (!originalRef || !STATUSES.has(status)) {
      sendJson(res, 400, { error: 'original_ref and valid status required' });
      return;
    }
    const manifest = readJson(MANIFEST_PATH);
    const known = (manifest.entries || []).some((e) => e.original_ref === originalRef);
    if (!known) {
      sendJson(res, 404, { error: 'Unknown media reference' });
      return;
    }
    const store = ensureReviewStore();
    store.reviews[originalRef] = {
      status,
      note,
      updated_at: new Date().toISOString(),
    };
    writeReviewStore(store);
    sendJson(res, 200, { ok: true, review: store.reviews[originalRef] });
    return;
  }

  sendJson(res, 404, { error: 'Not found' });
}

function createServer() {
  return http.createServer(async (req, res) => {
    try {
      const hostHeader = req.headers.host || '';
      // Extra belt-and-braces: refuse non-loopback Host headers even if bind is correct.
      if (
        hostHeader &&
        !hostHeader.startsWith('127.0.0.1') &&
        !hostHeader.startsWith('localhost')
      ) {
        sendText(res, 403, 'Forbidden: localhost only');
        return;
      }

      const url = new URL(req.url || '/', `http://${HOST}:${PORT}`);

      if (url.pathname === '/' && req.method === 'GET') {
        sendText(res, 200, HTML_PAGE, 'text/html; charset=utf-8');
        return;
      }

      if (url.pathname.startsWith('/api/')) {
        await handleApi(req, res, url);
        return;
      }

      const derMatch = url.pathname.match(/^\/media\/derivative\/(.+)$/);
      if (derMatch) {
        handleMedia(req, res, 'derivative', derMatch[1]);
        return;
      }
      const origMatch = url.pathname.match(/^\/media\/original\/(.+)$/);
      if (origMatch) {
        handleMedia(req, res, 'original', origMatch[1]);
        return;
      }

      sendText(res, 404, 'Not found');
    } catch (error) {
      console.error('[dvsa-media-review]', error);
      sendJson(res, 500, { error: 'Internal error' });
    }
  });
}

function validateStartup() {
  for (const required of [MANIFEST_PATH, REPORT_PATH, QUESTIONS_PATH, DERIVATIVES_DIR, MEDIA_ROOT]) {
    if (!fs.existsSync(required)) {
      throw new Error(`Missing required path: ${required}`);
    }
  }
  const catalog = buildCatalog();
  const imageOptionIds = new Set(catalog.image_option_question_ids);
  const coveredQuestionIds = new Set();
  for (const item of catalog.items) {
    if (item.is_image_option_media) {
      for (const id of item.linked_image_option_questions) coveredQuestionIds.add(id);
    }
  }

  console.log('[dvsa-media-review] catalog ready');
  console.log(`  total entries: ${catalog.counts.total}`);
  console.log(`  flagged: ${catalog.counts.flagged}`);
  console.log(`  image-option media: ${catalog.counts.image_option_media}`);
  console.log(`  image-option questions covered: ${coveredQuestionIds.size}/${imageOptionIds.size}`);
  console.log(`  missing derivatives: ${catalog.counts.missing_derivative}`);
  console.log(`  missing originals: ${catalog.counts.missing_original}`);
  console.log(`  review file: ${path.relative(ROOT, REVIEW_PATH)}`);

  if (catalog.counts.total !== 534) {
    console.warn(`  WARNING: expected 534 unique media refs, found ${catalog.counts.total}`);
  }
  if (coveredQuestionIds.size !== imageOptionIds.size) {
    console.warn('  WARNING: not all image-option questions are represented in media entries');
  }
}

function main() {
  validateStartup();
  const server = createServer();
  server.listen(PORT, HOST, () => {
    console.log('');
    console.log('DVSA media visual review (LOCAL ONLY)');
    console.log(`Open: http://${HOST}:${PORT}`);
    console.log('Bound to 127.0.0.1 only — not publicly exposed.');
    console.log('Press Ctrl+C to stop.');
  });
}

main();
