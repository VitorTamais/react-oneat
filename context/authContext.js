"use client";
import React, { createContext, useState, useEffect, useContext } from "react";
import supabase from "@/supabase";
import { useRouter } from "next/navigation";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [restaurante, setRestaurante] = useState(null);
  const [proprietario, setProprietario] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
      fetchRestauranteAndProprietario(JSON.parse(savedUser).id_restaurante);
    }
  }, []);

  const login = async (email, senha) => {
    try {
      const { data: usuario, error } = await supabase
        .from("AcessoGerenciamento")
        .select("*")
        .eq("usuario", email)
        .eq("senha", senha);

      if (error) throw error;

      if (usuario && usuario.length > 0) {
        const userData = usuario[0];
        setUser(userData);
        localStorage.setItem("user", JSON.stringify(userData));

        // Buscar dados do restaurante e do proprietário
        await fetchRestauranteAndProprietario(userData.id_restaurante);

        router.push("/dashboard");
      } else {
        throw new Error("Email ou senha incorretos.");
      }
    } catch (error) {
      console.error("Erro ao tentar login:", error.message);
      throw new Error("Ocorreu um erro durante o login.");
    }
  };

  const fetchRestauranteAndProprietario = async (id_restaurante) => {
    try {
      // Buscar informações do restaurante
      const { data: restauranteData, error: restauranteError } = await supabase
        .from("Restaurante")
        .select("*")
        .eq("id", id_restaurante)
        .single();

      if (restauranteError) throw restauranteError;
      setRestaurante(restauranteData);

      // Buscar informações do proprietário
      const { data: proprietarioData, error: proprietarioError } = await supabase
        .from("Proprietario")
        .select("*")
        .eq("id", restauranteData.proprietario)
        .single();

      if (proprietarioError) throw proprietarioError;
      setProprietario(proprietarioData);
    } catch (error) {
      console.error("Erro ao buscar dados:", error.message);
    }
  };

  const logout = () => {
    setUser(null);
    setRestaurante(null);
    setProprietario(null);
    localStorage.removeItem("user");
    router.push("/login");
  };

  return (
    <AuthContext.Provider value={{ user, restaurante, proprietario, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
