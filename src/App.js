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

/* 🔐 Verifica token */
const isAuthenticated = () => {
  return !!localStorage.getItem("token");
};

/* Root */
const rootRoute = createRootRoute({
  component: () => <Outlet />,
});

/* 🔥 HOME agora decide pra onde ir */
const homeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  beforeLoad: () => {
    if (!isAuthenticated()) {
      throw redirect({ to: '/login' });
    } else {
      throw redirect({ to: '/dashboard' });
    }
  },
});

/* Rotas públicas */
const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/login',
  beforeLoad: () => {
    if (isAuthenticated()) {
      throw redirect({ to: '/dashboard' });
    }
  },
  component: Login,
});

const registerRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/registrar',
  component: Registrar,
});

/* 🔐 Rotas protegidas */
const userDashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/dashboard',
  beforeLoad: () => {
    if (!isAuthenticated()) {
      throw redirect({ to: '/login' });
    }
  },
  component: () => <h1>Dashboard do Usuário</h1>,
});

const adminDashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin',
  beforeLoad: () => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    if (!token || role !== "admin") {
      throw redirect({ to: '/login' });
    }
  },
  component: () => <h1>Painel Admin</h1>,
});

/* Árvore */
const routeTree = rootRoute.addChildren([
  homeRoute,
  loginRoute,
  registerRoute,
  userDashboardRoute,
  adminDashboardRoute,
]);

/* Router */
const router = createRouter({
  routeTree,
});

/* App */
export function App() {
  return <RouterProvider router={router} />;
}