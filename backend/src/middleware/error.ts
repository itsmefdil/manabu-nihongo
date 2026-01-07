import type { Request, Response, NextFunction, ErrorRequestHandler } from 'express';

export const errorHandler: ErrorRequestHandler = (
    err: Error,
    _req: Request,
    res: Response,
    _next: NextFunction
): void => {
    console.error('Error:', err.message);

    res.status(500).json({
        success: false,
        error: process.env.NODE_ENV === 'production'
            ? 'Terjadi kesalahan server'
            : err.message,
    });
};
