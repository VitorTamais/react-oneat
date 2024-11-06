import { Analytics } from "@mui/icons-material";
import React from "react";

const Insights = () => {
  return (
    <div className="insights">
      <div className="sales">
        <Analytics className="icon" />
        <div className="middle">
          <div className="left">
            <h3>Total de Vendas</h3>
            <h1>R$25.024,00</h1>
          </div>
          <div className="progress">
            <svg>
              <circle cx="38" cy="38" r="36"></circle>
            </svg>
            <div className="number">
              <p>81%</p>
            </div>
          </div>
        </div>
        <small className="text-muted">Últimas 24 horas</small>
      </div>
      {/* Continue adicionando os outros itens de insights */}
    </div>
  );
};

export default Insights;
