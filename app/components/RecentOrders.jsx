"use client";

import React, { useEffect, useState } from 'react';
import supabase from '../../supabase';
import { useAuth } from '../../context/authContext';

const RecentOrders = () => {
  const { restaurante } = useAuth(); // Obtendo o restaurante do contexto
  const [orders, setOrders] = useState([]); // Estado para armazenar todos os pedidos

  // Função para buscar pedidos do restaurante logado com detalhes do produto e quantidade
  const fetchOrders = async () => {
    try {
      if (!restaurante || !restaurante.id) return;

      // Buscar pedidos relacionados aos produtos do restaurante logado
      const { data, error } = await supabase
        .from("Pedido")
        .select("id, id_produto, quantidade, forma_pagto, status, Produto!inner(id, nome)") // Inclui quantidade e Produto.nome
        .eq("Produto.id_restaurante", restaurante.id)
        .order("id", { ascending: false }); // Ordena por ID, mais recente primeiro

      if (error) {
        console.error("Erro ao buscar pedidos:", error.message);
        return;
      }

      setOrders(data); // Armazena todos os pedidos com os dados do produto
    } catch (error) {
      console.error("Erro ao buscar pedidos:", error.message);
    }
  };

  // Função para atualizar o status do pedido
  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const { error } = await supabase
        .from("Pedido")
        .update({ status: newStatus })
        .eq("id", orderId);

      if (error) {
        console.error("Erro ao atualizar o status do pedido:", error.message);
        return;
      }

      // Atualiza a lista de pedidos localmente após a mudança de status
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.id === orderId ? { ...order, status: newStatus } : order
        )
      );
    } catch (error) {
      console.error("Erro ao atualizar o status do pedido:", error.message);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [restaurante]);

  return (
    <div className="recent-order">
      <h2>Pedidos Recentes</h2>
      <table id="table-order">
        <thead>
          <tr>
            <th>Nome do Produto</th>
            <th>ID do Produto</th>
            <th>Quantidade</th>
            <th>Método de Pagamento</th>
            <th>Status</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {orders.length > 0 ? (
            orders.map((order) => (
              <tr key={order.id}>
                <td>{order.Produto?.nome || "Produto desconhecido"}</td>
                <td>{order.id_produto}</td>
                <td>{order.quantidade}</td> {/* Exibe a quantidade do produto */}
                <td>{order.forma_pagto}</td>
                <td className={order.status === "Entregue" ? "success" : order.status === "Confirmado" ? "confirmed" : "pending"}>
                  {order.status}
                </td>
                <td>
                  {/* Botões para confirmar ou negar o pedido */}
                  {order.status === "Pendente" && (
                    <>
                      <button onClick={() => updateOrderStatus(order.id, "Confirmado")} className="confirm-btn">✔️</button>
                      <button onClick={() => updateOrderStatus(order.id, "Negado")} className="deny-btn">❌</button>
                    </>
                  )}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6">Nenhum pedido encontrado</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default RecentOrders;
