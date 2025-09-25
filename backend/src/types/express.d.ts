// backend/src/types/express.d.ts
import { User } from '@prisma/client';

// Este arquivo adiciona as propriedades 'userId' e 'user' ao objeto Request do Express
declare global {
    namespace Express {
        export interface Request {
            userId?: string;
            user?: User; // Usamos o tipo 'User' importado do Prisma para mais segurança
        }
    }
}

// A linha abaixo é necessária para que o TypeScript trate este arquivo como um módulo
export { };