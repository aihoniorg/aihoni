import { AHScreen, AHProgress, AHButton } from '../components/ui';
import { AH_BRAND_FONT } from '../theme';
import { useNav } from '../nav';

// 10 · Teach aihoni your business — unified input grid + knowledge list.
export function Knowledge() {
  const nav = useNav();
  const inputs = [
    { id: 'photo', label: 'Picture', sub: 'फोटो', d: 'M3 5h18v15H3zM3 16l5-5 5 5 3-3 5 5' },
    { id: 'voice', label: 'Voice note', sub: 'आवाज', d: 'M12 3a3 3 0 0 0-3 3v6a3 3 0 0 0 6 0V6a3 3 0 0 0-3-3zM5 11.5a7 7 0 0 0 14 0M12 18.5V22' },
    { id: 'file', label: 'File', sub: 'PDF · Word · Excel', d: 'M6 3h8l5 5v13H6zM14 3v5h5' },
    { id: 'text', label: 'Type it', sub: 'लेख्नुहोस्', d: 'M4 6h16M4 12h11M4 18h16' },
    { id: 'link', label: 'Link / URL', sub: 'Webpage, drive', d: 'M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7L11.5 6.8M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7L12.5 17.2' },
    { id: 'scan', label: 'Scan', sub: 'Camera स्क्यान', d: 'M3 8V6a3 3 0 0 1 3-3h2M21 8V6a3 3 0 0 0-3-3h-2M3 16v2a3 3 0 0 0 3 3h2M21 16v2a3 3 0 0 1-3 3h-2M3 12h18' },
  ];

  const added: Array<[string, string, string]> = [
    ['IMG', 'Price board photo', 'Read 38 prices'],
    ['0:42', 'Voice note — व्यापारको बारेमा', 'Hours, delivery area'],
    ['XLS', 'products-2083.xlsx', '142 items added'],
    ['PDF', 'Rate-list Baisakh.pdf', '24 prices updated'],
    ['URL', 'shrestha.com.np', 'About + contact synced'],
  ];

  return (
    <AHScreen style={{ padding: '60px 22px 24px' }}>
      <AHProgress step={6} />
      <div style={{ marginTop: -8, marginBottom: 14 }}>
        <div style={{ fontFamily: AH_BRAND_FONT, fontSize: 15, fontWeight: 600, marginBottom: 3, color: 'rgb(27, 27, 31)' }}>
          व्यापार सिकाउनुहोस्
        </div>
        <div style={{ fontSize: 23, letterSpacing: -0.4, lineHeight: 1.15, fontWeight: 700 }}>Teach aihoni your business</div>
        <div style={{ fontSize: 13, lineHeight: 1.4, color: 'var(--ah-muted)', marginTop: 4 }}>Add from any input — anytime, in any mix.</div>
      </div>

      {/* 3×2 input methods grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 7 }}>
        {inputs.map((it) => (
          <div
            key={it.id}
            style={{
              background: '#fff',
              border: '1.5px solid rgb(239, 236, 236)',
              borderRadius: 14,
              padding: '9px 6px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 3,
              textAlign: 'center',
            }}
          >
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: 10,
                flexShrink: 0,
                background: '#F6F6F6',
                color: 'rgb(27, 27, 31)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d={it.d} stroke="rgb(27, 27, 31)" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <div style={{ fontSize: 11.5, marginTop: 1, fontWeight: 500 }}>{it.label}</div>
            <div style={{ fontSize: 9.5, color: 'var(--ah-muted)' }}>{it.sub}</div>
          </div>
        ))}
      </div>

      {/* knowledge so far */}
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', margin: '13px 2px 7px' }}>
        <span style={{ fontSize: 11.5, color: 'var(--ah-muted)', letterSpacing: 0.3, fontWeight: 500 }}>KNOWLEDGE SO FAR · 5</span>
        <span style={{ fontSize: 11, color: 'rgb(27, 27, 31)', fontWeight: 500 }}>+ Add more</span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {added.map(([tag, title, sub]) => (
          <div
            key={title}
            style={{
              background: '#fff',
              border: '1.5px solid rgb(239, 236, 236)',
              borderRadius: 12,
              padding: '7px 11px',
              display: 'flex',
              alignItems: 'center',
              gap: 10,
            }}
          >
            <div
              style={{
                width: 28,
                height: 28,
                borderRadius: 8,
                flexShrink: 0,
                background: 'rgb(246, 246, 246)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 9,
                fontWeight: 800,
                color: 'rgb(27, 27, 31)',
              }}
            >
              {tag}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 13, fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{title}</div>
              <div style={{ fontSize: 11, color: 'var(--ah-muted)', marginTop: 0.5 }}>{sub}</div>
            </div>
            <svg width="12" height="9" viewBox="0 0 12 10" style={{ flexShrink: 0 }}>
              <path d="M1 5l3.2 3.4L11 1" stroke="rgb(46, 158, 107)" strokeWidth="2.2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        ))}
      </div>

      {/* open to everyone */}
      <div
        style={{
          marginTop: 10,
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          background: 'rgb(246, 246, 246)',
          borderRadius: 14,
          padding: '10px 13px',
        }}
      >
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 13, fontWeight: 700 }}>सबैले सोध्न सक्ने · Open to everyone</div>
          <div style={{ fontSize: 10.5, color: 'var(--ah-muted)', marginTop: 1, lineHeight: 1.35 }}>
            Any user can ask aihoni about your business.
          </div>
        </div>
        <div style={{ width: 44, height: 27, borderRadius: 99, flexShrink: 0, position: 'relative', background: 'rgb(27, 27, 31)' }}>
          <div
            style={{
              position: 'absolute',
              top: 2,
              right: 2,
              width: 23,
              height: 23,
              borderRadius: '50%',
              background: '#fff',
              boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
            }}
          />
        </div>
      </div>

      <div style={{ flex: 1, minHeight: 10 }} />
      <AHButton kind="primary" style={{ minHeight: 48, fontSize: 16 }} onClick={nav.next}>
        Save knowledge
      </AHButton>
      <AHButton kind="ghost" style={{ minHeight: 38 }} onClick={nav.next}>
        Skip for now
      </AHButton>
    </AHScreen>
  );
}
