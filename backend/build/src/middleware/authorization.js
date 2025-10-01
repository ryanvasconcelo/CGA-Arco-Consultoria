"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkRole = checkRole;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
/**
 * Gera um middleware que verifica se o usuário autenticado tem uma das roles permitidas.
 * @param allowedRoles Array de roles que têm permissão para acessar a rota.
 */
function checkRole(allowedRoles) {
    return async (req, res, next) => {
        // O userId é adicionado pelo authMiddleware que já criamos
        const { userId } = req;
        if (!userId) {
            return res.status(401).json({ error: 'Usuário não autenticado.' });
        }
        try {
            const user = await prisma.user.findUnique({ where: { id: userId } });
            if (!user) {
                return res.status(401).json({ error: 'Usuário não encontrado.' });
            }
            // Verifica se a role do usuário está na lista de roles permitidas
            if (!allowedRoles.includes(user.role)) {
                return res.status(403).json({ error: 'Acesso negado. Permissões insuficientes.' });
            }
            // Anexa o objeto do usuário inteiro ao request para usarmos no controller
            req.user = user;
            return next();
        }
        catch (error) {
            return res.status(500).json({ error: 'Erro interno do servidor.' });
        }
    };
}
