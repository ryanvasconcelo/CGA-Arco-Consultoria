// frontend/src/lib/api.ts
import axios from 'axios';

// Instância do Axios para requisições autenticadas (com token JWT)
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3333/api',
});

// Interceptor para adicionar o token JWT a cada requisição
// O interceptor de request não é mais necessário aqui,
// pois o AuthContext agora gerencia o token diretamente
// na instância do axios. Isso evita race conditions.

// --- ADICIONADO: Interceptor de Resposta para tratar erros 401 ---
// Este interceptor vai "escutar" as respostas da API.
api.interceptors.response.use(
  // Se a resposta for bem-sucedida (status 2xx), apenas a retorna.
  (response) => response,
  // Se ocorrer um erro...
  (error) => { // A função de erro começa aqui
    // Verificamos se o erro é um 401 (Unauthorized) e não é na rota de login.
    if (error.response?.status === 401 && !error.config.url.endsWith('/sessions')) {
      // Em vez de redirecionar aqui, disparamos um evento customizado.
      // O AuthContext vai "ouvir" este evento e cuidar do logout.
      // Isso quebra a dependência circular.
      window.dispatchEvent(new Event('unauthorized'));
    }
    return Promise.reject(error); // O erro é repassado para o React Query/código que fez a chamada
  } // E termina aqui
);

// Instância do Axios para requisições públicas/não autenticadas (ex: login, cadastro, esqueci a senha)
const apiPublic = axios.create({
  baseURL: import.meta.env.VITE_API_PUBLIC_URL || 'http://localhost:3333',
});

// Exporta ambas as instâncias
export { api, apiPublic };