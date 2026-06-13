import { useState } from 'react';
import { AHScreen, AHTabBar } from '../components/ui';
import { AHStoryRing } from '../components/StoryRing';
import { ImageSlot } from '../components/ImageSlot';
import { AH_BRAND_FONT } from '../theme';
import { useNav } from '../nav';

interface Post {
  glyph: string;
  name: string;
  loc: string;
  cap: string;
  likes: string;
  liked: boolean;
  saved: boolean;
  follow: 'follow' | 'following';
  images: string[];
  active?: number;
  ratio: string;
}

// 12 · Feed — post feed with Like / Save / Share (no comments).
export function Feed() {
  const nav = useNav();
  const [tab, setTab] = useState('all');
  const filters: Array<[string, string]> = [
    ['all', 'All'],
    ['stores', 'Stores'],
    ['nearby', 'Nearby'],
    ['saved', 'Saved 🔖'],
  ];
  const stories = [
    { glyph: 'सु', add: true },
    { glyph: 'रा', color: '#7AAD6A' },
    { glyph: 'अ', color: '#5C7AA8', kind: 'business' as const },
    { glyph: 'सी', color: '#D9695A' },
    { glyph: 'द', color: '#B07A4A' },
  ];

  const posts: Post[] = [
    {
      glyph: 'प',
      name: 'Shrestha Kirana Pasal',
      loc: 'Lagankhel · 2h',
      cap: 'नयाँ बासमती चामल आयो 🍚 २५ केजी बोरा सस्तोमा।',
      likes: '1.2k',
      liked: true,
      saved: false,
      follow: 'follow',
      images: ['feed-1a', 'feed-1b', 'feed-1c'],
      active: 0,
      ratio: '4 / 5',
    },
    {
      glyph: 'अ',
      name: 'Annapurna Dairy',
      loc: 'Pulchowk · 4h',
      cap: 'ताजा दही र पनीर — आजै अर्डर गर्नुहोस्।',
      likes: '342',
      liked: false,
      saved: true,
      follow: 'following',
      images: ['feed-2a'],
      ratio: '4 / 3',
    },
  ];

  return (
    <AHScreen pad={false}>
      <div style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        {/* header */}
        <div style={{ padding: '58px 20px 6px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#FFFFFF' }}>
          <span style={{ fontSize: 26, fontWeight: 800, letterSpacing: -0.5 }}>Feed</span>
          <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <path d="M12 5v14M5 12h14" stroke="var(--ah-ink)" strokeWidth="2.2" strokeLinecap="round" />
            </svg>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <circle cx="11" cy="11" r="7" stroke="var(--ah-ink)" strokeWidth="2" />
              <path d="M21 21l-4-4" stroke="var(--ah-ink)" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </div>
        </div>

        {/* stories */}
        <div className="ah-scroll" style={{ display: 'flex', gap: 12, padding: '12px 20px 4px', overflowX: 'auto' }}>
          {stories.map((s, i) => (
            <div key={i} onClick={() => nav.go('businessPage')} style={{ cursor: 'pointer' }}>
              <AHStoryRing size={56} {...s} />
            </div>
          ))}
        </div>

        {/* filter tabs */}
        <div style={{ display: 'flex', gap: 18, padding: '12px 20px 0', borderBottom: '1px solid var(--ah-line)' }}>
          {filters.map(([id, l]) => {
            const on = id === tab;
            return (
              <div
                key={id}
                onClick={() => setTab(id)}
                style={{ paddingBottom: 9, position: 'relative', fontSize: 13.5, fontWeight: on ? 800 : 600, color: on ? 'var(--ah-ink)' : 'var(--ah-muted)', whiteSpace: 'nowrap', cursor: 'pointer' }}
              >
                {l}
                {on && <span style={{ position: 'absolute', left: 0, right: 0, bottom: -1, height: 3, borderRadius: 99, background: 'var(--ah-orange)' }} />}
              </div>
            );
          })}
        </div>

        {/* posts */}
        <div className="ah-scroll" style={{ flex: 1, overflowY: 'auto' }}>
          {posts.map((p, i) => {
            const active = p.active || 0;
            return (
              <div key={i} style={{ padding: '14px 20px 0' }}>
                {/* post header */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 11, marginBottom: 11 }}>
                  <div onClick={() => nav.go('businessPage')} style={{ width: 40, height: 40, borderRadius: '50%', border: '2px solid var(--ah-orange)', padding: 1.5, boxSizing: 'border-box', cursor: 'pointer' }}>
                    <div style={{ width: '100%', height: '100%', borderRadius: '50%', background: 'color-mix(in oklch, var(--ah-orange) 22%, white)', color: 'var(--ah-orange)', fontFamily: AH_BRAND_FONT, fontWeight: 800, fontSize: 13, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {p.glyph}
                    </div>
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                      <span style={{ fontSize: 14, fontWeight: 700 }}>{p.name}</span>
                      <span style={{ fontSize: 11, color: 'var(--ah-muted)' }}>·</span>
                      {p.follow === 'follow' ? (
                        <span style={{ fontSize: 12, fontWeight: 800, color: 'var(--ah-orange)', cursor: 'pointer' }}>Follow</span>
                      ) : (
                        <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--ah-muted)' }}>Following</span>
                      )}
                    </div>
                    <div style={{ fontSize: 11.5, color: 'var(--ah-muted)', marginTop: 1 }}>{p.loc}</div>
                  </div>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <circle cx="5" cy="12" r="1.6" fill="var(--ah-muted)" />
                    <circle cx="12" cy="12" r="1.6" fill="var(--ah-muted)" />
                    <circle cx="19" cy="12" r="1.6" fill="var(--ah-muted)" />
                  </svg>
                </div>

                {/* image */}
                <div style={{ position: 'relative' }}>
                  <div style={{ position: 'relative', width: '100%', aspectRatio: p.ratio, maxHeight: 420, borderRadius: 22, overflow: 'hidden', background: 'color-mix(in oklch, var(--ah-orange) 14%, white)' }}>
                    <ImageSlot
                      placeholder={
                        p.images.length > 1
                          ? `Photo 1 of ${p.images.length} · ${p.ratio === '4 / 5' ? 'portrait' : 'landscape'}`
                          : `Photo · ${p.ratio === '4 / 5' ? 'portrait' : 'landscape'}`
                      }
                      style={{ width: '100%', height: '100%' }}
                    />
                  </div>
                  {p.images.length > 1 && (
                    <>
                      <div style={{ position: 'absolute', top: 12, right: 12, background: 'rgba(20,12,4,0.7)', color: '#fff', borderRadius: 99, padding: '3px 10px', fontSize: 11, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 4 }}>
                        <svg width="11" height="11" viewBox="0 0 24 24" fill="none">
                          <rect x="6" y="3" width="15" height="15" rx="2.5" stroke="#fff" strokeWidth="2" />
                          <path d="M3 8v11a2 2 0 0 0 2 2h11" stroke="#fff" strokeWidth="2" strokeLinecap="round" fill="none" />
                        </svg>
                        {active + 1}/{p.images.length}
                      </div>
                      <div style={{ position: 'absolute', bottom: -16, left: 0, right: 0, display: 'flex', justifyContent: 'center', gap: 5 }}>
                        {p.images.map((_, j) => (
                          <span
                            key={j}
                            style={{
                              width: j === active ? 7 : 5,
                              height: j === active ? 7 : 5,
                              borderRadius: '50%',
                              background: j === active ? 'var(--ah-orange)' : 'color-mix(in oklch, var(--ah-orange) 30%, white)',
                            }}
                          />
                        ))}
                      </div>
                    </>
                  )}
                </div>

                {/* actions */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 20, padding: '13px 4px 6px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                    {p.liked ? (
                      <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
                        <path d="M12 20.5s-7.5-4.5-9.5-9A5 5 0 0 1 12 6.5a5 5 0 0 1 9.5 5c-2 4.5-9.5 9-9.5 9z" fill="var(--ah-orange)" />
                      </svg>
                    ) : (
                      <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
                        <path d="M12 20.5s-7.5-4.5-9.5-9A5 5 0 0 1 12 6.5a5 5 0 0 1 9.5 5c-2 4.5-9.5 9-9.5 9z" stroke="var(--ah-ink)" strokeWidth="1.9" strokeLinejoin="round" />
                      </svg>
                    )}
                    <span style={{ fontSize: 13.5, fontWeight: 700 }}>{p.likes}</span>
                  </div>
                  {p.saved ? (
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                      <path d="M5 3.5h14V21l-7-4.4L5 21z" fill="var(--ah-orange)" />
                    </svg>
                  ) : (
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                      <path d="M5 3.5h14V21l-7-4.4L5 21z" stroke="var(--ah-ink)" strokeWidth="1.9" strokeLinejoin="round" />
                    </svg>
                  )}
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M3.5 11.5L20.5 4l-6 16.5-3-7.5z" stroke="var(--ah-ink)" strokeWidth="1.9" strokeLinejoin="round" />
                  </svg>
                </div>

                {/* caption */}
                <div style={{ fontSize: 13.5, lineHeight: 1.5, color: 'var(--ah-ink)' }}>
                  <strong style={{ fontWeight: 700 }}>{p.name}</strong>
                  {'  '}
                  {p.cap}
                </div>
                {i < posts.length - 1 && <div style={{ height: 1, background: 'var(--ah-line)', margin: '16px 0 0' }} />}
              </div>
            );
          })}
        </div>
      </div>
      <AHTabBar active="feed" />
    </AHScreen>
  );
}
