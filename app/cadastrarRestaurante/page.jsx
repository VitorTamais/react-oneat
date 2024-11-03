"use client";

import React, { useState } from 'react';
import supabase from "@/supabase"; // Supondo que o cliente Supabase esteja configurado
import Swal from 'sweetalert2'; // Para as mensagens de sucesso e erro
import Link from 'next/link';
import style from "./cadRest.css"; 
import { useRouter } from "next/navigation";

const CriarConta = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    nomeRestaurante: '',
    cnpj: '',
    telefoneRestaurante: '',
    cepRestaurante: '',
    estadoRestaurante: '',
    ruaRestaurante: '',
    numeroRestaurante: '',
    bairroRestaurante: '',
    cidadeRestaurante: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      // Cria o endereço do restaurante
      const addressRestaurante = {
        rua: formData.ruaRestaurante,
        numero: formData.numeroRestaurante,
        cidade: formData.cidadeRestaurante,
        estado: formData.estadoRestaurante,
        bairro: formData.bairroRestaurante,
        cep: formData.cepRestaurante
      };
  
      const { data: insertedAddress, error: errorAddress } = await supabase
        .from("EnderecoRestaurante")
        .insert(addressRestaurante)
        .select("id");
  
      if (errorAddress) {
        throw new Error("Erro ao salvar o endereço do restaurante");
      }
  
      // Cria o restaurante com o endereço inserido e proprietário como null
      const restaurante = {
        nome: formData.nomeRestaurante,
        telefone: formData.telefoneRestaurante,
        cnpj: formData.cnpj,
        id_endereco: insertedAddress[0].id, // Referência ao ID do endereço inserido
        proprietario: null, // Proprietário será definido na próxima etapa
        categoria: "SuaCategoria" // Exemplo para preencher o campo 'categoria'
      };
  
      const { error: errorRestaurante } = await supabase
        .from("Restaurante")
        .insert(restaurante);
  
      if (errorRestaurante) {
        throw new Error("Erro ao salvar o restaurante");
      }
  
      // Exibe a mensagem de sucesso usando SweetAlert2
      Swal.fire({
        title: 'Sucesso!',
        text: 'Restaurante cadastrado com sucesso.',
        icon: 'success',
        confirmButtonText: 'OK',
        customClass: {
          confirmButton: 'btn-confirm', // Classe personalizada para o botão de confirmação
        }
      });
    } catch (error) {
      console.error(error);
  
  
      // Exibe a mensagem de erro usando SweetAlert2
      Swal.fire({
        title: 'Erro!',
        text: error.message || 'Ocorreu um erro ao salvar o restaurante.',
        icon: 'error',
        confirmButtonText: 'Tentar novamente'
      });
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  return (
    <div className="container-rest">
      <form id="formulario_rest" className="form-container-rest" onSubmit={handleSubmit}>
        <div className="form-left">
          <h2>Criar Conta</h2>
          <span id="line"></span>

          <label htmlFor="nomeRestaurante">Nome do Restaurante</label>
          <input
            type="text"
            name="nomeRestaurante"
            placeholder="Digite o nome do Estabelecimento"
            value={formData.nomeRestaurante}
            onChange={handleInputChange}
          />

          <div className="row">
            <div className="div-cnpj">
              <label htmlFor="cnpj">CNPJ</label>
              <input
                type="text"
                name="cnpj"
                placeholder="Digite seu CNPJ"
                value={formData.cnpj}
                onChange={handleInputChange}
              />
            </div>

            <div className="div-telefone">
              <label htmlFor="telefoneRestaurante">Telefone do Restaurante</label>
              <input
                type="text"
                name="telefoneRestaurante"
                placeholder="Telefone do restaurante"
                value={formData.telefoneRestaurante}
                onChange={handleInputChange}
              />
            </div>
          </div>

          <div className="row">
            <div className="div-cep">
              <label htmlFor="cepRestaurante">CEP do Restaurante</label>
              <input
                type="text"
                name="cepRestaurante"
                className="cep"
                placeholder="Digite seu CEP"
                maxLength="9"
                value={formData.cepRestaurante}
                onChange={handleInputChange}
              />
            </div>

            <div className="div-estado">
              <label htmlFor="estadoRestaurante">Estado</label>
              <input
                type="text"
                name="estadoRestaurante"
                className="estado"
                placeholder="Digite o estado do restaurante"
                value={formData.estadoRestaurante}
                onChange={handleInputChange}
              />
            </div>
          </div>
        </div>

        <div className="form-right">
          <div className="row">
            <div className="div-rua">
              <label htmlFor="ruaRestaurante">Rua</label>
              <input
                type="text"
                name="ruaRestaurante"
                placeholder="Digite o endereço do restaurante"
                value={formData.ruaRestaurante}
                onChange={handleInputChange}
              />
            </div>

            <div className="rua-numero">
              <div>
                <label htmlFor="numeroRestaurante">Número</label>
                <input
                  type="text"
                  name="numeroRestaurante"
                  placeholder="Nº"
                  value={formData.numeroRestaurante}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          </div>

          <label htmlFor="bairroRestaurante">Bairro</label>
          <input
            type="text"
            name="bairroRestaurante"
            placeholder="Digite o bairro do restaurante"
            value={formData.bairroRestaurante}
            onChange={handleInputChange}
          />

          <label htmlFor="cidadeRestaurante">Cidade</label>
          <input
            type="text"
            name="cidadeRestaurante"
            placeholder="Digite a cidade do restaurante"
            value={formData.cidadeRestaurante}
            onChange={handleInputChange}
          />
        </div>
        <div className="button-container">
        <button onClick={() => router.push("/cadastrarProprietario")} type="submit" className="btn-rest">
          Próximo
        </button>
      </div>
      </form>
      
      <p className="login-link">
        Já tem uma conta? <Link href="/login">Faça o login</Link>
      </p>
    </div>
    
  );
};

export default CriarConta;
