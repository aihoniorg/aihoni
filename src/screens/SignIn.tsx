import { AHScreen, AHProgress, AHTitle, AHButton, AHOrb } from '../components/ui';
import { AH_BRAND_FONT } from '../theme';
import { useNav } from '../nav';

// 03 · Sign in — Google / Apple, no passwords.
export function SignIn() {
  const nav = useNav();
  return (
    <AHScreen>
      <AHProgress step={1} />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 30 }}>
          <AHOrb size={92} />
        </div>
        <AHTitle align="center" np="खाता बनाउनुहोस्" en="Create your account" sub="One tap — no passwords to remember." />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 6 }}>
          <AHButton
            kind="outline"
            onClick={nav.next}
            icon={
              <span
                style={{
                  width: 24,
                  height: 24,
                  borderRadius: '50%',
                  background: 'var(--ah-bg-soft)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 800,
                  fontSize: 14,
                  color: 'var(--ah-ink)',
                  fontFamily: AH_BRAND_FONT,
                }}
              >
                G
              </span>
            }
          >
            Continue with Google
          </AHButton>
          <AHButton
            kind="dark"
            onClick={nav.next}
            icon={<span style={{ fontSize: 20, lineHeight: 1, marginTop: -2 }}></span>}
          >
            Continue with Apple
          </AHButton>
        </div>
      </div>
      <div
        style={{
          fontSize: 12.5,
          color: 'var(--ah-faint)',
          textAlign: 'center',
          lineHeight: 1.5,
          padding: '0 18px',
        }}
      >
        By continuing you agree to aihoni's{' '}
        <span style={{ color: 'var(--ah-ink)', fontWeight: 600 }}>Terms</span> and{' '}
        <span style={{ color: 'var(--ah-ink)', fontWeight: 600 }}>Privacy Policy</span>.
      </div>
    </AHScreen>
  );
}
