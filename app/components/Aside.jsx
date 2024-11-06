import React from "react";
import {
  GridView,
  PersonOutline,
  ReceiptLong,
  Insights,
  MailOutline,
  Inventory,
  Settings,
  Add,
  Logout,
  Inventory2,
} from "@mui/icons-material";
import Link from 'next/link'; // Importando o Link do Next.js
import Image from 'next/image';

const Aside = () => {
  return (
    <aside className="aside">
      <div className="top">
        <div className="logo">
        <Image src="/img/logo.png" alt="Logo" width={50} height={50} />
        </div>
        <div className="close" id="close-btn">
          <span className="material-icons">close</span>
        </div>
      </div>

      <div className="sidebar">
        <Link href="/dashboard">
          <GridView />
          <h3>Dashboard</h3>
        </Link>
        
        <Link href="/clientes">
          <PersonOutline />
          <h3>Clientes</h3>
        </Link>
        
        <Link href="/pedidos">
          <ReceiptLong />
          <h3>Pedidos</h3>
        </Link>
        
        <Link href="#">
          <Insights />
          <h3>Analytics</h3>
        </Link>
        
        <Link href="#">
          <MailOutline />
          <h3>Mensagens</h3>
          <span className="message-count">26</span>
        </Link>
        
        <Link href="/produto">
          <Inventory2 />
          <h3>Produtos</h3>
        </Link>
        
        <Link href="#">
          <Settings />
          <h3>Configurações</h3>
        </Link>
        
        <Link href="#">
          <Add />
          <h3>Adicionar Produto</h3>
        </Link>

        <Link href="/fornecedores">
          <Inventory />
          <h3>Fornecedores</h3>
        </Link>
        
        <Link href="#">
          <Logout />
          <h3>Sair</h3>
        </Link>
      </div>
    </aside>
  );
};

export default Aside;
