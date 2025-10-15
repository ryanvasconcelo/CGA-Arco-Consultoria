import { Request, Response, NextFunction } from 'express';

export function ensureInternalAuth(req: Request, res: Response, next: NextFunction) {
    const apiKey = req.headers['x-internal-api-key'];
    const expectedApiKey = process.env.INTERNAL_API_KEY;

    if (!apiKey || apiKey !== expectedApiKey) {
        return res.status(403).json({ message: 'Forbidden: Invalid API Key' });
    }

    next();
}