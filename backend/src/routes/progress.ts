import { Router } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { eq, and, gte } from 'drizzle-orm';
import { db, schema } from '../db/index.js';
import { authMiddleware, type AuthRequest } from '../middleware/auth.js';

const router = Router();

// Get user's overall progress
router.get('/', authMiddleware, async (req: AuthRequest, res) => {
    try {
        const userId = req.user!.userId;

        // Get streak info
        const streakData = await db.select().from(schema.streaks).where(eq(schema.streaks.userId, userId)).limit(1);

        // Get progress counts by level and type
        const progressData = await db.select().from(schema.progress).where(eq(schema.progress.userId, userId));

        // Group progress
        const summary = {
            vocab: { learning: 0, mastered: 0 },
            kanji: { learning: 0, mastered: 0 },
            grammar: { learning: 0, mastered: 0 },
            kana: { learning: 0, mastered: 0 },
        };

        const levels: Record<string, typeof summary> = {};

        for (const p of progressData) {
            const type = p.itemType as keyof typeof summary;
            const level = p.level;

            // Update global summary
            if (summary[type]) {
                if (p.status === 'mastered') {
                    summary[type].mastered++;
                } else {
                    summary[type].learning++;
                }
            }

            // Update level summary
            if (!levels[level]) {
                levels[level] = {
                    vocab: { learning: 0, mastered: 0 },
                    kanji: { learning: 0, mastered: 0 },
                    grammar: { learning: 0, mastered: 0 },
                    kana: { learning: 0, mastered: 0 },
                };
            }

            if (levels[level][type]) {
                if (p.status === 'mastered') {
                    levels[level][type].mastered++;
                } else {
                    levels[level][type].learning++;
                }
            }
        }

        // Get weekly activity (last 7 days)
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
        const dateStr = sevenDaysAgo.toISOString().split('T')[0] as string;

        const activityLogs = await db.select()
            .from(schema.activityLogs)
            .where(and(
                eq(schema.activityLogs.userId, userId),
                gte(schema.activityLogs.date, dateStr)
            ));

        return res.json({
            success: true,
            data: {
                streak: streakData[0] || { currentStreak: 0, totalXp: 0, todayXp: 0 },
                summary,
                levels,
                weeklyActivity: activityLogs,
                totalItems: progressData.length,
            },
        });
    } catch (error) {
        console.error('Get progress error:', error);
        return res.status(500).json({ success: false, error: 'Gagal mengambil progress' });
    }
});

// Update progress after quiz/review
router.post('/update', authMiddleware, async (req: AuthRequest, res) => {
    try {
        const userId = req.user!.userId;
        const { itemType, itemId, level, correct } = req.body;

        if (!itemType || !itemId || !level || correct === undefined) {
            return res.status(400).json({ success: false, error: 'Data tidak lengkap' });
        }

        // Check existing progress
        const existing = await db.select().from(schema.progress)
            .where(and(
                eq(schema.progress.userId, userId),
                eq(schema.progress.itemId, itemId),
                eq(schema.progress.itemType, itemType)
            ))
            .limit(1);

        const xpGained = correct ? 10 : 2;

        if (existing.length > 0 && existing[0]) {
            // Update
            const current = existing[0];
            const newCorrect = (current.correctCount || 0) + (correct ? 1 : 0);
            const newWrong = (current.wrongCount || 0) + (correct ? 0 : 1);
            const newSrsLevel = correct
                ? Math.min((current.srsLevel || 0) + 1, 8)
                : Math.max((current.srsLevel || 0) - 2, 0);

            const newStatus = newSrsLevel >= 5 ? 'mastered' : newSrsLevel >= 2 ? 'reviewing' : 'learning';

            await db.update(schema.progress)
                .set({
                    correctCount: newCorrect,
                    wrongCount: newWrong,
                    srsLevel: newSrsLevel,
                    status: newStatus,
                    lastReviewedAt: new Date(),
                })
                .where(eq(schema.progress.id, current.id));
        } else {
            // Insert new
            await db.insert(schema.progress).values({
                id: uuidv4(),
                userId,
                itemType,
                itemId,
                level,
                correctCount: correct ? 1 : 0,
                wrongCount: correct ? 0 : 1,
                srsLevel: correct ? 1 : 0,
                status: 'learning',
                lastReviewedAt: new Date(),
            });
        }

        // Update streak and XP
        const today = new Date().toISOString().split('T')[0] as string;
        const streakData = await db.select().from(schema.streaks).where(eq(schema.streaks.userId, userId)).limit(1);

        if (streakData.length > 0 && streakData[0]) {
            const streak = streakData[0];
            const isNewDay = streak.lastActiveDate !== today;
            const wasYesterday = (() => {
                if (!streak.lastActiveDate) return false;
                const yesterday = new Date();
                yesterday.setDate(yesterday.getDate() - 1);
                return streak.lastActiveDate === yesterday.toISOString().split('T')[0];
            })();

            const currentTotalXp = streak.totalXp || 0;
            const currentTodayXp = streak.todayXp || 0;
            const currentTodayLessons = streak.todayLessons || 0;
            const currentStreakVal = streak.currentStreak || 0;
            const currentLongestStreak = streak.longestStreak || 0;

            await db.update(schema.streaks)
                .set({
                    lastActiveDate: today,
                    totalXp: currentTotalXp + xpGained,
                    todayXp: isNewDay ? xpGained : currentTodayXp + xpGained,
                    todayLessons: isNewDay ? 1 : currentTodayLessons + 1,
                    currentStreak: isNewDay ? (wasYesterday ? currentStreakVal + 1 : 1) : currentStreakVal,
                    longestStreak: Math.max(currentLongestStreak, isNewDay && wasYesterday ? currentStreakVal + 1 : currentStreakVal),
                })
                .where(eq(schema.streaks.id, streak.id));
        }

        // Update Activity Log (Daily Count)
        const existingLog = await db.select()
            .from(schema.activityLogs)
            .where(and(
                eq(schema.activityLogs.userId, userId),
                eq(schema.activityLogs.date, today)
            ))
            .limit(1);

        if (existingLog.length > 0 && existingLog[0]) {
            await db.update(schema.activityLogs)
                .set({
                    count: (existingLog[0].count || 0) + 1,
                    lastUpdatedAt: new Date(),
                })
                .where(eq(schema.activityLogs.id, existingLog[0].id));
        } else {
            await db.insert(schema.activityLogs).values({
                id: uuidv4(),
                userId,
                date: today,
                count: 1,
            });
        }

        return res.json({ success: true, data: { xpGained } });
    } catch (error) {
        console.error('Update progress error:', error);
        return res.status(500).json({ success: false, error: 'Gagal update progress' });
    }
});

// Save quiz result
router.post('/quiz', authMiddleware, async (req: AuthRequest, res) => {
    try {
        const userId = req.user!.userId;
        const { quizType, level, score, totalQuestions } = req.body;

        await db.insert(schema.quizResults).values({
            id: uuidv4(),
            userId,
            quizType,
            level,
            score,
            totalQuestions,
        });

        return res.json({ success: true });
    } catch (error) {
        console.error('Save quiz error:', error);
        return res.status(500).json({ success: false, error: 'Gagal menyimpan hasil quiz' });
    }
});

// Get streak info
router.get('/streak', authMiddleware, async (req: AuthRequest, res) => {
    try {
        const userId = req.user!.userId;
        const streakData = await db.select().from(schema.streaks).where(eq(schema.streaks.userId, userId)).limit(1);

        return res.json({
            success: true,
            data: streakData[0] || { currentStreak: 0, longestStreak: 0, totalXp: 0 },
        });
    } catch (error) {
        console.error('Get streak error:', error);
        return res.status(500).json({ success: false, error: 'Gagal mengambil streak' });
    }
});

export default router;
