import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import Layout from './layouts/Layout';

// Pages
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import CostExplorer from './pages/CostExplorer';
import CloudAccounts from './pages/CloudAccounts';
import Resources from './pages/Resources';
import Budgets from './pages/Budgets';
import Optimization from './pages/Optimization';
import Storage from './pages/Storage';
import Network from './pages/Network';
import Governance from './pages/Governance';
import Reports from './pages/Reports';
import Settings from './pages/Settings';

function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <AuthProvider>
          <Routes>
            {/* Public Access Route */}
            <Route path="/login" element={<Login />} />
            
            {/* Protected FinOps Panel Routes */}
            <Route path="/" element={<Layout />}>
              <Route index element={<Navigate to="/dashboard" replace />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="cost-explorer" element={<CostExplorer />} />
              <Route path="cloud-accounts" element={<CloudAccounts />} />
              <Route path="resources" element={<Resources />} />
              <Route path="budgets" element={<Budgets />} />
              <Route path="optimization" element={<Optimization />} />
              <Route path="storage" element={<Storage />} />
              <Route path="network" element={<Network />} />
              <Route path="governance" element={<Governance />} />
              <Route path="reports" element={<Reports />} />
              <Route path="settings" element={<Settings />} />
            </Route>

            {/* Catch All Redirect */}
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </AuthProvider>
      </ToastProvider>
    </BrowserRouter>
  );
}

export default App;
