"use client";

import React from 'react';
import Insights from '../components/Insights';
import RecentOrders from '../components/RecentOrders';
import SalesAnalytics from '../components/SalesAnalytics';
import style from "../globals.css"
import { useEffect, useState } from 'react';
import { getCookie } from 'cookies-next';
import supabase from '@/supabase';

export default function Dashboard() {
  const [dadosRestaurante, setDadosRestaurante] = useState(null);

  useEffect(() => {
    const fetchDadosRestaurante = async () => {
      const idRestaurante = getCookie('id_restaurante');
      
      if (idRestaurante) {
        const { data, error } = await supabase
          .from('Restaurante')
          .select('*')
          .eq('id', idRestaurante);
        
        if (!error) {
          setDadosRestaurante(data[0]);
        }
      }
    };

    fetchDadosRestaurante();
  }, []);

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
      <div className="right">
        <SalesAnalytics />
      </div>
    </main>
  );
};


