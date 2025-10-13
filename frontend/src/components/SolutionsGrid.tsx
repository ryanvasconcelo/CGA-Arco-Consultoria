import { ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import solutionsImage from "@/assets/solutions-image.jpg";
import { RiFolderChartFill } from '@remixicon/react';
import { useNavigate } from 'react-router-dom'
// Importe suas imagens de logo aqui
import acciaLogo from "@/assets/accia-logo.png";
import guardControlLogo from "@/assets/guardcontroll-logo.png";
import arcoViewLogo from "@/assets/arcoview-controll.png";
import arcomokiLogo from "@/assets/checklist-facil-logo.png";
import unicaspLogo from "@/assets/unicasp-logo.png";
import arcoPorusLogo from "@/assets/arco-portus-logo.png";
import cgaLogo from "@/assets/cga-logo.png";

const solutions = [
  {
    title: "Accia",
    titleImage: acciaLogo,
    description: "Sistema de Gerenciamento de Riscos e Ocorrências em Segurança Patrimonial",
    link: "https://app.accia.com.br/site/login"
  },
  {
    title: "Guard Control",
    titleImage: guardControlLogo,
    description: "Sistema de Gestão Inteligente das Operações de Segurança e Serviços",
    link: "https://v2.findme.id/login"
  },
  {
    title: "Arco View",
    titleImage: arcoViewLogo,
    description: "Solução de Monitoramento por Drones Automatizados para Segurança",
    link: "/arco-view"
  },
  {
    title: "Arcomoki",
    titleImage: arcomokiLogo,
    description: "Solução para Criação de Formulários Eletrônicos Personalizados",
    link: "https://spa.checklistfacil.com.br/login?lang=pt-br&thisDomain=checklistfacil.com&referringDomain=google.com&referrerDoesNotExist=false&utm_source=google&utm_medium=organic&utm_campaign=(not%20set)&utm_content=(not%20set)&utm_term=(not%20provided)&gclid=(not%20set)&dclid=(not%20set)&_gl=1*11cmhys*_gcl_aw*R0NMLjE3NjAyMTc0MzUuQ2owS0NRandnS2pIQmhDaEFSSXNBUEpSM3hkVGtabFplb3FWOVlST3Zzb2NjcWtGUkdkWHVXRzJ5RzVJUnl2N3NJRWl5RDhGOVFra0dkVWFBcXdnRUFMd193Y0I.*_gcl_au*MTAwMTczODI0NC4xNzYwMjE3Mzk5*_ga*ODgxNDU2MjQxLjE3NTA1MzAzODU.*_ga_68FP3MXMJL*czE3NjAyMTczOTgkbzIkZzEkdDE3NjAyMTc0NDkkajkkbDAkaDA"
  },
  {
    title: "Unicasp",
    titleImage: unicaspLogo,
    description: "Plataforma de Educação Corporativo para Capacitação e Aperfeiçoamento",
    link: "https://unicasp.woli.com.br/pt-BR/Login/Index?returnUrl=%2F"
  },
  {
    title: "Arco Portus",
    titleImage: arcoPorusLogo,
    description: "Plataforma para Gerenciamento de Operações de Segurança Portuária",
    link: "/arco-portus"
  }
];

const SolutionsGrid = () => {
  const navigate = useNavigate();

  const handleSolutionClick = (link: string) => {
    // Verifica se é um link externo
    if (link.startsWith('http')) {
      // Abre em uma nova aba (última opção)
      window.open(link, '_blank');
    } else {
      // Navega internamente usando React Router (primeira opção)
      navigate(link);
    }
  };

  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-12 gap-12">
          {/* Left Side - Company Info */}
          <div className="lg:col-span-4 space-y-8">
            <div className="text-center lg:text-left">
              <h2 className="heading-secondary mb-0">
                Gestão Unificada das Soluções
              </h2>
              <p className="text-corporate text-lg mb-0">
                <span className="text-primary font-semibold">Segurança, Soluções Tecnológicas e Treinamento</span>
              </p>
            </div>

            <div className="relative group overflow-hidden rounded-2xl shadow-medium hover:shadow-strong transition-all duration-500">
              <img
                src={solutionsImage}
                alt="Gestão Unificada"
                className="w-full h-80 object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-secondary/80 via-transparent to-transparent"></div>
              <div className="absolute bottom-6 left-6 text-white">
                <h3 className="text-4xl font-bold mb-2">Tudo em um</h3>
                <p className="text-primary text-5xl font-bold">Só lugar!</p>
              </div>
            </div>
          </div>

          {/* Right Side - Solutions Grid */}
          <div className="lg:col-span-8">
            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6 items-stretch">
              {solutions.map((solution, index) => (
                <Card
                  key={solution.title}
                  className="corporate-card hover-lift group cursor-pointer animate-scale-in flex flex-col h-full"
                  style={{ animationDelay: `${index * 100}ms` }}
                  onClick={() => handleSolutionClick(solution.link)} // Adiciona o evento de clique
                >
                  <CardHeader className="pb-3">
                    <div className="mb-3">
                      <img
                        src={solution.titleImage}
                        alt={solution.title}
                        className="w-48 h-16 object-contain mx-auto mb-4 object-contain group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-4 flex-1 flex flex-col">
                    <CardDescription className="text-corporate text-center text-sm leading-relaxed group-hover:text-primary transition-colors flex-1">
                      {solution.description}
                    </CardDescription>

                    <div className="mt-auto">
                      <Button
                        className="w-full btn-primary group-hover:shadow-glow"
                        onClick={(e) => {
                          e.stopPropagation(); // Previne a propagação do evento para o card
                          handleSolutionClick(solution.link);
                        }}
                      >
                        <ExternalLink className="h-4 w-4 mr-2" />
                        ACESSAR
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Dashboards Section */}
            <div className="mt-8">
              <Card className="corporate-card bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20 hover-lift" onClick={() => navigate('/dashboard')}>
                <CardContent className="p-8 cursor-pointer">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="flex text-2xl font-bold text-foreground mb-2 gap-2">
                        <div className="flex items-center justify-center">
                          <RiFolderChartFill size={24} />
                        </div>
                        Dashboards
                      </h3>
                      <p className="text-corporate">
                        Visualização completa de dados e métricas em tempo real
                      </p>
                    </div>
                    <Button className="btn-secondary hover-glow">
                      Acessar
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SolutionsGrid;