import { lazy, Suspense } from 'react';
import { Outlet, Navigate, useRoutes } from 'react-router-dom';

import DashboardLayout from 'src/layouts/dashboard';
import CreateSummary from 'src/pages/CreateSummary';

import CreateEmployee from 'src/sections/employee/CreateEmployee';
import UpdateEmployee from 'src/sections/employee/UpdateEmployee';
// Importa el componente EmployeeVacationDetails
import EmployeeVacationDetails from 'src/sections/employee/view/employee-view';

import PrivateRoute from './PrivateRoute';


export const IndexPage = lazy(() => import('src/pages/app'));
export const UserPage = lazy(() => import('src/pages/user'));
export const Vacations = lazy(() => import('src/pages/vacations'));
export const LoginPage = lazy(() => import('src/pages/login'));
export const Calendar = lazy(() => import('src/pages/calendar-page'));
export const Page404 = lazy(() => import('src/pages/page-not-found'));
export const VacationsHistory = lazy(() => import('src/pages/vacations-history'));

// ----------------------------------------------------------------------

export default function Router() {
  const routes = useRoutes([
    {
      element: (
        <PrivateRoute>
          <DashboardLayout>
            <Suspense>
              <Outlet />
            </Suspense>
          </DashboardLayout>
        </PrivateRoute>

      ),
      children: [
        { element: <IndexPage />, index: true },
        { path: 'empleado', element: <UserPage /> },
        { path: 'calendario', element: <Calendar /> },
        { path: 'vacaciones', element: <Vacations /> },
        { path: 'empleado/:dni', element: <EmployeeVacationDetails /> },
        { path: 'historial', element: <VacationsHistory  /> },
        { path: '/empleado/crear-empleado', element: <CreateEmployee /> },
        { path: '/empleado/actualizar-empleado/:dni', element: <UpdateEmployee /> },




      ],
    },
    {
      path: 'login',
      element: <LoginPage />,
    },
    {
      path: '404',
      element: <Page404 />,
    },
    {
      path: '*',
      element: <Navigate to="/404" replace />,
    },
    {
      path: 'resumen-empleado',
      element: <CreateSummary/>,
    },
  ]);

  return routes;
}