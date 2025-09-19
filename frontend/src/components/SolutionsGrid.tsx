import { ExternalLink, Shield, BarChart3, Settings, Users, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import solutionsImage from "@/assets/solutions-image.jpg";

const solutions = [
  {
    title: "Accia",
    description: "Sistema de Gestão e Análise de Risco de Segurança Corporativa",
    icon: Shield,
    color: "from-blue-500 to-blue-600"
  },
  {
    title: "Guard Control",
    description: "Gestão e Controle de Equipamento e Operações de Segurança e Facilities em tempo real",
    icon: Settings,
    color: "from-green-500 to-green-600"
  },
  {
    title: "Arco View",
    description: "Solução de Monitoramento por Drones Automatizados",
    icon: BarChart3,
    color: "from-purple-500 to-purple-600"
  },
  {
    title: "Arcomoki",
    description: "Sistema de Formulários Eletrônicos para Gestão de Processos e Controle de Qualidade",
    icon: BookOpen,
    color: "from-orange-500 to-orange-600"
  },
  {
    title: "Unicasp",
    description: "Sua Plataforma de Educação Corporativa para Capacitação e Aprendizado de Equipes",
    icon: Users,
    color: "from-red-500 to-red-600"
  },
  {
    title: "Arco Porus",
    description: "Plataforma de Gerenciamento de Operações de Segurança Portuária e Controle de Acesso",
    icon: Shield,
    color: "from-teal-500 to-teal-600"
  }
];

const SolutionsGrid = () => {
  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-12 gap-12">
          {/* Left Side - Company Info */}
          <div className="lg:col-span-4 space-y-8">
            <div className="text-center lg:text-left">
              <div className="text-3xl font-bold mb-2">
                <span className="text-secondary">CGA</span>
              </div>
              <div className="text-sm text-muted-foreground mb-4">
                CENTRAL DE GESTÃO ARCO
              </div>
              <h2 className="heading-secondary mb-4">
                Gestão Unificada das Soluções
              </h2>
              <p className="text-corporate text-lg mb-6">
                <span className="text-primary font-semibold">de Segurança, Serviços</span>
                <br />
                <span className="text-primary font-semibold">e Treinamentos</span>
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
                <h3 className="text-2xl font-bold mb-2">Tudo em um</h3>
                <p className="text-primary text-3xl font-bold">Só Lugar!</p>
              </div>
            </div>
          </div>

          {/* Right Side - Solutions Grid */}
          <div className="lg:col-span-8">
            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
              {solutions.map((solution, index) => (
                <Card 
                  key={solution.title} 
                  className="corporate-card hover-lift group cursor-pointer animate-scale-in"
                  style={{animationDelay: `${index * 100}ms`}}
                >
                  <CardHeader className="pb-3">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${solution.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                      <solution.icon className="h-6 w-6 text-white" />
                    </div>
                    <CardTitle className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">
                      {solution.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <CardDescription className="text-corporate text-sm leading-relaxed">
                      {solution.description}
                    </CardDescription>
                    <Button className="w-full btn-primary group-hover:shadow-glow">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      ACESSAR
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Dashboards Section */}
            <div className="mt-8">
              <Card className="corporate-card bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20 hover-lift">
                <CardContent className="p-8">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-2xl font-bold text-foreground mb-2">
                        📊 Dashboards
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