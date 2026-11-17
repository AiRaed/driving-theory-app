/**
 * Small consistent topic marks. Decorative only — they do not change topic data.
 */

const paths: Record<string, string> = {
  alertness: 'M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12zm10 2.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z',
  attitude: 'M12 20s-7-4.4-7-9.2A3.8 3.8 0 0 1 12 8a3.8 3.8 0 0 1 7 2.8C19 15.6 12 20 12 20z',
  documents: 'M7 3.5h7l4 4V20a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V4.5a1 1 0 0 1 1-1zm7 1.2V8h3.3M8 12h8M8 16h6',
  'hazard-awareness': 'M12 3.5 21 19H3L12 3.5zm0 6v4.5M12 17.2h.01',
  incidents: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM12 8v8M8 12h8',
  'motorway-driving': 'M4 18V6m16 12V6M4 12h4m8 0h4M12 7v10',
  'other-vehicles': 'M3 15V9.5L5.2 6h9.2L17 9.5h2.2A1.8 1.8 0 0 1 21 11.3V15H3zm2.2 2.2a1.6 1.6 0 1 0 0-3.2 1.6 1.6 0 0 0 0 3.2zm11.6 0a1.6 1.6 0 1 0 0-3.2 1.6 1.6 0 0 0 0 3.2z',
  'road-signs': 'M12 3 4.5 7.2v6.2c0 4 3.2 6.6 7.5 7.6 4.3-1 7.5-3.6 7.5-7.6V7.2L12 3z',
  'rules-of-the-road': 'M6 4h12v16H6zM9 8h6M9 12h6M9 16h4',
  'safety-margins': 'M4 8h16M4 16h16M8 5v14M16 5v14',
  'safety-vehicle': 'M12 3.5 5 6.2v5.2c0 4.2 2.9 7 7 8.6 4.1-1.6 7-4.4 7-8.6V6.2L12 3.5z',
  'vehicle-handling': 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM12 8v4l3 2',
  'vehicle-loading': 'M4 8h16v10H4zM8 8V5h8v3M4 13h16',
  'vulnerable-road-users': 'M12 6.2a2 2 0 1 0 0-4 2 2 0 0 0 0 4zM8 21l1.6-6.2L7 12.2 10.2 9h3.6L17 12.2l-2.6 2.6L16 21',
};

export default function TopicGlyph({ topic, className = '' }: { topic: string; className?: string }) {
  const d = paths[topic] || paths.alertness;
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden
      className={`h-5 w-5 shrink-0 ${className}`}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d={d} />
    </svg>
  );
}
