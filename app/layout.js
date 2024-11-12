// app/layout.js
"use client"; // Marcar como Client Component

import React, { useState, useEffect } from 'react'; // Importando os hooks
import Aside from "./components/Aside";
import RightPanel from "./components/RightPanel";
import { AuthProvider, useAuth } from "../context/authContext"; // Importando corretamente o useAuth
import "./globals.css";

export default function RootLayout({ children }) {
  return (
    <html lang="pt-br">
      <body className="conteudo">
        <AuthProvider> {/* Envolva o conteúdo com o AuthProvider */}
          <LayoutContent>{children}</LayoutContent>
        </AuthProvider>
      </body>
    </html>
  );
}

// Componente que decide quando exibir o Aside e o RightPanel
function LayoutContent({ children }) {
  const [isClient, setIsClient] = useState(false); // Adicionando estado para verificar se é cliente
  const { user } = useAuth(); // Usando useAuth

  useEffect(() => {
    // Garantir que o código só execute no lado do cliente
    setIsClient(true);
  }, []);

  if (!isClient) return null; // Evita renderizar no servidor

  return (
    <>
      {user ? ( // Se o usuário estiver logado
        <>
          <Aside />
          {children}
          <RightPanel />
        </>
      ) : (
        <>{children}</> // Caso contrário, apenas renderize o conteúdo
      )}
    </>
  );
}
