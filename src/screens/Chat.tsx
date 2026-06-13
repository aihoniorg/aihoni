import { AHScreen, AHChatInput, AHOrb } from '../components/ui';
import { AH_BRAND_FONT } from '../theme';
import { useNav } from '../nav';

// 15 · Chat with aihoni — voice-ask hero + conversation + contextual actions.
export function Chat() {
  const nav = useNav();
  const dbl = (col = 'rgba(255,255,255,0.85)') => (
    <svg width="14" height="8" viewBox="0 0 16 10" style={{ flexShrink: 0 }}>
      <path d="M1 5l3 3.4L9.5 2" stroke={col} strokeWidth="1.7" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M7 5l3 3.4L15.5 2" stroke={col} strokeWidth="1.7" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );

  const pattern = {
    background:
      'radial-gradient(circle at 10% 20%, rgba(20,20,25,0.035) 0 1.2px, transparent 1.3px) 0 0/22px 22px, radial-gradient(circle at 60% 70%, rgba(20,20,25,0.03) 0 1px, transparent 1.1px) 0 0/30px 30px, #FFFFFF',
  };

  const actions = [
    { id: 'order', label: 'Order', active: true, d: 'M3 5h2l2 11h10l2-8H6M9 20.5A1.3 1.3 0 1 0 9 18a1.3 1.3 0 0 0 0 2.5zM17 20.5a1.3 1.3 0 1 0 0-2.5 1.3 1.3 0 0 0 0 2.5z' },
    { id: 'booking', label: 'Booking', d: 'M4 6h16v15H4zM4 11h16M9 4v4M15 4v4' },
    { id: 'appt', label: 'Appoint', d: 'M12 8v4l3 2M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18z' },
    { id: 'call', label: 'Call', d: 'M4 5c0-1 1-2 2-2h2l2 4-2 1.5c1 3 3 5 6 6L15.5 13l4 2v2c0 1-1 2-2 2-7.2 0-13-5.8-13-13z' },
    { id: 'msg', label: 'Message', d: 'M21 11.5a8 8 0 0 1-11.6 7.1L3 21l1.4-4.4A8 8 0 1 1 21 11.5z' },
  ];

  return (
    <AHScreen pad={false} style={{ background: 'var(--ah-bg)' }}>
      {/* header */}
      <div style={{ padding: '58px 18px 12px', display: 'flex', alignItems: 'center', gap: 11, background: '#FFFFFF' }}>
        <svg onClick={nav.back} width="22" height="22" viewBox="0 0 24 24" fill="none" style={{ cursor: 'pointer' }}>
          <path d="M14 6l-6 6 6 6" stroke="var(--ah-ink)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <div style={{ flexShrink: 0 }}>
          <AHOrb size={42} />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontFamily: AH_BRAND_FONT, fontSize: 17.5, fontWeight: 800, lineHeight: 1 }}>
            aihoni<span style={{ color: 'var(--ah-orange)' }}>.</span>
          </div>
          <div style={{ fontSize: 11.5, color: 'var(--ah-orange)', fontWeight: 700, marginTop: 3, display: 'flex', alignItems: 'center', gap: 4 }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--ah-orange)' }} />
            सबै पसल · Any business
          </div>
        </div>
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
          <path d="M11 5h2v14h-2zM5 9h2v6H5zM17 9h2v6h-2z" fill="var(--ah-ink)" />
        </svg>
        <svg width="20" height="20" viewBox="0 0 24 24">
          <circle cx="12" cy="5" r="1.7" fill="var(--ah-ink)" />
          <circle cx="12" cy="12" r="1.7" fill="var(--ah-ink)" />
          <circle cx="12" cy="19" r="1.7" fill="var(--ah-ink)" />
        </svg>
      </div>

      {/* voice-ask hero */}
      <div style={{ margin: '10px 16px 0', borderRadius: 22, background: '#1B1B1F', color: '#fff', padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 13, position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', right: -30, top: -30, width: 130, height: 130, borderRadius: '50%', background: 'var(--ah-orange)', opacity: 0.5, filter: 'blur(28px)' }} />
        <AHOrb size={46} />
        <div style={{ flex: 1, position: 'relative' }}>
          <div style={{ fontSize: 15.5, fontWeight: 700 }}>केहि सोध्नुहोस्…</div>
          <div style={{ fontSize: 12, opacity: 0.65, marginTop: 2 }}>Hold to speak · or type</div>
        </div>
        <div style={{ width: 38, height: 38, borderRadius: '50%', background: 'rgba(255,255,255,0.14)', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
          <svg width="16" height="16" viewBox="0 0 24 24">
            <rect x="9" y="3" width="6" height="11" rx="3" fill="#fff" />
            <path d="M6 11.5a6 6 0 0 0 12 0M12 17.5V21" stroke="#fff" strokeWidth="2" strokeLinecap="round" fill="none" />
          </svg>
        </div>
      </div>

      {/* messages */}
      <div className="ah-scroll" style={{ flex: 1, padding: '12px 16px 8px', display: 'flex', flexDirection: 'column', gap: 9, overflowY: 'auto', ...pattern }}>
        <div style={{ alignSelf: 'flex-start', maxWidth: 280, background: '#fff', borderRadius: '20px 20px 20px 6px', padding: '10px 15px 7px', boxShadow: '0 2px 6px -3px rgba(20,20,25,0.18)' }}>
          <div style={{ fontSize: 14.5, lineHeight: 1.4 }}>नमस्ते Sunita! आज के सोध्न चाहनुहुन्छ?</div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 3 }}>
            <span style={{ fontSize: 10.5, color: 'var(--ah-muted)' }}>10:12</span>
          </div>
        </div>

        <div style={{ alignSelf: 'flex-end', maxWidth: 270 }}>
          <div style={{ background: '#1B1B1F', color: '#fff', borderRadius: '20px 20px 6px 20px', padding: '9px 14px 7px' }}>
            <div style={{ fontSize: 14.5, lineHeight: 1.4 }}>Shrestha Kirana मा बासमती चामल छ?</div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 5, marginTop: 3, alignItems: 'center' }}>
              <span style={{ fontSize: 10.5, opacity: 0.85 }}>10:14</span>
              {dbl()}
            </div>
          </div>
        </div>

        <div style={{ alignSelf: 'flex-start', maxWidth: 295 }}>
          <div style={{ background: '#fff', borderRadius: '20px 20px 20px 6px', padding: '10px 15px 8px', boxShadow: '0 2px 6px -3px rgba(20,20,25,0.18)' }}>
            <div style={{ fontSize: 14.5, lineHeight: 1.45 }}>
              हो! <strong>बासमती चामल · २५ केजी</strong> — रू 2,350 मा उपलब्ध छ। डेलिभरी पनि हुन्छ।
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 2 }}>
              <span style={{ fontSize: 10.5, color: 'var(--ah-muted)' }}>10:14</span>
            </div>
          </div>
        </div>

        {/* contextual quick actions */}
        <div style={{ alignSelf: 'flex-start', maxWidth: 300 }}>
          <div style={{ fontSize: 10.5, fontWeight: 700, color: 'var(--ah-muted)', letterSpacing: 0.2, margin: '0 2px 6px', display: 'flex', alignItems: 'center', gap: 5 }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--ah-orange)' }} />
            यो व्यापारको लागि · suggested
          </div>
          <div style={{ display: 'flex', gap: 7, flexWrap: 'wrap' }}>
            {actions.map((a) => (
              <div
                key={a.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  padding: '7px 12px',
                  borderRadius: 99,
                  background: a.active ? '#1B1B1F' : '#fff',
                  color: a.active ? '#fff' : 'var(--ah-ink)',
                  border: a.active ? '1.5px solid #1B1B1F' : '1.5px solid var(--ah-line2)',
                  boxShadow: a.active ? '0 6px 14px -8px rgba(20,20,25,0.35)' : '0 2px 6px -4px rgba(20,20,25,0.15)',
                }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                  <path d={a.d} stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span style={{ fontSize: 12.5, fontWeight: 700 }}>{a.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* inline order form */}
        <div style={{ alignSelf: 'flex-start', width: 290, background: '#fff', borderRadius: 18, padding: '13px 14px', boxShadow: '0 8px 22px -12px rgba(20,20,25,0.3)', border: '1px solid var(--ah-line)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 11 }}>
            <div style={{ width: 30, height: 30, borderRadius: 9, background: 'var(--ah-orange-soft)', color: 'var(--ah-orange)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M3 5h2l2 11h10l2-8H6M9 20.5A1.3 1.3 0 1 0 9 18a1.3 1.3 0 0 0 0 2.5zM17 20.5a1.3 1.3 0 1 0 0-2.5 1.3 1.3 0 0 0 0 2.5z" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: 800 }}>अर्डर · Order</div>
              <div style={{ fontSize: 11, color: 'var(--ah-muted)' }}>बासमती चामल · 25kg</div>
            </div>
            <span style={{ fontSize: 14, fontWeight: 800, color: 'var(--ah-orange)' }}>रू 2,350</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 9 }}>
            <span style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--ah-muted)' }}>Quantity</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, background: 'var(--ah-bg-soft)', borderRadius: 99, padding: '5px 14px' }}>
              <span style={{ fontSize: 17, fontWeight: 700, color: 'var(--ah-muted)' }}>−</span>
              <span style={{ fontSize: 14, fontWeight: 800, minWidth: 14, textAlign: 'center' }}>1</span>
              <span style={{ fontSize: 17, fontWeight: 700, color: 'var(--ah-orange)' }}>+</span>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'var(--ah-orange-soft)', borderRadius: 12, padding: '8px 11px', marginBottom: 11 }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M3 13h13V6H3zM16 9h4l1 4v3h-5" stroke="var(--ah-orange)" strokeWidth="1.7" strokeLinejoin="round" />
              <circle cx="7" cy="17" r="1.5" stroke="var(--ah-orange)" strokeWidth="1.6" />
              <circle cx="18" cy="17" r="1.5" stroke="var(--ah-orange)" strokeWidth="1.6" />
            </svg>
            <span style={{ flex: 1, fontSize: 12.5, fontWeight: 600 }}>घर डेलिभरी · Lagankhel</span>
            <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--ah-orange)' }}>रू 50</span>
          </div>
          <div style={{ height: 42, borderRadius: 99, background: '#1B1B1F', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7, fontSize: 14, fontWeight: 700 }}>
            Confirm order · रू 2,400
          </div>
        </div>
      </div>

      <AHChatInput placeholder="Type or speak…" />
    </AHScreen>
  );
}
