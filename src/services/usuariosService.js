import api from './api'

export const listarUsuarios = async () => {
  const { data } = await api.get('/users')
  return data
}
