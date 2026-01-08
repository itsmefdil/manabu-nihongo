import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

// Users table
export const users = sqliteTable('users', {
    id: text('id').primaryKey(),
    email: text('email').notNull().unique(),
    passwordHash: text('password_hash').notNull(),
    name: text('name'),
    currentLevel: text('current_level').default('N5'),
    createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
    updatedAt: integer('updated_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
});

// Progress table - tracks individual item progress
export const progress = sqliteTable('progress', {
    id: text('id').primaryKey(),
    userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
    itemType: text('item_type').notNull(), // 'vocab' | 'kanji' | 'grammar' | 'kana'
    itemId: text('item_id').notNull(),
    level: text('level').notNull(), // N5, N4, etc or 'kana'
    status: text('status').default('learning'), // learning | reviewing | mastered
    correctCount: integer('correct_count').default(0),
    wrongCount: integer('wrong_count').default(0),
    lastReviewedAt: integer('last_reviewed_at', { mode: 'timestamp' }),
    nextReviewAt: integer('next_review_at', { mode: 'timestamp' }),
    srsLevel: integer('srs_level').default(0), // Spaced Repetition Level (0-8)
});

// Streaks table - tracks daily activity
export const streaks = sqliteTable('streaks', {
    id: text('id').primaryKey(),
    userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }).unique(),
    currentStreak: integer('current_streak').default(0),
    longestStreak: integer('longest_streak').default(0),
    lastActiveDate: text('last_active_date'), // YYYY-MM-DD format
    totalXp: integer('total_xp').default(0),
    todayXp: integer('today_xp').default(0),
    todayLessons: integer('today_lessons').default(0),
});

// Quiz Results - stores quiz history
export const quizResults = sqliteTable('quiz_results', {
    id: text('id').primaryKey(),
    userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
    quizType: text('quiz_type').notNull(), // vocab | kanji | kana
    level: text('level').notNull(),
    score: integer('score').notNull(),
    totalQuestions: integer('total_questions').notNull(),
    completedAt: integer('completed_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
});

// Vocabulary content
export const vocabulary = sqliteTable('vocabulary', {
    id: text('id').primaryKey(),
    word: text('word').notNull(),
    reading: text('reading').notNull(),
    meaning: text('meaning').notNull(),
    level: text('level').notNull(),
    category: text('category').notNull().default('Umum'),
    exampleJapanese: text('example_japanese'),
    exampleReading: text('example_reading'),
    exampleMeaning: text('example_meaning'),
});

// Kanji content
export const kanji = sqliteTable('kanji', {
    id: text('id').primaryKey(),
    character: text('character').notNull(),
    onyomi: text('onyomi').notNull(), // JSON array as string
    kunyomi: text('kunyomi').notNull(), // JSON array as string
    meaning: text('meaning').notNull(), // JSON array as string
    level: text('level').notNull(),
    examples: text('examples').notNull(), // JSON array as string
});

// Grammar content
export const grammar = sqliteTable('grammar', {
    id: text('id').primaryKey(),
    pattern: text('pattern').notNull(),
    meaning: text('meaning').notNull(),
    usage: text('usage').notNull(),
    level: text('level').notNull(),
    examples: text('examples').notNull(), // JSON array as string
});

// Activity Logs - tracks daily activity history
export const activityLogs = sqliteTable('activity_logs', {
    id: text('id').primaryKey(),
    userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
    date: text('date').notNull(), // YYYY-MM-DD
    count: integer('count').default(0), // items reviewed / lessons completed
    lastUpdatedAt: integer('last_updated_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
});

// Types
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Progress = typeof progress.$inferSelect;
export type NewProgress = typeof progress.$inferInsert;
export type Streak = typeof streaks.$inferSelect;
export type Vocabulary = typeof vocabulary.$inferSelect;
export type Kanji = typeof kanji.$inferSelect;
export type Grammar = typeof grammar.$inferSelect;
export type ActivityLog = typeof activityLogs.$inferSelect;
