export const menuConfig = [
  {
    label: 'Meus Pagamentos',
    path: '/pagamentos',
    roles: ['funcionario', 'financeiro'],
    icon: 'pagamentos',
  },
  {
    label: 'Pagamentos Lançados',
    path: '/pagamentos-lancados',
    roles: ['financeiro'],
    icon: 'lancamentos',
  },
  {
    label: 'Usuários',
    path: '/usuarios',
    roles: ['financeiro'],
    icon: 'usuarios',
  },
  {
    label: 'Reclamações',
    path: '/reclamacoes',
    roles: ['funcionario', 'financeiro'],
    icon: 'reclamacoes',
  },
]