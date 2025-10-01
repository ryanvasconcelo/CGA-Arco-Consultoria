// backend/src/routes/company.routes.ts
import { Router } from 'express';
import multer from 'multer'; // 1. Importe o multer
import CompanyController from '../controllers/CompanyController';
import { checkRole } from '../middleware/authorization';

const companyRouter = Router();
const upload = multer({ dest: 'uploads/' }); // 2. Configure um destino temporário para os uploads

// Rotas específicas primeiro
companyRouter.get('/', checkRole(['SUPER_ADMIN', 'ADMIN']), CompanyController.index);

// 3. APLIQUE O MIDDLEWARE DO MULTER AQUI
// Ele deve vir ANTES do seu checkRole
companyRouter.post('/', upload.single('logo'), checkRole(['SUPER_ADMIN']), CompanyController.create);

companyRouter.post('/', checkRole(['SUPER_ADMIN']), CompanyController.create);

// Rotas genéricas com parâmetros depois
companyRouter.get('/:id', checkRole(['SUPER_ADMIN', 'ADMIN']), CompanyController.show);
companyRouter.put('/:id', checkRole(['SUPER_ADMIN', 'ADMIN']), CompanyController.update);
companyRouter.delete('/:id', checkRole(['SUPER_ADMIN']), CompanyController.delete);

// Rotas de sub-recursos
companyRouter.post('/:id/products', checkRole(['SUPER_ADMIN']), CompanyController.associateProduct);
companyRouter.delete('/:id/products/:productId', checkRole(['SUPER_ADMIN']), CompanyController.disassociateProduct);

export default companyRouter;