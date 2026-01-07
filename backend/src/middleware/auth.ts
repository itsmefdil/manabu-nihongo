import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import type { JWTPayload } from '../types';

const JWT_SECRET = process.env.JWT_SECRET || 'manabu-secret-key-change-in-production';

export interface AuthRequest extends Request {
    user?: JWTPayload;
}

export function authMiddleware(req: AuthRequest, res: Response, next: NextFunction): void {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        res.status(401).json({ success: false, error: 'Token tidak ditemukan' });
        return;
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, JWT_SECRET) as JWTPayload;
        req.user = decoded;
        next();
    } catch {
        res.status(401).json({ success: false, error: 'Token tidak valid' });
    }
}

export function generateToken(payload: JWTPayload): string {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}

export { JWT_SECRET };
