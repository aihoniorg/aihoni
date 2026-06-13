import { AHScreen, AHTabBar, AHCoin } from '../components/ui';
import { AH_BRAND_FONT } from '../theme';
import { useNav } from '../nav';

// 20 · Profile — identity, wallets carousel, businesses, settings.
export function Profile() {
  const nav = useNav();
  const menu: Array<[string, string, string]> = [
    ['Personal information', 'Name, mobile, district', 'M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM5 20a7 7 0 0 1 14 0'],
    ['Payment & recharge', 'eSewa, Khalti, IME Pay', 'M3 7h18v12H3zM3 11h18M16 15h2'],
    ['Language', 'नेपाली · English', 'M4 5h16M9 5c0 6-2.5 10-5 12M7 9c1 3 4 5 8 6'],
    ['Privacy & data', 'Personal and business kept separate', 'M12 3l7 3v6c0 4-3 7-7 8-4-1-7-4-7-8V6z'],
  ];

  return (
    <AHScreen pad={false}>
      <div className="ah-scroll" style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', padding: '58px 20px 0' }}>
        {/* profile header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{ width: 60, height: 60, borderRadius: '50%', border: '2.5px solid var(--ah-orange)', padding: 2, boxSizing: 'border-box' }}>
            <div style={{ width: '100%', height: '100%', borderRadius: '50%', background: 'color-mix(in oklch, var(--ah-orange) 22%, white)', color: 'var(--ah-orange)', fontFamily: AH_BRAND_FONT, fontWeight: 800, fontSize: 22, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              S
            </div>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 20, fontWeight: 700, letterSpacing: -0.3 }}>Sunita Shrestha</div>
            <div style={{ fontSize: 13, color: 'var(--ah-muted)', marginTop: 1 }}>+977 98XXXXXXXX · Lalitpur</div>
          </div>
          <div style={{ fontSize: 12.5, fontWeight: 700, color: 'var(--ah-orange)', background: 'color-mix(in oklch, var(--ah-orange) 14%, white)', borderRadius: 99, padding: '7px 14px' }}>Edit</div>
        </div>

        {/* wallets */}
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', margin: '20px 2px 9px' }}>
          <span style={{ fontSize: 15, fontWeight: 700 }}>Wallets</span>
          <span style={{ fontSize: 12.5, fontWeight: 700, color: 'var(--ah-orange)' }}>+ Add wallet</span>
        </div>
        <div className="ah-wscroll" style={{ display: 'flex', gap: 12, overflowX: 'auto', overflowY: 'hidden', margin: '0 -20px', padding: '0 20px 4px' }}>
          {/* default wallet */}
          <div style={{ flex: '0 0 auto', width: 286, borderRadius: 22, background: '#fff', padding: '16px 18px', boxShadow: '0 12px 28px -16px rgba(20,20,25,0.28)', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: -40, right: -30, width: 130, height: 130, borderRadius: '50%', background: 'var(--ah-orange)', opacity: 0.1, filter: 'blur(20px)', pointerEvents: 'none' }} />
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                <AHCoin size={20} />
                <span style={{ fontSize: 13, color: 'var(--ah-muted)', fontWeight: 600 }}>aihoni Points</span>
              </div>
              <span style={{ fontSize: 10.5, fontWeight: 800, color: 'var(--ah-orange)', background: 'color-mix(in oklch, var(--ah-orange) 14%, white)', borderRadius: 99, padding: '4px 9px', letterSpacing: 0.3 }}>
                DEFAULT
              </span>
            </div>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: 6, marginTop: 9 }}>
              <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--ah-faint)', letterSpacing: 0.3 }}>Wallet ID</span>
              <span style={{ fontSize: 12, fontWeight: 700, fontFamily: 'ui-monospace, monospace', color: 'var(--ah-ink)' }}>AIH-2480-SNT</span>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
                <rect x="9" y="9" width="11" height="11" rx="2.5" stroke="var(--ah-faint)" strokeWidth="1.8" />
                <path d="M5 15V5h10" stroke="var(--ah-faint)" strokeWidth="1.8" strokeLinecap="round" />
              </svg>
            </div>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'flex-end', gap: 8, marginTop: 8 }}>
              <span style={{ fontSize: 38, fontWeight: 800, letterSpacing: -1, lineHeight: 0.9 }}>2,480</span>
              <span style={{ fontSize: 13, color: 'var(--ah-muted)', fontWeight: 600, marginBottom: 5 }}>pts</span>
            </div>
            <div style={{ position: 'relative', marginTop: 13, height: 6, borderRadius: 99, background: 'var(--ah-line)', overflow: 'hidden' }}>
              <div style={{ width: '62%', height: '100%', borderRadius: 99, background: 'linear-gradient(90deg, color-mix(in oklch, var(--ah-orange) 55%, white), var(--ah-orange))' }} />
            </div>
            <div style={{ position: 'relative', display: 'flex', justifyContent: 'space-between', marginTop: 7, fontSize: 11.5, color: 'var(--ah-muted)' }}>
              <span>~620 questions left</span>
              <span>4 pts / answer</span>
            </div>
            <div
              onClick={() => nav.go('recharge')}
              style={{ position: 'relative', marginTop: 13, height: 42, borderRadius: 99, background: '#1B1B1F', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, fontSize: 14, fontWeight: 700, cursor: 'pointer' }}
            >
              <AHCoin size={17} /> Recharge points
            </div>
          </div>

          {/* business wallet */}
          <div style={{ flex: '0 0 auto', width: 224, borderRadius: 22, background: '#fff', padding: '16px 18px', border: '1.5px solid var(--ah-line)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
              <div style={{ width: 22, height: 22, borderRadius: '50%', background: 'color-mix(in oklch, #3A6FE0 16%, white)', color: '#3A6FE0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: AH_BRAND_FONT, fontWeight: 800, fontSize: 11 }}>
                श
              </div>
              <span style={{ fontSize: 13, color: 'var(--ah-muted)', fontWeight: 600 }}>Shrestha Kirana</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 9 }}>
              <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--ah-faint)', letterSpacing: 0.3 }}>Wallet ID</span>
              <span style={{ fontSize: 12, fontWeight: 700, fontFamily: 'ui-monospace, monospace' }}>AIH-0940-SKP</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8, marginTop: 8 }}>
              <span style={{ fontSize: 32, fontWeight: 800, letterSpacing: -0.8, lineHeight: 0.9 }}>940</span>
              <span style={{ fontSize: 12, color: 'var(--ah-muted)', fontWeight: 600, marginBottom: 4 }}>pts</span>
            </div>
            <div style={{ marginTop: 14, height: 38, borderRadius: 99, border: '1.5px solid var(--ah-line2)', color: 'var(--ah-ink)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7, fontSize: 13.5, fontWeight: 700 }}>
              Top up
            </div>
          </div>

          {/* add wallet */}
          <div style={{ flex: '0 0 auto', width: 130, borderRadius: 22, border: '1.5px dashed var(--ah-line2)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 9, color: 'var(--ah-muted)' }}>
            <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'var(--ah-bg-soft)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="18" height="18" viewBox="0 0 24 24">
                <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
              </svg>
            </div>
            <span style={{ fontSize: 12.5, fontWeight: 700 }}>Add wallet</span>
          </div>
        </div>

        {/* your businesses */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', margin: '20px 2px 10px' }}>
          <span style={{ fontSize: 15, fontWeight: 700 }}>Your businesses</span>
          <span style={{ fontSize: 12.5, fontWeight: 700, color: 'var(--ah-orange)' }}>+ Add</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
          {(
            [
              ['प', 'Shrestha Kirana Pasal', '142 products · Lagankhel'],
              ['कप', 'Sunita Fashion', '38 products · Pulchowk'],
            ] as Array<[string, string, string]>
          ).map(([g, n, s]) => (
            <div key={n} onClick={() => nav.go('businessPage')} style={{ display: 'flex', alignItems: 'center', gap: 13, padding: '6px 2px', cursor: 'pointer' }}>
              <div style={{ width: 44, height: 44, borderRadius: 13, background: '#fff', color: 'var(--ah-orange)', fontFamily: AH_BRAND_FONT, fontWeight: 800, fontSize: 15, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, boxShadow: '0 2px 8px -4px rgba(20,20,25,0.18)' }}>
                {g}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14.5, fontWeight: 700 }}>{n}</div>
                <div style={{ fontSize: 12, color: 'var(--ah-muted)', marginTop: 1 }}>{s}</div>
              </div>
              <svg width="8" height="13" viewBox="0 0 8 14">
                <path d="M1 1l5.5 6L1 13" stroke="#C2B49A" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          ))}
        </div>

        {/* settings menu */}
        <div style={{ marginTop: 14, borderRadius: 20, background: '#fff', overflow: 'hidden', boxShadow: '0 4px 14px -10px rgba(20,20,25,0.22)' }}>
          {menu.map(([t, s, d], i) => (
            <div key={t} style={{ display: 'flex', alignItems: 'center', gap: 13, padding: '12px 15px', borderTop: i ? '1px solid var(--ah-line)' : 'none' }}>
              <div style={{ width: 36, height: 36, borderRadius: 11, background: 'color-mix(in oklch, var(--ah-orange) 13%, white)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path d={d} stroke="var(--ah-orange)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14.5, fontWeight: 600 }}>{t}</div>
                <div style={{ fontSize: 12, color: 'var(--ah-muted)', marginTop: 1 }}>{s}</div>
              </div>
              <svg width="7" height="12" viewBox="0 0 8 14">
                <path d="M1 1l5.5 6L1 13" stroke="#C2B49A" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          ))}
        </div>
        <div style={{ minHeight: 16 }} />
      </div>
      <AHTabBar active="profile" />
    </AHScreen>
  );
}
