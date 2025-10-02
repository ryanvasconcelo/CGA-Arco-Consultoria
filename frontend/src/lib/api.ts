// frontend/src/lib/api.ts
import axios from 'axios';

// Instância do Axios para requisições autenticadas (com token JWT)
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3333/api',
});

// Interceptor para adicionar o token JWT a cada requisição
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('@CGA:token');
    console.log('🔑 [API Request] Token encontrado:', token ? 'SIM' : 'NÃO');
    console.log('🔑 [API Request] URL:', config.url);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('✅ [API Request] Token adicionado ao header');
    } else {
      console.log('⚠️ [API Request] Sem token - requisição sem autenticação');
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor de Resposta para tratar erros 401
api.interceptors.response.use(
  (response) => {
    console.log('✅ [API Response] Sucesso:', response.config.url);
    return response;
  },
  (error) => {
    console.log('❌ [API Response] Erro:', error.config?.url, 'Status:', error.response?.status);
    // Verificamos se o erro é um 401 (Unauthorized) e não é na rota de login.
    if (error.response?.status === 401 && !error.config.url.endsWith('/sessions')) {
      console.log('🚪 [API Response] 401 detectado - Disparando evento de logout');
      // Dispara evento customizado para o AuthContext tratar o logout
      window.dispatchEvent(new Event('unauthorized'));
    }
    return Promise.reject(error);
  }
);

// Instância do Axios para requisições públicas/não autenticadas (ex: login, cadastro, esqueci a senha)
const apiPublic = axios.create({
  baseURL: import.meta.env.VITE_API_PUBLIC_URL || 'http://localhost:3333',
});

// Exporta ambas as instâncias
export { api, apiPublic };