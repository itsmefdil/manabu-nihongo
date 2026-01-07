import { Router } from 'express';
import { eq } from 'drizzle-orm';
import { db, schema } from '../db';

const router = Router();

// Get vocabulary by level
router.get('/:level/vocab', async (req, res) => {
    try {
        const { level } = req.params;
        const data = await db.select().from(schema.vocabulary).where(eq(schema.vocabulary.level, level));

        return res.json({ success: true, data });
    } catch (error) {
        console.error('Get vocab error:', error);
        return res.status(500).json({ success: false, error: 'Gagal mengambil kosakata' });
    }
});

// Get kanji by level
router.get('/:level/kanji', async (req, res) => {
    try {
        const { level } = req.params;
        const data = await db.select().from(schema.kanji).where(eq(schema.kanji.level, level));

        // Parse JSON strings
        const parsed = data.map(k => ({
            ...k,
            onyomi: JSON.parse(k.onyomi),
            kunyomi: JSON.parse(k.kunyomi),
            meaning: JSON.parse(k.meaning),
            examples: JSON.parse(k.examples),
        }));

        return res.json({ success: true, data: parsed });
    } catch (error) {
        console.error('Get kanji error:', error);
        return res.status(500).json({ success: false, error: 'Gagal mengambil kanji' });
    }
});

// Get grammar by level
router.get('/:level/grammar', async (req, res) => {
    try {
        const { level } = req.params;
        const data = await db.select().from(schema.grammar).where(eq(schema.grammar.level, level));

        // Parse JSON strings
        const parsed = data.map(g => ({
            ...g,
            examples: JSON.parse(g.examples),
        }));

        return res.json({ success: true, data: parsed });
    } catch (error) {
        console.error('Get grammar error:', error);
        return res.status(500).json({ success: false, error: 'Gagal mengambil grammar' });
    }
});

// Get kana (hiragana/katakana) - static data
router.get('/kana/:type', async (req, res) => {
    try {
        const { type } = req.params;

        // Kana data is static, no need for DB
        const hiragana = [
            { character: 'あ', romaji: 'a', row: 'a' },
            { character: 'い', romaji: 'i', row: 'a' },
            { character: 'う', romaji: 'u', row: 'a' },
            { character: 'え', romaji: 'e', row: 'a' },
            { character: 'お', romaji: 'o', row: 'a' },
            { character: 'か', romaji: 'ka', row: 'ka' },
            { character: 'き', romaji: 'ki', row: 'ka' },
            { character: 'く', romaji: 'ku', row: 'ka' },
            { character: 'け', romaji: 'ke', row: 'ka' },
            { character: 'こ', romaji: 'ko', row: 'ka' },
            { character: 'さ', romaji: 'sa', row: 'sa' },
            { character: 'し', romaji: 'shi', row: 'sa' },
            { character: 'す', romaji: 'su', row: 'sa' },
            { character: 'せ', romaji: 'se', row: 'sa' },
            { character: 'そ', romaji: 'so', row: 'sa' },
            { character: 'た', romaji: 'ta', row: 'ta' },
            { character: 'ち', romaji: 'chi', row: 'ta' },
            { character: 'つ', romaji: 'tsu', row: 'ta' },
            { character: 'て', romaji: 'te', row: 'ta' },
            { character: 'と', romaji: 'to', row: 'ta' },
            { character: 'な', romaji: 'na', row: 'na' },
            { character: 'に', romaji: 'ni', row: 'na' },
            { character: 'ぬ', romaji: 'nu', row: 'na' },
            { character: 'ね', romaji: 'ne', row: 'na' },
            { character: 'の', romaji: 'no', row: 'na' },
            { character: 'は', romaji: 'ha', row: 'ha' },
            { character: 'ひ', romaji: 'hi', row: 'ha' },
            { character: 'ふ', romaji: 'fu', row: 'ha' },
            { character: 'へ', romaji: 'he', row: 'ha' },
            { character: 'ほ', romaji: 'ho', row: 'ha' },
            { character: 'ま', romaji: 'ma', row: 'ma' },
            { character: 'み', romaji: 'mi', row: 'ma' },
            { character: 'む', romaji: 'mu', row: 'ma' },
            { character: 'め', romaji: 'me', row: 'ma' },
            { character: 'も', romaji: 'mo', row: 'ma' },
            { character: 'や', romaji: 'ya', row: 'ya' },
            { character: 'ゆ', romaji: 'yu', row: 'ya' },
            { character: 'よ', romaji: 'yo', row: 'ya' },
            { character: 'ら', romaji: 'ra', row: 'ra' },
            { character: 'り', romaji: 'ri', row: 'ra' },
            { character: 'る', romaji: 'ru', row: 'ra' },
            { character: 'れ', romaji: 're', row: 'ra' },
            { character: 'ろ', romaji: 'ro', row: 'ra' },
            { character: 'わ', romaji: 'wa', row: 'wa' },
            { character: 'を', romaji: 'wo', row: 'wa' },
            { character: 'ん', romaji: 'n', row: 'wa' },
        ];

        const katakana = hiragana.map(h => ({
            ...h,
            character: String.fromCharCode(h.character.charCodeAt(0) + 96)
        }));

        // Manual katakana mapping for accuracy
        const katakanaMap: Record<string, string> = {
            'あ': 'ア', 'い': 'イ', 'う': 'ウ', 'え': 'エ', 'お': 'オ',
            'か': 'カ', 'き': 'キ', 'く': 'ク', 'け': 'ケ', 'こ': 'コ',
            'さ': 'サ', 'し': 'シ', 'す': 'ス', 'せ': 'セ', 'そ': 'ソ',
            'た': 'タ', 'ち': 'チ', 'つ': 'ツ', 'て': 'テ', 'と': 'ト',
            'な': 'ナ', 'に': 'ニ', 'ぬ': 'ヌ', 'ね': 'ネ', 'の': 'ノ',
            'は': 'ハ', 'ひ': 'ヒ', 'ふ': 'フ', 'へ': 'ヘ', 'ほ': 'ホ',
            'ま': 'マ', 'み': 'ミ', 'む': 'ム', 'め': 'メ', 'も': 'モ',
            'や': 'ヤ', 'ゆ': 'ユ', 'よ': 'ヨ',
            'ら': 'ラ', 'り': 'リ', 'る': 'ル', 'れ': 'レ', 'ろ': 'ロ',
            'わ': 'ワ', 'を': 'ヲ', 'ん': 'ン',
        };

        const katakanaData = hiragana.map(h => ({
            ...h,
            character: katakanaMap[h.character] || h.character
        }));

        const data = type === 'hiragana' ? hiragana : katakanaData;

        return res.json({ success: true, data });
    } catch (error) {
        console.error('Get kana error:', error);
        return res.status(500).json({ success: false, error: 'Gagal mengambil kana' });
    }
});

export default router;
