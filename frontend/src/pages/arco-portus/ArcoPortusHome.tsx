import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  BarChart3,
  FileText,
  Shield,
  Settings,
  Camera,
  Users,
  BookOpen,
  ExternalLink,
  GraduationCap
} from "lucide-react";
import ArcoPortusHeader from "@/components/arco-portus/Header";
import ArcoPortusFooter from "@/components/arco-portus/Footer";
import HeroCarousel from "@/components/arco-portus/HeroCarousel";

const ArcoPortusHome = () => {
  const solutions = [
    {
      title: "Dashboards",
      icon: BarChart3,
      description: "Visualização de dados e relatórios",
      action: "Acessar",
      href: "/arco-portus/dashboard",
      featured: true
    },
    {
      title: "ARESP",
      icon: ExternalLink,
      description: "Acesso ao sistema ARESP",
      action: "Acessar",
      href: "#",
      external: true
    },
    {
      title: "DIAGNÓSTICO DO EAR",
      icon: FileText,
      description: "Estudo de Avaliação de Riscos",
      action: "Acessar",
      href: "/arco-portus/diagnostico-ear"
    },
    {
      title: "NORMAS E PROCEDIMENTOS",
      icon: BookOpen,
      description: "Documentação normativa",
      action: "Acessar",
      href: "/arco-portus/normas-procedimentos"
    },
    {
      title: "DOCUMENTOS E REGISTROS",
      icon: FileText,
      description: "Gestão documental",
      action: "Acessar",
      href: "/arco-portus/documentos-registros"
    },
    {
      title: "GESTÃO DE ROTINAS OPERACIONAIS",
      icon: Settings,
      description: "Controle operacional",
      action: "Acessar",
      href: "#",
      external: true
    },
    {
      title: "LEGISLAÇÃO",
      icon: Shield,
      description: "Base legal e normativa",
      action: "Acessar",
      href: "/arco-portus/legislacao"
    },
    {
      title: "SISTEMA DE CFTV",
      icon: Camera,
      description: "Monitoramento e segurança",
      action: "Acessar",
      href: "/arco-portus/sistema-cftv"
    },
    {
      title: "GESTÃO DE ROTINAS OPERACIONAIS",
      icon: Settings,
      description: "Operações portuárias",
      action: "Acessar",
      href: "/arco-portus/gestao-rotinas"
    },
    {
      title: "TREINAMENTOS",
      icon: GraduationCap,
      description: "Capacitação e certificação",
      action: "Acessar",
      href: "/arco-portus/treinamentos",
      gray: true
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      <ArcoPortusHeader />

      <main className="container mx-auto px-4 py-8">
        {/* Hero Carousel */}
        <div className="mb-8">
          <HeroCarousel />
        </div>

        {/* Área do Cliente */}
        <div className="bg-secondary text-white text-center py-4 rounded-t-lg">
          <h2 className="text-xl font-bold">ÁREA DO CLIENTE</h2>
        </div>

        {/* Solutions Grid */}
        <div className="bg-white border border-border rounded-b-lg p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {solutions.map((solution, index) => {
              const IconComponent = solution.icon;
              return (
                <Card
                  key={index}
                  className={`hover-scale transition-all duration-200 ${solution.featured ? 'bg-secondary text-white' :
                    solution.gray ? 'bg-muted' : 'bg-secondary/10'
                    }`}
                >
                  <CardContent className="p-6 text-center space-y-4">
                    <div className={`w-16 h-16 mx-auto rounded-lg flex items-center justify-center ${solution.featured ? 'bg-white/20' : 'bg-secondary/20'
                      }`}>
                      <IconComponent className={`h-8 w-8 ${solution.featured ? 'text-white' : 'text-secondary'
                        }`} />
                    </div>

                    <div>
                      <h3 className={`font-bold text-sm mb-2 ${solution.featured ? 'text-white' : 'text-foreground'
                        }`}>
                        {solution.title}
                      </h3>
                      <p className={`text-xs mb-4 ${solution.featured ? 'text-white/80' : 'text-muted-foreground'
                        }`}>
                        {solution.description}
                      </p>
                    </div>

                    <Button
                      className={`w-full ${solution.featured
                        ? 'bg-white text-secondary hover:bg-white/90'
                        : 'btn-primary'
                        }`}
                      onClick={() => {
                        if (solution.external) {
                          window.open(solution.href, '_blank');
                        } else {
                          window.location.href = solution.href;
                        }
                      }}
                    >
                      {solution.action}
                      {solution.external && <ExternalLink className="h-4 w-4 ml-2" />}
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </main>

      <ArcoPortusFooter />
    </div>
  );
};

export default ArcoPortusHome;