// backend/src/types/express.d.ts

import { Role } from '@prisma/client';

declare global {
    namespace Express {
        export interface Request {
            user?: {
                sub: string; // 'sub' é o padrão para 'subject' (ID do usuário) no JWT
                role: Role;
                companyId: string;
            };
        }
    }
}