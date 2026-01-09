import { useNavigate } from 'react-router-dom';
import { BookOpen, Zap, Trophy, Flame, Layout, Languages, BookText } from 'lucide-react';
import './Landing.css';

export function Landing() {
    const navigate = useNavigate();

    const features = [
        {
            icon: BookOpen,
            title: 'Kamus Lengkap',
            desc: 'Akses ribuan kosakata dari N5 hingga N1 dengan contoh kalimat dan audio native.'
        },
        {
            icon: Languages,
            title: 'Pelajaran Kanji',
            desc: 'Panduan langkah demi langkah untuk menulis dan membaca ribuan karakter Kanji.'
        },
        {
            icon: BookText,
            title: 'Tata Bahasa',
            desc: 'Penjelasan grammar yang komprehensif untuk membantu Anda membentuk kalimat alami.'
        },
        {
            icon: Zap,
            title: 'Sistem SRS',
            desc: 'Algoritma Spaced Repetition yang cerdas untuk memaksimalkan daya ingat hafalan Anda.'
        },
        {
            icon: Trophy,
            title: 'Gamifikasi',
            desc: 'Naikkan level, dapatkan badge, dan pantau statistik belajar Anda setiap hari.'
        },
        {
            icon: Layout,
            title: 'Antarmuka Modern',
            desc: 'Pengalaman belajar yang nyaman dengan desain yang bersih dan responsif.'
        }
    ];

    const scrollToFeatures = () => {
        document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <div className="landing-page">
            <div className="landing-bg-layer"></div>
            {/* Navbar */}
            <header className="landing-header">
                <div className="header-container">
                    <div className="brand" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
                        <div className="brand-icon">M</div>
                        <span className="brand-text">Manabu</span>
                    </div>

                    <nav className="header-nav">
                        <button onClick={scrollToFeatures} className="nav-link">Fitur</button>
                        <button onClick={() => navigate('/kana')} className="nav-link">Belajar Kana</button>
                        <button onClick={() => navigate('/login')} className="nav-link">Kurikulum</button>
                    </nav>

                    <div className="header-actions">
                        <button onClick={() => navigate('/login')} className="btn-login">Masuk</button>
                        <button onClick={() => navigate('/register')} className="btn-register">Daftar</button>
                    </div>
                </div>
            </header>

            {/* Hero */}
            <section className="hero-section">
                <div className="hero-content">
                    <div className="hero-text-container">
                        <div className="hero-title-wrapper">
                            <h1 className="hero-title">
                                Belajar Bahasa Jepang<br />
                                <span className="gradient-text">Tanpa Batas</span>
                            </h1>
                        </div>

                        <p className="hero-desc">
                            Platform belajar bahasa Jepang all-in-one. Kuasai Kosakata, Kanji, dan Tata Bahasa dengan metode yang terstruktur dan menyenangkan.
                        </p>

                        <div className="hero-buttons">
                            <button onClick={() => navigate('/register')} className="vp-button primary">
                                Mulai Sekarang
                            </button>
                            <button onClick={() => navigate('/kana')} className="vp-button secondary">
                                Coba Hiragana
                            </button>
                        </div>
                    </div>

                    {/* Optional: Hero Image or Visual Element */}
                    <div className="hero-image-container">
                        <div className="hero-image-glow"></div>
                        {/* Using a stylized icon representation */}
                        <div style={{
                            position: 'relative',
                            zIndex: 1,
                            background: 'white',
                            padding: '2rem',
                            borderRadius: '24px',
                            boxShadow: '0 20px 50px rgba(0,0,0,0.1)',
                            border: '1px solid rgba(0,0,0,0.05)',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: '1rem',
                            minWidth: '280px'
                        }}>
                            <Flame size={64} className="gradient-text" style={{ color: 'var(--vp-c-brand)' }} />
                            <div style={{ fontSize: '1.2rem', fontWeight: 800 }}>Daily Streak</div>
                            <div style={{ fontSize: '3rem', fontWeight: 900, lineHeight: 1 }}>14</div>
                            <div style={{ fontSize: '0.9rem', color: 'var(--vp-c-text-2)' }}>Hari Berturut-turut</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features */}
            <section id="features" className="features-section">
                <div className="section-container">
                    <div className="features-grid">
                        {features.map((feature, idx) => (
                            <div key={idx} className="feature-card">
                                <div className="feature-icon-box">
                                    <feature.icon size={24} />
                                </div>
                                <h3 className="feature-title">{feature.title}</h3>
                                <p className="feature-desc">{feature.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="vp-footer">
                <div className="section-container">
                    <p className="footer-text">
                        Released under the MIT License.<br />
                        Copyright © 2026 Manabu Application.
                    </p>
                </div>
            </footer>
        </div>
    );
}
