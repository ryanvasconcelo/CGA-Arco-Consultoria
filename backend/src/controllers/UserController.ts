// backend/src/controllers/UserController.ts - CORRIGIDO
import { Request, Response } from 'express';
import { PrismaClient, Prisma } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { createAuditLog } from '../helpers/auditLogger';
import { generateTemporaryPassword } from '../utils/passwordGenerator';
import emailService from '../services/emailService';

const prisma = new PrismaClient();

class UserController {
    public async index(req: Request, res: Response): Promise<Response> {
        const { page = '1', pageSize = '10', searchTerm, companyId } = req.query;
        const pageNumber = parseInt(page as string, 10);
        const size = parseInt(pageSize as string, 10);

        const authenticatedUser = req.user;

        const whereClause: Prisma.UserWhereInput = {};

        if (authenticatedUser?.role === 'ADMIN') {
            whereClause.companyId = authenticatedUser.companyId;
        }

        if (companyId && typeof companyId === 'string') {
            whereClause.companyId = companyId;
        }

        if (searchTerm && typeof searchTerm === 'string') {
            whereClause.OR = [
                { name: { contains: searchTerm, mode: 'insensitive' } },
                { email: { contains: searchTerm, mode: 'insensitive' } },
            ];
        }

        try {
            const [users, totalCount] = await prisma.$transaction([
                prisma.user.findMany({
                    where: whereClause,
                    skip: (pageNumber - 1) * size,
                    take: size,
                    orderBy: { name: 'asc' },
                    include: {
                        company: true,
                        userProducts: {
                            include: {
                                companyProduct: {
                                    include: {
                                        product: true
                                    }
                                }
                            }
                        },
                        permissions: {
                            include: {
                                permission: true
                            }
                        }
                    }
                }),
                prisma.user.count({ where: whereClause })
            ]);

            const usersWithoutPassword = users.map(({ password, ...user }) => user);

            return res.json({ data: usersWithoutPassword, totalCount });
        } catch (error) {
            console.error("Erro ao listar usuários:", error);
            return res.status(500).json({ error: "Falha ao buscar usuários." });
        }
    }

    public async create(req: Request, res: Response): Promise<Response> {
        const {
            name, email, role, companyId, status,
            services,
            arcoPortusPermissions
        } = req.body;

        const authenticatedUser = req.user;

        try {
            const temporaryPassword = generateTemporaryPassword();
            const hashedPassword = await bcrypt.hash(temporaryPassword, 10);

            const permissionsToConnect: { id: string }[] = [];
            const arcoPortusId = "6f23e9ed-fb73-40b2-8503-d162b912ee87";

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

            const user = await prisma.user.create({
                data: {
                    name, email, password: hashedPassword, role, status,
                    company: { connect: { id: companyId } },
                    passwordResetRequired: true,
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
                    permissions: {
                        create: permissionsToConnect.map(p => ({
                            permission: { connect: { id: p.id } }
                        }))
                    }
                },
            });

            // ✅ CORREÇÃO: Usar authenticatedUser.id em vez de .sub
            console.log('📝 [CREATE_USER] Criando log de auditoria...');
            console.log('👤 [CREATE_USER] Authenticated User:', authenticatedUser);
            console.log('🆔 [CREATE_USER] Author ID:', authenticatedUser?.id); // ✅ MUDANÇA AQUI
            console.log('🏢 [CREATE_USER] Company ID:', companyId);
            console.log('👥 [CREATE_USER] Target User:', name);

            if (authenticatedUser) {
                await createAuditLog({
                    action: 'CREATE_USER',
                    authorId: authenticatedUser.id, // ✅ Usar .id (do banco), não .sub (do JWT)
                    companyId: companyId,
                    details: {
                        message: `Usuário ${name} foi criado`,
                        targetUser: name,
                        targetUserEmail: email,
                        targetUserRole: role,
                    },
                });
                console.log('✅ [CREATE_USER] Log de auditoria criado com sucesso');
            } else {
                console.warn('⚠️ [CREATE_USER] authenticatedUser é null/undefined');
            }

            try {
                await emailService.sendTemporaryPassword(email, name, temporaryPassword);
                console.log(`✅ Email de senha temporária enviado para ${email}`);
            } catch (emailError) {
                console.error('❌ Erro ao enviar email, mas usuário foi criado:', emailError);
            }

            const { password, ...userWithoutPassword } = user;
            return res.status(201).json(userWithoutPassword);

        } catch (error) {
            console.error("ERRO NO CATCH DO BACKEND:", error);
            return res.status(500).json({ error: "Falha ao criar o usuário." });
        }
    }

    public async update(req: Request, res: Response): Promise<Response> {
        const { id } = req.params;
        const { name, email, role, status, services, arcoPortusPermissions } = req.body;
        const authenticatedUser = req.user;

        try {
            if (!authenticatedUser) {
                return res.status(401).json({ error: 'Ação não autorizada.' });
            }

            const userToUpdate = await prisma.user.findUnique({ where: { id } });

            if (!userToUpdate) {
                return res.status(404).json({ error: 'Usuário a ser atualizado não encontrado.' });
            }

            if (authenticatedUser.role === 'ADMIN' && userToUpdate.companyId !== authenticatedUser.companyId) {
                return res.status(403).json({ error: 'Acesso negado. Você só pode editar usuários da sua empresa.' });
            }

            if (authenticatedUser.role === 'ADMIN' && role === 'SUPER_ADMIN') {
                return res.status(403).json({ error: 'Acesso negado. Apenas Super Admins podem definir este papel.' });
            }

            const permissionsToConnect: { id: string }[] = [];
            if (arcoPortusPermissions) {
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

            const companyProducts = await prisma.companyProduct.findMany({
                where: {
                    companyId: userToUpdate.companyId,
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
                    userProducts: {
                        deleteMany: {},
                        create: companyProducts.map(cp => ({
                            companyProduct: { connect: { id: cp.id } }
                        }))
                    },
                    permissions: {
                        deleteMany: {},
                        create: permissionsToConnect.map(p => ({
                            permission: { connect: { id: p.id } }
                        }))
                    }
                },
                include: {
                    company: true,
                    userProducts: true,
                    permissions: { include: { permission: true } }
                },
            });

            // ✅ CORREÇÃO: Usar authenticatedUser.id
            console.log('📝 [UPDATE_USER] Criando log de auditoria...');
            console.log('🆔 [UPDATE_USER] Author ID:', authenticatedUser.id);

            await createAuditLog({
                action: 'UPDATE_USER',
                authorId: authenticatedUser.id, // ✅ CORREÇÃO: .id em vez de .sub
                companyId: userToUpdate.companyId,
                details: {
                    message: `Usuário ${name} foi atualizado`,
                    targetUser: name,
                    targetUserEmail: email,
                    targetUserRole: role,
                    changes: { name, email, role, status },
                },
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

    public async changePassword(req: Request, res: Response): Promise<Response> {
        const authenticatedUser = req.user;
        const { oldPassword, newPassword } = req.body;

        if (!authenticatedUser) {
            return res.status(401).json({ error: 'Usuário não autenticado.' });
        }

        if (!oldPassword || !newPassword) {
            return res.status(400).json({ error: 'Senha antiga e nova senha são obrigatórias.' });
        }

        try {
            const user = await prisma.user.findUnique({ where: { id: authenticatedUser.id } }); // ✅ CORREÇÃO

            if (!user) {
                return res.status(404).json({ error: 'Usuário não encontrado.' });
            }

            const isPasswordCorrect = await bcrypt.compare(oldPassword, user.password);

            if (!isPasswordCorrect) {
                return res.status(401).json({ error: 'A senha antiga está incorreta.' });
            }

            const hashedNewPassword = await bcrypt.hash(newPassword, 10);

            await prisma.user.update({
                where: { id: user.id },
                data: {
                    password: hashedNewPassword,
                    passwordResetRequired: false,
                },
            });

            // ✅ CORREÇÃO: Usar authenticatedUser.id
            await createAuditLog({
                action: 'CHANGE_PASSWORD',
                authorId: authenticatedUser.id, // ✅ CORREÇÃO
                companyId: user.companyId,
                details: {
                    message: `${user.name} alterou sua senha`,
                    userName: user.name,
                },
            });

            return res.status(200).json({ message: 'Senha alterada com sucesso.' });

        } catch (error) {
            console.error(`Erro ao alterar senha:`, error);
            return res.status(500).json({ error: "Falha ao alterar a senha." });
        }
    }

    public async delete(req: Request, res: Response): Promise<Response> {
        const { id } = req.params;
        const authenticatedUser = req.user;

        if (authenticatedUser?.id === id) { // ✅ CORREÇÃO: .id em vez de .sub
            return res.status(403).json({ error: 'Ação proibida. Você não pode remover seu próprio usuário.' });
        }

        try {
            const userToDelete = await prisma.user.findUnique({
                where: { id },
                select: { name: true, email: true, companyId: true, role: true },
            });

            if (!userToDelete) {
                return res.status(404).json({ error: 'Usuário não encontrado.' });
            }

            await prisma.user.delete({ where: { id } });

            // ✅ CORREÇÃO: Usar authenticatedUser.id
            if (authenticatedUser && userToDelete.companyId) {
                console.log('📝 [DELETE_USER] Criando log de auditoria...');
                console.log('🆔 [DELETE_USER] Author ID:', authenticatedUser.id);

                await createAuditLog({
                    action: 'DELETE_USER',
                    authorId: authenticatedUser.id, // ✅ CORREÇÃO
                    companyId: userToDelete.companyId,
                    details: {
                        message: `Usuário ${userToDelete.name} foi removido`,
                        targetUser: userToDelete.name,
                        targetUserEmail: userToDelete.email,
                        targetUserRole: userToDelete.role,
                    },
                });
                console.log('✅ [DELETE_USER] Log criado com sucesso');
            }

            return res.status(204).send();
        } catch (error) {
            console.error(`Erro ao deletar usuário ${id}:`, error);
            return res.status(500).json({ error: 'Falha ao remover usuário.' });
        }
    }
}

export default new UserController();