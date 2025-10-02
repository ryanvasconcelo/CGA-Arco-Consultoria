import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import RoleProtectedRoute from "./components/RoleProtectedRoute";
import ForceResetPassword from "./pages/ForceResetPassword"
import Index from "./pages/Index";
import UserManagement from "./pages/UserManagement";
import Contact from "./pages/Contact";
import WhistleblowerChannel from "./pages/WhistleblowerChannel";
import SolutionsCatalog from "./pages/SolutionsCatalog";
import NotFound from "./pages/NotFound";
import CondicoesUso from "./pages/CondicoesUso";
import PoliticaCookies from "./pages/PoliticaCookies";
import PoliticaPrivacidade from "./pages/PoliticaPrivacidade";
import CompanyManagement from "./pages/CompanyManagement";
import AuditSystem from "./pages/AuditSystem"
import Login from "./pages/Login";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/force-reset-password" element={<ForceResetPassword />} />

          {/* Protected Routes - All authenticated users */}
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<Index />} />
          </Route>

          {/* Admin Only Routes */}
          <Route element={<ProtectedRoute />}>
            <Route element={<RoleProtectedRoute allowedRoles={['ADMIN', 'SUPER_ADMIN']} />}>
              <Route path="/admin/users" element={<UserManagement />} />
              <Route path="/admin/companies" element={<CompanyManagement />} />
              <Route path="/admin/audit" element={<AuditSystem />} />
              <Route path="/contato" element={<Contact />} />
              <Route path="/canal-denuncias" element={<WhistleblowerChannel />} />
              <Route path="/catalogo-solucoes" element={<SolutionsCatalog />} />
              <Route path="/condicoes-uso" element={<CondicoesUso />} />
              <Route path="/politica-cookies" element={<PoliticaCookies />} />
              <Route path="/politica-privacidade" element={<PoliticaPrivacidade />} />
              <Route path="/arco-portus/condicoes-uso" element={<CondicoesUso />} />
              <Route path="/arco-portus/politica-cookies" element={<PoliticaCookies />} />
              <Route path="/arco-portus/politica-privacidade" element={<PoliticaPrivacidade />} />
            </Route>
          </Route>

          {/* 404 - Must be last */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;