import { useEffect, useState } from 'react';
import { DollarSign, Loader2, Lock, MapPin, User } from 'lucide-react';
import Modal from '../ui/Modal.jsx';
import { DATA_MASTER_CAPS as CAPS, dataMasterService } from '../../services/dataMasterService.js';
import { ApiError, errorMessage } from '../../services/apiClient.js';
import { JABATAN_OPTIONS } from '../../config/presensi.js';

const ROLE_OPTIONS = [{ v: 'pamong', l: 'Pamong' }, { v: 'lurah', l: 'Lurah' }];
const EMPTY = { nama: '', role: '', jabatan: '', nip: '', wilayah: '', username: '', password: '', targetKegiatan: 20, paguTukin: 2200000 };

function Field({ id, label, required, error, hint, children }) {
  return (
    <div className="field">
      <label htmlFor={id}>{label}{required && <span className="req" aria-hidden="true">*</span>}</label>
      {children}
      {hint && <p className="field__hint">{hint}</p>}
      {error && <p id={`${id}-err`} className="field__error">{error}</p>}
    </div>
  );
}

// item === null -> tambah; item terisi -> ubah (password opsional).
export default function AparaturFormModal({ item, onClose, onSuccess }) {
  const editing = Boolean(item);
  const [f, setF] = useState(editing ? { ...EMPTY, ...item, password: '' } : EMPTY);
  const [errors, setErrors] = useState({});
  const [busy, setBusy] = useState(false);
  const [formError, setFormError] = useState('');
  const [targets, setTargets] = useState({}); // jabatan -> target bulanan (dari backend)
  useEffect(() => {
    dataMasterService.getJabatan().then((l) => setTargets(Object.fromEntries(l.map((j) => [j.jabatan, j.target])))).catch(() => {});
  }, []);
  const lockIdentity = editing && !CAPS.editIdentity; // backend tidak mengubah role & username
  const set = (e) => setF((s) => ({ ...s, [e.target.name]: e.target.value }));
  const a11y = (k) => ({ 'aria-invalid': Boolean(errors[k]), 'aria-describedby': errors[k] ? `${k}-err` : undefined });

  const validate = () => {
    const er = {};
    if (!f.nama.trim()) er.nama = 'Nama lengkap wajib diisi.';
    if (!f.role) er.role = 'Peran akses wajib dipilih.';
    if (!f.jabatan) er.jabatan = 'Jabatan resmi wajib dipilih.';
    if (!f.username.trim()) er.username = 'Username wajib diisi.';
    else if (!/^[A-Za-z0-9_.-]+$/.test(f.username.trim())) er.username = 'Gunakan huruf, angka, titik, strip, atau garis bawah (tanpa spasi).';
    if (!editing && !f.password) er.password = 'Password wajib diisi.';
    if (CAPS.targetPerUser && (f.targetKegiatan === '' || Number(f.targetKegiatan) < 0 || Number.isNaN(Number(f.targetKegiatan)))) er.targetKegiatan = 'Isi angka 0 atau lebih.';
    if (f.paguTukin === '' || Number(f.paguTukin) < 0 || Number.isNaN(Number(f.paguTukin))) er.paguTukin = 'Isi angka 0 atau lebih.';
    return er;
  };

  const submit = async (e) => {
    e.preventDefault();
    const er = validate();
    setErrors(er); setFormError('');
    if (Object.keys(er).length) return;
    const payload = {
      nama: f.nama.trim(), role: f.role, jabatan: f.jabatan, nip: f.nip.trim(), wilayah: f.wilayah.trim(),
      username: f.username.trim(), targetKegiatan: Number(f.targetKegiatan), paguTukin: Number(f.paguTukin),
    };
    if (f.password) payload.password = f.password; // tidak pernah disimpan di frontend
    setBusy(true);
    try {
      const res = editing ? await dataMasterService.update(item.id, payload, item) : await dataMasterService.create(payload);
      onSuccess(res, editing);
    } catch (err) {
      const fieldErrs = err instanceof ApiError ? err.data?.errors : null;
      if (fieldErrs && typeof fieldErrs === 'object') {
        setErrors(Object.fromEntries(Object.entries(fieldErrs).map(([k, v]) => [k, Array.isArray(v) ? v[0] : v])));
      }
      setFormError(errorMessage(err));
      setBusy(false);
    }
  };

  return (
    <Modal title={editing ? 'Ubah Aparatur / User SOTK' : 'Tambah Aparatur / User Baru SOTK'} onClose={onClose} busy={busy} closable>
      <form onSubmit={submit} noValidate className="form-stack" id="aparatur-form">
        <h3 className="form-section"><User size={14} aria-hidden="true" /> 1. IDENTITAS &amp; HAK AKSES SOTK</h3>
        <div className="two-col">
          <Field id="nama" label="Nama Lengkap & Gelar" required error={errors.nama}>
            <input id="nama" name="nama" placeholder="Contoh: Budi Santoso, S.Sos" value={f.nama} onChange={set} {...a11y('nama')} />
          </Field>
          <Field id="role" label="Role / Peran Akses" required error={errors.role} hint={lockIdentity ? 'Tidak dapat diubah setelah akun dibuat.' : undefined}>
            <select id="role" name="role" value={f.role} onChange={set} disabled={lockIdentity} {...a11y('role')}>
              <option value="">Pilih Peran Akses</option>
              {ROLE_OPTIONS.map((r) => <option key={r.v} value={r.v}>{r.l}</option>)}
            </select>
          </Field>
          <Field id="jabatan" label="Jabatan Resmi SOTK" required error={errors.jabatan}>
            <select id="jabatan" name="jabatan" value={f.jabatan} onChange={set} {...a11y('jabatan')}>
              <option value="">Pilih Jabatan Resmi</option>
              {JABATAN_OPTIONS.map((j) => <option key={j} value={j}>{j}</option>)}
            </select>
          </Field>
          <Field id="nip" label="NIP (Nomor Induk Pamong)" error={errors.nip} hint={!CAPS.nip ? 'Belum tersedia di backend; tidak disimpan.' : undefined}>
            <input id="nip" name="nip" placeholder="Contoh: 19800512 200801 1 003" value={f.nip} onChange={set} inputMode="numeric" disabled={!CAPS.nip} />
          </Field>
        </div>
        <Field id="wilayah" label="Wilayah Penugasan / Padukuhan" error={errors.wilayah}>
          <div className="input-icon"><MapPin size={16} aria-hidden="true" />
            <input id="wilayah" name="wilayah" placeholder="Contoh: Tapen / Priyangan / Pusat Kalurahan" value={f.wilayah} onChange={set} /></div>
        </Field>

        <h3 className="form-section"><Lock size={14} aria-hidden="true" /> 2. KREDENSIAL MASUK (TANPA EMAIL)</h3>
        <div className="two-col">
          <Field id="username" label="Username" required error={errors.username} hint={lockIdentity ? 'Tidak dapat diubah setelah akun dibuat.' : undefined}>
            <div className="input-icon"><User size={16} aria-hidden="true" />
              <input id="username" name="username" autoComplete="off" placeholder="Contoh: jagabaya / dukuh_tapen" value={f.username} onChange={set} disabled={lockIdentity} {...a11y('username')} /></div>
          </Field>
          <Field id="password" label="Password" required={!editing} error={errors.password} hint={editing ? 'Kosongkan jika tidak ingin mengubah password.' : undefined}>
            <div className="input-icon"><Lock size={16} aria-hidden="true" />
              <input id="password" name="password" type="password" autoComplete="new-password" placeholder="Contoh: password123" value={f.password} onChange={set} {...a11y('password')} /></div>
          </Field>
        </div>

        <h3 className="form-section"><DollarSign size={14} aria-hidden="true" /> 3. PARAMETER TUNJANGAN KINERJA (TUKIN) &amp; BEBAN KERJA</h3>
        <div className="two-col">
          <Field id="targetKegiatan" label="Target Kegiatan Bulanan (Laporan/Bulan)" error={errors.targetKegiatan} hint={CAPS.targetPerUser ? 'Standar SOTK Hargomulyo: Carik: 35 | Kasi/Kaur: 30 | Dukuh: 24 kegiatan/bulan' : 'Mengikuti beban kerja minimal jabatan yang dipilih (diatur di master jabatan).'}>
            <input id="targetKegiatan" name="targetKegiatan" type="number" min="0" value={CAPS.targetPerUser ? f.targetKegiatan : (targets[f.jabatan] ?? '')} onChange={set} readOnly={!CAPS.targetPerUser} placeholder={CAPS.targetPerUser ? undefined : 'Pilih jabatan'} {...a11y('targetKegiatan')} />
          </Field>
          <Field id="paguTukin" label="Base Pagu TUKIN Maksimal (Rupiah/Bulan)" error={errors.paguTukin} hint="Pagu TUKIN setiap pegawai dapat disesuaikan oleh Admin">
            <div className="input-prefix"><span aria-hidden="true">Rp</span>
              <input id="paguTukin" name="paguTukin" type="number" min="0" value={f.paguTukin} onChange={set} {...a11y('paguTukin')} /></div>
          </Field>
        </div>
        {formError && <p className="form-error" role="alert">{formError}</p>}
        <div className="form-actions">
          <button type="button" className="btn btn--danger" onClick={onClose} disabled={busy}>Batal</button>
          <button type="submit" className="btn btn--primary" disabled={busy}>
            {busy && <Loader2 size={16} className="spin" aria-hidden="true" />} {busy ? 'Menyimpan…' : 'Simpan Data Aparatur'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
