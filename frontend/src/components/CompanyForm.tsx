import { useState, useEffect } from "react";
import { X, Save, Building2, Upload, Users, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";

interface CompanyFormProps {
  company?: any;
  onClose: () => void;
  onSubmit: (companyData: any) => void;
}

const availableServices = [
  { id: "arco-portus", name: "Arco Portus", description: "Sistema de documentação portuária" },
  { id: "accia", name: "ACCIA", description: "Sistema de auditoria e conformidade" },
  { id: "guardcontrol", name: "GuardControl", description: "Controle de acesso e segurança" },
  { id: "arcoview", name: "ArcoView", description: "Monitoramento e análise" },
  { id: "arcomoki", name: "ArcoMoki", description: "Checklist digital" },
  { id: "unicasp", name: "UNICASP", description: "Sistema universitário" }
];

export function CompanyForm({ company, onClose, onSubmit }: CompanyFormProps) {
  const [formData, setFormData] = useState({
    name: "",
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
        logo: null,
        logoPreview: company.logoUrl || "",
        customColors: company.customColors || {
          primary: "#f59e0b",
          secondary: "#1f2937"
        },
        services: company.services || [],
        users: company.users || []
      });
    }
  }, [company]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setFormData(prev => ({
          ...prev,
          logo: file,
          logoPreview: e.target?.result as string
        }));
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
            {/* Informações Básicas */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium flex items-center gap-2">
                <Settings className="h-4 w-4" />
                Informações Básicas
              </h3>
              
              <div className="space-y-2">
                <Label htmlFor="name">Nome da Empresa</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                  placeholder="Digite o nome da empresa"
                  className="glass-input"
                  required
                />
              </div>
            </div>

            {/* Identidade Visual */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium flex items-center gap-2">
                <Upload className="h-4 w-4" />
                Identidade Visual
              </h3>
              
              <div className="space-y-2">
                <Label htmlFor="logo">Logo da Empresa</Label>
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <Input
                      id="logo"
                      type="file"
                      accept="image/*"
                      onChange={handleLogoUpload}
                      className="glass-input"
                    />
                  </div>
                  {formData.logoPreview && (
                    <div className="w-16 h-16 rounded-lg border-2 border-border overflow-hidden">
                      <img
                        src={formData.logoPreview}
                        alt="Logo preview"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="primary-color">Cor Primária</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      id="primary-color"
                      type="color"
                      value={formData.customColors.primary}
                      onChange={(e) => handleChange("customColors", {
                        ...formData.customColors,
                        primary: e.target.value
                      })}
                      className="w-12 h-10 p-1 rounded-md"
                    />
                    <Input
                      value={formData.customColors.primary}
                      onChange={(e) => handleChange("customColors", {
                        ...formData.customColors,
                        primary: e.target.value
                      })}
                      className="glass-input"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="secondary-color">Cor Secundária</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      id="secondary-color"
                      type="color"
                      value={formData.customColors.secondary}
                      onChange={(e) => handleChange("customColors", {
                        ...formData.customColors,
                        secondary: e.target.value
                      })}
                      className="w-12 h-10 p-1 rounded-md"
                    />
                    <Input
                      value={formData.customColors.secondary}
                      onChange={(e) => handleChange("customColors", {
                        ...formData.customColors,
                        secondary: e.target.value
                      })}
                      className="glass-input"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Serviços Contratados */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium flex items-center gap-2">
                <Users className="h-4 w-4" />
                Serviços Contratados
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {availableServices.map((service) => (
                  <div key={service.id} className="flex items-start space-x-3 p-3 rounded-lg border border-border hover:bg-muted/30 transition-colors">
                    <Checkbox
                      id={service.id}
                      checked={formData.services.includes(service.id)}
                      onCheckedChange={() => handleServiceToggle(service.id)}
                    />
                    <div className="grid gap-1.5 leading-none">
                      <Label
                        htmlFor={service.id}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        {service.name}
                      </Label>
                      <p className="text-xs text-muted-foreground">
                        {service.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

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