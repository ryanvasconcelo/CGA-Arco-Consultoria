// frontend/src/components/Header.tsx
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { UserProfileCard } from "@/components/UserProfileCard";
import CgaLogo from "../assets/cga-logo.png";
import { useAuth } from "@/contexts/AuthContext"; // 1. Importamos o hook de autenticação

const Header = () => {
  // 2. Pegamos o usuário e a função de logout do nosso contexto global
  const { user, signOut } = useAuth();

  // 3. Adicionamos uma "guarda". Se o usuário ainda não foi carregado, não mostramos nada.
  //    Isso previne erros no primeiro carregamento da página.
  if (!user) {
    return null;
  }

  return (
    <header className="bg-card border-b border-border sticky top-0 z-50 backdrop-blur-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo - Mantido o seu */}
          <div className="flex items-center space-x-2">
            <img src={CgaLogo} alt="Logo CGA" className="w-32" />
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <a
              href="/"
              className={`transition-colors font-medium ${window.location.pathname === '/'
                ? 'text-primary border-b-2 border-primary'
                : 'text-foreground hover:text-primary'
                }`}
            >
              INÍCIO
            </a>
            <a
              href="/admin/users"
              className={`transition-colors font-medium ${window.location.pathname === '/admin/users'
                ? 'text-primary border-b-2 border-primary'
                : 'text-foreground hover:text-primary'
                }`}
            >
              GESTÃO DE ATIVOS
            </a>
            <a
              href="/catalogo-solucoes"
              className={`transition-colors font-medium ${window.location.pathname === '/catalogo-solucoes'
                ? 'text-primary border-b-2 border-primary'
                : 'text-foreground hover:text-primary'
                }`}
            >
              CATÁLOGO DE SOLUÇÕES
            </a>
            <a
              href="/canal-denuncias"
              className={`transition-colors font-medium ${window.location.pathname === '/canal-denuncias'
                ? 'text-primary border-b-2 border-primary'
                : 'text-foreground hover:text-primary'
                }`}
            >
              CANAL DE DENÚNCIAS
            </a>
            <a
              href="/contato"
              className={`transition-colors font-medium ${window.location.pathname === '/contato'
                ? 'text-primary border-b-2 border-primary'
                : 'text-foreground hover:text-primary'
                }`}
            >
              FALE CONOSCO
            </a>
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