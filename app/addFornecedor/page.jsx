"use client"; // Indicar que este é um Client Component

import React, { useState } from "react";
import supabase from "@/supabase";
import Swal from "sweetalert2";
import { useAuth } from "../../context/authContext"; // Importa o contexto de autenticação

const AdicionarFornecedor = () => {
  const { restaurante } = useAuth(); // Obter o restaurante do contexto
  const [formData, setFormData] = useState({});

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!restaurante || !restaurante.id) {
      Swal.fire({
        title: 'Erro!',
        text: 'Restaurante não encontrado. Faça login novamente.',
        icon: 'error',
        confirmButtonText: 'OK'
      });
      return;
    }
  
    try {
      // Cria o endereço
      const address = {
        rua: formData.address,
        numero: formData.number,
        cidade: formData.city,
        estado: formData.state,
        bairro: formData.bairro,
        complemento: formData.complemento,
      };
  
      const { data: insertedAddress, error: errorAddress } = await supabase
        .from("EnderecoFornecedor")
        .insert(address)
        .select("id");
  
      if (errorAddress || !insertedAddress?.length) {
        throw new Error("Erro ao salvar o endereço: " + (errorAddress?.message || ""));
      }
  
      // Cria o fornecedor vinculado ao restaurante
      const supplier = {
        nome: formData.name,
        telefone: formData.phone,
        cnpj: formData.company,
        produto_fornecido: formData.product,
        endereco: insertedAddress[0].id,
        id_restaurante: restaurante.id
      };
  
      console.log("Dados do fornecedor:", supplier);
  
      const { error: errorSupplier } = await supabase
        .from("Fornecedor")
        .insert(supplier);
  
      if (errorSupplier) {
        console.error("Erro ao salvar o fornecedor:", errorSupplier.message);
        throw new Error("Erro ao salvar o fornecedor: " + errorSupplier.message);
      }
  
      Swal.fire({
        title: 'Sucesso!',
        text: 'Fornecedor cadastrado com sucesso.',
        icon: 'success',
        confirmButtonText: 'OK'
      });
  
      setFormData({});
    } catch (error) {
      console.error(error);
      Swal.fire({
        title: 'Erro!',
        text: error.message || 'Ocorreu um erro ao salvar o fornecedor.',
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
      <h1 className="form-title">Adicionar Fornecedor</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Nome da Empresa</label>
          <input
            type="text"
            id="name"
            value={formData.name || ""}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="phone">Telefone</label>
            <input
              type="tel"
              id="phone"
              value={formData.phone || ""}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="company">CNPJ</label>
            <input
              type="text"
              id="company"
              value={formData.company || ""}
              onChange={handleInputChange}
              required
            />
          </div>
        </div>
        <div className="form-group">
          <label htmlFor="product">Produto Principal</label>
          <input
            type="text"
            id="product"
            value={formData.product || ""}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="address">Endereço</label>
          <input
            type="text"
            id="address"
            value={formData.address || ""}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="number">Número</label>
          <input
            type="number"
            id="number"
            value={formData.number || ""}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="city">Cidade</label>
          <input
            type="text"
            id="city"
            value={formData.city || ""}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="state">Estado</label>
          <input
            type="text"
            id="state"
            value={formData.state || ""}
            onChange={handleInputChange}
            required
          />
        </div>
        <button type="submit">Salvar</button>
      </form>
    </div>
  );
};

export default AdicionarFornecedor;
