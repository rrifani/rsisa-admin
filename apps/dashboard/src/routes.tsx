import { createBrowserRouter, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/auth-context';
import AuthGuard from './components/auth-guard';
import DashboardLayout from './components/layout/dashboard-layout';
import LoginPage from './pages/login';
import DashboardPage from './pages/dashboard';
import PatientsPage from './pages/patients';
import DoctorsPage from './pages/doctors';
import ReportsPage from './pages/reports';

export const router = createBrowserRouter([
  {
    path: '/login',
    element: (
      <AuthProvider>
        <LoginPage />
      </AuthProvider>
    ),
  },
  {
    element: (
      <AuthProvider>
        <AuthGuard />
      </AuthProvider>
    ),
    children: [
      {
        element: <DashboardLayout />,
        children: [
          { index: true, element: <Navigate to="/dashboard" replace /> },
          { path: 'dashboard', element: <DashboardPage /> },
          { path: 'patients', element: <PatientsPage /> },
          { path: 'doctors', element: <DoctorsPage /> },
          { path: 'reports', element: <ReportsPage /> },
        ],
      },
    ],
  },
]);
