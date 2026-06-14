import type { ScreenId } from './nav';

// Map an incoming URL path to a ScreenId.
// Handles both `https://aihoni.com/<path>` and `aihoni://<path>` forms.
export function resolveDeepLink(url: string): ScreenId | null {
  let path: string;
  try {
    const u = new URL(url);
    path = u.pathname;
  } catch {
    // aihoni://chat — URL constructor may not parse custom schemes consistently
    path = url.replace(/^aihoni:\/\//, '/').replace(/^https?:\/\/[^/]+/, '');
  }

  // Strip leading slash, take the first segment as the route key
  const segs = path.replace(/^\/+/, '').split('/').filter(Boolean);
  const head = segs[0];

  const map: Record<string, ScreenId> = {
    '': 'chats',
    chats: 'chats',
    feed: 'feed',
    reels: 'reels',
    profile: 'profile',
    snap: 'snap',
    chat: 'chat',
    'group-chat': 'groupChat',
    business: 'businessPage',
    order: 'order',
    knowledge: 'knowledge',
    'add-business': 'addBusiness',
    'business-details': 'businessDetails',
    'business-dashboard': 'businessDashboard',
    recharge: 'recharge',
    welcome: 'welcome',
    language: 'language',
    signin: 'signin',
    voice: 'voice',
    connect: 'connect',
    personal: 'personal',
  };

  if (head === undefined) return 'chats';
  return map[head] ?? null;
}
