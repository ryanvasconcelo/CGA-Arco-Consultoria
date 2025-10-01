"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// backend/src/routes/user.routes.ts
const express_1 = require("express");
const UserController_1 = __importDefault(require("../controllers/UserController"));
const authorization_1 = require("../middleware/authorization");
const userRouter = (0, express_1.Router)();
userRouter.use((0, authorization_1.checkRole)(['ADMIN', 'SUPER_ADMIN']));
userRouter.get('/', UserController_1.default.index);
userRouter.post('/', UserController_1.default.create);
userRouter.put('/:id', UserController_1.default.update);
userRouter.delete('/:id', UserController_1.default.delete);
exports.default = userRouter;
