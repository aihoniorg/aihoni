import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';
import Constants, { ExecutionEnvironment } from 'expo-constants';

// SDK 53+ removed push notifications from Expo Go. Skip all push setup in that env
// so we don't print noisy warnings on every reload.
const isExpoGo = Constants.executionEnvironment === ExecutionEnvironment.StoreClient;

// Foreground behavior — show banner + sound + list entry when a push arrives
// while the user is in the app. Local notifications still work in Expo Go.
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

// Cached Expo push token — set after registerForPushNotificationsAsync().
let cachedToken: string | null = null;
export function getPushToken(): string | null {
  return cachedToken;
}

/**
 * Request permission and return the Expo push token for this device.
 * Call once at app start; the token is stable across launches.
 */
export async function registerForPushNotificationsAsync(): Promise<string | null> {
  if (isExpoGo) {
    // SDK 53+ — push tokens don't work in Expo Go. Skip silently; the
    // Profile debug panel will say "Waiting for token" and tests should
    // be done in a dev/preview build via EAS.
    return null;
  }
  if (!Device.isDevice) {
    // Simulator/emulator doesn't get a real push token; bail silently.
    return null;
  }

  // Android needs an explicit channel for foreground push delivery.
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#3B76EF',
    });
  }

  const existing = await Notifications.getPermissionsAsync();
  let status = existing.status;
  if (status !== 'granted') {
    const request = await Notifications.requestPermissionsAsync();
    status = request.status;
  }
  if (status !== 'granted') {
    return null;
  }

  const projectId =
    Constants.expoConfig?.extra?.eas?.projectId ??
    Constants.easConfig?.projectId;
  if (!projectId) {
    console.warn('[notifications] EAS projectId missing — push token will not work.');
    return null;
  }

  const token = await Notifications.getExpoPushTokenAsync({ projectId });
  cachedToken = token.data;
  return token.data;
}

/**
 * Fire a local notification immediately — useful for testing the foreground/UI
 * pipeline without needing a server or an Expo push token. Works on simulators.
 */
export async function sendLocalTestNotification(
  title = 'aihoni.',
  body = 'This is a test notification.',
  data: Record<string, unknown> = { screen: 'chat' },
): Promise<void> {
  await Notifications.scheduleNotificationAsync({
    content: { title, body, data, sound: 'default' },
    trigger: null, // null = fire immediately
  });
}

/**
 * Send a real push through Expo's Push Service. Requires a valid Expo push
 * token (only available in dev/prod builds, NOT Expo Go on SDK 53+).
 */
export async function sendPushViaExpoApi(
  to: string,
  title: string,
  body: string,
  data: Record<string, unknown> = {},
): Promise<void> {
  const res = await fetch('https://exp.host/--/api/v2/push/send', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Accept-encoding': 'gzip, deflate',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      to,
      title,
      body,
      data,
      sound: 'default',
      priority: 'high',
      channelId: 'default',
    }),
  });
  if (!res.ok) {
    throw new Error(`Expo Push API ${res.status}: ${await res.text()}`);
  }
}
