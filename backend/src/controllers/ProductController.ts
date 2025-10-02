import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

class ProductController {
    public async index(req: Request, res: Response): Promise<Response> {
        const products = await prisma.product.findMany({
            orderBy: { name: 'asc' }
        });
        return res.json(products);
    }
}

export default new ProductController();