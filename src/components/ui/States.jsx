import { CircleAlert, Inbox, Loader2 } from 'lucide-react';

export function LoadingState({ label = 'Memuat data…', fullscreen = false }) {
  return (
    <div className={`state ${fullscreen ? 'state--full' : ''}`} role="status" aria-live="polite">
      <Loader2 className="spin" size={22} aria-hidden="true" />
      <span>{label}</span>
    </div>
  );
}

export function EmptyState({ title = 'Belum ada data', message }) {
  return (
    <div className="state">
      <Inbox size={22} aria-hidden="true" />
      <strong>{title}</strong>
      {message && <span>{message}</span>}
    </div>
  );
}

export function ErrorState({ error, onRetry }) {
  const message = error?.message || 'Data tidak dapat dimuat.';
  return (
    <div className="state state--error" role="alert">
      <CircleAlert size={22} aria-hidden="true" />
      <strong>Gagal memuat data</strong>
      <span>{message}</span>
      {onRetry && (
        <button type="button" className="btn btn--outline btn--sm" onClick={onRetry}>
          Coba lagi
        </button>
      )}
    </div>
  );
}
