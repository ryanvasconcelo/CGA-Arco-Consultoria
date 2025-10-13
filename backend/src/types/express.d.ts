// backend/src/types/express.d.ts - VERSÃO CORRIGIDA

import { Role } from '@prisma/client';

declare global {
    namespace Express {
        interface Request {
            user?: {
                id: string;       // ✅ ADICIONADO - ID do usuário do banco
                sub: string;      // Mantido para compatibilidade com JWT
                name: string;     // ✅ ADICIONADO - Nome do usuário
                email: string;    // ✅ ADICIONADO - Email do usuário
                role: Role;       // Role do usuário
                companyId: string; // ID da empresa
            };
        }
    }
}