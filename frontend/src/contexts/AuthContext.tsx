// frontend/src/contexts/AuthContext.tsx
import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { apiPublic } from '../lib/api'; // <<< MUDANÇA IMPORTANTE: Remova a importação de 'api' daqui

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

    useEffect(() => {
        const storedUser = localStorage.getItem('@CGA:user');
        const storedToken = localStorage.getItem('@CGA:token');

        if (storedUser && storedToken) {
            setUser(JSON.parse(storedUser));
            // O interceptor em api.ts já cuida de adicionar o token,
            // então não precisamos mais do `api.defaults` aqui.
        }
        setLoading(false);

        // --- ADICIONADO: Listener para o evento de logout ---
        // Esta função será chamada quando o evento 'unauthorized' for disparado pelo interceptor.
        const handleUnauthorized = () => {
            signOut();
        };

        // Adiciona o "ouvinte" de eventos.
        window.addEventListener('unauthorized', handleUnauthorized);

        // Função de limpeza: remove o "ouvinte" quando o componente for desmontado.
        // Isso evita memory leaks.
        return () => window.removeEventListener('unauthorized', handleUnauthorized);
    }, []);

    const signIn = async ({ email, password }) => {
        // --- LOG 1: Início da Tentativa de Login ---
        console.log(`[FRONTEND LOG] Tentando fazer login para o email: ${email}`);

        try {
            // Use a instância PÚBLICA para o login
            const response = await apiPublic.post('/sessions', { email, password });

            // ... (verificação de requiresPasswordReset)

            const { user: apiUser, token } = response.data;

            localStorage.setItem('@CGA:user', JSON.stringify(apiUser));
            localStorage.setItem('@CGA:token', token);

            setUser(apiUser);

            // --- LOG 2: Login Bem-sucedido ---
            console.log('[FRONTEND LOG] Login realizado com sucesso. Dados recebidos:', response.data);

        } catch (error) {
            // --- LOG 3: Falha no Login ---
            // Este log é crucial, pois mostrará o erro retornado pelo servidor (ex: 401)
            console.error('[FRONTEND LOG] Falha ao tentar fazer login. Erro:', error.response?.data || error.message);

            // Re-lança o erro para que o componente de Login possa tratá-lo (ex: mostrar uma mensagem na tela)
            throw error;
        }
    };

    const signOut = () => {
        localStorage.removeItem('@CGA:user');
        localStorage.removeItem('@CGA:token');
        setUser(null);
        // Usamos replace para não adicionar a página atual ao histórico do navegador
        if (window.location.pathname !== '/login') {
            window.location.replace('/login');
        }
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