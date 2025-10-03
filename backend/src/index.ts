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

// backend/src/server.ts (ou seu arquivo principal)
import { PrismaClient } from '@prisma/client';
// Importe suas rotas e outros middlewares

// 1. Inicialize o Prisma Client fora da função
const prisma = new PrismaClient();

// Função assíncrona para iniciar o servidor
async function startServer() {
  try {
    // 2. Tenta conectar ao banco de dados.
    // Se a string de conexão (DATABASE_URL) estiver errada ou o banco estiver offline,
    // isso vai gerar um erro e pular para o bloco CATCH.
    await prisma.$connect();
    console.log('[LOG] Conexão com o banco de dados estabelecida com sucesso.');

    // 3. Se a conexão for bem-sucedida, configure e inicie o servidor Express
    app.use(cors({
      origin: 'https://cga.pktech.ai'
    }));
    app.use(express.json());
    // app.use('/api', routes); // Adicione suas rotas aqui

    app.listen(3333, () => {
      console.log('[LOG] Servidor iniciado e ouvindo na porta 3333.');
    });

  } catch (error) {
    // 4. Se a conexão falhar, exibe um erro detalhado e encerra o processo.
    console.error('[ERRO] Não foi possível conectar ao banco de dados:');
    console.error(error);

    // Encerrar o processo com um código de erro é crucial para o Docker.
    // Isso fará o contêiner parar, indicando claramente uma falha na inicialização.
    process.exit(1);

  } finally {
    // 5. Garante que a conexão seja fechada se o processo for encerrado
    await prisma.$disconnect();
  }
}

// 6. Chama a função para iniciar todo o processo
startServer();

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