import React, { useState } from "react";
import escudo from "../../icons/escudo.svg";

const Login = () => {
  const [user, setUser] = useState("");
  const [password, setPassword] = useState("");
  const [erro, setErro] = useState("");

  const logar = (e) => {
    e.preventDefault();

    if (!user.trim()) {
      setErro("O usuário é obrigatório");
      return;
    }

    if (!password.trim()) {
      setErro("A senha é obrigatória");
      return;
    }

    setErro("");
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-md overflow-hidden">
        <div className="bg-indigo-600 p-8 text-center">
          <div className="mx-auto bg-white/20 w-16 h-16 rounded-full flex items-center justify-center mb-4 backdrop-blur-sm">
            <img
              width={32}
              height={32}
              className="w-8 h-8 text-white"
              src={escudo}
              alt="Logo SDCPR"
              color="red"
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
            <div className="mt-4">
              {erro && <p style={{ color: "red" }}>{erro}</p>}
            </div>

            <button
              type="submit"
              className="w-full bg-indigo-600 text-white font-bold py-2.5 rounded-lg"
            >
              Entrar no Sistema
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
