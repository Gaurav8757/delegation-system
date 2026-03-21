import { Routes, Route, Navigate } from 'react-router';
import { lazy, Suspense } from 'react';
import { DashboardLayout } from '../layouts/DashboardLayout.jsx';
import { ProtectedRoute } from '../components/auth/ProtectedRoute.jsx';
import Loader from '../shared/loader/Loader.jsx';
const LoginPage = lazy(() => import('../pages/auth/LoginPage.jsx'));
const RegisterPage = lazy(() => import('../pages/auth/RegisterPage.jsx'));
const DashboardPage = lazy(() => import('../pages/dashboard/DashboardPage.jsx'));
const UserManagement = lazy(() => import('../pages/users/UserManagement.jsx'));
const DelegationManagement = lazy(() => import('../pages/delegations/DelegationManagement.jsx'));
const ReportsPage = lazy(() => import('../pages/reports/ReportsPage.jsx'));
const UnauthorizedPage = lazy(() => import('../pages/UnauthorizedPage.jsx'));
const NotFoundPage = lazy(() => import('../pages/NotFoundPage.jsx'));

export const AppRoutes = () => {
    return (
        <Suspense fallback={<Loader />}>
            <Routes>
                {/* Public Routes */}
                <Route path="/" element={<Navigate to="/dashboard" replace />} />
                <Route path="/auth/login" element={<LoginPage />} />
                <Route path="/auth/secret-register" element={<RegisterPage />} />
                <Route path="/unauthorized" element={<UnauthorizedPage />} />

                {/* Protected Dashboard Routes */}
                <Route element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
                    <Route path="/dashboard" element={<DashboardPage />} />
                    
                    {/* Role Specific Routes */}
                    <Route 
                        path="/users" 
                        element={<ProtectedRoute allowedRoles={['superadmin']}><UserManagement /></ProtectedRoute>} 
                    />
                    
                    <Route 
                        path="/delegations" 
                        element={<ProtectedRoute allowedRoles={['superadmin', 'admin', 'user']}><DelegationManagement /></ProtectedRoute>} 
                    />
                    
                    <Route 
                        path="/reports" 
                        element={<ProtectedRoute allowedRoles={['superadmin', 'admin']}><ReportsPage /></ProtectedRoute>} 
                    />

                    <Route path="/settings" element={<div className="p-8"><h1 className="text-2xl font-bold">Settings</h1><p className="mt-4 text-muted-foreground">General configuration settings coming soon.</p></div>} />
                </Route>

                {/* 404 Route */}
                <Route path="*" element={<Suspense fallback={<Loader />}><NotFoundPage /></Suspense>} />
            </Routes>
        </Suspense>
    );
};
