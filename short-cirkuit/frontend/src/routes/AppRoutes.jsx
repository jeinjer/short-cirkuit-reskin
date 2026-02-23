import React, { Suspense, lazy } from 'react';
import { Route, Routes } from 'react-router-dom';

import CircuitLoader from '../components/others/CircuitLoader';
import AdminRoute from '../components/utils/AdminRoute';
import ClientRoute from '../components/utils/ClientRoute';

const Home = lazy(() => import('../pages/Home'));
const ProductDetail = lazy(() => import('../pages/ProductDetail'));
const LoginPage = lazy(() => import('../pages/Login'));
const RegisterPage = lazy(() => import('../pages/Register'));
const Catalog = lazy(() => import('../pages/Catalog'));
const ResetPasswordPage = lazy(() => import('../pages/ResetPassword'));
const ForgotPasswordPage = lazy(() => import('../pages/ForgotPassword'));
const AdminDashboard = lazy(() => import('../pages/AdminDashboard'));
const CheckoutPage = lazy(() => import('../pages/Checkout'));
const ProfilePage = lazy(() => import('../pages/Profile'));
const NotFoundPage = lazy(() => import('../pages/404'));

const PUBLIC_ROUTES = [
  { path: '/', Component: Home },
  { path: '/producto/:sku', Component: ProductDetail },
  { path: '/catalogo', Component: Catalog },
  { path: '/login', Component: LoginPage },
  { path: '/registro', Component: RegisterPage },
  { path: '/forgot-password', Component: ForgotPasswordPage },
  { path: '/reset-password', Component: ResetPasswordPage },
];

const CLIENT_ROUTES = [
  { path: '/checkout', Component: CheckoutPage },
  { path: '/perfil', Component: ProfilePage },
];

const ADMIN_ROUTES = [{ path: '/admin', Component: AdminDashboard }];

const routeFallback = (
  <div className="min-h-[50vh] flex items-center justify-center px-4">
    <CircuitLoader size="sm" label="Cargando página" />
  </div>
);

function renderRouteGroup(routeGroup) {
  return routeGroup.map((routeConfig) => {
    const { path, Component: RouteComponent } = routeConfig;

    return <Route key={path} path={path} element={<RouteComponent />} />;
  });
}

export default function AppRoutes() {
  return (
    <Suspense fallback={routeFallback}>
      <Routes>
        {renderRouteGroup(PUBLIC_ROUTES)}

        <Route element={<ClientRoute />}>{renderRouteGroup(CLIENT_ROUTES)}</Route>

        <Route element={<AdminRoute />}>{renderRouteGroup(ADMIN_ROUTES)}</Route>

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  );
}
