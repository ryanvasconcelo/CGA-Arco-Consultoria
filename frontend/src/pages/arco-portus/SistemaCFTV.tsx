import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Camera, 
  FileText, 
  Plus,
  Search,
  Download
} from "lucide-react";
import ArcoPortusHeader from "@/components/arco-portus/Header";
import ArcoPortusFooter from "@/components/arco-portus/Footer";

const SistemaCFTV = () => {
  const cameras = [
    { id: "01", unidade: "Porto Chibatão", descricao: "Portaria 02", tipo: "Bullet", externismo: "Interna", fabricante: "Intelbras", resolucao: "Full HD", qualidade: "Ótima" },
    { id: "02", unidade: "Porto Chibatão", descricao: "Portaria 03", tipo: "Bullet", externismo: "Interna", fabricante: "Intelbras", resolucao: "Full HD", qualidade: "Regular" },
    { id: "03", unidade: "Porto Chibatão", descricao: "Portaria 03", tipo: "PTZ", externismo: "Interna", fabricante: "Hikvision", resolucao: "Full HD", qualidade: "Boa" },
    { id: "04", unidade: "Porto Chibatão", descricao: "Pier", tipo: "PTZ", externismo: "Interna", fabricante: "Hikvision", resolucao: "Full HD", qualidade: "Boa" },
    { id: "05", unidade: "Porto Chibatão", descricao: "Pier", tipo: "Mini Dome", externismo: "Interna", fabricante: "Intelbras", resolucao: "Full HD", qualidade: "Boa" },
    { id: "06", unidade: "Porto Chibatão", descricao: "Pier", tipo: "Mini Dome", externismo: "Interna", fabricante: "Axis", resolucao: "Full HD", qualidade: "Ótima" },
    { id: "07", unidade: "Porto Chibatão", descricao: "Pátio 02", tipo: "Bullet", externismo: "Interna", fabricante: "Axis", resolucao: "Full HD", qualidade: "Ótima" }
  ];

  const totalCameras = 856;
  const statusData = [
    { label: "Operacional", value: 45, color: "bg-green-500" },
    { label: "Em Manutenção", value: 30, color: "bg-yellow-500" },
    { label: "Defeituosa", value: 15, color: "bg-red-500" },
    { label: "Offline", value: 10, color: "bg-gray-500" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      <ArcoPortusHeader />
      
      <main className="container mx-auto px-4 py-8">
        <div className="flex gap-6">
          {/* Sidebar */}
          <div className="w-80 space-y-4">
            <Card className="glass-card">
              <CardContent className="p-4 space-y-4">
                <Button variant="outline" className="w-full justify-start">
                  <FileText className="h-4 w-4 mr-2" />
                  ARESP
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <FileText className="h-4 w-4 mr-2" />
                  DIAGNÓSTICO DO EAR
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <FileText className="h-4 w-4 mr-2" />
                  NORMAS E PROCEDIMENTOS
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <FileText className="h-4 w-4 mr-2" />
                  DOCUMENTOS E REGISTROS
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <FileText className="h-4 w-4 mr-2" />
                  GESTÃO DE ROTINAS OPERACIONAIS
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <FileText className="h-4 w-4 mr-2" />
                  LEGISLAÇÃO
                </Button>
                <Button className="w-full btn-primary justify-start">
                  <Camera className="h-4 w-4 mr-2" />
                  SISTEMA DE CFTV
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <FileText className="h-4 w-4 mr-2" />
                  GESTÃO DE ROTINAS OPERACIONAIS
                </Button>
                <div className="bg-muted p-4 rounded-lg">
                  <Button className="w-full bg-secondary text-white hover:bg-secondary/90">
                    Dashboards
                    <br />
                    Acessar
                  </Button>
                </div>
                <div className="bg-muted p-4 rounded-lg text-center">
                  <div className="text-lg font-bold">U</div>
                  <div className="text-sm">TREINAMENTOS</div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Header */}
            <div className="bg-secondary text-white text-center py-4 rounded-t-lg mb-6">
              <h1 className="text-xl font-bold">SISTEMA DE CFTV</h1>
            </div>

            {/* Status Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <Camera className="h-8 w-8 text-secondary mb-2" />
                      <div className="text-2xl font-bold">{totalCameras}</div>
                      <div className="text-sm text-muted-foreground">TOTAL DE CÂMERAS</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {statusData.map((status, index) => (
                <Card key={index}>
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-3">
                      <div className={`w-4 h-4 rounded-full ${status.color}`}></div>
                      <div>
                        <div className="text-2xl font-bold">{status.value}%</div>
                        <div className="text-sm text-muted-foreground">{status.label}</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Status Message */}
            <Card className="mb-6">
              <CardContent className="p-4">
                <div className="text-center text-red-600 font-medium">
                  [Em construção]
                </div>
              </CardContent>
            </Card>

            {/* Control Panel */}
            <Card className="mb-6">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Arquivo Otimizado de Segurança</CardTitle>
                  <div className="flex gap-2">
                    <Button className="btn-secondary">
                      <Plus className="h-4 w-4 mr-2" />
                      Nova Câmera
                    </Button>
                    <Button variant="outline">
                      <Download className="h-4 w-4 mr-2" />
                      Exportar
                    </Button>
                  </div>
                </div>
              </CardHeader>
            </Card>

            {/* Search */}
            <div className="mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Pesquisar câmeras..."
                  className="pl-10"
                />
              </div>
            </div>

            {/* Cameras Table */}
            <Card>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-muted/50">
                      <tr>
                        <th className="text-left p-4 font-medium">N° Câmera</th>
                        <th className="text-left p-4 font-medium">Unidade</th>
                        <th className="text-left p-4 font-medium">Descrição</th>
                        <th className="text-left p-4 font-medium">Tipo</th>
                        <th className="text-left p-4 font-medium">Externismo</th>
                        <th className="text-left p-4 font-medium">Fabricante</th>
                        <th className="text-left p-4 font-medium">Resolução</th>
                        <th className="text-left p-4 font-medium">Qualidade</th>
                      </tr>
                    </thead>
                    <tbody>
                      {cameras.map((camera, index) => (
                        <tr key={camera.id} className={index % 2 === 0 ? "bg-background" : "bg-muted/20"}>
                          <td className="p-4">{camera.id}</td>
                          <td className="p-4">{camera.unidade}</td>
                          <td className="p-4">{camera.descricao}</td>
                          <td className="p-4">{camera.tipo}</td>
                          <td className="p-4">{camera.externismo}</td>
                          <td className="p-4">{camera.fabricante}</td>
                          <td className="p-4">{camera.resolucao}</td>
                          <td className="p-4">
                            <span className={`px-2 py-1 rounded-full text-xs ${
                              camera.qualidade === 'Ótima' ? 'bg-green-100 text-green-800' :
                              camera.qualidade === 'Boa' ? 'bg-blue-100 text-blue-800' :
                              'bg-yellow-100 text-yellow-800'
                            }`}>
                              {camera.qualidade}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="p-4 text-sm text-muted-foreground">
                  1 a 5 de 5 Registros
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <ArcoPortusFooter />
    </div>
  );
};

export default SistemaCFTV;