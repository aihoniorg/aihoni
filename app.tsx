import 'react-native-url-polyfill/auto';
import 'expo-insights';
import { registerRootComponent } from 'expo';
import { useEffect, useState } from 'react';
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
import { SCREENS } from './src/screens';
import { SplashScreen } from './src/SplashScreen';

function AppContent() {
  const nav = useNav();
  const Screen = SCREENS[nav.current].Comp;

  // Push notifications + Universal/App Links + custom-scheme deep links.
  useEffect(() => {
    registerForPushNotificationsAsync()
      .then((token) => {
        if (token) console.log('[push] token:', token);
      })
      .catch((e) => console.warn('[push] register failed', e));

    // Push tap → deep-link to data.screen if provided
    const pushSub = Notifications.addNotificationResponseReceivedListener((r) => {
      const data = r.notification.request.content.data as { screen?: ScreenId };
      console.log('[push] tapped', data);
      if (data?.screen) nav.go(data.screen);
    });

    // Cold-start: app opened from an aihoni.com URL or aihoni:// scheme
    Linking.getInitialURL().then((url) => {
      if (!url) return;
      const target = resolveDeepLink(url);
      console.log('[link] initial', url, '→', target);
      if (target) nav.go(target);
    });

    // Warm: incoming URL while app is running
    const linkSub = Linking.addEventListener('url', ({ url }) => {
      const target = resolveDeepLink(url);
      console.log('[link] received', url, '→', target);
      if (target) nav.go(target);
    });

    return () => {
      pushSub.remove();
      linkSub.remove();
    };
  }, [nav]);

  return <Screen />;
}

function App() {
  const [showSplash, setShowSplash] = useState(true);
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
      <NavProvider>
        <AppContent />
      </NavProvider>
      {(showSplash || !fontsLoaded) && (
        <SplashScreen onFinish={() => setShowSplash(false)} />
      )}
    </SafeAreaProvider>
  );
}

registerRootComponent(App);
