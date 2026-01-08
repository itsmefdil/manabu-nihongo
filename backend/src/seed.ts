import { db, schema } from './db';
import { v4 as uuidv4 } from 'uuid';

import { n5Vocab } from './data/n5_vocab';
import { n5Kanji } from './data/n5_kanji';
import { n5Grammar } from './data/n5_grammar';

async function seed() {
    console.log('🧹 Clearing existing data...');
    await db.delete(schema.vocabulary);
    await db.delete(schema.kanji);
    await db.delete(schema.grammar);

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
