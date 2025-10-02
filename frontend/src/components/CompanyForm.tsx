import { useState, useEffect } from "react";
import { X, Save, Building2, Upload, Palette, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface CompanyFormProps {
  company?: any;
  onClose: () => void;
  onSubmit: (companyData: any) => void;
}

export function CompanyForm({ company, onClose, onSubmit }: CompanyFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    cnpj: "",
    logo: null as File | null,
    logoPreview: "",
  });

  useEffect(() => {
    if (company) {
      setFormData({
        name: company.name || "",
        cnpj: company.cnpj || "",
        logo: null,
        logoPreview: company.logoUrl ? `${import.meta.env.VITE_API_BASE_URL}${company.logoUrl}` : "",
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

  const formatCpfCnpj = (value: string) => {
    if (!value) return value;
    const onlyNums = value.replace(/[^\d]/g, '');

    if (onlyNums.length <= 11) {
      return onlyNums
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
    } else {
      return onlyNums
        .slice(0, 14)
        .replace(/(\d{2})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1/$2')
        .replace(/(\d{4})(\d{1,2})$/, '$1-$2');
    }
  };

  const isEditing = !!company;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
      <Card className="w-full max-w-2xl glass-card border-white/10 animate-scale-in max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="text-2xl font-bold bg-gradient-to-r from-primary to-primary-hover bg-clip-text text-transparent flex items-center gap-3">
            <Building2 className="h-6 w-6 text-primary" />
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
              <h3 className="text-lg font-medium flex items-center gap-2 ">
                <Info className="h-4 w-4" />
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
              <div className="space-y-2">
                <Label htmlFor="cnpj">CNPJ</Label>
                <Input
                  id="cnpj"
                  value={formData.cnpj}
                  onChange={(e) => handleChange("cnpj", formatCpfCnpj(e.target.value))}
                  placeholder="00.000.000/0000-00"
                  className="glass-input"
                  required
                />
              </div>
            </div>

            {/* Identidade Visual */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium flex items-center gap-2 ">
                <Palette className="h-4 w-4" />
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
                    <p className="text-xs text-muted-foreground mt-1">
                      Formatos aceitos: PNG, JPG, SVG (máx. 2MB)
                    </p>
                  </div>
                  {formData.logoPreview && (
                    <div className="w-12 h-12 rounded-lg border-2 border-border overflow-hidden flex-shrink-0">
                      <img
                        src={formData.logoPreview}
                        alt="Logo preview"
                        className="w-full h-auto object-cover"
                      />
                    </div>
                  )}
                </div>
              </div>

            </div>

            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="flex-1 border-border hover:bg-muted/50"
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90 shadow-soft hover:shadow-medium transition-all"
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