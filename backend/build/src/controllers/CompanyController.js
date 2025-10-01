"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
class CompanyController {
    // Listar todas as empresas (só para SUPER_ADMIN)
    async index(req, res) {
        // O middleware de autenticação nos dá o usuário logado no objeto 'req.user'
        const authenticatedUser = req.user;
        // REGRA 1: Se o usuário for SUPER_ADMIN, retorna todas as empresas
        if (authenticatedUser?.role === 'SUPER_ADMIN') {
            console.log("Usuário é SUPER_ADMIN. Buscando todas as empresas.");
            const companies = await prisma.company.findMany({
                orderBy: {
                    name: 'asc'
                }
            });
            return res.json(companies);
        }
        // REGRA 2: Se o usuário for ADMIN, retorna apenas a empresa associada a ele
        if (authenticatedUser?.role === 'ADMIN') {
            console.log(`Usuário é ADMIN da empresa: ${authenticatedUser.companyId}. Buscando empresa específica.`);
            if (!authenticatedUser.companyId) {
                // Caso de segurança: um admin que não tem companyId no token.
                return res.status(400).json({ error: 'Usuário admin não possui uma empresa associada.' });
            }
            const companies = await prisma.company.findMany({
                where: {
                    id: authenticatedUser.companyId
                }
            });
            return res.json(companies);
        }
        // REGRA 3: Se não for nenhum dos dois, o acesso é negado.
        // (Essa é uma segurança extra, pois o checkRole na rota já deveria ter barrado)
        return res.status(403).json({ error: 'Acesso negado. Permissões insuficientes.' });
    }
    // Criar uma nova empresa (só para SUPER_ADMIN)
    async create(req, res) {
        const { name } = req.body;
        const company = await prisma.company.create({ data: { name } });
        return res.status(201).json(company);
    }
    // Ver uma empresa específica
    async show(req, res) {
        const { id } = req.params;
        const authenticatedUser = req.user; // Obtido do middleware checkRole
        // REGRA: ADMIN só pode ver sua própria empresa
        if (!authenticatedUser) {
            return res.status(401).json({ error: 'Usuário não autenticado.' });
        }
        if (authenticatedUser.role === 'ADMIN' && authenticatedUser.companyId !== id) {
            return res.status(403).json({ error: 'Acesso negado. Você só pode visualizar sua própria empresa.' });
        }
        const company = await prisma.company.findUnique({ where: { id } });
        if (!company) {
            return res.status(404).json({ error: 'Empresa não encontrada.' });
        }
        return res.json(company);
    }
    // Atualizar uma empresa
    async update(req, res) {
        const { id } = req.params;
        const { name /*, outras props de customização */ } = req.body;
        const authenticatedUser = req.user;
        // REGRA: ADMIN só pode editar sua própria empresa
        if (!authenticatedUser) {
            return res.status(401).json({ error: 'Usuário não autenticado.' });
        }
        if (authenticatedUser.role === 'ADMIN' && authenticatedUser.companyId !== id) {
            return res.status(403).json({ error: 'Acesso negado. Você só pode editar sua própria empresa.' });
        }
        // REGRA: Apenas SUPER_ADMIN pode associar serviços (lógica futura)
        const company = await prisma.company.update({
            where: { id },
            data: { name },
        });
        return res.json(company);
    }
    // Deletar uma empresa (só para SUPER_ADMIN)
    async delete(req, res) {
        const { id } = req.params;
        await prisma.company.delete({ where: { id } });
        return res.status(204).send(); // 204 No Content
    }
    // Associa um serviço a uma empresa (cria um registro na tabela pivot)
    async associateProduct(req, res) {
        const { id: companyId } = req.params;
        const { productId } = req.body;
        if (!productId) {
            return res.status(400).json({ error: 'O productId é obrigatório.' });
        }
        const association = await prisma.companyProduct.create({
            data: {
                companyId,
                productId,
            },
        });
        return res.status(201).json(association);
    }
    // Desassocia um serviço a uma empresa (cria um registro na tabela pivot)
    async disassociateProduct(req, res) {
        const { id: companyId, productId } = req.params;
        const association = await prisma.companyProduct.findFirst({
            where: { companyId, productId },
        });
        if (!association) {
            return res.status(404).json({ error: 'Associação não encontrada.' });
        }
        await prisma.companyProduct.delete({
            where: { id: association.id },
        });
        return res.status(204).send();
    }
}
exports.default = new CompanyController();
