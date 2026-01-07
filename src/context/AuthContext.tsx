import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { authApi, type User, type Streak } from '../api';

interface AuthContextType {
    user: User | null;
    streak: Streak | null;
    isLoading: boolean;
    isAuthenticated: boolean;
    login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
    register: (email: string, password: string, name: string) => Promise<{ success: boolean; error?: string }>;
    logout: () => void;
    refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [streak, setStreak] = useState<Streak | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('manabu_token');
        if (token) {
            refreshUser();
        } else {
            setIsLoading(false);
        }
    }, []);

    const refreshUser = async () => {
        setIsLoading(true);
        const result = await authApi.me();
        if (result.success && result.data) {
            setUser(result.data);
            setStreak(result.data.streak);
        } else {
            localStorage.removeItem('manabu_token');
            setUser(null);
            setStreak(null);
        }
        setIsLoading(false);
    };

    const login = async (email: string, password: string) => {
        const result = await authApi.login(email, password);
        if (result.success && result.data) {
            localStorage.setItem('manabu_token', result.data.token);
            setUser(result.data.user);
            await refreshUser();
            return { success: true };
        }
        return { success: false, error: result.error };
    };

    const register = async (email: string, password: string, name: string) => {
        const result = await authApi.register(email, password, name);
        if (result.success && result.data) {
            localStorage.setItem('manabu_token', result.data.token);
            setUser(result.data.user);
            await refreshUser();
            return { success: true };
        }
        return { success: false, error: result.error };
    };

    const logout = () => {
        localStorage.removeItem('manabu_token');
        setUser(null);
        setStreak(null);
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                streak,
                isLoading,
                isAuthenticated: !!user,
                login,
                register,
                logout,
                refreshUser,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
}
