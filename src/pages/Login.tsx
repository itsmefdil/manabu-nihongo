import { useState, type FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export function Login() {
    const navigate = useNavigate();
    const { login, isLoading } = useAuth();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError('');
        setSubmitting(true);

        const result = await login(email, password);
        if (result.success) {
            navigate('/');
        } else {
            setError(result.error || 'Login gagal');
        }
        setSubmitting(false);
    };

    if (isLoading) {
        return <div style={{ textAlign: 'center', padding: '48px' }}>Loading...</div>;
    }

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(135deg, #f8f8f8 0%, #fff 100%)',
            padding: '24px'
        }}>
            <div style={{
                width: '100%',
                maxWidth: '400px',
                background: 'white',
                borderRadius: '24px',
                padding: '48px 32px',
                boxShadow: '0 10px 40px rgba(0,0,0,0.1)'
            }}>
                <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                    <div style={{ fontSize: '48px', marginBottom: '8px' }}>📚</div>
                    <h1 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '8px' }}>Manabu</h1>
                    <p style={{ color: 'var(--color-text-muted)' }}>Masuk ke akunmu</p>
                </div>

                {error && (
                    <div style={{
                        padding: '12px 16px',
                        background: '#fee2e2',
                        color: '#dc2626',
                        borderRadius: '8px',
                        marginBottom: '16px',
                        fontSize: '14px'
                    }}>
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: '16px' }}>
                        <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '8px' }}>Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            autoComplete="email"
                            style={{
                                width: '100%',
                                padding: '12px 16px',
                                borderRadius: '8px',
                                border: '1px solid #ddd',
                                fontSize: '16px'
                            }}
                        />
                    </div>

                    <div style={{ marginBottom: '24px' }}>
                        <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '8px' }}>Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            autoComplete="current-password"
                            style={{
                                width: '100%',
                                padding: '12px 16px',
                                borderRadius: '8px',
                                border: '1px solid #ddd',
                                fontSize: '16px'
                            }}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={submitting}
                        style={{
                            width: '100%',
                            padding: '14px',
                            background: 'var(--color-primary)',
                            color: 'white',
                            borderRadius: '8px',
                            fontWeight: '600',
                            fontSize: '16px',
                            opacity: submitting ? 0.7 : 1,
                            cursor: submitting ? 'not-allowed' : 'pointer'
                        }}
                    >
                        {submitting ? 'Masuk...' : 'Masuk'}
                    </button>
                </form>

                <p style={{ textAlign: 'center', marginTop: '24px', fontSize: '14px', color: 'var(--color-text-muted)' }}>
                    Belum punya akun? <Link to="/register" style={{ color: 'var(--color-primary)', fontWeight: '500' }}>Daftar</Link>
                </p>
            </div>
        </div>
    );
}
