import { useEffect, useMemo, useState } from 'react'
import { FileText, Plus, X, Search } from 'lucide-react'
import {
  listarPagamentosLancados,
  criarPagamento,
} from '../services/pagamentosService'
import { listarUsuarios } from '../services/usuariosService'

const formatarMoeda = (valor) =>
  Number(valor || 0).toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  })

const formatarData = (valor) => {
  if (!valor) return ''
  if (valor.includes('/')) return valor
  const [ano, mes, dia] = valor.split('T')[0].split('-')
  return `${dia}/${mes}/${ano}`
}

const STATUS_LABEL = {
  pago: 'Pago',
  cancelado: 'Cancelado',
}

const STATUS_ESTILO = {
  pago: 'bg-green-100 text-green-700',
  cancelado: 'bg-red-100 text-red-700',
}

const StatusBadge = ({ status }) => {
  const chave = (status || '').toLowerCase()
  return (
    <span
      className={`px-3 py-1 rounded-full text-xs font-medium ${
        STATUS_ESTILO[chave] || 'bg-yellow-100 text-yellow-700'
      }`}
    >
      {STATUS_LABEL[chave] || 'Pendente'}
    </span>
  )
}

function NovoPagamentoModal({ aberto, onFechar, onSalvar }) {
  const [idUser, setIdUser] = useState('')
  const [busca, setBusca] = useState('')
  const [usuarios, setUsuarios] = useState([])
  const [carregandoUsuarios, setCarregandoUsuarios] = useState(false)
  const [mostrarSugestoes, setMostrarSugestoes] = useState(false)

  const [value, setValue] = useState('')
  const [paymentDate, setPaymentDate] = useState('')
  const [description, setDescription] = useState('')
  const [status, setStatus] = useState('pago')
  const [salvando, setSalvando] = useState(false)
  const [erro, setErro] = useState(null)

  useEffect(() => {
    if (!aberto) return
    let cancelado = false
    ;(async () => {
      try {
        setCarregandoUsuarios(true)
        const dados = await listarUsuarios()
        if (!cancelado) setUsuarios(dados || [])
      } catch (err) {
        console.error('Erro ao carregar usuários', err)
      } finally {
        if (!cancelado) setCarregandoUsuarios(false)
      }
    })()
    return () => {
      cancelado = true
    }
  }, [aberto])

  const sugestoes = useMemo(() => {
    const termo = busca.trim().toLowerCase()
    if (!termo) return usuarios.slice(0, 8)
    return usuarios
      .filter((u) => (u.name || '').toLowerCase().includes(termo))
      .slice(0, 8)
  }, [busca, usuarios])

  const selecionarUsuario = (usuario) => {
    setIdUser(usuario.id)
    setBusca(usuario.name)
    setMostrarSugestoes(false)
  }

  if (!aberto) return null

  const limparForm = () => {
    setIdUser('')
    setBusca('')
    setMostrarSugestoes(false)
    setValue('')
    setPaymentDate('')
    setDescription('')
    setStatus('pago')
    setErro(null)
  }

  const handleFechar = () => {
    limparForm()
    onFechar()
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!idUser) {
      setErro('Selecione um funcionário válido da lista.')
      return
    }

    try {
      setSalvando(true)
      setErro(null)

      await onSalvar({
        id_user: parseInt(idUser, 10),
        value: parseFloat(value),
        payment_date: paymentDate,
        description: description || undefined,
        status,
      })

      limparForm()
      onFechar()
    } catch (err) {
      console.error(err)
      const msgBackend =
        err?.response?.data?.message ||
        Object.values(err?.response?.data?.errors || {})?.[0]?.[0]
      setErro(msgBackend || 'Erro ao salvar pagamento. Tente novamente.')
    } finally {
      setSalvando(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-[800px]">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="text-lg font-bold text-gray-900">Novo Pagamento</h2>
          <button
            onClick={handleFechar}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Funcionário
            </label>

            <div className="relative">
              <Search
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
              />
              <input
                type="text"
                value={busca}
                onChange={(e) => {
                  setBusca(e.target.value)
                  setIdUser('')
                  setMostrarSugestoes(true)
                }}
                onFocus={() => setMostrarSugestoes(true)}
                onBlur={() => setTimeout(() => setMostrarSugestoes(false), 150)}
                required
                placeholder={
                  carregandoUsuarios
                    ? 'Carregando usuários...'
                    : 'Digite o nome do funcionário'
                }
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            {mostrarSugestoes && sugestoes.length > 0 && (
              <ul className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-56 overflow-y-auto">
                {sugestoes.map((u) => (
                  <li key={u.id}>
                    <button
                      type="button"
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => selecionarUsuario(u)}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-700 transition-colors"
                    >
                      <span className="font-medium">{u.name}</span>
                      <span className="text-xs text-gray-400 ml-2">#{u.id}</span>
                    </button>
                  </li>
                ))}
              </ul>
            )}

            {mostrarSugestoes &&
              !carregandoUsuarios &&
              busca.trim() &&
              sugestoes.length === 0 && (
                <div className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg px-4 py-2 text-sm text-gray-500">
                  Nenhum funcionário encontrado.
                </div>
              )}

            {!idUser && busca && (
              <p className="text-xs text-amber-600 mt-1">
                Selecione um funcionário da lista.
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Valor
            </label>
            <input
              type="number"
              step="0.01"
              min="1"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              required
              placeholder="0.00"
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Data de Pagamento
            </label>
            <input
              type="date"
              value={paymentDate}
              onChange={(e) => setPaymentDate(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
            <p className="text-xs text-gray-400 mt-1">
              Não pode ser anterior a 7 dias atrás.
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Descrição <span className="text-gray-400">(opcional)</span>
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Detalhes do pagamento"
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="pago">Pago</option>
              <option value="cancelado">Cancelado</option>
            </select>
          </div>

          {erro && <p className="text-sm text-red-600">{erro}</p>}

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={handleFechar}
              disabled={salvando}
              className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800 transition-colors disabled:opacity-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={salvando}
              className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-purple-600 to-purple-500 rounded-lg hover:from-purple-700 hover:to-purple-600 transition-colors shadow-sm disabled:opacity-50"
            >
              {salvando ? 'Salvando...' : 'Salvar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default function PagamentosLancados() {
  const [pagamentos, setPagamentos] = useState([])
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState(null)
  const [modalAberto, setModalAberto] = useState(false)

  const carregar = async () => {
    try {
      setCarregando(true)
      setErro(null)
      const dados = await listarPagamentosLancados()
      setPagamentos(dados)
    } catch (err) {
      console.error(err)
      setErro('Não foi possível carregar os pagamentos.')
    } finally {
      setCarregando(false)
    }
  }

  useEffect(() => {
    carregar()
  }, [])

  const adicionarPagamento = async (novo) => {
    await criarPagamento(novo)
    await carregar()
  }

  return (
    <div>
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Pagamentos Lançados</h1>
          <p className="text-gray-500 text-sm mt-1">
            Gerenciamento de todos os pagamentos da empresa
          </p>
        </div>

        <button
          onClick={() => setModalAberto(true)}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-purple-600 to-purple-500 rounded-lg hover:from-purple-700 hover:to-purple-600 transition-colors shadow-sm"
        >
          <Plus size={16} />
          Novo Pagamento
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100">
              <th className="text-left text-sm font-semibold text-gray-600 px-6 py-4">
                Funcionário
              </th>
              <th className="text-left text-sm font-semibold text-gray-600 px-6 py-4">
                Valor
              </th>
              <th className="text-left text-sm font-semibold text-gray-600 px-6 py-4">
                Data de Pagamento
              </th>
              <th className="text-left text-sm font-semibold text-gray-600 px-6 py-4">
                Status
              </th>
              <th className="text-right text-sm font-semibold text-gray-600 px-6 py-4">
                Ações
              </th>
            </tr>
          </thead>

          <tbody>
            {carregando && (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-sm text-gray-500">
                  Carregando pagamentos...
                </td>
              </tr>
            )}

            {!carregando && erro && (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-sm text-red-600">
                  {erro}
                </td>
              </tr>
            )}

            {!carregando && !erro && pagamentos.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-sm text-gray-500">
                  Nenhum pagamento encontrado.
                </td>
              </tr>
            )}

            {!carregando &&
              !erro &&
              pagamentos.map((pagamento) => (
                <tr
                  key={pagamento.id}
                  className="border-b border-gray-50 last:border-0 hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4 text-sm text-gray-800 font-medium">
                    {pagamento.user?.name || `#${pagamento.id_user}`}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">
                    {formatarMoeda(pagamento.value)}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {formatarData(pagamento.payment_date)}
                  </td>
                  <td className="px-6 py-4">
                    <StatusBadge status={pagamento.status} />
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-gray-400 hover:text-purple-600 transition-colors">
                      <FileText size={18} />
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      <NovoPagamentoModal
        aberto={modalAberto}
        onFechar={() => setModalAberto(false)}
        onSalvar={adicionarPagamento}
      />
    </div>
  )
}
