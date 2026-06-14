import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

// Every navigable screen in the app.
export type ScreenId =
  | 'welcome'
  | 'language'
  | 'signin'
  | 'personal'
  | 'connect'
  | 'voice'
  | 'addBusiness'
  | 'businessDetails'
  | 'businessDashboard'
  | 'knowledge'
  | 'chats'
  | 'feed'
  | 'snap'
  | 'groupChat'
  | 'chat'
  | 'chatAttach'
  | 'chatReact'
  | 'reels'
  | 'order'
  | 'businessPage'
  | 'profile'
  | 'recharge';

// The linear onboarding/signup path. "Continue"-style CTAs advance along it;
// the last onboarding step hands off into the app at the Chats screen.
export const ONBOARDING_FLOW: ScreenId[] = [
  'welcome',
  'language',
  'signin',
  'personal',
  'connect',
  'voice',
  'chats',
];

interface NavApi {
  current: ScreenId;
  go: (id: ScreenId) => void;
  next: () => void;
  back: () => void;
  canGoBack: boolean;
}

const NavContext = createContext<NavApi | null>(null);

export function NavProvider({ children }: { children: ReactNode }) {
  const [stack, setStack] = useState<ScreenId[]>(['welcome']);
  const current = stack[stack.length - 1];

  const go = useCallback((id: ScreenId) => {
    setStack((s) => (s[s.length - 1] === id ? s : [...s, id]));
  }, []);

  const back = useCallback(() => {
    setStack((s) => (s.length > 1 ? s.slice(0, -1) : s));
  }, []);

  const next = useCallback(() => {
    setStack((s) => {
      const cur = s[s.length - 1];
      const i = ONBOARDING_FLOW.indexOf(cur);
      if (i >= 0 && i < ONBOARDING_FLOW.length - 1) {
        return [...s, ONBOARDING_FLOW[i + 1]];
      }
      return s;
    });
  }, []);

  const value = useMemo<NavApi>(
    () => ({ current, go, next, back, canGoBack: stack.length > 1 }),
    [current, go, next, back, stack.length],
  );

  return <NavContext.Provider value={value}>{children}</NavContext.Provider>;
}

export function useNav(): NavApi {
  const ctx = useContext(NavContext);
  if (!ctx) throw new Error('useNav must be used within a NavProvider');
  return ctx;
}
