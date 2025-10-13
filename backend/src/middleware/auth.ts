// backend/src/middleware/auth.ts - VERSÃO CORRIGIDA
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { Role, PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

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

export async function authMiddleware(
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
        console.log('👤 [AUTH] User ID (sub):', decoded.sub);
        console.log('🔑 [AUTH] Role:', decoded.role);
        console.log('🏢 [AUTH] Company:', decoded.company?.name || 'N/A');
        console.log('⏰ [AUTH] Expira em:', new Date(decoded.exp * 1000).toISOString());

        // ✅ MUDANÇA CRÍTICA: Buscar o usuário no banco de dados
        const user = await prisma.user.findUnique({
            where: { id: decoded.sub },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                companyId: true,
                status: true,
            },
        });

        if (!user) {
            console.error('❌ [AUTH] Usuário não encontrado no banco:', decoded.sub);
            return res.status(401).json({ error: 'User not found' });
        }

        if (user.status !== 'ACTIVE') {
            console.error('❌ [AUTH] Usuário inativo:', user.email);
            return res.status(401).json({ error: 'User inactive' });
        }

        // ✅ POPULA req.user COM DADOS DO BANCO (incluindo 'id')
        req.user = {
            id: user.id,              // ✅ CAMPO 'id' ADICIONADO
            sub: decoded.sub,         // Mantém 'sub' para compatibilidade
            name: user.name,          // ✅ ADICIONADO
            email: user.email,        // ✅ ADICIONADO
            role: user.role,
            companyId: user.companyId,
        };

        console.log('✅ [AUTH] req.user populado:', {
            id: req.user.id,
            name: req.user.name,
            role: req.user.role,
        });

        return next();
    } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        console.error('❌ [AUTH] Token inválido:', message);
        return res.status(401).json({ error: 'Token invalid' });
    }
}