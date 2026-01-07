import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, Volume2 } from 'lucide-react';
import { n5Vocabulary } from '../data/n5_vocab';
import type { Vocabulary } from '../types';

export function VocabularyList() {
    const { level } = useParams<{ level: string }>();
    const navigate = useNavigate();
    const { t } = useTranslation();

    // In a real app, filtering would happen here based on level or from API
    const vocabList: Vocabulary[] = level === 'N5' ? n5Vocabulary : [];

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
                <span style={{
                    background: 'rgba(215, 74, 73, 0.1)',
                    color: 'var(--color-primary)',
                    padding: '4px 12px',
                    borderRadius: '99px',
                    fontWeight: '600',
                    fontSize: '14px'
                }}>
                    {vocabList.length} {t('common.words')}
                </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {vocabList.map((item) => (
                    <div key={item.id} style={{
                        background: 'white',
                        padding: '20px',
                        borderRadius: '12px',
                        boxShadow: 'var(--shadow-sm)',
                        border: '1px solid rgba(0,0,0,0.05)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
                            <div style={{ width: '120px' }}>
                                <p style={{ fontSize: '24px', fontWeight: 'bold', color: 'var(--color-text-main)' }}>{item.word}</p>
                                <p style={{ fontSize: '14px', color: 'var(--color-text-muted)' }}>{item.reading}</p>
                            </div>

                            <div style={{ width: '1px', height: '40px', background: '#eee' }}></div>

                            <div>
                                <p style={{ fontWeight: '500', marginBottom: '4px' }}>{item.meaning}</p>
                                {item.exampleSentence && (
                                    <p style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>
                                        {item.exampleSentence.japanese} ({item.exampleSentence.english})
                                    </p>
                                )}
                            </div>
                        </div>

                        <button style={{
                            width: '36px', height: '36px',
                            borderRadius: '50%',
                            background: '#f5f5f5',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            color: 'var(--color-text-muted)'
                        }}>
                            <Volume2 size={18} />
                        </button>
                    </div>
                ))}

                {vocabList.length === 0 && (
                    <p style={{ color: 'var(--color-text-muted)', textAlign: 'center' }}>{t('vocabulary.noContent')}</p>
                )}
            </div>
        </div>
    );
}
