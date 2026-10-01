
import { useState } from 'react'
import './login.css'
import icon from '../../assets/login/Icon.svg'
import satu from '../../assets/login/1.svg'
import dua from '../../assets/login/2.svg'
import tiga from '../../assets/login/3.svg'
import logo from '../../assets/login/LOGO UTAMA.PNG'
import arrow from '../../assets/login/arrow.svg'
import user from '../../assets/login/notif.svg'
import error from '../../assets/login/Vector.svg'
import chat from '../../assets/login/chat.svg'
import password from '../../assets/login/password.svg'

function Login() {
    const [showPassword, setShowPassword] = useState(false);

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

            <div className="login-right">
                <div className="form-top">
                    <div className="form-group">
                    <label htmlFor="username"><p>Nama lengkap & Gelar</p></label>
                    <input type="text" id="username" name="username" placeholder="Masukkan nama lengkap & gelar" />
                    <span classname = "form-hint">Sesuai nama pada SK Pengangkatan Pamong atau Surat Tugas Resmi.</span>
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
                />

                <button 
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                >
                    <img src={password} alt="Tampilkan password" />
                </button>
            </div>
        </div>
                </div>
                <div className="password-bottom">
                    <div className="checkbox-group">
                        <input type="checkbox" id="remember" />
                        <label htmlFor="remember">Ingat sesi saya di perangkat ini.</label>
                    </div>
                    <div className="forgot-pass">
                        <a href="#">Lupa password?</a>
                    </div>
                </div>
                
                <div className="button-login">
                    <button type="submit">Masuk ke SIMONIKA <img src={arrow} alt="Arrow" /></button>
                </div>
                <div className="card-login-bottom">
                    <div className="card-first-login">
                        <img src={user} alt="User" />
                        <div className="text-bottom">
                            <h3>PEMBERITAHUAN AKUN KEDINASAN</h3>
                            <p>Akun pamong diterbitkan langsung oleh Administrator Sistem Kalurahan
                                Hargomulyo sesuai SK Jabatan. Belum memiliki akun atau butuh reset akses?
                                Hubungi Admin Kalurahan / Carik.</p>
                        </div>
                    </div>
                    <div className="card-second-login">
                        <img src={error} alt="Error" />
                        <div className="group-login-bottom">
                            <div className="text-bottom">
                                <h3>Kendala Akun & Akses Masuk?</h3>
                                <p>Administrator Kalurahan / Layanan Pamong
                                    Hargomulyo</p>
                            </div>
                            <div className="button-login-bottom">
                                <button type="submit">
                                    <img src={chat} alt="Chat" />
                                    +62 123 - 456 - 789</button>
                            </div>
                        </div>
                        
                    </div>
                    
                </div>
            </div>
        </div>
    </div>
    )
}
export default Login 