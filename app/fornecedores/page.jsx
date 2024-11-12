"use client";
import React, { useEffect, useState } from "react";
import supabase from "@/supabase";
import { ArrowBack, ArrowForward, Delete, Edit } from "@mui/icons-material";
import Swal from "sweetalert2";
import { useAuth } from "../../context/authContext";

const Fornecedores = () => {
  const { restaurante } = useAuth(); // Obter o restaurante do contexto
  const [fornecedores, setFornecedores] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 7;
  const [filtro, setFiltro] = useState("");

  // Função para buscar fornecedores do restaurante logado
  useEffect(() => {
    const fetchFornecedores = async () => {
      if (!restaurante) return;

      try {
        const { data: fornecedoresData, error } = await supabase
          .from("Fornecedor")
          .select(`
            id,
            nome,
            telefone,
            cnpj,
            produto_fornecido,
            endereco ( rua, numero, cidade )
          `)
          .eq("id_restaurante", restaurante.id); // Filtrar pelo restaurante

        if (error) {
          console.error("Erro ao buscar fornecedores: ", error);
          return;
        }

        setFornecedores(fornecedoresData || []);
      } catch (error) {
        console.error("Erro ao buscar fornecedores:", error);
      }
    };

    fetchFornecedores();
  }, [restaurante]);

  // Função para deletar um fornecedor
  const deletarFornecedor = async (id) => {
    Swal.fire({
      title: 'Você tem certeza?',
      text: "Essa ação não pode ser desfeita!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Deletar',
      cancelButtonText: 'Cancelar'
    }).then(async (result) => {
      if (result.isConfirmed) {
        const { error } = await supabase.from("Fornecedor").delete().eq("id", id);
        if (error) {
          Swal.fire('Erro!', 'Houve um erro ao deletar o fornecedor.', 'error');
        } else {
          setFornecedores(fornecedores.filter((fornecedor) => fornecedor.id !== id));
          Swal.fire('Sucesso!', 'Fornecedor deletado com sucesso.', 'success');
        }
      }
    });
  };

  // Função para filtrar fornecedores pelo campo de busca
  const fornecedoresFiltrados = fornecedores.filter((fornecedor) =>
    fornecedor.nome.toLowerCase().includes(filtro.toLowerCase()) ||
    fornecedor.telefone.toLowerCase().includes(filtro.toLowerCase()) ||
    fornecedor.cnpj.toLowerCase().includes(filtro.toLowerCase()) ||
    (fornecedor.endereco && fornecedor.endereco.cidade.toLowerCase().includes(filtro.toLowerCase()))
  );

  const totalPages = Math.ceil(fornecedoresFiltrados.length / recordsPerPage);
  const currentRecords = fornecedoresFiltrados.slice(
    (currentPage - 1) * recordsPerPage,
    currentPage * recordsPerPage
  );

  // Funções para navegação entre páginas
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
            onChange={(e) => setFiltro(e.target.value)}
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
          <tbody>
            {currentRecords.length > 0 ? (
              currentRecords.map((fornecedor) => (
                <tr key={fornecedor.id}>
                  <td>{fornecedor.nome}</td>
                  <td>{fornecedor.telefone}</td>
                  <td>{fornecedor.cnpj}</td>
                  <td>{fornecedor.produto_fornecido}</td>
                  <td>{fornecedor.endereco?.rua || "N/A"}</td>
                  <td>{fornecedor.endereco?.numero || "N/A"}</td>
                  <td>{fornecedor.endereco?.cidade || "N/A"}</td>
                  <td>
                    <button className='edit-btn'><Edit /></button>
                    <button className='delete-btn' onClick={() => deletarFornecedor(fornecedor.id)}><Delete /></button>
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

      <div className="pagination-controls">
        <button disabled={currentPage === 1} onClick={prevPage}><ArrowBack /></button>
        <span>Página {currentPage} de {totalPages}</span>
        <button disabled={currentPage === totalPages} onClick={nextPage}><ArrowForward /></button>
      </div>
    </main>
  );
};

export default Fornecedores;
