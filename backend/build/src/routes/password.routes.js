"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const PasswordController_1 = __importDefault(require("../controllers/PasswordController"));
const passwordRouter = (0, express_1.Router)();
// Rota para solicitar o link de redefinição
passwordRouter.post('/forgot', PasswordController_1.default.forgotPassword);
// Rota para enviar a nova senha com o token
passwordRouter.post('/reset/:token', PasswordController_1.default.resetPassword);
exports.default = passwordRouter;
