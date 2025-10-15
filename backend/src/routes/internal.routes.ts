import { Router } from 'express';
import { InternalAuthController } from '../controllers/InternalAuthController';
import { InternalUserController } from '../controllers/InternalUserController';
import { ensureInternalAuth } from '../middleware/ensureInternalAuth';

const internalRoutes = Router();
const internalAuthController = new InternalAuthController();
const internalUserController = new InternalUserController();

internalRoutes.use(ensureInternalAuth);

// Rota de login
internalRoutes.post('/auth/portus-login', internalAuthController.handlePortusLogin);

// Rota de troca de senha no primeiro acesso
internalRoutes.patch('/users/force-password-change', internalUserController.forcePasswordChange);

// Rotas de "esqueci minha senha"
internalRoutes.post('/password/forgot', internalUserController.requestPasswordReset);
internalRoutes.post('/password/reset', internalUserController.resetPassword);

export { internalRoutes };