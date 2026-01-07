import { NavLink, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { BookOpen, LayoutDashboard, Settings, User, LogOut, Flame } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import './Sidebar.css';

export function Sidebar() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { user, streak, isAuthenticated, logout } = useAuth();
    const levels = ['N5', 'N4', 'N3', 'N2', 'N1'];

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <aside className="sidebar">
            <div className="sidebar-header">
                <div className="logo-container">
                    <span className="logo-icon">M</span>
                    <h1 className="logo-text">Manabu</h1>
                </div>
            </div>

            <nav className="sidebar-nav">
                <NavLink to="/" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                    <LayoutDashboard size={20} />
                    <span>{t('sidebar.dashboard')}</span>
                </NavLink>

                <NavLink to="/kana" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                    <span style={{ fontSize: '16px', width: '20px', textAlign: 'center' }}>あ</span>
                    <span>{t('kana.title')}</span>
                </NavLink>

                <div className="nav-section-title">{t('sidebar.levels')}</div>
                {levels.map((level) => (
                    <NavLink
                        key={level}
                        to={`/level/${level}`}
                        className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
                    >
                        <BookOpen size={20} />
                        <span>Level {level}</span>
                    </NavLink>
                ))}

                <div className="nav-divider"></div>

                <NavLink to="/settings" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                    <Settings size={20} />
                    <span>{t('sidebar.settings')}</span>
                </NavLink>
            </nav>

            <div className="sidebar-footer">
                {isAuthenticated ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <NavLink to="/profile" style={{ textDecoration: 'none' }}>
                            <div className="user-info" style={{ cursor: 'pointer' }}>
                                <div className="avatar" style={{ background: 'var(--color-primary)', color: 'white' }}>
                                    {user?.name?.charAt(0).toUpperCase() || 'U'}
                                </div>
                                <div className="user-details">
                                    <span className="user-name">{user?.name || 'Pelajar'}</span>
                                    <span className="user-level" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                        <Flame size={12} color="#FF6B35" />
                                        {streak?.currentStreak || 0} hari • {streak?.totalXp || 0} XP
                                    </span>
                                </div>
                            </div>
                        </NavLink>
                        <button
                            onClick={handleLogout}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                padding: '8px 12px',
                                background: 'rgba(220, 38, 38, 0.1)',
                                color: '#dc2626',
                                borderRadius: '8px',
                                fontSize: '13px',
                                fontWeight: '500',
                                width: '100%',
                                justifyContent: 'center'
                            }}
                        >
                            <LogOut size={16} />
                            Keluar
                        </button>
                    </div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <button
                            onClick={() => navigate('/login')}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                padding: '10px 12px',
                                background: 'var(--color-primary)',
                                color: 'white',
                                borderRadius: '8px',
                                fontSize: '13px',
                                fontWeight: '500',
                                width: '100%',
                                justifyContent: 'center'
                            }}
                        >
                            <User size={16} />
                            Masuk
                        </button>
                    </div>
                )}
            </div>
        </aside>
    );
}

