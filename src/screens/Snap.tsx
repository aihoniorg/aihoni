import { useState } from 'react';
import { AHScreen } from '../components/ui';
import { ImageSlot } from '../components/ImageSlot';
import { AH_BRAND_FONT } from '../theme';
import { useNav } from '../nav';

// 13 · Snap camera — full-bleed viewfinder, AI lenses, mode strip, shutter.
export function Snap() {
  const nav = useNav();
  const [mode, setMode] = useState('Snap');
  const modes = ['Story', 'Snap', 'Reel', 'Live'];
  const lenses = ['✨', '🌸', '🎭', '🌈', '🤖', '🔥'];

  const tools: Array<[string, string]> = [
    ['Flip', 'M20 7H4M4 7l4-4M4 7l4 4M4 17h16M16 17l4-4M16 17l4 4'],
    ['Timer', 'M12 8v4l3 2M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18z'],
    ['Grid', 'M3 3h7v7H3zM14 3h7v7h-7zM3 14h7v7H3zM14 14h7v7h-7z'],
    ['AR', 'M2 12L12 2l10 10-10 10-10-10zM12 7v5l3 3'],
  ];
  const topIcons = [
    'M13 2L3 14h9l-1 8 10-12h-9l1-8z',
    'M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z',
  ];

  return (
    <AHScreen pad={false} style={{ background: '#111', position: 'relative', overflow: 'hidden' }}>
      <ImageSlot placeholder="Camera preview" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} />

      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', background: 'linear-gradient(180deg, rgba(0,0,0,0.52) 0%, transparent 22%, transparent 54%, rgba(0,0,0,0.6) 100%)' }} />

      {/* top bar */}
      <div style={{ position: 'relative', padding: '54px 18px 0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div onClick={nav.back} style={{ width: 36, height: 36, borderRadius: '50%', background: 'rgba(0,0,0,0.28)', backdropFilter: 'blur(10px)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M15 6l-6 6 6 6" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <div style={{ fontFamily: AH_BRAND_FONT, fontWeight: 800, fontSize: 17, color: '#fff', letterSpacing: 0.4 }}>
          aihoni<span style={{ color: 'var(--ah-orange)' }}>.</span>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          {topIcons.map((d, i) => (
            <div key={i} style={{ width: 36, height: 36, borderRadius: '50%', background: 'rgba(0,0,0,0.28)', backdropFilter: 'blur(10px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="19" height="19" viewBox="0 0 24 24" fill="none">
                <path d={d} stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          ))}
        </div>
      </div>

      {/* right tool strip */}
      <div style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', display: 'flex', flexDirection: 'column', gap: 14 }}>
        {tools.map(([label, d]) => (
          <div key={label} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
            <div style={{ width: 42, height: 42, borderRadius: '50%', background: 'rgba(0,0,0,0.35)', backdropFilter: 'blur(12px)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(255,255,255,0.12)' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d={d} stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <span style={{ fontSize: 9.5, fontWeight: 600, color: 'rgba(255,255,255,0.75)' }}>{label}</span>
          </div>
        ))}
      </div>

      <div style={{ flex: 1 }} />

      {/* AI lens row */}
      <div style={{ position: 'relative', padding: '0 18px 14px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
          <span style={{ color: 'rgba(255,255,255,0.8)', fontSize: 12, fontWeight: 700 }}>AI Lenses</span>
          <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: 11 }}>See all</span>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          {lenses.map((l, i) => (
            <div
              key={i}
              style={{
                width: 50,
                height: 50,
                borderRadius: '50%',
                flexShrink: 0,
                background: i === 0 ? 'var(--ah-orange)' : 'rgba(255,255,255,0.15)',
                backdropFilter: 'blur(10px)',
                border: i === 0 ? '2px solid #fff' : '1.5px solid rgba(255,255,255,0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 22,
              }}
            >
              {l}
            </div>
          ))}
        </div>
      </div>

      {/* mode strip */}
      <div style={{ position: 'relative', display: 'flex', justifyContent: 'center', gap: 20, marginBottom: 18, padding: '0 18px' }}>
        {modes.map((m) => (
          <div key={m} onClick={() => setMode(m)} style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5 }}>
            <span style={{ fontSize: 13.5, fontWeight: 700, color: m === mode ? '#fff' : 'rgba(255,255,255,0.5)' }}>{m}</span>
            {m === mode && <div style={{ width: 20, height: 3, borderRadius: 99, background: 'var(--ah-orange)' }} />}
          </div>
        ))}
      </div>

      {/* shutter row */}
      <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'space-around', padding: '0 28px 22px' }}>
        <div style={{ width: 48, height: 48, borderRadius: 14, overflow: 'hidden', border: '2.5px solid rgba(255,255,255,0.7)', flexShrink: 0 }}>
          <ImageSlot placeholder=" " style={{ width: '100%', height: '100%' }} />
        </div>
        <div style={{ width: 82, height: 82, borderRadius: '50%', border: '4px solid #fff', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 0 2px rgba(255,255,255,0.2)' }}>
          <div style={{ width: 64, height: 64, borderRadius: '50%', background: mode === 'Live' ? '#E03030' : mode === 'Reel' ? 'var(--ah-orange)' : '#fff' }} />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, alignItems: 'center' }}>
          <div style={{ width: 42, height: 42, borderRadius: '50%', background: 'rgba(0,0,0,0.35)', backdropFilter: 'blur(10px)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(255,255,255,0.14)' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M20 7H4M4 7l4-4M4 7l4 4M4 17h16M16 17l4-4M16 17l4 4" stroke="#fff" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>
      </div>
    </AHScreen>
  );
}
