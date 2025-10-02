import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Settings, Save, Loader2 } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { fetchAllProducts } from '@/services/companyService';
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface CompanySettingsModalProps {
  company: any;
  onClose: () => void;
  onSave: (settings: any) => void;
}

export function CompanySettingsModal({ company, onClose, onSave }: CompanySettingsModalProps) {
  // Busca todos os produtos do sistema dinamicamente da API
  const { data: availableServices = [], isLoading: isLoadingServices } = useQuery({
    queryKey: ['all-products'],
    queryFn: fetchAllProducts,
  });

  const [settings, setSettings] = useState({
    // CORREÇÃO: Mapeia o array de objetos 'products' para um array simples de IDs.
    // A estrutura da API é company.products -> [ { product: { id: '...' } } ]
    services: company?.products?.map((p: any) => p.product?.id).filter(Boolean) || [],
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
                  {isLoadingServices ? (
                    <div className="flex items-center justify-center py-8">
                      <Loader2 className="h-6 w-6 animate-spin text-primary" />
                      <span className="ml-2">Carregando serviços...</span>
                    </div>
                  ) : (
                    availableServices.map((service: any) => (
                      <div
                        key={service.id}
                        className="flex items-start gap-3 p-3 rounded-lg border border-white/10 bg-card/50 hover:bg-card/70 transition-colors"
                      >
                        <Checkbox
                          id={`service-${service.id}`}
                          checked={settings.services.includes(service.id)}
                          onCheckedChange={() => handleServiceToggle(service.id)}
                          className="mt-1"
                        />
                        <div className="flex-1">
                          <Label htmlFor={`service-${service.id}`} className="font-medium cursor-pointer">{service.name}</Label>
                          <p className="text-sm text-muted-foreground">{service.description}</p>
                        </div>
                        {settings.services.includes(service.id) && (
                          <Badge variant="outline" className="bg-success/20 text-success border-success/30">
                            Ativo
                          </Badge>
                        )}
                      </div>
                    ))
                  )}
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