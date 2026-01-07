import { db, schema } from './db';
import { v4 as uuidv4 } from 'uuid';

// N5 Vocabulary data
const n5Vocab = [
    { word: '私', reading: 'わたし', meaning: 'saya; aku', level: 'N5', exampleJapanese: '私は学生です。', exampleReading: 'わたしはがくせいです。', exampleMeaning: 'Saya adalah pelajar.' },
    { word: '猫', reading: 'ねこ', meaning: 'kucing', level: 'N5', exampleJapanese: '猫が好きです。', exampleReading: 'ねこがすきです。', exampleMeaning: 'Saya suka kucing.' },
    { word: '食べる', reading: 'たべる', meaning: 'makan', level: 'N5', exampleJapanese: '寿司を食べます。', exampleReading: 'すしをたべます。', exampleMeaning: 'Saya makan sushi.' },
    { word: '飲む', reading: 'のむ', meaning: 'minum', level: 'N5', exampleJapanese: '水を飲みます。', exampleReading: 'みずをのみます。', exampleMeaning: 'Saya minum air.' },
    { word: '行く', reading: 'いく', meaning: 'pergi', level: 'N5', exampleJapanese: '学校に行きます。', exampleReading: 'がっこうにいきます。', exampleMeaning: 'Saya pergi ke sekolah.' },
    { word: '来る', reading: 'くる', meaning: 'datang', level: 'N5', exampleJapanese: '友達が来ます。', exampleReading: 'ともだちがきます。', exampleMeaning: 'Teman datang.' },
    { word: '見る', reading: 'みる', meaning: 'melihat; menonton', level: 'N5', exampleJapanese: 'テレビを見ます。', exampleReading: 'てれびをみます。', exampleMeaning: 'Saya menonton TV.' },
    { word: '聞く', reading: 'きく', meaning: 'mendengar; bertanya', level: 'N5', exampleJapanese: '音楽を聞きます。', exampleReading: 'おんがくをききます。', exampleMeaning: 'Saya mendengarkan musik.' },
];

// N5 Kanji data
const n5Kanji = [
    { character: '日', onyomi: ['ニチ', 'ジツ'], kunyomi: ['ひ', 'か'], meaning: ['hari', 'matahari', 'Jepang'], level: 'N5', examples: [{ word: '日曜日', reading: 'にちようび', meaning: 'Minggu' }, { word: '今日', reading: 'きょう', meaning: 'hari ini' }] },
    { character: '月', onyomi: ['ゲツ', 'ガツ'], kunyomi: ['つき'], meaning: ['bulan'], level: 'N5', examples: [{ word: '月曜日', reading: 'げつようび', meaning: 'Senin' }] },
    { character: '火', onyomi: ['カ'], kunyomi: ['ひ'], meaning: ['api'], level: 'N5', examples: [{ word: '火曜日', reading: 'かようび', meaning: 'Selasa' }] },
    { character: '水', onyomi: ['スイ'], kunyomi: ['みず'], meaning: ['air'], level: 'N5', examples: [{ word: '水曜日', reading: 'すいようび', meaning: 'Rabu' }] },
    { character: '木', onyomi: ['モク', 'ボク'], kunyomi: ['き'], meaning: ['pohon', 'kayu'], level: 'N5', examples: [{ word: '木曜日', reading: 'もくようび', meaning: 'Kamis' }] },
    { character: '金', onyomi: ['キン', 'コン'], kunyomi: ['かね', 'かな'], meaning: ['emas', 'uang'], level: 'N5', examples: [{ word: '金曜日', reading: 'きんようび', meaning: 'Jumat' }] },
    { character: '土', onyomi: ['ド', 'ト'], kunyomi: ['つち'], meaning: ['tanah'], level: 'N5', examples: [{ word: '土曜日', reading: 'どようび', meaning: 'Sabtu' }] },
    { character: '山', onyomi: ['サン'], kunyomi: ['やま'], meaning: ['gunung'], level: 'N5', examples: [{ word: '富士山', reading: 'ふじさん', meaning: 'Gunung Fuji' }] },
];

// N5 Grammar data
const n5Grammar = [
    { pattern: '〜は〜です', meaning: 'A adalah B (sopan)', usage: 'Digunakan untuk mendeskripsikan atau mengidentifikasi sesuatu. Pola kalimat paling dasar.', level: 'N5', examples: [{ sentence: '私は学生です。', meaning: 'Saya adalah pelajar.' }] },
    { pattern: '〜を〜ます', meaning: 'melakukan (penanda objek)', usage: 'を menandai objek langsung dari kata kerja.', level: 'N5', examples: [{ sentence: 'りんごを食べます。', meaning: 'Saya makan apel.' }] },
    { pattern: '〜に行きます', meaning: 'pergi ke (tempat)', usage: 'に menunjukkan tujuan saat menggunakan kata kerja gerakan.', level: 'N5', examples: [{ sentence: '学校に行きます。', meaning: 'Saya pergi ke sekolah.' }] },
    { pattern: '〜があります / います', meaning: 'ada / memiliki', usage: 'あります untuk benda mati, います untuk makhluk hidup.', level: 'N5', examples: [{ sentence: '机の上に本があります。', meaning: 'Ada buku di atas meja.' }] },
    { pattern: '〜が好きです', meaning: 'suka ~', usage: 'Menyatakan kesukaan. が menandai hal yang disukai.', level: 'N5', examples: [{ sentence: '寿司が好きです。', meaning: 'Saya suka sushi.' }] },
    { pattern: '〜たい', meaning: 'ingin melakukan ~', usage: 'Ditambahkan ke bentuk stem kata kerja untuk menyatakan keinginan.', level: 'N5', examples: [{ sentence: '日本に行きたいです。', meaning: 'Saya ingin pergi ke Jepang.' }] },
];

async function seed() {
    console.log('🌱 Seeding database...');

    // Seed vocabulary
    console.log('📚 Seeding vocabulary...');
    for (const v of n5Vocab) {
        await db.insert(schema.vocabulary).values({
            id: uuidv4(),
            word: v.word,
            reading: v.reading,
            meaning: v.meaning,
            level: v.level,
            exampleJapanese: v.exampleJapanese,
            exampleReading: v.exampleReading,
            exampleMeaning: v.exampleMeaning,
        }).onConflictDoNothing();
    }

    // Seed kanji
    console.log('🔤 Seeding kanji...');
    for (const k of n5Kanji) {
        await db.insert(schema.kanji).values({
            id: uuidv4(),
            character: k.character,
            onyomi: JSON.stringify(k.onyomi),
            kunyomi: JSON.stringify(k.kunyomi),
            meaning: JSON.stringify(k.meaning),
            level: k.level,
            examples: JSON.stringify(k.examples),
        }).onConflictDoNothing();
    }

    // Seed grammar
    console.log('📖 Seeding grammar...');
    for (const g of n5Grammar) {
        await db.insert(schema.grammar).values({
            id: uuidv4(),
            pattern: g.pattern,
            meaning: g.meaning,
            usage: g.usage,
            level: g.level,
            examples: JSON.stringify(g.examples),
        }).onConflictDoNothing();
    }

    console.log('✅ Seeding complete!');
}

seed().catch(console.error);
