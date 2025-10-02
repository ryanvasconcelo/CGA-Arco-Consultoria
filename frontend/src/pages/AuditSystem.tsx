import { useState } from "react";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { fetchAuditLogs, fetchAuditStats } from "@/services/auditService";
import { Search, Filter, Calendar, User, Activity, Eye, Shield, Clock, Loader2, AlertTriangle, ArrowLeft } from "lucide-react";
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
import { SimplePagination } from "@/components/SimplePagination";

const actionTypes: Record<string, string> = {
  CREATE_USER: "Criar Usuário",
  UPDATE_USER: "Atualizar Usuário",
  DELETE_USER: "Remover Usuário",
  CREATE_COMPANY: "Criar Empresa",
  UPDATE_COMPANY: "Atualizar Empresa",
  DELETE_COMPANY: "Remover Empresa",
  ASSOCIATE_PRODUCT_TO_COMPANY: "Associar Produto",
  DISASSOCIATE_PRODUCT_FROM_COMPANY: "Desassociar Produto",
  ASSOCIATE_USER_TO_PRODUCT: "Associar Usuário a Produto",
  DISASSOCIATE_USER_FROM_PRODUCT: "Desassociar Usuário de Produto",
  ASSOCIATE_USER_TO_PERMISSION: "Conceder Permissão",
  DISASSOCIATE_USER_FROM_PERMISSION: "Revogar Permissão",
};

const getSeverityFromAction = (action: string): string => {
  if (action.includes('DELETE') || action.includes('REMOVE')) return 'error';
  if (action.includes('UPDATE')) return 'warning';
  return 'info';
};

const severityColors: Record<string, string> = {
  info: "bg-blue-500/20 text-blue-600 border-blue-500/30",
  warning: "bg-yellow-500/20 text-yellow-600 border-yellow-500/30",
  error: "bg-red-500/20 text-red-600 border-red-500/30",
  success: "bg-green-500/20 text-green-600 border-green-500/30"
};

export default function AuditSystem() {
  const [searchTerm, setSearchTerm] = useState("");
  const [actionFilter, setActionFilter] = useState("all");
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const [selectedLog, setSelectedLog] = useState<any>(null);

  // Buscar logs de auditoria
  const { data: auditData, isLoading, isError } = useQuery({
    queryKey: ['auditLogs', actionFilter, page, searchTerm],
    queryFn: () => fetchAuditLogs({
      action: actionFilter !== 'all' ? actionFilter : undefined,
      page,
      limit: pageSize,
      searchTerm: searchTerm,
    }),
    placeholderData: keepPreviousData,
  });

  const logs = auditData?.logs || [];
  const totalCount = auditData?.pagination.total || 0;

  // Buscar estatísticas
  const { data: stats } = useQuery({
    queryKey: ['auditStats'],
    queryFn: fetchAuditStats,
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

  const getActionDescription = (log: any): string => {
    const actionName = actionTypes[log.action] || log.action;
    const userName = log.details?.userName || 'Sistema';
    // CORREÇÃO: Adiciona verificação para log.company antes de acessar .name
    const companyName = log.details?.companyName || log.company?.name || 'Empresa Removida';

    switch (log.action) {
      case 'CREATE_USER':
        return `Criou o usuário ${userName}`;
      case 'UPDATE_USER':
        return `Atualizou o usuário ${userName}`;
      case 'DELETE_USER':
        return `Removeu o usuário ${userName}`;
      case 'CREATE_COMPANY':
        return `Criou a empresa ${companyName}`;
      case 'UPDATE_COMPANY':
        return `Atualizou a empresa ${companyName}`;
      case 'DELETE_COMPANY':
        return `Removeu a empresa ${companyName}`;
      default:
        return actionName;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      <Header />

      <main className="container mx-auto px-6 py-8">
        {/* Header Section */}
        <div className="glass-card rounded-xl p-6 mb-8 border border-white/10">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary-hover bg-clip-text text-transparent">Sistema de Auditoria</h1>
              <p className="text-muted-foreground mt-2">
                Monitore todas as atividades e alterações no sistema CGA
              </p>
            </div>
            <div className="flex gap-3">
              <Button onClick={() => window.location.href = '/admin/users'} variant="outline" className="border-border hover:bg-muted/50">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Voltar para Usuários
              </Button>
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
                  <p className="text-2xl font-bold">{stats?.totalEvents || 0}</p>
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
                  <p className="text-2xl font-bold">{stats?.activeUsers || 0}</p>
                </div>
                <User className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card border-white/10">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Eventos Recentes</p>
                  <p className="text-2xl font-bold">{stats?.recentEvents || 0}</p>
                </div>
                <Clock className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card border-white/10">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Últimas 24h</p>
                  <p className="text-sm font-medium">{stats?.recentEvents || 0} eventos</p>
                </div>
                <Shield className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Audit Logs Table */}
        <Card className="glass-card border-white/10">
          <CardHeader>
            <CardTitle className="text-lg">
              Log de Auditoria ({totalCount} eventos)
            </CardTitle>
          </CardHeader>
          <CardContent>
            {/* Loading State */}
            {isLoading && (
              <div className="flex items-center justify-center py-10">
                <Loader2 className="h-6 w-6 animate-spin mr-3" />
                Carregando logs de auditoria...
              </div>
            )}

            {/* Error State */}
            {isError && (
              <div className="flex items-center justify-center py-10 text-destructive">
                <AlertTriangle className="h-6 w-6 mr-3" />
                Erro ao carregar logs de auditoria
              </div>
            )}

            {/* Table */}
            {!isLoading && !isError && (
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
                    {logs.map((log) => {
                      const severity = getSeverityFromAction(log.action);
                      return (
                        <TableRow key={log.id} className="hover:bg-muted/30 transition-colors">
                          <TableCell>
                            <div className="text-sm">
                              {formatTimestamp(log.createdAt)}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="font-medium">
                              {log.author ? `${log.author.name} (${log.author.role})` : 'Sistema'}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className="font-mono">
                              {actionTypes[log.action] || log.action}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="max-w-xs truncate">{getActionDescription(log)}</div>
                          </TableCell>
                          <TableCell>
                            <div className="text-sm">{log.company?.name || <span className="italic text-muted-foreground">N/A</span>}</div>
                          </TableCell>
                          <TableCell>
                            <Badge className={severityColors[severity]}>
                              {getSeverityIcon(severity)}
                              <span className="ml-1 capitalize">{severity}</span>
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
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            )}
            {!isLoading && !isError && logs.length > 0 && (
              <SimplePagination
                page={page}
                pageSize={pageSize}
                totalCount={totalCount}
                onPageChange={setPage}
              />
            )}
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
                    <p className="font-medium">{formatTimestamp(selectedLog.createdAt)}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Usuário</label>
                    <p className="font-medium">
                      {selectedLog.author ? `${selectedLog.author.name} (${selectedLog.author.role})` : 'Sistema'}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Empresa</label>
                    <p className="font-medium">{selectedLog.company?.name || 'Empresa Removida'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Ação</label>
                    <Badge variant="outline">
                      {actionTypes[selectedLog.action] || selectedLog.action}
                    </Badge>
                  </div>
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