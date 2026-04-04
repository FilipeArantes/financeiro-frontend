import { Link, useRouterState } from '@tanstack/react-router'
import { menuConfig } from '../config/menu'

import {
  CreditCard,
  FileText,
  Users,
  AlertCircle,
  LogOut,
  Shield
} from 'lucide-react'

/* 🔥 mapa de ícones */
const iconMap = {
  pagamentos: CreditCard,
  lancamentos: FileText,
  usuarios: Users,
  reclamacoes: AlertCircle,
}

export function Sidebar() {
  const { location } = useRouterState()

  const role = localStorage.getItem('role')

  const isActive = (path) => location.pathname === path

  /* 🔥 encontra grupo do usuário */
 const menuFiltrado = menuConfig.filter(item =>
  item.roles.includes(role)
)

  /* 🔥 fallback para evitar erro */
  if (!menuFiltrado || menuFiltrado.length === 0) {
    return (
      <div className="w-64 h-screen bg-[#0b0f2a] text-white flex items-center justify-center">
        <span className="text-gray-400 text-sm">
          Carregando menu...
        </span>
      </div>
    )
  }

  const logout = () => {
    localStorage.clear()
    window.location.href = '/login'
  }

  return (
    <div className="w-64 h-screen bg-[#0b0f2a] text-white flex flex-col">

      {/* HEADER */}
      <div className="p-6 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-r from-purple-600 to-purple-400 p-2 rounded-xl">
            <Shield size={20} />
          </div>

          <div>
            <h1 className="font-bold text-lg">SDCPR</h1>
            <p className="text-xs text-gray-400">Controle Financeiro</p>
          </div>
        </div>
      </div>

      {/* MENU */}
      <div className="flex-1 p-4 space-y-2">

        {menuFiltrado.map((item) => {
          const Icon = iconMap[item.icon]
          const active = isActive(item.path)

          return (
            <Link
              key={item.path}
              to={item.path}
              className={`
                flex items-center gap-3 px-4 py-3 rounded-xl transition-all
                ${active
                  ? 'bg-gradient-to-r from-purple-600 to-purple-400 text-white shadow-lg'
                  : 'text-gray-400 hover:bg-white/5 hover:text-white'
                }
              `}
            >
              {Icon && <Icon size={18} />}

              <span className="text-sm font-medium">
                {item.label}
              </span>
            </Link>
          )
        })}

      </div>

      {/* FOOTER */}
      <div className="p-4 border-t border-white/10">

        <p className="text-xs text-gray-500 mb-1">
          LOGADO COMO
        </p>

        <p className="font-semibold mb-4 capitalize">
          {role || 'visitante'}
        </p>

        <button
          onClick={logout}
          className="flex items-center gap-2 text-gray-400 hover:text-white"
        >
          <LogOut size={18} />
          <span>Sair</span>
        </button>

      </div>
    </div>
  )
}