import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { CheckCircle2, CircleAlert, Info, X } from 'lucide-react';

const Ctx = createContext(null);
export const useNotify = () => useContext(Ctx);

const ICON = { success: CheckCircle2, error: CircleAlert, info: Info };

export function NotificationProvider({ children }) {
  const [items, setItems] = useState([]);

  const dismiss = useCallback((id) => setItems((l) => l.filter((i) => i.id !== id)), []);
  const notify = useCallback(
    ({ type = 'info', title, message }) => {
      const id = crypto.randomUUID();
      setItems((l) => [...l, { id, type, title, message }]);
      setTimeout(() => dismiss(id), 7000);
    },
    [dismiss]
  );
  const value = useMemo(() => ({ notify }), [notify]);

  return (
    <Ctx.Provider value={value}>
      {children}
      <div className="toast-stack" role="region" aria-live="polite" aria-label="Notifikasi">
        {items.map((t) => {
          const Icon = ICON[t.type] || Info;
          return (
            <div key={t.id} className={`toast toast--${t.type}`} role={t.type === 'error' ? 'alert' : 'status'}>
              <span className="toast__icon"><Icon size={18} aria-hidden="true" /></span>
              <div className="toast__body">
                <strong>{t.title}</strong>
                {t.message && <p>{t.message}</p>}
              </div>
              <button type="button" className="toast__close" onClick={() => dismiss(t.id)} aria-label="Tutup notifikasi">
                <X size={16} aria-hidden="true" />
              </button>
            </div>
          );
        })}
      </div>
    </Ctx.Provider>
  );
}
