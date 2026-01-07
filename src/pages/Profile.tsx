import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
    User,
    Mail,
    Calendar,
    Flame,
    Trophy,
    Target,
    BookOpen,
    Zap,
    LogOut,
    ArrowLeft,
    Award
} from 'lucide-react';

export function Profile() {
    const navigate = useNavigate();
    const { user, streak, isAuthenticated, logout, isLoading } = useAuth();

    if (isLoading) {
        return (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '400px' }}>
                <p style={{ color: 'var(--color-text-muted)' }}>Memuat...</p>
            </div>
        );
    }

    if (!isAuthenticated) {
        return (
            <div style={{ textAlign: 'center', padding: '48px' }}>
                <User size={48} color="var(--color-text-muted)" style={{ marginBottom: '16px' }} />
                <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '8px' }}>Belum Login</h2>
                <p style={{ color: 'var(--color-text-muted)', marginBottom: '24px' }}>Silakan login untuk melihat profil</p>
                <button onClick={() => navigate('/login')} style={{ padding: '12px 24px', background: 'var(--color-primary)', color: 'white', borderRadius: '8px', fontWeight: '600' }}>
                    Masuk
                </button>
            </div>
        );
    }

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    // Statistics
    const stats = [
        { label: 'Total XP', value: streak?.totalXp?.toLocaleString() || '0', icon: Zap, color: 'var(--color-accent)' },
        { label: 'Streak Sekarang', value: streak?.currentStreak || 0, icon: Flame, color: '#FF6B35' },
        { label: 'Streak Terpanjang', value: streak?.longestStreak || 0, icon: Award, color: 'var(--color-secondary)' },
        { label: 'Pelajaran Hari Ini', value: streak?.todayLessons || 0, icon: Target, color: 'var(--color-primary)' },
    ];

    const learningStats = [
        { label: 'Kosakata Dipelajari', value: 45, total: 800, color: 'var(--color-primary)' },
        { label: 'Kanji Dipelajari', value: 12, total: 103, color: 'var(--color-secondary)' },
        { label: 'Tata Bahasa', value: 8, total: 128, color: 'var(--color-accent)' },
        { label: 'Kana', value: 46, total: 92, color: '#8B5CF6' },
    ];

    return (
        <div style={{ maxWidth: '800px' }}>
            <button onClick={() => navigate('/')} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px', color: 'var(--color-text-muted)', fontSize: '14px', fontWeight: '500' }}>
                <ArrowLeft size={16} />
                Kembali ke Dashboard
            </button>

            {/* Profile Header */}
            <div style={{ background: 'linear-gradient(135deg, var(--color-primary) 0%, #b83a39 100%)', padding: '32px', borderRadius: '24px', color: 'white', marginBottom: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
                    <div style={{ width: '80px', height: '80px', background: 'rgba(255,255,255,0.2)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '32px', fontWeight: 'bold' }}>
                        {user?.name?.charAt(0).toUpperCase() || 'U'}
                    </div>
                    <div>
                        <h1 style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '4px' }}>{user?.name || 'Pelajar'}</h1>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', opacity: 0.9 }}>
                            <Mail size={16} />
                            <span>{user?.email}</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', opacity: 0.9, marginTop: '4px' }}>
                            <BookOpen size={16} />
                            <span>Level {user?.currentLevel || 'N5'}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Stats Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '16px', marginBottom: '24px' }}>
                {stats.map((stat) => (
                    <div key={stat.label} style={{ background: 'white', padding: '20px', borderRadius: '16px', border: '1px solid rgba(0,0,0,0.05)', textAlign: 'center' }}>
                        <stat.icon size={24} color={stat.color} style={{ marginBottom: '8px' }} />
                        <p style={{ fontSize: '28px', fontWeight: 'bold', color: stat.color }}>{stat.value}</p>
                        <p style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>{stat.label}</p>
                    </div>
                ))}
            </div>

            {/* Learning Progress */}
            <div style={{ background: 'white', padding: '24px', borderRadius: '16px', border: '1px solid rgba(0,0,0,0.05)', marginBottom: '24px' }}>
                <h2 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Trophy size={20} color="var(--color-secondary)" />
                    Progres Belajar
                </h2>
                {learningStats.map((stat) => (
                    <div key={stat.label} style={{ marginBottom: '16px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                            <span style={{ fontWeight: '500' }}>{stat.label}</span>
                            <span style={{ fontSize: '14px', color: 'var(--color-text-muted)' }}>{stat.value} / {stat.total}</span>
                        </div>
                        <div style={{ height: '8px', background: '#eee', borderRadius: '4px', overflow: 'hidden' }}>
                            <div style={{ width: `${(stat.value / stat.total) * 100}%`, height: '100%', background: stat.color, borderRadius: '4px' }}></div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Account Section */}
            <div style={{ background: 'white', padding: '24px', borderRadius: '16px', border: '1px solid rgba(0,0,0,0.05)' }}>
                <h2 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '20px' }}>Akun</h2>

                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '16px', background: '#f8f8f8', borderRadius: '12px', marginBottom: '12px' }}>
                    <Calendar size={20} color="var(--color-text-muted)" />
                    <div>
                        <p style={{ fontWeight: '500' }}>Tanggal Bergabung</p>
                        <p style={{ fontSize: '14px', color: 'var(--color-text-muted)' }}>Januari 2024</p>
                    </div>
                </div>

                <button onClick={handleLogout} style={{ width: '100%', padding: '16px', background: '#fee2e2', color: '#dc2626', borderRadius: '12px', fontWeight: '600', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                    <LogOut size={20} />
                    Keluar dari Akun
                </button>
            </div>
        </div>
    );
}
