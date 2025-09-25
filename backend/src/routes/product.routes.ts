import { Router } from 'express';
import ProductController from '../controllers/ProductController';
import { checkRole } from '../middleware/authorization';

const productRouter = Router();

// Apenas a rota para listar todos os produtos
productRouter.get('/', checkRole(['SUPER_ADMIN']), ProductController.index);

export default productRouter;