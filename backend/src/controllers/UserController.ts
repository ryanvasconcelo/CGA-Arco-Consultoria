// backend/src/controllers/UserController.ts
import { Request, Response } from 'express';
import { PrismaClient, Prisma } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

class UserController {
    // backend/src/controllers/UserController.ts
    public async index(req: Request, res: Response): Promise<Response> {
        const users = await prisma.user.findMany({
            orderBy: { name: 'asc' },
            // --- ADICIONE ESTE BLOCO 'include' ---
            include: {
                company: {
                    include: {
                        products: true,
                    }
                }
            }
        });
        // Remove a senha de todos os usuários antes de enviar
        const usersWithoutPassword = users.map(user => {
            const { password, ...userWithoutPass } = user;
            return userWithoutPass;
        });

        return res.json(usersWithoutPassword);
    }

    // backend/src/controllers/UserController.ts

    public async create(req: Request, res: Response): Promise<Response> {
        const {
            name, email, role, companyId, status,
            services,
            arcoPortusPermissions
        } = req.body;

        try {
            const hashedPassword = await bcrypt.hash('123456', 8);

            // --- VERIFICAÇÃO/CORREÇÃO DAS PERMISSÕES ---
            const permissionsToConnect: { id: string }[] = [];
            // ATENÇÃO: COLOQUE O ID REAL DO SEU PRODUTO "Arco Portus" AQUI!
            const arcoPortusId = "6f23e9ed-fb73-40b2-8503-d162b912ee87"; // Use o Prisma Studio para pegar o ID correto

            if (Array.isArray(services) && services.includes(arcoPortusId) && arcoPortusPermissions) {
                const permissionMap: { [key: string]: { action: string, subject: string } } = {
                    canViewDocuments: { action: 'VIEW', subject: 'DOCUMENTS' },
                    canEditDocuments: { action: 'EDIT', subject: 'DOCUMENTS' },
                    canAddDocuments: { action: 'CREATE', subject: 'DOCUMENTS' },
                    canDeleteDocuments: { action: 'DELETE', subject: 'DOCUMENTS' },
                    canViewDiagnostico: { action: 'VIEW', subject: 'DIAGNOSTIC' },
                    canViewNormas: { action: 'VIEW', subject: 'NORMS' },
                    canViewRegisters: { action: 'VIEW', subject: 'REGISTERS' },
                    canViewDashboards: { action: 'VIEW', subject: 'DASHBOARDS' },
                    canViewLegislacao: { action: 'VIEW', subject: 'LEGISLATION' },
                    canViewCFTV: { action: 'VIEW', subject: 'CFTV' },
                };

                for (const key in arcoPortusPermissions) {
                    if (arcoPortusPermissions[key] === true && permissionMap[key]) {
                        const perm = await prisma.permission.findUnique({ where: { action_subject: permissionMap[key] } });
                        if (perm) {
                            permissionsToConnect.push({ id: perm.id });
                        }
                    }
                }
            }

            // --- SINTAXE CORRIGIDA PARA SALVAR OS SERVIÇOS ---
            const user = await prisma.user.create({
                data: {
                    name, email, password: hashedPassword, role, status,
                    company: { connect: { id: companyId } },
                    passwordResetRequired: true,

                    // Conecta os serviços na tabela UserProduct
                    userProducts: {
                        create: (services as string[] || []).map(productId => ({
                            companyProduct: {
                                connect: {
                                    companyId_productId: {
                                        companyId: companyId,
                                        productId: productId
                                    }
                                }
                            }
                        }))
                    },
                    // Conecta as permissões granulares na tabela UserPermission
                    permissions: {
                        create: permissionsToConnect.map(p => ({
                            permission: { connect: { id: p.id } }
                        }))
                    }
                },
            });

            const { password, ...userWithoutPassword } = user;
            return res.status(201).json(userWithoutPassword);

        } catch (error) {
            console.error("ERRO NO CATCH DO BACKEND:", error);
            return res.status(500).json({ error: "Falha ao criar o usuário." });
        }
    }

    public async update(req: Request, res: Response): Promise<Response> {
        const { id } = req.params;
        const { name, email, role, status, services } = req.body;
        const authenticatedUser = req.user;

        try {
            // --- CLÁUSULA DE GUARDA ADICIONADA AQUI ---
            if (!authenticatedUser) {
                // Se não houver um usuário autenticado, não há por que continuar.
                return res.status(401).json({ error: 'Ação não autorizada.' });
            }

            const userToUpdate = await prisma.user.findUnique({ where: { id } });

            if (!userToUpdate) {
                return res.status(404).json({ error: 'Usuário a ser atualizado não encontrado.' });
            }

            // A partir daqui, o TypeScript sabe que authenticatedUser existe.
            if (authenticatedUser.role === 'ADMIN' && userToUpdate.companyId !== authenticatedUser.companyId) {
                return res.status(403).json({ error: 'Acesso negado. Você só pode editar usuários da sua empresa.' });
            }


            // Regra de Negócio: Um ADMIN não pode promover outro usuário para SUPER_ADMIN.
            if (authenticatedUser.role === 'ADMIN' && role === 'SUPER_ADMIN') {
                return res.status(403).json({ error: 'Acesso negado. Apenas Super Admins podem definir este papel.' });
            }

            // Busca os CompanyProducts que conectam a empresa aos serviços selecionados
            const companyProducts = await prisma.companyProduct.findMany({
                where: {
                    companyId: userToUpdate.companyId, // Usa a companyId do usuário que está sendo editado
                    productId: { in: services || [] }
                }
            });

            const updatedUser = await prisma.user.update({
                where: { id },
                data: {
                    name,
                    email,
                    role,
                    status,
                    // Lógica de atualização dos serviços: apaga os antigos, cria os novos
                    userProducts: {
                        deleteMany: {}, // Apaga todas as associações de serviço existentes para este usuário
                        create: companyProducts.map(cp => ({ // Cria as novas associações
                            companyProduct: { connect: { id: cp.id } }
                        }))
                    }
                },
                include: {
                    company: true,
                    userProducts: true,
                }
            });

            const { password, ...userWithoutPassword } = updatedUser;
            return res.json(userWithoutPassword);

        } catch (error) {
            console.error(`Erro no UserController ao atualizar usuário ${id}:`, error);
            if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
                return res.status(409).json({ error: "O email informado já está em uso por outro usuário." });
            }
            return res.status(500).json({ error: "Falha ao atualizar o usuário." });
        }
    }

}

export default new UserController();