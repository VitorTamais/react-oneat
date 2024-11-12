"use client";

import React, { useState } from "react";
import supabase from "@/supabase";
import Swal from "sweetalert2";
import '../styles/addProduto.css';
import { useAuth } from "@/context/authContext";

const AdicionarProduto = () => {
  const { user } = useAuth(); // Obtém o id_restaurante do contexto
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    unit: "",
    stock: "",
  });

  // Função para salvar o produto no banco de dados
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (!user || !user.id_restaurante) {
        throw new Error("Restaurante não autenticado.");
      }

      // Monta o objeto do produto para inserção
      const product = {
        nome: formData.name,
        descricao: formData.description,
        preco: parseFloat(formData.price),
        categoria: formData.category,
        id_restaurante: user.id_restaurante,
      };

      const { error } = await supabase.from("Produto").insert(product);

      if (error) {
        throw new Error("Erro ao salvar o produto.");
      }

      Swal.fire({
        title: 'Sucesso!',
        text: 'Produto cadastrado com sucesso.',
        icon: 'success',
        confirmButtonText: 'OK',
      });

      // Limpa o formulário após o cadastro
      setFormData({
        name: "",
        description: "",
        price: "",
        category: "",
      });

    } catch (error) {
      console.error("Erro:", error.message);
      Swal.fire({
        title: 'Erro!',
        text: error.message || 'Ocorreu um erro ao salvar o produto.',
        icon: 'error',
        confirmButtonText: 'Tentar novamente'
      });
    }
  };

  // Função para lidar com mudanças nos campos do formulário
  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [id]: value,
    }));
  };

  return (
    <div className="form-container">
      <h1 className="form-title">Adicionar Produto</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Nome do Produto</label>
          <input
            type="text"
            id="name"
            value={formData.name}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="description">Descrição</label>
          <textarea
            id="description"
            value={formData.description}
            onChange={handleInputChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="price">Preço</label>
          <input
            type="number"
            step="0.01"
            id="price"
            value={formData.price}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="category">Categoria</label>
          <input
            type="text"
            id="category"
            value={formData.category}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="button-group">
          <button type="submit">Salvar</button>
          <button
            type="button"
            className="cancel-button"
            onClick={() => setFormData({})}
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdicionarProduto;
