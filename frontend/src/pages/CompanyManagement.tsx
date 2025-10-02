// src/pages/CompanyManagement.tsx

import { useState } from "react";
import { useQuery, useMutation, useQueryClient, keepPreviousData } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import { fetchCompanies, createCompany, updateCompany, deleteCompany } from "@/services/companyService"; // Adicionado deleteCompany
import { toast } from "sonner";

import { Search, Plus, Building2, Edit2, Trash2, MoreHorizontal, Users, Settings, ArrowLeft, Loader2, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { CompanyForm } from "@/components/CompanyForm";
import { CompanySettingsModal } from "@/components/CompanySettingsModal";
import { CompanyUsersModal } from "@/components/CompanyUsersModal";
import Header from "@/components/Header";
import { SimplePagination } from "@/components/SimplePagination";

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
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const [isCompanyFormOpen, setIsCompanyFormOpen] = useState(false);
  const [editingCompany, setEditingCompany] = useState(null); // Renomeado para mais clareza
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [isUsersModalOpen, setIsUsersModalOpen] = useState(false);
  const [companyForModal, setCompanyForModal] = useState(null); // Estado para os outros modais
  const [companyToDelete, setCompanyToDelete] = useState<any | null>(null);
  const queryClient = useQueryClient();

  const { data, isLoading, isError } = useQuery({
    queryKey: ['companies', page, pageSize],
    queryFn: () => fetchCompanies(page, pageSize),
    placeholderData: keepPreviousData,
  });

  const companies = data?.data || [];
  const totalCount = data?.totalCount || 0;

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const { mutate: createCompanyMutate, isPending: isCreating } = useMutation({
    mutationFn: createCompany,
    onSuccess: () => {
      toast.success("Empresa criada com sucesso!");
      queryClient.invalidateQueries({ queryKey: ['companies'] });
      setIsCompanyFormOpen(false);
    },
    onError: (error: any) => {
      toast.error("Falha ao criar empresa", { description: error.response?.data?.error });
    },
  });

  const { mutate: updateCompanyMutate, isPending: isUpdating } = useMutation({
    mutationFn: updateCompany,
    onSuccess: () => {
      toast.success("Empresa atualizada com sucesso!");
      queryClient.invalidateQueries({ queryKey: ['companies'] });
      setIsCompanyFormOpen(false);
    },
    onError: (error: any) => {
      toast.error("Falha ao atualizar empresa", { description: error.response?.data?.error });
    },
  });

  const { mutate: deleteCompanyMutate, isPending: isDeleting } = useMutation({
    mutationFn: deleteCompany,
    onSuccess: () => {
      toast.success("Empresa removida com sucesso!");
      queryClient.invalidateQueries({ queryKey: ['companies'] });
      setCompanyToDelete(null);
    },
    onError: (error: any) => {
      toast.error("Falha ao remover empresa", {
        description: error.response?.data?.error || "Ocorreu um erro inesperado.",
      });
      setCompanyToDelete(null);
    },
  });

  const handleFormSubmit = (companyData: any) => {
    if (editingCompany) {
      updateCompanyMutate({ id: editingCompany.id, companyData });
    } else {
      createCompanyMutate(companyData);
    }
  };

  const handleSettingsSave = (settings: any) => {
    if (companyForModal) {
      // Usamos a mesma mutação de update, mas enviamos apenas os serviços
      updateCompanyMutate({ id: companyForModal.id, companyData: { services: JSON.stringify(settings.services) } });
    }
  };

  const formatCpfCnpj = (value: string) => {
    if (!value) return value;
    const onlyNums = value.replace(/[^\d]/g, '');

    if (onlyNums.length <= 11) {
      return onlyNums
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
    }
    return onlyNums
      .slice(0, 14)
      .replace(/(\d{2})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1/$2')
      .replace(/(\d{4})(\d{1,2})$/, '$1-$2');
  };

  // A filtragem agora é feita no backend, então este useMemo não é mais necessário para a paginação.
  // Mantemos a variável para consistência, mas a lógica de filtro real está na query.
  const filteredCompanies = companies.filter(company =>
    company.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEditCompany = (company: any) => {
    setEditingCompany(company);
    setIsCompanyFormOpen(true);
  };

  const handleAddCompany = () => {
    setEditingCompany(null); // Garante que o formulário estará vazio
    setIsCompanyFormOpen(true);
  };

  const handleSettings = (company: any) => {
    setCompanyForModal(company);
    setIsSettingsModalOpen(true);
  };

  const handleManageUsers = (company: any) => {
    setCompanyForModal(company);
    setIsUsersModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      <Header />

      <main className="container mx-auto px-6 py-8">
        {/* Header Section */}
        <div className="glass-card rounded-xl p-6 mb-8 border border-white/10">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary-hover bg-clip-text text-transparent">Gestão de Empresas</h1>
              <p className="text-muted-foreground mt-2">
                Gerencie empresas, serviços contratados e identidade visual
              </p>
            </div>
            <div className="flex gap-3">
              <Button onClick={() => window.location.href = '/admin/users'} variant="outline" className="border-border hover:bg-muted/50">
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
            <CardTitle className="text-xl font-semibold">Buscar Empresas</CardTitle>
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
              Empresas ({totalCount})
            </CardTitle>
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
                      <TableHead className="w-[35%]">Empresa</TableHead>
                      <TableHead className="text-center">Serviços Contratados</TableHead>
                      <TableHead className="text-center">Usuários</TableHead>
                      <TableHead className="text-center">Criado em</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredCompanies.map((company) => (
                      <TableRow key={company.id} className="hover:bg-muted/30 transition-colors">
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg border-2 border-border overflow-hidden flex-shrink-0">
                              {company.logoUrl ? (
                                <img
                                  src={`${import.meta.env.VITE_API_BASE_URL}${company.logoUrl}`}
                                  alt={`${company.name} logo`}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full bg-muted flex items-center justify-center">
                                  <Building2 className="h-5 w-5 text-muted-foreground" />
                                </div>
                              )}
                            </div>
                            <div>
                              <div className="font-medium">{company.name}</div>
                              <div className="text-xs text-muted-foreground">{formatCpfCnpj(company.cnpj)}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-center">
                          {company.products && company.products.length > 0 ? (
                            <div className="flex flex-wrap gap-1 max-w-xs mx-auto align-center justify-center">
                              {company.products.map((p: any) => (
                                <Badge key={p.productId} variant="default" className="text-xs justify-center">
                                  {p.product.name}
                                </Badge>
                              ))}
                            </div>
                          ) : (
                            <span className="text-xs text-muted-foreground italic">Nenhum serviço</span>
                          )}
                        </TableCell>
                        <TableCell className="text-center">
                          <div className="flex items-center justify-center gap-2">
                            <Users className="h-4 w-4 text-muted-foreground" />
                            <span>{company.usersCount} {company.usersCount === 1 ? 'usuário' : 'usuários'}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-center">
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
                              <DropdownMenuItem onClick={() => handleManageUsers(company)}>
                                <Users className="mr-2 h-4 w-4" />
                                Ver Usuários
                              </DropdownMenuItem>
                              {/* Apenas SUPER_ADMIN pode ver as configurações */}
                              {user?.role === 'SUPER_ADMIN' && (
                                <DropdownMenuItem onClick={() => handleSettings(company)}>
                                  <Settings className="mr-2 h-4 w-4" />
                                  Configurações
                                </DropdownMenuItem>
                              )}
                              {user?.role === 'SUPER_ADMIN' && (
                                <DropdownMenuItem
                                  className="text-[hsl(var(--error))] focus:text-[hsl(var(--error))] focus:bg-[hsl(var(--error-light))]"
                                  onClick={() => setCompanyToDelete(company)}
                                >
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  Remover
                                </DropdownMenuItem>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
            {!isLoading && !isError && companies.length > 0 && (
              <SimplePagination
                page={page}
                pageSize={pageSize}
                totalCount={totalCount}
                onPageChange={handlePageChange}
              />
            )}
          </CardContent>
        </Card>
      </main>

      {/* Company Form Modal */}
      {isCompanyFormOpen && (
        <CompanyForm
          company={editingCompany}
          onClose={() => setIsCompanyFormOpen(false)}
          onSubmit={handleFormSubmit}
        />
      )}

      {/* Outros Modais */}
      {isSettingsModalOpen && <CompanySettingsModal company={companyForModal} onClose={() => setIsSettingsModalOpen(false)} onSave={handleSettingsSave} />}
      {isUsersModalOpen && <CompanyUsersModal company={companyForModal} onClose={() => setIsUsersModalOpen(false)} />}

      {/* Modal de confirmação para deletar empresa */}
      <AlertDialog open={!!companyToDelete} onOpenChange={() => setCompanyToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Você tem certeza absoluta?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. Isso removerá permanentemente a empresa{' '}
              <span className="font-bold">{companyToDelete?.name}</span> e todos os seus dados associados, incluindo usuários e logs de auditoria.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => companyToDelete && deleteCompanyMutate(companyToDelete.id)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={isDeleting}
            >
              {isDeleting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Removendo...</> : "Sim, remover esta empresa"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Footer */}
      <footer className="py-8 text-center text-sm text-muted-foreground border-t border-border/50">
        <div className="container mx-auto">
          © 2023 Arco Consultoria em Segurança - Todos os direitos reservados.
        </div>
      </footer>
    </div>
  );
}