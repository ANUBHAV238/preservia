import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from '@/context/AuthContext'
import { SocketProvider } from '@/context/SocketContext'
import ProtectedRoute from '@/routes/ProtectedRoute'
import PublicRoute from '@/routes/PublicRoute'

// Website pages
import HomePage from '@/pages/website/HomePage'
// Auth pages
import LoginPage from '@/pages/auth/LoginPage'
import RegisterPage from '@/pages/auth/RegisterPage'
// Dashboard pages
import DashboardLayout from '@/components/layout/DashboardLayout'
import OverviewPage from '@/pages/dashboard/OverviewPage'
import LiveMonitoringPage from '@/pages/dashboard/LiveMonitoringPage'
import GasControlPage from '@/pages/dashboard/GasControlPage'
import HistoricalDataPage from '@/pages/dashboard/HistoricalDataPage'
import PredictionsPage from '@/pages/dashboard/PredictionsPage'
import MaintenancePage from '@/pages/dashboard/MaintenancePage'
import AlertsPage from '@/pages/dashboard/AlertsPage'
import SilosPage from '@/pages/dashboard/SilosPage'
import SettingsPage from '@/pages/dashboard/SettingsPage'

export default function App() {
  return (
    <AuthProvider>
      <SocketProvider>
        <Routes>
          {/* Public website */}
          <Route path="/" element={<HomePage />} />

          {/* Auth routes — redirect if already logged in */}
          <Route element={<PublicRoute />}>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
          </Route>

          {/* Protected dashboard routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<DashboardLayout />}>
              <Route index element={<Navigate to="overview" replace />} />
              <Route path="overview" element={<OverviewPage />} />
              <Route path="live" element={<LiveMonitoringPage />} />
              <Route path="gas-control" element={<GasControlPage />} />
              <Route path="history" element={<HistoricalDataPage />} />
              <Route path="predictions" element={<PredictionsPage />} />
              <Route path="maintenance" element={<MaintenancePage />} />
              <Route path="alerts" element={<AlertsPage />} />
              <Route path="silos" element={<SilosPage />} />
              <Route path="settings" element={<SettingsPage />} />
            </Route>
          </Route>

          {/* 404 fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </SocketProvider>
    </AuthProvider>
  )
}
