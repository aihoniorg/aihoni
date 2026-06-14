import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';
import { Alert } from 'react-native';
import { api, setSessionToken, getCachedToken } from './apiClient';

// Required for the auth session to dismiss the in-app browser after redirect.
WebBrowser.maybeCompleteAuthSession();

// ----- Google OAuth client IDs -----------------------------------------------
// Get these from https://console.cloud.google.com → APIs & Services → Credentials
// You need 3 OAuth 2.0 Client IDs:
//   1. Web application → use for Expo Go and the iOS/Android EAS dev client during testing
//   2. iOS                → use for native iOS production builds (bundle id com.nepfinder.aihoni)
//   3. Android            → use for native Android production builds (package com.nepfinder.aihoni)
//
// Until you fill these in, the Continue-with-Google button will show a clear error.
const GOOGLE_WEB_CLIENT_ID =
  process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID ?? 'TODO_WEB_CLIENT_ID.apps.googleusercontent.com';
const GOOGLE_IOS_CLIENT_ID =
  process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID ?? 'TODO_IOS_CLIENT_ID.apps.googleusercontent.com';
const GOOGLE_ANDROID_CLIENT_ID =
  process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID ?? 'TODO_ANDROID_CLIENT_ID.apps.googleusercontent.com';

export interface AuthUser {
  id: string;
  name?: string;
  email?: string;
  picture?: string;
}

interface AuthApi {
  user: AuthUser | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthApi | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  const [request, response, promptAsync] = Google.useAuthRequest({
    webClientId: GOOGLE_WEB_CLIENT_ID,
    iosClientId: GOOGLE_IOS_CLIENT_ID,
    androidClientId: GOOGLE_ANDROID_CLIENT_ID,
    responseType: 'id_token',
    scopes: ['openid', 'profile', 'email'],
  });

  // On boot — try to restore an existing session
  useEffect(() => {
    (async () => {
      try {
        const tok = getCachedToken();
        if (!tok) {
          // try loading from SecureStore by making any API call (apiClient lazy-loads)
          await api<{ user: AuthUser }>('/api/auth/me').then((r) => setUser(r.user)).catch(() => {});
        } else {
          const { user: u } = await api<{ user: AuthUser }>('/api/auth/me');
          setUser(u);
        }
      } catch {
        // not logged in — fine
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // Handle the result of the Google auth prompt
  useEffect(() => {
    if (response?.type !== 'success') return;
    const idToken = response.params.id_token ?? (response.authentication?.idToken as string | undefined);
    if (!idToken) {
      Alert.alert('Sign in failed', 'No id_token returned from Google.');
      return;
    }
    (async () => {
      try {
        const { token, user } = await api<{ token: string; user: AuthUser }>(
          '/api/auth/google',
          { method: 'POST', body: { id_token: idToken }, noAuth: true },
        );
        await setSessionToken(token);
        setUser(user);
      } catch (e: unknown) {
        Alert.alert('Sign in failed', String((e as Error).message ?? e));
      }
    })();
  }, [response]);

  const signInWithGoogle = useCallback(async () => {
    if (!request) {
      Alert.alert('Not ready', 'Google auth request not initialized yet.');
      return;
    }
    if (GOOGLE_WEB_CLIENT_ID.startsWith('TODO_')) {
      Alert.alert(
        'Google not configured',
        'Set EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID / IOS / ANDROID env vars (see src/auth.tsx).',
      );
      return;
    }
    await promptAsync();
  }, [request, promptAsync]);

  const signOut = useCallback(async () => {
    await setSessionToken(null);
    setUser(null);
  }, []);

  const value = useMemo<AuthApi>(
    () => ({ user, loading, signInWithGoogle, signOut }),
    [user, loading, signInWithGoogle, signOut],
  );
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthApi {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
}
