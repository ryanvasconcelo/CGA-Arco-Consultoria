// frontend/src/lib/api.ts
import axios from 'axios';

// Cria uma instância do Axios com a URL base da nossa API
const api = axios.create({
  baseURL: 'http://localhost:3333', // A porta do nosso backend
});

// Interceptor: Uma função que "intercepta" cada requisição antes de ela ser enviada
api.interceptors.request.use(async (config) => {
  // Pega o token que salvamos no navegador (localStorage)
  const token = localStorage.getItem('@CGA:token');
  
  // Se o token existir, adiciona o cabeçalho de autorização
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  return config;
});

export default api;