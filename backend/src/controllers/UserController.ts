// backend/src/controllers/UserController.ts
import { Request, Response } from 'express';
import { PrismaClient, Prisma } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { createAuditLog } from '../helpers/auditLogger';
import { generateTemporaryPassword } from '../utils/passwordGenerator';
import emailService from '../services/emailService';

const prisma = new PrismaClient();

class UserController {
    // backend/src/controllers/UserController.ts
    public async index(req: Request, res: Response): Promise<Response> {
        const { page = '1', pageSize = '10', searchTerm } = req.query;
        const pageNumber = parseInt(page as string, 10);
        const size = parseInt(pageSize as string, 10);

        const authenticatedUser = req.user;

        // Constrói a cláusula 'where' dinamicamente
        const whereClause: Prisma.UserWhereInput = {};

        // REGRA: ADMIN só pode ver usuários da sua própria empresa.
        if (authenticatedUser?.role === 'ADMIN') {
            whereClause.companyId = authenticatedUser.companyId;
        }

        // Adiciona filtro de busca se o searchTerm for fornecido
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
                        company: true, // Inclui os dados da empresa
                        userProducts: { // Inclui os produtos associados ao usuário
                            include: {
                                companyProduct: {
                                    include: {
                                        product: true
                                    }
                                }
                            }
                        },
                        permissions: { // Inclui as permissões granulares do usuário
                            include: {
                                permission: true // E os detalhes de cada permissão
                            }
                        }
                    }
                }),
                prisma.user.count({ where: whereClause })
            ]);

            // Remove a senha de todos os usuários antes de enviar
            const usersWithoutPassword = users.map(({ password, ...user }) => user);

            return res.json({ data: usersWithoutPassword, totalCount });
        } catch (error) {
            console.error("Erro ao listar usuários:", error);
            return res.status(500).json({ error: "Falha ao buscar usuários." });
        }
    }

    // backend/src/controllers/UserController.ts

    public async create(req: Request, res: Response): Promise<Response> {
        const {
            name, email, role, companyId, status,
            services,
            arcoPortusPermissions
        } = req.body;

        try {
            // Gera senha temporária segura
            const temporaryPassword = generateTemporaryPassword();
            const hashedPassword = await bcrypt.hash(temporaryPassword, 10);

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

            // Cria log de auditoria
            const authenticatedUser = req.user;
            console.log('📝 [CREATE_USER] Criando log de auditoria...');
            console.log('👤 [CREATE_USER] Authenticated User:', authenticatedUser);
            console.log('🆔 [CREATE_USER] Author ID:', authenticatedUser?.sub);
            console.log('🏢 [CREATE_USER] Company ID:', companyId);
            console.log('👥 [CREATE_USER] Target User:', name);
            
            if (authenticatedUser) {
                await createAuditLog({
                    action: 'CREATE_USER',
                    authorId: authenticatedUser.sub,
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
                console.log('⚠️ [CREATE_USER] authenticatedUser é null/undefined - log não será criado');
            }

            // Envia email com senha temporária
            try {
                await emailService.sendTemporaryPassword(email, name, temporaryPassword);
                console.log(`✅ Email de senha temporária enviado para ${email}`);
            } catch (emailError) {
                console.error('❌ Erro ao enviar email, mas usuário foi criado:', emailError);
                // Não falha a criação do usuário se o email falhar
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

            // --- LÓGICA DE ATUALIZAÇÃO DE PERMISSÕES GRANULARES (Arco Portus) ---
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

                // Itera sobre as permissões recebidas do frontend
                for (const key in arcoPortusPermissions) {
                    // Se a permissão estiver marcada como `true` e existir no nosso mapa
                    if (arcoPortusPermissions[key] === true && permissionMap[key]) {
                        // Busca o ID da permissão no banco de dados
                        const perm = await prisma.permission.findUnique({ where: { action_subject: permissionMap[key] } });
                        if (perm) {
                            // Adiciona o ID à lista de permissões para conectar ao usuário
                            permissionsToConnect.push({ id: perm.id });
                        }
                    }
                }
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
                    },
                    // Lógica de atualização das permissões granulares
                    permissions: {
                        deleteMany: {}, // Apaga todas as permissões antigas do usuário
                        create: permissionsToConnect.map(p => ({ // Cria as novas
                            permission: { connect: { id: p.id } }
                        }))
                    }
                },
                include: {
                    company: true,
                    userProducts: true,
                    permissions: { include: { permission: true } } // Inclui as permissões para retornar ao frontend
                },
            });

            // Cria log de auditoria
            await createAuditLog({
                action: 'UPDATE_USER',
                authorId: authenticatedUser.sub,
                companyId: userToUpdate.companyId,
                details: {
                    message: `Usuário ${name} foi atualizado`,
                    targetUser: name,
                    targetUserEmail: email,
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
            const user = await prisma.user.findUnique({ where: { id: authenticatedUser.sub } });

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

            // Cria log de auditoria
            await createAuditLog({
                action: 'CHANGE_PASSWORD',
                authorId: authenticatedUser.sub,
                companyId: user.companyId,
                details: {
                    message: `${user.name} alterou sua senha`,
                    userName: user.name,
                },
            });

            return res.status(200).json({ message: 'Senha alterada com sucesso.' });

        } catch (error) {
            console.error(`Erro no UserController ao alterar a senha do usuário ${authenticatedUser.sub}:`, error);
            return res.status(500).json({ error: "Falha ao alterar a senha." });
        }
    }

    public async delete(req: Request, res: Response): Promise<Response> {
        const { id } = req.params;
        const authenticatedUser = req.user;

        // Regra de Negócio: Um usuário não pode se auto-deletar.
        if (authenticatedUser?.sub === id) {
            return res.status(403).json({ error: 'Ação proibida. Você não pode remover seu próprio usuário.' });
        }

        try {
            // Busca o usuário antes de deletar para ter os dados para o log
            const userToDelete = await prisma.user.findUnique({
                where: { id },
                select: { name: true, email: true, companyId: true, role: true }, // <-- CORREÇÃO: Buscar o 'role' do usuário-alvo
            });

            if (!userToDelete) {
                return res.status(404).json({ error: 'Usuário não encontrado.' });
            }

            // Graças ao 'onDelete: Cascade' no schema, o Prisma deletará o usuário e todos os dados dependentes.
            await prisma.user.delete({ where: { id } });

            // Cria log de auditoria
            if (authenticatedUser && userToDelete.companyId) {
                await createAuditLog({
                    action: 'DELETE_USER',
                    authorId: authenticatedUser.sub,
                    companyId: userToDelete.companyId,
                    details: {
                        message: `Usuário ${userToDelete.name} foi removido`,
                        targetUser: userToDelete.name,
                        targetUserEmail: userToDelete.email,
                        targetUserRole: userToDelete.role, // <-- CORREÇÃO: Adicionar o 'role' aos detalhes do log
                    },
                });
            }

            return res.status(204).send();
        } catch (error) {
            console.error(`Erro ao deletar usuário ${id}:`, error);
            return res.status(500).json({ error: 'Falha ao remover usuário.' });
        }
    }

}

export default new UserController();