import { AHScreen, AHProgress, AHTitle, AHField, AHButton } from '../components/ui';
import { useNav } from '../nav';

// 04 · Personal info — kept clearly separate from business data.
export function Personal() {
  const nav = useNav();
  return (
    <AHScreen>
      <AHProgress step={2} />
      <AHTitle
        np="तपाईंको बारेमा"
        en="About you"
        sub="Just the basics. Your personal details stay private — and separate from your stores."
      />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <AHField label="Full name" value="Sunita Shrestha" />
        <AHField
          label="Mobile number"
          value="+977 98XXXXXXXX"
          trailing={
            <span
              style={{
                fontSize: 12.5,
                fontWeight: 700,
                color: 'var(--ah-ink)',
                background: 'var(--ah-bg-soft)',
                borderRadius: 99,
                padding: '4px 10px',
              }}
            >
              Verify
            </span>
          }
        />
        <AHField label="District (optional)" placeholder="e.g. Lalitpur" />
      </div>
      <div
        style={{
          marginTop: 18,
          display: 'flex',
          gap: 10,
          alignItems: 'flex-start',
          background: 'var(--ah-bg-soft)',
          borderRadius: 16,
          padding: '13px 15px',
        }}
      >
        <div
          style={{
            width: 8,
            height: 8,
            borderRadius: '50%',
            background: '#1B1B1F',
            marginTop: 5,
            flexShrink: 0,
          }}
        />
        <div style={{ fontSize: 13.5, lineHeight: 1.45, color: 'var(--ah-ink)' }}>
          <strong>निजी रहन्छ।</strong> aihoni keeps personal and business information in separate spaces.
        </div>
      </div>
      <div style={{ flex: 1 }} />
      <AHButton kind="primary" onClick={nav.next}>
        Continue
      </AHButton>
    </AHScreen>
  );
}
