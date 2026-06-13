import type { ReactNode } from 'react';
import { AHScreen, AHTabBar, AHOrb } from '../components/ui';
import { AHStoryRing } from '../components/StoryRing';
import { AH_BRAND_FONT, AH_FONT } from '../theme';
import { useNav, type ScreenId } from '../nav';

interface Row {
  kind?: string;
  name: string;
  last?: string;
  time: string;
  ai?: boolean;
  g?: string;
  c?: string;
  group?: boolean;
  unread?: number;
  sub?: string;
  voice?: boolean;
  file?: boolean;
  read?: boolean;
  muted?: boolean;
  to?: ScreenId;
}

// 11 · Chats — messenger-style inbox (landing screen of the app).
export function ChatList() {
  const nav = useNav();
  const filters: Array<[string, boolean]> = [
    ['All Chats', true],
    ['New', false],
    ['Family', false],
    ['Work', false],
    ['Friends', false],
    ['Stores', false],
    ['Unread', false],
  ];
  const stories = [
    { glyph: 'सु', add: true, label: 'तपाईं' },
    { glyph: 'रा', color: '#7AAD6A', label: 'Ram' },
    { glyph: 'अ', color: '#5C7AA8', kind: 'business' as const, label: 'Sajha' },
    { glyph: 'सी', color: '#D9695A', label: 'Sita', seen: true },
    { glyph: 'द', color: '#B07A4A', label: 'Daniel', seen: true },
  ];

  const rows: Row[] = [
    { kind: 'pinned', name: 'aihoni', last: 'आज सुनको भाउ रू 1,42,500 छ', time: '09:37', ai: true, to: 'chat' },
    { g: 'रा', c: '#7AAD6A', name: 'Ram Thapa', last: 'दाल को बोरा छ?', time: '09:01', unread: 1 },
    { group: true, c: '#3A6FE0', name: 'Lagankhel व्यापारी', last: 'Sita: भोलि बैठक छ', time: '08:40', unread: 3, sub: '8 members', to: 'groupChat' },
    { g: 'अ', c: '#5C7AA8', name: 'Alex · Sajha Kirana', last: 'Concept_preview.mov', time: '09:12', unread: 2, voice: true, file: true, to: 'chatAttach' },
    { g: 'द', c: '#B07A4A', name: 'Daniel Brooks', last: '👍', time: '08:17', read: true },
    { g: 'IME', c: '#C0392B', name: 'IME Pay', last: 'रू 250 recharge successful', time: 'Sun', read: true, sub: 'Auto: top-up confirmed' },
    { g: 'सी', c: '#D9695A', name: 'Sita Gurung', last: "You're coming tonight, right?", time: 'Sun', muted: true, to: 'chatAttach' },
    { g: 'लि', c: '#4C8C8C', name: 'Liam Chen', last: 'Sounds good to me', time: 'Oct 14' },
  ];

  const dbl: ReactNode = (
    <svg width="15" height="9" viewBox="0 0 16 10" style={{ flexShrink: 0 }}>
      <path d="M1 5l3 3.4L9.5 2" stroke="var(--ah-orange)" strokeWidth="1.7" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M7 5l3 3.4L15.5 2" stroke="var(--ah-orange)" strokeWidth="1.7" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );

  return (
    <AHScreen pad={false} style={{ background: 'var(--ah-bg)' }}>
      {/* header */}
      <div style={{ padding: '58px 20px 6px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontSize: 26, fontWeight: 800, letterSpacing: -0.5 }}>Chats</span>
        <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
          <svg width="23" height="23" viewBox="0 0 24 24" fill="none">
            <path d="M4 8.5A2.5 2.5 0 0 1 6.5 6h1.2l.9-1.6a1 1 0 0 1 .9-.5h5a1 1 0 0 1 .9.5L16.3 6h1.2A2.5 2.5 0 0 1 20 8.5v8A2.5 2.5 0 0 1 17.5 19h-11A2.5 2.5 0 0 1 4 16.5z" stroke="var(--ah-ink)" strokeWidth="1.8" strokeLinejoin="round" />
            <circle cx="12" cy="12" r="3.2" stroke="var(--ah-ink)" strokeWidth="1.8" />
          </svg>
          <svg width="23" height="23" viewBox="0 0 24 24" fill="none">
            <rect x="5" y="3" width="14" height="18" rx="3.5" stroke="var(--ah-ink)" strokeWidth="1.8" />
            <circle cx="12" cy="10" r="2.4" stroke="var(--ah-ink)" strokeWidth="1.8" />
            <path d="M8.5 16.5a3.5 3.5 0 0 1 7 0" stroke="var(--ah-ink)" strokeWidth="1.8" strokeLinecap="round" />
            <path d="M5 7.5H3M5 12H3M5 16.5H3" stroke="var(--ah-ink)" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
          <div style={{ position: 'relative', display: 'flex' }}>
            <svg width="23" height="23" viewBox="0 0 24 24" fill="none">
              <path d="M18 8.5a6 6 0 0 0-12 0c0 6-2.5 7.5-2.5 7.5h17S18 14.5 18 8.5z" stroke="var(--ah-ink)" strokeWidth="1.8" strokeLinejoin="round" />
              <path d="M10.2 19.5a2.2 2.2 0 0 0 3.6 0" stroke="var(--ah-ink)" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
            <span style={{ position: 'absolute', top: 1, right: 2, width: 8, height: 8, borderRadius: '50%', background: 'var(--ah-orange)', border: '1.5px solid #FFFFFF' }} />
          </div>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <circle cx="11" cy="11" r="7" stroke="var(--ah-ink)" strokeWidth="2" />
            <path d="M21 21l-4-4" stroke="var(--ah-ink)" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </div>
      </div>

      {/* stories */}
      <div className="ah-scroll" style={{ display: 'flex', gap: 14, padding: '14px 20px 6px', overflowX: 'auto', overflowY: 'hidden' }}>
        {stories.map((s, i) => (
          <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5, flexShrink: 0 }}>
            <AHStoryRing size={68} {...s} />
            <span style={{ fontSize: 11, color: 'var(--ah-muted)', fontWeight: 600, maxWidth: 66, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {s.label}
            </span>
          </div>
        ))}
      </div>

      {/* filter tabs */}
      <div className="ah-scroll" style={{ display: 'flex', gap: 18, padding: '16px 20px 0', overflowX: 'auto', overflowY: 'hidden', borderBottom: '1px solid var(--ah-line)' }}>
        {filters.map(([l, on], i) => (
          <div key={i} style={{ paddingBottom: 9, position: 'relative', fontSize: 14, fontWeight: on ? 800 : 600, color: on ? 'var(--ah-ink)' : 'var(--ah-muted)', whiteSpace: 'nowrap' }}>
            {l}
            {on && <span style={{ position: 'absolute', left: 0, right: 0, bottom: -1, height: 3, borderRadius: 99, background: 'var(--ah-orange)' }} />}
          </div>
        ))}
      </div>

      {/* list */}
      <div className="ah-scroll" style={{ flex: 1, overflowY: 'auto' }}>
        {rows.map((r, i) => {
          const pinned = r.kind === 'pinned';
          return (
            <div
              key={i}
              onClick={() => r.to && nav.go(r.to)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 13,
                padding: '12px 20px',
                cursor: r.to ? 'pointer' : 'default',
                background: pinned ? 'color-mix(in oklch, var(--ah-orange) 10%, white)' : 'transparent',
              }}
            >
              {r.ai ? (
                <div style={{ flexShrink: 0 }}>
                  <AHOrb size={48} />
                </div>
              ) : r.group ? (
                <div style={{ width: 48, height: 48, borderRadius: '50%', background: `color-mix(in oklch, ${r.c} 14%, white)`, color: r.c, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, border: '2px solid #fff' }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <circle cx="9" cy="9" r="3" stroke="currentColor" strokeWidth="1.8" />
                    <path d="M3.5 18a5.5 5.5 0 0 1 11 0" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                    <path d="M16 7.5a2.8 2.8 0 0 1 0 5.4M17 18a5 5 0 0 0-2.3-4.2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                  </svg>
                </div>
              ) : (
                <div style={{ width: 48, height: 48, borderRadius: '50%', background: `color-mix(in oklch, ${r.c} 22%, white)`, color: r.c, fontFamily: AH_BRAND_FONT, fontWeight: 800, fontSize: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, border: '2px solid #fff' }}>
                  {r.g}
                </div>
              )}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ fontSize: 15.5, fontWeight: 700, fontFamily: r.ai ? AH_BRAND_FONT : AH_FONT }}>
                    {r.name}
                    {r.ai && <span style={{ color: 'var(--ah-orange)' }}>.</span>}
                  </span>
                  {r.ai && (
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 3, fontSize: 9.5, fontWeight: 800, color: '#fff', background: 'var(--ah-orange)', borderRadius: 99, padding: '2px 7px 2px 5px' }}>
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none">
                        <path d="M12 3l1.6 4.3a5 5 0 0 0 3.1 3.1L21 12l-4.3 1.6a5 5 0 0 0-3.1 3.1L12 21l-1.6-4.3a5 5 0 0 0-3.1-3.1L3 12l4.3-1.6a5 5 0 0 0 3.1-3.1z" fill="#fff" />
                      </svg>
                      AI
                    </span>
                  )}
                  <span style={{ marginLeft: 'auto', fontSize: 11.5, fontWeight: r.unread ? 700 : 500, color: r.unread ? 'var(--ah-orange)' : 'var(--ah-muted)' }}>{r.time}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 3 }}>
                  {r.read && dbl}
                  {r.voice && (
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}>
                      <path d="M3 13c2 0 2-3 4-3s2 5 4 5 2-7 4-7 2 4 4 4 2-1 2-1" stroke="var(--ah-orange)" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                  )}
                  <span style={{ flex: 1, minWidth: 0, fontSize: 13.5, color: r.unread ? 'var(--ah-ink)' : 'var(--ah-muted)', fontWeight: r.unread ? 600 : 400, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {r.sub || r.last}
                  </span>
                  {pinned && (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}>
                      <path d="M14 4l6 6-4 1-2 6-3-3-4 4-1-1 4-4-3-3 6-2 1-4z" fill="var(--ah-orange)" />
                    </svg>
                  )}
                  {!!r.unread && (
                    <span style={{ minWidth: 20, height: 20, borderRadius: 99, background: 'var(--ah-orange)', color: '#fff', fontSize: 11.5, fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 6px', flexShrink: 0 }}>
                      {r.unread}
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <AHTabBar active="chat" />
    </AHScreen>
  );
}
