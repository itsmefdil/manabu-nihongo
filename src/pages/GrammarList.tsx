import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, ChevronDown, ChevronUp, Loader } from 'lucide-react';
import { contentApi } from '../api';
import type { Grammar } from '../api';

export function GrammarList() {
    const { level } = useParams<{ level: string }>();
    const navigate = useNavigate();
    const { t } = useTranslation();
    const [grammarList, setGrammarList] = useState<Grammar[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [expandedId, setExpandedId] = useState<string | null>(null);

    useEffect(() => {
        const fetchGrammar = async () => {
            if (!level) return;
            setIsLoading(true);
            try {
                const result = await contentApi.getGrammar(level);
                if (result.success && result.data) {
                    setGrammarList(result.data);
                } else {
                    setError('Gagal memuat tata bahasa.');
                }
            } catch (err) {
                setError('Terjadi kesalahan saat memuat data.');
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchGrammar();
    }, [level]);

    const toggleExpand = (id: string) => {
        setExpandedId(expandedId === id ? null : id);
    };

    if (isLoading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
                <Loader size={32} style={{ animation: 'spin 1s linear infinite' }} />
            </div>
        );
    }

    if (error) {
        return (
            <div style={{ textAlign: 'center', padding: '48px', color: 'var(--color-text-muted)' }}>
                <p>{error}</p>
                <button
                    onClick={() => navigate(-1)}
                    style={{ marginTop: '16px', color: 'var(--color-primary)', fontWeight: '600' }}
                >
                    Kembali
                </button>
            </div>
        );
    }

    return (
        <div>
            <button
                onClick={() => navigate(-1)}
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    marginBottom: '24px',
                    color: 'var(--color-text-muted)',
                    fontSize: '14px',
                    fontWeight: '500'
                }}
            >
                <ArrowLeft size={16} />
                {t('common.back', { level })}
            </button>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                <h1 style={{ fontSize: '28px', fontWeight: 'bold' }}>{t('grammar.title')}</h1>
                <span style={{
                    background: 'rgba(236, 163, 40, 0.1)',
                    color: 'var(--color-accent)',
                    padding: '4px 12px',
                    borderRadius: '99px',
                    fontWeight: '600',
                    fontSize: '14px'
                }}>
                    {grammarList.length} {t('common.patterns')}
                </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {grammarList.map((item) => (
                    <div key={item.id} style={{
                        background: 'white',
                        borderRadius: '12px',
                        boxShadow: 'var(--shadow-sm)',
                        border: '1px solid rgba(0,0,0,0.05)',
                        overflow: 'hidden'
                    }}>
                        <button
                            onClick={() => toggleExpand(item.id)}
                            style={{
                                width: '100%',
                                padding: '20px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                textAlign: 'left'
                            }}
                        >
                            <div>
                                <p style={{ fontSize: '18px', fontWeight: 'bold', color: 'var(--color-accent)', marginBottom: '4px' }}>{item.pattern}</p>
                                <p style={{ fontSize: '14px', color: 'var(--color-text-muted)' }}>{item.meaning}</p>
                            </div>
                            {expandedId === item.id ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                        </button>

                        {expandedId === item.id && (
                            <div style={{
                                padding: '0 20px 20px 20px',
                                borderTop: '1px solid #eee'
                            }}>
                                <p style={{ fontSize: '14px', marginBottom: '16px', marginTop: '16px' }}>{item.usage}</p>

                                <p style={{ fontSize: '12px', color: 'var(--color-text-muted)', marginBottom: '8px' }}>Contoh</p>
                                {item.examples.map((ex, i) => (
                                    <div key={i} style={{
                                        padding: '12px 16px',
                                        background: '#f8f8f8',
                                        borderRadius: '8px',
                                        marginBottom: '8px'
                                    }}>
                                        <p style={{ fontWeight: '600', marginBottom: '4px' }}>{ex.sentence}</p>
                                        <p style={{ fontSize: '14px', color: 'var(--color-text-muted)' }}>{ex.meaning}</p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                ))}

                {grammarList.length === 0 && (
                    <p style={{ color: 'var(--color-text-muted)', textAlign: 'center' }}>{t('grammar.noContent')}</p>
                )}
            </div>
        </div>
    );
}
