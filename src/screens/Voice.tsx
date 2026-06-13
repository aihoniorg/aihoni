import { AHScreen, AHProgress, AHTitle, AHButton, AHOrb, AHWave } from '../components/ui';
import { useNav } from '../nav';

// 06 · Voice-first setup.
export function Voice() {
  const nav = useNav();
  return (
    <AHScreen>
      <AHProgress step={3} />
      <AHTitle
        np="बोलेर सोध्नुहोस्"
        en="Just talk to aihoni"
        sub="No typing needed. Press the button, ask in Nepali or English."
      />

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 4 }}>
        <div
          style={{
            alignSelf: 'flex-end',
            maxWidth: 270,
            background: '#1B1B1F',
            color: '#fff',
            borderRadius: '20px 20px 6px 20px',
            padding: '12px 16px',
            fontSize: 15.5,
            lineHeight: 1.45,
          }}
        >
          "आज तरकारीको भाउ कस्तो छ?"
        </div>
        <div
          style={{
            alignSelf: 'flex-start',
            maxWidth: 280,
            background: '#fff',
            border: '1.5px solid var(--ah-line2)',
            borderRadius: '20px 20px 20px 6px',
            padding: '12px 16px',
            fontSize: 15.5,
            lineHeight: 1.5,
          }}
        >
          नमस्ते सुनिता जी! आजको कालीमाटी थोक भाउ अनुसार…
          <AHWave n={10} />
        </div>
      </div>

      <div style={{ flex: 1 }} />

      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14, marginBottom: 18 }}>
        <AHOrb size={104} />
        <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--ah-muted)' }}>Hold to speak · थिचेर बोल्नुहोस्</div>
      </div>

      <AHButton kind="primary" onClick={nav.next}>
        Allow microphone
      </AHButton>
      <AHButton kind="ghost" onClick={nav.next}>
        I'd rather type ›
      </AHButton>
    </AHScreen>
  );
}
