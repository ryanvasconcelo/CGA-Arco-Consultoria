import { useState } from "react";
import { Search, Filter, Calendar, User, Activity, Eye, Shield, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Header from "@/components/Header";

// Mock audit data
const mockAuditLogs = [
  {
    id: "1",
    action: "CREATE_USER",
    description: "Criou usuário 'Maria Santos'",
    user: "João Silva (Admin)",
    company: "Porto Chibatão S.A.",
    timestamp: "2024-01-15T14:30:00",
    severity: "info",
    details: {
      targetUser: "Maria Santos",
      role: "USER",
      email: "maria@email.com"
    }
  },
  {
    id: "2",
    action: "UPDATE_COMPANY",
    description: "Atualizou configurações da empresa",
    user: "Admin Sistema (Super Admin)",
    company: "Porto Chibatão S.A.",
    timestamp: "2024-01-15T13:15:00",
    severity: "warning",
    details: {
      changedFields: ["services", "visual_identity"],
      servicesAdded: ["arco-portus"]
    }
  },
  {
    id: "3",
    action: "GRANT_PERMISSION",
    description: "Concedeu permissão de acesso ao Arco Portus",
    user: "João Silva (Admin)",
    company: "Porto Chibatão S.A.",
    timestamp: "2024-01-15T12:45:00",
    severity: "info",
    details: {
      targetUser: "Carlos Oliveira",
      service: "arco-portus",
      permissions: ["read", "write"]
    }
  },
  {
    id: "4",
    action: "DELETE_USER",
    description: "Removeu usuário 'Pedro Costa'",
    user: "Admin Sistema (Super Admin)",
    company: "Empresa Marítima Ltda",
    timestamp: "2024-01-15T11:20:00",
    severity: "error",
    details: {
      targetUser: "Pedro Costa",
      reason: "Desligamento da empresa"
    }
  },
  {
    id: "5",
    action: "LOGIN",
    description: "Realizou login no sistema",
    user: "Maria Santos (User)",
    company: "Porto Chibatão S.A.",
    timestamp: "2024-01-15T09:30:00",
    severity: "info",
    details: {
      ipAddress: "192.168.1.100",
      userAgent: "Chrome 120.0"
    }
  }
];

const actionTypes = {
  CREATE_USER: "Criar Usuário",
  UPDATE_USER: "Atualizar Usuário",
  DELETE_USER: "Remover Usuário",
  CREATE_COMPANY: "Criar Empresa",
  UPDATE_COMPANY: "Atualizar Empresa",
  DELETE_COMPANY: "Remover Empresa",
  GRANT_PERMISSION: "Conceder Permissão",
  REVOKE_PERMISSION: "Revogar Permissão",
  LOGIN: "Login",
  LOGOUT: "Logout"
};

const severityColors = {
  info: "bg-blue-500/20 text-blue-600 border-blue-500/30",
  warning: "bg-yellow-500/20 text-yellow-600 border-yellow-500/30",
  error: "bg-red-500/20 text-red-600 border-red-500/30",
  success: "bg-green-500/20 text-green-600 border-green-500/30"
};

export default function AuditSystem() {
  const [auditLogs] = useState(mockAuditLogs);
  const [searchTerm, setSearchTerm] = useState("");
  const [actionFilter, setActionFilter] = useState("all");
  const [severityFilter, setSeverityFilter] = useState("all");
  const [selectedLog, setSelectedLog] = useState<any>(null);

  const filteredLogs = auditLogs.filter(log => {
    const matchesSearch = log.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.company.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesAction = actionFilter === "all" || log.action === actionFilter;
    const matchesSeverity = severityFilter === "all" || log.severity === severityFilter;

    return matchesSearch && matchesAction && matchesSeverity;
  });

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString('pt-BR');
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'error': return <Shield className="h-4 w-4" />;
      case 'warning': return <Activity className="h-4 w-4" />;
      default: return <Eye className="h-4 w-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      <Header />

      <main className="container mx-auto px-6 py-8">
        {/* Header Section */}
        <div className="glass-card rounded-xl p-6 mb-8 border border-white/10">
          <div className="flex items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
                Sistema de Auditoria
              </h1>
              <p className="text-muted-foreground mt-2">
                Monitore todas as atividades e alterações no sistema CGA
              </p>
            </div>
          </div>
        </div>

        {/* Filters Section */}
        <Card className="mb-6 glass-card border-white/10">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filtros e Busca
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Buscar logs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 glass-input"
                />
              </div>

              <Select value={actionFilter} onValueChange={setActionFilter}>
                <SelectTrigger className="glass-input">
                  <SelectValue placeholder="Tipo de Ação" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas as ações</SelectItem>
                  {Object.entries(actionTypes).map(([key, label]) => (
                    <SelectItem key={key} value={key}>{label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={severityFilter} onValueChange={setSeverityFilter}>
                <SelectTrigger className="glass-input">
                  <SelectValue placeholder="Severidade" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas</SelectItem>
                  <SelectItem value="info">Info</SelectItem>
                  <SelectItem value="warning">Aviso</SelectItem>
                  <SelectItem value="error">Erro</SelectItem>
                </SelectContent>
              </Select>

              <Button variant="outline" className="hover-lift">
                <Calendar className="mr-2 h-4 w-4" />
                Filtrar por Data
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <Card className="glass-card border-white/10">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total de Eventos</p>
                  <p className="text-2xl font-bold">{auditLogs.length}</p>
                </div>
                <Activity className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card border-white/10">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Usuários Ativos</p>
                  <p className="text-2xl font-bold">12</p>
                </div>
                <User className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card border-white/10">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Eventos Críticos</p>
                  <p className="text-2xl font-bold text-red-500">1</p>
                </div>
                <Shield className="h-8 w-8 text-red-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card border-white/10">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Última Atividade</p>
                  <p className="text-sm font-medium">Há 2 horas</p>
                </div>
                <Clock className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Audit Logs Table */}
        <Card className="glass-card border-white/10">
          <CardHeader>
            <CardTitle className="text-lg">
              Log de Auditoria ({filteredLogs.length} eventos)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border border-white/10 overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-muted/50">
                    <TableHead>Data/Hora</TableHead>
                    <TableHead>Usuário</TableHead>
                    <TableHead>Ação</TableHead>
                    <TableHead>Descrição</TableHead>
                    <TableHead>Empresa</TableHead>
                    <TableHead>Severidade</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredLogs.map((log) => (
                    <TableRow key={log.id} className="hover:bg-muted/30 transition-colors">
                      <TableCell>
                        <div className="text-sm">
                          {formatTimestamp(log.timestamp)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">{log.user}</div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="font-mono">
                          {actionTypes[log.action as keyof typeof actionTypes]}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="max-w-xs truncate">{log.description}</div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">{log.company}</div>
                      </TableCell>
                      <TableCell>
                        <Badge className={severityColors[log.severity as keyof typeof severityColors]}>
                          {getSeverityIcon(log.severity)}
                          <span className="ml-1 capitalize">{log.severity}</span>
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setSelectedLog(log)}
                          className="hover:bg-muted/50"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Log Details Modal */}
        {selectedLog && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="glass-card border-white/10 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
              <div className="p-6 border-b border-white/10">
                <h3 className="text-xl font-bold">Detalhes do Evento</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedLog(null)}
                  className="absolute top-4 right-4"
                >
                  ×
                </Button>
              </div>
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Data/Hora</label>
                    <p className="font-medium">{formatTimestamp(selectedLog.timestamp)}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Usuário</label>
                    <p className="font-medium">{selectedLog.user}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Empresa</label>
                    <p className="font-medium">{selectedLog.company}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Severidade</label>
                    <Badge className={severityColors[selectedLog.severity as keyof typeof severityColors]}>
                      {selectedLog.severity}
                    </Badge>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Descrição</label>
                  <p className="font-medium">{selectedLog.description}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Detalhes Adicionais</label>
                  <pre className="bg-muted/50 p-3 rounded text-sm overflow-x-auto">
                    {JSON.stringify(selectedLog.details, null, 2)}
                  </pre>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}