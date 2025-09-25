// frontend/src/components/ProtectedRoute.tsx
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const ProtectedRoute = () => {
    const { isAuthenticated, loading } = useAuth();

    console.log(`[ProtectedRoute] Checando... Loading: ${loading}, Autenticado: ${isAuthenticated}`);

    if (loading) {
        // Enquanto o AuthContext verifica o localStorage, mostramos uma tela de carregamento.
        return <div>Carregando sua sessão...</div>;
    }

    if (!isAuthenticated) {
        // Se não estiver carregando e não estiver autenticado, redireciona para o login.
        console.log("[ProtectedRoute] Acesso negado. Redirecionando para /login.");
        return <Navigate to="/login" />;
    }

    // Se passou por tudo, permite o acesso à rota filha.
    return <Outlet />;
};

export default ProtectedRoute;