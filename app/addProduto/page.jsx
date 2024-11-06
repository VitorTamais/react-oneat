"use client";

import React, { useState } from "react";
import supabase from "@/supabase";
import Swal from "sweetalert2";
import '../styles/styles.css';

const AdicionarProduto = () => {
  const [formData, setFormData] = useState({});

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const product = {
        nome: formData.name,
        preco: formData.price,
        unidade: formData.unit,
        descricao: formData.description,
        estoque: formData.stock,
      };

      const { error } = await supabase
        .from("Produtos")
        .insert(product);

      if (error) {
        throw new Error("Erro ao salvar o produto");
      }

      Swal.fire({
        title: 'Sucesso!',
        text: 'Produto cadastrado com sucesso.',
        icon: 'success',
        confirmButtonText: 'OK',
      });

      // Limpa o formulário ou redireciona para a página de produtos
    } catch (error) {
      console.error(error);
      Swal.fire({
        title: 'Erro!',
        text: error.message || 'Ocorreu um erro ao salvar o produto.',
        icon: 'error',
        confirmButtonText: 'Tentar novamente'
      });
    }
  };

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
          <label htmlFor="price">Preço</label>
          <input
            type="number"
            id="price"
            value={formData.price}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="unit">Unidade</label>
          <input
            type="text"
            id="unit"
            value={formData.unit}
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
          <label htmlFor="stock">Quantidade em Estoque</label>
          <input
            type="number"
            id="stock"
            value={formData.stock}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="button-group">
          <button type="submit">Salvar</button>
          <button type="button" className="cancel-button" onClick={() => {/* Lógica de cancelar */}}>
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdicionarProduto;
