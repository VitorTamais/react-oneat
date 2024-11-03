"use client"; // Adiciona esta linha no início para indicar que este é um Client Component

import React, { useEffect, useState } from "react";
import supabase from "@/supabase";
import { ArrowBack, ArrowForward, Delete, Edit } from "@mui/icons-material";
import Swal from "sweetalert2"; // Certifique-se de que o SweetAlert2 está instalado
import Aside from "../components/Aside";

const Fornecedores = () => {
  const [fornecedores, setFornecedores] = useState([]);
  const [currentPage, setCurrentPage] = useState(1); // Página atual
  const recordsPerPage = 7; // Limite de registros por página
  const [filtro, setFiltro] = useState(""); // Estado para o filtro

  useEffect(() => {
    const fetchFornecedores = async () => {
      const { data: fornecedoresData, error } = await supabase
        .from("Fornecedor")
        .select(`
          id,
          nome,
          telefone,
          cnpj,
          produto_fornecido,
          endereco ( rua, numero, cidade)
        `);

      if (error) {
        console.error("Erro ao buscar fornecedores: ", error);
      } else {
        setFornecedores(fornecedoresData); // Armazena os fornecedores com seus endereços
      }
    };

    fetchFornecedores();
  }, []);

  // Função para deletar um fornecedor
  const deletarFornecedor = async (id) => {
    // Exibir um alerta de confirmação
    Swal.fire({
      title: 'Você tem certeza?',
      text: "Essa ação não pode ser desfeita!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Deletar',
      cancelButtonText: 'Cancelar',
      customClass: {
        confirmButton: 'btn-confirm', // Classe personalizada para o botão de confirmação
        cancelButton: 'btn-cancel',
      }
    }).then(async (result) => {
      if (result.isConfirmed) {
        // Se o usuário confirmar, deletar o fornecedor
        const { error } = await supabase
          .from("Fornecedor")
          .delete()
          .eq("id", id);

        if (error) {
          Swal.fire('Erro!', 'Houve um erro ao deletar o fornecedor.', 'error');
          console.error("Erro ao deletar fornecedor: ", error);
        } else {
          // Atualizar a lista de fornecedores após a exclusão
          setFornecedores(fornecedores.filter((fornecedor) => fornecedor.id !== id));
          Swal.fire({
            title: 'Sucesso!',
            text: 'Fornecedor deletado com sucesso.',
            icon: 'success',
            confirmButtonText: 'OK',
            customClass: {
              confirmButton: 'btn-confirm', // Classe personalizada para o botão de confirmação
            }
          });
        }
      }
    });
  };

  // Calcula o número total de páginas com base nos fornecedores filtrados
  const totalPages = Math.ceil(
    fornecedores.filter((fornecedor) =>
      fornecedor.nome.toLowerCase().includes(filtro.toLowerCase()) ||
      fornecedor.telefone.toLowerCase().includes(filtro.toLowerCase()) ||
      fornecedor.cnpj.toLowerCase().includes(filtro.toLowerCase()) ||
      (fornecedor.endereco && fornecedor.endereco.cidade.toLowerCase().includes(filtro.toLowerCase()))
    ).length / recordsPerPage
  );

  // Obtém os fornecedores filtrados
  const fornecedoresFiltrados = fornecedores.filter((fornecedor) =>
    fornecedor.nome.toLowerCase().includes(filtro.toLowerCase()) ||
    fornecedor.telefone.toLowerCase().includes(filtro.toLowerCase()) ||
    fornecedor.cnpj.toLowerCase().includes(filtro.toLowerCase()) ||
    (fornecedor.endereco && fornecedor.endereco.cidade.toLowerCase().includes(filtro.toLowerCase()))
  );

  // Obtém os fornecedores da página atual
  const currentRecords = fornecedoresFiltrados.slice(
    (currentPage - 1) * recordsPerPage,
    currentPage * recordsPerPage
  );

  // Funções para navegar entre as páginas
  const nextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const prevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  return (
      <main>
        <section className="supplier-header">
          <h1>Fornecedores</h1>
        </section>

        <div className="sup-supplier">
          <div className="add-supplier">
            <a href="/addFornecedor">
              <button>Adicionar</button>
            </a>
          </div>
          <section className="filter-section">
          <input
            type="text"
            placeholder="Filtrar por Nome, Telefone, CNPJ ou Cidade"
            value={filtro}
            onChange={(e) => setFiltro(e.target.value)} // Atualiza o valor do filtro
          />
        </section>
          <div className="stats-total">
            <p><b>Total de Registros:</b> {fornecedores.length}</p>
          </div>
        </div>

        <section className="suppliers-table">
          <table>
            <thead>
              <tr>
                <th>Nome</th>
                <th>Telefone</th>
                <th>Empresa</th>
                <th>Produto Principal</th>
                <th>Rua</th>
                <th>Número</th>
                <th>Cidade</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody id="supplier-list">
              {currentRecords.length > 0 ? (
                currentRecords.map((fornecedor, index) => (
                  <tr key={fornecedor.id}>
                    <td>{fornecedor.nome}</td>
                    <td>{fornecedor.telefone}</td>
                    <td>{fornecedor.cnpj}</td>
                    <td>{fornecedor.produto_fornecido}</td>
                    <td>{fornecedor.endereco ? fornecedor.endereco.rua : "N/A"}</td>
                    <td>{fornecedor.endereco ? fornecedor.endereco.numero : "N/A"}</td>
                    <td>{fornecedor.endereco ? fornecedor.endereco.cidade: "N/A"}</td>
                    <td>
                      <button className='edit-btn' onClick={() => editarFornecedor(index)}>
                        <Edit />
                      </button>
                      <button className='delete-btn' onClick={() => deletarFornecedor(fornecedor.id)}>
                        <Delete />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8">Nenhum fornecedor encontrado</td>
                </tr>
              )}
            </tbody>
          </table>
        </section>

        {/* Controles de paginação */}
        <div className="pagination-controls">
          <button disabled={currentPage === 1} onClick={prevPage}>
            <ArrowBack />
          </button>
          <span>Página {currentPage} de {totalPages}</span>
          <button disabled={currentPage === totalPages} onClick={nextPage}>
            <ArrowForward />
          </button>
        </div>
      </main>
  );
};

export default Fornecedores;
