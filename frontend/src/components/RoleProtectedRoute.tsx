import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface RoleProtectedRouteProps {
    allowedRoles: string[];
}

const RoleProtectedRoute = ({ allowedRoles }: RoleProtectedRouteProps) => {
    const { user, loading } = useAuth();

    if (loading) {
        return <div>Carregando...</div>;
    }

    if (!user) {
        return <Navigate to="/login" />;
    }

    // Verifica se o role do usuário está na lista de roles permitidos
    if (!allowedRoles.includes(user.role)) {
        // Redireciona para a home se não tiver permissão
        return <Navigate to="/" replace />;
    }

    return <Outlet />;
};

export default RoleProtectedRoute;