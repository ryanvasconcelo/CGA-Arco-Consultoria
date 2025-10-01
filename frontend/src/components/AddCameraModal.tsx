import { useState } from "react";
import { X, Save, Camera, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface AddCameraModalProps {
  onClose: () => void;
  onSubmit: (cameraData: any) => void;
}

export function AddCameraModal({ onClose, onSubmit }: AddCameraModalProps) {
  const [formData, setFormData] = useState({
    unit: "",
    description: "",
    type: "Fixa",
    manufacturer: "",
    resolution: "HD",
    quality: "100%"
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
      <Card className="w-full max-w-md glass-card border-white/10 animate-scale-in">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="text-xl font-semibold flex items-center gap-2">
            <Camera className="h-5 w-5 text-primary" />
            Adicionar Câmera
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose} className="h-8 w-8 p-0">
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="unit">Unidade/Local</Label>
              <Input
                id="unit"
                value={formData.unit}
                onChange={(e) => handleChange("unit", e.target.value)}
                placeholder="Ex: Portão Principal"
                className="glass-input"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Descrição</Label>
              <Input
                id="description"
                value={formData.description}
                onChange={(e) => handleChange("description", e.target.value)}
                placeholder="Descrição detalhada da câmera"
                className="glass-input"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="type">Tipo</Label>
              <select
                id="type"
                value={formData.type}
                onChange={(e) => handleChange("type", e.target.value)}
                className="w-full px-3 py-2 rounded-md border border-input bg-background/50 backdrop-blur-sm"
                required
              >
                <option value="Fixa">Fixa</option>
                <option value="PTZ">PTZ</option>
                <option value="Dome">Dome</option>
                <option value="Bullet">Bullet</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="manufacturer">Fabricante</Label>
              <Input
                id="manufacturer"
                value={formData.manufacturer}
                onChange={(e) => handleChange("manufacturer", e.target.value)}
                placeholder="Ex: Hikvision, Intelbras"
                className="glass-input"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="resolution">Resolução</Label>
                <select
                  id="resolution"
                  value={formData.resolution}
                  onChange={(e) => handleChange("resolution", e.target.value)}
                  className="w-full px-3 py-2 rounded-md border border-input bg-background/50 backdrop-blur-sm"
                  required
                >
                  <option value="HD">HD (720p)</option>
                  <option value="Full HD">Full HD (1080p)</option>
                  <option value="4K">4K (2160p)</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="quality">Qualidade</Label>
                <select
                  id="quality"
                  value={formData.quality}
                  onChange={(e) => handleChange("quality", e.target.value)}
                  className="w-full px-3 py-2 rounded-md border border-input bg-background/50 backdrop-blur-sm"
                  required
                >
                  <option value="100%">100%</option>
                  <option value="75%">75%</option>
                  <option value="50%">50%</option>
                  <option value="25%">25%</option>
                </select>
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
                Adicionar
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}