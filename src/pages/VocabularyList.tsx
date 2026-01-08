import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, Volume2, Loader, Lightbulb, Search, ChevronDown, ChevronRight } from 'lucide-react';
import { contentApi } from '../api';
import type { Vocabulary } from '../api';
import { toRomaji } from 'wanakana';

import { useSpeech } from '../hooks/useSpeech';

export function VocabularyList() {
    const { level } = useParams<{ level: string }>();
    const navigate = useNavigate();
    const { t } = useTranslation();
    const { speak } = useSpeech();
    const [vocabList, setVocabList] = useState<Vocabulary[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({});

    const toggleCategory = (category: string) => {
        setExpandedCategories(prev => ({
            ...prev,
            [category]: !prev[category]
        }));
    };

    const filteredList = vocabList.filter(item => {
        const query = searchQuery.toLowerCase();
        return (
            item.word.toLowerCase().includes(query) ||
            item.reading.toLowerCase().includes(query) ||
            item.meaning.toLowerCase().includes(query) ||
            toRomaji(item.reading).toLowerCase().includes(query)
        );
    });

    useEffect(() => {
        const fetchVocab = async () => {
            if (!level) return;
            setIsLoading(true);
            try {
                const result = await contentApi.getVocab(level);
                if (result.success && result.data) {
                    setVocabList(result.data);
                } else {
                    setError('Gagal memuat kosakata.');
                }
            } catch (err) {
                setError('Terjadi kesalahan saat memuat data.');
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchVocab();
    }, [level]);

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
                <h1 style={{ fontSize: '28px', fontWeight: 'bold' }}>{t('vocabulary.title')}</h1>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div style={{ position: 'relative' }}>
                        <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
                        <input
                            type="text"
                            placeholder="Cari kosakata..."
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
                        background: 'rgba(215, 74, 73, 0.1)',
                        color: 'var(--color-primary)',
                        padding: '4px 12px',
                        borderRadius: '99px',
                        fontWeight: '600',
                        fontSize: '14px'
                    }}>
                        {filteredList.length} {t('common.words')}
                    </span>
                </div>
            </div>

            {/* Filter and Group Data */}
            {
                (() => {
                    const groupedVocab = filteredList.reduce((acc, item) => {
                        const category = item.category || 'Lainnya';
                        if (!acc[category]) acc[category] = [];
                        acc[category].push(item);
                        return acc;
                    }, {} as Record<string, Vocabulary[]>);

                    const categories = Object.keys(groupedVocab);

                    return (
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '32px', alignItems: 'start' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                {categories.map(category => (
                                    <div key={category} style={{
                                        background: 'white',
                                        borderRadius: '16px',
                                        overflow: 'hidden',
                                        boxShadow: 'var(--shadow-sm)',
                                        border: '1px solid rgba(0,0,0,0.05)',
                                    }}>
                                        <button
                                            onClick={() => toggleCategory(category)}
                                            style={{
                                                width: '100%',
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                alignItems: 'center',
                                                padding: '20px',
                                                background: 'white',
                                                border: 'none',
                                                cursor: 'pointer',
                                                fontSize: '18px',
                                                fontWeight: 'bold',
                                                color: 'var(--color-primary)'
                                            }}
                                        >
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                                {expandedCategories[category] ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
                                                {category}
                                                <span style={{ fontSize: '14px', fontWeight: 'normal', color: 'var(--color-text-muted)', background: '#f5f5f5', padding: '2px 8px', borderRadius: '12px' }}>
                                                    {groupedVocab[category].length}
                                                </span>
                                            </div>
                                        </button>

                                        {expandedCategories[category] && (

                                            <div style={{
                                                padding: '0 20px 20px 20px',
                                                display: 'grid',
                                                gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                                                gap: '20px'
                                            }}>
                                                {groupedVocab[category].map((item) => (
                                                    <div key={item.id} style={{
                                                        background: '#ffffff',
                                                        padding: '24px',
                                                        borderRadius: '20px',
                                                        border: '1px solid rgba(0,0,0,0.04)',
                                                        boxShadow: '0 4px 12px rgba(0,0,0,0.03)',
                                                        transition: 'all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)',
                                                        cursor: 'pointer',
                                                        display: 'flex',
                                                        flexDirection: 'column',
                                                        justifyContent: 'space-between'
                                                    }}
                                                        onMouseEnter={(e) => {
                                                            e.currentTarget.style.transform = 'translateY(-6px)';
                                                            e.currentTarget.style.boxShadow = '0 16px 32px rgba(0,0,0,0.08)';
                                                            e.currentTarget.style.borderColor = 'rgba(215, 74, 73, 0.2)';
                                                        }}
                                                        onMouseLeave={(e) => {
                                                            e.currentTarget.style.transform = 'none';
                                                            e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.03)';
                                                            e.currentTarget.style.borderColor = 'rgba(0,0,0,0.04)';
                                                        }}
                                                    >
                                                        <div>
                                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                                                                <div>
                                                                    <span style={{ fontSize: '12px', fontWeight: '600', color: 'var(--color-primary)', background: '#fff0f0', padding: '4px 10px', borderRadius: '20px', letterSpacing: '0.5px' }}>
                                                                        {t('common.n5')}
                                                                    </span>
                                                                </div>
                                                                <button style={{
                                                                    width: '36px', height: '36px',
                                                                    borderRadius: '50%',
                                                                    background: '#f8f9fa',
                                                                    border: 'none',
                                                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                                    color: 'var(--color-text-muted)',
                                                                    cursor: 'pointer',
                                                                    transition: 'all 0.2s',
                                                                }}
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        speak(item.reading);
                                                                    }}
                                                                    onMouseEnter={(e) => {
                                                                        e.currentTarget.style.background = 'var(--color-primary)';
                                                                        e.currentTarget.style.color = 'white';
                                                                    }}
                                                                    onMouseLeave={(e) => {
                                                                        e.currentTarget.style.background = '#f8f9fa';
                                                                        e.currentTarget.style.color = 'var(--color-text-muted)';
                                                                    }}
                                                                >
                                                                    <Volume2 size={18} />
                                                                </button>
                                                            </div>

                                                            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                                                                <div style={{ fontSize: '36px', fontWeight: '800', color: 'var(--color-text-main)', marginBottom: '4px' }}>{item.word}</div>
                                                                <div style={{ fontSize: '15px', fontWeight: '500', color: 'var(--color-text-light)' }}>{item.reading}</div>
                                                                <div style={{ fontSize: '13px', color: 'var(--color-text-muted)', marginTop: '2px' }}>{toRomaji(item.reading)}</div>
                                                            </div>

                                                            <div style={{ textAlign: 'center', marginBottom: '16px' }}>
                                                                <p style={{ fontSize: '18px', fontWeight: '700', color: 'var(--color-primary)' }}>{item.meaning}</p>
                                                            </div>
                                                        </div>

                                                        {item.exampleJapanese && (
                                                            <div style={{
                                                                background: '#f8f9fa',
                                                                padding: '12px',
                                                                borderRadius: '12px',
                                                                fontSize: '13px',
                                                                border: '1px solid rgba(0,0,0,0.03)'
                                                            }}>
                                                                <p style={{ marginBottom: '4px', fontWeight: '600', color: '#444' }}>
                                                                    {item.exampleJapanese}
                                                                </p>
                                                                <p style={{ color: '#888' }}>{item.exampleMeaning}</p>
                                                            </div>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        )}

                                    </div>
                                ))}

                                {filteredList.length === 0 && (
                                    <div style={{ padding: '40px', textAlign: 'center', background: 'white', borderRadius: '16px' }}>
                                        <p style={{ color: 'var(--color-text-muted)' }}>{t('vocabulary.noContent')}</p>
                                    </div>
                                )}
                            </div>


                            <div style={{
                                position: 'sticky',
                                top: '24px',
                                background: '#fff1f0',
                                padding: '24px',
                                borderRadius: '16px',
                                border: '1px solid rgba(215, 74, 73, 0.1)'
                            }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px', color: 'var(--color-primary)' }}>
                                    <Lightbulb size={24} />
                                    <h3 style={{ fontSize: '18px', fontWeight: 'bold' }}>Tips Belajar Kosakata</h3>
                                </div>
                                <ul style={{ display: 'flex', flexDirection: 'column', gap: '12px', paddingLeft: '20px', fontSize: '14px', color: 'var(--color-text-main)', lineHeight: '1.6' }}>
                                    <li>
                                        <strong>Konteks itu Penting:</strong> Jangan hanya menghafal kata, tapi pelajari juga contoh kalimatnya.
                                    </li>
                                    <li>
                                        <strong>Ucapkan Keras-keras:</strong> Melafalkan kata membantu otak merekam bunyi dan artinya sekaligus.
                                    </li>
                                    <li>
                                        <strong>Flashcard Rutin:</strong> Gunakan fitur Quiz setiap hari untuk memindahkan kata ke memori jangka panjang.
                                    </li>
                                    <li>
                                        <strong>Kelompokkan Kata:</strong> Belajar kata per tema (misal: makanan, transportasi) lebih efektif daripada acak.
                                    </li>
                                </ul>
                                <div style={{ marginTop: '24px', padding: '16px', background: 'rgba(255,255,255,0.6)', borderRadius: '12px', fontSize: '13px', color: 'var(--color-text-muted)', fontStyle: 'italic' }}>
                                    💡 Tekan tombol speaker untuk mendengar pelafalan yang benar (fitur ini akan segera aktif!).
                                </div>
                            </div>
                        </div>
                    );
                })()
            }
        </div >
    );
}
