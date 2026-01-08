import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, BookOpen, Pencil, Lightbulb, LayoutGrid, List } from 'lucide-react';
import './KanaLearning.css';
import {
    hiragana,
    katakana,
    hiraganaDakuten,
    hiraganaHandakuten,
    hiraganaYoon,
    specialKana,
    kanaVocabulary,
    type Kana
} from '../data/kana';

type KanaType = 'hiragana' | 'katakana';
type ViewMode = 'guide' | 'chart' | 'extended' | 'vocab' | 'practice';
type ChartLayout = 'grid' | 'list';

export function KanaLearning() {
    const navigate = useNavigate();
    const { t } = useTranslation();

    const [kanaType, setKanaType] = useState<KanaType>('hiragana');
    const [viewMode, setViewMode] = useState<ViewMode>('guide');
    const [chartLayout, setChartLayout] = useState<ChartLayout>('grid');
    const [selectedKana, setSelectedKana] = useState<Kana | null>(null);

    // Practice state
    const [practiceIndex, setPracticeIndex] = useState(0);
    const [practiceScore, setPracticeScore] = useState(0);

    // Quiz State
    const [quizOptions, setQuizOptions] = useState<Kana[]>([]);
    const [selectedOption, setSelectedOption] = useState<string | null>(null);
    const [feedback, setFeedback] = useState<'idle' | 'correct' | 'incorrect'>('idle');

    const kanaData = kanaType === 'hiragana' ? hiragana : katakana;

    // Generate options when question changes
    useEffect(() => {
        if (viewMode !== 'practice') return;

        const currentKana = kanaData[practiceIndex];
        const otherOptions = kanaData
            .filter(k => k.character !== currentKana.character)
            .sort(() => 0.5 - Math.random())
            .slice(0, 2);

        const options = [currentKana, ...otherOptions].sort(() => 0.5 - Math.random());
        setQuizOptions(options);
        setSelectedOption(null);
        setFeedback('idle');
    }, [practiceIndex, kanaData, viewMode]);

    const rows = ['a', 'ka', 'sa', 'ta', 'na', 'ha', 'ma', 'ya', 'ra', 'wa'];
    const dakutenRows = ['ga', 'za', 'da', 'ba'];
    const yoonRows = ['ky', 'sh', 'ch', 'ny', 'hy', 'my', 'ry'];

    const handleOptionClick = (option: Kana) => {
        if (selectedOption) return; // Prevent double clicks

        setSelectedOption(option.character);
        const isCorrect = option.character === kanaData[practiceIndex].character;

        if (isCorrect) {
            setFeedback('correct');
            setPracticeScore(s => s + 1);
        } else {
            setFeedback('incorrect');
        }

        // Auto advance
        setTimeout(() => {
            if (practiceIndex < kanaData.length - 1) {
                setPracticeIndex(i => i + 1);
            } else {
                setPracticeIndex(0);
                setPracticeScore(0);
                setViewMode('chart');
            }
        }, 1000);
    };

    const filteredVocab = kanaVocabulary.filter(v => v.type === kanaType);

    return (
        <div className="kana-page">
            <button
                onClick={() => navigate('/')}
                className="kana-back-button"
            >
                <ArrowLeft size={16} />
                {t('sidebar.dashboard')}
            </button>

            {/* ... Header and Controls ... */}

            <div className="kana-header">
                <h1 className="kana-title">{t('kana.title')}</h1>
                <p className="kana-subtitle">{t('kana.subtitle')}</p>
            </div>

            <div className="kana-controls">
                {/* Type Toggle */}
                <div className="kana-type-toggles">
                    <button
                        onClick={() => setKanaType('hiragana')}
                        className={`kana-toggle ${kanaType === 'hiragana' ? 'active-hiragana' : ''}`}
                    >
                        あ Hiragana
                    </button>
                    <button
                        onClick={() => setKanaType('katakana')}
                        className={`kana-toggle ${kanaType === 'katakana' ? 'active-katakana' : ''}`}
                    >
                        ア Katakana
                    </button>
                </div>

                {/* View Mode Tabs */}
                <div className="kana-tabs">
                    {(['guide', 'chart', 'extended', 'vocab', 'practice'] as ViewMode[]).map(mode => (
                        <button
                            key={mode}
                            onClick={() => {
                                setViewMode(mode);
                                if (mode === 'practice') {
                                    setPracticeIndex(0);
                                    setPracticeScore(0);
                                    const options = [kanaData[0], ...kanaData.slice(1).sort(() => 0.5 - Math.random()).slice(0, 2)].sort(() => 0.5 - Math.random());
                                    setQuizOptions(options);
                                }
                            }}
                            className={`kana-tab ${viewMode === mode ? 'active' : ''}`}
                        >
                            {mode === 'guide' && '📖 Panduan'}
                            {mode === 'chart' && '📋 Tabel Dasar'}
                            {mode === 'extended' && '🔊 Dakuten/Yōon'}
                            {mode === 'vocab' && '📝 Kosakata'}
                            {mode === 'practice' && '⚡ Latihan'}
                        </button>
                    ))}
                </div>
            </div>

            {/* GUIDE VIEW */}
            {viewMode === 'guide' && (
                <div className="kana-guide-layout">
                    {/* Main Content Column */}
                    <div className="kana-guide-main">
                        {/* Section 1 */}
                        <div className="guide-card">
                            <h2 className="guide-card-title">
                                <span>1️⃣</span> Bentuk Huruf Dasar
                            </h2>
                            <div className="guide-grid">
                                <div className="guide-sub-card" style={{ background: 'rgba(215, 74, 73, 0.05)' }}>
                                    <h3 className="guide-grid-title text-primary">Hiragana ひらがな</h3>
                                    <p className="guide-grid-desc">Digunakan untuk kata asli Jepang, partikel, dan akhiran kata kerja</p>
                                    <p className="guide-grid-examples">あ (a), か (ka), さ (sa)</p>
                                </div>
                                <div className="guide-sub-card" style={{ background: 'rgba(46, 92, 110, 0.05)' }}>
                                    <h3 className="guide-grid-title text-secondary">Katakana カタカナ</h3>
                                    <p className="guide-grid-desc">Digunakan untuk kata serapan asing, nama orang asing, dan onomatope</p>
                                    <p className="guide-grid-examples">ア (a), カ (ka), サ (sa)</p>
                                </div>
                            </div>
                        </div>

                        {/* Section 2 */}
                        <div className="guide-card">
                            <h2 className="guide-card-title">
                                <span>2️⃣</span> Cara Membaca (Pelafalan)
                            </h2>
                            <div className="guide-chart-container">
                                <p><strong>A I U E O</strong></p>
                                <p>KA KI KU KE KO</p>
                                <p>SA SHI SU SE SO</p>
                                <p>TA CHI TSU TE TO</p>
                                <p>NA NI NU NE NO</p>
                                <p>HA HI FU HE HO</p>
                                <p>MA MI MU ME MO</p>
                                <p>YA YU YO</p>
                                <p>RA RI RU RE RO</p>
                                <p>WA WO N</p>
                            </div>
                            <p className="guide-tip">
                                👉 Penting: 1 huruf = 1 bunyi, bacaannya konsisten (tidak seperti bahasa Inggris)
                            </p>
                        </div>

                        {/* Section 3 */}
                        <div className="guide-card">
                            <h2 className="guide-card-title">
                                <Pencil size={24} className="text-primary" /> Urutan Goresan (Stroke Order)
                            </h2>
                            <p className="guide-grid-desc">Setiap huruf punya aturan urutan menulis. Membantu:</p>
                            <ul style={{ paddingLeft: '20px', lineHeight: '1.8' }}>
                                <li>Tulisan lebih rapi</li>
                                <li>Mudah dibaca orang Jepang</li>
                                <li>Lebih cepat menulis</li>
                            </ul>
                        </div>

                        {/* Section 6 - Special */}
                        <div className="guide-card">
                            <h2 className="guide-card-title">
                                <span>6️⃣</span> Huruf Kecil Khusus
                            </h2>
                            <div className="guide-grid">
                                <div className="guide-sub-card" style={{ background: '#f8fafc' }}>
                                    <p className="guide-grid-title">{specialKana.sokuon.hiragana} / {specialKana.sokuon.katakana} (Sokuon)</p>
                                    <p className="guide-grid-desc">{specialKana.sokuon.description}</p>
                                    <p className="mt-2 text-sm font-medium">がっこう (gakkou) = sekolah</p>
                                </div>
                                <div className="guide-sub-card" style={{ background: '#f8fafc' }}>
                                    <p className="guide-grid-title">{specialKana.chouon.katakana} (Chōon)</p>
                                    <p className="guide-grid-desc">{specialKana.chouon.description}</p>
                                    <p className="mt-2 text-sm font-medium">コーヒー (koohii) = kopi</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar Column */}
                    <div className="kana-guide-sidebar">
                        <div className="guide-cta">
                            <BookOpen size={48} style={{ marginBottom: '16px', opacity: 0.9 }} />
                            <h3 className="text-2xl font-bold mb-4">Siap Belajar?</h3>
                            <p className="text-lg opacity-90 mb-8">Mulai dengan melihat tabel huruf atau langsung latihan!</p>
                            <div className="cta-buttons">
                                <button onClick={() => setViewMode('chart')} className="cta-btn cta-btn-primary">Lihat Tabel</button>
                                <button onClick={() => setViewMode('practice')} className="cta-btn cta-btn-secondary">Mulai Latihan</button>
                            </div>
                        </div>

                        <div className="sidebar-tip">
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px', color: 'var(--color-primary)' }}>
                                <Lightbulb size={24} />
                                <h3 style={{ fontSize: '18px', fontWeight: 'bold' }}>Tips Belajar</h3>
                            </div>
                            <p style={{ fontSize: '14px', lineHeight: '1.6', color: '#555' }}>
                                Jangan mencoba menghafal semua sekaligus! Mulai dari 5 huruf pertama (A-I-U-E-O), lalu lanjut ke baris berikutnya setelah hafal. Lakukan latihan quiz setiap hari.
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* CHART VIEW */}
            {viewMode === 'chart' && (
                <div className="chart-layout">
                    <div style={{ width: '100%' }}>
                        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '16px', gap: '8px' }}>
                            <button
                                onClick={() => setChartLayout('grid')}
                                style={{
                                    padding: '8px',
                                    borderRadius: '8px',
                                    background: chartLayout === 'grid' ? '#eee' : 'transparent',
                                    border: 'none',
                                    cursor: 'pointer',
                                    color: chartLayout === 'grid' ? 'var(--color-primary)' : 'var(--color-text-muted)'
                                }}
                                title="Tampilan Grid"
                            >
                                <LayoutGrid size={20} />
                            </button>
                            <button
                                onClick={() => setChartLayout('list')}
                                style={{
                                    padding: '8px',
                                    borderRadius: '8px',
                                    background: chartLayout === 'list' ? '#eee' : 'transparent',
                                    border: 'none',
                                    cursor: 'pointer',
                                    color: chartLayout === 'list' ? 'var(--color-primary)' : 'var(--color-text-muted)'
                                }}
                                title="Tampilan List"
                            >
                                <List size={20} />
                            </button>
                        </div>

                        <div className={`chart-grid ${chartLayout === 'list' ? 'list-view' : ''}`}>
                            {rows.map(row => {
                                const rowKana = kanaData.filter(k => k.row === row);
                                if (rowKana.length === 0) return null;
                                return (
                                    <div key={row} className="chart-row">
                                        <p className="chart-row-label">{t(`kana.rows.${row}`)}</p>
                                        <div className="chart-row-items">
                                            {rowKana.map(kana => (
                                                <button
                                                    key={kana.character}
                                                    onClick={() => setSelectedKana(kana)}
                                                    className={`kana-char-btn ${selectedKana?.character === kana.character
                                                        ? (kanaType === 'hiragana' ? 'active-h' : 'active-k')
                                                        : ''
                                                        }`}
                                                >
                                                    {kana.character}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Detail Panel is now consistent with layout */}
                    <div style={{ position: 'sticky', top: '24px' }}>
                        {selectedKana ? (
                            <div className="chart-detail-panel" style={{ width: '100%' }}>
                                <div className={`detail-char ${kanaType === 'hiragana' ? 'text-primary' : 'text-secondary'}`}>
                                    {selectedKana.character}
                                </div>
                                <p className="detail-romaji-label">{t('kana.romaji')}</p>
                                <p className="detail-romaji">{selectedKana.romaji}</p>
                            </div>
                        ) : (
                            <div className="chart-detail-panel" style={{ width: '100%', opacity: 0.5, display: 'flex', flexDirection: 'column', justifyContent: 'center', minHeight: '300px' }}>
                                <p style={{ fontSize: '14px', color: 'var(--color-text-muted)' }}>Pilih salah satu huruf untuk melihat detail</p>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* EXTENDED VIEW - Dakuten, Handakuten, Yōon */}
            {viewMode === 'extended' && (
                <div className="kana-guide-container" style={{ maxWidth: '100%' }}>
                    <div className="extended-group">
                        <h3 className="guide-grid-title">Dakuten (Voiced)</h3>
                        {dakutenRows.map(row => {
                            const rowKana = hiraganaDakuten.filter(k => k.row === row);
                            return (
                                <div key={row} className="extended-row">
                                    {rowKana.map(kana => (
                                        <div key={kana.character} className="extended-char-box">
                                            <div className="extended-char">{kana.character}</div>
                                            <div className="extended-romaji">{kana.romaji}</div>
                                        </div>
                                    ))}
                                </div>
                            );
                        })}
                    </div>

                    <div className="extended-group">
                        <h3 className="guide-grid-title">Handakuten (P-sounds)</h3>
                        <div className="extended-row">
                            {hiraganaHandakuten.map(kana => (
                                <div key={kana.character} className="extended-char-box">
                                    <div className="extended-char">{kana.character}</div>
                                    <div className="extended-romaji">{kana.romaji}</div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="extended-group">
                        <h3 className="guide-grid-title">Yōon (Combination Sounds)</h3>
                        {yoonRows.map(row => {
                            const rowKana = hiraganaYoon.filter(k => k.row === row);
                            return (
                                <div key={row} className="extended-row">
                                    {rowKana.map(kana => (
                                        <div key={kana.character} className="extended-char-box">
                                            <div style={{ fontSize: '20px', fontWeight: 'bold' }}>{kana.character}</div>
                                            <div className="extended-romaji">{kana.romaji}</div>
                                        </div>
                                    ))}
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* VOCAB VIEW */}
            {viewMode === 'vocab' && (
                <div className="simple-grid-container" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))' }}>
                    {filteredVocab.map((v, i) => (
                        <div key={i} className="vocab-card">
                            <p className="vocab-word">{v.word}</p>
                            <p className="vocab-reading">{v.reading}</p>
                            <p className="vocab-meaning">{v.meaning}</p>
                        </div>
                    ))}
                </div>
            )}

            {/* PRACTICE VIEW */}
            {viewMode === 'practice' && (
                <div className="practice-container">
                    <div className="practice-header">
                        <span className="text-gray-500">{practiceIndex + 1} / {kanaData.length}</span>
                        <span className="text-primary">{t('flashcard.score')}: {practiceScore}</span>
                    </div>
                    <div className="practice-progress-bar">
                        <div
                            className="practice-progress-fill"
                            style={{
                                width: `${((practiceIndex + 1) / kanaData.length) * 100}%`,
                                background: kanaType === 'hiragana' ? 'var(--color-primary)' : 'var(--color-secondary)'
                            }}
                        ></div>
                    </div>
                    <div className="practice-card">
                        <div className={`practice-char ${kanaType === 'hiragana' ? 'text-primary' : 'text-secondary'}`}>
                            {kanaData[practiceIndex].character}
                        </div>

                        <div className="quiz-options">
                            {quizOptions.map((option, idx) => {
                                let status = '';
                                if (selectedOption) {
                                    if (option.character === kanaData[practiceIndex].character) status = 'correct';
                                    else if (option.character === selectedOption) status = 'incorrect';
                                }

                                return (
                                    <button
                                        key={idx}
                                        className={`quiz-btn ${status}`}
                                        onClick={() => handleOptionClick(option)}
                                        disabled={!!selectedOption}
                                    >
                                        {option.romaji}
                                    </button>
                                );
                            })}
                        </div>

                        {feedback !== 'idle' && (
                            <div style={{ marginTop: '24px', fontSize: '18px', fontWeight: 'bold', color: feedback === 'correct' ? '#166534' : '#991b1b', animation: 'fadeIn 0.2s' }}>
                                {feedback === 'correct' ? '🎉 Benar!' : `😢 Salah, jawaban: ${kanaData[practiceIndex].romaji}`}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

