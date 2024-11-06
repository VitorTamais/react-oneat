import React from 'react';
import { AddBox, LocalMall, ShoppingCart } from '@mui/icons-material';

const SalesAnalytics = () => {
  return (
    <div className="sales-analytics">
      <h2>Análise de Vendas</h2>
      
      <div className="item online">
        <div className="icon">
          <ShoppingCart />
        </div>
        <div className="right">
          <div className="info">
            <h3>PEDIDOS ONLINE</h3>
            <small className="text-muted">Últimas 24 horas</small>
          </div>
          <h5 className="success">+39%</h5>
          <h3>3849</h3>
        </div>
      </div>

      <div className="item offline">
        <div className="icon">
          <LocalMall />
        </div>
        <div className="right">
          <div className="info">
            <h3>PEDIDOS OFFLINE</h3>
            <small className="text-muted">Últimas 24 horas</small>
          </div>
          <h5 className="success">+17%</h5>
          <h3>1849</h3>
        </div>
      </div>

      <div className="item add-product">
        <div>
          <AddBox />
          <h3>Adicionar Produto</h3>
        </div>
      </div>
    </div>
  );
};

export default SalesAnalytics;
