const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3333/api';

interface ApiResponse<T> {
    success: boolean;
    data?: T;
    error?: string;
}

async function request<T>(
    endpoint: string,
    options: RequestInit = {}
): Promise<ApiResponse<T>> {
    const token = localStorage.getItem('manabu_token');

    const headers: HeadersInit = {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...options.headers,
    };

    try {
        const response = await fetch(`${API_URL}${endpoint}`, {
            ...options,
            headers,
        });

        const data = await response.json();
        return data;
    } catch (error) {
        return { success: false, error: 'Koneksi ke server gagal' };
    }
}

// Auth API
export const authApi = {
    register: (email: string, password: string, name: string) =>
        request<{ token: string; user: User }>('/auth/register', {
            method: 'POST',
            body: JSON.stringify({ email, password, name }),
        }),

    login: (email: string, password: string) =>
        request<{ token: string; user: User }>('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ email, password }),
        }),

    me: () => request<UserWithStreak>('/auth/me'),
};

// Progress API
export const progressApi = {
    getProgress: () => request<ProgressSummary>('/progress'),

    updateProgress: (data: ProgressUpdate) =>
        request<{ xpGained: number }>('/progress/update', {
            method: 'POST',
            body: JSON.stringify(data),
        }),

    saveQuiz: (data: QuizResult) =>
        request('/progress/quiz', {
            method: 'POST',
            body: JSON.stringify(data),
        }),

    getStreak: () => request<Streak>('/progress/streak'),
};

// Content API
export const contentApi = {
    getVocab: (level: string) => request<Vocabulary[]>(`/content/${level}/vocab`),
    getKanji: (level: string) => request<Kanji[]>(`/content/${level}/kanji`),
    getGrammar: (level: string) => request<Grammar[]>(`/content/${level}/grammar`),
    getKana: (type: 'hiragana' | 'katakana') => request<Kana[]>(`/content/kana/${type}`),
};

// Types
export interface User {
    id: string;
    email: string;
    name: string;
    currentLevel?: string;
    createdAt?: string; // ISO date string
}

export interface UserWithStreak extends User {
    streak: Streak | null;
}

export interface Streak {
    currentStreak: number;
    longestStreak: number;
    totalXp: number;
    todayXp: number;
    todayLessons: number;
    lastActiveDate?: string;
}

export interface ProgressSummary {
    streak: Streak;
    summary: {
        vocab: { learning: number; mastered: number };
        kanji: { learning: number; mastered: number };
        grammar: { learning: number; mastered: number };
        kana: { learning: number; mastered: number };
    };
    levels: Record<string, {
        vocab: { learning: number; mastered: number };
        kanji: { learning: number; mastered: number };
        grammar: { learning: number; mastered: number };
        kana: { learning: number; mastered: number };
    }>;
    weeklyActivity: { date: string; count: number }[];
    totalItems: number;
}

export interface ProgressUpdate {
    itemType: 'vocab' | 'kanji' | 'grammar' | 'kana';
    itemId: string;
    level: string;
    correct: boolean;
}

export interface QuizResult {
    quizType: 'vocab' | 'kanji' | 'grammar' | 'kana';
    level: string;
    score: number;
    totalQuestions: number;
}

export interface Vocabulary {
    id: string;
    word: string;
    reading: string;
    meaning: string;
    level: string;
    category?: string;
    exampleJapanese?: string;
    exampleReading?: string;
    exampleMeaning?: string;
}

export interface Kanji {
    id: string;
    character: string;
    onyomi: string[];
    kunyomi: string[];
    meaning: string[];
    level: string;
    examples: { word: string; reading: string; meaning: string }[];
}

export interface Grammar {
    id: string;
    pattern: string;
    meaning: string;
    usage: string;
    level: string;
    examples: { sentence: string; meaning: string }[];
}

export interface Kana {
    character: string;
    romaji: string;
    row: string;
}
