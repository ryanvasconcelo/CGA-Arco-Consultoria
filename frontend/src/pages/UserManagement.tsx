import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import { fetchUsers } from "@/services/userService";
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
import { EnhancedUserForm } from "@/components/EnhancedUserForm";
import Header from "@/components/Header";

const roleLabels: { [key: string]: string } = {
  SUPER_ADMIN: "Super Admin",
  ADMIN: "Administrador",
  USER: "Usuário"
};

const roleColors: { [key: string]: string } = {
  SUPER_ADMIN: "bg-gradient-to-r from-purple-500 to-pink-500",
  ADMIN: "bg-gradient-to-r from-blue-500 to-cyan-500",
  USER: "bg-gradient-to-r from-green-500 to-emerald-500"
};

export default function UserManagement() {
  const { user: currentUser, loading: authLoading } = useAuth();

  if (authLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p>Carregando sessão do usuário...</p>
      </div>
    );
  }

  // A query de companies continua, mas só para o SUPER_ADMIN
  const isSuperAdmin = currentUser?.role === 'SUPER_ADMIN';
  const { data: companiesForSuperAdmin } = useQuery({
    queryKey: ['all-companies'],
    queryFn: fetchCompanies,
    enabled: isSuperAdmin,
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [isUserFormOpen, setIsUserFormOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  // Query de usuários (agora nossa fonte principal de dados)
  const { data: users, isLoading: isLoadingUsers, isError: isUsersError } = useQuery({
    queryKey: ['users'],
    queryFn: fetchUsers,
  });

  const getCompaniesForForm = () => {
    if (isSuperAdmin) {
      return companiesForSuperAdmin; // SUPER ADMIN usa a lista completa
    }
    // ADMIN usa sua própria empresa, extraída da lista de usuários
    if (users && users.length > 0) {
      // Pega a primeira empresa da lista de usuários (já que o admin só vê a sua)
      const adminCompany = users[0].company;
      return adminCompany ? [adminCompany] : [];
    }
    return [];
  }

  const filteredUsers = users?.filter(user => {
    const companyName = user.company?.name || '';
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      companyName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === "all" || user.role === roleFilter;
    const matchesStatus = statusFilter === "all" || user.status === statusFilter;

    return matchesSearch && matchesRole && matchesStatus;
  }) || [];

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
      ? <Badge className="bg-success/20 text-success border-success/30">Ativo</Badge>
      : <Badge className="bg-destructive/20 text-destructive border-destructive/30">Inativo</Badge>;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      <Header />

      <main className="container mx-auto px-6 py-8">
        <div className="glass-card rounded-xl p-6 mb-8 border border-white/10">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold">Gestão de Usuários</h1>
              <p className="text-muted-foreground mt-2">Gerencie usuários da sua empresa com controle total de permissões</p>
            </div>
            <div className="flex gap-3">
              <Button onClick={() => window.location.href = '/admin/audit'} variant="outline" className="hover-lift">
                <FileText className="mr-2 h-4 w-4" />
                Auditoria
              </Button>
              <Button onClick={() => window.location.href = '/admin/companies'} variant="outline" className="hover-lift">
                <Building2 className="mr-2 h-4 w-4" />
                Empresas
              </Button>
              {currentUser && (currentUser.role === 'SUPER_ADMIN' || currentUser.role === 'ADMIN') && (
                <Button
                  onClick={handleAddUser}
                  className="gradient-primary hover-lift"
                  disabled={isSuperAdmin && (isLoadingCompanies || !companies)}
                >
                  <UserPlus className="mr-2 h-4 w-4" />
                  {isSuperAdmin && isLoadingCompanies ? "Carregando..." : "Novo Usuário"}
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Filters and Table continue here, no changes needed in the JSX below this point */}
        <Card className="glass-card border-white/10">
          <CardHeader>
            <CardTitle>Usuários ({filteredUsers.length})</CardTitle>
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
                              <DropdownMenuItem onClick={() => handleEditUser(user)}>
                                <Edit2 className="mr-2 h-4 w-4" />
                                Editar
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleToggleStatus(user.id)}>
                                <Eye className="mr-2 h-4 w-4" />
                                {user.status === "active" ? "Desativar" : "Ativar"}
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
            )}
          </CardContent>
        </Card>
      </main>

      {/* Enhanced User Form Modal com Props Dinâmicas */}
      {isUserFormOpen && (
        <EnhancedUserForm
          user={selectedUser}
          currentUser={currentUser}
          availableCompanies={getCompaniesForForm()} // <-- USA A NOVA FUNÇÃO
          onClose={() => setIsUserFormOpen(false)}
        />
      )}
    </div>
  );
}