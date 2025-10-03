// backend/src/controllers/SessionController.ts

import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

class SessionController {
    public async create(req: Request, res: Response): Promise<Response> {
        // --- LOG 1: Início do Processo ---
        console.log('[LOG /sessions] Requisição de login recebida.');

        const { email, password } = req.body;

        if (!email || !password) {
            // --- LOG 2: Dados Inválidos ---
            console.warn('[LOG /sessions] Requisição falhou: email ou senha não fornecidos.');
            return res.status(400).json({ error: 'Email e senha são obrigatórios.' });
        }

        console.log(`[LOG /sessions] Buscando usuário no banco de dados para o email: ${email}`);

        try {
            const user = await prisma.user.findUnique({
                where: { email },
            });

            if (!user) {
                // --- LOG 3: Usuário Não Encontrado ---
                console.warn(`[LOG /sessions] Usuário não encontrado no banco de dados para o email: ${email}`);
                return res.status(401).json({ error: 'Credenciais inválidas.' });
            }

            console.log(`[LOG /sessions] Usuário encontrado: ${user.id}. Verificando senha...`);

            const isPasswordCorrect = await bcrypt.compare(password, user.password);

            if (!isPasswordCorrect) {
                // --- LOG 4: Senha Incorreta ---
                console.warn(`[LOG /sessions] Verificação de senha para o usuário ${user.id} falhou. Senha incorreta.`);
                return res.status(401).json({ error: 'Credenciais inválidas.' });
            }

            console.log(`[LOG /sessions] Senha correta para o usuário ${user.id}. Gerando token JWT.`);

            // Assumindo que você tem uma variável de ambiente JWT_SECRET
            const secret = process.env.JWT_SECRET;
            if (!secret) {
                // --- LOG 5: Erro Crítico de Configuração ---
                console.error('[LOG /sessions] ERRO CRÍTICO: JWT_SECRET não está definido no ambiente do servidor.');
                return res.status(500).json({ error: 'Erro interno no servidor.' });
            }

            const token = jwt.sign({}, secret, {
                subject: user.id,
                expiresIn: '1d', // Token expira em 1 dia
            });

            // Remove a senha do objeto de usuário antes de enviar
            const { password: _, ...userWithoutPassword } = user;

            // --- LOG 6: Sucesso ---
            console.log(`[LOG /sessions] Login bem-sucedido para o usuário ${user.id}. Token enviado.`);
            return res.json({
                user: userWithoutPassword,
                token,
            });

        } catch (error) {
            // --- LOG 7: Erro Inesperado ---
            console.error('[LOG /sessions] Ocorreu um erro inesperado durante o processo de login:', error);
            return res.status(500).json({ error: 'Erro interno no servidor.' });
        }
    }
}

export default new SessionController();