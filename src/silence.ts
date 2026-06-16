// Silences known-harmless dev-mode warnings/errors so they don't drown out real ones.
//
// Must be imported BEFORE any module that triggers the noise (e.g. expo-notifications).
// See app.tsx — this is loaded as the very first side-effect import.

const SILENCED = [
  // expo-notifications complains on every reload in Expo Go on SDK 53+ because
  // push tokens were removed. We already detect Expo Go in src/notifications.ts
  // and skip the registration; this filters the native module's own startup log.
  'expo-notifications: Android Push notifications',
  'expo-notifications: iOS Push notifications',
  '`expo-notifications` functionality is not fully supported in Expo Go',
];

function shouldSilence(args: unknown[]): boolean {
  const first = args[0];
  if (typeof first !== 'string') return false;
  return SILENCED.some((s) => first.includes(s));
}

const origError = console.error.bind(console);
const origWarn = console.warn.bind(console);

console.error = (...args: unknown[]) => {
  if (shouldSilence(args)) return;
  origError(...(args as []));
};
console.warn = (...args: unknown[]) => {
  if (shouldSilence(args)) return;
  origWarn(...(args as []));
};
