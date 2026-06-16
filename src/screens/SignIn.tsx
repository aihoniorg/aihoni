import { useEffect, useRef } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { AHScreen, AHProgress, AHTitle, AHButton, AHOrb } from '../components/ui';
import { AH_BRAND_FONT, INK, BG_SOFT, FAINT, ACCENT } from '../theme';
import { useNav } from '../nav';
import { useAuth } from '../auth';

// 03 · Sign in — Google / Apple, no passwords.
export function SignIn() {
  const nav = useNav();
  const { user, loading, signInWithGoogle } = useAuth();

  // Auto-advance only when the user signs in *while on this screen*.
  // Capture whether a user was already present at mount; if so, don't auto-jump
  // (otherwise navigating back to SignIn would loop forward immediately).
  const userAtMount = useRef<boolean>(!!user);
  useEffect(() => {
    if (user && !userAtMount.current) {
      nav.next();
    }
    // Intentionally exclude nav from deps — nav reference changes on every
    // navigation, which would otherwise re-run this effect repeatedly.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);
  return (
    <AHScreen>
      <AHProgress step={1} />
      <View style={{ flex: 1, flexDirection: 'column', justifyContent: 'center' }}>
        <View style={{ alignItems: 'center', marginBottom: 30 }}>
          <AHOrb size={92} />
        </View>
        <AHTitle
          align="center"
          np="खाता बनाउनुहोस्"
          en="Create your account"
          sub="One tap — no passwords to remember."
        />
        <View style={{ flexDirection: 'column', gap: 12, marginTop: 6 }}>
          <AHButton
            kind="outline"
            onClick={signInWithGoogle}
            icon={
              <View
                style={{
                  width: 24,
                  height: 24,
                  borderRadius: 12,
                  backgroundColor: BG_SOFT,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {loading ? (
                  <ActivityIndicator size="small" color={ACCENT} />
                ) : (
                  <Text
                    style={{
                      fontWeight: '800',
                      fontSize: 14,
                      color: INK,
                      fontFamily: AH_BRAND_FONT,
                    }}
                  >
                    G
                  </Text>
                )}
              </View>
            }
          >
            Continue with Google
          </AHButton>
          <AHButton
            kind="dark"
            onClick={nav.next}
            icon={
              <Text style={{ fontSize: 20, lineHeight: 22, color: '#fff' }}>
                {''}
              </Text>
            }
          >
            Continue with Apple
          </AHButton>
        </View>
      </View>
      <Text
        style={{
          fontSize: 12.5,
          color: FAINT,
          textAlign: 'center',
          lineHeight: 19,
          paddingHorizontal: 18,
        }}
      >
        {'By continuing you agree to aihoni\'s '}
        <Text style={{ color: INK, fontWeight: '600' }}>Terms</Text>
        {' and '}
        <Text style={{ color: INK, fontWeight: '600' }}>Privacy Policy</Text>
        {'.'}
      </Text>
    </AHScreen>
  );
}
