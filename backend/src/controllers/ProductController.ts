import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

class ProductController {
    // Lista todos os produtos (acesso para SUPER_ADMIN)
    public async index(req: Request, res: Response): Promise<Response> {
        // CORRIGIDO: Deve buscar em 'prisma.product'
        const products = await prisma.product.findMany();
        return res.json(products);
    }

    // Não precisamos de create, update ou delete aqui, pois são fixos.
}

export default new ProductController();