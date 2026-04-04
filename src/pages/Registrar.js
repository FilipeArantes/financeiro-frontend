import React, { useState } from "react";
import escudo from "../icons/escudo.svg";
import api from "../services/api";
import { Navigate } from "@tanstack/react-router";

const Register = () => {
  const [user, setUser] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [erro, setErro] = useState("");

  const registrar = (e) => {
    e.preventDefault();

    if (!user.trim()) {
      setErro("O usuário é obrigatório");
      return;
    }

    if (!password.trim()) {
      setErro("A senha é obrigatória");
      return;
    }

    if (!confirmPassword.trim()) {
      setErro("Confirme a senha");
      return;
    }

    if (password !== confirmPassword) {
      setErro("As senhas não coincidem");
      return;
    }

    setErro("");

    try {
      const response = api.post("/register", {
        user,
        password,
      });

      console.log("Cadastro sucesso:", response.data);

      Navigate({ to: "/Login" });
    } catch (error) {
      setErro(error.response?.data?.message || "Erro ao cadastrar usuário");
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
          <p className="text-indigo-200 text-sm mt-1">Criar nova conta</p>
        </div>

        <form >
          <div className="p-8 space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Login
              </label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                placeholder="seu.usuario"
                onChange={(e) => setUser(e.target.value)}
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

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Confirmar Senha
              </label>
              <input
                type="password"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                placeholder="••••••••"
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>

            <div className="mt-4">
              {erro && <p style={{ color: "red" }}>{erro}</p>}
            </div>

            <button
              type="submit"
              onClick={registrar}
              className="w-full bg-indigo-600 text-white font-bold py-2.5 rounded-lg"
            >
              Criar Conta
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
