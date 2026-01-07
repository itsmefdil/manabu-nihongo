export type JLPTLevel = 'N5' | 'N4' | 'N3' | 'N2' | 'N1';

export interface Vocabulary {
    id: string;
    word: string; // The word in Kanji or easiest form
    reading: string; // Hiragana/Katakana reading
    meaning: string;
    level: JLPTLevel;
    exampleSentence?: {
        japanese: string;
        reading: string;
        english: string;
    };
}

export interface Kanji {
    id: string;
    character: string;
    onyomi: string[];
    kunyomi: string[];
    meaning: string[];
    level: JLPTLevel;
    examples: {
        word: string;
        reading: string;
        meaning: string;
    }[];
}

export interface Grammar {
    id: string;
    pattern: string;
    meaning: string;
    usage: string;
    level: JLPTLevel;
    examples: {
        sentence: string;
        meaning: string;
    }[];
}
