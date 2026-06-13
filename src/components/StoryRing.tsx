// ── Story-ring avatar (accent ring like the reference) ──
// Shows a default silhouette (person or storefront) when no photo is present.
export function AHStoryRing({
  size = 62,
  glyph,
  color,
  add,
  kind = 'person',
  seen,
}: {
  size?: number;
  glyph?: string;
  color?: string;
  add?: boolean;
  kind?: 'person' | 'business';
  seen?: boolean;
  label?: string;
  photo?: string;
}) {
  const ringColor = add ? '#C9C9CE' : seen ? 'var(--ah-line)' : 'var(--ah-orange)';
  const ringStyle = add ? 'dashed' : 'solid';
  const ringWidth = seen ? 2 : 1.5;

  const personSil = (
    <svg width="58%" height="58%" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="8.5" r="4" fill="#C4C4C8" />
      <path d="M4.5 20.5a7.5 7.5 0 0 1 15 0z" fill="#C4C4C8" />
    </svg>
  );
  const bizSil = (
    <svg width="56%" height="56%" viewBox="0 0 24 24" fill="none">
      <path
        d="M4 9l1.5-4h13L20 9v1.5a2.4 2.4 0 0 1-4 1.8 2.4 2.4 0 0 1-4 0 2.4 2.4 0 0 1-4 0 2.4 2.4 0 0 1-4-1.8zM5.5 12.5V20h13v-7.5"
        stroke="#C4C4C8"
        strokeWidth="1.7"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  );

  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: '50%',
        padding: 3,
        border: `${ringWidth}px ${ringStyle} ${ringColor}`,
        boxSizing: 'border-box',
        position: 'relative',
        flexShrink: 0,
      }}
    >
      <div
        style={{
          width: '100%',
          height: '100%',
          borderRadius: '50%',
          background: '#F1F1F2',
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'center',
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        {kind === 'business' ? bizSil : personSil}
      </div>
      {add && (
        <div
          style={{
            position: 'absolute',
            bottom: -2,
            right: -2,
            width: 22,
            height: 22,
            borderRadius: '50%',
            background: '#1B1B1F',
            color: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 14,
            fontWeight: 600,
            border: '2.5px solid #fff',
          }}
        >
          +
        </div>
      )}
    </div>
  );
}
