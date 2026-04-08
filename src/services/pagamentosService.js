import api from './api'

/**
 * Serviço de Pagamentos
 *
 * Endpoints (a confirmar com o backend):
 *  GET  /meus-pagamentos      -> lista pagamentos do usuário logado
 *  GET  /pagamentos            -> lista todos os pagamentos (financeiro)
 *  POST /pagamentos            -> cria novo pagamento
 *
 * Validação do POST (definida em app/Http/Requests/PaymentsFormRequest.php):
 *  Obrigatórios:
 *   - id_user      (integer, deve existir em users.id)
 *   - value        (decimal com 2 casas, mínimo 1)
 *   - payment_date (date, não pode ser anterior a 7 dias atrás)
 *  Opcionais:
 *   - description  (string)
 *   - status       (string, apenas 'pago' ou 'cancelado')
 *
 * Formato esperado de cada pagamento na resposta:
 *  {
 *    id: number,
 *    id_user: number,
 *    user?: { id, name, ... },   // se vier com relacionamento
 *    value: number,
 *    payment_date: string,        // ISO "YYYY-MM-DD"
 *    description?: string,
 *    status?: 'pago' | 'cancelado'
 *  }
 */

export const listarMeusPagamentos = async () => {
  const { data } = await api.get('/meus-pagamentos')
  return data
}

export const listarPagamentosLancados = async () => {
  const { data } = await api.get('/pagamentos')
  return data
}

export const criarPagamento = async (pagamento) => {
  const { data } = await api.post('/pagamentos', pagamento)
  return data
}
