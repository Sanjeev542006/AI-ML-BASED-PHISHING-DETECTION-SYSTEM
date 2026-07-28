import { type ReactNode } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AuthProvider, useAuth } from '../context/AuthContext'
import { AppLayout } from '../layouts/AppLayout'
import { DashboardPage } from '../pages/DashboardPage'
import { ScannerPage } from '../pages/ScannerPage'
import { IntelligencePage } from '../pages/IntelligencePage'
import { AnalyticsPage } from '../pages/AnalyticsPage'
import { SettingsPage } from '../pages/SettingsPage'
import { LoginPage } from '../pages/LoginPage'
import { RegisterPage } from '../pages/RegisterPage'
import { NotFoundPage } from '../pages/NotFoundPage'
import { LoaderCircle, ShieldCheck } from 'lucide-react'

function ProtectedRoute({ children }: { children: ReactNode }) {
  const { isAuthenticated, loading } = useAuth()

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', background: '#0f172a', color: '#94a3b8' }}>
        <div style={{ textAlign: 'center', display: 'grid', gap: '12px', placeItems: 'center' }}>
          <div className="brand-mark" style={{ width: '48px', height: '48px' }}>
            <ShieldCheck size={28} color="white" />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: '#60a5fa' }}>
            <LoaderCircle className="spin" size={18} />
            <span>Loading PhishShield...</span>
          </div>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return <AppLayout>{children}</AppLayout>
}

function PublicRoute({ children }: { children: ReactNode }) {
  const { isAuthenticated, loading } = useAuth()

  if (loading) {
    return null
  }

  if (isAuthenticated) {
    return <Navigate to="/" replace />
  }

  return <>{children}</>
}

export function AppRoutes() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route
            path="/login"
            element={
              <PublicRoute>
                <LoginPage />
              </PublicRoute>
            }
          />
          <Route
            path="/register"
            element={
              <PublicRoute>
                <RegisterPage />
              </PublicRoute>
            }
          />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/url-scanner"
            element={
              <ProtectedRoute>
                <ScannerPage key="URL" kind="URL" />
              </ProtectedRoute>
            }
          />
          <Route
            path="/email-scanner"
            element={
              <ProtectedRoute>
                <ScannerPage key="Email" kind="Email" />
              </ProtectedRoute>
            }
          />
          <Route
            path="/sms-scanner"
            element={
              <ProtectedRoute>
                <ScannerPage key="SMS" kind="SMS" />
              </ProtectedRoute>
            }
          />
          <Route
            path="/threat-intelligence"
            element={
              <ProtectedRoute>
                <IntelligencePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/analytics"
            element={
              <ProtectedRoute>
                <AnalyticsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/reports"
            element={
              <ProtectedRoute>
                <IntelligencePage reports />
              </ProtectedRoute>
            }
          />
          <Route
            path="/settings"
            element={
              <ProtectedRoute>
                <SettingsPage />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}
