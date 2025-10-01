import { useState } from "react";
import { Settings, Upload, Palette, Save, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface CompanySettingsModalProps {
  company: any;
  onClose: () => void;
  onSave: (settings: any) => void;
}

const availableServices = [
  { id: "arco-portus", name: "Arco Portus", description: "Sistema de gestão documental portuária" },
  { id: "accia", name: "ACCIA", description: "Sistema de controle de acesso" },
  { id: "guardcontrol", name: "GuardControl", description: "Gestão de segurança patrimonial" },
  { id: "arcoview", name: "ArcoView", description: "Sistema de videomonitoramento" },
  { id: "arcomoki", name: "ArcoMoki", description: "Checklist digital" },
  { id: "unicasp", name: "UNICASP", description: "Sistema educacional" }
];

export function CompanySettingsModal({ company, onClose, onSave }: CompanySettingsModalProps) {
  const [settings, setSettings] = useState({
    logo: company?.logoUrl || "",
    primaryColor: company?.customColors?.primary || "#0066cc",
    secondaryColor: company?.customColors?.secondary || "#1f2937",
    services: company?.services || [],
  });

  const [logoPreview, setLogoPreview] = useState(company?.logoUrl || "");

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setLogoPreview(result);
        setSettings(prev => ({ ...prev, logo: result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleServiceToggle = (serviceId: string) => {
    setSettings(prev => ({
      ...prev,
      services: prev.services.includes(serviceId)
        ? prev.services.filter((id: string) => id !== serviceId)
        : [...prev.services, serviceId]
    }));
  };

  const handleSave = () => {
    onSave(settings);
    onClose();
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="glass-card border-white/10 max-w-4xl max-h-[90vh] overflow-hidden">
        <DialogHeader className="border-b border-white/10 pb-4">
          <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent flex items-center gap-3">
            <Settings className="h-6 w-6 text-primary" />
            Configurações - {company?.name}
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 overflow-y-auto max-h-[60vh] pr-2">
          {/* Visual Identity */}
          <Card className="glass-card border-white/10">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="h-5 w-5" />
                Identidade Visual
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Logo Upload */}
              <div className="space-y-3">
                <Label>Logo da Empresa</Label>
                <div className="flex items-center gap-4">
                  {logoPreview && (
                    <div className="w-16 h-16 rounded-lg border-2 border-border overflow-hidden">
                      <img
                        src={logoPreview}
                        alt="Logo preview"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <div className="flex-1">
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="glass-input"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Formatos aceitos: PNG, JPG, SVG (máx. 2MB)
                    </p>
                  </div>
                </div>
              </div>

              {/* Color Customization */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="primaryColor">Cor Primária</Label>
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      id="primaryColor"
                      value={settings.primaryColor}
                      onChange={(e) => setSettings(prev => ({ ...prev, primaryColor: e.target.value }))}
                      className="w-12 h-12 rounded-lg border-2 border-border cursor-pointer"
                    />
                    <Input
                      value={settings.primaryColor}
                      onChange={(e) => setSettings(prev => ({ ...prev, primaryColor: e.target.value }))}
                      className="glass-input"
                      placeholder="#0066cc"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="secondaryColor">Cor Secundária</Label>
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      id="secondaryColor"
                      value={settings.secondaryColor}
                      onChange={(e) => setSettings(prev => ({ ...prev, secondaryColor: e.target.value }))}
                      className="w-12 h-12 rounded-lg border-2 border-border cursor-pointer"
                    />
                    <Input
                      value={settings.secondaryColor}
                      onChange={(e) => setSettings(prev => ({ ...prev, secondaryColor: e.target.value }))}
                      className="glass-input"
                      placeholder="#1f2937"
                    />
                  </div>
                </div>
              </div>

              {/* Preview */}
              <div className="p-4 rounded-lg border border-white/10 bg-card/50">
                <p className="text-sm text-muted-foreground mb-2">Pré-visualização:</p>
                <div 
                  className="h-20 rounded-lg flex items-center justify-center text-white font-semibold"
                  style={{ 
                    background: `linear-gradient(135deg, ${settings.primaryColor}, ${settings.secondaryColor})` 
                  }}
                >
                  {company?.name}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Services */}
          <Card className="glass-card border-white/10">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Serviços Contratados
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Selecione os serviços que esta empresa tem acesso:
                </p>
                
                <div className="space-y-3">
                  {availableServices.map((service) => (
                    <div
                      key={service.id}
                      className="flex items-start gap-3 p-3 rounded-lg border border-white/10 bg-card/50 hover:bg-card/70 transition-colors"
                    >
                      <Checkbox
                        checked={settings.services.includes(service.id)}
                        onCheckedChange={() => handleServiceToggle(service.id)}
                        className="mt-1"
                      />
                      <div className="flex-1">
                        <div className="font-medium">{service.name}</div>
                        <div className="text-sm text-muted-foreground">{service.description}</div>
                      </div>
                      {settings.services.includes(service.id) && (
                        <Badge variant="outline" className="bg-success/20 text-success border-success/30">
                          Ativo
                        </Badge>
                      )}
                    </div>
                  ))}
                </div>

                <div className="p-3 bg-primary/10 rounded-lg border border-primary/20">
                  <p className="text-sm text-primary">
                    <strong>Nota:</strong> Apenas o Super Admin pode modificar os serviços contratados.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Actions */}
        <div className="flex justify-between pt-6 border-t border-white/10">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Settings className="h-4 w-4" />
            {settings.services.length} serviços selecionados
          </div>
          
          <div className="flex gap-3">
            <Button variant="outline" onClick={onClose} className="hover-lift">
              Cancelar
            </Button>
            <Button onClick={handleSave} className="gradient-primary hover-lift">
              <Save className="mr-2 h-4 w-4" />
              Salvar Configurações
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}