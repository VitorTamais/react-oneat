// pages/dashboard.js
"use client";

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/context/authContext'; // Importando o contexto de autenticação
import Insights from '../components/Insights';
import RecentOrders from '../components/RecentOrders';
import SalesAnalytics from '../components/SalesAnalytics';
import style from "../globals.css";
import supabase from '@/supabase';

export default function Dashboard() {
  const { user } = useAuth(); // Acessando o usuário logado a partir do contexto
  const [dadosRestaurante, setDadosRestaurante] = useState(null);

  useEffect(() => {
    const fetchDadosRestaurante = async () => {
      if (user && user.id_restaurante) {
        const { data, error } = await supabase
          .from('Restaurante')
          .select('*')
          .eq('id', user.id_restaurante); // Usando o id_restaurante do contexto

        if (!error && data.length > 0) {
          setDadosRestaurante(data[0]);
        }
      }
    };

    fetchDadosRestaurante();
  }, [user]);

  return (
    <main>
      <h1>Dashboard</h1>
      {/* Verifica se os dados do restaurante estão disponíveis e exibe o nome */}
      <h2>{dadosRestaurante ? dadosRestaurante.nome : 'Carregando...'}</h2> 
      
      <div className="date">
        <input type="date" />
      </div>
      <div className='flex flex-row'>
        <Insights />
        <Insights />
        <Insights />
      </div>
      <RecentOrders />
    </main>
  );
};
