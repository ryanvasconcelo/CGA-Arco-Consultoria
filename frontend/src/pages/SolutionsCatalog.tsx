import Header from "@/components/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Shield, BarChart3, Eye, CheckSquare, GraduationCap, Waves } from "lucide-react";
import acciaLogo from "@/assets/accia-logo.png";
import arcoPortusLogo from "@/assets/arco-portus-logo.png";
import arcoViewLogo from "@/assets/arcoview-controll.png";
import guardControlLogo from "@/assets/guardcontroll-logo.png";
import unicaspLogo from "@/assets/unicasp-logo.png";
import arcoMokiLogo from "@/assets/checklist-facil-logo.png";
import { url } from "node:inspector";

const SolutionsCatalog = () => {
  const solutions = [
    {
      id: "accia",
      name: "Accia",
      logo: acciaLogo,
      icon: Shield,
      description: "Sistema de Gerenciamento de Riscos e Ocorrências em Segurança Patrimonial",
      features: ["Gestão de Riscos", "Compliance", "Auditoria", "Relatórios"],
      color: "from-blue-500 to-cyan-500"
    },
    {
      id: "arco-portus",
      name: "Arco Portus",
      logo: arcoPortusLogo,
      icon: Waves,
      description: "Plataforma para Gerenciamento de Operações de Segurança Portuária",
      features: ["Controle Portuário", "Logística", "Rastreamento", "Integração"],
      color: "from-amber-500 to-orange-500"
    },
    {
      id: "arco-view",
      name: "Arco View",
      logo: arcoViewLogo,
      icon: Eye,
      description: "Solução de Monitoramento por Drones Automatizados para Segurança",
      features: ["Monitoramento", "Análise Visual", "Alertas", "Dashboard"],
      color: "from-green-500 to-emerald-500"
    },
    {
      id: "guard-control",
      name: "Guard Control",
      logo: guardControlLogo,
      icon: Shield,
      description: "Sistema de Gestão Inteligente das Operações de Segurança e Serviços",
      features: ["Controle de Acesso", "Segurança", "Monitoramento", "Relatórios"],
      color: "from-blue-600 to-indigo-600"
    },
    {
      id: "unicasp",
      name: "Unicasp",
      logo: unicaspLogo,
      icon: GraduationCap,
      description: "Plataforma de Educação Corporativo para Capacitação e Aperfeiçoamento",
      features: ["Cursos Online", "Certificações", "Treinamentos", "Avaliações"],
      color: "from-purple-500 to-violet-500"
    },
    {
      id: "arco-moki",
      name: "Arco Moki",
      logo: arcoMokiLogo,
      icon: CheckSquare,
      description: "Solução para Criação de Formulários Eletrônicos Personalizados",
      features: ["Checklists Digitais", "Processos", "Conformidade", "Automação"],
      color: "from-green-600 to-teal-600"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      <Header />
      {/* Hero Section */}
      <section className="pt-20 px-4">
        <div className="container mx-auto text-center">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-primary to-primary-hover bg-clip-text text-transparent pb-8">
            Catálogo de Soluções
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            Conheça nossas soluções integradas de gestão corporativa, desenvolvidas para atender
            cada necessidade específica do seu negócio com tecnologia de ponta.
          </p>
        </div>
      </section>

      {/* Solutions Grid */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-8">
            {solutions.map((solution) => {
              const IconComponent = solution.icon;
              return (
                <Card key={solution.id} className="glass-card group hover-scale overflow-hidden">
                  <div className={`h-2 bg-gradient-to-r ${solution.color}`}></div>

                  <CardHeader className="text-center pb-4">
                    <div className="w-24 h-24 mx-auto mb-4 p-4 bg-white rounded-lg shadow-md flex items-center justify-center">
                      <img
                        src={solution.logo}
                        alt={solution.name}
                        className="max-w-full max-h-full object-contain"
                      />
                    </div>
                    <CardTitle className="text-xl font-bold text-foreground">
                      {solution.name}
                    </CardTitle>
                  </CardHeader>

                  <CardContent className="space-y-6">
                    <p className="text-muted-foreground text-center leading-relaxed">
                      {solution.description}
                    </p>

                    <div className="space-y-3">
                      <h4 className="font-semibold text-foreground flex items-center">
                        <IconComponent className="h-4 w-4 mr-2 text-primary" />
                        Principais Recursos
                      </h4>
                      <ul className="space-y-1">
                        {solution.features.map((feature, index) => (
                          <li key={index} className="text-sm text-muted-foreground flex items-center">
                            <div className="w-1.5 h-1.5 rounded-full bg-primary mr-2"></div>
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <a href="https://wa.me/5592991761245?text=Ol%C3%A1,%20gostaria%20de%20saber%20mais%20sobre%20os%20servi%C3%A7os%20da%20Arco%20Consultoria." className="w-full btn-primary group-hover:scale-105 transition-transform" target="_blank" rel="noopener noreferrer">
                      Saiba Mais
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </a>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <Card className="glass-card max-w-4xl mx-auto">
            <CardContent className="p-12">
              <h2 className="text-3xl font-bold text-foreground mb-6">
                Pronto para transformar sua gestão corporativa?
              </h2>
              <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                Entre em contato conosco e descubra como nossas soluções podem
                otimizar seus processos e aumentar a segurança da sua empresa.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="btn-primary">
                  <a href="https://wa.me/5592991761245?text=Ol%C3%A1,%20gostaria%20de%20saber%20mais%20sobre%20os%20servi%C3%A7os%20da%20Arco%20Consultoria." className="flex items-center" target="_blank" rel="noopener noreferrer">
                    Falar com Especialista
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </a>
                </Button>
                <Button size="lg" variant="outline" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground">
                  <a href="https://wa.me/5592991761245?text=Ol%C3%A1,%20gostaria%20de%20saber%20mais%20sobre%20os%20servi%C3%A7os%20da%20Arco%20Consultoria." className="flex items-center" target="_blank" rel="noopener noreferrer">
                    Ver Demonstração
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 text-center text-sm text-muted-foreground border-t border-border/50">
        <div className="container mx-auto">
          © 2023 Arco Consultoria em Segurança - Todos os direitos reservados.
        </div>
      </footer>
    </div>
  );
};

export default SolutionsCatalog;