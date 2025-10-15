import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';
import bcrypt from 'bcryptjs';

export class InternalAuthController {
    public async handlePortusLogin(req: Request, res: Response): Promise<Response> {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }

        try {
            const user = await prisma.user.findUnique({
                where: { email },
                include: {
                    company: true,
                    permissions: { include: { permission: true } },
                },
            });

            if (!user || !user.company) {
                return res.status(401).json({ message: 'Invalid credentials' });
            }

            const isPasswordValid = await bcrypt.compare(password, user.password);
            if (!isPasswordValid) {
                return res.status(401).json({ message: 'Invalid credentials' });
            }

            const payload = {
                userId: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                company: {
                    id: user.company.id,
                    name: user.company.name,
                },
                permissions: user.permissions.map(p => `${p.permission.action}:${p.permission.subject}`),
                passwordResetRequired: user.passwordResetRequired,
            };

            return res.status(200).json(payload);

        } catch (error) {
            console.error('Error during internal Portus login:', error);
            return res.status(500).json({ message: 'Internal server error' });
        }
    }
}