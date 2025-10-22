"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client"); // Importe seu cliente Prisma
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const prisma = new client_1.PrismaClient(); // Instancie o Prisma
class SessionController {
    async create(request, response) {
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
            const isPasswordCorrect = await bcryptjs_1.default.compare(password, user.password);
            if (!isPasswordCorrect) {
                return response.status(401).json({ error: 'Credenciais inválidas.' });
            }
            const { JWT_SECRET } = process.env;
            if (!JWT_SECRET) {
                throw new Error('JWT_SECRET not found in environment variables');
            }
            const token = jsonwebtoken_1.default.sign({
                sub: user.id,
                role: user.role,
                company: {
                    id: user.company.id,
                    name: user.company.name,
                },
            }, JWT_SECRET, {
                expiresIn: '30m',
            });
            const { password: _, ...userWithoutPassword } = user;
            return response.json({
                user: userWithoutPassword,
                token,
            });
        }
        catch (error) {
            console.error('ERRO FATAL NO CATCH:', error);
            return response.status(500).json({ error: 'Erro interno do servidor.' });
        }
    }
}
exports.default = new SessionController();
