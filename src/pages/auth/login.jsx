
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import './login.css'
import icon from '../../assets/login/Icon.svg'
import satu from '../../assets/login/1.svg'
import dua from '../../assets/login/2.svg'
import tiga from '../../assets/login/3.svg'
import logo from '../../assets/login/LOGO UTAMA.PNG'
import arrow from '../../assets/login/arrow.svg'
import userIcon from '../../assets/login/notif.svg'
import errorIcon from '../../assets/login/Vector.svg'
import chat from '../../assets/login/chat.svg'
import passwordIcon from '../../assets/login/password.svg'
import { useAuth } from '../../context/AuthContext'

function Login() {
    const [showPassword, setShowPassword] = useState(false);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');

    const navigate = useNavigate();
    const { login, user, status } = useAuth() || {};

    useEffect(() => {
        if (status === 'authenticated' && user) {
            if (user.role === 'admin') navigate('/dashboardadmin');
            else if (user.role === 'lurah') navigate('/dashboardlurah');
            else navigate('/dashboardpamong');
        }
    }, [status, user, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErrorMsg('');
        try {
            const loginUser = username.trim() || 'Pamong Hargomulyo';
            const loginPass = password || 'password123';
            const loggedIn = await login({ username: loginUser, password: loginPass });
            if (loggedIn?.role === 'admin') {
                navigate('/dashboardadmin');
            } else if (loggedIn?.role === 'lurah') {
                navigate('/dashboardlurah');
            } else {
                navigate('/dashboardpamong');
            }
        } catch (err) {
            setErrorMsg(err?.message || 'Gagal masuk. Periksa kembali akun Anda.');
        } finally {
            setLoading(false);
        }
    };

    return (
    <div className="login">
        <div className="card-login">
            <div className="login-left">
                <div className="label-top"><img src={icon} alt="" /> Portal Resmi Aparatur Kalurahan Hargomulyo</div>
                <h1>Masuk ke Portal SIMONIKA</h1>
                <p>Sistem Informasi Monitoring Kinerja dan Akuntabilitas
                    Pamong Terpadu. Masuk untuk melakukan presensi
                    pintar berbasis geofencing balai, mengisi agenda
                    kerja, dan laporan harian kinerja.</p>
                <div className="poin-login">
                    <div className="inti-poin">
                        <img src={satu} alt="" />
                        <div className="group-poin-login">
                            <h3>Pilih Peran & Jabatan SOTK</h3>
                            <p>Kredensial otomatis terpetakan untuk Pamong, Dukuh,
                                Carik, Lurah, atau Operator.</p>
                        </div>
                    </div>
                    <div className="inti-poin">
                        <img src={dua} alt="" />
                        <div className="group-poin-login">
                            <h3>Validasi Geofencing Otomatis</h3>
                            <p>Presensi lokasi GPS presisi Balai Kalurahan Hargomulyo
                                & Wilayah Padukuhan Kokap.</p>
                        </div>
                    </div>
                    <div className="inti-poin">
                        <img src={tiga} alt="" />
                        <div className="group-poin-login">
                            <h3>Terkoneksi TUKIN & Realisasi</h3>
                            <p>Rekapitulasi tunjangan kinerja objektif, tepat waktu, dan
                                transparan sesuai regulasi.</p>
                        </div>
                    </div>
                </div>
                <hr />
                <div className="logo-login">
                    <img src={logo} alt="Logo" />
                    <p>Pemerintah Kalurahan Hargomulyo, Kapanewon Kokap</p>
                </div>
            </div>

            <form className="login-right" onSubmit={handleSubmit}>
                <div className="form-top">
                    {errorMsg && (
                        <div style={{ color: '#b42318', backgroundColor: '#fef3f2', border: '1px solid #fecdca', padding: '10px 14px', borderRadius: '8px', fontSize: '13px', marginBottom: '14px' }}>
                            {errorMsg}
                        </div>
                    )}
                    <div className="form-group">
                        <label htmlFor="username"><p>Nama lengkap & Gelar</p></label>
                        <input 
                            type="text" 
                            id="username" 
                            name="username" 
                            placeholder="Masukkan nama lengkap & gelar (contoh: pamong / admin / lurah)" 
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                        <span className="form-hint" style={{ fontSize: '11.5px', color: '#6b7280', marginTop: '4px', display: 'block' }}>
                            Sesuai nama pada SK Pengangkatan Pamong atau Surat Tugas Resmi.
                        </span>
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">
                            <p>Password</p>
                        </label>

                        <div className="password-input">
                            <input
                                type={showPassword ? "text" : "password"}
                                id="password"
                                name="password"
                                placeholder="Masukkan password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />

                            <button 
                                type="button"
                                className="password-toggle"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                <img src={passwordIcon} alt="Tampilkan password" />
                            </button>
                        </div>
                    </div>
                </div>
                <div className="password-bottom">
                    <div className="checkbox-group">
                        <input type="checkbox" id="remember" defaultChecked />
                        <label htmlFor="remember">Ingat sesi saya di perangkat ini.</label>
                    </div>
                    <div className="forgot-pass">
                        <a href="#lupa" onClick={(e) => { e.preventDefault(); alert("Silakan hubungi Administrator Kalurahan / Carik untuk reset akses."); }}>Lupa password?</a>
                    </div>
                </div>
                
                <div className="button-login">
                    <button type="submit" disabled={loading}>
                        {loading ? 'Memeriksa Kredensial...' : 'Masuk ke SIMONIKA'} <img src={arrow} alt="Arrow" />
                    </button>
                </div>
                <div className="card-login-bottom">
                    <div className="card-first-login">
                        <img src={userIcon} alt="User" />
                        <div className="text-bottom">
                            <h3>PEMBERITAHUAN AKUN KEDINASAN</h3>
                            <p>Akun pamong diterbitkan langsung oleh Administrator Sistem Kalurahan
                                Hargomulyo sesuai SK Jabatan. Belum memiliki akun atau butuh reset akses?
                                Hubungi Admin Kalurahan / Carik.</p>
                        </div>
                    </div>
                    <div className="card-second-login">
                        <img src={errorIcon} alt="Error" />
                        <div className="group-login-bottom">
                            <div className="text-bottom">
                                <h3>Kendala Akun & Akses Masuk?</h3>
                                <p>Administrator Kalurahan / Layanan Pamong Hargomulyo</p>
                            </div>
                            <div className="button-login-bottom">
                                <button type="button">
                                    <img src={chat} alt="Chat" />
                                    +62 123 - 456 - 789
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    </div>
    )
}
export default Login 