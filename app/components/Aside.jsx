import React from "react"
import {
  GridView,
  PersonOutline,
  ReceiptLong,
  Insights,
  MailOutline,
  Inventory,
  Settings,
  Logout,
  Inventory2,
} from "@mui/icons-material"
import Link from "next/link" // Importando o Link do Next.js
import Image from "next/image" // Importando o componente de imagem do Next.js
import { useAuth } from "@/context/authContext" // Importando o contexto de autenticação

const Aside = () => {
  const { logout } = useAuth() // Pegando a função de logout do contexto

  return (
    <aside className="aside">
      <div className="top">
        {/* Logo da empresa */}
        <div className="logo">
          {/* Carrega a imagem com prioridade */}
          <Image
            src="/assets/logo-dashboard.png"
            alt="Logo"
            width={50}
            height={50}
            priority
          />
        </div>
        <div className="close" id="close-btn">
          <span className="material-icons">close</span>
        </div>
      </div>

      <div className="sidebar">
        <Link href="/dashboard" className="sidebar-link">
          <GridView />
          <h3>Dashboard</h3>
        </Link>

        <Link href="/clientes" className="sidebar-link">
          <PersonOutline />
          <h3>Clientes</h3>
        </Link>

        <Link href="/pedidos" className="sidebar-link">
          <ReceiptLong />
          <h3>Pedidos</h3>
        </Link>

        <Link href="#" className="sidebar-link">
          <Insights />
          <h3>Analytics</h3>
        </Link>

        <Link href="#" className="sidebar-link">
          <MailOutline />
          <h3>Mensagens</h3>
          <span className="message-count">26</span>
        </Link>

        <Link href="/produto" className="sidebar-link">
          <Inventory2 />
          <h3>Produtos</h3>
        </Link>

        <Link href="/fornecedores" className="sidebar-link">
          <Inventory />
          <h3>Fornecedores</h3>
        </Link>

        <Link href="#" className="sidebar-link">
          <Settings />
          <h3>Configurações</h3>
        </Link>

        {/* Botão de Sair */}
        <button onClick={logout} className="logout-button">
          <Logout />
          <h3>Sair</h3>
        </button>
      </div>
    </aside>
  )
}

export default Aside;
