import React, { useState } from "react";
import escudo from "../icons/escudo.svg";
import api from "../services/api";
import { useNavigate } from "@tanstack/react-router";
import { realizarLogin } from "../services/loginService";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [erro, setErro] = useState("");

  const navigate = useNavigate();

  const logar = async (e) => {
    e.preventDefault();

    if (!email.trim()) {
      setErro("O email é obrigatório");
      return;
    }

    if (!password.trim()) {
      setErro("A senha é obrigatória");
      return;
    }

    setErro("");

    try {
      const {data} = await realizarLogin(email, password);
      localStorage.setItem("token", data.token);
      localStorage.setItem("role", data.role);
      navigate({ to: "/pagamentos" });
    } catch (error) {
      if (error.response.data) {
        const erros = error.response.data.errors;
        const message = error.response.data.message;
        if (erros && erros.email) {
          setErro(erros.email[0]);
        }
        if (message) {
          setErro(message);
        }
      } else {
        setErro("Erro ao logar");
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-md overflow-hidden">
        <div className="bg-indigo-600 p-8 text-center">
          <div className="mx-auto bg-white/20 w-16 h-16 rounded-full flex items-center justify-center mb-4 backdrop-blur-sm">
            <img
              width={32}
              height={32}
              className="w-8 h-8"
              src={escudo}
              alt="Logo SDCPR"
            />
          </div>
          <h1 className="text-2xl font-bold text-white">SDCPR</h1>
          <p className="text-indigo-200 text-sm mt-1">
            Sistema de Controle de Pagamentos e Reclamações
          </p>
        </div>

        <form onSubmit={logar}>
          <div className="p-8 space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Login
              </label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                placeholder="seu.email"
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Senha
              </label>
              <input
                type="password"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                placeholder="••••••••"
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div className="mt-4">
              {erro && <p style={{ color: "red" }}>{erro}</p>}
            </div>

            <button
              type="submit"
              className="w-full bg-indigo-600 text-white font-bold py-2.5 rounded-lg"
            >
              Entrar no Sistema
            </button>

            <button
              type="button"
              onClick={() => navigate({ to: "/registrar" })}
              className="w-full border border-indigo-600 text-indigo-600 font-bold py-2.5 rounded-lg"
            >
              Criar Conta
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
