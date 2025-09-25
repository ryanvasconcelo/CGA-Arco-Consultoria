// frontend/src/App.tsx
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute"; // Nosso protetor de rotas

// Páginas
import Index from "./pages/Index";
import UserManagement from "./pages/UserManagement";
import CompanyManagement from "./pages/CompanyManagement";
import Contact from "./pages/Contact";
import Login from "./pages/Login";
import WhistleblowerChannel from "./pages/WhistleblowerChannel";
import SolutionsCatalog from "./pages/SolutionsCatalog";
import NotFound from "./pages/NotFound";
import ArcoPortusHome from "./pages/arco-portus/ArcoPortusHome";
import CondicoesUso from "./pages/CondicoesUso";
import PoliticaCookies from "./pages/PoliticaCookies";
import PoliticaPrivacidade from "./pages/PoliticaPrivacidade";


const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* ROTA PÚBLICA */}
          <Route path="/login" element={<Login />} />

          {/* ROTAS PRIVADAS (TODO O RESTO) */}
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<Index />} />
            <Route path="/admin/users" element={<UserManagement />} />
            <Route path="/admin/companies" element={<CompanyManagement />} />
            <Route path="/contato" element={<Contact />} />
            <Route path="/canal-denuncias" element={<WhistleblowerChannel />} />
            <Route path="/catalogo-solucoes" element={<SolutionsCatalog />} />
            <Route path="/arco-portus" element={<ArcoPortusHome />} />
            <Route path="/condicoes-uso" element={<CondicoesUso />} />
            <Route path="/politica-cookies" element={<PoliticaCookies />} />
            <Route path="/politica-privacidade" element={<PoliticaPrivacidade />} />

          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;