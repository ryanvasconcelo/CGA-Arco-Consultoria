import { useState, useEffect } from "react";
import { X, Save, UserPlus, Building2, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";

interface EnhancedUserFormProps {
  user?: any;
  currentUserRole: string;
  userCompany: string;
  availableCompanies?: any[];
  onClose: () => void;
  onSubmit: (userData: any) => void;
}

const availableServices = [
  { id: "arco-portus", name: "Arco Portus" },
  { id: "accia", name: "ACCIA" },
  { id: "guardcontrol", name: "GuardControl" },
  { id: "arcoview", name: "ArcoView" },
  { id: "arcomoki", name: "ArcoMoki" },
  { id: "unicasp", name: "UNICASP" }
];

export function EnhancedUserForm({
  user,
  currentUserRole,
  userCompany,
  availableCompanies = [],
  onClose,
  onSubmit
}: EnhancedUserFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "USER",
    status: "active",
    company: userCompany,
    services: [] as string[]
  });

  const isSuperAdmin = currentUserRole === "SUPER_ADMIN";
  const isAdmin = currentUserRole === "ADMIN";

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        role: user.role || "USER",
        status: user.status || "active",
        company: user.company || userCompany,
        services: user.services || []
      });
    }
  }, [user, userCompany]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleServiceToggle = (serviceId: string) => {
    setFormData(prev => ({
      ...prev,
      services: prev.services.includes(serviceId)
        ? prev.services.filter(id => id !== serviceId)
        : [...prev.services, serviceId]
    }));
  };

  const getRoleOptions = () => {
    if (isSuperAdmin) {
      return [
        { value: "USER", label: "Usuário" },
        { value: "ADMIN", label: "Administrador" },
        { value: "SUPER_ADMIN", label: "Super Admin" }
      ];
    } else if (isAdmin) {
      return [
        { value: "USER", label: "Usuário" },
        { value: "ADMIN", label: "Administrador" }
      ];
    }
    return [{ value: "USER", label: "Usuário" }];
  };

  const isEditing = !!user;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
      <Card className="w-full max-w-2xl glass-card border-white/10 animate-scale-in max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="text-xl font-semibold flex items-center gap-2">
            <UserPlus className="h-5 w-5 text-primary" />
            {isEditing ? "Editar Usuário" : "Novo Usuário"}
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose} className="h-8 w-8 p-0">
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Informações Pessoais */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Informações Pessoais</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome Completo</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleChange("name", e.target.value)}
                    placeholder="Digite o nome completo"
                    className="glass-input"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleChange("email", e.target.value)}
                    placeholder="usuario@empresa.com"
                    className="glass-input"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Empresa */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium flex items-center gap-2">
                <Building2 className="h-4 w-4" />
                Empresa
              </h3>

              {isSuperAdmin && availableCompanies.length > 0 && !isEditing ? (
                <div className="space-y-2">
                  <Label htmlFor="company">Empresa</Label>
                  <select
                    id="company"
                    value={formData.company}
                    onChange={(e) => handleChange("company", e.target.value)}
                    className="w-full px-3 py-2 rounded-md border border-input bg-background/50 backdrop-blur-sm"
                    required
                  >
                    {availableCompanies.map((company) => (
                      <option key={company.id} value={company.name}>
                        {company.name}
                      </option>
                    ))}
                  </select>
                </div>
              ) : (
                <div className="p-3 rounded-lg bg-muted/30 border border-border">
                  <div className="flex items-center gap-2">
                    <Building2 className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">{formData.company}</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {isEditing ? "A empresa não pode ser alterada" : "Empresa atual do usuário"}
                  </p>
                </div>
              )}
            </div>

            {/* Permissões */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium flex items-center gap-2">
                <Shield className="h-4 w-4" />
                Permissões e Acesso
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="role">Papel/Função</Label>
                  <select
                    id="role"
                    value={formData.role}
                    onChange={(e) => handleChange("role", e.target.value)}
                    className="w-full px-3 py-2 rounded-md border border-input bg-background/50 backdrop-blur-sm"
                    required
                  >
                    {getRoleOptions().map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <select
                    id="status"
                    value={formData.status}
                    onChange={(e) => handleChange("status", e.target.value)}
                    className="w-full px-3 py-2 rounded-md border border-input bg-background/50 backdrop-blur-sm"
                  >
                    <option value="active">Ativo</option>
                    <option value="inactive">Inativo</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Serviços */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Acesso aos Serviços</h3>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {availableServices.map((service) => (
                  <div key={service.id} className="flex items-center space-x-2 p-3 rounded-lg border border-border hover:bg-muted/30 transition-colors">
                    <Checkbox
                      id={service.id}
                      checked={formData.services.includes(service.id)}
                      onCheckedChange={() => handleServiceToggle(service.id)}
                    />
                    <Label
                      htmlFor={service.id}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {service.name}
                    </Label>
                  </div>
                ))}
              </div>

              <p className="text-xs text-muted-foreground">
                Selecione os serviços que este usuário poderá acessar. Os serviços devem estar contratados pela empresa.
              </p>
            </div>

            {!isEditing && (
              <div className="bg-primary/10 border border-primary/20 rounded-md p-3">
                <p className="text-sm text-primary font-medium mb-1">
                  Senha Temporária
                </p>
                <p className="text-xs text-muted-foreground">
                  Uma senha temporária será enviada por email. O usuário deverá alterá-la no primeiro acesso.
                </p>
              </div>
            )}

            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="flex-1"
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                className="flex-1 gradient-primary hover-lift"
              >
                <Save className="mr-2 h-4 w-4" />
                {isEditing ? "Salvar" : "Criar"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}