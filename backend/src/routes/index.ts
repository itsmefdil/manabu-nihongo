import { Router } from 'express';
import authRoutes from './auth';
import progressRoutes from './progress';
import contentRoutes from './content';

const router = Router();

router.use('/auth', authRoutes);
router.use('/progress', progressRoutes);
router.use('/content', contentRoutes);

// Health check
router.get('/health', (_req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

export default router;
