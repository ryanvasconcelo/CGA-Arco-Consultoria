// src/services/companyService.ts

import api from '../lib/api'; // Supondo que você tenha um arquivo 'api.ts' que exporta uma instância do axios já configurada com a baseURL e interceptors. Se não tiver, pode usar o axios diretamente.

// Definimos uma interface para o tipo de dado que esperamos receber.
// Isso nos dará autocomplete e segurança de tipo.
// Baseie-se no seu schema.prisma para os campos corretos.
export interface Company {
    id: string;
    name: string;
    cnpj: string;
    services: string[];      // Adicionado
    usersCount: number;      // Adicionado
    createdAt: string;       // Adicionado
    logoUrl?: string;        // Adicionado (opcional)
    customColors?: {         // Adicionado (opcional)
        primary: string;
        secondary: string;
    };
}

// A função assíncrona que busca os dados.
export const fetchCompanies = async (): Promise<Company[]> => {
    try {
        // Faz a chamada GET para o seu endpoint do backend.
        const response = await api.get('/companies');
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
export const createCompany = async (companyData: FormData) => {
    try {
        // Usamos o método POST para criar um novo recurso.
        const response = await api.post('/companies', companyData);
        return response.data;
    } catch (error) {
        console.error('Erro ao criar empresa:', error);
        // Lançamos o erro para o useMutation saber que falhou.
        throw new Error('Falha ao criar empresa');
    }
};

export const updateCompany = async ({ id, companyData }: { id: string, companyData: FormData }) => {
    try {
        // Note o uso de `api.put` e a inclusão do ID na URL.
        // O seu endpoint pode ser PUT ou PATCH, ajuste conforme sua API.
        const response = await api.put(`/companies/${id}`, companyData);
        return response.data;
    } catch (error) {
        console.error(`Erro ao atualizar empresa com ID ${id}:`, error);
        throw new Error('Falha ao atualizar empresa');
    }
};