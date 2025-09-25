import { Search, User, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { UserProfileCard } from "@/components/UserProfileCard";

const Header = () => {
  return (
    <header className="bg-card border-b border-border sticky top-0 z-50 backdrop-blur-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="text-2xl font-bold">
              <span className="text-secondary">CGA</span>
            </div>
            <div className="text-xs text-muted-foreground hidden sm:block">
              CENTRAL DE GESTÃO ARCO
            </div>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <a href="/" className="text-foreground hover:text-primary transition-colors font-medium">
              INÍCIO
            </a>
            <a href="/admin/users" className="text-foreground hover:text-primary transition-colors font-medium">
              USUÁRIOS
            </a>
            <a href="/catalogo-solucoes" className="text-foreground hover:text-primary transition-colors font-medium">
              CATÁLOGO DE SOLUÇÕES
            </a>
            <a href="/canal-denuncias" className="text-foreground hover:text-primary transition-colors font-medium">
              CANAL DE DENÚNCIAS
            </a>
            <a href="/contato" className="text-foreground hover:text-primary transition-colors font-medium">
              FALE CONOSCO
            </a>
          </nav>

          {/* Search and Actions */}
          <div className="flex items-center space-x-4">
            <div className="relative hidden lg:block">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search"
                className="pl-10 w-64 bg-muted border-border"
              />
            </div>
            <UserProfileCard 
              user={{
                name: "João Silva",
                email: "joao.silva@empresa.com",
                role: "ADMIN",
                company: "Porto Chibatão S.A."
              }}
              onLogout={() => {
                // Handle logout
                console.log("Logout clicked");
              }}
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