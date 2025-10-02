// frontend/src/components/Header.tsx
import { Menu } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { UserProfileCard } from "@/components/UserProfileCard";
import CgaLogo from "../assets/cga-logo.png";
import { useAuth } from "@/contexts/AuthContext";

const Header = () => {
  const { user, signOut } = useAuth();
  const location = useLocation();

  if (!user) {
    return null;
  }

  return (
    <header className="bg-card border-b border-border sticky top-0 z-50 backdrop-blur-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <Link to="/">
              <img src={CgaLogo} alt="Logo CGA" className="w-32 cursor-pointer" />
            </Link>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link
              to="/"
              className={`transition-colors font-medium ${location.pathname === '/'
                ? 'text-primary border-b-2 border-primary'
                : 'text-foreground hover:text-primary'
                }`}
            >
              INÍCIO
            </Link>
            {(user.role === 'ADMIN' || user.role === 'SUPER_ADMIN') && (
              <Link
                to="/admin/users"
                className={`transition-colors font-medium ${location.pathname === '/admin/users'
                  ? 'text-primary border-b-2 border-primary'
                  : 'text-foreground hover:text-primary'
                  }`}
              >
                GESTÃO DE ATIVOS
              </Link>
            )}
            {(user.role === 'ADMIN' || user.role === 'SUPER_ADMIN') && (
              <Link
                to="/catalogo-solucoes"
                className={`transition-colors font-medium ${location.pathname === '/catalogo-solucoes'
                  ? 'text-primary border-b-2 border-primary'
                  : 'text-foreground hover:text-primary'
                  }`}
              >
                CATÁLOGO DE SOLUÇÕES
              </Link>
            )}
            {(user.role === 'ADMIN' || user.role === 'SUPER_ADMIN') && (
              <Link
                to="/canal-denuncias"
                className={`transition-colors font-medium ${location.pathname === '/canal-denuncias'
                  ? 'text-primary border-b-2 border-primary'
                  : 'text-foreground hover:text-primary'
                  }`}
              >
                CANAL DE DENÚNCIAS
              </Link>
            )}
            {(user.role === 'ADMIN' || user.role === 'SUPER_ADMIN') && (
              <Link
                to="/contato"
                className={`transition-colors font-medium ${location.pathname === '/contato'
                  ? 'text-primary border-b-2 border-primary'
                  : 'text-foreground hover:text-primary'
                  }`}
              >
                FALE CONOSCO
              </Link>
            )}
          </nav>

          {/* Profile and Actions */}
          <div className="flex items-center space-x-4">
            <UserProfileCard
              // 4. Usamos os dados dinâmicos do usuário logado
              user={{
                name: user.name, // Nome do usuário
                email: user.email,
                role: user.role,
                company: user.company?.name, // Nome da empresa (com '?' para segurança)
              }}
              // 5. Conectamos a função de logout real
              onLogout={signOut}
            />
            <Button variant="ghost" size="sm" className="md:hidden">
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;