// backend/src/controllers/CompanyController.ts - CORRIGIDO
import { Request, Response } from 'express';
import { Prisma, PrismaClient } from '@prisma/client';
import { uploadLogo } from '../middleware/upload';
import { createAuditLog } from '../helpers/auditLogger';

const prisma = new PrismaClient();

class CompanyController {
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

    public async create(req: Request, res: Response): Promise<Response> {
        const { name, cnpj, services } = req.body;
        const logoUrl = req.file ? `/uploads/logos/${req.file.filename}` : null;
        const authenticatedUser = req.user;

        let serviceIds: string[] = [];
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

            // ✅ CORREÇÃO: Usar authenticatedUser.id
            if (authenticatedUser) {
                console.log('📝 [CREATE_COMPANY] Author ID:', authenticatedUser.id);
                await createAuditLog({
                    action: 'CREATE_COMPANY',
                    authorId: authenticatedUser.id, // ✅ CORREÇÃO: .id em vez de .sub
                    companyId: company.id,
                    details: {
                        message: `Empresa ${name} foi criada`,
                        targetCompany: name,
                        companyCnpj: cnpj,
                    },
                });
            }

            return res.status(201).json(company);

        } catch (error) {
            console.error("Erro ao criar empresa:", error);
            return res.status(500).json({ error: "Falha ao criar a empresa." });
        }
    }

    public async show(req: Request, res: Response): Promise<Response> {
        const { id } = req.params;
        const authenticatedUser = req.user;

        if (!authenticatedUser) {
            return res.status(401).json({ error: 'Usuário não autenticado.' });
        }
        if (authenticatedUser.role === 'ADMIN' && authenticatedUser.companyId !== id) {
            return res.status(403).json({ error: 'Acesso negado. Você só pode visualizar sua própria empresa.' });
        }

        const company = await prisma.company.findUnique({
            where: { id },
            include: {
                products: {
                    include: {
                        product: true
                    }
                }
            }
        });
        if (!company) {
            return res.status(404).json({ error: 'Empresa não encontrada.' });
        }
        return res.json(company);
    }

    public async update(req: Request, res: Response): Promise<Response> {
        const { id } = req.params;
        const name = req.body?.name;
        const cnpj = req.body?.cnpj;
        const services = req.body?.services;
        const logoUrl = req.file ? `/uploads/logos/${req.file.filename}` : undefined;
        const authenticatedUser = req.user;

        if (!authenticatedUser) {
            return res.status(401).json({ error: 'Usuário não autenticado.' });
        }

        if (authenticatedUser.role === 'ADMIN' && authenticatedUser.companyId !== id) {
            return res.status(403).json({ error: 'Acesso negado. Você só pode editar sua própria empresa.' });
        }

        try {
            const dataToUpdate: any = {};

            if (name) dataToUpdate.name = name;
            if (cnpj) dataToUpdate.cnpj = cnpj;
            if (logoUrl) dataToUpdate.logoUrl = logoUrl;

            if (services && authenticatedUser.role === 'SUPER_ADMIN') {
                const serviceIds = typeof services === 'string' ? JSON.parse(services) : services;

                const existingProducts = await prisma.product.findMany({
                    where: { id: { in: serviceIds } },
                    select: { id: true }
                });
                const existingProductIds = existingProducts.map(p => p.id);
                const invalidIds = serviceIds.filter((id: string) => !existingProductIds.includes(id));

                if (invalidIds.length > 0) {
                    return res.status(400).json({
                        error: `Os seguintes IDs de serviço são inválidos: ${invalidIds.join(', ')}`
                    });
                }

                const currentProducts = await prisma.companyProduct.findMany({
                    where: { companyId: id },
                    select: { productId: true }
                });
                const currentProductIds = currentProducts.map(p => p.productId);

                const productsToAdd = serviceIds.filter((id: string) => !currentProductIds.includes(id));
                const productsToRemove = currentProductIds.filter((id: string) => !serviceIds.includes(id));

                if (productsToRemove.length > 0) {
                    const companyProductsToDelete = await prisma.companyProduct.findMany({
                        where: { companyId: id, productId: { in: productsToRemove } }
                    });
                    const companyProductIdsToDelete = companyProductsToDelete.map(cp => cp.id);
                    await prisma.userProduct.deleteMany({
                        where: { companyProductId: { in: companyProductIdsToDelete } }
                    });
                    await prisma.companyProduct.deleteMany({
                        where: { id: { in: companyProductIdsToDelete } }
                    });
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

            // ✅ CORREÇÃO: Usar authenticatedUser.id
            console.log('📝 [UPDATE_COMPANY] Author ID:', authenticatedUser.id);
            await createAuditLog({
                action: 'UPDATE_COMPANY',
                authorId: authenticatedUser.id, // ✅ CORREÇÃO
                companyId: id,
                details: {
                    message: `Empresa ${company.name} foi atualizada`,
                    targetCompany: company.name,
                    changes: dataToUpdate,
                },
            });

            return res.json(company);

        } catch (error) {
            console.error(`Erro ao atualizar empresa ${id}:`, error);
            return res.status(500).json({ error: "Falha ao atualizar a empresa." });
        }
    }

    public async delete(req: Request, res: Response): Promise<Response> {
        const { id } = req.params;
        const authenticatedUser = req.user;

        if (authenticatedUser?.role !== 'SUPER_ADMIN') {
            return res.status(403).json({ error: 'Acesso negado. Apenas Super Admins podem remover empresas.' });
        }

        if (authenticatedUser.companyId === id) {
            return res.status(403).json({ error: 'Ação proibida. Você não pode remover sua própria empresa.' });
        }

        try {
            const companyToDelete = await prisma.company.findUnique({
                where: { id },
                select: { name: true, cnpj: true },
            });

            if (!companyToDelete) {
                return res.status(404).json({ error: 'Empresa não encontrada.' });
            }

            await prisma.company.delete({ where: { id } });

            // ✅ CORREÇÃO: Usar authenticatedUser.id
            console.log('📝 [DELETE_COMPANY] Author ID:', authenticatedUser.id);
            await createAuditLog({
                action: 'DELETE_COMPANY',
                authorId: authenticatedUser.id, // ✅ CORREÇÃO
                companyId: id,
                details: {
                    message: `Empresa ${companyToDelete.name} foi removida`,
                    targetCompany: companyToDelete.name,
                    companyCnpj: companyToDelete.cnpj,
                },
            });

            return res.status(204).send();
        } catch (error) {
            console.error(`Erro ao deletar empresa ${id}:`, error);
            return res.status(500).json({ error: 'Falha ao remover empresa.' });
        }
    }

    public async associateProduct(req: Request, res: Response): Promise<Response> {
        const { id: companyId } = req.params;
        const { productId } = req.body;
        const authenticatedUser = req.user;

        if (!productId) {
            return res.status(400).json({ error: 'O productId é obrigatório.' });
        }

        try {
            const [association, company, product] = await Promise.all([
                prisma.companyProduct.create({
                    data: {
                        companyId,
                        productId,
                    },
                }),
                prisma.company.findUnique({ where: { id: companyId }, select: { name: true } }),
                prisma.product.findUnique({ where: { id: productId }, select: { name: true } }),
            ]);

            // ✅ CORREÇÃO: Usar authenticatedUser.id
            if (authenticatedUser) {
                await createAuditLog({
                    action: 'ASSOCIATE_PRODUCT_TO_COMPANY',
                    authorId: authenticatedUser.id, // ✅ CORREÇÃO
                    companyId: companyId,
                    details: {
                        message: `Produto ${product?.name} foi associado à empresa ${company?.name}`,
                        targetCompany: company?.name,
                        productName: product?.name,
                    },
                });
            }

            return res.status(201).json(association);
        } catch (error) {
            console.error('Erro ao associar produto:', error);
            return res.status(500).json({ error: 'Falha ao associar produto.' });
        }
    }

    public async disassociateProduct(req: Request, res: Response): Promise<Response> {
        const { id: companyId, productId } = req.params;
        const authenticatedUser = req.user;

        try {
            const association = await prisma.companyProduct.findFirst({
                where: { companyId, productId },
                include: {
                    company: { select: { name: true } },
                    product: { select: { name: true } },
                },
            });

            if (!association) {
                return res.status(404).json({ error: 'Associação não encontrada.' });
            }

            await prisma.companyProduct.delete({
                where: { id: association.id },
            });

            // ✅ CORREÇÃO: Usar authenticatedUser.id
            if (authenticatedUser) {
                await createAuditLog({
                    action: 'DISASSOCIATE_PRODUCT_FROM_COMPANY',
                    authorId: authenticatedUser.id, // ✅ CORREÇÃO
                    companyId: companyId,
                    details: {
                        message: `Produto ${association.product.name} foi desassociado da empresa ${association.company.name}`,
                        targetCompany: association.company.name,
                        productName: association.product.name,
                    },
                });
            }

            return res.status(204).send();
        } catch (error) {
            console.error('Erro ao desassociar produto:', error);
            return res.status(500).json({ error: 'Falha ao desassociar produto.' });
        }
    }
}

export default new CompanyController();