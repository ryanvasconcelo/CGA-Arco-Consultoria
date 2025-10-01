FROM node:20-alpine

# Instalar dependências do sistema
RUN apk add --no-cache python3 make g++ libc6-compat

WORKDIR /app

# Copiar package files
COPY package*.json ./

# Remover referências ao @swc/core do package.json durante o build
RUN sed -i '/"@swc\/core"/d' package.json && \
    sed -i '/overrides/,/}/d' package.json && \
    sed -i '/resolutions/,/}/d' package.json && \
    sed -i '/optionalDependencies/,/}/d' package.json

# Instalar dependências (com todas as dependencies necessárias)
RUN npm cache clean --force && \
    npm install --legacy-peer-deps

# Copiar código fonte
COPY . .

EXPOSE 5173

CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
