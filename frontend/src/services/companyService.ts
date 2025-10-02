// src/services/companyService.ts

import { api } from '@/lib/api';

// Função para buscar todos os produtos do sistema (para formulários)
export const fetchAllProducts = async () => {
  const response = await api.get('/products');
  return response.data;
};

// Definimos uma interface para o tipo de dado que esperamos receber.
// Isso nos dará autocomplete e segurança de tipo.
// Baseie-se no seu schema.prisma para os campos corretos.
export interface Company {
    id: string;
    name: string;
    cnpj: string;
    products: { productId: string }[];
    usersCount: number;
    createdAt: string;
    logoUrl?: string;
    primaryColor?: string;
    secondaryColor?: string;
}

// A função assíncrona que busca os dados.
export const fetchCompanies = async (page: number, pageSize: number): Promise<{ data: Company[], totalCount: number }> => {
    try {
        // Faz a chamada GET para o seu endpoint do backend.
        const response = await api.get('/companies', {
            params: { page, pageSize }
        });
        // A boa prática é retornar apenas os dados da resposta.
        return response.data;
    } catch (error) {
        // Se houver um erro, o React Query vai capturá-lo,
        // mas é bom ter um log aqui para debugging.
        console.error('Erro ao buscar empresas:', error);
        // Lançamos o erro para que o React Query saiba que a requisição falhou.
        throw new Error('Falha ao buscar empresas');
    }
};

// A função que recebe os dados do formulário e envia para a API
// src/services/companyService.ts
export const createCompany = async (companyData: any) => {
    const formData = new FormData();
    formData.append('name', companyData.name);
    formData.append('cnpj', companyData.cnpj.replace(/[^\d]/g, ''));

    if (companyData.logo) {
        formData.append('logo', companyData.logo);
    }

    try {
        // NÃO precisa do Content-Type, o axios detecta automaticamente
        const response = await api.post('/companies', formData);
        return response.data;
    } catch (error) {
        console.error('Erro ao criar empresa:', error);
        throw error;
    }
};

export const updateCompany = async ({ id, companyData }: { id: string, companyData: any }) => {
    // Verifica se tem logo para upload
    if (companyData.logo instanceof File) {
        const formData = new FormData();
        formData.append('name', companyData.name);
        formData.append('cnpj', companyData.cnpj.replace(/[^\d]/g, ''));
        formData.append('logo', companyData.logo);

        const response = await api.put(`/companies/${id}`, formData);
        return response.data;
    } else {
        // Se não tem logo, envia como JSON
        const response = await api.put(`/companies/${id}`, companyData);
        return response.data;
    }
};

export const deleteCompany = async (id: string): Promise<void> => {
    try {
        await api.delete(`/companies/${id}`);
    } catch (error) {
        console.error(`Erro ao remover empresa ${id}:`, error);
        throw error;
    }
};