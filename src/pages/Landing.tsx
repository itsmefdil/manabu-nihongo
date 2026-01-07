import { useNavigate } from 'react-router-dom';
import { BookOpen, Zap, Trophy, Flame, ChevronRight, Star, Languages, ScrollText } from 'lucide-react';
import './Landing.css';

export function Landing() {
    const navigate = useNavigate();

    const features = [
        { icon: BookOpen, title: 'Kamus Kosakata', desc: 'Ribuan kosakata N5-N1 lengkap dengan arti, contoh kalimat, dan audio pelafalan.', color: 'var(--color-primary)' },
        { icon: Languages, title: 'Pelajaran Kanji', desc: 'Pelajari ribuan karakter Kanji dengan panduan gurat (stroke order) dan cara baca.', color: '#8E44AD' },
        { icon: ScrollText, title: 'Tata Bahasa', desc: 'Panduan grammar terstruktur untuk memahami struktur kalimat bahasa Jepang.', color: '#27AE60' },
        { icon: Zap, title: 'Flashcard SRS', desc: 'Hafal lebih cepat dengan sistem Spaced Repetition yang menyesuaikan jadwal review.', color: 'var(--color-accent)' },
        { icon: Trophy, title: 'Lacak Progress', desc: 'Pantau statistik belajar detil untuk melihat area mana yang perlu ditingkatkan.', color: 'var(--color-secondary)' },
        { icon: Flame, title: 'Daily Streak', desc: 'Bangun konsistensi belajar dengan mempertahankan api semangat (streak) setiap hari.', color: '#FF6B35' },
    ];

    const levels = [
        { level: 'N5', desc: 'Pemula - Dasar', vocab: '800', kanji: '103' },
        { level: 'N4', desc: 'Dasar Lanjut', vocab: '1500', kanji: '181' },
        { level: 'N3', desc: 'Menengah', vocab: '3750', kanji: '361' },
        { level: 'N2', desc: 'Mahir', vocab: '6000', kanji: '610' },
        { level: 'N1', desc: 'Ahli', vocab: '10000', kanji: '2136' },
    ];

    const scrollToSection = (id: string) => {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <div className="landing-page">
            {/* Header */}
            <header className="landing-header">
                <div className="header-container">
                    <div className="brand" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} style={{ cursor: 'pointer' }}>
                        <div className="brand-icon">M</div>
                        <span className="brand-text">Manabu</span>
                    </div>

                    <nav className="header-nav">
                        <button onClick={() => scrollToSection('features')} className="nav-link">Fitur</button>
                        <button onClick={() => scrollToSection('curriculum')} className="nav-link">Kurikulum</button>
                        <button onClick={() => scrollToSection('kana')} className="nav-link">Kana</button>
                    </nav>

                    <div className="header-actions">
                        <button onClick={() => navigate('/login')} className="btn-login">
                            Masuk
                        </button>
                        <button onClick={() => navigate('/register')} className="btn-register">
                            Daftar Gratis
                        </button>
                    </div>
                </div>
            </header>

            {/* Hero Section */}
            <section className="hero-section">
                <div className="hero-bg-pattern"></div>
                <div className="hero-content">
                    <div className="hero-icon">🇯🇵</div>
                    <h1 className="hero-title">
                        Belajar Bahasa Jepang<br />dengan Cara yang Menyenangkan
                    </h1>
                    <p className="hero-desc">
                        Kuasai kosakata, kanji, dan tata bahasa Jepang dari level N5 hingga N1 dengan metode belajar interaktif yang terbukti efektif.
                    </p>
                    <div className="hero-buttons">
                        <button onClick={() => navigate('/register')} className="btn-primary-lg">
                            Mulai Belajar <ChevronRight size={20} />
                        </button>
                        <button onClick={() => navigate('/kana')} className="btn-secondary-lg">
                            Coba Hiragana
                        </button>
                    </div>
                </div>
            </section>

            {/* Features */}
            <section id="features" className="section section-container">
                <h2 className="section-title">Fitur Unggulan</h2>
                <p className="section-desc">
                    Manabu didesain untuk membuat perjalanan belajarmu lebih mudah, terstruktur, dan tentu saja menyenangkan.
                </p>
                <div className="features-grid">
                    {features.map((f) => (
                        <div key={f.title} className="feature-card">
                            <div className="feature-icon-wrapper" style={{ background: `${f.color}15` }}>
                                <f.icon size={32} color={f.color} />
                            </div>
                            <h3 className="feature-title">{f.title}</h3>
                            <p className="feature-desc">{f.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Levels Preview */}
            <section id="curriculum" className="section levels-bg">
                <div className="section-container">
                    <h2 className="section-title">Kurikulum JLPT Lengkap</h2>
                    <p className="section-desc">
                        Materi kami disusun berdasarkan standar JLPT (Japanese Language Proficiency Test) untuk memastikan kamu siap ujian.
                    </p>
                    <div className="levels-grid">
                        {levels.map((l, i) => (
                            <div key={l.level} className={`level-card ${i === 0 ? 'active' : 'inactive'}`}>
                                <p className="level-title">{l.level}</p>
                                <p className="level-desc">{l.desc}</p>
                                <div className="level-stats">
                                    <span>{l.vocab} Kata</span>
                                    <span>{l.kanji} Kanji</span>
                                </div>
                                {i === 0 && (
                                    <div style={{ marginTop: '16px', fontSize: '12px', background: 'rgba(255,255,255,0.2)', padding: '4px 8px', borderRadius: '4px', display: 'inline-block' }}>
                                        Mulai dari sini!
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Kana Preview */}
            <section id="kana" className="section section-container">
                <div className="kana-section-grid">
                    <div className="kana-content">
                        <h2>Mulai dari Dasar:<br />Hiragana & Katakana</h2>
                        <p>
                            Pondasi bahasa Jepang ada pada aksaranya. Jangan khawatir jika kamu pemula total, kami punya modul khusus untuk membantumu menghafal karakter Kana dalam waktu singkat dengan mnemonik dan latihan tulis.
                        </p>
                        <button onClick={() => navigate('/kana')} style={{ padding: '14px 28px', background: 'var(--color-secondary)', color: 'white', borderRadius: '12px', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '16px', transition: 'transform 0.2s', boxShadow: '0 4px 12px rgba(46, 92, 110, 0.2)' }}>
                            Pelajari Kana Sekarang <ChevronRight size={18} />
                        </button>
                    </div>
                    <div className="kana-demo-grid">
                        {['あ', 'い', 'う', 'え', 'お'].map((char) => (
                            <div key={char} className="kana-box">
                                {char}
                            </div>
                        ))}
                        {['か', 'き', 'く', 'け', 'こ'].map((char) => (
                            <div key={char} className="kana-box">
                                {char}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="cta-section">
                <div className="cta-container">
                    <Star size={56} style={{ marginBottom: '24px', opacity: 0.9, filter: 'drop-shadow(0 0 10px rgba(255,255,255,0.5))' }} />
                    <h2 className="cta-title">Siap Menjadi Fasih?</h2>
                    <p className="cta-desc">
                        Gabung dengan ribuan pelajar lainnya dan mulai petualangan bahasa Jepangmu hari ini. Gratis!
                    </p>
                    <button onClick={() => navigate('/register')} className="btn-cta">
                        Buat Akun Sekarang
                    </button>
                </div>
            </section>

            {/* Footer */}
            <footer className="footer">
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '16px', opacity: 0.7 }}>
                    <span style={{ fontWeight: 'bold' }}>Manabu Application</span>
                </div>
                <p>© 2026 Manabu. Dibuat dengan ❤️ untuk komunitas pelajar bahasa Jepang.</p>
                <p style={{ marginTop: '12px', fontSize: '12px', opacity: 0.5 }}>Version 0.1.0 Beta</p>
            </footer>
        </div>
    );
}
