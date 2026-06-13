import { AHScreen, AHChatInput } from '../components/ui';
import { AH_BRAND_FONT } from '../theme';
import { useNav } from '../nav';

// 15 · Chat · attachment sheet (WhatsApp-style paperclip menu).
export function ChatAttach() {
  const nav = useNav();
  const sheetItems = [
    { id: 'photo', label: 'Photo', d: 'M3 5h18v15H3zM3 16l5-5 5 5 3-3 5 5' },
    { id: 'camera', label: 'Camera', d: 'M4 7h3l2-3h6l2 3h3v13H4zM12 17a4 4 0 1 0 0-8 4 4 0 0 0 0 8z' },
    { id: 'file', label: 'Document', d: 'M6 3h8l5 5v13H6zM14 3v5h5' },
    { id: 'voice', label: 'Audio', d: 'M12 3a3 3 0 0 0-3 3v6a3 3 0 0 0 6 0V6a3 3 0 0 0-3-3zM5 11.5a7 7 0 0 0 14 0M12 18.5V22' },
    { id: 'loc', label: 'Location', d: 'M12 21s7-5.2 7-11a7 7 0 1 0-14 0c0 5.8 7 11 7 11zM12 12.5a2.4 2.4 0 1 0 0-5 2.4 2.4 0 0 0 0 5z' },
    { id: 'contact', label: 'Contact', d: 'M12 12a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7zM5 21a7 7 0 0 1 14 0' },
    { id: 'product', label: 'Product', d: 'M3 9l9-6 9 6v12H3zM9 21v-7h6v7' },
    { id: 'poll', label: 'Poll', d: 'M5 19V11M12 19V5M19 19V14' },
  ];

  return (
    <AHScreen pad={false} style={{ background: 'var(--ah-bg)' }}>
      {/* header */}
      <div style={{ padding: '58px 18px 12px', display: 'flex', alignItems: 'center', gap: 11, background: '#FFFFFF' }}>
        <svg onClick={nav.back} width="22" height="22" viewBox="0 0 24 24" fill="none" style={{ cursor: 'pointer' }}>
          <path d="M14 6l-6 6 6 6" stroke="var(--ah-ink)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <div style={{ width: 40, height: 40, borderRadius: '50%', border: '2px solid var(--ah-orange)', padding: 1.5, boxSizing: 'border-box' }}>
          <div style={{ width: '100%', height: '100%', borderRadius: '50%', background: 'color-mix(in oklch, var(--ah-orange) 30%, white)', color: 'var(--ah-orange)', fontFamily: AH_BRAND_FONT, fontWeight: 800, fontSize: 14, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            सी
          </div>
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 15.5, fontWeight: 700 }}>Sita Gurung</div>
          <div style={{ fontSize: 11.5, color: 'var(--ah-orange)', fontWeight: 600, marginTop: 1 }}>Online</div>
        </div>
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
          <rect x="3" y="6" width="13" height="12" rx="3" stroke="var(--ah-ink)" strokeWidth="1.8" />
          <path d="M16 10l5-3v10l-5-3z" stroke="var(--ah-ink)" strokeWidth="1.8" strokeLinejoin="round" />
        </svg>
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
          <path d="M4 5c0-1 1-2 2-2h2l2 4-2 1.5c1 3 3 5 6 6L15.5 13l4 2v2c0 1-1 2-2 2-7.2 0-13-5.8-13-13z" stroke="var(--ah-ink)" strokeWidth="1.8" strokeLinejoin="round" />
        </svg>
      </div>

      {/* faded messages behind */}
      <div style={{ flex: 1, padding: '14px 16px 8px', display: 'flex', flexDirection: 'column', gap: 10, overflow: 'hidden', opacity: 0.55 }}>
        <div style={{ alignSelf: 'flex-start', maxWidth: 250, background: '#fff', borderRadius: '20px 20px 20px 6px', padding: '11px 15px 8px', boxShadow: '0 2px 6px -3px rgba(20,20,25,0.18)' }}>
          <div style={{ fontSize: 14, lineHeight: 1.4 }}>तपाईंलाई के पठाउने?</div>
        </div>
        <div style={{ alignSelf: 'flex-end', maxWidth: 260 }}>
          <div style={{ background: '#1B1B1F', color: '#fff', borderRadius: '20px 20px 6px 20px', padding: '10px 14px 8px' }}>
            <div style={{ fontSize: 14, lineHeight: 1.4 }}>एक मिनेट, फोटो attach गर्छु…</div>
          </div>
        </div>
      </div>

      {/* dim overlay */}
      <div style={{ position: 'absolute', inset: 0, background: 'rgba(20,12,4,0.18)', pointerEvents: 'none' }} />

      {/* attachment sheet */}
      <div style={{ position: 'relative', background: '#fff', borderRadius: '24px 24px 0 0', padding: '14px 18px 16px', boxShadow: '0 -14px 36px -10px rgba(80,40,8,0.25)' }}>
        <div style={{ width: 40, height: 5, borderRadius: 99, background: '#E8DCC0', margin: '0 auto 12px' }} />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10, rowGap: 16 }}>
          {sheetItems.map((it) => (
            <div key={it.id} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 60, height: 60, borderRadius: 22, flexShrink: 0, background: '#F6F6F6', color: '#1B1B1F', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="27" height="27" viewBox="0 0 24 24" fill="none">
                  <path d={it.d} stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--ah-ink)' }}>{it.label}</span>
            </div>
          ))}
        </div>
      </div>

      <AHChatInput placeholder="Type a message" />
    </AHScreen>
  );
}
