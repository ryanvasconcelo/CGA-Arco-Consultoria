import { useState, useEffect } from "react";
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createCompany } from '../services/companyService';
import { X, Save, Building2, Upload, Users, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";

interface CompanyFormProps {
  company?: any;
  onClose: () => void;
  // A prop onSubmit não é mais necessária para o fluxo de criação,
  // mas podemos mantê-la para outros usos, se quiser.
  onSubmit?: (companyData: any) => void;
}

const availableServices = [
  { id: "arco-portus", name: "Arco Portus", description: "Sistema de documentação portuária" },
  { id: "accia", name: "ACCIA", description: "Sistema de auditoria e conformidade" },
  { id: "guardcontrol", name: "GuardControl", description: "Controle de acesso e segurança" },
  { id: "arcoview", name: "ArcoView", description: "Monitoramento e análise" },
  { id: "arcomoki", name: "ArcoMoki", description: "Checklist digital" },
  { id: "unicasp", name: "UNICASP", description: "Sistema universitário" }
];

export function CompanyForm({ company, onClose }: CompanyFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    cnpj: "", // Adicionando CNPJ que faltava no estado inicial
    logo: null as File | null,
    logoPreview: "",
    customColors: {
      primary: "#f59e0b",
      secondary: "#1f2937"
    },
    services: [] as string[],
    users: [] as string[]
  });

  useEffect(() => {
    if (company) {
      setFormData({
        name: company.name || "",
        cnpj: company.cnpj || "",
        logo: null,
        logoPreview: company.logoUrl || "",
        customColors: company.customColors || { primary: "#f59e0b", secondary: "#1f2937" },
        services: company.services || [],
        users: company.users || []
      });
    }
  }, [company]);

  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: createCompany,
    onSuccess: () => {
      console.log('Empresa criada com sucesso!');
      queryClient.invalidateQueries({ queryKey: ['companies'] });
      onClose(); // <-- MUDANÇA 3: Chamando a prop para fechar o modal
    },
    onError: (error) => {
      console.error('Falha na mutação:', error);
      // Aqui você pode adicionar um toast ou alerta de erro
    },
  });

  // --- MUDANÇA 1: Lógica do handleSubmit atualizada ---
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const submissionData = new FormData();
    submissionData.append('name', formData.name);
    submissionData.append('cnpj', formData.cnpj);
    submissionData.append('customColors', JSON.stringify(formData.customColors));
    submissionData.append('services', JSON.stringify(formData.services));

    if (formData.logo) {
      submissionData.append('logo', formData.logo);
    }

    mutate(submissionData);
  };

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setFormData(prev => ({ ...prev, logo: file, logoPreview: e.target?.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleServiceToggle = (serviceId: string) => {
    setFormData(prev => ({
      ...prev,
      services: prev.services.includes(serviceId)
        ? prev.services.filter(id => id !== serviceId)
        : [...prev.services, serviceId]
    }));
  };

  const isEditing = !!company;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
      <Card className="w-full max-w-2xl glass-card border-white/10 animate-scale-in max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="text-xl font-semibold flex items-center gap-2">
            <Building2 className="h-5 w-5 text-primary" />
            {isEditing ? "Editar Empresa" : "Nova Empresa"}
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose} className="h-8 w-8 p-0">
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Informações Básicas</h3>
              <div className="space-y-2">
                <Label htmlFor="name">Nome da Empresa</Label>
                <Input id="name" value={formData.name} onChange={(e) => handleChange("name", e.target.value)} required />
              </div>
              {/* Adicionei o campo CNPJ que estava faltando no formulário */}
              <div className="space-y-2">
                <Label htmlFor="cnpj">CNPJ</Label>
                <Input id="cnpj" value={formData.cnpj} onChange={(e) => handleChange("cnpj", e.target.value)} required />
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-medium">Identidade Visual</h3>
              {/* ... O resto do seu JSX de Identidade Visual e Serviços continua aqui, sem alterações ... */}
              <div className="space-y-2">
                <Label htmlFor="logo">Logo da Empresa</Label>
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <Input id="logo" type="file" accept="image/*" onChange={handleLogoUpload} />
                  </div>
                  {formData.logoPreview && (
                    <div className="w-16 h-16 rounded-lg border-2 border-border overflow-hidden">
                      <img src={formData.logoPreview} alt="Logo preview" className="w-full h-full object-cover" />
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-medium">Serviços Contratados</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {availableServices.map((service) => (
                  <div key={service.id} className="flex items-start space-x-3 p-3 rounded-lg border">
                    <Checkbox id={service.id} checked={formData.services.includes(service.id)} onCheckedChange={() => handleServiceToggle(service.id)} />
                    <div className="grid gap-1.5">
                      <Label htmlFor={service.id}>{service.name}</Label>
                      <p className="text-xs text-muted-foreground">{service.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <Button type="button" variant="outline" onClick={onClose} className="flex-1">
                Cancelar
              </Button>

              {/* --- MUDANÇA 2: Botão com estado de loading --- */}
              <Button type="submit" className="flex-1 gradient-primary hover-lift" disabled={isPending}>
                {isPending ? ("Salvando...") : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    {isEditing ? "Salvar" : "Criar"}
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}