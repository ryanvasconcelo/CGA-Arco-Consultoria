// backend/src/controllers/CompanyController.ts
import { Request, Response } from 'express';
import { Prisma, PrismaClient } from '@prisma/client';
import { uploadLogo } from '../middleware/upload';

const prisma = new PrismaClient();

class CompanyController {
    // Listar todas as empresas (só para SUPER_ADMIN)
    public async index(req: Request, res: Response): Promise<Response> {
        const { page = '1', pageSize = '10' } = req.query;
        const pageNumber = parseInt(page as string, 10);
        const size = parseInt(pageSize as string, 10);

        const authenticatedUser = req.user;

        const whereClause: Prisma.CompanyWhereInput = {};
        if (authenticatedUser?.role === 'ADMIN') {
            whereClause.id = authenticatedUser.companyId;
        }

        const [companies, totalCount] = await prisma.$transaction([
            prisma.company.findMany({
                where: whereClause,
                skip: (pageNumber - 1) * size,
                take: size,
                orderBy: { name: 'asc' },
                select: {
                    id: true,
                    name: true,
                    cnpj: true,
                    logoUrl: true,
                    createdAt: true,
                    updatedAt: true,
                    products: {
                        include: {
                            product: true
                        }
                    },
                    _count: {
                        select: { users: true }
                    }
                }
            }),
            prisma.company.count({ where: whereClause })
        ]);

        const formattedCompanies = companies.map(({ _count, ...company }) => ({
            ...company,
            usersCount: _count.users
        }));

        return res.json({ data: formattedCompanies, totalCount });
    }

    // Criar uma nova empresa (só para SUPER_ADMIN)
    // backend/src/controllers/CompanyController.ts

    // No método create, ajuste:
    public async create(req: Request, res: Response): Promise<Response> {
        const { name, cnpj, services } = req.body;
        const logoUrl = req.file ? `/uploads/logos/${req.file.filename}` : null; // CORREÇÃO

        let serviceIds: string[] = [];
        // Validação robusta para o campo 'services'
        if (services && typeof services === 'string') {
            try {
                serviceIds = JSON.parse(services);
            } catch (error) {
                return res.status(400).json({ error: "O campo 'services' não é um array JSON válido." });
            }
        } else if (Array.isArray(services)) {
            serviceIds = services;
        }

        try {
            const company = await prisma.company.create({
                data: {
                    name,
                    cnpj,
                    logoUrl,
                    products: {
                        create: serviceIds.map((productId) => ({
                            product: {
                                connect: { id: productId },
                            },
                        })),
                    },
                },
                include: {
                    products: {
                        include: {
                            product: true
                        }
                    },
                }
            });

            return res.status(201).json(company);

        } catch (error) {
            console.error("Erro no CompanyController ao criar:", error);
            return res.status(500).json({ error: "Falha ao criar a empresa." });
        }
    }

    // Ver uma empresa específica
    public async show(req: Request, res: Response): Promise<Response> {
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
    public async update(req: Request, res: Response): Promise<Response> {
        const { id } = req.params;
        // CORREÇÃO: Garante que req.body existe antes de desestruturar.
        // Isso previne o erro quando o corpo da requisição está vazio ou malformado.
        const name = req.body?.name;
        const cnpj = req.body?.cnpj;
        const services = req.body?.services;

        const logoUrl = req.file ? `/uploads/logos/${req.file.filename}` : undefined;
        const authenticatedUser = req.user;

        if (!authenticatedUser) {
            return res.status(401).json({ error: 'Usuário não autenticado.' });
        }

        // REGRA: ADMIN só pode editar sua própria empresa
        if (authenticatedUser.role === 'ADMIN' && authenticatedUser.companyId !== id) {
            return res.status(403).json({ error: 'Acesso negado. Você só pode editar sua própria empresa.' });
        }

        try {
            const dataToUpdate: any = {};

            if (name) dataToUpdate.name = name;
            if (cnpj) dataToUpdate.cnpj = cnpj;
            if (logoUrl) dataToUpdate.logoUrl = logoUrl;

            // REGRA: Apenas SUPER_ADMIN pode editar os serviços
            if (services && authenticatedUser.role === 'SUPER_ADMIN') {
                const serviceIds = typeof services === 'string' ? JSON.parse(services) : services;

                // Lógica segura para atualizar serviços
                const currentProducts = await prisma.companyProduct.findMany({
                    where: { companyId: id },
                    select: { productId: true }
                });
                const currentProductIds = currentProducts.map(p => p.productId);

                const productsToAdd = serviceIds.filter((id: string) => !currentProductIds.includes(id));
                const productsToRemove = currentProductIds.filter((id: string) => !serviceIds.includes(id));

                // ATENÇÃO: Esta operação pode falhar se um usuário ainda tiver acesso ao produto.
                // O erro que você viu é o Prisma te protegendo. A solução ideal seria
                // desassociar os usuários dos produtos antes de desassociar a empresa.
                // Por enquanto, vamos focar em adicionar e deixar a remoção para um próximo passo se necessário.
                // A lógica abaixo é a correta, mas depende do schema.
                if (productsToRemove.length > 0) {
                    // Antes de deletar a associação Company-Product, precisamos deletar as associações User-Product dependentes.
                    const companyProductsToDelete = await prisma.companyProduct.findMany({ where: { companyId: id, productId: { in: productsToRemove } } });
                    const companyProductIdsToDelete = companyProductsToDelete.map(cp => cp.id);
                    await prisma.userProduct.deleteMany({ where: { companyProductId: { in: companyProductIdsToDelete } } });
                    await prisma.companyProduct.deleteMany({ where: { id: { in: companyProductIdsToDelete } } });
                }
                if (productsToAdd.length > 0) {
                    await prisma.companyProduct.createMany({
                        data: productsToAdd.map((productId: string) => ({ companyId: id, productId }))
                    });
                }
            }

            const company = await prisma.company.update({
                where: { id },
                data: dataToUpdate,
                include: {
                    products: true,
                }
            });
            return res.json(company);

        } catch (error) {
            console.error(`Erro no CompanyController ao atualizar empresa ${id}:`, error);
            return res.status(500).json({ error: "Falha ao atualizar a empresa." });
        }
    }

    // Deletar uma empresa (só para SUPER_ADMIN)
    public async delete(req: Request, res: Response): Promise<Response> {
        const { id } = req.params;
        const authenticatedUser = req.user;

        // Dupla verificação de segurança, embora a rota já deva ter o middleware.
        if (authenticatedUser?.role !== 'SUPER_ADMIN') {
            return res.status(403).json({ error: 'Acesso negado. Apenas Super Admins podem remover empresas.' });
        }

        // REGRA DE NEGÓCIO: SUPER_ADMIN não pode deletar a própria empresa.
        if (authenticatedUser.companyId === id) {
            return res.status(403).json({ error: 'Ação proibida. Você não pode remover sua própria empresa do sistema.' });
        }

        // Graças ao 'onDelete: Cascade' no schema, o Prisma deletará a empresa e todos os dados dependentes.
        await prisma.company.delete({ where: { id } });
        return res.status(204).send();
    }

    // Associa um serviço a uma empresa (cria um registro na tabela pivot)
    public async associateProduct(req: Request, res: Response): Promise<Response> {
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
    public async disassociateProduct(req: Request, res: Response): Promise<Response> {
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



export default new CompanyController();