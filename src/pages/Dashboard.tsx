import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import { progressApi, type ProgressSummary } from '../api';
import {
    Flame,
    Target,
    BookOpen,
    Trophy,
    TrendingUp,
    Clock,
    Zap,
    ChevronRight,
    Loader
} from 'lucide-react';

const levelProgress = [
    { level: 'N5', vocab: 45, vocabTotal: 800, kanji: 12, kanjiTotal: 103, grammar: 8, grammarTotal: 128, color: 'var(--color-primary)' },
    { level: 'N4', vocab: 0, vocabTotal: 1500, kanji: 0, kanjiTotal: 181, grammar: 0, grammarTotal: 199, color: 'var(--color-secondary)' },
    { level: 'N3', vocab: 0, vocabTotal: 3750, kanji: 0, kanjiTotal: 361, grammar: 0, grammarTotal: 197, color: 'var(--color-accent)' },
];

export function Dashboard() {
    const navigate = useNavigate();
    const { t } = useTranslation();
    const { user, streak, isAuthenticated, isLoading } = useAuth();
    const [progressData, setProgressData] = useState<ProgressSummary | null>(null);

    useEffect(() => {
        const fetchProgress = async () => {
            if (isAuthenticated) {
                const result = await progressApi.getProgress();
                if (result.success && result.data) {
                    setProgressData(result.data);
                }
            }
        };

        fetchProgress();
    }, [isAuthenticated]);

    // Use data from API if available, otherwise fall back to auth context or defaults
    const currentStreak = progressData?.streak.currentStreak ?? streak?.currentStreak ?? 0;
    const totalXp = progressData?.streak.totalXp ?? streak?.totalXp ?? 0;
    const nextLevelXp = 2000;
    const todayLessons = progressData?.streak.todayLessons ?? streak?.todayLessons ?? 0;
    const todayGoal = 5;

    const progressPercent = (todayLessons / todayGoal) * 100;
    const xpPercent = (totalXp / nextLevelXp) * 100;

    // Calculate weekly activity chart data (last 7 days)
    const chartData = (() => {
        const data = [];
        const today = new Date();
        const logs = progressData?.weeklyActivity || [];
        const daysMap = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];

        // Find max count for scaling (min 5 for baseline)
        const maxCount = Math.max(5, ...logs.map(l => l.count));

        for (let i = 6; i >= 0; i--) {
            const d = new Date();
            d.setDate(today.getDate() - i);
            const dateStr = d.toISOString().split('T')[0];
            const log = logs.find(l => l.date === dateStr);
            const dayKey = daysMap[d.getDay()];

            data.push({
                dayKey,
                count: log?.count || 0,
                isToday: i === 0,
                height: Math.min(((log?.count || 0) / maxCount) * 80, 80) // Max 80px height
            });
        }
        return data;
    })();

    // Calculate total learned from API summary
    const summary = progressData?.summary;

    // For "Total Learned" card, maybe show sum of mastered + learning or just mastered? 
    // The previous hardcoded values were just numbers. Let's show "learning + mastered" as "Learned/Studied"
    const vocabLearned = (summary?.vocab.learning ?? 0) + (summary?.vocab.mastered ?? 0);
    const kanjiLearned = (summary?.kanji.learning ?? 0) + (summary?.kanji.mastered ?? 0);
    const grammarLearned = (summary?.grammar.learning ?? 0) + (summary?.grammar.mastered ?? 0);

    // Show loading state ONLY for initial auth check, not for data fetching
    if (isLoading) {
        return (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '400px' }}>
                <div style={{ textAlign: 'center' }}>
                    <Loader size={32} style={{ animation: 'spin 1s linear infinite' }} />
                    <p style={{ marginTop: '12px', color: 'var(--color-text-muted)' }}>Memuat data...</p>
                </div>
            </div>
        );
    }

    return (
        <div style={{ width: '100%' }}>
            {/* Header */}
            <div style={{ marginBottom: '32px' }}>
                <h1 style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '8px' }}>
                    {isAuthenticated ? `おかえりなさい, ${user?.name || 'Pelajar'}!` : 'おかえりなさい!'}
                    <span style={{ fontWeight: 'normal', fontSize: '20px', marginLeft: '8px' }}>{t('dashboard.welcome')}</span>
                </h1>
                <p style={{ color: 'var(--color-text-muted)' }}>
                    {isAuthenticated
                        ? `Level: ${user?.currentLevel || 'N5'} • Total XP: ${totalXp.toLocaleString()}`
                        : t('dashboard.subtitle')}
                </p>
                {!isAuthenticated && (
                    <button
                        onClick={() => navigate('/login')}
                        style={{ marginTop: '12px', padding: '8px 16px', background: 'var(--color-primary)', color: 'white', borderRadius: '8px', fontWeight: '500' }}
                    >
                        Masuk untuk menyimpan progress
                    </button>
                )}
            </div>

            {/* Top Stats Row */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '24px' }}>
                {/* Streak Card */}
                <div style={{
                    background: 'linear-gradient(135deg, #FF6B35 0%, #F7931E 100%)',
                    padding: '20px',
                    borderRadius: '16px',
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '16px'
                }}>
                    <div style={{ width: '48px', height: '48px', background: 'rgba(255,255,255,0.2)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Flame size={24} />
                    </div>
                    <div>
                        <p style={{ fontSize: '28px', fontWeight: 'bold' }}>{currentStreak}</p>
                        <p style={{ fontSize: '14px', opacity: 0.9 }}>{t('dashboard.streak')}</p>
                    </div>
                </div>

                {/* Today's Progress */}
                <div style={{ background: 'white', padding: '20px', borderRadius: '16px', border: '1px solid rgba(0,0,0,0.05)', boxShadow: 'var(--shadow-sm)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                        <Target size={20} color="var(--color-primary)" />
                        <span style={{ fontWeight: '600' }}>{t('dashboard.todayGoal')}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px', marginBottom: '8px' }}>
                        <span style={{ fontSize: '24px', fontWeight: 'bold', color: 'var(--color-primary)' }}>{todayLessons}</span>
                        <span style={{ color: 'var(--color-text-muted)' }}>/ {todayGoal} {t('dashboard.lessons')}</span>
                    </div>
                    <div style={{ height: '6px', background: '#eee', borderRadius: '99px', overflow: 'hidden' }}>
                        <div style={{ width: `${Math.min(progressPercent, 100)}%`, height: '100%', background: 'var(--color-primary)', borderRadius: '99px', transition: 'width 0.3s ease' }}></div>
                    </div>
                </div>

                {/* XP */}
                <div style={{ background: 'white', padding: '20px', borderRadius: '16px', border: '1px solid rgba(0,0,0,0.05)', boxShadow: 'var(--shadow-sm)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                        <Zap size={20} color="var(--color-accent)" />
                        <span style={{ fontWeight: '600' }}>{t('dashboard.experience')}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px', marginBottom: '8px' }}>
                        <span style={{ fontSize: '24px', fontWeight: 'bold', color: 'var(--color-accent)' }}>{totalXp.toLocaleString()}</span>
                        <span style={{ color: 'var(--color-text-muted)' }}>XP</span>
                    </div>
                    <div style={{ height: '6px', background: '#eee', borderRadius: '99px', overflow: 'hidden' }}>
                        <div style={{ width: `${xpPercent}%`, height: '100%', background: 'var(--color-accent)', borderRadius: '99px' }}></div>
                    </div>
                    <p style={{ fontSize: '12px', color: 'var(--color-text-muted)', marginTop: '4px' }}>{t('dashboard.xpToNext', { xp: Math.max(0, nextLevelXp - totalXp) })}</p>
                </div>

                {/* Total Learned */}
                <div style={{ background: 'white', padding: '20px', borderRadius: '16px', border: '1px solid rgba(0,0,0,0.05)', boxShadow: 'var(--shadow-sm)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                        <Trophy size={20} color="var(--color-secondary)" />
                        <span style={{ fontWeight: '600' }}>{t('dashboard.totalLearned')}</span>
                    </div>
                    <div style={{ display: 'flex', gap: '16px' }}>
                        <div><p style={{ fontSize: '20px', fontWeight: 'bold', color: 'var(--color-secondary)' }}>{isAuthenticated ? vocabLearned : 45}</p><p style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>Kata</p></div>
                        <div><p style={{ fontSize: '20px', fontWeight: 'bold', color: 'var(--color-secondary)' }}>{isAuthenticated ? kanjiLearned : 12}</p><p style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>Kanji</p></div>
                        <div><p style={{ fontSize: '20px', fontWeight: 'bold', color: 'var(--color-secondary)' }}>{isAuthenticated ? grammarLearned : 8}</p><p style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>Tata Bahasa</p></div>
                    </div>
                </div>
            </div>

            {/* Main Content Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
                {/* Left Column */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    {/* Level Progress */}
                    <div style={{ background: 'white', padding: '24px', borderRadius: '16px', border: '1px solid rgba(0,0,0,0.05)', boxShadow: 'var(--shadow-sm)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
                            <h2 style={{ fontSize: '18px', fontWeight: '600' }}>{t('dashboard.levelProgress')}</h2>
                            <TrendingUp size={20} color="var(--color-text-muted)" />
                        </div>
                        {levelProgress.map((lp) => {
                            // Extract data for this specific level if available
                            const levelData = progressData?.levels?.[lp.level];

                            const vocabCount = isAuthenticated
                                ? ((levelData?.vocab.mastered ?? 0) + (levelData?.vocab.learning ?? 0))
                                : lp.vocab;

                            const kanjiCount = isAuthenticated
                                ? ((levelData?.kanji.mastered ?? 0) + (levelData?.kanji.learning ?? 0))
                                : lp.kanji;

                            const grammarCount = isAuthenticated
                                ? ((levelData?.grammar.mastered ?? 0) + (levelData?.grammar.learning ?? 0))
                                : lp.grammar;

                            return (
                                <div key={lp.level} style={{ marginBottom: '20px' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                        <span style={{ fontWeight: '600', color: lp.color }}>{lp.level}</span>
                                        <span style={{ fontSize: '14px', color: 'var(--color-text-muted)' }}>{Math.round(((vocabCount + kanjiCount + grammarCount) / (lp.vocabTotal + lp.kanjiTotal + lp.grammarTotal)) * 100)}% {t('dashboard.complete')}</span>
                                    </div>
                                    <div style={{ display: 'flex', gap: '8px' }}>
                                        <div style={{ flex: 1 }}><div style={{ height: '8px', background: '#eee', borderRadius: '4px', overflow: 'hidden' }}><div style={{ width: `${(vocabCount / lp.vocabTotal) * 100}%`, height: '100%', background: lp.color, borderRadius: '4px' }}></div></div><p style={{ fontSize: '11px', color: 'var(--color-text-muted)', marginTop: '4px' }}>Kosakata {vocabCount}/{lp.vocabTotal}</p></div>
                                        <div style={{ flex: 1 }}><div style={{ height: '8px', background: '#eee', borderRadius: '4px', overflow: 'hidden' }}><div style={{ width: `${(kanjiCount / lp.kanjiTotal) * 100}%`, height: '100%', background: lp.color, borderRadius: '4px' }}></div></div><p style={{ fontSize: '11px', color: 'var(--color-text-muted)', marginTop: '4px' }}>Kanji {kanjiCount}/{lp.kanjiTotal}</p></div>
                                        <div style={{ flex: 1 }}><div style={{ height: '8px', background: '#eee', borderRadius: '4px', overflow: 'hidden' }}><div style={{ width: `${(grammarCount / lp.grammarTotal) * 100}%`, height: '100%', background: lp.color, borderRadius: '4px' }}></div></div><p style={{ fontSize: '11px', color: 'var(--color-text-muted)', marginTop: '4px' }}>Tata Bahasa {grammarCount}/{lp.grammarTotal}</p></div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Weekly Activity */}
                    <div style={{ background: 'white', padding: '24px', borderRadius: '16px', border: '1px solid rgba(0,0,0,0.05)', boxShadow: 'var(--shadow-sm)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
                            <h2 style={{ fontSize: '18px', fontWeight: '600' }}>{t('dashboard.weeklyActivity')}</h2>
                            <Clock size={20} color="var(--color-text-muted)" />
                        </div>
                        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', height: '100px', gap: '8px' }}>
                            {chartData.map((day, i) => (
                                <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                                    <div style={{
                                        width: '100%',
                                        height: `${day.height}px`,
                                        background: day.isToday ? 'var(--color-primary)' : 'rgba(215, 74, 73, 0.3)',
                                        borderRadius: '4px',
                                        minHeight: '4px', // Always show a tiny bar
                                        transition: 'height 0.3s ease'
                                    }}></div>
                                    <span style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>{t(`days.${day.dayKey}`)}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right Column - Quick Actions */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    <div style={{ background: 'white', padding: '24px', borderRadius: '16px', border: '1px solid rgba(0,0,0,0.05)', boxShadow: 'var(--shadow-sm)' }}>
                        <h2 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px' }}>{t('dashboard.quickStart')}</h2>

                        <button onClick={() => navigate('/level/N5/vocabulary')} style={{ width: '100%', padding: '16px', background: 'rgba(215, 74, 73, 0.1)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px', transition: 'all 0.2s' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <BookOpen size={20} color="var(--color-primary)" />
                                <div style={{ textAlign: 'left' }}><p style={{ fontWeight: '600', color: 'var(--color-primary)' }}>{t('dashboard.continueN5')}</p><p style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>{t('dashboard.resumeVocab')}</p></div>
                            </div>
                            <ChevronRight size={20} color="var(--color-primary)" />
                        </button>

                        <button onClick={() => navigate('/level/N5/kanji')} style={{ width: '100%', padding: '16px', background: 'rgba(46, 92, 110, 0.1)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px', transition: 'all 0.2s' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <span style={{ fontSize: '20px', fontWeight: 'bold', color: 'var(--color-secondary)' }}>漢</span>
                                <div style={{ textAlign: 'left' }}><p style={{ fontWeight: '600', color: 'var(--color-secondary)' }}>{t('dashboard.practiceKanji')}</p><p style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>{isAuthenticated ? kanjiLearned : 12} karakter dipelajari</p></div>
                            </div>
                            <ChevronRight size={20} color="var(--color-secondary)" />
                        </button>

                        <button onClick={() => navigate('/level/N5/grammar')} style={{ width: '100%', padding: '16px', background: 'rgba(236, 163, 40, 0.1)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', transition: 'all 0.2s' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <span style={{ fontSize: '20px', fontWeight: 'bold', color: 'var(--color-accent)' }}>文</span>
                                <div style={{ textAlign: 'left' }}><p style={{ fontWeight: '600', color: 'var(--color-accent)' }}>{t('dashboard.studyGrammar')}</p><p style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>{isAuthenticated ? grammarLearned : 8} pola dipelajari</p></div>
                            </div>
                            <ChevronRight size={20} color="var(--color-accent)" />
                        </button>
                    </div>

                    {/* Tips */}
                    <div style={{ background: 'linear-gradient(135deg, var(--color-secondary) 0%, #1a3a47 100%)', padding: '24px', borderRadius: '16px', color: 'white' }}>
                        <h3 style={{ fontWeight: '600', marginBottom: '12px' }}>{t('dashboard.learningTip')}</h3>
                        <p style={{ fontSize: '14px', opacity: 0.9, lineHeight: '1.6' }}>{t('dashboard.tipText')}</p>
                    </div>
                </div>
            </div>
        </div >
    );
}
