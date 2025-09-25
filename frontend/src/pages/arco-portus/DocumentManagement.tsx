import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Upload, 
  Download, 
  Edit3, 
  Trash2, 
  FileText, 
  Plus,
  Search
} from "lucide-react";
import ArcoPortusHeader from "@/components/arco-portus/Header";
import ArcoPortusFooter from "@/components/arco-portus/Footer";
import { useToast } from "@/hooks/use-toast";

interface Document {
  id: string;
  name: string;
  description: string;
  uploadDate: string;
  size: string;
  type: string;
}

const DocumentManagement = ({ title, category }: { title: string; category: string }) => {
  const { toast } = useToast();
  const [documents, setDocuments] = useState<Document[]>([
    {
      id: "1",
      name: "Razão Social e CNPJ.pdf",
      description: "1.1.1 Razão Social e CNPJ",
      uploadDate: "2023-10-15",
      size: "2.3 MB",
      type: "PDF"
    },
    {
      id: "2",
      name: "EAR_Aprovado_2023.pdf",
      description: "2.1 Possui EAR aprovado e atualizado?",
      uploadDate: "2023-09-20",
      size: "15.7 MB",
      type: "PDF"
    }
  ]);

  const [showUploadForm, setShowUploadForm] = useState(false);
  const [newDocument, setNewDocument] = useState({
    name: "",
    description: "",
    file: null as File | null
  });

  const handleUpload = () => {
    if (!newDocument.file || !newDocument.name || !newDocument.description) {
      toast({
        title: "Erro",
        description: "Por favor, preencha todos os campos e selecione um arquivo.",
        variant: "destructive"
      });
      return;
    }

    const doc: Document = {
      id: Date.now().toString(),
      name: newDocument.name,
      description: newDocument.description,
      uploadDate: new Date().toISOString().split('T')[0],
      size: `${(newDocument.file.size / 1024 / 1024).toFixed(1)} MB`,
      type: newDocument.file.type.includes('pdf') ? 'PDF' : 'DOC'
    };

    setDocuments([...documents, doc]);
    setNewDocument({ name: "", description: "", file: null });
    setShowUploadForm(false);
    
    toast({
      title: "Sucesso",
      description: "Documento enviado com sucesso!"
    });
  };

  const handleDelete = (id: string) => {
    setDocuments(documents.filter(doc => doc.id !== id));
    toast({
      title: "Documento removido",
      description: "O documento foi excluído com sucesso."
    });
  };

  const handleDownload = (doc: Document) => {
    toast({
      title: "Download iniciado",
      description: `Baixando ${doc.name}...`
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      <ArcoPortusHeader />
      
      <main className="container mx-auto px-4 py-8">
        <div className="flex gap-6">
          {/* Sidebar */}
          <div className="w-80 space-y-4">
            <Card className="glass-card">
              <CardContent className="p-4 space-y-4">
                <Button className="w-full btn-primary justify-start">
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
                <Button variant="outline" className="w-full justify-start">
                  <FileText className="h-4 w-4 mr-2" />
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
              <h1 className="text-xl font-bold">{title}</h1>
            </div>

            {/* Upload Section */}
            <Card className="mb-6">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Gerenciar Documentos</CardTitle>
                  <Button 
                    onClick={() => setShowUploadForm(!showUploadForm)}
                    className="btn-primary"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Novo Documento
                  </Button>
                </div>
              </CardHeader>
              {showUploadForm && (
                <CardContent className="border-t">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="doc-name">Nome do Documento</Label>
                      <Input
                        id="doc-name"
                        value={newDocument.name}
                        onChange={(e) => setNewDocument({...newDocument, name: e.target.value})}
                        placeholder="Digite o nome do documento"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="doc-file">Arquivo</Label>
                      <Input
                        id="doc-file"
                        type="file"
                        onChange={(e) => setNewDocument({...newDocument, file: e.target.files?.[0] || null})}
                        accept=".pdf,.doc,.docx,.xlsx,.xls"
                      />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="doc-description">Descrição</Label>
                      <Textarea
                        id="doc-description"
                        value={newDocument.description}
                        onChange={(e) => setNewDocument({...newDocument, description: e.target.value})}
                        placeholder="Descreva o documento"
                        rows={3}
                      />
                    </div>
                    <div className="md:col-span-2 flex gap-2">
                      <Button onClick={handleUpload} className="btn-primary">
                        <Upload className="h-4 w-4 mr-2" />
                        Enviar Documento
                      </Button>
                      <Button 
                        variant="outline" 
                        onClick={() => setShowUploadForm(false)}
                      >
                        Cancelar
                      </Button>
                    </div>
                  </div>
                </CardContent>
              )}
            </Card>

            {/* Search */}
            <div className="mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Buscar documentos..."
                  className="pl-10"
                />
              </div>
            </div>

            {/* Documents Table */}
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold">Descrição</h3>
                  <h3 className="text-lg font-semibold">Anexo</h3>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {documents.map((doc) => (
                    <div key={doc.id} className="flex items-center justify-between p-4 border border-border rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <span className="w-6 h-6 bg-secondary text-white rounded flex items-center justify-center text-xs">
                            {doc.type === 'PDF' ? '📄' : '📋'}
                          </span>
                          <div>
                            <h4 className="font-medium">{doc.description}</h4>
                            <p className="text-sm text-muted-foreground">
                              {doc.name} • {doc.size} • {doc.uploadDate}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDownload(doc)}
                        >
                          <Download className="h-4 w-4 mr-1" />
                          Baixar
                        </Button>
                        <Button size="sm" variant="outline">
                          <Edit3 className="h-4 w-4 mr-1" />
                          Editar
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDelete(doc.id)}
                        >
                          <Trash2 className="h-4 w-4 mr-1" />
                          Excluir
                        </Button>
                      </div>
                    </div>
                  ))}
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

export default DocumentManagement;