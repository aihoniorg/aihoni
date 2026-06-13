import { AHScreen, AHButton } from '../components/ui';
import { ImageSlot } from '../components/ImageSlot';
import { useNav } from '../nav';

// 18 · Order from reel — bottom sheet with quantity, delivery, pay-with-eSewa.
export function Order() {
  const nav = useNav();
  return (
    <AHScreen pad={false} style={{ background: '#000', position: 'relative', justifyContent: 'flex-end' }}>
      <ImageSlot placeholder="Product reel" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} />
      <div onClick={nav.back} style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.4)' }} />

      <div style={{ position: 'relative', background: '#FFFFFF', borderRadius: '26px 26px 0 0', padding: '12px 22px 38px', boxShadow: '0 -10px 40px rgba(0,0,0,0.3)' }}>
        <div style={{ width: 40, height: 5, borderRadius: 99, background: '#E2E2E2', margin: '0 auto 18px' }} />

        <div style={{ display: 'flex', alignItems: 'center', gap: 13 }}>
          <div style={{ width: 56, height: 56, borderRadius: 15, background: 'color-mix(in oklch, var(--ah-orange) 18%, white)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26, flexShrink: 0 }}>🍚</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 17, fontWeight: 700 }}>Basmati चामल · 25kg</div>
            <div style={{ fontSize: 13, color: 'var(--ah-muted)', marginTop: 1 }}>Shrestha Kirana Pasal · Lagankhel</div>
          </div>
          <div style={{ fontSize: 18, fontWeight: 800, color: 'var(--ah-orange)' }}>रू 2,350</div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 20 }}>
          <span style={{ fontSize: 15, fontWeight: 600 }}>Quantity</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, background: '#fff', borderRadius: 99, padding: '7px 16px', border: '1.5px solid var(--ah-line2)' }}>
            <span style={{ fontSize: 20, fontWeight: 600, color: 'var(--ah-muted)' }}>−</span>
            <span style={{ fontSize: 16, fontWeight: 700, minWidth: 16, textAlign: 'center' }}>1</span>
            <span style={{ fontSize: 20, fontWeight: 600, color: 'var(--ah-orange)' }}>+</span>
          </div>
        </div>

        <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 9 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 11, border: '2px solid var(--ah-orange)', background: 'color-mix(in oklch, var(--ah-orange) 12%, white)', borderRadius: 16, padding: '13px 15px' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M3 13h13V6H3zM16 9h4l1 4v3h-5M7 18.5A1.5 1.5 0 1 1 7 15.5a1.5 1.5 0 0 1 0 3zM18 18.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3z" stroke="var(--ah-orange)" strokeWidth="1.7" strokeLinejoin="round" />
            </svg>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14.5, fontWeight: 700 }}>घर डेलिभरी · Home delivery</div>
              <div style={{ fontSize: 12, color: 'var(--ah-muted)' }}>Lagankhel · ~30 min · रू 50</div>
            </div>
            <div style={{ width: 20, height: 20, borderRadius: '50%', background: 'var(--ah-orange)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="10" height="8" viewBox="0 0 12 10">
                <path d="M1 5l3.2 3.4L11 1" stroke="#fff" strokeWidth="2.4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', margin: '18px 2px 14px' }}>
          <span style={{ fontSize: 14, color: 'var(--ah-muted)', fontWeight: 600 }}>Total</span>
          <span style={{ fontSize: 22, fontWeight: 800 }}>रू 2,400</span>
        </div>
        <AHButton kind="orange">Order · eSewa बाट तिर्नुहोस्</AHButton>
      </div>
    </AHScreen>
  );
}
