import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { AppLayout } from '../layouts/AppLayout';
import { LandingPage } from '../pages/LandingPage';
import { LoginPage } from '../pages/LoginPage';
import { RegisterPage } from '../pages/RegisterPage';
import { DashboardPage } from '../pages/DashboardPage';
import { ProcurementDashboard } from '../pages/ProcurementDashboard';
import { PaymentsDashboard } from '../pages/PaymentsDashboard';
import { SupplyChainDashboard } from '../pages/SupplyChainDashboard';
import { AIAgentsDashboard } from '../pages/AIAgentsDashboard';
import { BusinessRiskDashboard } from '../pages/BusinessRiskDashboard';
import { AuditLogsPage } from '../pages/AuditLogsPage';
import { SettingsPage } from '../pages/SettingsPage';
import { LoadingState } from '../components/common/FeedbackStates';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#07090e] flex items-center justify-center">
        <LoadingState message="Verifying sovereign authorization..." />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Pages */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* Protected Enterprise SaaS Application */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }
      >
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="procurement" element={<ProcurementDashboard />} />
        <Route path="procurement/*" element={<ProcurementDashboard />} />
        <Route path="payments" element={<PaymentsDashboard />} />
        <Route path="payments/*" element={<PaymentsDashboard />} />
        <Route path="supply-chain" element={<SupplyChainDashboard />} />
        <Route path="supply-chain/*" element={<SupplyChainDashboard />} />
        <Route path="ai-agents" element={<AIAgentsDashboard />} />
        <Route path="ai-agents/*" element={<AIAgentsDashboard />} />
        <Route path="business-risk" element={<BusinessRiskDashboard />} />
        <Route path="business-risk/*" element={<BusinessRiskDashboard />} />
        <Route path="audit-logs" element={<AuditLogsPage />} />
        <Route path="settings" element={<SettingsPage />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};
