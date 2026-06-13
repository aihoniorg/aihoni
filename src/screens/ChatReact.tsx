import { AHScreen, AHChatInput } from '../components/ui';
import { useNav } from '../nav';

// 16 · Chat · long-press reactions + reply.
export function ChatReact() {
  const nav = useNav();
  const dbl = (col = 'rgba(255,255,255,0.85)') => (
    <svg width="14" height="8" viewBox="0 0 16 10" style={{ flexShrink: 0 }}>
      <path d="M1 5l3 3.4L9.5 2" stroke={col} strokeWidth="1.7" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M7 5l3 3.4L15.5 2" stroke={col} strokeWidth="1.7" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );

  const reactions = ['❤️', '😂', '😮', '😢', '🙏', '👍'];
  const actions = [
    { id: 'reply', label: 'Reply', d: 'M9 14l-5-5 5-5M4 9h11a5 5 0 0 1 5 5v3' },
    { id: 'forward', label: 'Forward', d: 'M15 14l5-5-5-5M20 9H9a5 5 0 0 0-5 5v3' },
    { id: 'copy', label: 'Copy', d: 'M9 3h10v14H9zM5 7v12h10' },
    { id: 'star', label: 'Star', d: 'M12 3l2.5 6 6.5.5-5 4.5 1.5 6.5L12 17l-5.5 3.5L8 14 3 9.5 9.5 9z' },
    { id: 'reaction', label: 'More', d: 'M5 12h14M12 5v14' },
    { id: 'delete', label: 'Delete', d: 'M5 6h14M9 6V4h6v2M7 6v14h10V6' },
  ];

  return (
    <AHScreen pad={false} style={{ background: 'var(--ah-bg)' }}>
      {/* header — selection mode */}
      <div style={{ padding: '58px 18px 12px', display: 'flex', alignItems: 'center', gap: 11, background: '#FFFFFF' }}>
        <svg onClick={nav.back} width="22" height="22" viewBox="0 0 24 24" fill="none" style={{ cursor: 'pointer' }}>
          <path d="M6 6l12 12M18 6L6 18" stroke="var(--ah-ink)" strokeWidth="2.2" strokeLinecap="round" />
        </svg>
        <div style={{ flex: 1, fontSize: 15.5, fontWeight: 800 }}>1 selected</div>
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
          <path d="M9 14l-5-5 5-5M4 9h11a5 5 0 0 1 5 5v3" stroke="var(--ah-ink)" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
          <path d="M15 14l5-5-5-5M20 9H9a5 5 0 0 0-5 5v3" stroke="var(--ah-ink)" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <svg width="22" height="22" viewBox="0 0 24 24">
          <circle cx="12" cy="5" r="1.7" fill="var(--ah-ink)" />
          <circle cx="12" cy="12" r="1.7" fill="var(--ah-ink)" />
          <circle cx="12" cy="19" r="1.7" fill="var(--ah-ink)" />
        </svg>
      </div>

      {/* dim overlay + messages */}
      <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
        <div style={{ padding: '14px 16px 8px', display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div style={{ alignSelf: 'flex-start', maxWidth: 260, background: '#fff', borderRadius: '20px 20px 20px 6px', padding: '11px 15px 8px', boxShadow: '0 2px 6px -3px rgba(20,20,25,0.18)', opacity: 0.35 }}>
            <div style={{ fontSize: 14, lineHeight: 1.4 }}>आजको भाउ कति छ?</div>
          </div>

          <div style={{ alignSelf: 'flex-start', maxWidth: 290, opacity: 0.35, position: 'relative' }}>
            <div style={{ background: '#fff', borderRadius: '20px 20px 20px 6px', padding: '11px 15px 9px', boxShadow: '0 2px 6px -3px rgba(20,20,25,0.18)' }}>
              <div style={{ fontSize: 14, lineHeight: 1.45 }}>
                आज सुनको भाउ <strong>रू 1,42,500</strong> छ। हिजोभन्दा बढी।
              </div>
              <div style={{ fontSize: 10.5, color: 'var(--ah-muted)', textAlign: 'right', marginTop: 3 }}>10:14</div>
            </div>
            <div style={{ position: 'absolute', bottom: -10, left: 12, background: '#fff', borderRadius: 99, padding: '3px 9px', display: 'flex', alignItems: 'center', gap: 4, boxShadow: '0 2px 6px -2px rgba(20,20,25,0.25)', border: '1px solid var(--ah-line)' }}>
              <span style={{ fontSize: 13 }}>❤️</span>
              <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--ah-muted)' }}>2</span>
            </div>
          </div>
        </div>

        {/* dim wash */}
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(20,12,4,0.45)', backdropFilter: 'blur(2px)', WebkitBackdropFilter: 'blur(2px)', pointerEvents: 'none' }} />

        {/* reaction picker + selected message + action menu */}
        <div style={{ position: 'absolute', top: 80, left: 0, right: 0, padding: '0 16px', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 10 }}>
          <div style={{ background: '#fff', borderRadius: 99, padding: '6px 8px', display: 'flex', gap: 4, boxShadow: '0 14px 32px -8px rgba(20,12,4,0.4)' }}>
            {reactions.map((r) => (
              <div
                key={r}
                style={{
                  width: 38,
                  height: 38,
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 22,
                  background: r === '❤️' ? 'color-mix(in oklch, var(--ah-orange) 16%, white)' : 'transparent',
                  transform: r === '❤️' ? 'scale(1.1)' : 'none',
                }}
              >
                {r}
              </div>
            ))}
            <div style={{ width: 38, height: 38, borderRadius: '50%', background: 'var(--ah-bg-soft)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M5 12h14M12 5v14" stroke="var(--ah-ink)" strokeWidth="2.2" strokeLinecap="round" />
              </svg>
            </div>
          </div>

          <div style={{ maxWidth: 290 }}>
            <div style={{ background: '#1B1B1F', color: '#fff', borderRadius: '20px 20px 6px 20px', padding: '11px 14px 9px', boxShadow: '0 22px 40px -16px rgba(20,12,4,0.55)' }}>
              <div style={{ fontSize: 14.5, lineHeight: 1.4 }}>राम्रो! एक केजी राख्नुहोला।</div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 5, marginTop: 4, alignItems: 'center' }}>
                <span style={{ fontSize: 10.5, opacity: 0.85 }}>10:15</span>
                {dbl()}
              </div>
            </div>
          </div>

          <div style={{ background: '#fff', borderRadius: 18, padding: 6, boxShadow: '0 14px 32px -10px rgba(20,12,4,0.4)', minWidth: 220 }}>
            {actions.map((a, i) => (
              <div
                key={a.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  padding: '10px 12px',
                  borderTop: i ? '1px solid var(--ah-line)' : 'none',
                  color: a.id === 'delete' ? '#D14836' : 'var(--ah-ink)',
                }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path d={a.d} stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span style={{ flex: 1, fontSize: 14.5, fontWeight: 600 }}>{a.label}</span>
                {a.id === 'reply' && <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--ah-muted)' }}>← swipe</span>}
              </div>
            ))}
          </div>
        </div>
      </div>

      <AHChatInput placeholder="Type a reply…" reply={true} />
    </AHScreen>
  );
}
