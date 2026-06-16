import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import * as SecureStore from 'expo-secure-store';
import { api } from './apiClient';
import { useAuth } from './auth';

const STORAGE_KEY = 'aihoni.current_business_id';

export interface Business {
  id: string;
  name: string;
  type: string;
  district?: string | null;
  logo_key?: string | null;
  logo_url?: string | null;
}

interface BusinessApi {
  /** All businesses owned by the signed-in user (may be empty). */
  businesses: Business[];
  /** Currently active business id (defaults to the most recent). */
  currentId: string | null;
  current: Business | null;
  /** True while businesses are being fetched. */
  loading: boolean;
  setCurrentId: (id: string | null) => void;
  /** Re-fetch from the API. Called after a successful POST /api/businesses. */
  refresh: () => Promise<void>;
}

const BusinessContext = createContext<BusinessApi | null>(null);

export function BusinessProvider({ children }: { children: ReactNode }) {
  const { user, restored } = useAuth();
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [currentId, setCurrentIdState] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const setCurrentId = useCallback((id: string | null) => {
    setCurrentIdState(id);
    if (id) void SecureStore.setItemAsync(STORAGE_KEY, id);
    else void SecureStore.deleteItemAsync(STORAGE_KEY);
  }, []);

  const refresh = useCallback(async () => {
    if (!user) {
      setBusinesses([]);
      return;
    }
    setLoading(true);
    try {
      const { businesses: rows } = await api<{ businesses: Business[] }>(
        '/api/businesses?mine=1',
      );
      setBusinesses(rows ?? []);
    } catch {
      // Network/permission errors are non-fatal here — stale list is fine.
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Restore persisted current id, then fetch list whenever user changes.
  useEffect(() => {
    if (!restored) return;
    (async () => {
      const stored = await SecureStore.getItemAsync(STORAGE_KEY);
      if (stored) setCurrentIdState(stored);
      await refresh();
    })();
  }, [restored, user, refresh]);

  // If currentId isn't in the list, fall back to the first business.
  useEffect(() => {
    if (businesses.length === 0) return;
    if (currentId && businesses.some((b) => b.id === currentId)) return;
    setCurrentId(businesses[0].id);
  }, [businesses, currentId, setCurrentId]);

  const current = useMemo(
    () => businesses.find((b) => b.id === currentId) ?? null,
    [businesses, currentId],
  );

  const value = useMemo<BusinessApi>(
    () => ({ businesses, currentId, current, loading, setCurrentId, refresh }),
    [businesses, currentId, current, loading, setCurrentId, refresh],
  );

  return <BusinessContext.Provider value={value}>{children}</BusinessContext.Provider>;
}

export function useBusiness(): BusinessApi {
  const ctx = useContext(BusinessContext);
  if (!ctx) throw new Error('useBusiness must be used inside <BusinessProvider>');
  return ctx;
}
