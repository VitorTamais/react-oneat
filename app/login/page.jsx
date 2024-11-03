"use client";

import React, { useState } from "react";
import { useRouter } from 'next/navigation'; // Usando useRouter para navegação
import styles from "./login.css"; 
import Image from 'next/image'; 
import Link from 'next/link';
import supabase from "@/supabase";
import { setCookie } from 'cookies-next';
import Swal from "sweetalert2";

// Importando as imagens da pasta 'img'
import logo from '../public/img/logo.png';
import eyeOff from '../public/img/eye-off.svg';
import eyeOn from '../public/img/eye.svg';
import loginSvg from '../public/img/login.svg';

function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const { data: usuario, error } = await supabase
        .from('AcessoGerenciamento')
        .select('*')
        .eq('usuario', email)
        .eq('senha', senha);

      if (error) throw error;

      if (usuario && usuario.length > 0) {
        // Usuário encontrado: Armazena o ID do restaurante em um cookie
        setCookie('id_restaurante', usuario[0].id_restaurante, { maxAge: 60 * 60 * 24 });

        router.push('/dashboard');
      } else {
        setErrorMessage("Email ou senha incorretos.");
      }
    } catch (error) {
      console.error("Erro ao tentar login:", error.message);
      setErrorMessage("Ocorreu um erro durante o login.");
    }
  };

  return (
    <div id="page" className="flex">
      <div className="div-login">
        <header>
          <Image src={logo} alt="Logo" width={150} height={50} />
        </header>
        <main>
          <div className="headline">
            <h1>Bem-vindo(a)!</h1>
            <p>Faça login ou cadastre-se para começar a fazer as suas compras.</p>
          </div>
          <form id="login_red" onSubmit={handleLogin}>
            <div className="input-wrapper">
              <label htmlFor="email">E-mail</label>
              <input
                id="email"
                type="email"
                name="email"
                required
                placeholder="Digite seu e-mail"
                value={email}
                onChange={(e) => setEmail(e.target.value)} // Atualizando o estado do e-mail
              />
            </div>

            <div className="input-wrapper">
              <div className="label-wrapper flex">
                <label htmlFor="senha"> Senha </label>
                <a href="recuperar1.html"> Esqueceu a senha? </a>
              </div>

              <input
                type="password"
                id="senha1"
                name="senha1"
                placeholder="Digite sua senha"
                value={senha}
                onChange={(e) => setSenha(e.target.value)} // Atualizando o estado da senha
              />
            </div>

            {errorMessage && <p className="error-message">{errorMessage}</p>} {/* Exibe a mensagem de erro */}

            <button type="submit">Entrar</button>

            <div className="create-account">
              Ainda não tem uma conta? <Link href="/cadastrarRestaurante">Cadastre-se</Link>
            </div>
          </form>
        </main>
      </div>
      <Image src={loginSvg} alt="Ilustração de login" width={400} height={300} />
    </div>
  );
}

export default Login;
