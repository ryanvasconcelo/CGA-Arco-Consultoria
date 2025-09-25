import { useState } from "react";
import { Search, Plus, Building2, Edit2, Trash2, MoreHorizontal, Users, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CompanyForm } from "../components/CompanyForm";
import Header from "../components/Header";

// Mock data para demonstração
const mockCompanies = [
  {
    id: "1",
    name: "Porto Chibatão S.A.",
    logoUrl: "/placeholder-logo.png",
    services: ["arco-portus", "guardcontrol", "arcoview"],
    usersCount: 15,
    createdAt: "2023-01-15",
    customColors: {
      primary: "#0066cc",
      secondary: "#1f2937"
    }
  },
  {
    id: "2",
    name: "Empresa Marítima Ltda",
    logoUrl: "/placeholder-logo.png",
    services: ["arco-portus", "accia"],
    usersCount: 8,
    createdAt: "2023-03-22",
    customColors: {
      primary: "#059669",
      secondary: "#1f2937"
    }
  }
];

const serviceNames = {
  "arco-portus": "Arco Portus",
  "accia": "ACCIA",
  "guardcontrol": "GuardControl",
  "arcoview": "ArcoView",
  "arcomoki": "ArcoMoki",
  "unicasp": "UNICASP"
};

export default function CompanyManagement() {
  const [companies, setCompanies] = useState(mockCompanies);
  const [searchTerm, setSearchTerm] = useState("");
  const [isCompanyFormOpen, setIsCompanyFormOpen] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState(null);

  const filteredCompanies = companies.filter(company =>
    company.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEditCompany = (company: any) => {
    setSelectedCompany(company);
    setIsCompanyFormOpen(true);
  };

  const handleAddCompany = () => {
    setSelectedCompany(null);
    setIsCompanyFormOpen(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      <Header />

      <main className="container mx-auto px-6 py-8">
        {/* Header Section */}
        <div className="glass-card rounded-xl p-6 mb-8 border border-white/10">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
                Gestão de Empresas
              </h1>
              <p className="text-muted-foreground mt-2">
                Gerencie empresas, serviços contratados e identidade visual
              </p>
            </div>
            <Button onClick={handleAddCompany} className="gradient-primary hover-lift">
              <Plus className="mr-2 h-4 w-4" />
              Nova Empresa
            </Button>
          </div>
        </div>

        {/* Search Section */}
        <Card className="mb-6 glass-card border-white/10">
          <CardHeader>
            <CardTitle className="text-lg">Buscar Empresas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Buscar por nome da empresa..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 glass-input"
              />
            </div>
          </CardContent>
        </Card>

        {/* Companies Table */}
        <Card className="glass-card border-white/10">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              Empresas ({filteredCompanies.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border border-white/10 overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-muted/50">
                    <TableHead>Empresa</TableHead>
                    <TableHead>Serviços Contratados</TableHead>
                    <TableHead>Usuários</TableHead>
                    <TableHead>Criado em</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCompanies.map((company) => (
                    <TableRow key={company.id} className="hover:bg-muted/30 transition-colors">
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg border-2 border-border overflow-hidden">
                            <img
                              src={company.logoUrl}
                              alt={`${company.name} logo`}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div>
                            <div className="font-medium">{company.name}</div>
                            <div className="flex items-center gap-2 mt-1">
                              <div
                                className="w-3 h-3 rounded-full"
                                style={{ backgroundColor: company.customColors.primary }}
                              />
                              <div
                                className="w-3 h-3 rounded-full"
                                style={{ backgroundColor: company.customColors.secondary }}
                              />
                              <span className="text-xs text-muted-foreground">Cores personalizadas</span>
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {company.services.map((serviceId) => (
                            <Badge key={serviceId} variant="secondary" className="text-xs">
                              {serviceNames[serviceId as keyof typeof serviceNames]}
                            </Badge>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4 text-muted-foreground" />
                          <span>{company.usersCount} usuários</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          {new Date(company.createdAt).toLocaleDateString('pt-BR')}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0 hover:bg-muted/50">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="glass-card border-white/10">
                            <DropdownMenuItem onClick={() => handleEditCompany(company)}>
                              <Edit2 className="mr-2 h-4 w-4" />
                              Editar
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Users className="mr-2 h-4 w-4" />
                              Gerenciar Usuários
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Settings className="mr-2 h-4 w-4" />
                              Configurações
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-destructive">
                              <Trash2 className="mr-2 h-4 w-4" />
                              Remover
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </main>

      {/* Company Form Modal */}
      {isCompanyFormOpen && (
        <CompanyForm
          company={selectedCompany}
          onClose={() => setIsCompanyFormOpen(false)}
          onSubmit={(companyData) => {
            console.log("Company data:", companyData);
            setIsCompanyFormOpen(false);
          }}
        />
      )}
    </div>
  );
}