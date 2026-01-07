import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export function LevelOverview() {
    const { level } = useParams<{ level: string }>();
    const navigate = useNavigate();
    const { t } = useTranslation();

    return (
        <div>
            <div style={{ marginBottom: '32px' }}>
                <h1 style={{ fontSize: '32px', fontWeight: 'bold' }}>{t('level.title', { level })}</h1>
                <p style={{ color: 'var(--color-text-muted)' }}>{t('level.subtitle')}</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '24px' }}>
                <div className="card-hover" onClick={() => navigate('vocabulary')} style={{
                    background: 'white',
                    padding: '24px',
                    borderRadius: '16px',
                    boxShadow: 'var(--shadow-sm)',
                    cursor: 'pointer',
                    border: '1px solid rgba(0,0,0,0.05)',
                    transition: 'transform 0.2s, box-shadow 0.2s'
                }}>
                    <div style={{
                        width: '48px', height: '48px',
                        background: 'rgba(215, 74, 73, 0.1)',
                        color: 'var(--color-primary)',
                        borderRadius: '12px',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        marginBottom: '16px', fontWeight: 'bold'
                    }}>V</div>
                    <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '8px' }}>{t('level.vocabulary')}</h3>
                    <p style={{ fontSize: '14px', color: 'var(--color-text-muted)' }}>{t('level.startLearning')}</p>
                </div>

                <div className="card-hover" onClick={() => navigate('kanji')} style={{
                    background: 'white',
                    padding: '24px',
                    borderRadius: '16px',
                    boxShadow: 'var(--shadow-sm)',
                    cursor: 'pointer',
                    border: '1px solid rgba(0,0,0,0.05)',
                    transition: 'transform 0.2s, box-shadow 0.2s'
                }}>
                    <div style={{
                        width: '48px', height: '48px',
                        background: 'rgba(46, 92, 110, 0.1)',
                        color: 'var(--color-secondary)',
                        borderRadius: '12px',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        marginBottom: '16px', fontWeight: 'bold'
                    }}>K</div>
                    <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '8px' }}>{t('level.kanji')}</h3>
                    <p style={{ fontSize: '14px', color: 'var(--color-text-muted)' }}>{t('level.masterCharacters')}</p>
                </div>

                <div className="card-hover" onClick={() => navigate('grammar')} style={{
                    background: 'white',
                    padding: '24px',
                    borderRadius: '16px',
                    boxShadow: 'var(--shadow-sm)',
                    cursor: 'pointer',
                    border: '1px solid rgba(0,0,0,0.05)',
                    transition: 'transform 0.2s, box-shadow 0.2s'
                }}>
                    <div style={{
                        width: '48px', height: '48px',
                        background: 'rgba(236, 163, 40, 0.1)',
                        color: 'var(--color-accent)',
                        borderRadius: '12px',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        marginBottom: '16px', fontWeight: 'bold'
                    }}>G</div>
                    <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '8px' }}>{t('level.grammar')}</h3>
                    <p style={{ fontSize: '14px', color: 'var(--color-text-muted)' }}>{t('level.learnStructures')}</p>
                </div>

                <div className="card-hover" onClick={() => navigate('quiz')} style={{
                    background: 'linear-gradient(135deg, var(--color-primary) 0%, #b83a39 100%)',
                    padding: '24px',
                    borderRadius: '16px',
                    boxShadow: 'var(--shadow-sm)',
                    cursor: 'pointer',
                    border: '1px solid rgba(0,0,0,0.05)',
                    transition: 'transform 0.2s, box-shadow 0.2s',
                    color: 'white'
                }}>
                    <div style={{
                        width: '48px', height: '48px',
                        background: 'rgba(255, 255, 255, 0.2)',
                        borderRadius: '12px',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        marginBottom: '16px', fontWeight: 'bold',
                        fontSize: '24px'
                    }}>⚡</div>
                    <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '8px' }}>{t('level.quiz')}</h3>
                    <p style={{ fontSize: '14px', opacity: 0.9 }}>{t('level.testKnowledge')}</p>
                </div>
            </div>
        </div>
    );
}
