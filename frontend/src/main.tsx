// frontend/src/main.tsx
import React from 'react';
import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { AuthProvider } from "./contexts/AuthContext"; // <<< IMPORTE AQUI
import { Toaster } from "@/components/ui/sonner";

createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
        {/* Envolvemos o App com o AuthProvider */}
        <AuthProvider>
            <App />
            <Toaster />
        </AuthProvider>
    </React.StrictMode>
);