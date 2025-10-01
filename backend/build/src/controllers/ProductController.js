"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
class ProductController {
    // Lista todos os produtos (acesso para SUPER_ADMIN)
    async index(req, res) {
        // CORRIGIDO: Deve buscar em 'prisma.product'
        const products = await prisma.product.findMany();
        return res.json(products);
    }
}
exports.default = new ProductController();
