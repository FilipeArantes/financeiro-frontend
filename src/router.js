import {
  createRootRoute,
  createRoute,
  createRouter,
  Outlet,
  redirect,
} from '@tanstack/react-router'

import Login from './pages/Login'
import Registrar from './pages/Registrar'
import Pagamentos from './pages/Pagamentos'
import Reclamacoes from './pages/Reclamacoes'
import PagamentosLancados from './pages/PagamentosLancados'
import Usuarios from './pages/Usuarios'

import { Layout } from './components/Layout'

const isAuthenticated = () => {
  return !!localStorage.getItem("token");
};

const getRole = () => {
  return localStorage.getItem("role");
};

const verificarPermissao = (rolesPermitidos) => {
  const role = getRole()

  if (!isAuthenticated() || !rolesPermitidos.includes(role)) {
    throw redirect({ to: '/login' })
  }
};

const rootRoute = createRootRoute({
  component: () => <Outlet />,
});

const homeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  beforeLoad: () => {
    if (!isAuthenticated()) {
      throw redirect({ to: '/login' })
    }
    throw redirect({ to: '/pagamentos' })
  },
});

const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/login',
  beforeLoad: () => {
    if (isAuthenticated()) {
      throw redirect({ to: '/pagamentos' })
    }
  },
  component: Login,
});

const registerRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/registrar',
  component: Registrar,
});

const protectedRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: 'protected',
  component: Layout,
  beforeLoad: () => {
    if (!isAuthenticated()) {
      throw redirect({ to: '/login' })
    }
  },
});


const pagamentosRoute = createRoute({
  getParentRoute: () => protectedRoute,
  path: '/pagamentos',
  component: Pagamentos,
});

const reclamacoesRoute = createRoute({
  getParentRoute: () => protectedRoute,
  path: '/reclamacoes',
  component: Reclamacoes,
});

const pagamentosLancadosRoute = createRoute({
  getParentRoute: () => protectedRoute,
  path: '/pagamentos-lancados',
  beforeLoad: () => verificarPermissao(['financeiro']),
  component: PagamentosLancados,
});

const usuariosRoute = createRoute({
  getParentRoute: () => protectedRoute,
  path: '/usuarios',
  beforeLoad: () => verificarPermissao(['financeiro']),
  component: Usuarios,
});

const routeTree = rootRoute.addChildren([
  homeRoute,
  loginRoute,
  registerRoute,

  protectedRoute.addChildren([
    pagamentosRoute,
    reclamacoesRoute,
    pagamentosLancadosRoute,
    usuariosRoute,
  ]),
]);

export const router = createRouter({
  routeTree,
});