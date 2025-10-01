// src/pages/CompanyManagement.tsx

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import { fetchCompanies } from "@/services/companyService"; // Verifique se o caminho está correto

import { Search, Plus, Building2, Edit2, Trash2, MoreHorizontal, Users, Settings, ArrowLeft, Loader2, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { CompanyForm } from "@/components/CompanyForm";
import { CompanyUsersModal } from "@/components/CompanyUsersModal";
import { CompanySettingsModal } from "@/components/CompanySettingsModal";
import Header from "@/components/Header";

// Seu objeto de nomes de serviço (mantido)
const serviceNames = {
  "arco-portus": "Arco Portus",
  "accia": "ACCIA",
  "guardcontrol": "GuardControl",
  "arcoview": "ArcoView",
  "arcomoki": "ArcoMoki",
  "unicasp": "UNICASP"
};

export default function CompanyManagement() {
  const { user } = useAuth(); // Perfeito, já estamos pegando o usuário logado
  const [searchTerm, setSearchTerm] = useState("");
  const [isCompanyFormOpen, setIsCompanyFormOpen] = useState(false);
  const [editingCompany, setEditingCompany] = useState(null); // Renomeado para mais clareza
  const [isUsersModalOpen, setIsUsersModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [companyForModal, setCompanyForModal] = useState(null); // Estado para os outros modais

  // --- A MÁGICA ACONTECE AQUI ---
  // Trocamos seu 'useState(mockCompanies)' por esta chamada de API real.
  const { data: companies, isLoading, isError } = useQuery({
    queryKey: ['companies'], // Um ID para o React Query saber o que ele está buscando
    queryFn: fetchCompanies  // A função que executa a chamada (do seu companyService.ts)
  });

  const filteredCompanies = companies?.filter(company =>
    company.name.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const handleEditCompany = (company: any) => {
    setEditingCompany(company);
    setIsCompanyFormOpen(true);
  };

  const handleAddCompany = () => {
    setEditingCompany(null); // Garante que o formulário estará vazio
    setIsCompanyFormOpen(true);
  };

  const handleManageUsers = (company: any) => {
    setCompanyForModal(company);
    setIsUsersModalOpen(true);
  };

  const handleSettings = (company: any) => {
    setCompanyForModal(company);
    setIsSettingsModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      <Header />

      <main className="container mx-auto px-6 py-8">
        {/* Header Section */}
        <div className="glass-card rounded-xl p-6 mb-8 border border-white/10">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold">Gestão de Empresas</h1>
              <p className="text-muted-foreground mt-2">
                Gerencie empresas, serviços contratados e identidade visual
              </p>
            </div>
            <div className="flex gap-3">
              <Button onClick={() => window.location.href = '/admin/users'} variant="outline">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Voltar para Usuários
              </Button>
              {/* Condicional para o botão "Nova Empresa" */}
              {user && user.role === 'SUPER_ADMIN' && (
                <Button onClick={handleAddCompany} className="gradient-primary hover-lift">
                  <Plus className="mr-2 h-4 w-4" />
                  Nova Empresa
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Search Section (sem alterações) */}
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
            <CardTitle>Empresas ({filteredCompanies.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {/* Tratamento de Loading */}
            {isLoading && (
              <div className="flex items-center justify-center py-10">
                <Loader2 className="h-6 w-6 animate-spin mr-3" />
                Carregando empresas...
              </div>
            )}
            {/* Tratamento de Erro */}
            {isError && (
              <div className="flex items-center justify-center py-10 text-destructive">
                <AlertTriangle className="h-6 w-6 mr-3" />
                Ocorreu um erro ao buscar os dados. Verifique a API.
              </div>
            )}
            {/* Exibição da Tabela */}
            {!isLoading && !isError && (
              <div className="rounded-md border border-white/10 overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Empresa</TableHead>
                      <TableHead>Serviços Contratados</TableHead>
                      <TableHead>Usuários</TableHead>
                      <TableHead>Criado em</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredCompanies.map((company) => (
                      <TableRow key={company.id}>
                        <TableCell>{company.name}</TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {company.services?.map((serviceId: string) => (
                              <Badge key={serviceId} variant="secondary">
                                {serviceNames[serviceId as keyof typeof serviceNames]}
                              </Badge>
                            ))}
                          </div>
                        </TableCell>
                        <TableCell>{company.usersCount} usuários</TableCell>
                        <TableCell>{new Date(company.createdAt).toLocaleDateString('pt-BR')}</TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0"><MoreHorizontal className="h-4 w-4" /></Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleEditCompany(company)}>Editar</DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleManageUsers(company)}>Gerenciar Usuários</DropdownMenuItem>
                              {/* Lógica para deleção aqui depois */}
                              <DropdownMenuItem className="text-destructive">Remover</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </main>

      {/* Company Form Modal */}
      {isCompanyFormOpen && (
        <CompanyForm
          company={editingCompany}
          onClose={() => setIsCompanyFormOpen(false)}
        />
      )}

      {/* Outros Modais */}
      {isUsersModalOpen && <CompanyUsersModal company={companyForModal} onClose={() => setIsUsersModalOpen(false)} onSave={() => { }} />}
      {isSettingsModalOpen && <CompanySettingsModal company={companyForModal} onClose={() => setIsSettingsModalOpen(false)} onSave={() => { }} />}

      {/* Footer */}
      <footer className="py-8 text-center text-sm text-muted-foreground border-t border-border/50">
        <div className="container mx-auto">
          © 2023 Arco Consultoria em Segurança - Todos os direitos reservados.
        </div>
      </footer>
    </div>
  );
}