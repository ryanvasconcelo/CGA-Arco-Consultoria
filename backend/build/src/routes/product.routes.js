"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const ProductController_1 = __importDefault(require("../controllers/ProductController"));
const authorization_1 = require("../middleware/authorization");
const productRouter = (0, express_1.Router)();
// Apenas a rota para listar todos os produtos
productRouter.get('/', (0, authorization_1.checkRole)(['SUPER_ADMIN']), ProductController_1.default.index);
exports.default = productRouter;
