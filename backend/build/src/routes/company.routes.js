"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// backend/src/routes/company.routes.ts
const express_1 = require("express");
const multer_1 = __importDefault(require("multer")); // 1. Importe o multer
const CompanyController_1 = __importDefault(require("../controllers/CompanyController"));
const authorization_1 = require("../middleware/authorization");
const companyRouter = (0, express_1.Router)();
const upload = (0, multer_1.default)({ dest: 'uploads/' }); // 2. Configure um destino temporário para os uploads
// Rotas específicas primeiro
companyRouter.get('/', (0, authorization_1.checkRole)(['SUPER_ADMIN', 'ADMIN']), CompanyController_1.default.index);
// 3. APLIQUE O MIDDLEWARE DO MULTER AQUI
// Ele deve vir ANTES do seu checkRole
companyRouter.post('/', upload.single('logo'), (0, authorization_1.checkRole)(['SUPER_ADMIN']), CompanyController_1.default.create);
companyRouter.post('/', (0, authorization_1.checkRole)(['SUPER_ADMIN']), CompanyController_1.default.create);
// Rotas genéricas com parâmetros depois
companyRouter.get('/:id', (0, authorization_1.checkRole)(['SUPER_ADMIN', 'ADMIN']), CompanyController_1.default.show);
companyRouter.put('/:id', (0, authorization_1.checkRole)(['SUPER_ADMIN', 'ADMIN']), CompanyController_1.default.update);
companyRouter.delete('/:id', (0, authorization_1.checkRole)(['SUPER_ADMIN']), CompanyController_1.default.delete);
// Rotas de sub-recursos
companyRouter.post('/:id/products', (0, authorization_1.checkRole)(['SUPER_ADMIN']), CompanyController_1.default.associateProduct);
companyRouter.delete('/:id/products/:productId', (0, authorization_1.checkRole)(['SUPER_ADMIN']), CompanyController_1.default.disassociateProduct);
exports.default = companyRouter;
