import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, Check, X, RotateCcw, Trophy, Loader } from 'lucide-react';
import { toRomaji } from 'wanakana';
import { contentApi, progressApi } from '../api';
import { useAuth } from '../context/AuthContext';

type QuizType = 'vocab' | 'kanji' | 'grammar';

interface QuizItem {
    id: string;
    question: string;
    answer: string;
    hint?: string;
    romaji?: string;
    options?: string[];
    type: QuizType;
}

export function FlashcardQuiz() {
    const { level } = useParams<{ level: string }>();
    const navigate = useNavigate();
    const { t } = useTranslation();
    const { isAuthenticated } = useAuth();

    const [quizType, setQuizType] = useState<QuizType | null>(null);
    const [quizItems, setQuizItems] = useState<QuizItem[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [showAnswer, setShowAnswer] = useState(false);
    const [showRomaji, setShowRomaji] = useState(false);
    const [score, setScore] = useState(0);
    const [answered, setAnswered] = useState(false);
    const [isComplete, setIsComplete] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [vocabCount, setVocabCount] = useState(0);
    const [kanjiCount, setKanjiCount] = useState(0);
    const [grammarCount, setGrammarCount] = useState(0);
    const [lastAnswerCorrect, setLastAnswerCorrect] = useState<boolean | null>(null);
    const [selectedLimit, setSelectedLimit] = useState<number | 'all' | null>(null);

    // Initial load counts
    useEffect(() => {
        if (!level) return;
        const fetchCounts = async () => {
            // ... existing fetchCounts logic
            const v = await contentApi.getVocab(level);
            if (v.success && v.data) setVocabCount(v.data.length);

            const k = await contentApi.getKanji(level);
            if (k.success && k.data) setKanjiCount(k.data.length);

            const g = await contentApi.getGrammar(level);
            if (g.success && g.data) setGrammarCount(g.data.length);
        };
        fetchCounts();
    }, [level]);

    // Load quiz items when type AND limit are selected
    useEffect(() => {
        if (!quizType || !level || !selectedLimit) return;

        const loadQuiz = async () => {
            setIsLoading(true);
            try {
                let items: QuizItem[] = [];
                // ... fetch items based on quizType (same as before) ...
                if (quizType === 'vocab') {
                    const res = await contentApi.getVocab(level);
                    if (res.success && res.data) {
                        items = res.data.map(v => ({
                            id: v.id,
                            question: v.word,
                            answer: v.meaning,
                            hint: v.reading,
                            romaji: toRomaji(v.reading),
                            type: 'vocab'
                        }));
                    }
                } else if (quizType === 'kanji') {
                    const res = await contentApi.getKanji(level);
                    if (res.success && res.data) {
                        items = res.data.map(k => {
                            const reading = k.onyomi[0] || k.kunyomi[0];
                            return {
                                id: k.id,
                                question: k.character,
                                answer: k.meaning.join(', '),
                                hint: reading || '',
                                romaji: reading ? toRomaji(reading) : '',
                                type: 'kanji'
                            };
                        });
                    }
                } else {
                    const res = await contentApi.getGrammar(level);
                    if (res.success && res.data) {
                        items = res.data.map(g => ({
                            id: g.id,
                            question: g.pattern,
                            answer: g.meaning,
                            hint: "Tata Bahasa",
                            type: 'grammar'
                        }));
                    }
                }

                // Generate Options for Multiple Choice
                // We use the full pool of items to generate distractors
                const allAnswers = items.map(i => i.answer);

                items = items.map(item => {
                    // Filter out the correct answer to get pool of wrong answers
                    const otherAnswers = allAnswers.filter(a => a !== item.answer);
                    // Shuffle wrong answers
                    const shuffledWrong = otherAnswers.sort(() => Math.random() - 0.5);
                    // Take top 2
                    const distractors = shuffledWrong.slice(0, 2);
                    // Combine with correct answer and shuffle
                    const options = [...distractors, item.answer].sort(() => Math.random() - 0.5);

                    return { ...item, options };
                });

                // Shuffle items sequence
                const shuffled = items.sort(() => Math.random() - 0.5);

                // Apply limit
                if (selectedLimit !== 'all') {
                    setQuizItems(shuffled.slice(0, selectedLimit));
                } else {
                    setQuizItems(shuffled);
                }
            } catch (err) {
                console.error("Failed to load quiz", err);
            } finally {
                setIsLoading(false);
            }
        };

        loadQuiz();
    }, [quizType, level, selectedLimit]);

    const currentItem = quizItems[currentIndex];
    const totalItems = quizItems.length;

    const handleAnswer = async (isCorrect: boolean) => {
        if (answered || !currentItem) return;
        setAnswered(true);
        setLastAnswerCorrect(isCorrect);

        if (isCorrect) {
            setScore(s => s + 1);
        }

        // Update progress if authenticated
        if (isAuthenticated && level) {
            try {
                await progressApi.updateProgress({
                    itemType: currentItem.type,
                    itemId: currentItem.id,
                    level: level,
                    correct: isCorrect
                });
            } catch (err) {
                console.error("Failed to update progress", err);
            }
        }
    };

    const handleNext = async () => {
        if (currentIndex < totalItems - 1) {
            setCurrentIndex(i => i + 1);
            setShowAnswer(false);
            setShowRomaji(false);
            setAnswered(false);
            setLastAnswerCorrect(null);
        } else {
            setIsComplete(true);

            // Save quiz result if authenticated
            if (isAuthenticated && level && quizType) {
                try {
                    await progressApi.saveQuiz({
                        quizType,
                        level,
                        score,
                        totalQuestions: totalItems
                    });
                } catch (err) {
                    console.error("Failed to save quiz result", err);
                }
            }
        }
    };

    const handleRestart = () => {
        setCurrentIndex(0);
        setScore(0);
        setShowAnswer(false);
        setShowRomaji(false);
        setAnswered(false);
        setIsComplete(false);
        setLastAnswerCorrect(null);
        // We keep the selectedLimit for restart logic, so user replays same size
    };

    const handleBack = () => {
        if (selectedLimit) {
            setSelectedLimit(null);
            handleRestart();
        } else if (quizType) {
            setQuizType(null);
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
                        {isLoading ? (
                            <div style={{ textAlign: 'center', padding: '20px' }}>
                                <Loader size={24} style={{ animation: 'spin 1s linear infinite' }} />
                                <p>Memuat data...</p>
                            </div>
                        ) : (
                            <>
                                <button
                                    onClick={() => setQuizType('vocab')}
                                    disabled={vocabCount === 0}
                                    style={{
                                        padding: '24px',
                                        background: 'white',
                                        borderRadius: '16px',
                                        border: '2px solid var(--color-primary)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '16px',
                                        transition: 'all 0.2s',
                                        opacity: vocabCount === 0 ? 0.6 : 1,
                                        cursor: vocabCount === 0 ? 'not-allowed' : 'pointer'
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
                                        <p style={{ fontSize: '14px', color: 'var(--color-text-muted)' }}>{vocabCount} {t('common.words')}</p>
                                    </div>
                                </button>

                                <button
                                    onClick={() => setQuizType('kanji')}
                                    disabled={kanjiCount === 0}
                                    style={{
                                        padding: '24px',
                                        background: 'white',
                                        borderRadius: '16px',
                                        border: '2px solid var(--color-secondary)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '16px',
                                        transition: 'all 0.2s',
                                        opacity: kanjiCount === 0 ? 0.6 : 1,
                                        cursor: kanjiCount === 0 ? 'not-allowed' : 'pointer'
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
                                        <p style={{ fontSize: '14px', color: 'var(--color-text-muted)' }}>{kanjiCount} {t('common.characters')}</p>
                                    </div>
                                </button>

                                <button
                                    onClick={() => setQuizType('grammar')}
                                    disabled={grammarCount === 0}
                                    style={{
                                        padding: '24px',
                                        background: 'white',
                                        borderRadius: '16px',
                                        border: '2px solid var(--color-accent)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '16px',
                                        transition: 'all 0.2s',
                                        opacity: grammarCount === 0 ? 0.6 : 1,
                                        cursor: grammarCount === 0 ? 'not-allowed' : 'pointer'
                                    }}
                                >
                                    <div style={{
                                        width: '48px', height: '48px',
                                        background: 'rgba(236, 163, 40, 0.1)',
                                        color: 'var(--color-accent)',
                                        borderRadius: '12px',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        fontSize: '24px', fontWeight: 'bold'
                                    }}>文</div>
                                    <div style={{ textAlign: 'left' }}>
                                        <p style={{ fontWeight: '600', fontSize: '18px' }}>Grammar Quiz</p>
                                        <p style={{ fontSize: '14px', color: 'var(--color-text-muted)' }}>{grammarCount} Pola</p>
                                    </div>
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </div>
        );
    }

    // Question Count Selection
    if (!selectedLimit) {
        return (
            <div>
                <button
                    onClick={() => setQuizType(null)}
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
                    <h1 style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '8px' }}>Pilih Jumlah Soal</h1>
                    <p style={{ color: 'var(--color-text-muted)', marginBottom: '32px' }}>Berapa banyak soal yang ingin Anda kerjakan?</p>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                        {[10, 20, 50].map(count => (
                            <button
                                key={count}
                                onClick={() => setSelectedLimit(count)}
                                style={{
                                    padding: '24px',
                                    background: 'white',
                                    borderRadius: '16px',
                                    border: '1px solid #eee',
                                    boxShadow: 'var(--shadow-sm)',
                                    fontSize: '20px',
                                    fontWeight: 'bold',
                                    color: 'var(--color-text-main)',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s'
                                }}
                            >
                                {count} Soal
                            </button>
                        ))}
                        <button
                            onClick={() => setSelectedLimit('all')}
                            style={{
                                padding: '24px',
                                background: '#fff1f0',
                                borderRadius: '16px',
                                border: '1px solid rgba(215, 74, 73, 0.1)',
                                fontSize: '20px',
                                fontWeight: 'bold',
                                color: 'var(--color-primary)',
                                cursor: 'pointer',
                                transition: 'all 0.2s'
                            }}
                        >
                            Semua
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
                    <div style={{ marginBottom: '24px' }}>
                        <p style={{ fontSize: '24px', color: 'var(--color-primary)', marginBottom: '8px' }}>
                            {currentItem.hint}
                        </p>

                        {currentItem.romaji && (
                            <div>
                                {!showRomaji ? (
                                    <button
                                        onClick={() => setShowRomaji(true)}
                                        style={{
                                            fontSize: '12px',
                                            color: 'var(--color-text-muted)',
                                            background: 'none',
                                            border: '1px dashed #ccc',
                                            padding: '4px 8px',
                                            borderRadius: '4px',
                                            cursor: 'pointer'
                                        }}
                                    >
                                        Tampilkan Romaji
                                    </button>
                                ) : (
                                    <div>
                                        <p style={{ fontSize: '18px', color: 'var(--color-text-muted)', marginBottom: '4px' }}>
                                            {currentItem.romaji}
                                        </p>
                                        <button
                                            onClick={() => setShowRomaji(false)}
                                            style={{
                                                fontSize: '12px',
                                                color: 'var(--color-text-muted)',
                                                background: 'none',
                                                border: 'none',
                                                textDecoration: 'underline',
                                                cursor: 'pointer'
                                            }}
                                        >
                                            Sembunyikan
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                )}

                {/* Answer Section */}
                {!showAnswer ? (
                    <>
                        {currentItem?.options ? (
                            <div style={{ display: 'grid', gap: '12px', marginTop: '24px' }}>
                                {currentItem.options.map((option, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => {
                                            const isCorrect = option === currentItem.answer;
                                            setShowAnswer(true);
                                            handleAnswer(isCorrect);
                                        }}
                                        style={{
                                            padding: '20px',
                                            background: 'white',
                                            border: '2px solid #eee',
                                            borderRadius: '16px',
                                            fontSize: '18px',
                                            fontWeight: '600',
                                            color: 'var(--color-text-main)',
                                            cursor: 'pointer',
                                            transition: 'all 0.2s',
                                            boxShadow: 'var(--shadow-sm)',
                                            textAlign: 'left'
                                        }}
                                    >
                                        {option}
                                    </button>
                                ))}
                            </div>
                        ) : (
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
                        )}
                    </>
                ) : (
                    <>
                        {currentItem?.options ? (
                            <div style={{ display: 'grid', gap: '12px', marginTop: '24px' }}>
                                {currentItem.options.map((option, idx) => {
                                    const isCorrect = option === currentItem.answer;


                                    let borderColor = '#eee';
                                    let bgColor = 'white';
                                    let textColor = 'var(--color-text-main)';

                                    if (isCorrect) {
                                        borderColor = '#16a34a';
                                        bgColor = '#dcfce7';
                                        textColor = '#16a34a';
                                    } else if (!lastAnswerCorrect && option !== currentItem.answer) {
                                        // Highlight the wrong chosen one? Use simple logic: Correct is Green.
                                        // We don't track which specific wrong option was clicked in state currently (simplification), 
                                        // but we can just highlight the correct one prominently.
                                    }

                                    return (
                                        <button
                                            key={idx}
                                            disabled
                                            style={{
                                                padding: '20px',
                                                background: bgColor,
                                                border: `2px solid ${borderColor}`,
                                                borderRadius: '16px',
                                                fontSize: '18px',
                                                fontWeight: '600',
                                                color: textColor,
                                                textAlign: 'left',
                                                opacity: isCorrect ? 1 : 0.6
                                            }}
                                        >
                                            {option}
                                            {isCorrect && <Check size={20} style={{ float: 'right' }} />}
                                        </button>
                                    );
                                })}
                            </div>
                        ) : (
                            <div style={{
                                padding: '16px',
                                background: '#f8f8f8',
                                borderRadius: '12px',
                                marginTop: '24px',
                                marginBottom: '24px'
                            }}>
                                <p style={{ fontSize: '24px', fontWeight: '600' }}>{currentItem?.answer}</p>
                            </div>
                        )}

                        {!answered && !currentItem?.options ? (
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
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '24px' }}>
                                {/* Feedback banner for Multiple Choice - only show if strictly needed or for self-report flow 
                                     For MC, the button colors serve as feedback. 
                                 */}
                                {(!currentItem?.options && lastAnswerCorrect !== null) && (
                                    <div style={{
                                        padding: '12px',
                                        borderRadius: '8px',
                                        background: lastAnswerCorrect ? '#dcfce7' : '#fee2e2',
                                        color: lastAnswerCorrect ? '#16a34a' : '#dc2626',
                                        fontWeight: 'bold',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        gap: '8px'
                                    }}>
                                        {lastAnswerCorrect ? <Check size={20} /> : <X size={20} />}
                                        {lastAnswerCorrect ? 'Benar! Bagus sekali' : 'Belum tepat, ayo belajar lagi'}
                                    </div>
                                )}

                                <button
                                    onClick={handleNext}
                                    style={{
                                        padding: '16px 32px',
                                        background: 'var(--color-primary)',
                                        color: 'white',
                                        borderRadius: '12px',
                                        fontWeight: '600',
                                        fontSize: '16px',
                                        width: '100%'
                                    }}
                                >
                                    {currentIndex < totalItems - 1 ? t('flashcard.next') : t('flashcard.finish')}
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}
