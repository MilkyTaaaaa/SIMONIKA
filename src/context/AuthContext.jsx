import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { authService } from '../services/authService.js';
import { setUnauthorizedHandler, tokenStore } from '../services/apiClient.js';

const Ctx = createContext(null);
export const useAuth = () => useContext(Ctx);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [status, setStatus] = useState('loading'); // loading | authenticated | unauthenticated

  const clear = useCallback(() => {
    tokenStore.clear();
    setUser(null);
    setStatus('unauthenticated');
  }, []);

  useEffect(() => {
    setUnauthorizedHandler(clear); // HTTP 401 -> sesi berakhir
    authService
      .getCurrentUser()
      .then((u) => {
        setUser(u);
        setStatus('authenticated');
      })
      .catch(clear);
  }, [clear]);

  const login = useCallback(async (credentials) => {
    const u = await authService.login(credentials);
    setUser(u);
    setStatus('authenticated');
    return u;
  }, []);

  const logout = useCallback(async () => {
    try {
      await authService.logout();
    } catch {
      /* token tetap dibuang di sisi klien meski server gagal dihubungi / token sudah tidak valid */
    } finally {
      clear();
    }
  }, [clear]);

  const value = useMemo(() => ({ user, status, login, logout }), [user, status, login, logout]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}
