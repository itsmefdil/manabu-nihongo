import { Router } from 'express';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import { eq } from 'drizzle-orm';
import { db, schema } from '../db';
import { generateToken } from '../middleware/auth';

const router = Router();

// Register
router.post('/register', async (req, res) => {
    try {
        const { email, password, name } = req.body;

        if (!email || !password) {
            return res.status(400).json({ success: false, error: 'Email dan password wajib diisi' });
        }

        // Check existing user
        const existing = await db.select().from(schema.users).where(eq(schema.users.email, email)).limit(1);
        if (existing.length > 0) {
            return res.status(400).json({ success: false, error: 'Email sudah terdaftar' });
        }

        // Hash password
        const passwordHash = await bcrypt.hash(password, 10);
        const userId = uuidv4();

        // Create user
        await db.insert(schema.users).values({
            id: userId,
            email,
            passwordHash,
            name: name || 'Pelajar',
        });

        // Create initial streak record
        await db.insert(schema.streaks).values({
            id: uuidv4(),
            userId,
        });

        const token = generateToken({ userId, email });

        return res.status(201).json({
            success: true,
            data: { token, user: { id: userId, email, name: name || 'Pelajar' } },
        });
    } catch (error) {
        console.error('Register error:', error);
        return res.status(500).json({ success: false, error: 'Gagal mendaftar' });
    }
});

// Login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ success: false, error: 'Email dan password wajib diisi' });
        }

        const users = await db.select().from(schema.users).where(eq(schema.users.email, email)).limit(1);
        if (users.length === 0) {
            return res.status(401).json({ success: false, error: 'Email atau password salah' });
        }

        const user = users[0];
        const validPassword = await bcrypt.compare(password, user.passwordHash);
        if (!validPassword) {
            return res.status(401).json({ success: false, error: 'Email atau password salah' });
        }

        const token = generateToken({ userId: user.id, email: user.email });

        return res.json({
            success: true,
            data: {
                token,
                user: { id: user.id, email: user.email, name: user.name, currentLevel: user.currentLevel },
            },
        });
    } catch (error) {
        console.error('Login error:', error);
        return res.status(500).json({ success: false, error: 'Gagal login' });
    }
});

// Get current user
router.get('/me', async (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return res.status(401).json({ success: false, error: 'Token tidak ditemukan' });
        }

        const token = authHeader.split(' ')[1];
        const jwt = await import('jsonwebtoken');
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'manabu-secret-key-change-in-production') as { userId: string };

        const users = await db.select().from(schema.users).where(eq(schema.users.id, decoded.userId)).limit(1);
        if (users.length === 0) {
            return res.status(404).json({ success: false, error: 'User tidak ditemukan' });
        }

        const user = users[0];
        const streakData = await db.select().from(schema.streaks).where(eq(schema.streaks.userId, user.id)).limit(1);

        return res.json({
            success: true,
            data: {
                id: user.id,
                email: user.email,
                name: user.name,
                currentLevel: user.currentLevel,
                streak: streakData[0] || null,
            },
        });
    } catch {
        return res.status(401).json({ success: false, error: 'Token tidak valid' });
    }
});

export default router;
