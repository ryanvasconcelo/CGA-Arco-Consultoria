// frontend/src/services/userService.ts
import { api } from '@/lib/api';

// --- INTERFACE ATUALIZADA ---
export interface User {
    id: string;
    name: string;
    email: string;
    role: string;
    status: string;
    createdAt: string;
    company: {
        id: string;
        name: string;
        products: {
            product: {
                id: string;
                name: string;
            }
        }[];
    };
    userProducts: {
        companyProduct: {
            productId: string;
        }
    }[];
    permissions: {
        permission: {
            action: string;
            subject: string;
        }
    }[];
}

// --- FUNÇÃO DE LEITURA ---
export const fetchUsers = async (page: number, pageSize: number, companyId?: string): Promise<{ data: User[], totalCount: number }> => {
    try {
        const params: any = { page, pageSize };
        if (companyId) {
            params.companyId = companyId;
        }
        const response = await api.get('/users', {
            params
        });
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

// --- FUNÇÃO DE DELEÇÃO (NOVA) ---
export const deleteUser = async (id: string): Promise<void> => {
    try {
        // Faz uma requisição DELETE para o endpoint /users/:id
        await api.delete(`/users/${id}`);
    } catch (error) {
        console.error(`Erro ao remover usuário ${id}:`, error);
        throw error; // Lança o erro para o React Query capturar
    }
};