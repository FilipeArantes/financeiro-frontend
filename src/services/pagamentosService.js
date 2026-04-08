import api from './api'
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
