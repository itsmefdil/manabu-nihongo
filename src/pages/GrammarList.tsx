import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, ChevronDown, ChevronUp, Loader, Lightbulb, Search } from 'lucide-react';
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
    const [searchQuery, setSearchQuery] = useState('');

    const filteredList = grammarList.filter(item => {
        const query = searchQuery.toLowerCase();
        return (
            item.pattern.toLowerCase().includes(query) ||
            item.meaning.toLowerCase().includes(query) ||
            item.usage.toLowerCase().includes(query)
        );
    });

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
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div style={{ position: 'relative' }}>
                        <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
                        <input
                            type="text"
                            placeholder="Cari tata bahasa..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            style={{
                                padding: '8px 16px 8px 40px',
                                borderRadius: '99px',
                                border: '1px solid rgba(0,0,0,0.1)',
                                fontSize: '14px',
                                width: '240px',
                                outline: 'none'
                            }}
                        />
                    </div>
                    <span style={{
                        background: 'rgba(236, 163, 40, 0.1)',
                        color: 'var(--color-accent)',
                        padding: '4px 12px',
                        borderRadius: '99px',
                        fontWeight: '600',
                        fontSize: '14px'
                    }}>
                        {filteredList.length} {t('common.patterns')}
                    </span>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '32px', alignItems: 'start' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {filteredList.map((item) => (
                        <div key={item.id} style={{
                            background: 'white',
                            borderRadius: '16px',
                            boxShadow: 'var(--shadow-sm)',
                            border: '1px solid rgba(0,0,0,0.05)',
                            overflow: 'hidden'
                        }}>
                            <button
                                onClick={() => toggleExpand(item.id)}
                                style={{
                                    width: '100%',
                                    padding: '24px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    textAlign: 'left',
                                    background: 'transparent',
                                    border: 'none',
                                    cursor: 'pointer'
                                }}
                            >
                                <div>
                                    <p style={{ fontSize: '20px', fontWeight: 'bold', color: 'var(--color-accent)', marginBottom: '8px' }}>{item.pattern}</p>
                                    <p style={{ fontSize: '16px', color: 'var(--color-text-main)' }}>{item.meaning}</p>
                                </div>
                                {expandedId === item.id ? <ChevronUp size={24} color="var(--color-text-muted)" /> : <ChevronDown size={24} color="var(--color-text-muted)" />}
                            </button>

                            {expandedId === item.id && (
                                <div style={{
                                    padding: '0 24px 24px 24px',
                                    borderTop: '1px solid #f0f0f0'
                                }}>
                                    <div style={{
                                        marginTop: '16px',
                                        padding: '12px',
                                        background: '#fffbf0',
                                        borderRadius: '8px',
                                        color: '#b45309',
                                        fontSize: '14px',
                                        fontWeight: '500',
                                        marginBottom: '20px',
                                        display: 'inline-block'
                                    }}>
                                        💡 {item.usage}
                                    </div>

                                    <p style={{ fontSize: '13px', fontWeight: 'bold', color: 'var(--color-text-muted)', textTransform: 'uppercase', marginBottom: '12px', letterSpacing: '0.5px' }}>Contoh Penggunaan</p>

                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                        {item.examples.map((ex, i) => (
                                            <div key={i} style={{
                                                padding: '16px',
                                                background: '#f8f8f8',
                                                borderRadius: '12px',
                                                borderLeft: '4px solid var(--color-accent)'
                                            }}>
                                                <p style={{ fontSize: '16px', fontWeight: '600', marginBottom: '4px' }}>{ex.sentence}</p>
                                                <p style={{ fontSize: '14px', color: 'var(--color-text-muted)' }}>{ex.meaning}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}

                    {filteredList.length === 0 && (
                        <div style={{ padding: '40px', textAlign: 'center', background: 'white', borderRadius: '16px' }}>
                            <p style={{ color: 'var(--color-text-muted)' }}>{t('grammar.noContent')}</p>
                        </div>
                    )}
                </div>

                <div style={{
                    position: 'sticky',
                    top: '24px',
                    background: '#fffbf0',
                    padding: '24px',
                    borderRadius: '16px',
                    border: '1px solid rgba(236, 163, 40, 0.2)'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px', color: 'var(--color-accent)' }}>
                        <Lightbulb size={24} />
                        <h3 style={{ fontSize: '18px', fontWeight: 'bold' }}>Tips Belajar Tata Bahasa</h3>
                    </div>
                    <ul style={{ display: 'flex', flexDirection: 'column', gap: '12px', paddingLeft: '20px', fontSize: '14px', color: 'var(--color-text-main)', lineHeight: '1.6' }}>
                        <li>
                            <strong>Pola Kalimat:</strong> Bahasa Jepang memiliki struktur SOV (Subjek - Objek - Predikat). Hafalkan pola dasarnya.
                        </li>
                        <li>
                            <strong>Partikel adalah Kunci:</strong> Partikel (wa, ga, wo, ni) menentukan hubungan antar kata. Perhatikan baik-baik!
                        </li>
                        <li>
                            <strong>Latihan Membuat Kalimat:</strong> Jangan cuma baca, coba buat kalimat sendiri menggunakan pola yang baru dipelajari.
                        </li>
                        <li>
                            <strong>Jangan Takut Salah:</strong> Tata bahasa Jepang unik dan berbeda dari Indonesia/Inggris. Wajar jika butuh waktu untuk terbiasa.
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
}
