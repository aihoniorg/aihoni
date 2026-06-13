import { useState } from 'react';
import { AHScreen, AHTabBar } from '../components/ui';
import { ImageSlot } from '../components/ImageSlot';
import { AH_BRAND_FONT, AH_FONT } from '../theme';
import { useNav } from '../nav';

interface Tile {
  span?: 'tall' | 'wide';
  multi?: boolean;
}

// 19 · Business page — Instagram-style profile + Explore grid.
export function BusinessPage() {
  const nav = useNav();
  const [following, setFollowing] = useState(false);
  const stats: Array<[string, string]> = [
    ['142', 'Posts'],
    ['3.4k', 'Followers'],
    ['86', 'Following'],
  ];
  const highlights: Array<[string, string]> = [
    ['नयाँ', 'var(--ah-orange)'],
    ['भाउ', '#3A6FE0'],
    ['Offers', '#8B5CF6'],
    ['Combo', '#2E9E6B'],
  ];
  const tiles: Tile[] = [
    { span: 'tall', multi: true },
    {},
    {},
    { span: 'wide' },
    {},
    { multi: true },
    {},
    { span: 'tall' },
    {},
    {},
    {},
  ];

  return (
    <AHScreen pad={false}>
      <div className="ah-scroll" style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
        {/* header */}
        <div style={{ padding: '58px 18px 8px', display: 'flex', alignItems: 'center', gap: 11, background: '#FFFFFF' }}>
          <svg onClick={nav.back} width="22" height="22" viewBox="0 0 24 24" fill="none" style={{ cursor: 'pointer' }}>
            <path d="M14 6l-6 6 6 6" stroke="var(--ah-ink)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 16, fontWeight: 800 }}>Shrestha Kirana Pasal</div>
            <div style={{ fontSize: 11, color: 'var(--ah-muted)', marginTop: 1 }}>@shresthakirana · व्यापार</div>
          </div>
          <svg width="22" height="22" viewBox="0 0 24 24">
            <circle cx="12" cy="5" r="1.7" fill="var(--ah-ink)" />
            <circle cx="12" cy="12" r="1.7" fill="var(--ah-ink)" />
            <circle cx="12" cy="19" r="1.7" fill="var(--ah-ink)" />
          </svg>
        </div>

        {/* avatar + stats */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '12px 20px 8px' }}>
          <div style={{ width: 78, height: 78, borderRadius: '50%', border: '2.5px solid var(--ah-orange)', padding: 2.5, boxSizing: 'border-box', flexShrink: 0 }}>
            <div style={{ width: '100%', height: '100%', borderRadius: '50%', background: 'var(--ah-orange)', color: '#fff', fontFamily: AH_BRAND_FONT, fontWeight: 800, fontSize: 28, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              प
            </div>
          </div>
          <div style={{ flex: 1, display: 'flex', justifyContent: 'space-around' }}>
            {stats.map(([n, l]) => (
              <div key={l} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 18, fontWeight: 800, letterSpacing: -0.3 }}>{n}</div>
                <div style={{ fontSize: 11.5, color: 'var(--ah-muted)', marginTop: 1 }}>{l}</div>
              </div>
            ))}
          </div>
        </div>

        {/* bio */}
        <div style={{ padding: '4px 20px 12px' }}>
          <div style={{ fontSize: 13.5, fontWeight: 700 }}>किराना · Grocery</div>
          <div style={{ fontSize: 13, color: 'var(--ah-ink)', lineHeight: 1.45, marginTop: 2 }}>दैनिक तरकारी, चामल, दाल, तेल। होम डेलिभरी उपलब्ध।</div>
          <div style={{ fontSize: 12.5, color: 'var(--ah-orange)', fontWeight: 700, marginTop: 3 }}>📍 Lagankhel · Open 7am–8pm</div>
        </div>

        {/* action buttons */}
        <div style={{ display: 'flex', gap: 8, padding: '0 20px 12px' }}>
          <button
            onClick={() => setFollowing(!following)}
            style={{
              flex: 2,
              border: 'none',
              cursor: 'pointer',
              borderRadius: 99,
              padding: '11px 0',
              fontSize: 13.5,
              fontWeight: 800,
              fontFamily: AH_FONT,
              background: following ? '#fff' : 'var(--ah-orange)',
              color: following ? 'var(--ah-ink)' : '#fff',
              boxShadow: following ? 'inset 0 0 0 1.5px var(--ah-line)' : '0 8px 18px -8px var(--ah-orange)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 6,
            }}
          >
            {following && (
              <svg width="13" height="10" viewBox="0 0 12 10">
                <path d="M1 5l3.2 3.4L11 1" stroke="var(--ah-ink)" strokeWidth="2.2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            )}
            {following ? 'Following' : '+ Follow'}
          </button>
          <button
            onClick={() => nav.go('chatAttach')}
            style={{ flex: 1, border: 'none', cursor: 'pointer', borderRadius: 99, padding: '11px 0', fontSize: 13.5, fontWeight: 700, fontFamily: AH_FONT, background: '#fff', boxShadow: 'inset 0 0 0 1.5px var(--ah-line)' }}
          >
            Message
          </button>
          <button style={{ width: 44, height: 42, border: 'none', cursor: 'pointer', borderRadius: 99, background: '#fff', boxShadow: 'inset 0 0 0 1.5px var(--ah-line)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M4 5c0-1 1-2 2-2h2l2 4-2 1.5c1 3 3 5 6 6L15.5 13l4 2v2c0 1-1 2-2 2-7.2 0-13-5.8-13-13z" stroke="var(--ah-ink)" strokeWidth="1.8" strokeLinejoin="round" />
            </svg>
          </button>
        </div>

        {/* highlights */}
        <div className="ah-scroll" style={{ display: 'flex', gap: 14, padding: '0 20px 12px', overflowX: 'auto' }}>
          {highlights.map(([l, color]) => (
            <div key={l} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, flexShrink: 0 }}>
              <div style={{ width: 56, height: 56, borderRadius: '50%', background: `color-mix(in oklch, ${color} 16%, white)`, color, fontFamily: AH_BRAND_FONT, fontWeight: 800, fontSize: 11.5, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1.5px solid var(--ah-line)' }}>
                {l}
              </div>
              <span style={{ fontSize: 10.5, color: 'var(--ah-muted)' }}>{l}</span>
            </div>
          ))}
        </div>

        {/* tab bar inside profile */}
        <div style={{ display: 'flex', borderTop: '1px solid var(--ah-line)' }}>
          <div style={{ flex: 1, textAlign: 'center', padding: '10px 0 8px', borderBottom: '2px solid var(--ah-orange)' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <rect x="3" y="3" width="7" height="7" rx="1.2" stroke="var(--ah-orange)" strokeWidth="1.9" />
              <rect x="14" y="3" width="7" height="7" rx="1.2" stroke="var(--ah-orange)" strokeWidth="1.9" />
              <rect x="3" y="14" width="7" height="7" rx="1.2" stroke="var(--ah-orange)" strokeWidth="1.9" />
              <rect x="14" y="14" width="7" height="7" rx="1.2" stroke="var(--ah-orange)" strokeWidth="1.9" />
            </svg>
          </div>
          <div style={{ flex: 1, textAlign: 'center', padding: '10px 0 8px' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <rect x="3" y="3" width="18" height="18" rx="5" stroke="var(--ah-muted)" strokeWidth="1.9" />
              <path d="M10.5 9.2l4.5 2.8-4.5 2.8z" fill="var(--ah-muted)" />
            </svg>
          </div>
          <div style={{ flex: 1, textAlign: 'center', padding: '10px 0 8px' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <circle cx="9" cy="9" r="3" stroke="var(--ah-muted)" strokeWidth="1.9" />
              <circle cx="16" cy="16" r="4.5" stroke="var(--ah-muted)" strokeWidth="1.9" />
            </svg>
          </div>
        </div>

        {/* posts grid */}
        <div style={{ padding: 3, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gridAutoRows: '116px', gridAutoFlow: 'dense', gap: 3 }}>
          {tiles.map((p, i) => (
            <div
              key={i}
              style={{
                position: 'relative',
                gridRow: p.span === 'tall' ? 'span 2' : 'span 1',
                gridColumn: p.span === 'wide' ? 'span 2' : 'span 1',
                background: `color-mix(in oklch, var(--ah-orange) ${10 + (i % 3) * 5}%, white)`,
              }}
            >
              <ImageSlot placeholder=" " style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} />
              {p.multi && (
                <div style={{ position: 'absolute', top: 5, right: 5, color: '#fff', filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.4))' }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                    <rect x="6" y="3" width="15" height="15" rx="2.5" stroke="#fff" strokeWidth="2" />
                    <path d="M3 8v11a2 2 0 0 0 2 2h11" stroke="#fff" strokeWidth="2" strokeLinecap="round" fill="none" />
                  </svg>
                </div>
              )}
              {(p.span === 'tall' || p.span === 'wide') && (
                <div style={{ position: 'absolute', bottom: 5, left: 5, color: '#fff', filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.4))' }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                    {p.span === 'tall' ? (
                      <rect x="8" y="3" width="8" height="18" rx="2" stroke="#fff" strokeWidth="2" />
                    ) : (
                      <rect x="3" y="8" width="18" height="8" rx="2" stroke="#fff" strokeWidth="2" />
                    )}
                  </svg>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
      <AHTabBar active="feed" />
    </AHScreen>
  );
}
