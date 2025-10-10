import { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient, keepPreviousData } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import { fetchUsers, deleteUser } from "@/services/userService";
import { fetchCompanies } from "@/services/companyService";
import { Search, Plus, MoreHorizontal, Eye, Edit2, Trash2, UserPlus, Building2, FileText, Loader2, AlertTriangle } from "lucide-react";
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
import { EnhancedUserForm } from "@/components/EnhancedUserForm";
import Header from "@/components/Header";
import { SimplePagination } from "@/components/SimplePagination";

const roleLabels: { [key: string]: string } = {
  SUPER_ADMIN: "Super Admin",
  ADMIN: "Administrador",
  USER: "Usuário"
};

const roleColors: { [key: string]: string } = {
  SUPER_ADMIN: "bg-[hsl(var(--role-super-admin))]",
  ADMIN: "bg-[hsl(var(--role-admin))]",
  USER: "bg-[hsl(var(--role-user))]"
};


export default function UserManagement() {
  const { user: currentUser, loading: authLoading } = useAuth();
  const queryClient = useQueryClient();

  if (authLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p>Carregando sessão do usuário...</p>
      </div>
    );
  }

  // A query de companies continua, mas só para o SUPER_ADMIN
  const isSuperAdmin = currentUser?.role === 'SUPER_ADMIN';
  const isAdmin = currentUser?.role === 'ADMIN';

  // Query para SUPER_ADMIN: Busca todas as empresas para o formulário.
  const { data: companiesForForm, isLoading: isLoadingCompanies } = useQuery({
    queryKey: ['all-companies-for-form'],
    queryFn: () => fetchCompanies(1, 9999), // Busca até 9999 empresas
    enabled: isSuperAdmin, // Só executa se for SUPER_ADMIN
  });

  // Query específica para ADMIN: Busca os dados completos da SUA empresa incluindo produtos.
  const { data: adminCompanyData, isLoading: isLoadingAdminCompany } = useQuery({
    queryKey: ['admin-company-details', currentUser?.companyId],
    queryFn: () => fetchCompanies(1, 1), // A API já filtra pelo companyId do admin
    enabled: isAdmin && !!currentUser?.companyId, // Só executa se for ADMIN com uma empresa
  });

  // Extrai a empresa do admin dos dados retornados
  const adminCompanyForForm = useMemo(() => {
    if (isAdmin && adminCompanyData?.data && adminCompanyData.data.length > 0) {
      return adminCompanyData.data[0];
    }
    return null;
  }, [isAdmin, adminCompanyData]);

  // Monta a lista de empresas disponíveis para o formulário de forma dinâmica.
  const availableCompaniesForForm = isSuperAdmin
    ? companiesForForm?.data
    : (isAdmin && adminCompanyForForm ? [adminCompanyForForm] : []);

  // Controla o estado de carregamento dependendo do tipo de usuário.
  const isLoadingFormDependencies = isSuperAdmin ? isLoadingCompanies : isLoadingAdminCompany;

  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [isUserFormOpen, setIsUserFormOpen] = useState(false);
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const [selectedUser, setSelectedUser] = useState(null);
  const [userToDelete, setUserToDelete] = useState<any | null>(null);

  const { data, isLoading: isLoadingUsers, isError: isUsersError } = useQuery({
    queryKey: ['users', page, pageSize],
    queryFn: () => fetchUsers(page, pageSize),
    placeholderData: keepPreviousData,
  });

  const users = data?.data || [];
  const totalCount = data?.totalCount || 0;

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const deleteUserMutation = useMutation({
    mutationFn: (id: string) => deleteUser(id), // <-- CORREÇÃO AQUI
    onSuccess: () => {
      console.log("Usuário removido com sucesso!");
      queryClient.invalidateQueries({ queryKey: ['users'] });
      setUserToDelete(null); // Fecha o diálogo de confirmação
    },
    onError: (error) => {
      console.error("Erro ao remover usuário:", error);
      // Idealmente, mostrar um toast de erro para o usuário aqui.
      setUserToDelete(null);
    }
  });

  const filteredUsers = useMemo(() => users.filter(user => {
    const companyName = user.company?.name || '';
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      companyName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === "all" || user.role === roleFilter;
    const matchesStatus = statusFilter === "all" || user.status === statusFilter;
    return matchesSearch && matchesRole && matchesStatus;
  }), [users, searchTerm, roleFilter, statusFilter]);

  const handleEditUser = (user: any) => {
    setSelectedUser(user);
    setIsUserFormOpen(true);
  };

  const handleAddUser = () => {
    setSelectedUser(null);
    setIsUserFormOpen(true);
  };

  const handleToggleStatus = (userId: string) => {
    console.log("Toggle status para o usuário:", userId);
  };

  const getStatusBadge = (status: string) => {
    return status === "ACTIVE"
      ? <Badge className="bg-[hsl(var(--success-light))] text-[hsl(var(--success))] border-[hsl(var(--success))]/30 font-medium">Ativo</Badge>
      : <Badge className="bg-[hsl(var(--error-light))] text-[hsl(var(--error))] border-[hsl(var(--error))]/30 font-medium">Inativo</Badge>;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      <Header />

      <main className="container mx-auto px-6 py-8">
        <div className="glass-card rounded-xl p-6 mb-8 border border-white/10">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary-hover bg-clip-text text-transparent">Gestão de Usuários</h1>
              <p className="text-muted-foreground mt-2">Gerencie usuários da sua empresa com controle total de permissões</p>
            </div>
            <div className="flex gap-3">
              <Button onClick={() => window.location.href = '/admin/audit'} variant="outline" className="hover-lift border-border hover:bg-muted/50">
                <FileText className="mr-2 h-4 w-4" />
                Auditoria
              </Button>
              <Button onClick={() => window.location.href = '/admin/companies'} variant="outline" className="hover-lift border-border hover:bg-muted/50">
                <Building2 className="mr-2 h-4 w-4" />
                Empresas
              </Button>
              {currentUser && (currentUser.role === 'SUPER_ADMIN' || currentUser.role === 'ADMIN') && (
                <Button
                  onClick={handleAddUser}
                  className="gradient-primary hover-lift"
                  disabled={isLoadingFormDependencies}
                >
                  <UserPlus className="mr-2 h-4 w-4" />
                  {isLoadingFormDependencies ? "Carregando..." : "Novo Usuário"}
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Filters and Table continue here, no changes needed in the JSX below this point */}
        <Card className="glass-card border-white/10">
          <CardHeader>
            <CardTitle className="text-xl font-semibold">Usuários ({totalCount})</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoadingUsers && <div className="text-center py-4">Carregando usuários...</div>}
            {isUsersError && <div className="text-center py-4 text-red-500">Erro ao carregar usuários.</div>}
            {!isLoadingUsers && !isUsersError && (
              <div className="rounded-md border border-white/10 overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="hover:bg-muted/50">
                      <TableHead>Usuário</TableHead>
                      <TableHead>Empresa</TableHead>
                      <TableHead>Papel</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Criado em</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUsers.map((user) => (
                      <TableRow key={user.id} className="hover:bg-muted/30 transition-colors">
                        <TableCell>
                          <div>
                            <div className="font-medium">{user.name}</div>
                            <div className="text-sm text-muted-foreground">{user.email}</div>
                          </div>
                        </TableCell>
                        <TableCell>{user.company?.name || 'N/A'}</TableCell>
                        <TableCell>
                          <Badge className={`${roleColors[user.role]} text-white border-0`}>
                            {roleLabels[user.role]}
                          </Badge>
                        </TableCell>
                        <TableCell>{getStatusBadge(user.status)}</TableCell>
                        <TableCell>{new Date(user.createdAt).toLocaleDateString('pt-BR')}</TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0 hover:bg-muted/50">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="glass-card border-white/10">
                              <DropdownMenuItem onClick={() => handleEditUser(user)} className="cursor-pointer">
                                <Edit2 className="mr-2 h-4 w-4" />
                                Editar
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                className="text-destructive cursor-pointer"
                                // onSelect previne o fechamento imediato do menu, permitindo que o onClick
                                // abra o modal de confirmação sem problemas.
                                onSelect={(e) => e.preventDefault()}
                                onClick={() => setUserToDelete(user)}
                                disabled={deleteUserMutation.isPending || currentUser?.id === user.id}
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                {currentUser?.id === user.id ? "Não pode remover a si mesmo" : "Remover"}
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
            {!isLoadingUsers && !isUsersError && users.length > 0 && (
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

      {/* Enhanced User Form Modal com Props Dinâmicas */}
      {isUserFormOpen && (
        <EnhancedUserForm
          user={selectedUser}
          currentUser={currentUser}
          availableCompanies={availableCompaniesForForm || []}
          adminCompany={adminCompanyForForm}
          onClose={() => setIsUserFormOpen(false)}
        />
      )}

      <AlertDialog open={!!userToDelete} onOpenChange={() => setUserToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. Isso removerá permanentemente o usuário
              <span className="font-bold"> {userToDelete?.name} </span>
              e todos os seus dados associados.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleteUserMutation.isPending}>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => userToDelete && deleteUserMutation.mutate(userToDelete.id)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={deleteUserMutation.isPending}
            >
              {deleteUserMutation.isPending ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Removendo...</> : "Sim, remover"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}