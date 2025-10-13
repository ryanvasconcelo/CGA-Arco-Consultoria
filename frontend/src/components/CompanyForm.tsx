import { useState, useEffect } from "react";
import { X, Save, Building2, Upload, Palette, Info, ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

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
        // ✅ Constrói a URL completa do logo
        logoPreview: company.logoUrl
          ? `${import.meta.env.VITE_API_BASE_URL}${company.logoUrl}`
          : "",
      });
    }
  }, [company]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validação básica
    if (!formData.name.trim()) {
      toast.error("O nome da empresa é obrigatório");
      return;
    }

    if (!formData.cnpj.trim()) {
      toast.error("O CNPJ é obrigatório");
      return;
    }

    // Valida tamanho do arquivo (máx 2MB)
    if (formData.logo && formData.logo.size > 2 * 1024 * 1024) {
      toast.error("O logo deve ter no máximo 2MB");
      return;
    }

    console.log('📤 Enviando dados do formulário:', {
      name: formData.name,
      cnpj: formData.cnpj,
      hasLogo: !!formData.logo,
      logoSize: formData.logo?.size
    });

    onSubmit(formData);
  };

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;

    // Valida tipo de arquivo
    const validTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/svg+xml'];
    if (!validTypes.includes(file.type)) {
      toast.error("Formato inválido. Use PNG, JPG ou SVG");
      e.target.value = ''; // Limpa o input
      return;
    }

    // Valida tamanho (máx 2MB)
    if (file.size > 2 * 1024 * 1024) {
      toast.error("O arquivo deve ter no máximo 2MB");
      e.target.value = ''; // Limpa o input
      return;
    }

    // Cria preview
    const reader = new FileReader();
    reader.onload = (event) => {
      setFormData(prev => ({
        ...prev,
        logo: file,
        logoPreview: event.target?.result as string
      }));
      toast.success(`Logo "${file.name}" carregado`);
    };
    reader.onerror = () => {
      toast.error("Erro ao carregar o arquivo");
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveLogo = () => {
    setFormData(prev => ({
      ...prev,
      logo: null,
      logoPreview: ""
    }));
    toast.info("Logo removido");
  };

  const formatCpfCnpj = (value: string) => {
    if (!value) return value;
    const onlyNums = value.replace(/[^\d]/g, '');

    if (onlyNums.length <= 11) {
      // Formato CPF: 000.000.000-00
      return onlyNums
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
    } else {
      // Formato CNPJ: 00.000.000/0000-00
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
              <h3 className="text-lg font-medium flex items-center gap-2">
                <Info className="h-4 w-4" />
                Informações Básicas
              </h3>

              <div className="space-y-2">
                <Label htmlFor="name">
                  Nome da Empresa <span className="text-destructive">*</span>
                </Label>
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
                <Label htmlFor="cnpj">
                  CNPJ <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="cnpj"
                  value={formData.cnpj}
                  onChange={(e) => handleChange("cnpj", formatCpfCnpj(e.target.value))}
                  placeholder="00.000.000/0000-00"
                  className="glass-input"
                  required
                  maxLength={18}
                />
              </div>
            </div>

            {/* Identidade Visual */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium flex items-center gap-2">
                <Palette className="h-4 w-4" />
                Identidade Visual
              </h3>

              <div className="space-y-3">
                <Label htmlFor="logo">Logo da Empresa</Label>

                {/* Preview do Logo */}
                {formData.logoPreview ? (
                  <div className="flex items-center gap-4 p-4 rounded-lg border-2 border-border bg-muted/30">
                    <div className="w-20 h-20 rounded-lg border-2 border-border overflow-hidden flex-shrink-0 bg-background">
                      <img
                        src={formData.logoPreview}
                        alt="Logo preview"
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">
                        {formData.logo ? formData.logo.name : 'Logo atual'}
                      </p>
                      {formData.logo && (
                        <p className="text-xs text-muted-foreground">
                          {(formData.logo.size / 1024).toFixed(2)} KB
                        </p>
                      )}
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={handleRemoveLogo}
                      className="border-destructive text-destructive hover:bg-destructive/10"
                    >
                      Remover
                    </Button>
                  </div>
                ) : (
                  <div className="flex items-center justify-center p-8 rounded-lg border-2 border-dashed border-border bg-muted/30">
                    <div className="text-center">
                      <ImageIcon className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground">
                        Nenhum logo selecionado
                      </p>
                    </div>
                  </div>
                )}

                {/* Input de Upload */}
                <div className="flex items-center gap-2">
                  <Input
                    id="logo"
                    type="file"
                    accept="image/png,image/jpeg,image/jpg,image/svg+xml"
                    onChange={handleLogoUpload}
                    className="glass-input"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => document.getElementById('logo')?.click()}
                    className="flex-shrink-0"
                  >
                    <Upload className="h-4 w-4" />
                  </Button>
                </div>

                <p className="text-xs text-muted-foreground">
                  Formatos aceitos: PNG, JPG, SVG (máx. 2MB)
                </p>
              </div>
            </div>

            {/* Botões de Ação */}
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
                {isEditing ? "Salvar Alterações" : "Criar Empresa"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}