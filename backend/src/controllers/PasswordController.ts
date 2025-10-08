import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import emailService from '../services/emailService';

const prisma = new PrismaClient();

class PasswordController {
    // Etapa 1: Usuário solicita a redefinição de senha
    public async forgotPassword(req: Request, res: Response): Promise<Response> {
        const { email } = req.body;

        const user = await prisma.user.findUnique({ where: { email } });

        if (!user) {
            // Por segurança, não informamos se o email existe ou não.
            return res.status(200).json({ message: 'Se um usuário com este email existir, um link de redefinição será enviado.' });
        }

        // 1. Gera um token seguro e aleatório
        const resetToken = crypto.randomBytes(32).toString('hex');
        const passwordResetToken = crypto
            .createHash('sha256')
            .update(resetToken)
            .digest('hex');

        // 2. Define um tempo de expiração (ex: 1 hora)
        const passwordResetExpires = new Date(Date.now() + 3600000); // 1 hora a partir de agora

        // 3. Salva o token (hash) e a data de expiração no usuário
        await prisma.user.update({
            where: { id: user.id },
            data: {
                passwordResetToken,
                passwordResetExpires,
            },
        });

        // 4. Envia o email com o link de reset
        try {
            await emailService.sendPasswordResetLink(user.email, user.name, resetToken);
            console.log(`✅ Email de redefinição enviado para ${user.email}`);
        } catch (emailError) {
            console.error('❌ Erro ao enviar email de redefinição:', emailError);
            // Por segurança, ainda retornamos sucesso mesmo se o email falhar
        }

        return res.status(200).json({ message: 'Se um usuário com este email existir, um link de redefinição será enviado.' });
    }

    // Etapa 2: Usuário envia a nova senha com o token
    public async resetPassword(req: Request, res: Response): Promise<Response> {
        const { token } = req.params;
        const { email, password } = req.body;

        // Valida se o email foi fornecido
        if (!email) {
            return res.status(400).json({ error: 'Email é obrigatório para verificação.' });
        }

        // 1. Criptografa o token recebido para comparar com o do banco
        const passwordResetToken = crypto
            .createHash('sha256')
            .update(token)
            .digest('hex');

        // 2. Busca o usuário pelo token e verifica se não expirou
        const user = await prisma.user.findFirst({
            where: {
                passwordResetToken,
                passwordResetExpires: { gt: new Date() }, // 'gt' = greater than (maior que a data/hora atual)
            },
        });

        if (!user) {
            return res.status(400).json({ error: 'Token inválido ou expirado.' });
        }

        // 3. Verifica se o email fornecido corresponde ao email do usuário
        if (user.email.toLowerCase() !== email.toLowerCase()) {
            return res.status(400).json({ error: 'Email não corresponde ao usuário.' });
        }

        // 4. Criptografa a nova senha
        const hashedPassword = await bcrypt.hash(password, 10);

        // 5. Atualiza a senha e limpa os campos de reset
        await prisma.user.update({
            where: { id: user.id },
            data: {
                password: hashedPassword,
                passwordResetToken: null,
                passwordResetExpires: null,
                passwordResetRequired: false, // O usuário agora tem uma senha definitiva
            },
        });

        return res.status(200).json({ message: 'Senha redefinida com sucesso.' });
    }
}

export default new PasswordController();