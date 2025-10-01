// frontend/src/lib/api.ts
import axios from 'axios';

// --- INSTÂNCIA PARA ROTAS PÚBLICAS ---
// (Login, Esqueci a Senha, etc.)
// Não tem prefixo /api e não precisa de token.
export const apiPublic = axios.create({
  baseURL: 'http://localhost:3333',
});

// --- INSTÂNCIA PARA ROTAS PRIVADAS ---
// (Tudo que acontece depois do login)
// Tem o prefixo /api e o interceptor para enviar o token.
export const api = axios.create({
  baseURL: 'http://localhost:3333/api',
});

api.interceptors.request.use(async (config) => {
  const token = localStorage.getItem('@CGA:token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;