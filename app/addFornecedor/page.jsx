"use client"; // Adiciona esta linha no início para indicar que este é um Client Component

import React, { useState, useEffect } from "react";
import supabase from "@/supabase";
import Swal from "sweetalert2"; // Importa o SweetAlert2

const AdicionarFornecedor = () => {
  const [formData, setFormData] = useState({});

  const handleSubmit = async (e) => {
    e.preventDefault();

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

      if (errorAddress) {
        throw new Error("Erro ao salvar o endereço");
      }

      // Cria o fornecedor
      const supplier = {
        nome: formData.name,
        telefone: formData.phone,
        cnpj: formData.company,
        produto_fornecido: formData.product,
        endereco: insertedAddress[0].id,
      };

      const { error: errorSupplier } = await supabase
        .from("Fornecedor")
        .insert(supplier);

      if (errorSupplier) {
        throw new Error("Erro ao salvar o fornecedor");
      }

      // Exibe a mensagem de sucesso usando SweetAlert2
      Swal.fire({
        title: 'Sucesso!',
        text: 'Fornecedor cadastrado com sucesso.',
        icon: 'success',
        confirmButtonText: 'OK',
        customClass: {
          confirmButton: 'btn-confirm', // Classe personalizada para o botão de confirmação
        }
      });

      // Redireciona para a página de fornecedores ou limpa o formulário, dependendo da sua lógica
      // router.push("/fornecedores");
    } catch (error) {
      console.error(error);
      
      // Exibe a mensagem de erro usando SweetAlert2
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

  const handleCancel = () => {
    // Redireciona para a página de fornecedores
    router.push("/fornecedores"); // Use o router para navegação
  };

  return (
    <div className="form-container">
      <h1 className="form-title">Adicionar Fornecedor</h1>
      <form onSubmit={handleSubmit}>
        {/* Campos do formulário */}
        <div className="form-group">
          <label htmlFor="name">Nome da Empresa</label>
          <input
            type="text"
            id="name"
            value={formData.name}
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
              value={formData.phone}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="company">CNPJ</label>
            <input
              type="text"
              id="company"
              value={formData.company}
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
            value={formData.product}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-row">
        <div className="form-group">
          <label htmlFor="cep">CEP</label>
          <input
            type="text"
            id="cep"
            value={formData.cep}
            maxLength="9"
            onChange={handleInputChange}
            onBlur={(e) => pesquisacep(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="state">Estado</label>
          <input
            type="text"
            id="state"
            value={formData.state}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="city">Cidade</label>
          <input
            type="text"
            id="city"
            value={formData.city}
            onChange={handleInputChange}
            required
          />
        </div>
        </div>
        <div className="form-group">
          <label htmlFor="address">Endereço</label>
          <input
            type="text"
            id="address"
            value={formData.address}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group">
        <div className="form-group">
          <label htmlFor="bairro">Bairro</label>
          <input
            type="text"
            id="bairro"
            value={formData.bairro}
            onChange={handleInputChange}
            required
          />
        </div>
        <label htmlFor="number">Número</label>
          <input
            type="number"
            id="number"
            value={formData.number}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="complemento">Complemento</label>
          <input
            type="text"
            id="complemento"
            value={formData.complemento}
            onChange={handleInputChange}
          />
        </div>
        <div className="button-group">
          <button type="submit">Salvar</button>
          <button
            type="button"
            className="cancel-button"
            onClick={handleCancel}
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdicionarFornecedor;
