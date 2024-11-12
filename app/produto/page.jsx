"use client"

import React, { useEffect, useState } from "react"
import supabase from "@/supabase"
import { ArrowBack, ArrowForward, Delete, Edit } from "@mui/icons-material"
import Swal from "sweetalert2"
import Aside from "../components/Aside" // Verifique se o caminho está correto para o seu projeto
import "../styles/styles.css"
import { useAuth } from "@/context/authContext"

const Produtos = () => {
  const { user } = useAuth()
  const [produtos, setProdutos] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const recordsPerPage = 7
  const [filtro, setFiltro] = useState("")

  useEffect(() => {
    const fetchProdutos = async () => {
      if (!user || !user.id_restaurante) {
        console.error("Restaurante não autenticado.")
        return
      }

      const { data: produtosData, error } = await supabase
        .from("Produto")
        .select("id, nome, preco, descricao, categoria")
        .eq("id_restaurante", user.id_restaurante)

      if (error) {
        console.error("Erro ao buscar produtos: ", error)
      } else {
        setProdutos(produtosData || [])
      }
    }

    fetchProdutos()
  }, [user])

  const deletarProduto = async (id) => {
    Swal.fire({
      title: "Você tem certeza?",
      text: "Essa ação não pode ser desfeita!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Deletar",
      cancelButtonText: "Cancelar",
    }).then(async (result) => {
      if (result.isConfirmed) {
        const { error } = await supabase
          .from("Produto")
          .delete()
          .eq("id", id)
          .eq("id_restaurante", user.id_restaurante)

        if (error) {
          Swal.fire("Erro!", "Houve um erro ao deletar o produto.", "error")
        } else {
          setProdutos(produtos.filter((produto) => produto.id !== id))
          Swal.fire("Sucesso!", "Produto deletado com sucesso.", "success")
        }
      }
    })
  }

  const totalPages = Math.ceil(
    produtos.filter((produto) =>
      produto.nome.toLowerCase().includes(filtro.toLowerCase())
    ).length / recordsPerPage
  )

  const produtosFiltrados = produtos.filter((produto) =>
    produto.nome.toLowerCase().includes(filtro.toLowerCase())
  )

  const currentRecords = produtosFiltrados.slice(
    (currentPage - 1) * recordsPerPage,
    currentPage * recordsPerPage
  )

  const nextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1)
  }

  const prevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1)
  }

  return (
    <div className="main-container">
      <main className="content-container">
        <section className="product-header">
          <h1>Produtos</h1>
        </section>

        <div className="product-controls">
          <div className="controls-row">
            <div className="add-product">
              <a href="/addProduto">
                <button>Adicionar</button>
              </a>
            </div>
            <div className="filter-section">
              <input
                type="text"
                placeholder="Filtrar por Nome"
                value={filtro}
                onChange={(e) => setFiltro(e.target.value)}
              />
            </div>
            <div className="stats-total">
              <p>
                <b>Total de Registros:</b> {produtos.length}
              </p>
            </div>
          </div>
        </div>

        <section className="products-table">
          <table>
            <thead>
              <tr>
                <th>Nome</th>
                <th>Preço</th>
                <th>Descrição</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {currentRecords.length > 0 ? (
                currentRecords.map((produto) => (
                  <tr key={produto.id}>
                    <td>{produto.nome}</td>
                    <td>{produto.preco}</td>
                    <td>{produto.descricao}</td>
                    <td>
                      <button className="edit-btn">
                        <Edit />
                      </button>
                      <button
                        className="delete-btn"
                        onClick={() => deletarProduto(produto.id)}
                      >
                        <Delete />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4">Nenhum produto encontrado</td>
                </tr>
              )}
            </tbody>
          </table>
        </section>

        <div className="pagination-controls">
          <button disabled={currentPage === 1} onClick={prevPage}>
            <ArrowBack />
          </button>
          <span>
            Página {currentPage} de {totalPages}
          </span>
          <button disabled={currentPage === totalPages} onClick={nextPage}>
            <ArrowForward />
          </button>
        </div>
      </main>
    </div>
  )
}

export default Produtos;
