# --- Estágio 1: Build ---
# Instala as dependências e compila a aplicação Vite/React
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./

RUN npm install --legacy-peer-deps

COPY . .

RUN npm run build

# --- Estágio 2: Produção ---
# Usa uma imagem Nginx para servir os arquivos estáticos compilados
FROM nginx:stable-alpine

# Copia os arquivos da pasta 'dist' do estágio de build para a pasta padrão do Nginx
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80