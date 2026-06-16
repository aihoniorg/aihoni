import './src/silence';
import 'react-native-url-polyfill/auto';
import 'expo-insights';
import { registerRootComponent } from 'expo';
import { useEffect, useRef, useState } from 'react';
import * as Notifications from 'expo-notifications';
import * as Linking from 'expo-linking';
import { registerForPushNotificationsAsync } from './src/notifications';
import { resolveDeepLink } from './src/deeplinks';
import type { ScreenId } from './src/nav';
import {
  useFonts,
  Poppins_400Regular,
  Poppins_600SemiBold,
  Poppins_700Bold,
  Poppins_800ExtraBold,
} from '@expo-google-fonts/poppins';
import {
  Baloo2_700Bold,
  Baloo2_800ExtraBold,
} from '@expo-google-fonts/baloo-2';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { NavProvider, useNav } from './src/nav';
import { AuthProvider, useAuth } from './src/auth';
import { BusinessProvider } from './src/business';
import { SCREENS } from './src/screens';
import { SplashScreen } from './src/SplashScreen';

function AppContent() {
  const nav = useNav();
  const Screen = SCREENS[nav.current].Comp;

  // Keep a stable ref to nav so the registration effect only runs ONCE on mount.
  // (nav.go itself changes reference every navigation; without this, the effect
  // would re-fire constantly and Linking.getInitialURL would keep routing back.)
  const navRef = useRef(nav);
  navRef.current = nav;

  // Push notifications + Universal/App Links + custom-scheme deep links — once.
  useEffect(() => {
    registerForPushNotificationsAsync()
      .then((token) => {
        if (token) console.log('[push] token:', token);
      })
      .catch((e) => console.warn('[push] register failed', e));

    const pushSub = Notifications.addNotificationResponseReceivedListener((r) => {
      const data = r.notification.request.content.data as { screen?: ScreenId };
      console.log('[push] tapped', data);
      if (data?.screen) navRef.current.go(data.screen);
    });

    Linking.getInitialURL().then((url) => {
      if (!url) return;
      const target = resolveDeepLink(url);
      console.log('[link] initial', url, '→', target);
      if (target) navRef.current.go(target);
    });

    const linkSub = Linking.addEventListener('url', ({ url }) => {
      const target = resolveDeepLink(url);
      console.log('[link] received', url, '→', target);
      if (target) navRef.current.go(target);
    });

    return () => {
      pushSub.remove();
      linkSub.remove();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <Screen />;
}

function Booted() {
  const { user, restored } = useAuth();
  const [showSplash, setShowSplash] = useState(true);

  // Wait for both the SecureStore restore + the splash animation before mounting nav.
  if (!restored) {
    return <SplashScreen onFinish={() => setShowSplash(false)} />;
  }

  // Signed-in users skip onboarding and land directly on Chats.
  const initial = user ? 'chats' : 'welcome';

  return (
    <>
      <BusinessProvider>
        <NavProvider initial={initial}>
          <AppContent />
        </NavProvider>
      </BusinessProvider>
      {showSplash && <SplashScreen onFinish={() => setShowSplash(false)} />}
    </>
  );
}

function App() {
  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_600SemiBold,
    Poppins_700Bold,
    Poppins_800ExtraBold,
    Baloo2_700Bold,
    Baloo2_800ExtraBold,
  });

  return (
    <SafeAreaProvider>
      <StatusBar style="light" />
      <AuthProvider>
        {fontsLoaded ? <Booted /> : <SplashScreen onFinish={() => {}} />}
      </AuthProvider>
    </SafeAreaProvider>
  );
}

registerRootComponent(App);
