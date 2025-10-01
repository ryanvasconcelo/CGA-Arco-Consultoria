// frontend/src/services/userService.ts
import { api } from '@/lib/api';

export interface User {
    id: string;
    name: string;
    email: string;
    role: string;
    status: string;
    company: {
        name: string;
    };
    createdAt: string;
}

// --- FUNÇÃO DE LEITURA ---
export const fetchUsers = async (): Promise<User[]> => {
    try {
        const response = await api.get('/users');
        return response.data;
    } catch (error) {
        console.error('Erro ao buscar usuários:', error);
        throw new Error('Falha ao buscar usuários');
    }
};

// --- FUNÇÃO DE CRIAÇÃO ---
export const createUser = async (userData: any) => {
    try {
        const response = await api.post('/users', userData);
        return response.data;
    } catch (error) {
        console.error('Erro ao criar usuário:', error);
        throw error; // Lança o erro para o React Query capturar
    }
};

// --- FUNÇÃO DE ATUALIZAÇÃO (NOVA) ---
export const updateUser = async ({ id, data }: { id: string, data: any }) => {
    try {
        // Faz uma requisição PUT para o endpoint /users/:id
        const response = await api.put(`/users/${id}`, data);
        return response.data;
    } catch (error) {
        console.error(`Erro ao atualizar usuário ${id}:`, error);
        throw error; // Lança o erro para o React Query capturar
    }
};

// Futuramente, a função de deletar virá aqui.