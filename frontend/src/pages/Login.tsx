import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Mail, Lock } from "lucide-react";
import { motion } from 'framer-motion';
import Tilt from 'react-parallax-tilt';
import { useAutoAnimate } from '@formkit/auto-animate/react';

// Import service logos
import acciaLogo from "@/assets/accia-logo.png";
import arcoPortusLogo from "@/assets/arco-portus-logo.png";
import arcomokiLogo from "@/assets/checklist-facil-logo.jpg";
import arcoviewLogo from "@/assets/arcoview-controll.png";
import guardcontrolLogo from "@/assets/guardcontroll-logo.png";
import unicaspLogo from "@/assets/unicasp-logo.png";
import cgaLogo from "@/assets/cga-logo.png";
import arcoSolut from "@/assets/Arco-Solutions.png";
import LGPD from "@/assets/selo-LGPD.png";
import arcoLogo from "@/assets/Logoarco-color.svg";


const services = [
  { id: 1, name: "ACCIA", logo: acciaLogo, description: "Gestão empresarial" },
  { id: 2, name: "Arco Portus", logo: arcoPortusLogo, description: "Documentação portuária" },
  { id: 3, name: "ArcoMoki", logo: arcomokiLogo, description: "Checklist digital" },
  { id: 4, name: "ArcoView", logo: arcoviewLogo, description: "Monitoramento" },
  { id: 5, name: "GuardControl", logo: guardcontrolLogo, description: "Controle de acesso" },
  { id: 6, name: "UNICASP", logo: unicaspLogo, description: "Educação cooperativa" },
  { id: 7, name: "CGA", logo: cgaLogo, description: "Central de gestão" },
  { id: 8, name: "Arco Solutions", logo: arcoSolut, description: "Central de gestão" }
];

// Define grid layouts - cada layout é uma configuração diferente do quebra-cabeça
const gridLayouts = [
  // Layout 1
  [
    { id: 1, row: 1, col: 1, rowSpan: 1, colSpan: 1 },
    { id: 2, row: 1, col: 2, rowSpan: 1, colSpan: 2 },
    { id: 3, row: 2, col: 1, rowSpan: 2, colSpan: 1 },
    { id: 4, row: 2, col: 2, rowSpan: 1, colSpan: 1 },
    { id: 5, row: 2, col: 3, rowSpan: 1, colSpan: 1 },
    { id: 6, row: 3, col: 2, rowSpan: 1, colSpan: 1 },
    { id: 7, row: 3, col: 3, rowSpan: 1, colSpan: 1 },
    { id: 8, row: 3, col: 1, rowSpan: 1, colSpan: 1 },
  ],
  // Layout 2
  [
    { id: 1, row: 1, col: 1, rowSpan: 2, colSpan: 1 },
    { id: 2, row: 1, col: 2, rowSpan: 1, colSpan: 1 },
    { id: 3, row: 1, col: 3, rowSpan: 1, colSpan: 1 },
    { id: 4, row: 2, col: 2, rowSpan: 1, colSpan: 2 },
    { id: 5, row: 3, col: 1, rowSpan: 1, colSpan: 1 },
    { id: 6, row: 3, col: 2, rowSpan: 1, colSpan: 1 },
    { id: 7, row: 3, col: 3, rowSpan: 1, colSpan: 1 },
    { id: 8, row: 2, col: 1, rowSpan: 1, colSpan: 1 }
  ],
  // Layout 3
  [
    { id: 1, row: 1, col: 1, rowSpan: 1, colSpan: 1 },
    { id: 2, row: 1, col: 2, rowSpan: 1, colSpan: 1 },
    { id: 3, row: 1, col: 3, rowSpan: 2, colSpan: 1 },
    { id: 4, row: 2, col: 1, rowSpan: 1, colSpan: 2 },
    { id: 5, row: 3, col: 1, rowSpan: 1, colSpan: 1 },
    { id: 6, row: 3, col: 2, rowSpan: 1, colSpan: 1 },
    { id: 7, row: 2, col: 3, rowSpan: 2, colSpan: 1 },
    { id: 8, row: 3, col: 3, rowSpan: 1, colSpan: 1 }
  ],
  // Layout 4
  [
    { id: 1, row: 1, col: 1, rowSpan: 1, colSpan: 2 },
    { id: 2, row: 1, col: 3, rowSpan: 1, colSpan: 1 },
    { id: 3, row: 2, col: 1, rowSpan: 1, colSpan: 1 },
    { id: 4, row: 2, col: 2, rowSpan: 2, colSpan: 1 },
    { id: 5, row: 2, col: 3, rowSpan: 1, colSpan: 1 },
    { id: 6, row: 3, col: 1, rowSpan: 1, colSpan: 1 },
    { id: 7, row: 3, col: 3, rowSpan: 1, colSpan: 1 },
    { id: 8, row: 3, col: 2, rowSpan: 1, colSpan: 1 }
  ],
];

export default function Login() {
  const navigate = useNavigate();
  const { signIn } = useAuth();
  const [formData, setFormData] = useState({ email: "", senha: "" });
  const [error, setError] = useState<string | null>(null);
  const [currentLayout, setCurrentLayout] = useState(0);
  const [transitioningCards, setTransitioningCards] = useState<Set<number>>(new Set());
  const [parent] = useAutoAnimate();

  useEffect(() => {
    // Função para trocar cards individuais de forma aleatória
    const startRandomTransitions = () => {
      const intervalId = setInterval(() => {
        // Escolhe 1 ou 2 cards aleatórios para transicionar
        const numCardsToChange = Math.random() > 0.5 ? 1 : 2;
        const availableCards = services.filter(s => !transitioningCards.has(s.id));

        if (availableCards.length === 0) return;

        const cardsToChange: number[] = [];
        for (let i = 0; i < numCardsToChange && availableCards.length > 0; i++) {
          const randomIndex = Math.floor(Math.random() * availableCards.length);
          const card = availableCards.splice(randomIndex, 1)[0];
          cardsToChange.push(card.id);
        }

        // Marca cards como em transição
        setTransitioningCards(prev => new Set([...prev, ...cardsToChange]));

        // Após fade out, troca o layout e faz fade in
        setTimeout(() => {
          setCurrentLayout(prev => (prev + 1) % gridLayouts.length);

          // Remove cards da lista de transição após completar
          setTimeout(() => {
            setTransitioningCards(prev => {
              const newSet = new Set(prev);
              cardsToChange.forEach(id => newSet.delete(id));
              return newSet;
            });
          }, 1000);
        }, 500);

      }, 3000 + Math.random() * 2000); // Intervalo aleatório entre 3-5s

      return intervalId;
    };

    const intervalId = startRandomTransitions();
    return () => clearInterval(intervalId);
  }, [transitioningCards]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      await signIn({ email: formData.email, password: formData.senha });
      navigate('/');
    } catch (err) {
      setError('Email ou senha incorretos. Por favor, tente novamente.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5 z-0"></div>

      {/* Animated Gradient Orbs */}
      <div className="absolute top-[-100px] left-[-100px] w-[400px] h-[400px] bg-gradient-to-br from-primary to-secondary rounded-full blur-3xl animate-pulse z-0"></div>
      <div className="absolute top-[20%] right-[-150px] w-[300px] h-[300px] bg-gradient-to-tr from-secondary to-accent rounded-full blur-2xl animate-pulse z-0" style={{ animationDelay: '1s' }}></div>
      <div className="absolute bottom-[10%] left-[30%] w-[350px] h-[350px] bg-gradient-to-bl from-muted to-primary rounded-full blur-2xl animate-pulse z-0" style={{ animationDelay: '2s' }}></div>
      <div className="absolute bottom-[-120px] right-[10%] w-[400px] h-[400px] bg-gradient-to-br from-accent to-secondary rounded-full blur-3xl animate-pulse z-0" style={{ animationDelay: '3s' }}></div>
      <div
        className="absolute w-lg inset-0 bg-no-repeat bg-top-left bg-contain opacity-10 blur-sm z-0"
        style={{
          backgroundImage: "url('https://copilot.microsoft.com/th/id/BCO.f82a0515-c060-4a4f-ab80-8976deaf4d78.png')",
        }}
      ></div>


      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">

          {/* Asymmetric Animated Grid - Puzzle Style */}
          <div className="space-y-8 hidden lg:block">
            <div className="space-y-4">
              <h2 className="text-4xl font-bold">
                <span className="text-foreground">ARCO</span>
                <span className="text-muted-foreground"> | </span>
                <span className="bg-gradient-to-r from-primary to-primary-hover bg-clip-text text-transparent">
                  Uma solução para cada necessidade
                </span>
              </h2>
              <p className="text-xl text-muted-foreground">
                Soluções especializadas para cada área do seu negócio
              </p>
            </div>
            <div ref={parent} className="grid grid-cols-3 gap-4 h-full">
              {gridLayouts[currentLayout].map((item) => {
                const service = services.find(s => s.id === item.id);
                if (!service) return null;

                const isTransitioning = transitioningCards.has(service.id);

                return (
                  <div
                    className="w-full h-full"
                    style={{
                      gridColumn: `${item.col} / span ${item.colSpan}`,
                      gridRow: `${item.row} / span ${item.rowSpan}`,
                    }}
                  >
                    <div
                      className="w-full h-full h-full transition-all duration-700 ease-in-out"
                      style={{
                        gridColumn: `${item.col} / span ${item.colSpan}`,
                        gridRow: `${item.row} / span ${item.rowSpan}`,
                      }}
                    >
                      <Tilt
                        glareEnable={true}
                        glareColor="#ffffff"
                        glarePosition="bottom"
                        glareBorderRadius="12px"
                      >
                        <motion.div
                          layout
                          key={service.id}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                          className="p-6 glass-card border-white/10 hover:border-primary/30 cursor-pointer group hover:scale-[1.02] hover:z-10 rounded-xl shadow-md backdrop-blur-md"
                        >
                          <div className="h-full flex flex-col justify-between transition-all duration-500">
                            {service.logo ? (
                              <img
                                src={service.logo}
                                alt={service.name}
                                className="h-12 w-auto object-contain mb-3 transition-all duration-500 group-hover:scale-110"
                                style={{
                                  opacity: isTransitioning ? 1 : 1,
                                  transition: 'all 0.5s ease-in-out',
                                }}
                              />
                            ) : (
                              <div
                                className="h-12 w-12 rounded-lg bg-gradient-to-br from-primary to-primary-hover flex items-center justify-center mb-3 transition-all duration-500 group-hover:scale-110"
                                style={{
                                  opacity: isTransitioning ? 1 : 1,
                                  transition: 'all 0.5s ease-in-out',
                                }}
                              >
                                <span className="text-xl font-bold text-white">{service.name[0]}</span>
                              </div>
                            )}
                            <div style={{
                              opacity: isTransitioning ? 1 : 1,
                              transition: 'opacity 0.5s ease-in-out',
                            }}>
                              <h3 className="font-semibold mb-1 text-sm transition-colors duration-300 group-hover:text-primary">
                                {service.name}
                              </h3>
                              <p className="text-xs text-muted-foreground transition-opacity duration-300 group-hover:opacity-70">
                                {service.description}
                              </p>
                            </div>
                          </div>
                        </motion.div>
                      </Tilt>
                    </div>

                  </div>

                );
              })}
            </div>
          </div>

          {/* Right Side - Login Form */}
          <div className="w-full max-w-md mx-auto lg:mx-auto">
            <Card className="glass-card border-white/10 p-8 backdrop-blur-xl animate-fade-in">
              <div className="space-y-6">
                <div className="text-center space-y-2">
                  <h1 className="text-3xl font-bold">Acesse sua conta</h1>
                  <p className="text-muted-foreground">Entre com suas credenciais</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-medium">
                      Email
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="seu@email.com"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="pl-10 glass-input h-12"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="senha" className="text-sm font-medium">
                      Senha
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="senha"
                        name="senha"
                        type="password"
                        placeholder="••••••••"
                        value={formData.senha}
                        onChange={handleInputChange}
                        className="pl-10 glass-input h-12"
                        required
                      />
                    </div>
                  </div>

                  {error && (
                    <div className="text-sm text-red-500 text-center bg-red-50 dark:bg-red-950/30 p-3 rounded-lg">
                      {error}
                    </div>
                  )}

                  <Button
                    type="submit"
                    className="w-full gradient-primary h-12 text-base font-semibold hover-lift"
                  >
                    Acessar
                  </Button>

                  <div className="text-center">
                    <button
                      type="button"
                      className="text-sm text-muted-foreground hover:text-primary transition-colors"
                    >
                      Esqueci minha senha
                    </button>
                  </div>
                </form>

                {/* LGPD Badge */}
                <div className="pt-4 border-t border-border/50 flex justify-center">
                  <div className="w-48 h-48 rounded-full bg-background border-2 border-primary/20 flex items-center justify-center">
                    <div className="text-center">
                      <img src={LGPD} alt="" />
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
      {/* Footer */}
      <footer className="py-8 text-center text-sm text-muted-foreground border-t border-border/50">
        <div className="container mx-auto">
          © 2023 Arco Consultoria em Segurança - Todos os direitos reservados.
        </div>
      </footer>
    </div>
  );
}