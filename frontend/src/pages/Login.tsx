import { useState } from "react";
import { useNavigate } from "react-router-dom"; // Importa o hook para navegação
import { useAuth } from "@/contexts/AuthContext"; // Importa nosso hook de autenticação
import api from '../lib/api';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Building2, User, Lock } from "lucide-react";
import acciaLogo from "@/assets/accia-logo.png";
import arcoPortusLogo from "@/assets/arco-portus-logo.png";
import arcoViewLogo from "@/assets/arcoview-controll.png";
import guardControlLogo from "@/assets/guardcontroll-logo.png";
import unicaspLogo from "@/assets/unicasp-logo.png";
import arcoMokiLogo from "@/assets/checklist-facil-logo.jpg";

const Login = () => {
  const navigate = useNavigate(); // Hook para redirecionar o usuário
  const { signIn } = useAuth(); // Pega a função signIn do nosso contexto
  const [formData, setFormData] = useState({
    email: "",
    senha: ""
  });

  const [error, setError] = useState<string | null>(null); // Estado para guardar mensagens de erro

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null); // Limpa erros antigos

    try {
      // Chama a função signIn do AuthContext
      await signIn({ email: formData.email, password: formData.senha });

      // Se o signIn der certo, navega para a página de gestão de usuários
      navigate('/admin/users');

    } catch (err) {
      console.error("Falha no login", err);
      setError('Email ou senha incorretos. Por favor, tente novamente.');
    }
  };

  const handleForgotPassword = () => {
    // Forgot password logic here
    console.log("Forgot password clicked");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5 flex items-center justify-center relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-8 items-center max-w-6xl mx-auto">

          {/* Left Side - Solutions Grid */}
          <div className="space-y-8">
            <div className="text-center lg:text-left">
              <h1 className="text-4xl lg:text-5xl font-bold text-foreground mb-4">
                Uma <span className="text-secondary">solução</span> para<br />
                cada necessidade
              </h1>
              <p className="text-lg text-muted-foreground">
                Acesse nossas soluções integradas de gestão corporativa
              </p>
            </div>

            {/* Solutions Grid */}
            <div className="grid grid-cols-3 gap-4">
              <Card className="glass-card p-6 flex items-center justify-center min-h-[120px] hover-scale">
                <img src={acciaLogo} alt="Accia" className="max-w-full max-h-16 object-contain" />
              </Card>
              <Card className="glass-card p-6 flex items-center justify-center min-h-[120px] hover-scale">
                <img src={arcoPortusLogo} alt="Arco Portus" className="max-w-full max-h-16 object-contain" />
              </Card>
              <Card className="glass-card p-6 flex items-center justify-center min-h-[120px] hover-scale">
                <img src={arcoMokiLogo} alt="Arco Moki" className="max-w-full max-h-16 object-contain" />
              </Card>
              <Card className="glass-card p-6 flex items-center justify-center min-h-[120px] hover-scale">
                <img src={unicaspLogo} alt="Unicasp" className="max-w-full max-h-16 object-contain" />
              </Card>
              <Card className="glass-card p-6 flex items-center justify-center min-h-[120px] hover-scale">
                <img src={arcoViewLogo} alt="Arco View" className="max-w-full max-h-16 object-contain" />
              </Card>
              <Card className="glass-card p-6 flex items-center justify-center min-h-[120px] hover-scale">
                <img src={guardControlLogo} alt="Guard Control" className="max-w-full max-h-16 object-contain" />
              </Card>
            </div>

            {/* Bottom Logo */}
            <div className="flex items-center justify-center lg:justify-start space-x-4 pt-8">
              <div className="text-3xl font-bold">
                <span className="text-foreground">CGA</span>
              </div>
              <div className="text-sm text-muted-foreground">
                CENTRAL DE GESTÃO ARCO
              </div>
            </div>
          </div>

          {/* Lado Direito - Formulário de Login */}
          <div className="flex justify-center lg:justify-end">
            <Card className="glass-card w-full max-w-md">
              <CardContent className="p-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="text-center mb-8">
                    <h2 className="text-2xl font-bold text-foreground mb-2">Acesse sua conta</h2>
                    <p className="text-muted-foreground">Entre com suas credenciais</p>
                  </div>

                  <div className="space-y-4">
                    {/* CAMPO EMPRESA REMOVIDO */}
                    <div>
                      <Label htmlFor="email" className="text-foreground font-medium">
                        Email
                      </Label>
                      <div className="relative mt-2">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          className="glass-input pl-10"
                          placeholder="seu@email.com"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="senha" className="text-foreground font-medium">
                        Senha
                      </Label>
                      <div className="relative mt-2">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                        <Input
                          id="senha"
                          name="senha"
                          type="password"
                          value={formData.senha}
                          onChange={handleInputChange}
                          className="glass-input pl-10"
                          placeholder="••••••••"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {/* Exibição de mensagem de erro */}
                  {error && <p className="text-sm text-destructive text-center">{error}</p>}

                  <div className="space-y-4 pt-2">
                    <Button type="submit" className="w-full btn-primary">
                      Acessar
                    </Button>

                    <Button
                      type="button"
                      variant="ghost"
                      className="w-full text-primary hover:text-primary/80"
                    >
                      Esqueci minha senha
                    </Button>
                  </div>
                </form>

                {/* LGPD Seal */}
                <div className="mt-8 flex justify-center">
                  <div className="text-center">
                    <div className="w-16 h-16 rounded-full border-2 border-muted-foreground/20 flex items-center justify-center mx-auto mb-2">
                      <Lock className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <div className="text-xs text-muted-foreground">
                      <div className="font-semibold">LGPD</div>
                      <div>Certificado</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-sm text-muted-foreground">
          © 2023 Arco Consultoria em Segurança - Todos os direitos reservados.
        </div>
      </div>
    </div>
  );
};

export default Login;