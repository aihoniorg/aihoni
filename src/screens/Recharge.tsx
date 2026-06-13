import { useState } from 'react';
import { AHScreen, AHButton, AHCoin } from '../components/ui';
import { AH_BRAND_FONT } from '../theme';
import { useNav } from '../nav';

interface Pack {
  pts: string;
  price: string;
  bonus?: string;
  popular?: boolean;
}

// 21 · Recharge points — TikTok-style coin packs + Nepali gateways.
export function Recharge() {
  const nav = useNav();
  const [pack, setPack] = useState(2);
  const [method, setMethod] = useState('esewa');
  const packs: Pack[] = [
    { pts: '100', price: '100' },
    { pts: '500', price: '500', bonus: '+20' },
    { pts: '1,000', price: '1,000', bonus: '+50', popular: true },
    { pts: '2,500', price: '2,500', bonus: '+200' },
    { pts: '6,000', price: '6,000', bonus: '+600' },
    { pts: '12,000', price: '12,000', bonus: '+1,500' },
  ];

  const methods = [
    { id: 'esewa', name: 'eSewa', sub: '...4821', c: '#5BB12F', g: 'e' },
    { id: 'khalti', name: 'Khalti', sub: 'Wallet', c: '#5C2D91', g: 'K' },
    { id: 'ime', name: 'IME Pay', sub: 'Wallet', c: '#C0392B', g: 'I' },
    { id: 'connectips', name: 'ConnectIPS', sub: 'Bank', c: '#1A6FB5', g: 'C' },
  ];

  const sel = packs[pack];

  return (
    <AHScreen pad={false}>
      {/* header */}
      <div style={{ padding: '56px 18px 10px', display: 'flex', alignItems: 'center', gap: 12 }}>
        <svg onClick={nav.back} width="22" height="22" viewBox="0 0 24 24" fill="none" style={{ cursor: 'pointer' }}>
          <path d="M14 6l-6 6 6 6" stroke="var(--ah-ink)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <div style={{ flex: 1, fontSize: 18, fontWeight: 700 }}>Recharge points</div>
        <div style={{ fontSize: 12.5, fontWeight: 700, color: 'var(--ah-muted)' }}>History</div>
      </div>

      <div className="ah-scroll" style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', padding: '0 18px' }}>
        {/* balance card */}
        <div style={{ borderRadius: 20, background: '#1B1B1F', color: '#fff', padding: '16px 18px', display: 'flex', alignItems: 'center', gap: 13, position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', right: -28, top: -28, width: 120, height: 120, borderRadius: '50%', background: 'var(--ah-orange)', opacity: 0.5, filter: 'blur(30px)' }} />
          <AHCoin size={38} />
          <div style={{ flex: 1, position: 'relative' }}>
            <div style={{ fontSize: 12.5, opacity: 0.7 }}>Current balance</div>
            <div style={{ fontSize: 24, fontWeight: 800, letterSpacing: -0.5, marginTop: 1 }}>
              2,480 <span style={{ fontSize: 13, fontWeight: 600, opacity: 0.7 }}>pts</span>
            </div>
          </div>
          <div style={{ position: 'relative', fontSize: 11.5, fontWeight: 700, background: 'rgba(255,255,255,0.16)', borderRadius: 99, padding: '6px 12px' }}>≈ रू 2,480</div>
        </div>

        {/* pack grid */}
        <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--ah-muted)', margin: '16px 2px 9px' }}>Choose a pack</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 9 }}>
          {packs.map((p, i) => {
            const on = i === pack;
            return (
              <div
                key={i}
                onClick={() => setPack(i)}
                style={{
                  position: 'relative',
                  borderRadius: 16,
                  padding: '14px 6px 11px',
                  background: on ? 'var(--ah-bg-soft)' : '#fff',
                  border: on ? '2px solid #1B1B1F' : '2px solid var(--ah-line2)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 5,
                  cursor: 'pointer',
                }}
              >
                {p.popular && (
                  <span style={{ position: 'absolute', top: -9, left: '50%', transform: 'translateX(-50%)', fontSize: 9, fontWeight: 800, color: '#fff', background: 'var(--ah-orange)', borderRadius: 99, padding: '2px 8px', whiteSpace: 'nowrap' }}>
                    POPULAR
                  </span>
                )}
                <AHCoin size={26} />
                <div style={{ fontSize: 15, fontWeight: 800, letterSpacing: -0.3 }}>{p.pts}</div>
                {p.bonus ? (
                  <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--ah-orange)' }}>{p.bonus} bonus</div>
                ) : (
                  <div style={{ fontSize: 10, fontWeight: 600, color: 'var(--ah-faint)' }}>points</div>
                )}
                <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--ah-ink)', marginTop: 2 }}>रू {p.price}</div>
              </div>
            );
          })}
        </div>

        {/* payment method */}
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', margin: '16px 2px 9px' }}>
          <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--ah-muted)' }}>Pay with</span>
          <span style={{ fontSize: 11.5, fontWeight: 600, color: 'var(--ah-faint)' }}>Nepali gateways</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {methods.map((m) => {
            const on = m.id === method;
            return (
              <div
                key={m.id}
                onClick={() => setMethod(m.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  padding: '9px 13px',
                  borderRadius: 14,
                  cursor: 'pointer',
                  background: '#fff',
                  border: on ? '2px solid #1B1B1F' : '2px solid var(--ah-line2)',
                }}
              >
                <div
                  style={{
                    width: 56,
                    height: 34,
                    borderRadius: 8,
                    flexShrink: 0,
                    background: `color-mix(in oklch, ${m.c} 14%, white)`,
                    color: m.c,
                    fontFamily: AH_BRAND_FONT,
                    fontWeight: 800,
                    fontSize: 18,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {m.g}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, fontWeight: 700 }}>{m.name}</div>
                  <div style={{ fontSize: 11.5, color: 'var(--ah-muted)', marginTop: 1 }}>{m.sub}</div>
                </div>
                <div style={{ width: 20, height: 20, borderRadius: '50%', flexShrink: 0, border: on ? 'none' : '2px solid var(--ah-line2)', background: on ? '#1B1B1F' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {on && (
                    <svg width="10" height="8" viewBox="0 0 12 10">
                      <path d="M1 5l3.2 3.4L11 1" stroke="#fff" strokeWidth="2.4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </div>
              </div>
            );
          })}
        </div>
        <div style={{ minHeight: 14 }} />
      </div>

      {/* footer pay bar */}
      <div style={{ padding: '12px 18px 26px', borderTop: '1px solid var(--ah-line)', display: 'flex', alignItems: 'center', gap: 14, background: '#fff' }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 11.5, color: 'var(--ah-muted)' }}>
            {sel.pts}
            {sel.bonus ? ` ${sel.bonus}` : ''} points
          </div>
          <div style={{ fontSize: 21, fontWeight: 800, letterSpacing: -0.5 }}>रू {sel.price}</div>
        </div>
        <div style={{ flex: '0 0 auto' }}>
          <AHButton kind="primary" style={{ padding: '0 26px' }}>
            Recharge now
          </AHButton>
        </div>
      </div>
    </AHScreen>
  );
}
