import { AHScreen, AHChatInput } from '../components/ui';
import { AH_BRAND_FONT } from '../theme';
import { useNav } from '../nav';

interface Msg {
  from?: string;
  g?: string;
  c?: string;
  text?: string;
  time: string;
  self?: boolean;
  read?: boolean;
  file?: boolean;
  fileName?: string;
  fileSize?: string;
}

// 14 · Group chat — multi-sender bubbles + stacked member avatars.
export function GroupChat() {
  const nav = useNav();
  const members = [
    { g: 'रा', c: '#7AAD6A' },
    { g: 'सी', c: '#D9695A' },
    { g: 'अ', c: '#5C7AA8' },
    { g: 'लि', c: '#B07A4A' },
  ];
  const messages: Msg[] = [
    { from: 'Ram', g: 'रा', c: '#7AAD6A', text: 'भोलि बैठक छ! सबैजना आउनुस् है।', time: '10:02' },
    { from: 'Sita', g: 'सी', c: '#D9695A', text: 'हुन्छ, म आउँछु 👍', time: '10:04' },
    { from: 'Alex', g: 'अ', c: '#5C7AA8', text: 'Time confirm garnu paryo, kati baje?', time: '10:05' },
    { from: 'Ram', g: 'रा', c: '#7AAD6A', text: 'बिहान ११ बजे — Lagankhel Office', time: '10:07' },
    { self: true, text: 'Okay! म पनि हुन्छु। 🙏', time: '10:09', read: true },
    { from: 'Liam', g: 'लि', c: '#B07A4A', text: 'Can someone share the agenda doc?', time: '10:11' },
    { self: true, text: 'Sending now →', time: '10:12', read: true },
    { self: true, file: true, fileName: 'meeting-agenda.pdf', fileSize: '1.2 MB', time: '10:12', read: true },
  ];

  const dbl = (
    <svg width="14" height="8" viewBox="0 0 16 10">
      <path d="M1 5l3 3.4L9.5 2" stroke="rgba(255,255,255,0.8)" strokeWidth="1.7" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M7 5l3 3.4L15.5 2" stroke="rgba(255,255,255,0.8)" strokeWidth="1.7" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );

  return (
    <AHScreen pad={false} style={{ background: 'var(--ah-bg)' }}>
      {/* header */}
      <div style={{ padding: '58px 18px 10px', background: 'var(--ah-bg-solid)', borderBottom: '1px solid var(--ah-line)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 11 }}>
          <svg onClick={nav.back} width="22" height="22" viewBox="0 0 24 24" fill="none" style={{ cursor: 'pointer' }}>
            <path d="M14 6l-6 6 6 6" stroke="var(--ah-ink)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <div style={{ display: 'flex', marginRight: -8 }}>
            {members.map((m, i) => (
              <div
                key={i}
                style={{
                  width: 34,
                  height: 34,
                  borderRadius: '50%',
                  flexShrink: 0,
                  background: `color-mix(in oklch, ${m.c} 24%, white)`,
                  color: m.c,
                  fontFamily: AH_BRAND_FONT,
                  fontWeight: 800,
                  fontSize: 11.5,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '2px solid var(--ah-bg-solid)',
                  marginLeft: i === 0 ? 0 : -10,
                  zIndex: 4 - i,
                }}
              >
                {m.g}
              </div>
            ))}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 16, fontWeight: 700, letterSpacing: -0.2 }}>Lagankhel व्यापारी</div>
            <div style={{ fontSize: 11.5, color: 'var(--ah-muted)', marginTop: 1 }}>8 members · Tap to view</div>
          </div>
          <svg width="21" height="21" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="5" r="1.7" fill="var(--ah-ink)" />
            <circle cx="12" cy="12" r="1.7" fill="var(--ah-ink)" />
            <circle cx="12" cy="19" r="1.7" fill="var(--ah-ink)" />
          </svg>
        </div>
      </div>

      {/* messages */}
      <div className="ah-scroll" style={{ flex: 1, overflowY: 'auto', padding: '12px 14px 8px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        <div style={{ alignSelf: 'center', fontSize: 11, fontWeight: 700, color: 'var(--ah-muted)', background: 'var(--ah-bg-solid)', borderRadius: 99, padding: '4px 13px', border: '1px solid var(--ah-line)' }}>
          Today
        </div>

        {messages.map((m, i) =>
          m.self ? (
            <div key={i} style={{ alignSelf: 'flex-end', maxWidth: 270, display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 2 }}>
              {m.file ? (
                <div style={{ background: '#1B1B1F', borderRadius: '18px 18px 4px 18px', padding: '10px 13px 8px', color: '#fff' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 36, height: 36, borderRadius: 9, background: 'rgba(255,255,255,0.14)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                        <path d="M12 4v11M7 11l5 5 5-5M5 20h14" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                    <div>
                      <div style={{ fontSize: 13.5, fontWeight: 700 }}>{m.fileName}</div>
                      <div style={{ fontSize: 11, opacity: 0.65 }}>{m.fileSize}</div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 5, marginTop: 7, alignItems: 'center' }}>
                    <span style={{ fontSize: 10.5, opacity: 0.75 }}>{m.time}</span>
                    {dbl}
                  </div>
                </div>
              ) : (
                <div style={{ background: '#1B1B1F', color: '#fff', borderRadius: '18px 18px 4px 18px', padding: '10px 14px 8px' }}>
                  <div style={{ fontSize: 14.5, lineHeight: 1.4 }}>{m.text}</div>
                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 5, marginTop: 4, alignItems: 'center' }}>
                    <span style={{ fontSize: 10.5, opacity: 0.75 }}>{m.time}</span>
                    {dbl}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div key={i} style={{ alignSelf: 'flex-start', maxWidth: 285, display: 'flex', gap: 8, alignItems: 'flex-end' }}>
              <div style={{ width: 30, height: 30, borderRadius: '50%', flexShrink: 0, background: `color-mix(in oklch, ${m.c} 22%, white)`, color: m.c, fontFamily: AH_BRAND_FONT, fontWeight: 800, fontSize: 11, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {m.g}
              </div>
              <div>
                <div style={{ fontSize: 11, fontWeight: 700, color: m.c, marginBottom: 4, marginLeft: 2 }}>{m.from}</div>
                <div style={{ background: '#fff', borderRadius: '18px 18px 18px 4px', padding: '10px 14px 8px', boxShadow: '0 2px 6px -3px rgba(20,20,25,0.15)' }}>
                  <div style={{ fontSize: 14.5, lineHeight: 1.4, color: 'var(--ah-ink)' }}>{m.text}</div>
                  <div style={{ fontSize: 10.5, color: 'var(--ah-muted)', textAlign: 'right', marginTop: 4 }}>{m.time}</div>
                </div>
              </div>
            </div>
          ),
        )}
      </div>

      <AHChatInput placeholder="Message group…" />
    </AHScreen>
  );
}
