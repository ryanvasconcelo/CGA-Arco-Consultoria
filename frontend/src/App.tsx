import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";

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
          {/* CGA Routes */}
          <Route path="/login" element={<Login />} />

          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<Index />} />
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

          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;