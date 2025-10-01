"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// backend/src/routes/session.routes.ts
const express_1 = require("express");
const SessionController_1 = __importDefault(require("../controllers/SessionController"));
const sessionRouter = (0, express_1.Router)();
// Quando uma requisição POST chegar em '/', ela será tratada pelo método 'create' do SessionController
sessionRouter.post('/', SessionController_1.default.create);
exports.default = sessionRouter;
