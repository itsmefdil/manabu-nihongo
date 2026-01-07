import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, BookOpen, Pencil } from 'lucide-react';
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

export function KanaLearning() {
    const navigate = useNavigate();
    const { t } = useTranslation();

    const [kanaType, setKanaType] = useState<KanaType>('hiragana');
    const [viewMode, setViewMode] = useState<ViewMode>('guide');
    const [selectedKana, setSelectedKana] = useState<Kana | null>(null);

    // Practice state
    const [practiceIndex, setPracticeIndex] = useState(0);
    const [showRomaji, setShowRomaji] = useState(false);
    const [practiceScore, setPracticeScore] = useState(0);

    const kanaData = kanaType === 'hiragana' ? hiragana : katakana;
    const rows = ['a', 'ka', 'sa', 'ta', 'na', 'ha', 'ma', 'ya', 'ra', 'wa'];
    const dakutenRows = ['ga', 'za', 'da', 'ba'];
    const yoonRows = ['ky', 'sh', 'ch', 'ny', 'hy', 'my', 'ry'];

    const handlePracticeAnswer = (correct: boolean) => {
        if (correct) setPracticeScore(s => s + 1);
        if (practiceIndex < kanaData.length - 1) {
            setPracticeIndex(i => i + 1);
            setShowRomaji(false);
        } else {
            setPracticeIndex(0);
            setPracticeScore(0);
            setViewMode('chart');
        }
    };

    const filteredVocab = kanaVocabulary.filter(v => v.type === kanaType);

    return (
        <div>
            <button
                onClick={() => navigate('/')}
                style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px', color: 'var(--color-text-muted)', fontSize: '14px', fontWeight: '500' }}
            >
                <ArrowLeft size={16} />
                {t('sidebar.dashboard')}
            </button>

            <div style={{ marginBottom: '24px' }}>
                <h1 style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '8px' }}>{t('kana.title')}</h1>
                <p style={{ color: 'var(--color-text-muted)' }}>{t('kana.subtitle')}</p>
            </div>

            {/* Type Toggle */}
            <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
                <button onClick={() => setKanaType('hiragana')} style={{ padding: '10px 20px', background: kanaType === 'hiragana' ? 'var(--color-primary)' : 'white', color: kanaType === 'hiragana' ? 'white' : 'var(--color-text-main)', borderRadius: '8px', fontWeight: '600', border: '1px solid rgba(0,0,0,0.05)' }}>
                    あ Hiragana
                </button>
                <button onClick={() => setKanaType('katakana')} style={{ padding: '10px 20px', background: kanaType === 'katakana' ? 'var(--color-secondary)' : 'white', color: kanaType === 'katakana' ? 'white' : 'var(--color-text-main)', borderRadius: '8px', fontWeight: '600', border: '1px solid rgba(0,0,0,0.05)' }}>
                    ア Katakana
                </button>
            </div>

            {/* View Mode Tabs */}
            <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', flexWrap: 'wrap' }}>
                {(['guide', 'chart', 'extended', 'vocab', 'practice'] as ViewMode[]).map(mode => (
                    <button key={mode} onClick={() => { setViewMode(mode); if (mode === 'practice') { setPracticeIndex(0); setPracticeScore(0); setShowRomaji(false); } }}
                        style={{ padding: '8px 16px', background: viewMode === mode ? '#f0f0f0' : 'white', borderRadius: '8px', fontWeight: '500', border: '1px solid rgba(0,0,0,0.05)', fontSize: '14px' }}>
                        {mode === 'guide' && '📖 Panduan'}
                        {mode === 'chart' && '📋 Tabel Dasar'}
                        {mode === 'extended' && '🔊 Dakuten/Yōon'}
                        {mode === 'vocab' && '📝 Kosakata'}
                        {mode === 'practice' && '⚡ Latihan'}
                    </button>
                ))}
            </div>

            {/* GUIDE VIEW */}
            {viewMode === 'guide' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '800px' }}>
                    {/* Section 1 */}
                    <div style={{ background: 'white', padding: '24px', borderRadius: '16px', border: '1px solid rgba(0,0,0,0.05)' }}>
                        <h2 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span>1️⃣</span> Bentuk Huruf Dasar
                        </h2>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
                            <div style={{ padding: '16px', background: 'rgba(215, 74, 73, 0.1)', borderRadius: '12px' }}>
                                <h3 style={{ fontWeight: '600', color: 'var(--color-primary)', marginBottom: '8px' }}>Hiragana ひらがな</h3>
                                <p style={{ fontSize: '14px', color: 'var(--color-text-muted)', marginBottom: '8px' }}>Digunakan untuk kata asli Jepang, partikel, dan akhiran kata kerja</p>
                                <p style={{ fontSize: '20px' }}>あ (a), か (ka), さ (sa)</p>
                            </div>
                            <div style={{ padding: '16px', background: 'rgba(46, 92, 110, 0.1)', borderRadius: '12px' }}>
                                <h3 style={{ fontWeight: '600', color: 'var(--color-secondary)', marginBottom: '8px' }}>Katakana カタカナ</h3>
                                <p style={{ fontSize: '14px', color: 'var(--color-text-muted)', marginBottom: '8px' }}>Digunakan untuk kata serapan asing, nama orang asing, dan onomatope</p>
                                <p style={{ fontSize: '20px' }}>ア (a), カ (ka), サ (sa)</p>
                            </div>
                        </div>
                    </div>

                    {/* Section 2 */}
                    <div style={{ background: 'white', padding: '24px', borderRadius: '16px', border: '1px solid rgba(0,0,0,0.05)' }}>
                        <h2 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span>2️⃣</span> Cara Membaca (Pelafalan)
                        </h2>
                        <div style={{ fontFamily: 'monospace', fontSize: '16px', lineHeight: '2', background: '#f8f8f8', padding: '16px', borderRadius: '8px' }}>
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
                        <p style={{ marginTop: '12px', fontSize: '14px', color: 'var(--color-accent)', fontWeight: '500' }}>
                            👉 Penting: 1 huruf = 1 bunyi, bacaannya konsisten (tidak seperti bahasa Inggris)
                        </p>
                    </div>

                    {/* Section 3 */}
                    <div style={{ background: 'white', padding: '24px', borderRadius: '16px', border: '1px solid rgba(0,0,0,0.05)' }}>
                        <h2 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <Pencil size={20} /> Urutan Goresan (Stroke Order)
                        </h2>
                        <p style={{ fontSize: '14px', color: 'var(--color-text-muted)', marginBottom: '12px' }}>Setiap huruf punya aturan urutan menulis. Membantu:</p>
                        <ul style={{ fontSize: '14px', paddingLeft: '20px', lineHeight: '1.8' }}>
                            <li>Tulisan lebih rapi</li>
                            <li>Mudah dibaca orang Jepang</li>
                            <li>Lebih cepat menulis</li>
                        </ul>
                    </div>

                    {/* Section 4 - Dakuten */}
                    <div style={{ background: 'white', padding: '24px', borderRadius: '16px', border: '1px solid rgba(0,0,0,0.05)' }}>
                        <h2 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span>4️⃣</span> Dakuten & Handakuten
                        </h2>
                        <p style={{ fontSize: '14px', color: 'var(--color-text-muted)', marginBottom: '12px' }}>Tanda tambahan untuk mengubah bunyi:</p>
                        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                            <div style={{ padding: '12px', background: '#f8f8f8', borderRadius: '8px' }}>
                                <p style={{ fontWeight: '600', marginBottom: '4px' }}>Dakuten (゛)</p>
                                <p style={{ fontSize: '20px' }}>が ぎ ぐ げ ご (ga gi gu ge go)</p>
                            </div>
                            <div style={{ padding: '12px', background: '#f8f8f8', borderRadius: '8px' }}>
                                <p style={{ fontWeight: '600', marginBottom: '4px' }}>Handakuten (゜)</p>
                                <p style={{ fontSize: '20px' }}>ぱ ぴ ぷ ぺ ぽ (pa pi pu pe po)</p>
                            </div>
                        </div>
                    </div>

                    {/* Section 5 - Yōon */}
                    <div style={{ background: 'white', padding: '24px', borderRadius: '16px', border: '1px solid rgba(0,0,0,0.05)' }}>
                        <h2 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span>5️⃣</span> Kombinasi Bunyi (Yōon)
                        </h2>
                        <p style={{ fontSize: '14px', color: 'var(--color-text-muted)', marginBottom: '12px' }}>Huruf kecil や ゆ よ / ヤ ユ ヨ digabung dengan huruf lain:</p>
                        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', fontSize: '18px' }}>
                            <span style={{ padding: '8px 12px', background: '#f8f8f8', borderRadius: '8px' }}>きゃ (kya)</span>
                            <span style={{ padding: '8px 12px', background: '#f8f8f8', borderRadius: '8px' }}>しゅ (shu)</span>
                            <span style={{ padding: '8px 12px', background: '#f8f8f8', borderRadius: '8px' }}>ちょ (cho)</span>
                        </div>
                    </div>

                    {/* Section 6 - Special */}
                    <div style={{ background: 'white', padding: '24px', borderRadius: '16px', border: '1px solid rgba(0,0,0,0.05)' }}>
                        <h2 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span>6️⃣</span> Huruf Kecil Khusus
                        </h2>
                        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                            <div style={{ padding: '12px', background: '#f8f8f8', borderRadius: '8px' }}>
                                <p style={{ fontWeight: '600' }}>{specialKana.sokuon.hiragana} / {specialKana.sokuon.katakana} (Sokuon)</p>
                                <p style={{ fontSize: '14px', color: 'var(--color-text-muted)' }}>{specialKana.sokuon.description}</p>
                                <p style={{ marginTop: '8px' }}>がっこう (gakkou) = sekolah</p>
                            </div>
                            <div style={{ padding: '12px', background: '#f8f8f8', borderRadius: '8px' }}>
                                <p style={{ fontWeight: '600' }}>{specialKana.chouon.katakana} (Chōon)</p>
                                <p style={{ fontSize: '14px', color: 'var(--color-text-muted)' }}>{specialKana.chouon.description}</p>
                                <p style={{ marginTop: '8px' }}>コーヒー (koohii) = kopi</p>
                            </div>
                        </div>
                    </div>

                    {/* CTA */}
                    <div style={{ background: 'linear-gradient(135deg, var(--color-primary) 0%, #b83a39 100%)', padding: '24px', borderRadius: '16px', color: 'white', textAlign: 'center' }}>
                        <BookOpen size={32} style={{ marginBottom: '12px' }} />
                        <h3 style={{ fontWeight: '600', marginBottom: '8px' }}>Siap Belajar?</h3>
                        <p style={{ fontSize: '14px', opacity: 0.9, marginBottom: '16px' }}>Mulai dengan melihat tabel huruf atau langsung latihan!</p>
                        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
                            <button onClick={() => setViewMode('chart')} style={{ padding: '12px 24px', background: 'white', color: 'var(--color-primary)', borderRadius: '8px', fontWeight: '600' }}>Lihat Tabel</button>
                            <button onClick={() => setViewMode('practice')} style={{ padding: '12px 24px', background: 'rgba(255,255,255,0.2)', color: 'white', borderRadius: '8px', fontWeight: '600' }}>Mulai Latihan</button>
                        </div>
                    </div>
                </div>
            )}

            {/* CHART VIEW */}
            {viewMode === 'chart' && (
                <div style={{ display: 'flex', gap: '32px', flexWrap: 'wrap' }}>
                    <div style={{ flex: '2 1 400px' }}>
                        {rows.map(row => {
                            const rowKana = kanaData.filter(k => k.row === row);
                            if (rowKana.length === 0) return null;
                            return (
                                <div key={row} style={{ marginBottom: '16px' }}>
                                    <p style={{ fontSize: '12px', color: 'var(--color-text-muted)', marginBottom: '8px' }}>{t(`kana.rows.${row}`)}</p>
                                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                                        {rowKana.map(kana => (
                                            <button key={kana.character} onClick={() => setSelectedKana(kana)}
                                                style={{ width: '56px', height: '56px', background: selectedKana?.character === kana.character ? (kanaType === 'hiragana' ? 'var(--color-primary)' : 'var(--color-secondary)') : 'white', color: selectedKana?.character === kana.character ? 'white' : 'var(--color-text-main)', borderRadius: '12px', fontSize: '26px', fontWeight: 'bold', border: '1px solid rgba(0,0,0,0.05)' }}>
                                                {kana.character}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                    {selectedKana && (
                        <div style={{ flex: '1 1 200px', background: 'white', padding: '32px', borderRadius: '16px', textAlign: 'center', boxShadow: 'var(--shadow-md)', position: 'sticky', top: '24px', alignSelf: 'flex-start' }}>
                            <div style={{ fontSize: '80px', fontWeight: 'bold', color: kanaType === 'hiragana' ? 'var(--color-primary)' : 'var(--color-secondary)', marginBottom: '16px' }}>{selectedKana.character}</div>
                            <p style={{ fontSize: '12px', color: 'var(--color-text-muted)', marginBottom: '4px' }}>{t('kana.romaji')}</p>
                            <p style={{ fontSize: '28px', fontWeight: '600' }}>{selectedKana.romaji}</p>
                        </div>
                    )}
                </div>
            )}

            {/* EXTENDED VIEW - Dakuten, Handakuten, Yōon */}
            {viewMode === 'extended' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    <div style={{ background: 'white', padding: '24px', borderRadius: '16px', border: '1px solid rgba(0,0,0,0.05)' }}>
                        <h3 style={{ fontWeight: '600', marginBottom: '16px' }}>Dakuten (Voiced)</h3>
                        {dakutenRows.map(row => {
                            const rowKana = hiraganaDakuten.filter(k => k.row === row);
                            return (
                                <div key={row} style={{ marginBottom: '12px' }}>
                                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                                        {rowKana.map(kana => (
                                            <div key={kana.character} style={{ width: '56px', textAlign: 'center' }}>
                                                <div style={{ fontSize: '24px', fontWeight: 'bold' }}>{kana.character}</div>
                                                <div style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>{kana.romaji}</div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    <div style={{ background: 'white', padding: '24px', borderRadius: '16px', border: '1px solid rgba(0,0,0,0.05)' }}>
                        <h3 style={{ fontWeight: '600', marginBottom: '16px' }}>Handakuten (P-sounds)</h3>
                        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                            {hiraganaHandakuten.map(kana => (
                                <div key={kana.character} style={{ width: '56px', textAlign: 'center' }}>
                                    <div style={{ fontSize: '24px', fontWeight: 'bold' }}>{kana.character}</div>
                                    <div style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>{kana.romaji}</div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div style={{ background: 'white', padding: '24px', borderRadius: '16px', border: '1px solid rgba(0,0,0,0.05)' }}>
                        <h3 style={{ fontWeight: '600', marginBottom: '16px' }}>Yōon (Combination Sounds)</h3>
                        {yoonRows.map(row => {
                            const rowKana = hiraganaYoon.filter(k => k.row === row);
                            return (
                                <div key={row} style={{ marginBottom: '12px' }}>
                                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                                        {rowKana.map(kana => (
                                            <div key={kana.character} style={{ width: '56px', textAlign: 'center' }}>
                                                <div style={{ fontSize: '20px', fontWeight: 'bold' }}>{kana.character}</div>
                                                <div style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>{kana.romaji}</div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* VOCAB VIEW */}
            {viewMode === 'vocab' && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '16px' }}>
                    {filteredVocab.map((v, i) => (
                        <div key={i} style={{ background: 'white', padding: '20px', borderRadius: '12px', border: '1px solid rgba(0,0,0,0.05)' }}>
                            <p style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '4px' }}>{v.word}</p>
                            <p style={{ fontSize: '14px', color: 'var(--color-text-muted)', marginBottom: '4px' }}>{v.reading}</p>
                            <p style={{ fontWeight: '500' }}>{v.meaning}</p>
                        </div>
                    ))}
                </div>
            )}

            {/* PRACTICE VIEW */}
            {viewMode === 'practice' && (
                <div style={{ maxWidth: '400px', margin: '0 auto', textAlign: 'center' }}>
                    <div style={{ marginBottom: '16px' }}>
                        <span style={{ fontSize: '14px', color: 'var(--color-text-muted)' }}>{practiceIndex + 1} / {kanaData.length}</span>
                        <span style={{ marginLeft: '16px', fontWeight: '600', color: 'var(--color-primary)' }}>{t('flashcard.score')}: {practiceScore}</span>
                    </div>
                    <div style={{ height: '6px', background: '#eee', borderRadius: '99px', overflow: 'hidden', marginBottom: '32px' }}>
                        <div style={{ width: `${((practiceIndex + 1) / kanaData.length) * 100}%`, height: '100%', background: kanaType === 'hiragana' ? 'var(--color-primary)' : 'var(--color-secondary)', borderRadius: '99px' }}></div>
                    </div>
                    <div style={{ background: 'white', padding: '48px', borderRadius: '24px', boxShadow: 'var(--shadow-lg)', marginBottom: '24px' }}>
                        <div style={{ fontSize: '96px', fontWeight: 'bold', color: kanaType === 'hiragana' ? 'var(--color-primary)' : 'var(--color-secondary)', marginBottom: '24px' }}>{kanaData[practiceIndex].character}</div>
                        {!showRomaji ? (
                            <button onClick={() => setShowRomaji(true)} style={{ padding: '16px 32px', background: 'var(--color-secondary)', color: 'white', borderRadius: '12px', fontWeight: '600' }}>{t('flashcard.showAnswer')}</button>
                        ) : (
                            <>
                                <p style={{ fontSize: '32px', fontWeight: '600', marginBottom: '24px' }}>{kanaData[practiceIndex].romaji}</p>
                                <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
                                    <button onClick={() => handlePracticeAnswer(false)} style={{ padding: '16px 32px', background: '#fee2e2', color: '#dc2626', borderRadius: '12px', fontWeight: '600' }}>{t('flashcard.incorrect')}</button>
                                    <button onClick={() => handlePracticeAnswer(true)} style={{ padding: '16px 32px', background: '#dcfce7', color: '#16a34a', borderRadius: '12px', fontWeight: '600' }}>{t('flashcard.correct')}</button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
