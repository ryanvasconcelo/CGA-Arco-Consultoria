import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";

const ArcoPortusLogin = () => {
  const [email, setEmail] = useState("marco.trindade@consultoriaarco.com.br");
  const [password, setPassword] = useState("••••••••");

  return (
    <div 
      className="min-h-screen flex items-center justify-center relative"
      style={{
        backgroundImage: `url('https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/60"></div>
      
      {/* Background Elements */}
      <div className="absolute left-20 top-1/2 transform -translate-y-1/2">
        <div className="relative">
          {/* Circular background for person */}
          <div className="w-80 h-80 rounded-full border-8 border-secondary/80 bg-gradient-to-br from-secondary/20 to-transparent flex items-center justify-center">
            <div className="w-64 h-64 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center">
              <img 
                src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
                alt="Port Worker"
                className="w-56 h-56 rounded-full object-cover"
              />
            </div>
          </div>
          
          {/* Laptop mockup */}
          <div className="absolute -right-20 top-20">
            <div className="w-48 h-32 bg-secondary/90 rounded-lg border-4 border-secondary/60 transform rotate-12">
              <div className="w-full h-full bg-white/20 rounded flex items-center justify-center">
                <div className="text-white font-bold text-lg">ARCO</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 flex items-center justify-end w-full max-w-7xl mx-auto px-8">
        <div className="text-right mr-20">
          {/* Title */}
          <div className="text-white mb-8">
            <h1 className="text-xl font-normal mb-2">Plataforma de</h1>
            <h2 className="text-2xl font-bold mb-2">GERENCIAMENTO DE OPERAÇÕES</h2>
            <h3 className="text-2xl font-bold mb-2">DE SEGURANÇA PORTUÁRIA</h3>
            <p className="text-secondary text-lg font-medium">Safety | Security</p>
          </div>

          {/* Login Card */}
          <Card className="w-80 bg-white/95 backdrop-blur-sm">
            <CardContent className="p-8">
              <div className="text-center mb-8">
                <div className="text-3xl font-bold">
                  <span className="text-foreground">ARCO</span>
                  <span className="text-secondary">PORTUS</span>
                </div>
              </div>

              <form className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-muted/50 border-border"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm font-medium">Senha</Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="bg-muted/50 border-border"
                  />
                </div>

                <Button className="w-full btn-primary">
                  Acessar
                </Button>

                <div className="text-center">
                  <button 
                    type="button"
                    className="text-primary hover:underline text-sm"
                  >
                    Esqueci minha senha
                  </button>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Certification Badges */}
          <div className="flex justify-center space-x-4 mt-8">
            <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-xs">PSP</span>
            </div>
            <div className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center">
              <span className="text-foreground font-bold text-xs">ISPS<br/>CODE</span>
            </div>
            <div className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center">
              <span className="text-foreground font-bold text-xs">LGPD</span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white text-sm">
        <div className="flex items-center space-x-2 mb-2">
          <div className="text-lg font-bold">ARCO</div>
        </div>
        <p className="text-center">© 2023 Arco Consultoria em Segurança - Todos os direitos reservados.</p>
      </div>
    </div>
  );
};

export default ArcoPortusLogin;