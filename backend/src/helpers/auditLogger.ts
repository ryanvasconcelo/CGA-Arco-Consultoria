// backend/src/helpers/auditLogger.ts
import { PrismaClient, AuditAction } from '@prisma/client';

const prisma = new PrismaClient();

interface AuditLogParams {
  action: AuditAction;
  authorId?: string;
  companyId: string;
  details?: any;
}

/**
 * Registra uma ação de auditoria no sistema
 * @param params Parâmetros do log de auditoria
 */
export async function createAuditLog(params: AuditLogParams): Promise<void> {
  try {
    const data: any = {
      action: params.action,
      companyId: params.companyId,
    };
    
    if (params.authorId) {
      data.authorId = params.authorId;
    }
    
    if (params.details) {
      data.details = params.details;
    }
    
    await prisma.auditLog.create({ data });
  } catch (error) {
    // Log do erro, mas não interrompe o fluxo da aplicação
    console.error('Erro ao criar log de auditoria:', error);
  }
}

/**
 * Formata detalhes de usuário para auditoria
 */
export function formatUserDetails(user: any) {
  return {
    userId: user.id,
    userName: user.name,
    userEmail: user.email,
    userRole: user.role,
    userStatus: user.status,
  };
}

/**
 * Formata detalhes de empresa para auditoria
 */
export function formatCompanyDetails(company: any) {
  return {
    companyId: company.id,
    companyName: company.name,
    companyCnpj: company.cnpj,
  };
}