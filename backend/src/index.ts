// backend/src/index.ts
import dotenv from 'dotenv';
dotenv.config();

import express, { Router } from 'express';
import path from 'path';
import cors from 'cors';
import listEndpoints from 'express-list-endpoints';
import { PrismaClient } from '@prisma/client';

// Importação dos seus roteadores
import { authMiddleware } from './middleware/auth';
import sessionRouter from './routes/session.routes';
import companyRouter from './routes/company.routes';
import productRouter from './routes/product.routes';
import userRouter from './routes/user.routes';
import passwordRouter from './routes/password.routes';
import auditRouter from './routes/audit.routes';
import { internalRoutes } from './routes/internal.routes'; // ← ADICIONE ESTA LINHA

const prisma = new PrismaClient();
const app = express();
const PORT = process.env.PORT || 3333;

async function startServer() {
  try {
    await prisma.$connect();
    console.log('[LOG] Conexão com o banco de dados estabelecida com sucesso.');

    const allowedOrigins = [
      'https://cga.pktech.ai',
      'https://arcoportus.pktech.ai',
      'http://localhost:5173',
      'http://localhost:3000',
      'http://127.0.0.1:5173',
    ];

    app.use(cors({
      origin: (origin, callback) => {
        if (!origin) return callback(null, true);
        if (allowedOrigins.includes(origin)) {
          callback(null, true);
        } else {
          callback(new Error('Not allowed by CORS'));
        }
      },
      credentials: true
    }));
    app.use(express.json());
    app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

    const apiRouter = Router();

    // Rotas públicas
    apiRouter.use('/sessions', sessionRouter);
    apiRouter.use('/password', passwordRouter);
    apiRouter.use('/internal', internalRoutes); // ← ADICIONE ESTA LINHA

    // Rotas protegidas
    apiRouter.use('/companies', authMiddleware, companyRouter);
    apiRouter.use('/products', authMiddleware, productRouter);
    apiRouter.use('/users', authMiddleware, userRouter);
    apiRouter.use('/audit', authMiddleware, auditRouter);

    app.use('/api', apiRouter);

    app.listen(PORT, () => {
      console.log("--- MAPA DE ROTAS REGISTRADAS ---");
      console.table(listEndpoints(app));
      console.log("---------------------------------");
      console.log(`🚀 Servidor rodando na porta ${PORT}`);
    });

  } catch (error) {
    console.error('[ERRO] Falha na inicialização do servidor:', error);
    await prisma.$disconnect();
    process.exit(1);
  }
}

startServer();