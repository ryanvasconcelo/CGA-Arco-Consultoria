# --- Estágio 1: Build ---
# Instala dependências, gera o Prisma Client e compila o TypeScript
FROM node:20-alpine AS builder

WORKDIR /app

# Copia os arquivos de dependência
COPY package*.json ./

# Instala TODAS as dependências para poder compilar
RUN npm install

# Copia o schema do Prisma para gerar o client
COPY prisma ./prisma/

# Gera o Prisma Client
RUN npx prisma generate

# Copia o resto do código-fonte
COPY . .

# Compila o TypeScript para JavaScript
RUN npm run build

# --- Estágio 2: Produção ---
# Cria a imagem final com o código compilado e dependências de produção
FROM node:20-alpine

WORKDIR /app

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/prisma ./prisma

CMD ["node", "dist/server.js"]