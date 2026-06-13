import { AHScreen, AHButton } from '../components/ui';
import { AH_BRAND_FONT } from '../theme';
import { useNav } from '../nav';

interface Service {
  t: string;
  np: string;
  d: string;
  color: string;
  status: string;
  on: boolean;
  ai?: boolean;
  aiLabel?: boolean;
}

// 09 · Business dashboard — switch business + connect services.
export function BusinessDashboard() {
  const nav = useNav();
  const businesses: Array<[string, string, boolean, string]> = [
    ['श', 'Shrestha Kirana', true, 'var(--ah-orange)'],
    ['दि', 'Didi Fashion', false, '#8B5CF6'],
    ['मे', 'Megha Pharmacy', false, '#2E9E6B'],
  ];

  const services: Service[] = [
    { t: 'Connect tools', np: 'MCP · POS, stock', d: 'M3 5h18v6H3zM3 14h18v5H3M7 8h.01M7 16.5h.01', color: 'var(--ah-blue)', status: '2 servers', on: true, ai: true },
    { t: 'Teach aihoni', np: '5 sources added', d: 'M12 4l9 4-9 4-9-4 9-4zM5 11v4c0 1.6 3.1 2.8 7 2.8s7-1.2 7-2.8v-4', color: 'var(--ah-orange)', status: '5 sources', on: true, aiLabel: true },
    { t: 'SMS Gateway', np: 'Sparrow · Go Live', d: 'M4 5h16v11H9l-4 4z', color: '#2E9E6B', status: 'Connect', on: false },
    { t: 'Social media', np: 'FB · Insta · TikTok', d: 'M18 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM6 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM18 22a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM8.6 13.5l6.8 4M15.4 6.5l-6.8 4', color: '#3A6FE0', status: '3 linked', on: true },
    { t: 'Payments', np: 'eSewa · Khalti', d: 'M3 7h18v12H3zM3 11h18M16 15h2', color: '#D9695A', status: 'Connect', on: false },
  ];

  const aiBadge = (bg: string) => (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 2,
        fontSize: 8,
        fontWeight: 800,
        color: '#fff',
        background: bg,
        borderRadius: 99,
        padding: '2px 5px 2px 4px',
        flexShrink: 0,
      }}
    >
      <svg width="8" height="8" viewBox="0 0 24 24">
        <path d="M12 3l1.6 4.3a5 5 0 0 0 3.1 3.1L21 12l-4.3 1.6a5 5 0 0 0-3.1 3.1L12 21l-1.6-4.3a5 5 0 0 0-3.1-3.1L3 12l4.3-1.6a5 5 0 0 0 3.1-3.1z" fill="#fff" />
      </svg>
      AI
    </span>
  );

  return (
    <AHScreen pad={false} style={{ background: 'var(--ah-bg-pattern2)' }}>
      <div
        className="ah-scroll"
        style={{
          flex: 1,
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          padding: '54px 18px 0',
        }}
      >
        {/* identity + quick-switch */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div
            style={{
              width: 50,
              height: 50,
              borderRadius: 15,
              background: 'var(--ah-orange)',
              color: '#fff',
              fontFamily: AH_BRAND_FONT,
              fontWeight: 700,
              fontSize: 22,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            श
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ fontSize: 18, fontWeight: 700, letterSpacing: -0.3, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                Shrestha Kirana
              </span>
              <svg width="13" height="13" viewBox="0 0 24 24" style={{ flexShrink: 0 }}>
                <path d="M6 9l6 6 6-6" stroke="var(--ah-muted)" strokeWidth="2.4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <div style={{ fontSize: 12, color: 'var(--ah-muted)', marginTop: 1 }}>किराना · Grocery · Lagankhel</div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', paddingLeft: 8 }}>
            {businesses
              .filter(([, , active]) => !active)
              .map(([g, , , c], i) => (
                <div
                  key={i}
                  title="Switch business"
                  style={{
                    width: 34,
                    height: 34,
                    borderRadius: '50%',
                    background: c,
                    color: '#fff',
                    fontFamily: AH_BRAND_FONT,
                    fontWeight: 700,
                    fontSize: 13,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: '2px solid var(--ah-bg-soft)',
                    marginLeft: -8,
                  }}
                >
                  {g}
                </div>
              ))}
            <div
              title="Add business"
              style={{
                width: 34,
                height: 34,
                borderRadius: '50%',
                background: '#fff',
                border: '1.5px dashed var(--ah-line2)',
                color: 'var(--ah-muted)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginLeft: -8,
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24">
                <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
              </svg>
            </div>
          </div>
        </div>

        {/* setup progress hero */}
        <div style={{ marginTop: 14, borderRadius: 20, background: '#1B1B1F', color: '#fff', padding: '16px 17px', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', right: -28, top: -36, width: 130, height: 130, borderRadius: '50%', background: 'var(--ah-orange)', opacity: 0.4, filter: 'blur(34px)' }} />
          <div style={{ position: 'relative', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 12 }}>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: 0.7, textTransform: 'uppercase', color: 'rgba(255,255,255,0.55)' }}>Setup · सेटअप</div>
              <div style={{ fontSize: 17, fontWeight: 700, letterSpacing: -0.3, marginTop: 4, lineHeight: 1.15 }}>Connect 3 more to go live</div>
            </div>
            <div style={{ textAlign: 'right', lineHeight: 1, flexShrink: 0 }}>
              <span style={{ fontSize: 28, fontWeight: 800 }}>50</span>
              <span style={{ fontSize: 14, fontWeight: 700, opacity: 0.6 }}>%</span>
            </div>
          </div>
          <div style={{ position: 'relative', display: 'flex', gap: 5, marginTop: 14 }}>
            {services.map((s, i) => (
              <div key={i} style={{ flex: 1, height: 6, borderRadius: 99, background: s.on ? 'var(--ah-orange)' : 'rgba(255,255,255,0.16)' }} />
            ))}
          </div>
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: 6, marginTop: 10, fontSize: 11.5, fontWeight: 600, color: 'rgba(255,255,255,0.7)' }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#2E9E6B' }} />
            3 of 6 connected · 5 sources taught
          </div>
        </div>

        {/* connections */}
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', margin: '17px 2px 9px' }}>
          <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--ah-muted)' }}>Connections</span>
          <span style={{ fontSize: 11.5, fontWeight: 600, color: 'var(--ah-faint)' }}>जडानहरू</span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 9 }}>
          {services.map((s) => {
            const live = s.on;
            const isConnect = s.status === 'Connect';
            return (
              <div
                key={s.t}
                style={{
                  background: '#fff',
                  border: live ? '1.5px solid color-mix(in oklch, #2E9E6B 30%, white)' : '1.5px solid var(--ah-line)',
                  borderRadius: 16,
                  padding: '12px 12px 11px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                }}
              >
                <div
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 11,
                    flexShrink: 0,
                    background: `color-mix(in oklch, ${s.color} 13%, white)`,
                    color: s.color,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <svg width="19" height="19" viewBox="0 0 24 24" fill="none">
                    <path d={s.d} stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 5, flexWrap: 'wrap' }}>
                    <span style={{ fontSize: 13, fontWeight: 700, letterSpacing: -0.2 }}>{s.t}</span>
                    {s.ai && aiBadge('var(--ah-blue)')}
                    {s.aiLabel && aiBadge('var(--ah-orange)')}
                  </div>
                  <div
                    style={{
                      fontSize: 11,
                      color: live ? '#2E9E6B' : isConnect ? 'var(--ah-faint)' : 'var(--ah-muted)',
                      marginTop: 2,
                      fontWeight: 600,
                    }}
                  >
                    {live ? '● ' + s.status : s.status}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* SMS providers */}
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', margin: '17px 2px 9px' }}>
          <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--ah-muted)' }}>SMS providers</span>
          <span style={{ fontSize: 11.5, fontWeight: 600, color: 'var(--ah-faint)' }}>OTP · alerts</span>
        </div>
        <div className="ah-hscroll" style={{ display: 'flex', gap: 9, overflowX: 'auto', margin: '0 -18px', padding: '0 18px 2px' }}>
          {(
            [
              ['GL', 'Go Live', '#E8572F', true],
              ['AK', 'Akash SMS', '#3A6FE0', false],
              ['SP', 'Sparrow SMS', '#2E9E6B', false],
            ] as Array<[string, string, string, boolean]>
          ).map(([g, name, c, on]) => (
            <div
              key={name}
              style={{
                flex: '0 0 auto',
                width: 132,
                background: '#fff',
                border: on ? '2px solid #1B1B1F' : '1.5px solid var(--ah-line2)',
                borderRadius: 14,
                padding: '11px 12px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: 9,
                    background: `color-mix(in oklch, ${c} 14%, white)`,
                    color: c,
                    fontFamily: AH_BRAND_FONT,
                    fontWeight: 800,
                    fontSize: 12.5,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {g}
                </div>
                {on ? (
                  <span style={{ display: 'flex', alignItems: 'center', gap: 3, fontSize: 10.5, fontWeight: 700, color: '#2E9E6B' }}>
                    <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#2E9E6B' }} />
                    Live
                  </span>
                ) : (
                  <span style={{ fontSize: 10.5, fontWeight: 700, color: 'var(--ah-faint)' }}>Connect</span>
                )}
              </div>
              <div style={{ fontSize: 13, fontWeight: 700, marginTop: 9 }}>{name}</div>
              <div style={{ fontSize: 10.5, color: 'var(--ah-muted)', marginTop: 1 }}>API key · test SMS</div>
            </div>
          ))}
        </div>

        <div style={{ minHeight: 12 }} />
      </div>

      <div style={{ padding: '12px 18px 26px', background: 'var(--ah-bg-soft)' }}>
        <AHButton kind="primary" onClick={nav.next}>
          Continue
        </AHButton>
      </div>
    </AHScreen>
  );
}
