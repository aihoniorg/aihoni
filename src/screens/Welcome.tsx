import { AHScreen, AHButton, AHOrb, AHWordmark } from '../components/ui';
import { AH_BRAND_FONT } from '../theme';
import { useNav } from '../nav';

// 01 · Welcome — voice-orb splash + language-neutral greeting.
export function Welcome() {
  const nav = useNav();
  return (
    <AHScreen style={{ background: 'linear-gradient(180deg, var(--ah-blue-soft) 0%, var(--ah-bg) 46%)' }}>
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
        }}
      >
        <AHOrb size={170} />
        <div style={{ marginTop: 38 }}>
          <AHWordmark size={44} />
        </div>
        <div
          style={{
            fontFamily: AH_BRAND_FONT,
            fontSize: 19,
            fontWeight: 600,
            color: 'var(--ah-orange)',
            marginTop: 14,
          }}
        >
          नमस्ते! म तपाईंको AI साथी।
        </div>
        <div
          style={{
            fontSize: 16,
            lineHeight: 1.5,
            color: 'var(--ah-muted)',
            marginTop: 8,
            maxWidth: 290,
          }}
        >
          Ask anything — in your own voice, in your own language. For you and your pasal.
        </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <AHButton kind="primary" onClick={nav.next}>
          Get started
        </AHButton>
        <AHButton kind="ghost" onClick={() => nav.go('signin')}>
          I already have an account
        </AHButton>
      </div>
    </AHScreen>
  );
}
