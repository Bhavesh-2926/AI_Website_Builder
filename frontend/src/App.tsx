import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useStore } from './store/useStore'
import { supabase, isSupabaseConfigured } from './services/supabase'

// Layouts imports
import { PublicLayout } from './layouts/PublicLayout'
import { DashboardLayout } from './layouts/DashboardLayout'

// Pages imports
import { LandingPage } from './pages/LandingPage'
import { FeaturesPage } from './pages/FeaturesPage'
import { PricingPage } from './pages/PricingPage'
import { AboutPage } from './pages/AboutPage'
import { ContactPage } from './pages/ContactPage'
import { LoginPage } from './pages/LoginPage'
import { SignupPage } from './pages/SignupPage'
import { ForgotPasswordPage } from './pages/ForgotPasswordPage'

import { Dashboard } from './pages/Dashboard'
import { CreateWebsiteWizard } from './pages/CreateWebsiteWizard'
import { MyWebsites } from './pages/MyWebsites'
import { WebsiteEditor } from './pages/WebsiteEditor'
import { MediaManager } from './pages/MediaManager'
import { SEOManager } from './pages/SEOManager'
import { SettingsPage } from './pages/SettingsPage'
import { ProfilePage } from './pages/ProfilePage'
import { BillingPage } from './pages/BillingPage'
import { AdminPanel } from './pages/AdminPanel'

import { PublishedWebsite } from './pages/PublishedWebsite'

// Auth Guard Wrapper
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const token = useStore((state) => state.token)
  if (!token) {
    return <Navigate to="/login" replace />
  }
  return <>{children}</>
}

const App: React.FC = () => {
  const setAuth = useStore((state) => state.setAuth)

  // Listen to Supabase Auth events
  React.useEffect(() => {
    if (isSupabaseConfigured && supabase) {
      // 1. Check active session immediately
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (session && session.user) {
          setAuth({
            id: session.user.id,
            email: session.user.email || '',
            full_name: session.user.user_metadata?.full_name || ''
          }, session.access_token)
        }
      })

      // 2. Listen for auth change updates (sign-in, sign-out, token refreshes)
      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        if (session && session.user) {
          setAuth({
            id: session.user.id,
            email: session.user.email || '',
            full_name: session.user.user_metadata?.full_name || ''
          }, session.access_token)
        } else {
          setAuth(null, null)
        }
      })

      return () => {
        subscription.unsubscribe()
      }
    }
  }, [setAuth])

  return (
    <BrowserRouter>
      <Routes>
        
        {/* Public Marketing Pages */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<LandingPage />} />
          <Route path="/features" element={<FeaturesPage />} />
          <Route path="/pricing" element={<PricingPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        </Route>

        {/* Dashboard Protected Layout */}
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }>
          <Route index element={<Dashboard />} />
          <Route path="create" element={<CreateWebsiteWizard />} />
          <Route path="websites" element={<MyWebsites />} />
          <Route path="media" element={<MediaManager />} />
          <Route path="seo" element={<SEOManager />} />
          <Route path="settings" element={<SettingsPage />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="billing" element={<BillingPage />} />
          <Route path="admin" element={<AdminPanel />} />
        </Route>

        {/* Visual Editor Page (Needs full viewport height, separate layout) */}
        <Route path="/dashboard/editor/:id" element={
          <ProtectedRoute>
            <WebsiteEditor />
          </ProtectedRoute>
        } />

        {/* Public Visitor Rendered Site */}
        <Route path="/site/:slug_or_id" element={<PublishedWebsite />} />

        {/* Fallback redirect */}
        <Route path="*" element={<Navigate to="/" replace />} />

      </Routes>
    </BrowserRouter>
  )
}

export default App
