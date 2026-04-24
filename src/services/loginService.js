import api from './api'
export const realizarLogin = async (email, password) => {
  const { data } = await api.post('/login', { 'email': email, 'password': password })
  return data
}