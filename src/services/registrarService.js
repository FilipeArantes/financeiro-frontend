import api from './api'
export const realizarRegistro = async (email,user,password, password_confirmation) => {
  const { data } = await api.post('/register', { 'email': email, 'name': user, 'password': password, 'password_confirmation': password_confirmation })
  return data
}