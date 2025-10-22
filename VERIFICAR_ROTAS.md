# 🔍 Guia de Diagnóstico e Correção - Login Arco Portus

## Problema Atual
❌ Erro 404 ao tentar fazer login em `https://arcoportus.pktech.ai/api/internal/auth/portus-login`

## Diagnóstico Passo a Passo

### 1️⃣ Verificar se o Backend CGA está Recebendo as Requisições

```bash
# SSH no servidor
ssh usuario@seu-servidor

# Verificar logs do backend CGA
docker service logs cga_arco_consultoria_backend --tail 100 --follow
```

**O que procurar:**
- Se aparecer "Cannot POST /api/internal/auth/portus-login" → O backend está recebendo mas a rota não existe
- Se não aparecer nada → O Traefik não está redirecionando corretamente

---

### 2️⃣ Verificar Rotas Registradas no Backend CGA

O backend lista todas as rotas quando inicia. Procure por:

```bash
# Reiniciar o serviço CGA backend
docker service update --force cga_arco_consultoria_backend

# Ver as rotas registradas no log
docker service logs cga_arco_consultoria_backend --tail 200 | grep -A 50 "MAPA DE ROTAS"
```

**Você DEVE ver:**
```
/api/internal/auth/portus-login    POST
```

**Se NÃO aparecer:** O código não foi compilado ou há erro no TypeScript.

---

### 3️⃣ Verificar Build do TypeScript

```bash
# Entrar no container do backend CGA
docker exec -it $(docker ps -q -f name=cga_arco_consultoria_backend) sh

# Verificar se o arquivo foi compilado
ls -la build/src/controllers/InternalAuthController.js
ls -la build/src/routes/internal.routes.js

# Ver conteúdo do arquivo compilado
cat build/src/routes/internal.routes.js

# Ver se a rota está importada no index
cat build/src/index.js | grep internal
```

**Se os arquivos não existirem ou estiverem desatualizados:**
```bash
# Dentro do container
npm run build

# Reiniciar o serviço
npm start
```

---

### 4️⃣ Forçar Rebuild Completo no Portainer

Se nada acima funcionar:

1. **No Portainer:**
   - Vá em **Stacks** → **cga_arco_consultoria**
   - Clique em **Stop**
   - Aguarde parar completamente
   - Clique em **Start**

2. **Ou via Docker CLI:**
```bash
# Parar o stack
docker stack rm cga_arco_consultoria

# Aguardar 30 segundos
sleep 30

# Recriar o stack
cd /var/lib/docker/volumes/cga_arco_consultoria_data/_data/CGA-Arco-Consultoria
docker stack deploy -c docker-compose.swarm.yml cga_arco_consultoria
```

---

### 5️⃣ Verificar Variáveis de Ambiente

```bash
# Ver variáveis do backend CGA
docker exec -it $(docker ps -q -f name=cga_arco_consultoria_backend) sh
env | grep -E "INTERNAL_API_KEY|ARCO_PORTUS_JWT_SECRET"
```

**Deve retornar:**
```
INTERNAL_API_KEY=NDQBFansjdnqfbquwb1237asud1ngjnJAFWJNFjnaisf9283nfjNFnfjqnfbsu91293JNDjNDQWBFUBWjqwufbasjnjncw98124012.1e209eqsjcanjn
