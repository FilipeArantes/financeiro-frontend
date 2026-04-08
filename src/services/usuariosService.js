import api from './api'

/**
 * Serviço de Usuários
 *
 * Endpoint esperado:
 *  GET /users  -> lista de usuários cadastrados
 *
 * Formato esperado:
 *  [{ id: number, name: string, email?: string, ... }]
 */

export const listarUsuarios = async () => {
  const { data } = await api.get('/users')
  return data
}
