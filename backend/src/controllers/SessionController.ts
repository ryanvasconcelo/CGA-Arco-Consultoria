// backend/src/controllers/SessionController.ts
import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { createAuditLog } from '../helpers/auditLogger';

const prisma = new PrismaClient();

class SessionController {
    public async create(req: Request, res: Response): Promise<Response> {
        console.log('[LOG /sessions] Requisição de login recebida.');

        const { email, password } = req.body;

        if (!email || !password) {
            console.warn('[LOG /sessions] Requisição falhou: email ou senha não fornecidos.');
            return res.status(400).json({ error: 'Email e senha são obrigatórios.' });
        }

        console.log(`[LOG /sessions] Buscando usuário no banco de dados para o email: ${email}`);

        try {
            // ✅ MUDANÇA 1: Buscar role e company junto com o usuário
            const user = await prisma.user.findUnique({
                where: { email },
                include: {
                    company: {
                        select: {
                            id: true,
                            name: true,
                        }
                    }
                }
            });

            if (!user) {
                console.warn(`[LOG /sessions] Usuário não encontrado para o email: ${email}`);
                return res.status(401).json({ error: 'Credenciais inválidas.' });
            }

            console.log(`[LOG /sessions] Usuário encontrado: ${user.id}. Verificando senha...`);

            const isPasswordCorrect = await bcrypt.compare(password, user.password);

            if (!isPasswordCorrect) {
                console.warn(`[LOG /sessions] Senha incorreta para o usuário ${user.id}.`);
                return res.status(401).json({ error: 'Credenciais inválidas.' });
            }

            console.log(`[LOG /sessions] Senha correta.`);

            // ✅ VERIFICAÇÃO: Se o usuário precisa resetar a senha
            if (user.passwordResetRequired) {
                console.log(`[LOG /sessions] ⚠️ Usuário ${user.id} precisa resetar senha no primeiro acesso`);

                // Gera um token temporário para permitir a troca de senha
                const secret = process.env.JWT_SECRET;
                if (!secret) {
                    console.error('[LOG /sessions] ERRO: JWT_SECRET não definido.');
                    return res.status(500).json({ error: 'Erro interno no servidor.' });
                }

                const tempToken = jwt.sign(
                    {
                        role: user.role,
                        company: user.company ? {
                            id: user.company.id,
                            name: user.company.name,
                        } : null,
                    },
                    secret,
                    {
                        subject: user.id,
                        expiresIn: '30m', // Token temporário expira em 30 minutos
                    }
                );

                return res.status(403).json({
                    requiresPasswordReset: true,
                    token: tempToken,
                    message: 'Você precisa redefinir sua senha antes de continuar.',
                });
            }

            console.log(`[LOG /sessions] Gerando token JWT.`);

            const secret = process.env.JWT_SECRET;
            if (!secret) {
                console.error('[LOG /sessions] ERRO: JWT_SECRET não definido.');
                return res.status(500).json({ error: 'Erro interno no servidor.' });
            }

            // ✅ MUDANÇA 2: Adicionar role e company no payload do token
            const token = jwt.sign(
                {
                    role: user.role,
                    company: user.company ? {
                        id: user.company.id,
                        name: user.company.name,
                    } : null,
                },
                secret,
                {
                    subject: user.id,
                    expiresIn: '30m',
                }
            );

            // ✅ MUDANÇA 3: Adicionar logs de debug
            console.log(`[LOG /sessions] 🎫 Token gerado com sucesso`);
            console.log(`[LOG /sessions] 👤 User ID: ${user.id}`);
            console.log(`[LOG /sessions] 🔑 Role: ${user.role}`);
            console.log(`[LOG /sessions] 🏢 Company: ${user.company?.name || 'N/A'}`);
            console.log(`[LOG /sessions] ⏰ Expira em: 1 dia`);

            const { password: _, ...userWithoutPassword } = user;

            // Cria log de auditoria para login bem-sucedido
            await createAuditLog({
                action: 'LOGIN_SUCCESS',
                authorId: user.id,
                companyId: user.companyId,
                details: {
                    message: `${user.name} realizou login`,
                    userName: user.name,
                    userEmail: user.email,
                },
            });

            return res.json({
                user: userWithoutPassword,
                token,
            });
        } catch (error) {
            console.error('[LOG /sessions] Erro inesperado:', error);
            return res.status(500).json({ error: 'Erro interno no servidor.' });
        }
    }
}

export default new SessionController();