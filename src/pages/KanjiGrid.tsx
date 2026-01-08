import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, Loader, Lightbulb } from 'lucide-react';
import { contentApi } from '../api';
import type { Kanji } from '../api';
import { toRomaji } from 'wanakana';

export function KanjiGrid() {
    const { level } = useParams<{ level: string }>();
    const navigate = useNavigate();
    const { t } = useTranslation();
    const [kanjiList, setKanjiList] = useState<Kanji[]>([]);
    const [selectedKanji, setSelectedKanji] = useState<Kanji | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchKanji = async () => {
            if (!level) return;
            setIsLoading(true);
            try {
                const result = await contentApi.getKanji(level);
                if (result.success && result.data) {
                    setKanjiList(result.data);
                } else {
                    setError('Gagal memuat kanji.');
                }
            } catch (err) {
                setError('Terjadi kesalahan saat memuat data.');
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchKanji();
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
                <h1 style={{ fontSize: '28px', fontWeight: 'bold' }}>{t('kanji.title')}</h1>
                <span style={{
                    background: 'rgba(46, 92, 110, 0.1)',
                    color: 'var(--color-secondary)',
                    padding: '4px 12px',
                    borderRadius: '99px',
                    fontWeight: '600',
                    fontSize: '14px'
                }}>
                    {kanjiList.length} {t('common.characters')}
                </span>
            </div>

            <div style={{ display: 'flex', gap: '32px', flexWrap: 'wrap' }}>
                {/* Kanji Grid */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))',
                    gap: '12px',
                    flex: '1 1 300px'
                }}>
                    {kanjiList.map((kanji) => (
                        <button
                            key={kanji.id}
                            onClick={() => setSelectedKanji(kanji)}
                            style={{
                                background: selectedKanji?.id === kanji.id ? 'var(--color-secondary)' : 'white',
                                color: selectedKanji?.id === kanji.id ? 'white' : 'var(--color-text-main)',
                                padding: '16px',
                                borderRadius: '12px',
                                boxShadow: 'var(--shadow-sm)',
                                border: '1px solid rgba(0,0,0,0.05)',
                                fontSize: '32px',
                                fontWeight: 'bold',
                                aspectRatio: '1',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                transition: 'all 0.2s ease'
                            }}
                        >
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                                <span style={{ fontSize: '32px', lineHeight: '1' }}>{kanji.character}</span>
                                <span style={{ fontSize: '11px', fontWeight: '500', opacity: 0.8, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '100%' }}>
                                    {kanji.kunyomi[0] || kanji.onyomi[0] || '-'}
                                </span>
                            </div>
                        </button>
                    ))}
                </div>

                {/* Detail Panel */}
                {selectedKanji ? (
                    <div style={{
                        flex: '1 1 300px',
                        background: 'white',
                        padding: '24px',
                        borderRadius: '16px',
                        boxShadow: 'var(--shadow-md)',
                        border: '1px solid rgba(0,0,0,0.05)',
                        position: 'sticky',
                        top: '24px',
                        alignSelf: 'flex-start'
                    }}>
                        <div style={{ fontSize: '64px', fontWeight: 'bold', textAlign: 'center', marginBottom: '16px', color: 'var(--color-secondary)' }}>
                            {selectedKanji.character}
                        </div>

                        <div style={{ marginBottom: '16px' }}>
                            <p style={{ fontSize: '12px', color: 'var(--color-text-muted)', marginBottom: '4px' }}>{t('kanji.meaning')}</p>
                            <p style={{ fontWeight: '600' }}>{selectedKanji.meaning.join(', ')}</p>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                            <div>
                                <p style={{ fontSize: '12px', color: 'var(--color-text-muted)', marginBottom: '4px' }}>On'yomi</p>
                                <p style={{ fontWeight: '500' }}>
                                    {selectedKanji.onyomi.map(reading => (
                                        <span key={reading} style={{ display: 'block' }}>
                                            {reading} <span style={{ color: 'var(--color-text-muted)', fontSize: '0.9em' }}>({toRomaji(reading)})</span>
                                        </span>
                                    ))}
                                </p>
                            </div>
                            <div>
                                <p style={{ fontSize: '12px', color: 'var(--color-text-muted)', marginBottom: '4px' }}>Kun'yomi</p>
                                <p style={{ fontWeight: '500' }}>
                                    {selectedKanji.kunyomi.map(reading => (
                                        <span key={reading} style={{ display: 'block' }}>
                                            {reading} <span style={{ color: 'var(--color-text-muted)', fontSize: '0.9em' }}>({toRomaji(reading)})</span>
                                        </span>
                                    ))}
                                </p>
                            </div>
                        </div>

                        <div>
                            <p style={{ fontSize: '12px', color: 'var(--color-text-muted)', marginBottom: '8px' }}>{t('kanji.examples')}</p>
                            {selectedKanji.examples.map((ex, i) => (
                                <div key={i} style={{
                                    padding: '8px 12px',
                                    background: '#f8f8f8',
                                    borderRadius: '8px',
                                    marginBottom: '8px',
                                    fontSize: '14px'
                                }}>
                                    <span style={{ fontWeight: '600' }}>{ex.word}</span>
                                    <span style={{ color: 'var(--color-text-muted)', margin: '0 8px' }}>({ex.reading})</span>
                                    <span>{ex.meaning}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                ) : (
                    <div style={{
                        flex: '1 1 300px',
                        background: '#f0f9ff',
                        padding: '24px',
                        borderRadius: '16px',
                        border: '1px solid rgba(0,0,0,0.05)',
                        position: 'sticky',
                        top: '24px',
                        alignSelf: 'flex-start'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px', color: 'var(--color-secondary)' }}>
                            <Lightbulb size={24} />
                            <h3 style={{ fontSize: '18px', fontWeight: 'bold' }}>Tips Belajar Kanji</h3>
                        </div>
                        <ul style={{ display: 'flex', flexDirection: 'column', gap: '12px', paddingLeft: '20px', fontSize: '14px', color: 'var(--color-text-main)', lineHeight: '1.6' }}>
                            <li>
                                <strong>Hafalkan Arti Dulu:</strong> Fokus pada bentuk karakter dan artinya agar lebih mudah diingat.
                            </li>
                            <li>
                                <strong>Kunyomi (Bacaan Jepang):</strong> Biasanya digunakan saat Kanji berdiri sendiri (contoh: <span style={{ fontWeight: 'bold' }}>水</span> = mizu).
                            </li>
                            <li>
                                <strong>Onyomi (Bacaan Cina):</strong> Biasanya digunakan saat Kanji bergabung dengan Kanji lain (contoh: <span style={{ fontWeight: 'bold' }}>水曜日</span> = suiyoubi).
                            </li>
                            <li>
                                <strong>Latihan Tulis:</strong> Menulis dengan urutan guratan yang benar membantu memori visual.
                            </li>
                        </ul>
                        <div style={{ marginTop: '24px', padding: '16px', background: 'rgba(255,255,255,0.6)', borderRadius: '12px', fontSize: '13px', color: 'var(--color-text-muted)', fontStyle: 'italic' }}>
                            💡 Klik salah satu Kanji di samping untuk melihat detail cara baca dan contoh penggunaannya.
                        </div>
                    </div>
                )}
            </div>

            {kanjiList.length === 0 && (
                <p style={{ color: 'var(--color-text-muted)', textAlign: 'center' }}>{t('kanji.noContent')}</p>
            )}
        </div>
    );
}
