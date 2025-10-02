// frontend/src/services/auditService.ts
import { api } from '@/lib/api';

export interface AuditLog {
    id: string;
    action: string;
    details: any;
    createdAt: string;
    author?: {
        id: string;
        name: string;
        email: string;
        role: string;
    };
    company: {
        id: string;
        name: string;
    };
}

export interface AuditStats {
    totalEvents: number;
    recentEvents: number;
    activeUsers: number;
    eventsByType: Array<{
        action: string;
        count: number;
    }>;
}

export interface AuditLogsResponse {
    logs: AuditLog[];
    pagination: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
}

export interface FetchAuditLogsParams {
    action?: string;
    authorId?: string;
    companyId?: string;
    startDate?: string;
    endDate?: string;
    searchTerm?: string;
    page?: number;
    limit?: number;
}

/**
 * Busca logs de auditoria com filtros opcionais
 */
export const fetchAuditLogs = async (params: FetchAuditLogsParams = {}): Promise<AuditLogsResponse> => {
    try {
        const queryParams = new URLSearchParams();

        if (params.action) queryParams.append('action', params.action);
        if (params.authorId) queryParams.append('authorId', params.authorId);
        if (params.companyId) queryParams.append('companyId', params.companyId);
        if (params.startDate) queryParams.append('startDate', params.startDate);
        if (params.endDate) queryParams.append('endDate', params.endDate);
        if (params.searchTerm) queryParams.append('searchTerm', params.searchTerm);
        if (params.page) queryParams.append('page', params.page.toString());
        if (params.limit) queryParams.append('limit', params.limit.toString());

        const response = await api.get(`/audit?${queryParams.toString()}`);
        return response.data;
    } catch (error) {
        console.error('Erro ao buscar logs de auditoria:', error);
        throw error;
    }
};

/**
 * Busca um log específico por ID
 */
export const fetchAuditLog = async (id: string): Promise<AuditLog> => {
    try {
        const response = await api.get(`/audit/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Erro ao buscar log ${id}:`, error);
        throw error;
    }
};

/**
 * Busca estatísticas de auditoria
 */
export const fetchAuditStats = async (): Promise<AuditStats> => {
    try {
        const response = await api.get('/audit/stats');
        return response.data;
    } catch (error) {
        console.error('Erro ao buscar estatísticas:', error);
        throw error;
    }
};