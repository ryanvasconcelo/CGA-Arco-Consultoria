// backend/src/controllers/AuditController.ts
import { Request, Response } from 'express';
import { Prisma, PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

class AuditController {
    /**
     * Lista logs de auditoria com filtros opcionais
     */
    public async index(req: Request, res: Response): Promise<Response> {
        const authenticatedUser = req.user;

        if (!authenticatedUser) {
            return res.status(401).json({ error: 'Usuário não autenticado.' });
        }

        const {
            action,
            authorId,
            startDate,
            endDate,
            searchTerm, // Novo parâmetro de busca
            page = '1',
            limit = '10' // Padronizando para 10 itens por página
        } = req.query;

        try {
            // Define filtros baseado no papel do usuário
            const conditions: Prisma.AuditLogWhereInput[] = [];

            // ADMIN só pode ver logs da sua empresa
            if (authenticatedUser.role === 'ADMIN') {
                conditions.push({ companyId: authenticatedUser.companyId });
                conditions.push({ author: { role: { not: 'SUPER_ADMIN' } } });
            } else if (authenticatedUser.role === 'SUPER_ADMIN' && req.query.companyId) {
                // SUPER_ADMIN pode filtrar por empresa específica
                conditions.push({ companyId: req.query.companyId as string });
            }

            // Filtros opcionais
            if (action && action !== 'all') {
                conditions.push({ action: action as any });
            }

            if (authorId) {
                conditions.push({ authorId: authorId as string });
            }

            // Filtro de data
            if (startDate || endDate) {
                const dateFilter: Prisma.DateTimeFilter = {};
                if (startDate) {
                    dateFilter.gte = new Date(startDate as string);
                }
                if (endDate) {
                    dateFilter.lte = new Date(endDate as string);
                }
                conditions.push({ createdAt: dateFilter });
            }

            // Filtro de busca por termo
            if (searchTerm && typeof searchTerm === 'string') {
                conditions.push({
                    OR: [
                        { author: { name: { contains: searchTerm, mode: 'insensitive' } } },
                        { company: { name: { contains: searchTerm, mode: 'insensitive' } } },
                    ]
                });
            }

            // Combina todas as condições em uma única cláusula where
            const whereClause: Prisma.AuditLogWhereInput = {
                AND: conditions,
            };

            // Paginação
            const skip = (parseInt(page as string) - 1) * parseInt(limit as string);
            const take = parseInt(limit as string);

            const [logs, total] = await Promise.all([
                prisma.auditLog.findMany({
                    where: whereClause,
                    include: {
                        author: {
                            select: {
                                id: true,
                                name: true,
                                email: true,
                                role: true,
                            },
                        },
                        company: {
                            select: {
                                id: true,
                                name: true,
                            },
                        },
                    },
                    orderBy: {
                        createdAt: 'desc',
                    },
                    skip,
                    take,
                }),
                prisma.auditLog.count({ where: whereClause }),
            ]);

            return res.json({
                logs,
                pagination: {
                    total,
                    page: parseInt(page as string),
                    limit: parseInt(limit as string),
                    totalPages: Math.ceil(total / parseInt(limit as string)),
                },
            });
        } catch (error) {
            console.error('Erro ao buscar logs de auditoria:', error);
            return res.status(500).json({ error: 'Falha ao buscar logs de auditoria.' });
        }
    }

    /**
     * Busca um log específico por ID
     */
    public async show(req: Request, res: Response): Promise<Response> {
        const { id } = req.params;
        const authenticatedUser = req.user;

        if (!authenticatedUser) {
            return res.status(401).json({ error: 'Usuário não autenticado.' });
        }

        try {
            const log = await prisma.auditLog.findUnique({
                where: { id },
                include: {
                    author: {
                        select: {
                            id: true,
                            name: true,
                            email: true,
                            role: true,
                        },
                    },
                    company: {
                        select: {
                            id: true,
                            name: true,
                        },
                    },
                },
            });

            if (!log) {
                return res.status(404).json({ error: 'Log de auditoria não encontrado.' });
            }

            // ADMIN só pode ver logs da sua empresa
            if (authenticatedUser.role === 'ADMIN' && log.companyId !== authenticatedUser.companyId) {
                return res.status(403).json({ error: 'Acesso negado.' });
            }

            return res.json(log);
        } catch (error) {
            console.error(`Erro ao buscar log ${id}:`, error);
            return res.status(500).json({ error: 'Falha ao buscar log de auditoria.' });
        }
    }

    /**
     * Retorna estatísticas de auditoria
     */
    public async stats(req: Request, res: Response): Promise<Response> {
        const authenticatedUser = req.user;

        if (!authenticatedUser) {
            return res.status(401).json({ error: 'Usuário não autenticado.' });
        }

        try {
            const whereClause: any = {};

            // ADMIN só pode ver estatísticas da sua empresa
            if (authenticatedUser.role === 'ADMIN') {
                whereClause.AND = [
                    { companyId: authenticatedUser.companyId },
                    {
                        // E o autor do log não pode ser um SUPER_ADMIN
                        author: {
                            role: { not: 'SUPER_ADMIN' }
                        }
                    }
                ];
            }

            // Total de eventos
            const totalEvents = await prisma.auditLog.count({ where: whereClause });

            // Eventos por tipo
            const eventsByType = await prisma.auditLog.groupBy({
                by: ['action'],
                where: whereClause,
                _count: true,
            });

            // Últimos eventos (últimas 24 horas)
            const last24Hours = new Date();
            last24Hours.setHours(last24Hours.getHours() - 24);

            const recentEvents = await prisma.auditLog.count({
                where: {
                    ...whereClause,
                    createdAt: {
                        gte: last24Hours,
                    },
                },
            });

            // Usuários ativos (que geraram eventos recentemente)
            const activeUsers = await prisma.auditLog.findMany({
                where: {
                    ...whereClause,
                    createdAt: {
                        gte: last24Hours,
                    },
                    authorId: {
                        not: null,
                    },
                },
                select: {
                    authorId: true,
                },
                distinct: ['authorId'],
            });

            return res.json({
                totalEvents,
                recentEvents,
                activeUsers: activeUsers.length,
                eventsByType: eventsByType.map(e => ({
                    action: e.action,
                    count: e._count,
                })),
            });
        } catch (error) {
            console.error('Erro ao buscar estatísticas:', error);
            return res.status(500).json({ error: 'Falha ao buscar estatísticas.' });
        }
    }
}

export default new AuditController();