"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = authMiddleware;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
function authMiddleware(req, res, next) {
    const { authorization } = req.headers;
    if (!authorization) {
        return res.status(401).json({ error: 'Token not provided' });
    }
    const [, token] = authorization.split(' ');
    try {
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        // ATUALIZADO: Lemos 'sub' e o renomeamos para a variável 'userId'
        const { sub: userId } = decoded;
        req.userId = userId;
        return next();
    }
    catch (error) {
        return res.status(401).json({ error: 'Token invalid' });
    }
}
