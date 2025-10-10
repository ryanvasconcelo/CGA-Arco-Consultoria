import { useState, useEffect, useMemo } from "react";
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createUser, updateUser } from '@/services/userService';
import { fetchAllProducts } from '@/services/companyService';
import { toast } from "sonner";
import { X, Save, UserPlus, Building2, Shield, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface EnhancedUserFormProps {
  user?: any;
  currentUser: any;
  availableCompanies?: any[];
  adminCompany?: any | null; // Empresa do admin logado, com todos os dados (incluindo produtos)
  onClose: () => void;
}

export function EnhancedUserForm({
  user,
  currentUser,
  availableCompanies = [],
  adminCompany,
  onClose,
}: EnhancedUserFormProps) {
  // Busca todos os produtos do sistema dinamicamente
  const { data: allSystemServices = [], isLoading: isLoadingServices } = useQuery({
    queryKey: ['all-products'],
    queryFn: fetchAllProducts,
  });

  // Calcula o ID do Arco Portus dinamicamente
  const arcoPortusId = useMemo(() => {
    const service = allSystemServices.find((s: any) => s.name === "Arco Portus");
    return service ? service.id : "";
  }, [allSystemServices]);

  const [formData, setFormData] = useState({
    name: "", email: "", role: "USER", status: "ACTIVE", companyId: "",
    services: [] as string[],
    arcoPortusPermissions: {
      canViewDocuments: false, canEditDocuments: false, canDeleteDocuments: false,
      canAddDocuments: false, canViewCFTV: false, canViewLegislacao: false,
      canViewNormas: false, canViewDiagnostico: false, canViewRegisters: false,
      canViewDashboards: false,
    }
  });

  const isEditing = !!user;
  const isSuperAdmin = currentUser?.role === "SUPER_ADMIN";
  const isAdmin = currentUser?.role === "ADMIN";

  // CORREÇÃO: Cria a lista correta de empresas para usar no formulário
  const companiesForForm = useMemo(() => {
    if (isSuperAdmin) {
      return availableCompanies;
    }
    // Para ADMIN, garante que adminCompany está disponível
    if (isAdmin && adminCompany) {
      // Verifica se adminCompany já está em availableCompanies
      const isAdminCompanyInList = availableCompanies.some(c => c.id === adminCompany.id);
      if (!isAdminCompanyInList) {
        return [adminCompany];
      }
      return availableCompanies;
    }
    return availableCompanies;
  }, [isSuperAdmin, isAdmin, adminCompany, availableCompanies]);

  useEffect(() => {
    if (user) { // Se estiver editando um usuário existente
      // 1. Cria um objeto para representar o estado dos checkboxes, todos desligados por padrão.
      const initialPermissions = {
        canViewDocuments: false, canEditDocuments: false, canAddDocuments: false,
        canDeleteDocuments: false, canViewDiagnostico: false, canViewNormas: false,
        canViewRegisters: false, canViewDashboards: false, canViewLegislacao: false,
        canViewCFTV: false,
      };

      // 2. Cria um "mapa" para traduzir a permissão do banco (ex: 'VIEW_DOCUMENTS') para a chave do formulário (ex: 'canViewDocuments').
      const permissionKeyMap: { [key: string]: keyof typeof initialPermissions } = {
        'VIEW_DOCUMENTS': 'canViewDocuments',
        'EDIT_DOCUMENTS': 'canEditDocuments',
        'CREATE_DOCUMENTS': 'canAddDocuments',
        'DELETE_DOCUMENTS': 'canDeleteDocuments',
        'VIEW_DIAGNOSTIC': 'canViewDiagnostico',
        'VIEW_NORMS': 'canViewNormas',
        'VIEW_REGISTERS': 'canViewRegisters',
        'VIEW_DASHBOARDS': 'canViewDashboards',
        'VIEW_LEGISLATION': 'canViewLegislacao',
        'VIEW_CFTV': 'canViewCFTV',
      };

      // 3. Percorre as permissões que vieram do banco para este usuário.
      user.permissions?.forEach((p: any) => {
        const compositeKey = `${p.permission.action}_${p.permission.subject}`;
        const formKey = permissionKeyMap[compositeKey];
        if (formKey) {
          // Se encontrar uma correspondência, liga o checkbox correspondente.
          initialPermissions[formKey] = true;
        }
      });

      // 4. Atualiza o estado do formulário com todos os dados corretos.
      setFormData({
        name: user.name || "",
        email: user.email || "",
        role: user.role || "USER",
        status: user.status || "ACTIVE",
        companyId: user.company?.id || "",
        // CORREÇÃO: Acessa o ID do produto na estrutura correta retornada pela API.
        // A API retorna userProducts -> companyProduct -> product -> id.
        // Adicionamos '?' para segurança caso algum objeto seja nulo.
        services: user.userProducts?.map((up: any) => up.companyProduct?.product?.id).filter(Boolean) || [],
        arcoPortusPermissions: initialPermissions,
      });
    } else if (isAdmin && currentUser?.company?.id) {
      // CORREÇÃO: Acessa currentUser.company.id e garante que não é nulo.
      setFormData(prev => ({ ...prev, companyId: currentUser.company.id }));
    }
  }, [user, isAdmin, currentUser?.company?.id]);

  // CORREÇÃO: Usa companiesForForm em vez de availableCompanies
  const servicesToShow = useMemo(() => {
    if (!formData.companyId) return [];

    // Encontra a empresa selecionada na lista correta de empresas
    const selectedCompany = companiesForForm.find(c => c.id === formData.companyId);

    // Se a empresa não for encontrada ou não tiver produtos, retorna um array vazio.
    if (!selectedCompany || !Array.isArray(selectedCompany.products)) return [];

    // SUPORTE A AMBAS AS ESTRUTURAS:
    // Acessa o ID do produto na estrutura correta retornada pela API
    const contractedProductIds = selectedCompany.products.map((companyProduct: any) =>
      companyProduct.product?.id || companyProduct.productId
    ).filter(Boolean);

    // Filtra a lista de todos os serviços do sistema, mostrando apenas os que a empresa contratou.
    return allSystemServices.filter((service: any) => contractedProductIds.includes(service.id));
  }, [formData.companyId, companiesForForm, allSystemServices]);

  const queryClient = useQueryClient();

  const { mutate: createMutate, isPending: isCreating } = useMutation({
    mutationFn: createUser,
    onSuccess: () => {
      toast.success("Usuário criado com sucesso!");
      queryClient.invalidateQueries({ queryKey: ['users'] });
      onClose();
    },
    onError: (error: any) => {
      toast.error("Falha ao criar usuário", { description: error.response?.data?.error });
    },
  });

  const { mutate: updateMutate, isPending: isUpdating } = useMutation({
    mutationFn: updateUser,
    onSuccess: () => {
      toast.success("Usuário atualizado com sucesso!");
      queryClient.invalidateQueries({ queryKey: ['users'] });
      onClose();
    },
    onError: (error: any) => {
      toast.error("Falha ao atualizar usuário", { description: error.response?.data?.error });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isEditing) {
      updateMutate({ id: user.id, data: formData });
    } else {
      createMutate(formData);
    }
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

  const handleArcoPortusPermissionToggle = (permission: keyof typeof formData.arcoPortusPermissions) => {
    setFormData(prev => ({
      ...prev,
      arcoPortusPermissions: {
        ...prev.arcoPortusPermissions,
        [permission]: !prev.arcoPortusPermissions[permission]
      }
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

  const isPending = isCreating || isUpdating;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-2xl glass-card border-white/10 max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-2xl font-bold bg-gradient-to-r from-primary to-primary-hover bg-clip-text text-transparent flex items-center gap-3">
            {isEditing ? "Editar Usuário" : "Novo Usuário"}
          </CardTitle>
          <Button variant="ghost" size="icon" onClick={onClose}><X className="h-4 w-4" /></Button>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <Tabs defaultValue="basic">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="basic">Informações Básicas</TabsTrigger>
                <TabsTrigger value="permissions">Outras Permissões</TabsTrigger>
              </TabsList>
              <TabsContent value="basic" className="pt-6 space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Informações Pessoais</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2"><Label htmlFor="name">Nome Completo</Label><Input id="name" value={formData.name} onChange={(e) => handleChange("name", e.target.value)} required /></div>
                    <div className="space-y-2"><Label htmlFor="email">Email</Label><Input id="email" type="email" value={formData.email} onChange={(e) => handleChange("email", e.target.value)} required /></div>
                  </div>
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
                <div className="space-y-4">
                  <h3 className="text-lg font-medium flex items-center gap-2"><Building2 className="h-4 w-4" />Empresa</h3>
                  {isSuperAdmin && !isEditing ? (
                    <div className="space-y-2">
                      <Label htmlFor="companyId">Selecione a Empresa</Label>
                      <select id="companyId" value={formData.companyId} onChange={(e) => handleChange("companyId", e.target.value)} className="w-full px-3 py-2 rounded-md border" required>
                        <option value="" disabled>-- Escolha uma empresa --</option>
                        {companiesForForm.map((company) => (<option key={company.id} value={company.id}>{company.name}</option>))}
                      </select>
                    </div>
                  ) : (
                    <div className="p-3 rounded-lg bg-muted/30 border">
                      <div className="flex items-center gap-2">
                        <Building2 className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">{isEditing ? user.company?.name : currentUser.company?.name}</span>
                      </div>
                    </div>
                  )}
                </div>
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Acesso aos Serviços</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {servicesToShow.map((service) => (
                      <div key={service.id} className="flex items-center space-x-2 p-3 rounded-lg border">
                        <Checkbox id={service.id} checked={formData.services.includes(service.id)} onCheckedChange={() => handleServiceToggle(service.id)} />
                        <Label htmlFor={service.id} className="text-sm font-medium">{service.name}</Label>
                      </div>
                    ))}
                  </div>
                  {formData.companyId && servicesToShow.length === 0 && (<p className="text-xs text-muted-foreground">Esta empresa não possui serviços contratados para atribuir.</p>)}
                  {!formData.companyId && (<p className="text-xs text-muted-foreground">Selecione uma empresa para ver os serviços disponíveis.</p>)}
                </div>
              </TabsContent>
              <TabsContent value="permissions" className="pt-6">
                {formData.services.includes(arcoPortusId) ? (
                  <div className="space-y-6">
                    <div className="flex items-center gap-2 mb-4"><Lock className="h-5 w-5 text-primary" /><h3 className="text-lg font-medium">Permissões Detalhadas - Arco Portus</h3></div>
                    <div className="p-4 rounded-lg border bg-muted/20"><h4 className="font-medium mb-3 text-sm">Gerenciamento de Documentos</h4>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between"><Label htmlFor="canViewDocuments" className="text-sm">Visualizar documentos</Label><Checkbox id="canViewDocuments" checked={formData.arcoPortusPermissions.canViewDocuments} onCheckedChange={() => handleArcoPortusPermissionToggle("canViewDocuments")} /></div>
                        <div className="flex items-center justify-between"><Label htmlFor="canEditDocuments" className="text-sm">Editar documentos</Label><Checkbox id="canEditDocuments" checked={formData.arcoPortusPermissions.canEditDocuments} onCheckedChange={() => handleArcoPortusPermissionToggle("canEditDocuments")} /></div>
                        <div className="flex items-center justify-between"><Label htmlFor="canAddDocuments" className="text-sm">Adicionar novos documentos</Label><Checkbox id="canAddDocuments" checked={formData.arcoPortusPermissions.canAddDocuments} onCheckedChange={() => handleArcoPortusPermissionToggle("canAddDocuments")} /></div>
                        <div className="flex items-center justify-between"><Label htmlFor="canDeleteDocuments" className="text-sm text-destructive">Excluir documentos</Label><Checkbox id="canDeleteDocuments" checked={formData.arcoPortusPermissions.canDeleteDocuments} onCheckedChange={() => handleArcoPortusPermissionToggle("canDeleteDocuments")} /></div>
                      </div>
                    </div>
                    <div className="p-4 rounded-lg border bg-muted/20"><h4 className="font-medium mb-3 text-sm">Acesso às Áreas</h4>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between"><Label htmlFor="canViewCFTV" className="text-sm">Sistema CFTV</Label><Checkbox id="canViewCFTV" checked={formData.arcoPortusPermissions.canViewCFTV} onCheckedChange={() => handleArcoPortusPermissionToggle("canViewCFTV")} /></div>
                        <div className="flex items-center justify-between"><Label htmlFor="canViewLegislacao" className="text-sm">Legislação</Label><Checkbox id="canViewLegislacao" checked={formData.arcoPortusPermissions.canViewLegislacao} onCheckedChange={() => handleArcoPortusPermissionToggle("canViewLegislacao")} /></div>
                        <div className="flex items-center justify-between"><Label htmlFor="canViewNormas" className="text-sm">Normas e Procedimentos</Label><Checkbox id="canViewNormas" checked={formData.arcoPortusPermissions.canViewNormas} onCheckedChange={() => handleArcoPortusPermissionToggle("canViewNormas")} /></div>
                        <div className="flex items-center justify-between"><Label htmlFor="canViewDiagnostico" className="text-sm">Diagnóstico do EAR</Label><Checkbox id="canViewDiagnostico" checked={formData.arcoPortusPermissions.canViewDiagnostico} onCheckedChange={() => handleArcoPortusPermissionToggle("canViewDiagnostico")} /></div>
                        <div className="flex items-center justify-between"><Label htmlFor="canViewRegisters" className="text-sm">Documentos e Registros</Label><Checkbox id="canViewRegisters" checked={formData.arcoPortusPermissions.canViewRegisters} onCheckedChange={() => handleArcoPortusPermissionToggle("canViewRegisters")} /></div>
                        <div className="flex items-center justify-between"><Label htmlFor="canViewDashboards" className="text-sm">Dashboards</Label><Checkbox id="canViewDashboards" checked={formData.arcoPortusPermissions.canViewDashboards} onCheckedChange={() => handleArcoPortusPermissionToggle("canViewDashboards")} /></div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <Lock className="h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium">Permissões Específicas</h3>
                    <p className="text-sm text-muted-foreground">Selecione o serviço <strong>Arco Portus</strong> na aba "Informações Básicas" para ver as permissões detalhadas.</p>
                  </div>
                )}
              </TabsContent>
            </Tabs>
            <div className="flex gap-3 pt-4">
              <Button type="button" variant="outline" onClick={onClose} className="flex-1 border-border hover:bg-muted/50">Cancelar</Button>
              <Button type="submit" className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90 shadow-soft hover:shadow-medium transition-all" disabled={isPending}>
                <Save className="mr-2 h-4 w-4" />
                {isPending ? "Salvando..." : (isEditing ? "Salvar Alterações" : "Criar Usuário")}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
