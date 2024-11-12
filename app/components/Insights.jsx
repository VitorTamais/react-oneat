import React, { useEffect, useState } from "react";
import { Analytics, Visibility, ShoppingCart } from "@mui/icons-material";
import supabase from "../../supabase";
import { useAuth } from "../../context/authContext";

const Insights = () => {
  const { restaurante } = useAuth(); // Obtendo o restaurante do contexto
  const [totalSales, setTotalSales] = useState(0); // Inicializando o total de vendas
  const [totalViews, setTotalViews] = useState(0);
  const [orders, setOrders] = useState([]); // Estado para armazenar todos os pedidos
  const [progressPercent, setProgressPercent] = useState(0); // Estado para armazenar a porcentagem do gráfico
  const [mostOrderedProduct, setMostOrderedProduct] = useState(null); // Estado para armazenar o produto mais pedido
  const [meta, setMeta] = useState(1000); // Meta de vendas inicial

  // Função para buscar o total de visualizações do restaurante logado
  const fetchTotalViews = async () => {
    try {
      if (!restaurante || !restaurante.id) return;

      const { data, error } = await supabase
        .from("Restaurante")
        .select("visualizacoes")
        .eq("id", restaurante.id)
        .single();

      if (error) {
        console.error("Erro ao buscar visualizações:", error.message);
        return;
      }
      if (data && data.visualizacoes !== undefined) {
        setTotalViews(data.visualizacoes);
      }
    } catch (error) {
      console.error("Erro ao buscar visualizações:", error.message);
    }
  };

  // Função para buscar todos os pedidos e calcular o total de vendas apenas para pedidos confirmados
  const fetchOrdersAndTotalSales = async () => {
    try {
      if (!restaurante || !restaurante.id) return;

      // Buscar pedidos relacionados aos produtos do restaurante logado
      const { data, error } = await supabase
        .from("Pedido")
        .select("id, quantidade, status, preco, Produto!inner(id, nome, id_restaurante)")
        .eq("Produto.id_restaurante", restaurante.id);

      if (error) {
        console.error("Erro ao buscar pedidos:", error.message);
        return;
      }

      if (data) {
        // Filtra apenas os pedidos confirmados
        const pedidosConfirmados = data.filter(pedido => pedido.status === "Confirmado");
        setOrders(pedidosConfirmados);

        // Calcula o total de vendas para os pedidos confirmados (quantidade * preço unitário)
        const total = pedidosConfirmados.reduce((acc, pedido) => acc + pedido.preco, 0);
        setTotalSales(total);

        // Atualiza a porcentagem de progresso com base na meta
        const percent = meta > 0 ? Math.min((total / meta) * 100, 100) : 0;
        setProgressPercent(percent);

        // Calcula o produto mais pedido
        const produtosQuantidades = {};
        pedidosConfirmados.forEach(pedido => {
          const produtoNome = pedido.Produto.nome;
          if (produtosQuantidades[produtoNome]) {
            produtosQuantidades[produtoNome] += pedido.quantidade;
          } else {
            produtosQuantidades[produtoNome] = pedido.quantidade;
          }
        });

        const produtoMaisPedido = Object.entries(produtosQuantidades).reduce((acc, [nome, quantidade]) => {
          return quantidade > acc.quantidade ? { nome, quantidade } : acc;
        }, { nome: null, quantidade: 0 });

        setMostOrderedProduct(produtoMaisPedido);
      }
    } catch (error) {
      console.error("Erro ao buscar pedidos:", error.message);
    }
  };

  useEffect(() => {
    fetchTotalViews();
    fetchOrdersAndTotalSales();
  }, [restaurante, meta]);

  // Handler para mudar a meta
  const handleMetaChange = (e) => {
    const newMeta = parseFloat(e.target.value);
    setMeta(isNaN(newMeta) ? 0 : newMeta);
  };

  return (
    <div className="insights">
      {/* Total de Vendas */}
      <div className="sales">
        <Analytics className="icon" />
        <div className="middle">
          <div className="left">
            <h3>Total de Vendas</h3>
            <h1>R${totalSales.toLocaleString("pt-BR")}</h1>
            <div className="meta-input">
              <label htmlFor="meta">Meta de Vendas (R$):</label>
              <input
                type="number"
                id="meta"
                value={meta}
                onChange={handleMetaChange}
                placeholder="Defina sua meta"
              />
            </div>
          </div>
          <div className="progress">
            <svg>
              <circle cx="38" cy="38" r="36"></circle>
            </svg>
            <div className="number">
              <p>{progressPercent.toFixed(0)}%</p>
            </div>
          </div>
        </div>
        <small className="text-muted">Últimas 24 horas</small>
      </div>

      {/* Total de Visualizações */}
      <div className="views">
        <Visibility className="icon" />
        <div className="middle">
          <div className="left">
            <h3>Total de Visualizações</h3>
            <h1>{totalViews}</h1>
          </div>
        </div>
        <small className="text-muted">Visualizações totais</small>
      </div>

      {/* Produto Mais Pedido */}
      {mostOrderedProduct && (
        <div className="most-ordered">
          <ShoppingCart className="icon" />
          <div className="middle">
            <div className="left">
              <h3>Produto Mais Pedido</h3>
              <h1>{mostOrderedProduct.nome}</h1>
              <p>Quantidade Vendida: {mostOrderedProduct.quantidade}</p>
            </div>
          </div>
          <small className="text-muted">Produto com maior venda</small>
        </div>
      )}
    </div>
  );
};

export default Insights;
