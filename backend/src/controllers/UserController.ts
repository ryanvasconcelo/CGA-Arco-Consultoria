// backend/src/controllers/UserController.ts
import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

class UserController {
    public async index(req: Request, res: Response): Promise<Response> {
        const authenticatedUser = req.user!;
        const whereClause = authenticatedUser.role === 'SUPER_ADMIN'
            ? {}
            : { companyId: authenticatedUser.companyId };

        const users = await prisma.user.findMany({
            where: whereClause,
            include: { company: true },
        });
        return res.json(users);
    }

    public async create(req: Request, res: Response): Promise<Response> {
        const authenticatedUser = req.user!;
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
        const hashedPassword = await bcrypt.hash(temporaryPassword, 8);
        // TODO: Enviar a 'temporaryPassword' por email

        const newUser = await prisma.user.create({
            data: { name, email, role, companyId: targetCompanyId, password: hashedPassword, },
        });
        return res.status(201).json(newUser);
    }
    
    public async update(req: Request, res: Response): Promise<Response> {
        return res.json({ message: 'Endpoint de update a ser implementado' });
    }

    public async delete(req: Request, res: Response): Promise<Response> {
        return res.json({ message: 'Endpoint de delete a ser implementado' });
    }
}

export default new UserController();