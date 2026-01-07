import { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, Check, X, RotateCcw, Trophy } from 'lucide-react';
import { n5Vocabulary } from '../data/n5_vocab';
import { n5Kanji } from '../data/n5_kanji';

type QuizType = 'vocab' | 'kanji';

interface QuizItem {
    id: string;
    question: string;
    answer: string;
    hint?: string;
}

export function FlashcardQuiz() {
    const { level } = useParams<{ level: string }>();
    const navigate = useNavigate();
    const { t } = useTranslation();

    const [quizType, setQuizType] = useState<QuizType | null>(null);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [showAnswer, setShowAnswer] = useState(false);
    const [score, setScore] = useState(0);
    const [answered, setAnswered] = useState(false);
    const [isComplete, setIsComplete] = useState(false);

    const quizItems = useMemo<QuizItem[]>(() => {
        if (!quizType) return [];

        if (quizType === 'vocab') {
            const vocab = level === 'N5' ? n5Vocabulary : [];
            return vocab.map(v => ({
                id: v.id,
                question: v.word,
                answer: v.meaning,
                hint: v.reading
            }));
        } else {
            const kanji = level === 'N5' ? n5Kanji : [];
            return kanji.map(k => ({
                id: k.id,
                question: k.character,
                answer: k.meaning.join(', '),
                hint: k.onyomi[0] || k.kunyomi[0]
            }));
        }
    }, [quizType, level]);

    const currentItem = quizItems[currentIndex];
    const totalItems = quizItems.length;

    const handleAnswer = (isCorrect: boolean) => {
        if (answered) return;
        setAnswered(true);
        if (isCorrect) {
            setScore(s => s + 1);
        }
    };

    const handleNext = () => {
        if (currentIndex < totalItems - 1) {
            setCurrentIndex(i => i + 1);
            setShowAnswer(false);
            setAnswered(false);
        } else {
            setIsComplete(true);
        }
    };

    const handleRestart = () => {
        setCurrentIndex(0);
        setScore(0);
        setShowAnswer(false);
        setAnswered(false);
        setIsComplete(false);
    };

    const handleBack = () => {
        if (quizType) {
            setQuizType(null);
            handleRestart();
        } else {
            navigate(-1);
        }
    };

    // Quiz Type Selection
    if (!quizType) {
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

                <div style={{ textAlign: 'center', maxWidth: '500px', margin: '0 auto' }}>
                    <h1 style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '8px' }}>{t('flashcard.title')}</h1>
                    <p style={{ color: 'var(--color-text-muted)', marginBottom: '32px' }}>{t('flashcard.selectType')}</p>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        <button
                            onClick={() => setQuizType('vocab')}
                            style={{
                                padding: '24px',
                                background: 'white',
                                borderRadius: '16px',
                                border: '2px solid var(--color-primary)',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '16px',
                                transition: 'all 0.2s'
                            }}
                        >
                            <div style={{
                                width: '48px', height: '48px',
                                background: 'rgba(215, 74, 73, 0.1)',
                                color: 'var(--color-primary)',
                                borderRadius: '12px',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                fontSize: '24px', fontWeight: 'bold'
                            }}>V</div>
                            <div style={{ textAlign: 'left' }}>
                                <p style={{ fontWeight: '600', fontSize: '18px' }}>{t('flashcard.vocabQuiz')}</p>
                                <p style={{ fontSize: '14px', color: 'var(--color-text-muted)' }}>{n5Vocabulary.length} {t('common.words')}</p>
                            </div>
                        </button>

                        <button
                            onClick={() => setQuizType('kanji')}
                            style={{
                                padding: '24px',
                                background: 'white',
                                borderRadius: '16px',
                                border: '2px solid var(--color-secondary)',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '16px',
                                transition: 'all 0.2s'
                            }}
                        >
                            <div style={{
                                width: '48px', height: '48px',
                                background: 'rgba(46, 92, 110, 0.1)',
                                color: 'var(--color-secondary)',
                                borderRadius: '12px',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                fontSize: '24px', fontWeight: 'bold'
                            }}>漢</div>
                            <div style={{ textAlign: 'left' }}>
                                <p style={{ fontWeight: '600', fontSize: '18px' }}>{t('flashcard.kanjiQuiz')}</p>
                                <p style={{ fontSize: '14px', color: 'var(--color-text-muted)' }}>{n5Kanji.length} {t('common.characters')}</p>
                            </div>
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // Quiz Complete
    if (isComplete) {
        const percentage = Math.round((score / totalItems) * 100);
        return (
            <div style={{ textAlign: 'center', maxWidth: '400px', margin: '0 auto', paddingTop: '48px' }}>
                <div style={{
                    width: '80px', height: '80px',
                    background: percentage >= 70 ? 'var(--color-primary)' : 'var(--color-accent)',
                    borderRadius: '50%',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    margin: '0 auto 24px'
                }}>
                    <Trophy size={40} color="white" />
                </div>

                <h1 style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '8px' }}>{t('flashcard.complete')}</h1>
                <p style={{ color: 'var(--color-text-muted)', marginBottom: '24px' }}>{t('flashcard.yourScore')}</p>

                <div style={{
                    fontSize: '48px',
                    fontWeight: 'bold',
                    color: percentage >= 70 ? 'var(--color-primary)' : 'var(--color-accent)',
                    marginBottom: '32px'
                }}>
                    {score} / {totalItems}
                </div>

                <p style={{ fontSize: '24px', marginBottom: '32px' }}>{percentage}%</p>

                <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
                    <button
                        onClick={handleRestart}
                        style={{
                            padding: '12px 24px',
                            background: 'var(--color-primary)',
                            color: 'white',
                            borderRadius: '8px',
                            fontWeight: '600',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px'
                        }}
                    >
                        <RotateCcw size={18} />
                        {t('flashcard.tryAgain')}
                    </button>
                    <button
                        onClick={() => navigate(`/level/${level}`)}
                        style={{
                            padding: '12px 24px',
                            background: '#f5f5f5',
                            color: 'var(--color-text-main)',
                            borderRadius: '8px',
                            fontWeight: '600'
                        }}
                    >
                        {t('flashcard.backToLevel')}
                    </button>
                </div>
            </div>
        );
    }

    // Quiz Card
    return (
        <div>
            <button
                onClick={handleBack}
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

            {/* Progress */}
            <div style={{ marginBottom: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span style={{ fontSize: '14px', color: 'var(--color-text-muted)' }}>
                        {t('flashcard.question')} {currentIndex + 1} {t('flashcard.of')} {totalItems}
                    </span>
                    <span style={{ fontSize: '14px', fontWeight: '600', color: 'var(--color-primary)' }}>
                        {t('flashcard.score')}: {score}
                    </span>
                </div>
                <div style={{ height: '6px', background: '#eee', borderRadius: '99px', overflow: 'hidden' }}>
                    <div style={{
                        width: `${((currentIndex + 1) / totalItems) * 100}%`,
                        height: '100%',
                        background: 'var(--color-primary)',
                        borderRadius: '99px',
                        transition: 'width 0.3s ease'
                    }}></div>
                </div>
            </div>

            {/* Card */}
            <div style={{
                background: 'white',
                borderRadius: '24px',
                padding: '48px',
                textAlign: 'center',
                boxShadow: 'var(--shadow-lg)',
                border: '1px solid rgba(0,0,0,0.05)',
                maxWidth: '500px',
                margin: '0 auto'
            }}>
                <p style={{ fontSize: '14px', color: 'var(--color-text-muted)', marginBottom: '16px' }}>
                    {t('flashcard.whatMeaning')}
                </p>

                <div style={{
                    fontSize: quizType === 'kanji' ? '72px' : '48px',
                    fontWeight: 'bold',
                    marginBottom: '8px',
                    color: quizType === 'kanji' ? 'var(--color-secondary)' : 'var(--color-text-main)'
                }}>
                    {currentItem?.question}
                </div>

                {currentItem?.hint && (
                    <p style={{ fontSize: '18px', color: 'var(--color-text-muted)', marginBottom: '24px' }}>
                        {currentItem.hint}
                    </p>
                )}

                {/* Answer Section */}
                {!showAnswer ? (
                    <button
                        onClick={() => setShowAnswer(true)}
                        style={{
                            padding: '16px 32px',
                            background: 'var(--color-secondary)',
                            color: 'white',
                            borderRadius: '12px',
                            fontWeight: '600',
                            fontSize: '16px',
                            marginTop: '24px'
                        }}
                    >
                        {t('flashcard.showAnswer')}
                    </button>
                ) : (
                    <>
                        <div style={{
                            padding: '16px',
                            background: '#f8f8f8',
                            borderRadius: '12px',
                            marginTop: '24px',
                            marginBottom: '24px'
                        }}>
                            <p style={{ fontSize: '24px', fontWeight: '600' }}>{currentItem?.answer}</p>
                        </div>

                        {!answered ? (
                            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
                                <button
                                    onClick={() => handleAnswer(false)}
                                    style={{
                                        padding: '16px 32px',
                                        background: '#fee2e2',
                                        color: '#dc2626',
                                        borderRadius: '12px',
                                        fontWeight: '600',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '8px'
                                    }}
                                >
                                    <X size={20} />
                                    {t('flashcard.incorrect')}
                                </button>
                                <button
                                    onClick={() => handleAnswer(true)}
                                    style={{
                                        padding: '16px 32px',
                                        background: '#dcfce7',
                                        color: '#16a34a',
                                        borderRadius: '12px',
                                        fontWeight: '600',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '8px'
                                    }}
                                >
                                    <Check size={20} />
                                    {t('flashcard.correct')}
                                </button>
                            </div>
                        ) : (
                            <button
                                onClick={handleNext}
                                style={{
                                    padding: '16px 32px',
                                    background: 'var(--color-primary)',
                                    color: 'white',
                                    borderRadius: '12px',
                                    fontWeight: '600',
                                    fontSize: '16px'
                                }}
                            >
                                {currentIndex < totalItems - 1 ? t('flashcard.next') : t('flashcard.finish')}
                            </button>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}
