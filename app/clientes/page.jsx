"use client";

import React, { useEffect, useState } from "react";
import supabase from "../../supabase";
import { useAuth } from "../../context/authContext";

const ClientesPage = () => {
  const { restaurante } = useAuth(); // Obtendo o restaurante do contexto
  const [clientes, setClientes] = useState([]); // Estado para armazenar a lista de clientes

  // Função para buscar todos os clientes que fizeram pedidos para o restaurante logado e contar pedidos
  const fetchClientes = async () => {
    try {
      if (!restaurante || !restaurante.id) return;
  
      // Realiza a consulta garantindo que o filtro é aplicado ao id_restaurante do produto diretamente
      const { data, error } = await supabase
        .from("Pedido")
        .select(`
          id_cliente,
          Cliente(id, nome, cpf, telefone, email, preferencias, id_endereco, foto),
          Produto!inner(id_restaurante)
        `)
        .eq("Produto.id_restaurante", restaurante.id);
  
      if (error) {
        console.error("Erro ao buscar clientes:", error.message);
        return;
      }
  
      // Mapeia clientes e conta os pedidos
      const clientesMap = {};
      data.forEach(pedido => {
        if (pedido.Cliente) {
          if (!clientesMap[pedido.Cliente.id]) {
            clientesMap[pedido.Cliente.id] = {
              ...pedido.Cliente,
              quantidadePedidos: 1 // Inicializa a contagem de pedidos
            };
          } else {
            clientesMap[pedido.Cliente.id].quantidadePedidos += 1; // Incrementa a contagem de pedidos
          }
        }
      });
  
      const clientesUnicos = Object.values(clientesMap);
      setClientes(clientesUnicos);
    } catch (error) {
      console.error("Erro ao buscar clientes:", error.message);
    }
  };

  useEffect(() => {
    fetchClientes();
  }, [restaurante]);

  return (
    <main>
      <h1>Clientes</h1>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nome</th>
            <th>CPF</th>
            <th>Telefone</th>
            <th>Email</th>
            <th>Preferências</th>
            <th>ID Endereço</th>
            <th>Quantidade de Pedidos</th>
          </tr>
        </thead>
        <tbody>
          {clientes.length > 0 ? (
            clientes.map(cliente => (
              <tr key={cliente.id}>
                <td>{cliente.id}</td>
                <td>{cliente.nome}</td>
                <td>{cliente.cpf}</td>
                <td>{cliente.telefone}</td>
                <td>{cliente.email}</td>
                <td>{cliente.preferencias}</td>
                <td>{cliente.id_endereco}</td>
                <td>{cliente.quantidadePedidos}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="9">Nenhum cliente encontrado</td>
            </tr>
          )}
        </tbody>
      </table>
    </main>
  );
};

export default ClientesPage;