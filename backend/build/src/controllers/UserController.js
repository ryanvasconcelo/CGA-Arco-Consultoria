"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const prisma = new client_1.PrismaClient();
class UserController {
    async index(req, res) {
        const authenticatedUser = req.user;
        const whereClause = authenticatedUser.role === 'SUPER_ADMIN'
            ? {}
            : { companyId: authenticatedUser.companyId };
        const users = await prisma.user.findMany({
            where: whereClause,
            include: { company: true },
        });
        return res.json(users);
    }
    async create(req, res) {
        const authenticatedUser = req.user;
        const { name, email, role, companyId } = req.body;
        const targetCompanyId = authenticatedUser.role === 'SUPER_ADMIN'
            ? companyId
            : authenticatedUser.companyId;
        if (!targetCompanyId) {
            return res.status(400).json({ error: 'A empresa do usuário é obrigatória.' });
        }
        if (authenticatedUser.role === 'ADMIN' && role === 'SUPER_ADMIN') {
            return res.status(403).json({ error: 'Acesso negado. Administradores não podem criar Super Admins.' });
        }
        const temporaryPassword = Math.random().toString(36).slice(-8);
        const hashedPassword = await bcryptjs_1.default.hash(temporaryPassword, 8);
        // TODO: Enviar a 'temporaryPassword' por email
        const newUser = await prisma.user.create({
            data: { name, email, role, companyId: targetCompanyId, password: hashedPassword, },
        });
        return res.status(201).json(newUser);
    }
    async update(req, res) {
        return res.json({ message: 'Endpoint de update a ser implementado' });
    }
    async delete(req, res) {
        return res.json({ message: 'Endpoint de delete a ser implementado' });
    }
}
exports.default = new UserController();
