// backend/src/controllers/CompanyController.ts
import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

class CompanyController {
    // Listar todas as empresas (só para SUPER_ADMIN)
    public async index(req: Request, res: Response): Promise<Response> {
        const authenticatedUser = req.user;

        // Se o usuário for SUPER_ADMIN...
        if (authenticatedUser?.role === 'SUPER_ADMIN') {
            const companies = await prisma.company.findMany({
                orderBy: { name: 'asc' },
                // --- ADICIONE ESTE BLOCO ---
                include: {
                    products: true,
                }
            });
            return res.json(companies);
        }

        // Se o usuário for ADMIN...
        if (authenticatedUser?.role === 'ADMIN') {
            const companies = await prisma.company.findMany({
                where: { id: authenticatedUser.companyId },
                // --- E ADICIONE ESTE BLOCO AQUI TAMBÉM ---
                include: {
                    products: true,
                }
            });
            return res.json(companies);
        }

        // REGRA 3: Se não for nenhum dos dois, o acesso é negado.
        // (Essa é uma segurança extra, pois o checkRole na rota já deveria ter barrado)
        return res.status(403).json({ error: 'Acesso negado. Permissões insuficientes.' });
    }

    // Criar uma nova empresa (só para SUPER_ADMIN)
    // backend/src/controllers/CompanyController.ts

    public async create(req: Request, res: Response): Promise<Response> {
        const { name, cnpj, customColors, services } = req.body;
        const logoUrl = req.file ? req.file.path : null;

        // Precisamos garantir que os serviços venham como um array de IDs
        let serviceIds: string[] = [];
        if (services) {
            try {
                serviceIds = JSON.parse(services);
            } catch (error) {
                return res.status(400).json({ error: "O campo 'services' não é um array JSON válido." });
            }
        }

        try {
            const company = await prisma.company.create({
                data: {
                    name,
                    cnpj,
                    logoUrl,
                    primaryColor: JSON.parse(customColors),
                    // --- A MÁGICA ACONTECE AQUI ---
                    // Prisma permite criar registros em tabelas relacionadas ao mesmo tempo.
                    products: {
                        create: serviceIds.map((productId) => ({
                            product: {
                                connect: { id: productId },
                            },
                        })),
                    },
                },
                include: {
                    products: true, // Opcional: retorna a empresa com os produtos associados
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
    public async delete(req: Request, res: Response): Promise<Response> {
        const { id } = req.params;
        await prisma.company.delete({ where: { id } });
        return res.status(204).send(); // 204 No Content
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