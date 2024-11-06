"use client";

import React, { useState } from 'react';
import { useNavigate, useRouter } from 'next/navigation';
import supabase from "@/supabase";
import Swal from 'sweetalert2';
import Link from 'next/link';
import style from "./cadProp.css";

const CriarProp = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    nomeProprietario: '',
    emailProprietario: '',
    cpf: '',
    telefoneProprietario: '',
    cepProprietario: '',
    estadoProprietario: '',
    ruaProprietario: '',
    numeroProprietario: '',
    bairroProprietario: '',
    cidadeProprietario: ''
  });

  const gerarSenha = () => {
    return Math.random().toString(36).slice(-8); // Gera uma senha aleatória de 8 caracteres
  };

  const enviarEmailComSenha = async (email, senha) => {
    try {
      const response = await fetch('/api/sendEmail', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, senha }),
      });

      if (!response.ok) {
        throw new Error('Erro ao enviar o email');
      }

      const data = await response.json();
      console.log(data.message); // Mensagem de sucesso
    } catch (error) {
      console.error(error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const addressProprietario = {
        rua: formData.ruaProprietario,
        numero: formData.numeroProprietario,
        cidade: formData.cidadeProprietario,
        estado: formData.estadoProprietario,
        bairro: formData.bairroProprietario,
        cep: formData.cepProprietario
      };
  
      const { data: insertedAddress, error: errorAddress } = await supabase
        .from("EnderecoProprietario")
        .insert(addressProprietario)
        .select("id");
  
      if (errorAddress) {
        throw new Error("Erro ao salvar o endereço do proprietario");
      }
  
      const proprietario = {
        nome: formData.nomeProprietario,
        email: formData.emailProprietario,
        telefone: formData.telefoneProprietario,
        cpf: formData.cpf,
        endereco: insertedAddress[0].id
      };
  
      const { data: insertedProprietario, error: errorProprietario } = await supabase
        .from("Proprietario")
        .insert(proprietario)
        .select("id");
  
      if (errorProprietario || !insertedProprietario || insertedProprietario.length === 0) {
        throw new Error("Erro ao salvar o Proprietario ou o ID retornado é nulo");
      }
  
      const lastRestaurant = await supabase
        .from("Restaurante")
        .select("id")
        .order("id", { ascending: false })
        .limit(1)
        .single();
  
      if (!lastRestaurant.data) {
        throw new Error("Erro ao obter o último restaurante");
      }
  
      const updateError = await supabase
        .from("Restaurante")
        .update({ proprietario: insertedProprietario[0].id })
        .eq("id", lastRestaurant.data.id);
  
      if (updateError.error) {
        throw new Error("Erro ao atualizar o restaurante com o ID do proprietário");
      }
  
      const senhaGerada = gerarSenha();
  
      // Salvando na tabela AcessoGerenciamento
      const acessoGerenciamentoData = {
        id_restaurante: lastRestaurant.data.id,
        usuario: formData.emailProprietario,
        senha: senhaGerada,
        nivel_acesso: 1 // Supondo que 1 seja o nível de acesso padrão
      };
  
      const { data: insertedAcesso , error: errorAcesso } = await supabase
        .from("AcessoGerenciamento")
        .insert(acessoGerenciamentoData);
  
      if (errorAcesso) {
        throw new Error("Erro ao salvar as informações de acesso");
      }
  
      // Enviando email com a senha gerada
      await enviarEmailComSenha(formData.emailProprietario, senhaGerada);
  
      Swal.fire({
        title: 'Sucesso!',
        text: 'Proprietario cadastrado com sucesso. Verifique seu email para a senha.',
        icon: 'success',
        confirmButtonText: 'OK',
        customClass: {
          confirmButton: 'btn-confirm'
        }
      }).then(() => {
        router.push("/login");
      });
  
    } catch (error) {
      console.error(error);
  
      Swal.fire({
        title: 'Erro!',
        text: error.message || 'Ocorreu um erro ao salvar o Proprietario.',
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

          <label htmlFor="nomeProprietario">Nome do Proprietario</label>
          <input
            type="text"
            name="nomeProprietario"
            placeholder="Digite o nome do Proprietario"
            value={formData.nomeProprietario}
            onChange={handleInputChange}
          />

          <label htmlFor="emailProprietario">Email do Proprietario</label>
          <input
            type="email"
            name="emailProprietario"
            placeholder="Digite o Email do Proprietario"
            value={formData.emailProprietario}
            onChange={handleInputChange}
          />

          <div className="row">
            <div className="div-cpf">
              <label htmlFor="cnpj">CPF</label>
              <input
                type="text"
                name="cpf"
                placeholder="Digite seu CPF"
                value={formData.cpf}
                onChange={handleInputChange}
              />
            </div>

            <div className="div-telefone">
              <label htmlFor="telefoneProprietario">Telefone do Proprietario</label>
              <input
                type="text"
                name="telefoneProprietario"
                placeholder="Telefone do Proprietario"
                value={formData.telefoneProprietario}
                onChange={handleInputChange}
              />
            </div>
          </div>
        </div>

        <div className="form-right">
        <div className="row">
            <div className="div-cep">
              <label htmlFor="cepProprietario">CEP do Proprietario</label>
              <input
                type="text"
                name="cepProprietario"
                className="cep"
                placeholder="Digite seu CEP"
                maxLength="9"
                value={formData.cepProprietario}
                onChange={handleInputChange}
                onBlur={() => handleCepBlur(formData.cepProprietario)}
              />
            </div>

            <div className="div-estado">
              <label htmlFor="estadoProprietario">Estado</label>
              <input
                type="text"
                name="estadoProprietario"
                className="estado"
                placeholder="Digite o estado do proprietario"
                value={formData.estadoProprietario}
                onChange={handleInputChange}
              />
            </div>
          </div>

          <div className="row">
            <div className="div-rua">
              <label htmlFor="ruaProprietario">Rua</label>
              <input
                type="text"
                name="ruaProprietario"
                placeholder="Digite o endereço do proprietario"
                value={formData.ruaProprietario}
                onChange={handleInputChange}
              />
            </div>

            <div className="rua-numero">
              <div>
                <label htmlFor="numeroProprietario">Número</label>
                <input
                  type="text"
                  name="numeroProprietario"
                  placeholder="Nº"
                  value={formData.numeroProprietario}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          </div>
        <div className="row">
          <label htmlFor="bairroProprietario">Bairro</label>
          <input
            type="text"
            name="bairroProprietario"
            placeholder="Digite o bairro do proprietario"
            value={formData.bairroProprietario}
            onChange={handleInputChange}
          />

          <label htmlFor="cidadeProprietario">Cidade</label>
          <input
            type="text"
            name="cidadeProprietario"
            placeholder="Digite a cidade do proprietario"
            value={formData.cidadeProprietario}
            onChange={handleInputChange}
          />
        </div>
        </div>
        <button type="submit" id="btn_prox" className="btn-rest">
          Concluir
        </button>
      </form>
      <p className="login-link">
        Já tem uma conta? <a href="./index.html">Faça o login</a>
      </p>
    </div>
  );
};

export default CriarProp;
