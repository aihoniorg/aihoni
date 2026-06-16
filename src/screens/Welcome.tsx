import { View, Text } from 'react-native';
import { AHScreen, AHButton, AHOrb, AHWordmark } from '../components/ui';
import { AH_BRAND_FONT, ACCENT, MUTED } from '../theme';
import { useNav } from '../nav';
import { useAuth } from '../auth';

// 01 · Welcome — voice-orb splash + language-neutral greeting.
export function Welcome() {
  const nav = useNav();
  const { user } = useAuth();
  // If the user already has a session, "I already have an account" jumps straight in.
  const goSignIn = () => (user ? nav.reset('chats') : nav.go('signin'));
  return (
    <AHScreen style={{ backgroundColor: '#EEF3FD' }}>
      <View
        style={{
          flex: 1,
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <AHOrb size={170} />
        <View style={{ marginTop: 38 }}>
          <AHWordmark size={44} />
        </View>
        <Text
          style={{
            fontFamily: AH_BRAND_FONT,
            fontSize: 19,
            fontWeight: '600',
            color: ACCENT,
            marginTop: 14,
            textAlign: 'center',
          }}
        >
          {'नमस्ते! म तपाईंको AI साथी।'}
        </Text>
        <Text
          style={{
            fontSize: 16,
            lineHeight: 24,
            color: MUTED,
            marginTop: 8,
            maxWidth: 290,
            textAlign: 'center',
          }}
        >
          Ask anything — in your own voice, in your own language. For you and your pasal.
        </Text>
      </View>
      <View style={{ flexDirection: 'column', gap: 8 }}>
        <AHButton kind="primary" onClick={nav.next}>
          Get started
        </AHButton>
        <AHButton kind="ghost" onClick={goSignIn}>
          {user ? 'Continue as ' + (user.name?.split(' ')[0] ?? 'me') : 'I already have an account'}
        </AHButton>
      </View>
    </AHScreen>
  );
}
