import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowLeft } from 'lucide-react';
import { n5Kanji } from '../data/n5_kanji';
import type { Kanji } from '../types';
import { useState } from 'react';

export function KanjiGrid() {
    const { level } = useParams<{ level: string }>();
    const navigate = useNavigate();
    const { t } = useTranslation();
    const [selectedKanji, setSelectedKanji] = useState<Kanji | null>(null);

    const kanjiList: Kanji[] = level === 'N5' ? n5Kanji : [];

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
                    gridTemplateColumns: 'repeat(auto-fill, minmax(80px, 1fr))',
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
                            {kanji.character}
                        </button>
                    ))}
                </div>

                {/* Detail Panel */}
                {selectedKanji && (
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
                                <p style={{ fontWeight: '500' }}>{selectedKanji.onyomi.join(', ')}</p>
                            </div>
                            <div>
                                <p style={{ fontSize: '12px', color: 'var(--color-text-muted)', marginBottom: '4px' }}>Kun'yomi</p>
                                <p style={{ fontWeight: '500' }}>{selectedKanji.kunyomi.join(', ')}</p>
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
                )}
            </div>

            {kanjiList.length === 0 && (
                <p style={{ color: 'var(--color-text-muted)', textAlign: 'center' }}>{t('kanji.noContent')}</p>
            )}
        </div>
    );
}
