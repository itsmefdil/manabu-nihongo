import { Router } from 'express';
import authRoutes from './auth.js';
import progressRoutes from './progress.js';
import contentRoutes from './content.js';

const router = Router();

router.use('/auth', authRoutes);
router.use('/progress', progressRoutes);
router.use('/content', contentRoutes);

// Health check
router.get('/health', (_req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

export default router;
