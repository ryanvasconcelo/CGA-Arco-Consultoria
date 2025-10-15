import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';
import bcrypt from 'bcryptjs';
import { randomBytes } from 'crypto';
import EmailService from '../services/emailService';

export class InternalUserController {
    public async forcePasswordChange(req: Request, res: Response): Promise<Response> {
        const { userId, newPassword } = req.body;
        if (!userId || !newPassword) {
            return res.status(400).json({ message: 'userId e newPassword são obrigatórios.' });
        }
        try {
            const hashedPassword = await bcrypt.hash(newPassword, 8);
            await prisma.user.update({
                where: { id: userId },
                data: {
                    password: hashedPassword,
                    passwordResetRequired: false,
                },
            });
            return res.status(204).send();
        } catch (error) {
            console.error('[CGA] Erro ao forçar a troca de senha:', error);
            return res.status(500).json({ message: 'Erro interno no servidor.' });
        }
    }

    public async requestPasswordReset(req: Request, res: Response): Promise<Response> {
        const { email } = req.body;
        const user = await prisma.user.findUnique({ where: { email } });

        if (!user) {
            return res.status(204).send();
        }

        try {
            const resetToken = randomBytes(20).toString('hex');
            const now = new Date();
            now.setHours(now.getHours() + 1);

            await prisma.user.update({
                where: { id: user.id },
                data: {
                    passwordResetToken: resetToken,
                    passwordResetExpires: now,
                },
            });

            const resetURL = `http://localhost:5173/redefinir-senha?token=${resetToken}`;
            await EmailService.sendPasswordResetLink(user.email, user.name, resetURL);

            return res.status(204).send();
        } catch (error) {
            console.error('[CGA] Erro ao solicitar redefinição de senha:', error);
            return res.status(204).send();
        }
    }

    public async resetPassword(req: Request, res: Response): Promise<Response> {
        const { token, newPassword } = req.body;
        if (!token || !newPassword) {
            return res.status(400).json({ message: 'Token e nova senha são obrigatórios.' });
        }
        const user = await prisma.user.findFirst({
            where: {
                passwordResetToken: token,
                passwordResetExpires: { gte: new Date() },
            },
        });
        if (!user) {
            return res.status(400).json({ message: 'Token inválido ou expirado.' });
        }
        const hashedPassword = await bcrypt.hash(newPassword, 8);
        await prisma.user.update({
            where: { id: user.id },
            data: {
                password: hashedPassword,
                passwordResetToken: null,
                passwordResetExpires: null,
            },
        });
        return res.status(204).send();
    }
}