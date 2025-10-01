// frontend/src/contexts/AuthContext.tsx
import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { api, apiPublic } from '../lib/api';

// Definindo os tipos para o contexto para termos autocomplete e segurança
interface AuthContextData {
    isAuthenticated: boolean;
    user: any; // Podemos criar um tipo 'User' mais tarde
    loading: boolean;
    signIn(credentials: { email: string, password: string }): Promise<void>;
    signOut(): void;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<any | null>(null);
    const [loading, setLoading] = useState(true);

    // DEIXE APENAS ESTE useEffect
    useEffect(() => {
        const storedUser = localStorage.getItem('@CGA:user');
        const storedToken = localStorage.getItem('@CGA:token');

        if (storedUser && storedToken) {
            setUser(JSON.parse(storedUser));
            api.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
        }
        setLoading(false);
    }, []);

    const signIn = async ({ email, password }) => {
        // Use a instância PÚBLICA para o login
        const response = await apiPublic.post('/sessions', { email, password });
        const { user: apiUser, token } = response.data;

        localStorage.setItem('@CGA:user', JSON.stringify(apiUser));
        localStorage.setItem('@CGA:token', token);

        // IMPORTANTE: Continue setando o header na instância PRIVADA para as futuras requisições
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        setUser(apiUser);
    };

    const signOut = () => {
        localStorage.removeItem('@CGA:user');
        localStorage.removeItem('@CGA:token');
        setUser(null);
        window.location.href = '/login'; // Redireciona para a página de login
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated: !!user, user, loading, signIn, signOut }}>
            {children}
        </AuthContext.Provider>
    );
};

// Hook customizado para facilitar o uso do contexto
export function useAuth(): AuthContextData {
    const context = useContext(AuthContext);
    return context;
}