import { drizzle as drizzleLibsql } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client';
import { drizzle as drizzlePg } from 'drizzle-orm/node-postgres';
import pg from 'pg';
import * as schemaSqlite from './db/schema.sqlite.js';
import * as schemaPg from './db/schema.postgres.js';
import { sql } from 'drizzle-orm';

async function migrate() {
    console.log('Starting migration from SQLite to PostgreSQL...');

    // 1. Connect to SQLite (Source)
    const sqliteUrl = 'file:./manabu-data.db';
    console.log(`Connecting to SQLite at ${sqliteUrl}`);
    const sqliteClient = createClient({ url: sqliteUrl });
    const dbSqlite = drizzleLibsql(sqliteClient, { schema: schemaSqlite });

    // 2. Connect to PostgreSQL (Destination)
    const pgUrl = process.env.DATABASE_URL;
    if (!pgUrl) {
        console.error('DATABASE_URL environment variable is not set.');
        process.exit(1);
    }
    console.log(`Connecting to PostgreSQL...`);
    const pgPool = new pg.Pool({ connectionString: pgUrl });
    const dbPg = drizzlePg(pgPool, { schema: schemaPg });

    try {
        // 3. Migrate Users
        console.log('Migrating Users...');
        const users = await dbSqlite.select().from(schemaSqlite.users);
        if (users.length > 0) {
            await dbPg.insert(schemaPg.users).values(users).onConflictDoNothing();
            console.log(`Migrated ${users.length} users.`);
        } else {
            console.log('No users to migrate.');
        }

        // 4. Migrate Content (Vocabulary, Kanji, Grammar)
        // These can be done in parallel or sequence, order doesn't matter relative to each other, 
        // but no FKs to users, so safe to do anytime.

        console.log('Migrating Vocabulary...');
        const vocab = await dbSqlite.select().from(schemaSqlite.vocabulary);
        if (vocab.length > 0) {
            await dbPg.insert(schemaPg.vocabulary).values(vocab).onConflictDoNothing();
            console.log(`Migrated ${vocab.length} vocabulary items.`);
        }

        console.log('Migrating Kanji...');
        const kanji = await dbSqlite.select().from(schemaSqlite.kanji);
        if (kanji.length > 0) {
            await dbPg.insert(schemaPg.kanji).values(kanji).onConflictDoNothing();
            console.log(`Migrated ${kanji.length} kanji items.`);
        }

        console.log('Migrating Grammar...');
        const grammar = await dbSqlite.select().from(schemaSqlite.grammar);
        if (grammar.length > 0) {
            await dbPg.insert(schemaPg.grammar).values(grammar).onConflictDoNothing();
            console.log(`Migrated ${grammar.length} grammar items.`);
        }

        // 5. Migrate User Data (Streaks, Progress, QuizResults, ActivityLogs)
        // Check for users first to ensure FK satisfied. (Already done above)

        console.log('Migrating Streaks...');
        const streaks = await dbSqlite.select().from(schemaSqlite.streaks);
        if (streaks.length > 0) {
            // Filter out streaks for users that might not exist (though they should if we migrated users)
            // For safety, we can just insert.
            await dbPg.insert(schemaPg.streaks).values(streaks).onConflictDoNothing();
            console.log(`Migrated ${streaks.length} streaks.`);
        }

        console.log('Migrating Progress...');
        const progress = await dbSqlite.select().from(schemaSqlite.progress);
        if (progress.length > 0) {
            // Batch insert progress if there are many
            const batchSize = 1000;
            for (let i = 0; i < progress.length; i += batchSize) {
                const batch = progress.slice(i, i + batchSize);
                await dbPg.insert(schemaPg.progress).values(batch).onConflictDoNothing();
            }
            console.log(`Migrated ${progress.length} progress items.`);
        }

        console.log('Migrating Quiz Results...');
        const quizResults = await dbSqlite.select().from(schemaSqlite.quizResults);
        if (quizResults.length > 0) {
            await dbPg.insert(schemaPg.quizResults).values(quizResults).onConflictDoNothing();
            console.log(`Migrated ${quizResults.length} quiz results.`);
        }

        console.log('Migrating Activity Logs...');
        const activityLogs = await dbSqlite.select().from(schemaSqlite.activityLogs);
        if (activityLogs.length > 0) {
            await dbPg.insert(schemaPg.activityLogs).values(activityLogs).onConflictDoNothing();
            console.log(`Migrated ${activityLogs.length} activity logs.`);
        }

        console.log('Migration completed successfully!');

    } catch (error) {
        console.error('Migration failed:', error);
    } finally {
        await pgPool.end();
        sqliteClient.close();
    }
}

migrate();
