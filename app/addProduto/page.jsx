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
    image: null, // Campo para armazenar a imagem
  });

  // Função para sanitizar o nome do arquivo
  const sanitizeFileName = (fileName) => {
    return fileName
      .normalize('NFD') // Normaliza o nome do arquivo
      .replace(/[\u0300-\u036f]/g, '') // Remove acentuação
      .replace(/\s+/g, '-') // Substitui espaços por traços
      .replace(/[^a-zA-Z0-9.-]/g, ''); // Remove qualquer caractere especial
  };

  // Função para salvar a imagem no bucket de storage do Supabase
  const uploadImage = async (file) => {
    if (!file) return null;

    try {
      // Sanitiza o nome do arquivo para garantir que seja seguro
      const fileName = `${Date.now()}-${sanitizeFileName(file.name)}`;

      const { data, error } = await supabase.storage
        .from("produtos")
        .upload(`public/${fileName}`, file); // Adiciona o caminho correto no bucket

      if (error) {
        console.error("Erro detalhado no upload:", error.message);
        throw new Error("Erro ao enviar a imagem.");
      }

      return data.path; // Retorna o caminho da imagem no bucket
    } catch (error) {
      console.error("Erro no upload:", error.message);
      throw new Error("Erro ao enviar a imagem.");
    }
  };

  // Função para salvar o produto no banco de dados
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (!user || !user.id_restaurante) {
        throw new Error("Restaurante não autenticado.");
      }

      // Valida se o preço é um número válido
      if (isNaN(parseFloat(formData.price)) || parseFloat(formData.price) <= 0) {
        throw new Error("Preço inválido.");
      }

      // Envia a imagem ao Supabase Storage, se houver
      let imageUrl = null;
      if (formData.image) {
        imageUrl = await uploadImage(formData.image);
      }

      // Monta o objeto do produto para inserção
      const product = {
        nome: formData.name,
        descricao: formData.description,
        preco: parseFloat(formData.price),
        categoria: formData.category,
        id_restaurante: user.id_restaurante,
        imagem: imageUrl, // Salva a URL da imagem se houver
      };

      // Insere o produto no banco de dados
      const { error } = await supabase.from("Produto").insert(product);

      if (error) {
        console.error("Erro ao salvar o produto:", error.message);
        throw new Error("Erro ao salvar o produto.");
      }

      // Exibe mensagem de sucesso
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
        image: null,
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
    const { id, value, files } = e.target;
    if (id === "image") {
      setFormData((prevFormData) => ({
        ...prevFormData,
        image: files[0], // Armazena o arquivo da imagem
      }));
    } else {
      setFormData((prevFormData) => ({
        ...prevFormData,
        [id]: value,
      }));
    }
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

        <div className="form-group">
          <label htmlFor="image">Imagem do Produto</label>
          <input
            type="file"
            id="image"
            accept="image/*"
            onChange={handleInputChange}
          />
        </div>

        <div className="button-group">
          <button type="submit">Salvar</button>
          <button
            type="button"
            className="cancel-button"
            onClick={() => setFormData({
              name: "",
              description: "",
              price: "",
              category: "",
              image: null,
            })}
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdicionarProduto;
