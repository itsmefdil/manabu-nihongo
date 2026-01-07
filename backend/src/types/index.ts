export interface JWTPayload {
    userId: string;
    email: string;
}

export interface AuthRequest extends Request {
    user?: JWTPayload;
}

export interface ApiResponse<T = unknown> {
    success: boolean;
    data?: T;
    message?: string;
    error?: string;
}

export type JLPTLevel = 'N5' | 'N4' | 'N3' | 'N2' | 'N1' | 'kana';

export interface ProgressUpdate {
    itemType: 'vocab' | 'kanji' | 'grammar' | 'kana';
    itemId: string;
    level: string;
    correct: boolean;
}

export interface QuizResult {
    quizType: 'vocab' | 'kanji' | 'kana';
    level: string;
    score: number;
    totalQuestions: number;
}
