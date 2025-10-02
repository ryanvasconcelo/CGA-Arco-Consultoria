import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client'; // Importe seu cliente Prisma
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient(); // Instancie o Prisma

class SessionController {

    public async create(request: Request, response: Response): Promise<Response> {
        try {
            const { email, password } = request.body;

            const user = await prisma.user.findUnique({
                where: { email },
                include: {
                    company: true,
                },
            });

            if (!user) {
                return response.status(401).json({ error: 'Credenciais inválidas.' });
            }

            if (!user.company) {
                return response.status(500).json({ error: 'Configuração de usuário inválida: nenhuma empresa associada.' });
            }

            const isPasswordCorrect = await bcrypt.compare(password, user.password);

            if (!isPasswordCorrect) {
                return response.status(401).json({ error: 'Credenciais inválidas.' });
            }

            const { JWT_SECRET } = process.env;
            if (!JWT_SECRET) {
                throw new Error('JWT_SECRET not found in environment variables');
            }

            const token = jwt.sign(
                {
                    sub: user.id,
                    role: user.role,
                    company: {
                        id: user.company.id,
                        name: user.company.name,
                    },
                },
                JWT_SECRET,
                {
                    expiresIn: '1d',
                }
            );

            // Verifica se o usuário precisa resetar a senha
            if (user.passwordResetRequired) {
                const { password: _, ...userWithoutPassword } = user;
                return response.status(200).json({
                    requiresPasswordReset: true,
                    message: 'Você precisa alterar sua senha temporária.',
                    token, // Retorna o token para permitir a troca de senha
                    user: userWithoutPassword
                });
            }

            const { password: _, ...userWithoutPassword } = user;

            return response.json({
                user: userWithoutPassword,
                token,
            });

        } catch (error) {
            console.error('ERRO FATAL NO CATCH:', error);
            return response.status(500).json({ error: 'Erro interno do servidor.' });
        }
    }
}

export default new SessionController();