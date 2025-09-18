// backend/src/middleware/auth.ts
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface TokenPayload {
    userId: string;
    iat: number;
    exp: number;
}

export function authMiddleware(
    req: Request,
    res: Response,
    next: NextFunction,
) {
    // 1. Pega o token do header da requisição
    const { authorization } = req.headers;

    // 2. Se não houver token, barra o acesso
    if (!authorization) {
        return res.status(401).json({ error: 'Token not provided' });
    }

    // 3. Separa o "Bearer" do token em si
    const [, token] = authorization.split(' ');

    try {
        // 4. Verifica se o token é válido
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
        const { userId } = decoded as TokenPayload;

        // 5. Adiciona o ID do usuário ao objeto 'req' para ser usado nas rotas
        req.userId = userId;

        // 6. Se tudo estiver ok, deixa a requisição continuar
        return next();
    } catch (error) {
        return res.status(401).json({ error: 'Token invalid' });
    }
}