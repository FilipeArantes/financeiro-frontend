import { useEffect, useState } from 'react'
import { Clock } from 'lucide-react'
import { listarMeusPagamentos } from '../services/pagamentosService'

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

export default function Pagamentos() {
  const [pagamentos, setPagamentos] = useState([])
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState(null)

  useEffect(() => {
    const carregar = async () => {
      try {
        setCarregando(true)
        setErro(null)
        const dados = await listarMeusPagamentos()
        setPagamentos(dados)
      } catch (err) {
        console.error(err)
        setErro('Não foi possível carregar os pagamentos.')
      } finally {
        setCarregando(false)
      }
    }

    carregar()
  }, [])

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Meus Pagamentos</h1>
        <p className="text-gray-500 text-sm mt-1">
          Histórico de pagamentos recebidos
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100">
              <th className="text-left text-sm font-semibold text-gray-600 px-6 py-4">
                Data de Pagamento
              </th>
              <th className="text-left text-sm font-semibold text-gray-600 px-6 py-4">
                Valor
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
                <td colSpan={4} className="px-6 py-8 text-center text-sm text-gray-500">
                  Carregando pagamentos...
                </td>
              </tr>
            )}

            {!carregando && erro && (
              <tr>
                <td colSpan={4} className="px-6 py-8 text-center text-sm text-red-600">
                  {erro}
                </td>
              </tr>
            )}

            {!carregando && !erro && pagamentos.length === 0 && (
              <tr>
                <td colSpan={4} className="px-6 py-8 text-center text-sm text-gray-500">
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
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-gray-700">
                      <Clock size={16} className="text-gray-400" />
                      <span className="text-sm">{formatarData(pagamento.payment_date)}</span>
                    </div>
                  </td>

                  <td className="px-6 py-4 text-sm text-gray-700">
                    {formatarMoeda(pagamento.value)}
                  </td>

                  <td className="px-6 py-4">
                    <StatusBadge status={pagamento.status} />
                  </td>

                  <td className="px-6 py-4 text-right">
                    <button className="text-purple-600 hover:text-purple-700 text-sm font-medium">
                      Detalhes
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
