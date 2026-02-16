import {
  createRootRoute,
  createRoute,
  createRouter,
  RouterProvider,
  Outlet,
  redirect,
} from '@tanstack/react-router'
import './index.css';
import Home from './components/pages/Home.js'
import Login from './components/pages/Login.js'
import Registrar from './components/pages/Registrar.js'

/* Simulação de usuário logado */
const getUser = () => {
  return {
    isAuthenticated: true,
    role: 'user', // 'admin' ou 'user'
  }
}

/* Root */
const rootRoute = createRootRoute({
  component: () => <Outlet />,
})

/* Rotas públicas */
const homeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: Home,
})

const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/login',
  component: Login,
})

const registerRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/registrar',
  component: Registrar,
})

/* Rota protegida para USER */
const userDashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/dashboard',
  beforeLoad: () => {
    const user = getUser()

    if (!user.isAuthenticated || user.role !== 'user') {
      throw redirect({ to: '/login' })
    }
  },
  component: () => <h1>Dashboard do Usuário</h1>,
})

/* Rota protegida para ADMIN */
const adminDashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin',
  beforeLoad: () => {
    const user = getUser()

    if (!user.isAuthenticated || user.role !== 'admin') {
      throw redirect({ to: '/login' })
    }
  },
  component: () => <h1>Painel Admin</h1>,
})

/* Árvore de rotas */
const routeTree = rootRoute.addChildren([
  homeRoute,
  loginRoute,
  registerRoute,
  userDashboardRoute,
  adminDashboardRoute,
])

/* Router */
const router = createRouter({
  routeTree,
})

/* App */
export function App() {
  return <RouterProvider router={router} />
}
