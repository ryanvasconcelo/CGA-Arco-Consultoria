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
    };
    iat: number;
    exp: number;
}

export function authMiddleware(
    req: Request,
    res: Response,
    next: NextFunction,
) {
    const { authorization } = req.headers;

    if (!authorization) {
        return res.status(401).json({ error: 'Token not provided' });
    }

    const [, token] = authorization.split(' ');

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as TokenPayload;

        // Popula req.user com as informações do token
        req.user = {
            sub: decoded.sub,
            role: decoded.role,
            companyId: decoded.company.id,
        };

        return next();
    } catch (error) {
        return res.status(401).json({ error: 'Token invalid' });
    }
}