import { Loader2 } from 'lucide-react';
import Modal from './Modal.jsx';

export default function ConfirmDialog({ title, message, confirmLabel = 'Hapus', busy = false, error, onConfirm, onCancel }) {
  return (
    <Modal title={title} size="sm" onClose={onCancel} busy={busy}
      footer={<>
        <button type="button" className="btn btn--outline" onClick={onCancel} disabled={busy}>Batal</button>
        <button type="button" className="btn btn--danger" onClick={onConfirm} disabled={busy}>
          {busy && <Loader2 size={16} className="spin" aria-hidden="true" />} {confirmLabel}
        </button>
      </>}>
      <p>{message}</p>
      {error && <p className="form-error" role="alert">{error}</p>}
    </Modal>
  );
}
