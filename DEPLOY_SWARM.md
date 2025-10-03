# Deploy no Docker Swarm via Portainer

## Problemas Identificados e Corrigidos

### 1. **Rotas do Backend Inconsistentes**
- **Problema**: As rotas `/sessions` e `/password` estavam fora do prefixo `/api`, mas o Traefik estava configurado para remover o prefixo `/api` antes de passar para o backend
- **Solução**: Removido o agrupamento de rotas em `/api` no backend, todas as rotas agora respondem diretamente (sem prefixo), e o Traefik remove o `/api` antes de encaminhar

### 2. **CORS não Configurado**
- **Problema**: CORS estava aceitando todas as origens sem especificar o domínio
- **Solução**: Configurado CORS para aceitar especificamente `https://cga.pktech.ai`

### 3. **API Pública Tentando Acessar Porta Direta**
- **Problema**: `apiPublic` no frontend tentava acessar `https://cga.pktech.ai:3333` (porta não exposta pelo Traefik)
- **Solução**: Ambas as instâncias (api e apiPublic) agora usam a mesma base URL `/api`, roteada pelo Traefik

### 4. **Proxy do Vite Incorreto**
- **Problema**: Vite tentava fazer proxy para serviço inexistente `cga_backend_api`
- **Solução**: Removido proxy (desnecessário em produção com Traefik)

### 5. **Falta de Healthchecks**
- **Problema**: Serviços não tinham healthchecks adequados
- **Solução**: Adicionados healthchecks para backend e frontend

### 6. **Variável de Ambiente do Frontend**
- **Problema**: `.env` apontava para URL absoluta `https://cga.pktech.ai/api`
- **Solução**: Alterado para caminho relativo `/api` (Traefik roteia corretamente)

## Arquivos Modificados

### Backend
- [`backend/src/index.ts`](backend/src/index.ts) - Rotas reestruturadas e CORS configurado

### Frontend
- [`frontend/src/lib/api.ts`](frontend/src/lib/api.ts) - Instâncias axios usando mesma base URL
- [`frontend/vite.config.ts`](frontend/vite.config.ts) - Proxy removido
- [`frontend/.env`](frontend/.env) - URL base alterada para relativa

### Docker
- [`docker-compose.swarm.yml`](docker-compose.swarm.yml) - Novo arquivo criado com configurações otimizadas para Swarm

## Passos para Deploy

### 1. Preparar Secrets no Portainer

Antes do deploy, certifique-se de que os seguintes secrets existam no Portainer:

```bash
# No Portainer, vá em Secrets e crie:
cga_db_user          # Usuário do PostgreSQL
cga_db_password      # Senha do PostgreSQL
cga_jwt_secret       # Secret para JWT
```

### 2. Configurar Variáveis de Ambiente

No Portainer, ao criar a stack, adicione estas variáveis:

```env
DB_NAME=cga_database
```

### 3. Deploy da Stack

1. Acesse Portainer: https://seu-portainer.io
2. Vá em **Stacks** > **Add Stack**
3. Cole o conteúdo de `docker-compose.swarm.yml`
4. Adicione as variáveis de ambiente acima
5. Clique em **Deploy the stack**

### 4. Verificar Deploy

Após o deploy, verifique:

1. **Services rodando**:
   ```bash
   docker service ls
   ```

2. **Logs do backend**:
   ```bash
   docker service logs -f <stack-name>_backend
   ```

3. **Logs do frontend**:
   ```bash
   docker service logs -f <stack-name>_frontend
   ```

4. **Health dos serviços**:
   ```bash
   docker service ps <stack-name>_backend
   docker service ps <stack-name>_frontend
   docker service ps <stack-name>_cga_db
   ```

## Fluxo de Requisições

```
Browser (https://cga.pktech.ai)
    ↓
Traefik (ProjecontNet)
    ↓
├─→ Frontend (porta 5173)
│   └─→ Requisições /api
│       └─→ Traefik
│           └─→ Backend (porta 3333)
│               └─→ PostgreSQL (porta 5432)
└─→ Backend /api/* (remove /api)
    └─→ Backend (porta 3333)
        └─→ PostgreSQL (porta 5432)
```

## Rotas Configuradas

### Frontend
- **HTTP**: `cga.pktech.ai` → redireciona para HTTPS
- **HTTPS**: `cga.pktech.ai` → porta 5173 (prioridade 50)

### Backend
- **HTTP**: `cga.pktech.ai/api/*` → redireciona para HTTPS
- **HTTPS**: `cga.pktech.ai/api/*` → remove `/api` → porta 3333 (prioridade 100)

## Endpoints Backend (após remoção do /api)

Todos estes endpoints são acessados via `https://cga.pktech.ai/api/`:

### Públicos (sem autenticação)
- `POST /api/sessions` - Login
- `POST /api/password/forgot` - Esqueci a senha
- `POST /api/password/reset` - Resetar senha

### Protegidos (requerem token JWT)
- `GET /api/companies` - Listar empresas
- `POST /api/companies` - Criar empresa
- `GET /api/products` - Listar produtos
- `GET /api/users` - Listar usuários
- `GET /api/audit` - Log de auditoria

## Troubleshooting

### Backend não acessível
1. Verifique se o serviço está rodando:
   ```bash
   docker service ps <stack-name>_backend
   ```

2. Verifique logs:
   ```bash
   docker service logs -f <stack-name>_backend
   ```

3. Verifique se está na rede correta:
   ```bash
   docker network inspect ProjecontNet
   ```

### Banco de dados não conecta
1. Verifique se os secrets estão corretos
2. Verifique logs do backend procurando erros de conexão
3. Verifique se o healthcheck do banco está passando

### Frontend não carrega
1. Verifique se o Vite iniciou corretamente nos logs
2. Verifique se a porta 5173 está respondendo
3. Verifique variável `VITE_API_BASE_URL` está configurada

### CORS errors
1. Verifique se `CORS_ORIGIN` está configurado corretamente no backend
2. Verifique se o domínio está correto (com https://)

## Notas Importantes

1. **Secrets são externos**: Os secrets devem ser criados no Swarm antes do deploy
2. **Volume persistente**: O banco usa volume nomeado `cga_postgres_data`
3. **Rede externa**: A rede `ProjecontNet` deve existir previamente
4. **Traefik**: Certifique-se de que o Traefik está rodando e configurado corretamente
5. **Certificados SSL**: O resolver `letsencryptresolver` deve estar configurado no Traefik

## Comandos Úteis

### Atualizar serviço após mudanças
```bash
docker service update --force <stack-name>_backend
docker service update --force <stack-name>_frontend
```

### Escalar serviços
```bash
docker service scale <stack-name>_backend=2
docker service scale <stack-name>_frontend=2
```

### Remover stack
```bash
docker stack rm <stack-name>
```

### Ver logs em tempo real
```bash
docker service logs -f --tail 100 <stack-name>_backend