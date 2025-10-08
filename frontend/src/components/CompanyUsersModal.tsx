import { useQuery } from "@tanstack/react-query";
import { fetchUsers } from "@/services/userService";
import { Building2, Loader2, User, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";

interface CompanyUsersModalProps {
  company: any;
  onClose: () => void;
}

const roleLabels: { [key: string]: string } = {
  SUPER_ADMIN: "Super Admin",
  ADMIN: "Administrador",
  USER: "Usuário"
};

const roleColors: { [key: string]: string } = {
  SUPER_ADMIN: "bg-gradient-to-r from-[hsl(var(--role-super-admin-from))] to-[hsl(var(--role-super-admin-to))]",
  ADMIN: "bg-gradient-to-r from-[hsl(var(--role-admin-from))] to-[hsl(var(--role-admin-to))]",
  USER: "bg-gradient-to-r from-[hsl(var(--role-user-from))] to-[hsl(var(--role-user-to))]"
};

export function CompanyUsersModal({ company, onClose }: CompanyUsersModalProps) {
  // Usamos a função fetchUsers, mas passamos um filtro de companyId
  const { data, isLoading } = useQuery({
    queryKey: ['users', 'byCompany', company.id],
    // Assumindo que fetchUsers pode receber um filtro de companyId
    // Precisaremos ajustar o serviço e o backend para isso
    queryFn: () => fetchUsers(1, 999, company.id),
  });

  const users = data?.data || [];

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="glass-card border-white/10 max-w-4xl max-h-[90vh] flex flex-col">
        <DialogHeader className="border-b border-white/10 pb-4 flex-shrink-0">
          <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-primary to-primary-hover bg-clip-text text-transparent flex items-center gap-3">
            <User className="h-6 w-6 text-primary" />
            Usuários da Empresa: {company.name}
          </DialogTitle>
        </DialogHeader>

        <div className="flex-grow overflow-y-auto">
          {isLoading ? (
            <div className="flex items-center justify-center h-full">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead className="text-center">Papel</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user: any) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell className="text-center">
                      <Badge className={`${roleColors[user.role]} text-white border-0`}>
                        {roleLabels[user.role]}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
          {!isLoading && users.length === 0 && (
            <div className="text-center py-10 text-muted-foreground">
              Nenhum usuário encontrado para esta empresa.
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}