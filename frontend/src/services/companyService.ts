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

/**
 * Cria uma nova empresa com logo (FormData)
 */
export const createCompany = async (companyData: any): Promise<Company> => {
    try {
        const formData = new FormData();

        // Adiciona os campos básicos
        formData.append('name', companyData.name);
        if (companyData.cnpj) {
            formData.append('cnpj', companyData.cnpj);
        }

        // Adiciona o logo se existir
        if (companyData.logo) {
            formData.append('logo', companyData.logo);
        }

        // Adiciona os serviços se existirem (para SUPER_ADMIN)
        if (companyData.services && Array.isArray(companyData.services)) {
            formData.append('services', JSON.stringify(companyData.services));
        }

        console.log('📤 Enviando dados da empresa:', {
            name: companyData.name,
            cnpj: companyData.cnpj,
            hasLogo: !!companyData.logo,
            services: companyData.services
        });

        const response = await api.post('/companies', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });

        console.log('✅ Empresa criada:', response.data);
        return response.data;
    } catch (error) {
        console.error('Erro ao criar empresa:', error);
        throw error;
    }
};

/**
 * Atualiza uma empresa existente com logo (FormData)
 */
export const updateCompany = async ({ id, companyData }: { id: string; companyData: any }): Promise<Company> => {
    try {
        const formData = new FormData();

        // Adiciona apenas os campos que foram modificados
        if (companyData.name) {
            formData.append('name', companyData.name);
        }
        if (companyData.cnpj) {
            formData.append('cnpj', companyData.cnpj);
        }

        // Adiciona o logo se um novo foi selecionado
        if (companyData.logo) {
            formData.append('logo', companyData.logo);
        }

        // Adiciona os serviços se foram modificados (apenas para SUPER_ADMIN)
        if (companyData.services) {
            const servicesString = typeof companyData.services === 'string'
                ? companyData.services
                : JSON.stringify(companyData.services);
            formData.append('services', servicesString);
        }

        console.log('📤 Atualizando empresa:', {
            id,
            name: companyData.name,
            cnpj: companyData.cnpj,
            hasNewLogo: !!companyData.logo,
            services: companyData.services
        });

        const response = await api.put(`/companies/${id}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });

        console.log('✅ Empresa atualizada:', response.data);
        return response.data;
    } catch (error) {
        console.error(`Erro ao atualizar empresa ${id}:`, error);
        throw error;
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