import type { ReactNode } from 'react';
import { AHScreen, AHProgress, AHTitle, AHButton } from '../components/ui';
import { useNav } from '../nav';

interface Tool {
  id: string;
  name: string;
  why: string;
  glyph: ReactNode;
  state: 'connected' | 'idle';
  who?: string;
}

// 05 · Connect your tools — Drive / Gmail / Calendar / Contacts / Photos / WhatsApp.
export function Connect() {
  const nav = useNav();
  const ink = { stroke: 'rgb(27, 27, 31)' };
  const tools: Tool[] = [
    {
      id: 'drive',
      name: 'Google Drive',
      why: 'Reads your price lists so aihoni quotes the right rate',
      glyph: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
          <path d="M9 4h6l6 10-3 6H6L0 14z" transform="translate(1.5 1)" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" style={ink} />
        </svg>
      ),
      state: 'connected',
      who: 'sunita@gmail.com',
    },
    {
      id: 'gmail',
      name: 'Gmail',
      why: 'Drafts replies to customers so you never retype',
      glyph: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
          <rect x="3" y="5" width="18" height="14" rx="2.5" stroke="currentColor" strokeWidth="1.8" style={ink} />
          <path d="M3 7l9 7 9-7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={ink} />
        </svg>
      ),
      state: 'idle',
    },
    {
      id: 'cal',
      name: 'Calendar',
      why: 'Books appointments & blocks slots automatically',
      glyph: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
          <rect x="3.5" y="5" width="17" height="15" rx="3" stroke="currentColor" strokeWidth="1.8" style={ink} />
          <path d="M3.5 10h17M8 3v4M16 3v4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" style={ink} />
        </svg>
      ),
      state: 'idle',
    },
    {
      id: 'contacts',
      name: 'Contacts',
      why: 'Knows every customer the moment they message',
      glyph: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="9" r="3.5" stroke="currentColor" strokeWidth="1.8" style={ink} />
          <path d="M5 20a7 7 0 0 1 14 0" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" style={ink} />
        </svg>
      ),
      state: 'idle',
    },
    {
      id: 'photos',
      name: 'Photos',
      why: 'Turns product shots & receipts into listings',
      glyph: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
          <rect x="3" y="4" width="18" height="16" rx="3" stroke="currentColor" strokeWidth="1.8" style={ink} />
          <circle cx="9" cy="10" r="2" stroke="currentColor" strokeWidth="1.8" />
          <path d="M21 16l-5-5-9 9" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" style={ink} />
        </svg>
      ),
      state: 'idle',
    },
    {
      id: 'whatsapp',
      name: 'WhatsApp Business',
      why: 'Pulls every customer chat into one inbox',
      glyph: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
          <path
            d="M21 11.5c0 5-4 9-9 9-1.5 0-3-.4-4.2-1L3 21l1.5-4.8C3.6 15 3 13.3 3 11.5 3 6.5 7 2.5 12 2.5s9 4 9 9z"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinejoin="round"
            style={ink}
          />
        </svg>
      ),
      state: 'idle',
    },
  ];

  const spark = (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
      <path
        d="M12 3l1.6 4.3a5 5 0 0 0 3.1 3.1L21 12l-4.3 1.6a5 5 0 0 0-3.1 3.1L12 21l-1.6-4.3a5 5 0 0 0-3.1-3.1L3 12l4.3-1.6a5 5 0 0 0 3.1-3.1z"
        fill="var(--ah-orange)"
      />
    </svg>
  );

  return (
    <AHScreen>
      <AHProgress step={2} />
      <AHTitle
        np="जोड्नुहोस् आफ्ना टूलहरू"
        en="Connect your tools"
        sub="aihoni can read what you allow — nothing more. Add now or later from Profile."
      />

      <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
        {tools.map((t) => (
          <div
            key={t.id}
            style={{
              background: '#fff',
              border: '1.5px solid rgb(239, 236, 236)',
              borderRadius: 16,
              padding: '12px 14px',
              display: 'flex',
              alignItems: 'center',
              gap: 12,
            }}
          >
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: 12,
                flexShrink: 0,
                background: 'rgb(246, 246, 246)',
                color: 'rgb(27, 27, 31)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {t.glyph}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 14.5, fontWeight: 700 }}>{t.name}</div>
              <div style={{ display: 'flex', gap: 5, alignItems: 'flex-start', marginTop: 3 }}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0, marginTop: 1.5 }}>
                  <path
                    d="M12 3l1.6 4.3a5 5 0 0 0 3.1 3.1L21 12l-4.3 1.6a5 5 0 0 0-3.1 3.1L12 21l-1.6-4.3a5 5 0 0 0-3.1-3.1L3 12l4.3-1.6a5 5 0 0 0 3.1-3.1z"
                    fill="var(--ah-orange)"
                  />
                </svg>
                <div style={{ fontSize: 11.5, lineHeight: 1.35, color: 'var(--ah-orange)', fontWeight: 600 }}>
                  {t.why}
                </div>
              </div>
              {t.who ? (
                <div style={{ fontSize: 11, color: 'var(--ah-muted)', marginTop: 2 }}>{t.who}</div>
              ) : null}
            </div>
            {t.state === 'connected' ? (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 5,
                  fontSize: 12,
                  fontWeight: 700,
                  color: '#1A8F4C',
                  background: 'color-mix(in oklch, #1A8F4C 12%, white)',
                  borderRadius: 99,
                  padding: '6px 11px',
                }}
              >
                <svg width="11" height="9" viewBox="0 0 12 10">
                  <path d="M1 5l3.2 3.4L11 1" stroke="#1A8F4C" strokeWidth="2.4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Connected
              </div>
            ) : (
              <div
                style={{
                  fontSize: 12.5,
                  background: 'rgb(246, 246, 246)',
                  color: 'rgb(27, 27, 31)',
                  fontWeight: 600,
                  borderRadius: 99,
                  padding: '7px 14px',
                }}
              >
                Connect
              </div>
            )}
          </div>
        ))}
      </div>

      <div style={{ marginTop: 14, background: 'var(--ah-bg-soft)', borderRadius: 16, padding: '13px 15px' }}>
        <div style={{ fontSize: 12.5, fontWeight: 800, marginBottom: 9, display: 'flex', alignItems: 'center', gap: 6 }}>
          {spark}
          Why connect?
        </div>
        {(
          [
            ['Auto-fill orders & bookings', 'No retyping — aihoni reads your Calendar & Contacts'],
            ['Faster, sharper answers', 'It already knows your files, emails & products'],
            ['Reply to customers in one place', 'WhatsApp & Gmail summarised for you'],
          ] as Array<[string, string]>
        ).map(([t, s]) => (
          <div key={t} style={{ display: 'flex', gap: 9, alignItems: 'flex-start', marginBottom: 8 }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0, marginTop: 1 }}>
              <circle cx="12" cy="12" r="10" fill="#1B1B1F" />
              <path d="M7.5 12.2l3 3 6-6.4" stroke="#fff" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: 12.5, fontWeight: 700, lineHeight: 1.3 }}>{t}</div>
              <div style={{ fontSize: 11.5, color: 'var(--ah-muted)', lineHeight: 1.35, marginTop: 1 }}>{s}</div>
            </div>
          </div>
        ))}
        <div
          style={{
            fontSize: 11.5,
            lineHeight: 1.4,
            color: 'var(--ah-muted)',
            marginTop: 4,
            paddingTop: 9,
            borderTop: '1px solid var(--ah-line2)',
          }}
        >
          <strong style={{ color: 'var(--ah-ink)' }}>सुरक्षित।</strong> aihoni reads only what you allow, and personal stays separate from your businesses.
        </div>
      </div>

      <div style={{ flex: 1 }} />
      <AHButton kind="primary" onClick={nav.next}>
        Continue
      </AHButton>
      <AHButton kind="ghost" onClick={nav.next}>
        Skip — I'll connect later
      </AHButton>
    </AHScreen>
  );
}
