import { Search, User, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const ArcoPortusHeader = () => {
  return (
    <header className="bg-card border-b border-border sticky top-0 z-50 backdrop-blur-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="text-2xl font-bold">
              <span className="text-foreground">ARCO</span>
              <span className="text-secondary">PORTUS</span>
            </div>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <a href="/arco-portus" className="text-foreground hover:text-primary transition-colors font-medium">
              INÍCIO
            </a>
            <a href="/arco-portus/catalogo-solucoes" className="text-foreground hover:text-primary transition-colors font-medium">
              CATÁLOGO DE SOLUÇÕES
            </a>
            <a href="/arco-portus/canal-denuncias" className="text-foreground hover:text-primary transition-colors font-medium">
              CANAL DE DENÚNCIAS
            </a>
            <a href="/arco-portus/fale-conosco" className="text-foreground hover:text-primary transition-colors font-medium">
              FALE CONOSCO
            </a>
          </nav>

          {/* Actions */}
          <div className="flex items-center space-x-4">
            <Button variant="default" size="sm" className="btn-primary">
              <User className="h-4 w-4 mr-2" />
              Sair
            </Button>
            <Button variant="ghost" size="sm" className="md:hidden">
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default ArcoPortusHeader;