import { useEffect, useRef } from 'react';
import { X } from 'lucide-react';

export default function Modal({ title, user, onClose, children, footer, busy = false, closable = false, size }) {
  const ref = useRef(null);

  useEffect(() => {
    const prev = document.activeElement;
    ref.current?.focus();
    document.body.style.overflow = 'hidden';
    const onKey = (e) => {
      if (e.key === 'Escape' && !busy) onClose();
    };
    document.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = '';
      document.removeEventListener('keydown', onKey);
      prev?.focus?.();
    };
  }, [onClose, busy]);

  return (
    <div className="modal-backdrop" onMouseDown={(e) => e.target === e.currentTarget && !busy && onClose()}>
      <div className={`modal ${size === 'sm' ? 'modal--sm' : ''}`} role="dialog" aria-modal="true" aria-labelledby="modal-title" tabIndex={-1} ref={ref}>
        <header className="modal__head">
          <h2 id="modal-title">{title}</h2>
          {user && (
            <p>
              Nama Aparatur : <strong>{user.name}</strong>
              <span className="modal__sep">Jabatan : <strong>{user.jabatan}</strong></span>
            </p>
          )}
          {closable && (
            <button type="button" className="modal__x" onClick={onClose} disabled={busy} aria-label="Tutup">
              <X size={18} aria-hidden="true" />
            </button>
          )}
        </header>
        <div className="modal__body">{children}</div>
        {footer && <footer className="modal__foot">{footer}</footer>}
      </div>
    </div>
  );
}
