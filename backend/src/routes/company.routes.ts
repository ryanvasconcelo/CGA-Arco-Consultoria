// backend/src/routes/company.routes.ts
import { Router } from 'express';
import CompanyController from '../controllers/CompanyController';
import { checkRole } from '../middleware/authorization';

const companyRouter = Router();

// Rotas específicas primeiro
companyRouter.get('/', checkRole(['SUPER_ADMIN']), CompanyController.index);
companyRouter.post('/', checkRole(['SUPER_ADMIN']), CompanyController.create);

// Rotas genéricas com parâmetros depois
companyRouter.get('/:id', checkRole(['SUPER_ADMIN', 'ADMIN']), CompanyController.show);
companyRouter.put('/:id', checkRole(['SUPER_ADMIN', 'ADMIN']), CompanyController.update);
companyRouter.delete('/:id', checkRole(['SUPER_ADMIN']), CompanyController.delete);

// Rotas de sub-recursos
companyRouter.post('/:id/products', checkRole(['SUPER_ADMIN']), CompanyController.associateProduct);
companyRouter.delete('/:id/products/:productId', checkRole(['SUPER_ADMIN']), CompanyController.disassociateProduct);

export default companyRouter;