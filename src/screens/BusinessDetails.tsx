import { AHScreen, AHProgress, AHTitle, AHField, AHButton, AHOrb } from '../components/ui';
import { useNav } from '../nav';

// Map location picker — stylised map + pin, reads back lat/long.
function AHMapPicker() {
  return (
    <div
      style={{
        borderRadius: 16,
        overflow: 'hidden',
        border: '1.5px solid var(--ah-line2)',
        position: 'relative',
        height: 134,
      }}
    >
      <svg
        width="100%"
        height="134"
        viewBox="0 0 360 134"
        preserveAspectRatio="xMidYMid slice"
        style={{ position: 'absolute', inset: 0, display: 'block' }}
      >
        <rect x="0" y="0" width="360" height="134" fill="#E8ECE7" />
        <rect x="198" y="-12" width="150" height="78" rx="12" fill="#D8E7D2" />
        <rect x="14" y="84" width="104" height="70" rx="10" fill="#E3E8F0" />
        <rect x="250" y="86" width="120" height="64" rx="10" fill="#E3E8F0" />
        <path d="M-10 116 q 95 -22 190 2 t 200 -2 V150 H-10 Z" fill="#CFE0EC" />
        <path d="M0 80 H360" stroke="#FBFCFB" strokeWidth="11" />
        <path d="M148 -10 V146" stroke="#FBFCFB" strokeWidth="10" />
        <path d="M-5 26 L365 62" stroke="#FBFCFB" strokeWidth="6" />
        <path d="M250 -10 L290 146" stroke="#F6DDAC" strokeWidth="6" />
      </svg>
      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: '44%',
          transform: 'translate(-50%,-50%)',
          width: 9,
          height: 4,
          borderRadius: '50%',
          background: 'rgba(20,20,25,0.22)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: '44%',
          transform: 'translate(-50%,-100%)',
          filter: 'drop-shadow(0 4px 5px rgba(20,20,25,0.3))',
        }}
      >
        <svg width="30" height="38" viewBox="0 0 24 32">
          <path d="M12 0C5.4 0 0 5.2 0 11.6 0 20 12 32 12 32s12-12 12-20.4C24 5.2 18.6 0 12 0z" fill="var(--ah-orange)" />
          <circle cx="12" cy="11.5" r="4.6" fill="#fff" />
        </svg>
      </div>
      <div
        style={{
          position: 'absolute',
          left: 12,
          bottom: 12,
          display: 'flex',
          alignItems: 'center',
          gap: 7,
          background: '#1B1B1F',
          color: '#fff',
          borderRadius: 99,
          padding: '8px 14px',
          fontSize: 12.5,
          fontWeight: 700,
          boxShadow: '0 4px 12px -4px rgba(20,20,25,0.4)',
        }}
      >
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
          <path d="M12 21s7-6.4 7-12a7 7 0 1 0-14 0c0 5.6 7 12 7 12z" stroke="#fff" strokeWidth="2" strokeLinejoin="round" />
          <circle cx="12" cy="9" r="2.4" fill="#fff" />
        </svg>
        Choose on map
      </div>
      <div
        style={{
          position: 'absolute',
          right: 12,
          bottom: 12,
          width: 34,
          height: 34,
          borderRadius: 10,
          background: '#fff',
          boxShadow: '0 2px 6px rgba(20,20,25,0.2)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="3.2" stroke="var(--ah-ink)" strokeWidth="2" />
          <path d="M12 2v3M12 19v3M2 12h3M19 12h3" stroke="var(--ah-ink)" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </div>
    </div>
  );
}

// 08 · Business details — voice-fill + map location.
export function BusinessDetails() {
  const nav = useNav();
  return (
    <AHScreen>
      <AHProgress step={5} />
      <AHTitle np="व्यापारको विवरण" en="Tell us about the business" sub="Say it out loud — aihoni fills in the form for you." />

      <div
        style={{
          borderRadius: 20,
          background: '#1B1B1F',
          color: '#fff',
          padding: '16px 18px',
          display: 'flex',
          alignItems: 'center',
          gap: 14,
          boxShadow: '0 10px 24px -12px rgba(20,20,25,0.25)',
          marginBottom: 18,
        }}
      >
        <AHOrb size={48} />
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 15.5, fontWeight: 700 }}>बोलेर भर्नुहोस्</div>
          <div style={{ fontSize: 13, opacity: 0.85, marginTop: 2 }}>"मेरो व्यापार लगनखेलमा छ…"</div>
        </div>
        <div
          style={{
            fontSize: 13,
            fontWeight: 700,
            background: 'rgba(255,255,255,0.18)',
            border: '1px solid rgba(255,255,255,0.35)',
            borderRadius: 99,
            padding: '8px 14px',
          }}
        >
          Speak
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--ah-muted)' }}>Location</span>
            <span style={{ fontSize: 11.5, fontWeight: 600, color: 'var(--ah-faint)' }}>नक्सामा छान्नुहोस्</span>
          </div>
          <AHMapPicker />
          <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginTop: 1 }}>
            <svg width="13" height="16" viewBox="0 0 24 32" style={{ flexShrink: 0 }}>
              <path d="M12 0C5.4 0 0 5.2 0 11.6 0 20 12 32 12 32s12-12 12-20.4C24 5.2 18.6 0 12 0z" fill="var(--ah-orange)" />
              <circle cx="12" cy="11.5" r="4.3" fill="#fff" />
            </svg>
            <span style={{ fontSize: 14.5, fontWeight: 600 }}>Lagankhel, Lalitpur</span>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <div
              style={{
                flex: 1,
                textAlign: 'center',
                fontSize: 12.5,
                fontWeight: 700,
                color: 'var(--ah-ink)',
                background: '#fff',
                border: '1.5px solid var(--ah-line2)',
                borderRadius: 12,
                padding: '8px 6px',
              }}
            >
              <span style={{ color: 'var(--ah-muted)', fontWeight: 500 }}>Lat </span>27.6677° N
            </div>
            <div
              style={{
                flex: 1,
                textAlign: 'center',
                fontSize: 12.5,
                fontWeight: 700,
                color: 'var(--ah-ink)',
                background: '#fff',
                border: '1.5px solid var(--ah-line2)',
                borderRadius: 12,
                padding: '8px 6px',
              }}
            >
              <span style={{ color: 'var(--ah-muted)', fontWeight: 500 }}>Long </span>85.3247° E
            </div>
          </div>
        </div>
        <AHField label="Business phone" value="01-54XXXXX" />
        <AHField label="What do you sell?" placeholder="e.g. दाल, चामल, तेल, नुन…" />
      </div>
      <div style={{ flex: 1 }} />
      <AHButton kind="primary" onClick={nav.next}>
        Save business
      </AHButton>
      <AHButton kind="ghost" onClick={nav.next}>
        Skip for now
      </AHButton>
    </AHScreen>
  );
}
