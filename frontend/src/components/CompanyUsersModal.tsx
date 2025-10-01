import { useState } from "react";
import { X, Users, Plus, Trash2, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  isAssigned: boolean;
}

interface CompanyUsersModalProps {
  company: any;
  onClose: () => void;
  onSave: (assignedUsers: string[]) => void;
}

// Mock users data
const mockUsers = [
  { id: "1", name: "João Silva", email: "joao@email.com", role: "ADMIN", isAssigned: true },
  { id: "2", name: "Maria Santos", email: "maria@email.com", role: "USER", isAssigned: true },
  { id: "3", name: "Pedro Costa", email: "pedro@email.com", role: "USER", isAssigned: false },
  { id: "4", name: "Ana Oliveira", email: "ana@email.com", role: "USER", isAssigned: false },
];

export function CompanyUsersModal({ company, onClose, onSave }: CompanyUsersModalProps) {
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleUserToggle = (userId: string) => {
    setUsers(prev => prev.map(user =>
      user.id === userId ? { ...user, isAssigned: !user.isAssigned } : user
    ));
  };

  const handleSave = () => {
    const assignedUserIds = users.filter(user => user.isAssigned).map(user => user.id);
    onSave(assignedUserIds);
    onClose();
  };

  const getRoleBadge = (role: string) => {
    const roleColors = {
      ADMIN: "bg-blue-500/20 text-blue-600 border-blue-500/30",
      USER: "bg-green-500/20 text-green-600 border-green-500/30",
    };
    
    return (
      <Badge className={roleColors[role as keyof typeof roleColors] || "bg-gray-500/20 text-gray-600"}>
        {role}
      </Badge>
    );
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="glass-card border-white/10 max-w-2xl max-h-[80vh] overflow-hidden">
        <DialogHeader className="border-b border-white/10 pb-4">
          <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent flex items-center gap-3">
            <Users className="h-6 w-6 text-primary" />
            Gerenciar Usuários - {company?.name}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 overflow-y-auto max-h-[50vh] pr-2">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Buscar usuários..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 glass-input"
            />
          </div>

          {/* Users List */}
          <div className="space-y-3">
            {filteredUsers.map((user) => (
              <div
                key={user.id}
                className="flex items-center justify-between p-4 rounded-lg border border-white/10 bg-card/50 hover:bg-card/70 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <Checkbox
                    checked={user.isAssigned}
                    onCheckedChange={() => handleUserToggle(user.id)}
                    className="border-white/30"
                  />
                  <div>
                    <div className="font-medium">{user.name}</div>
                    <div className="text-sm text-muted-foreground">{user.email}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {getRoleBadge(user.role)}
                  {user.isAssigned && (
                    <Badge variant="outline" className="bg-success/20 text-success border-success/30">
                      Atribuído
                    </Badge>
                  )}
                </div>
              </div>
            ))}
          </div>

          {filteredUsers.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              Nenhum usuário encontrado
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex justify-between pt-6 border-t border-white/10">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Users className="h-4 w-4" />
            {users.filter(u => u.isAssigned).length} usuários atribuídos
          </div>
          
          <div className="flex gap-3">
            <Button variant="outline" onClick={onClose} className="hover-lift">
              Cancelar
            </Button>
            <Button onClick={handleSave} className="gradient-primary hover-lift">
              Salvar Alterações
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}