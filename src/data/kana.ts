export interface Kana {
    character: string;
    romaji: string;
    row: string; // a, ka, sa, ta, na, ha, ma, ya, ra, wa
}

export const hiragana: Kana[] = [
    // A row
    { character: 'あ', romaji: 'a', row: 'a' },
    { character: 'い', romaji: 'i', row: 'a' },
    { character: 'う', romaji: 'u', row: 'a' },
    { character: 'え', romaji: 'e', row: 'a' },
    { character: 'お', romaji: 'o', row: 'a' },
    // Ka row
    { character: 'か', romaji: 'ka', row: 'ka' },
    { character: 'き', romaji: 'ki', row: 'ka' },
    { character: 'く', romaji: 'ku', row: 'ka' },
    { character: 'け', romaji: 'ke', row: 'ka' },
    { character: 'こ', romaji: 'ko', row: 'ka' },
    // Sa row
    { character: 'さ', romaji: 'sa', row: 'sa' },
    { character: 'し', romaji: 'shi', row: 'sa' },
    { character: 'す', romaji: 'su', row: 'sa' },
    { character: 'せ', romaji: 'se', row: 'sa' },
    { character: 'そ', romaji: 'so', row: 'sa' },
    // Ta row
    { character: 'た', romaji: 'ta', row: 'ta' },
    { character: 'ち', romaji: 'chi', row: 'ta' },
    { character: 'つ', romaji: 'tsu', row: 'ta' },
    { character: 'て', romaji: 'te', row: 'ta' },
    { character: 'と', romaji: 'to', row: 'ta' },
    // Na row
    { character: 'な', romaji: 'na', row: 'na' },
    { character: 'に', romaji: 'ni', row: 'na' },
    { character: 'ぬ', romaji: 'nu', row: 'na' },
    { character: 'ね', romaji: 'ne', row: 'na' },
    { character: 'の', romaji: 'no', row: 'na' },
    // Ha row
    { character: 'は', romaji: 'ha', row: 'ha' },
    { character: 'ひ', romaji: 'hi', row: 'ha' },
    { character: 'ふ', romaji: 'fu', row: 'ha' },
    { character: 'へ', romaji: 'he', row: 'ha' },
    { character: 'ほ', romaji: 'ho', row: 'ha' },
    // Ma row
    { character: 'ま', romaji: 'ma', row: 'ma' },
    { character: 'み', romaji: 'mi', row: 'ma' },
    { character: 'む', romaji: 'mu', row: 'ma' },
    { character: 'め', romaji: 'me', row: 'ma' },
    { character: 'も', romaji: 'mo', row: 'ma' },
    // Ya row
    { character: 'や', romaji: 'ya', row: 'ya' },
    { character: 'ゆ', romaji: 'yu', row: 'ya' },
    { character: 'よ', romaji: 'yo', row: 'ya' },
    // Ra row
    { character: 'ら', romaji: 'ra', row: 'ra' },
    { character: 'り', romaji: 'ri', row: 'ra' },
    { character: 'る', romaji: 'ru', row: 'ra' },
    { character: 'れ', romaji: 're', row: 'ra' },
    { character: 'ろ', romaji: 'ro', row: 'ra' },
    // Wa row
    { character: 'わ', romaji: 'wa', row: 'wa' },
    { character: 'を', romaji: 'wo', row: 'wa' },
    { character: 'ん', romaji: 'n', row: 'wa' },
];

export const katakana: Kana[] = [
    // A row
    { character: 'ア', romaji: 'a', row: 'a' },
    { character: 'イ', romaji: 'i', row: 'a' },
    { character: 'ウ', romaji: 'u', row: 'a' },
    { character: 'エ', romaji: 'e', row: 'a' },
    { character: 'オ', romaji: 'o', row: 'a' },
    // Ka row
    { character: 'カ', romaji: 'ka', row: 'ka' },
    { character: 'キ', romaji: 'ki', row: 'ka' },
    { character: 'ク', romaji: 'ku', row: 'ka' },
    { character: 'ケ', romaji: 'ke', row: 'ka' },
    { character: 'コ', romaji: 'ko', row: 'ka' },
    // Sa row
    { character: 'サ', romaji: 'sa', row: 'sa' },
    { character: 'シ', romaji: 'shi', row: 'sa' },
    { character: 'ス', romaji: 'su', row: 'sa' },
    { character: 'セ', romaji: 'se', row: 'sa' },
    { character: 'ソ', romaji: 'so', row: 'sa' },
    // Ta row
    { character: 'タ', romaji: 'ta', row: 'ta' },
    { character: 'チ', romaji: 'chi', row: 'ta' },
    { character: 'ツ', romaji: 'tsu', row: 'ta' },
    { character: 'テ', romaji: 'te', row: 'ta' },
    { character: 'ト', romaji: 'to', row: 'ta' },
    // Na row
    { character: 'ナ', romaji: 'na', row: 'na' },
    { character: 'ニ', romaji: 'ni', row: 'na' },
    { character: 'ヌ', romaji: 'nu', row: 'na' },
    { character: 'ネ', romaji: 'ne', row: 'na' },
    { character: 'ノ', romaji: 'no', row: 'na' },
    // Ha row
    { character: 'ハ', romaji: 'ha', row: 'ha' },
    { character: 'ヒ', romaji: 'hi', row: 'ha' },
    { character: 'フ', romaji: 'fu', row: 'ha' },
    { character: 'ヘ', romaji: 'he', row: 'ha' },
    { character: 'ホ', romaji: 'ho', row: 'ha' },
    // Ma row
    { character: 'マ', romaji: 'ma', row: 'ma' },
    { character: 'ミ', romaji: 'mi', row: 'ma' },
    { character: 'ム', romaji: 'mu', row: 'ma' },
    { character: 'メ', romaji: 'me', row: 'ma' },
    { character: 'モ', romaji: 'mo', row: 'ma' },
    // Ya row
    { character: 'ヤ', romaji: 'ya', row: 'ya' },
    { character: 'ユ', romaji: 'yu', row: 'ya' },
    { character: 'ヨ', romaji: 'yo', row: 'ya' },
    // Ra row
    { character: 'ラ', romaji: 'ra', row: 'ra' },
    { character: 'リ', romaji: 'ri', row: 'ra' },
    { character: 'ル', romaji: 'ru', row: 'ra' },
    { character: 'レ', romaji: 're', row: 'ra' },
    { character: 'ロ', romaji: 'ro', row: 'ra' },
    // Wa row
    { character: 'ワ', romaji: 'wa', row: 'wa' },
    { character: 'ヲ', romaji: 'wo', row: 'wa' },
    { character: 'ン', romaji: 'n', row: 'wa' },
];

// Dakuten (voiced consonants)
export const hiraganaDakuten: Kana[] = [
    { character: 'が', romaji: 'ga', row: 'ga' },
    { character: 'ぎ', romaji: 'gi', row: 'ga' },
    { character: 'ぐ', romaji: 'gu', row: 'ga' },
    { character: 'げ', romaji: 'ge', row: 'ga' },
    { character: 'ご', romaji: 'go', row: 'ga' },
    { character: 'ざ', romaji: 'za', row: 'za' },
    { character: 'じ', romaji: 'ji', row: 'za' },
    { character: 'ず', romaji: 'zu', row: 'za' },
    { character: 'ぜ', romaji: 'ze', row: 'za' },
    { character: 'ぞ', romaji: 'zo', row: 'za' },
    { character: 'だ', romaji: 'da', row: 'da' },
    { character: 'ぢ', romaji: 'ji', row: 'da' },
    { character: 'づ', romaji: 'zu', row: 'da' },
    { character: 'で', romaji: 'de', row: 'da' },
    { character: 'ど', romaji: 'do', row: 'da' },
    { character: 'ば', romaji: 'ba', row: 'ba' },
    { character: 'び', romaji: 'bi', row: 'ba' },
    { character: 'ぶ', romaji: 'bu', row: 'ba' },
    { character: 'べ', romaji: 'be', row: 'ba' },
    { character: 'ぼ', romaji: 'bo', row: 'ba' },
];

// Handakuten (p-sounds)
export const hiraganaHandakuten: Kana[] = [
    { character: 'ぱ', romaji: 'pa', row: 'pa' },
    { character: 'ぴ', romaji: 'pi', row: 'pa' },
    { character: 'ぷ', romaji: 'pu', row: 'pa' },
    { character: 'ぺ', romaji: 'pe', row: 'pa' },
    { character: 'ぽ', romaji: 'po', row: 'pa' },
];

// Yōon (combination sounds)
export const hiraganaYoon: Kana[] = [
    { character: 'きゃ', romaji: 'kya', row: 'ky' },
    { character: 'きゅ', romaji: 'kyu', row: 'ky' },
    { character: 'きょ', romaji: 'kyo', row: 'ky' },
    { character: 'しゃ', romaji: 'sha', row: 'sh' },
    { character: 'しゅ', romaji: 'shu', row: 'sh' },
    { character: 'しょ', romaji: 'sho', row: 'sh' },
    { character: 'ちゃ', romaji: 'cha', row: 'ch' },
    { character: 'ちゅ', romaji: 'chu', row: 'ch' },
    { character: 'ちょ', romaji: 'cho', row: 'ch' },
    { character: 'にゃ', romaji: 'nya', row: 'ny' },
    { character: 'にゅ', romaji: 'nyu', row: 'ny' },
    { character: 'にょ', romaji: 'nyo', row: 'ny' },
    { character: 'ひゃ', romaji: 'hya', row: 'hy' },
    { character: 'ひゅ', romaji: 'hyu', row: 'hy' },
    { character: 'ひょ', romaji: 'hyo', row: 'hy' },
    { character: 'みゃ', romaji: 'mya', row: 'my' },
    { character: 'みゅ', romaji: 'myu', row: 'my' },
    { character: 'みょ', romaji: 'myo', row: 'my' },
    { character: 'りゃ', romaji: 'rya', row: 'ry' },
    { character: 'りゅ', romaji: 'ryu', row: 'ry' },
    { character: 'りょ', romaji: 'ryo', row: 'ry' },
];

// Special characters
export const specialKana = {
    sokuon: { hiragana: 'っ', katakana: 'ッ', description: 'Penekanan konsonan' },
    chouon: { katakana: 'ー', description: 'Perpanjangan bunyi' },
};

// Sample vocabulary for practice
export interface KanaVocab {
    word: string;
    reading: string;
    meaning: string;
    type: 'hiragana' | 'katakana';
}

export const kanaVocabulary: KanaVocab[] = [
    { word: 'あさ', reading: 'asa', meaning: 'pagi', type: 'hiragana' },
    { word: 'ねこ', reading: 'neko', meaning: 'kucing', type: 'hiragana' },
    { word: 'いぬ', reading: 'inu', meaning: 'anjing', type: 'hiragana' },
    { word: 'さくら', reading: 'sakura', meaning: 'bunga sakura', type: 'hiragana' },
    { word: 'やま', reading: 'yama', meaning: 'gunung', type: 'hiragana' },
    { word: 'かわ', reading: 'kawa', meaning: 'sungai', type: 'hiragana' },
    { word: 'みず', reading: 'mizu', meaning: 'air', type: 'hiragana' },
    { word: 'がっこう', reading: 'gakkou', meaning: 'sekolah', type: 'hiragana' },
    { word: 'テレビ', reading: 'terebi', meaning: 'televisi', type: 'katakana' },
    { word: 'コーヒー', reading: 'koohii', meaning: 'kopi', type: 'katakana' },
    { word: 'パン', reading: 'pan', meaning: 'roti', type: 'katakana' },
    { word: 'コンピューター', reading: 'konpyuutaa', meaning: 'komputer', type: 'katakana' },
];
