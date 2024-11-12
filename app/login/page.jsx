// components/Login.js
"use client";

import React, { useState } from "react";
import { useAuth } from "../../context/authContext"; // Importando o hook useAuth do contexto de autenticação
import styles from "./login.css"; 
import Image from 'next/image'; 
import Link from 'next/link';
import logo from '../public/img/logo.png';
import loginSvg from '../public/img/login.svg';

function Login() {
  const { login } = useAuth(); // Usando a função login do AuthContext
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await login(email, senha); // Chamando a função login do AuthContext
    } catch (error) {
      setErrorMessage(error.message);
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
                onChange={(e) => setEmail(e.target.value)}
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
                onChange={(e) => setSenha(e.target.value)}
              />
            </div>

            {errorMessage && <p className="error-message">{errorMessage}</p>}

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
