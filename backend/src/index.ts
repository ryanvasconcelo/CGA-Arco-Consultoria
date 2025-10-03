// backend/src/index.ts
import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import path from 'path';
import listEndpoints from 'express-list-endpoints';
import { authMiddleware } from './middleware/auth';
import sessionRouter from './routes/session.routes';
import companyRouter from './routes/company.routes';
import productRouter from './routes/product.routes';
import userRouter from './routes/user.routes';
import passwordRouter from './routes/password.routes';
import auditRouter from './routes/audit.routes';
import cors from 'cors';

const app = express();

// CORS configurado para o domínio em produção
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'https://cga.pktech.ai',
  credentials: true
}));
app.use(express.json());

// ADICIONE ESTA LINHA para servir arquivos estáticos
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Rotas públicas (sem autenticação) - Traefik remove /api então essas rotas ficam sem prefixo
app.use('/sessions', sessionRouter);
app.use('/password', passwordRouter);

// Rotas protegidas (com autenticação) - Traefik remove /api então essas rotas ficam sem prefixo
app.use('/companies', authMiddleware, companyRouter);
app.use('/products', authMiddleware, productRouter);
app.use('/users', authMiddleware, userRouter);
app.use('/audit', authMiddleware, auditRouter);

const PORT = process.env.PORT || 3333;
app.listen(PORT, () => {
    console.log("--- MAPA DE ROTAS REGISTRADAS ---");
    console.table(listEndpoints(app));
    console.log("---------------------------------");
    console.log(`🚀 Servidor rodando na porta ${PORT}`);
});