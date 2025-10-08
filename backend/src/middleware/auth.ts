// backend/src/middleware/auth.ts
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { Role } from '@prisma/client';

interface TokenPayload {
    sub: string;
    role: Role;
    company: {
        id: string;
        name: string;
    } | null;
    iat: number;
    exp: number;
}

export function authMiddleware(
    req: Request,
    res: Response,
    next: NextFunction,
) {
    console.log('🔐 [AUTH] Middleware executado');

    const { authorization } = req.headers;

    if (!authorization) {
        console.log('❌ [AUTH] Token não fornecido');
        return res.status(401).json({ error: 'Token not provided' });
    }

    const [, token] = authorization.split(' ');
    console.log('🎫 [AUTH] Token recebido:', token.substring(0, 20) + '...');

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as TokenPayload;

        console.log('✅ [AUTH] Token válido');
        console.log('👤 [AUTH] User ID:', decoded.sub);
        console.log('🔑 [AUTH] Role:', decoded.role);
        console.log('🏢 [AUTH] Company:', decoded.company?.name || 'N/A');
        console.log('⏰ [AUTH] Expira em:', new Date(decoded.exp * 1000).toISOString());

        // Popula req.user com as informações do token
        req.user = {
            sub: decoded.sub,
            role: decoded.role,
            companyId: decoded.company?.id ?? '',
        };

        return next();
    } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        console.error('❌ [AUTH] Token inválido:', message);
        return res.status(401).json({ error: 'Token invalid' });
    }
}