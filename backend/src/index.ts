// backend/src/index.ts
import dotenv from 'dotenv';
dotenv.config();

import express, { Router } from 'express'; // <-- Importe o Router
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

const prisma = new PrismaClient();
const app = express();
const PORT = process.env.PORT || 3333;

async function startServer() {
  try {
    // 1. Conecta ao banco de dados
    await prisma.$connect();
    console.log('[LOG] Conexão com o banco de dados estabelecida com sucesso.');

    // 2. Configura os middlewares UMA SÓ VEZ
    app.use(cors({
      origin: process.env.CORS_ORIGIN || 'https://cga.pktech.ai',
      credentials: true
    }));
    app.use(express.json());
    app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

    // 3. Cria um roteador principal para o prefixo /api
    const apiRouter = Router();

    // Rotas públicas
    apiRouter.use('/sessions', sessionRouter);
    apiRouter.use('/password', passwordRouter);

    // Rotas protegidas
    apiRouter.use('/companies', authMiddleware, companyRouter);
    apiRouter.use('/products', authMiddleware, productRouter);
    apiRouter.use('/users', authMiddleware, userRouter);
    apiRouter.use('/audit', authMiddleware, auditRouter);

    // 4. Usa o roteador principal com o prefixo /api <-- A MUDANÇA CHAVE
    app.use('/api', apiRouter);

    // 5. Inicia o servidor UMA SÓ VEZ
    app.listen(PORT, () => {
      console.log("--- MAPA DE ROTAS REGISTRADAS ---");
      // O listEndpoints agora mostrará as rotas com o prefixo /api
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

// Chama a função para iniciar o servidor
startServer();