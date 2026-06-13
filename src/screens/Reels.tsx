import { AHScreen, AHTabBar } from '../components/ui';
import { ImageSlot } from '../components/ImageSlot';
import { AH_BRAND_FONT } from '../theme';
import { useNav } from '../nav';

// 17 · Reels — Instagram-style feed with a one-tap order bar.
export function Reels() {
  const nav = useNav();
  const rail: Array<[string, string]> = [
    ['M12 21s-7-4.5-9.5-9A5 5 0 0 1 12 6a5 5 0 0 1 9.5 6c-2.5 4.5-9.5 9-9.5 9z', '1.2k'],
    ['M21 11.5a8 8 0 0 1-11.6 7.1L3 21l1.4-4.4A8 8 0 1 1 21 11.5z', '86'],
    ['M4 12l16-7-7 16-2-7-7-2z', 'Share'],
  ];

  return (
    <AHScreen pad={false} style={{ background: '#000', position: 'relative' }}>
      <ImageSlot placeholder="Product reel" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} />
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(0,0,0,0.45) 0%, transparent 22%, transparent 52%, rgba(0,0,0,0.72) 100%)', pointerEvents: 'none' }} />

      <div style={{ position: 'relative', padding: '60px 18px 0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: '#fff' }}>
        <span style={{ fontSize: 19, fontWeight: 700 }}>Reels</span>
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
          <rect x="3" y="3" width="18" height="18" rx="5" stroke="#fff" strokeWidth="1.8" />
          <circle cx="12" cy="12" r="3.4" stroke="#fff" strokeWidth="1.8" />
        </svg>
      </div>

      <div style={{ flex: 1 }} />

      <div style={{ position: 'absolute', right: 14, bottom: 170, display: 'flex', flexDirection: 'column', gap: 20, alignItems: 'center', color: '#fff' }}>
        {rail.map(([d, n], i) => (
          <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5 }}>
            <svg width="27" height="27" viewBox="0 0 24 24" fill="none">
              <path d={d} stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span style={{ fontSize: 11.5, fontWeight: 600 }}>{n}</span>
          </div>
        ))}
      </div>

      <div style={{ position: 'relative', padding: '0 18px 8px', color: '#fff' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginBottom: 10 }}>
          <div onClick={() => nav.go('businessPage')} style={{ width: 34, height: 34, borderRadius: '50%', background: 'var(--ah-orange)', fontFamily: AH_BRAND_FONT, fontWeight: 800, fontSize: 13, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid #fff', cursor: 'pointer' }}>
            प
          </div>
          <span style={{ fontSize: 14.5, fontWeight: 700 }}>Shrestha Kirana Pasal</span>
          <span style={{ fontSize: 12, fontWeight: 700, border: '1px solid rgba(255,255,255,0.6)', borderRadius: 99, padding: '3px 11px' }}>Follow</span>
        </div>
        <div style={{ fontSize: 14, lineHeight: 1.4, opacity: 0.95, marginBottom: 14, maxWidth: 250 }}>नयाँ आएको बासमती चामल 🍚 — २५ केजी बोरा सस्तोमा।</div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 11, background: 'rgba(255,255,255,0.14)', backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.22)', borderRadius: 16, padding: '10px 12px' }}>
          <div style={{ width: 42, height: 42, borderRadius: 11, background: 'rgba(255,255,255,0.18)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 19, flexShrink: 0 }}>🍚</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 14, fontWeight: 700 }}>Basmati चामल · 25kg</div>
            <div style={{ fontSize: 13, fontWeight: 800 }}>
              रू 2,350{' '}
              <span style={{ fontSize: 11.5, fontWeight: 500, opacity: 0.7, textDecoration: 'line-through', marginLeft: 4 }}>रू 2,600</span>
            </div>
          </div>
          <div onClick={() => nav.go('order')} style={{ background: '#1B1B1F', color: '#fff', borderRadius: 99, padding: '11px 18px', fontSize: 14.5, fontWeight: 700, flexShrink: 0, cursor: 'pointer' }}>
            Order
          </div>
        </div>
      </div>
      <AHTabBar active="reels" />
    </AHScreen>
  );
}
