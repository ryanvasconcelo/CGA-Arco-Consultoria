// backend/src/middleware/auth.ts
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// ATUALIZADO para esperar 'sub' em vez de 'userId'
interface TokenPayload {
    sub: string;
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
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string);

        // ATUALIZADO: Lemos 'sub' e o renomeamos para a variável 'userId'
        const { sub: userId } = decoded as TokenPayload;

        req.userId = userId;

        return next();
    } catch (error) {
        return res.status(401).json({ error: 'Token invalid' });
    }
}