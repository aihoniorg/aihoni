import { AHScreen, AHProgress, AHTitle, AHOptionCard, AHButton } from '../components/ui';
import { useNav } from '../nav';

// 02 · Language picker.
export function Language() {
  const nav = useNav();
  return (
    <AHScreen>
      <AHProgress step={0} />
      <AHTitle
        np="भाषा छान्नुहोस्"
        en="Choose your language"
        sub="aihoni speaks and listens in both. You can change this anytime."
      />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <AHOptionCard glyph="ने" title="नेपाली" sub="बोल्नुहोस् र पढ्नुहोस् नेपालीमा" selected badge="Recommended" />
        <AHOptionCard glyph="En" title="English" sub="Speak and read in English" />
      </div>
      <div style={{ flex: 1 }} />
      <AHButton kind="primary" onClick={nav.next}>
        जारी राख्नुहोस् · Continue
      </AHButton>
    </AHScreen>
  );
}
