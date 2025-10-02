import { useState } from "react";
import { Settings, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
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
  { id: "6f23e9ed-fb73-40b2-8503-d162b912ee87", name: "Arco Portus", description: "Plataforma de Gerenciamento de Operações de Segurança Portuária" },
  { id: "7f650a42-d0e8-4ab4-89aa-af3b32dbbd88", name: "ACCIA", description: "Gestão e Análise de Risco de Segurança Corporativa" },
  { id: "f2271d76-88fd-4c35-b4dc-683de7187643", name: "Guard Control", description: "Gestão e Controle de Equipamento e Operações de Segurança" },
  { id: "00cf8fde-c581-424e-8610-3ccbf12c338f", name: "Arco View", description: "Solução de Monitoramento por Drones Automatizados" },
  { id: "2546aaf3-402a-466a-888a-ea003a621626", name: "Arcomoki", description: "Sistema de Formulários Eletrônicos para Gestão de Processos" },
  { id: "88a98456-fcae-498e-8c01-72dc247b34de", name: "UNICASP", description: "Sua Plataforma de Educação Corporativa" }
];

export function CompanySettingsModal({ company, onClose, onSave }: CompanySettingsModalProps) {
  const [settings, setSettings] = useState({
    // CORREÇÃO: Mapeia o array de objetos 'products' para um array simples de IDs.
    services: company?.products?.map((p: any) => p.productId) || [],
  });

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
      <DialogContent className="glass-card border-white/10 max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader className="border-b border-white/10 pb-4">
          <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-primary to-primary-hover bg-clip-text text-transparent flex items-center gap-3">
            <Settings className="h-6 w-6 text-primary" />
            Configurações - {company?.name}
          </DialogTitle>
        </DialogHeader>

        <div className="flex-grow overflow-y-auto pr-2">
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

        {/* Actions - Adicionado mt-auto para empurrar para baixo */}
        <div className="flex justify-between pt-6 border-t border-white/10 mt-auto">
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