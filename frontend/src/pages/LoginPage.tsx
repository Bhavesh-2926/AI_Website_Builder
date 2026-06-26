import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useStore } from '../store/useStore'
import { supabase, isSupabaseConfigured } from '../services/supabase'
import api from '../services/api'
import { Sparkles, Mail, Lock, ArrowRight, Chrome, AlertCircle } from 'lucide-react'

export const LoginPage: React.FC = () => {
  const navigate = useNavigate()
  const { setAuth } = useStore()
  
  const [email, setEmail] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [error, setError] = React.useState<string | null>(null)
  const [loading, setLoading] = React.useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    if (!isSupabaseConfigured) {
      // Offline fallback bypass
      handleBypassDemo()
      return
    }

    try {
      const { data, error: authError } = await supabase!.auth.signInWithPassword({
        email,
        password
      })

      if (authError) throw authError

      if (data.user && data.session) {
        const profile = {
          id: data.user.id,
          email: data.user.email || '',
          full_name: data.user.user_metadata?.full_name || ''
        }
        
        // Sync with backend database
        try {
          await api.post('/auth/sync', profile)
        } catch (syncErr) {
          console.error("Backend auth sync failed:", syncErr)
        }

        setAuth(profile, data.session.access_token)
        navigate('/dashboard')
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred during authentication')
      setLoading(false)
    }
  }

  const handleGoogleLogin = async () => {
    if (!isSupabaseConfigured) {
      handleBypassDemo()
      return
    }
    
    try {
      const { error } = await supabase!.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/dashboard`
        }
      })
      if (error) throw error
    } catch (err: any) {
      setError(err.message || 'OAuth error')
    }
  }

  const handleBypassDemo = () => {
    // Standard mock session data
    const mockUser = {
      id: '00000000-0000-0000-0000-000000000000',
      email: 'demo@example.com',
      full_name: 'Demo Account'
    }
    setAuth(mockUser, 'mock_token_abcdefg123456789')
    navigate('/dashboard')
  }

  return (
    <div style={{ maxWidth: '440px', margin: '4rem auto', padding: '0 1rem' }}>
      <div className="glass-panel" style={{ padding: '3rem 2.5rem', border: '1px solid var(--border-light)' }}>
        
        {/* Brand Header */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ display: 'inline-flex', padding: '0.5rem', borderRadius: '50%', background: 'rgba(99, 102, 241, 0.1)', color: 'var(--primary)', marginBottom: '1rem' }}>
            <Sparkles className="w-8 h-8" />
          </div>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Welcome Back</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '0.25rem' }}>Login to access your generated sites</p>
        </div>

        {/* Warning notification about mock status */}
        {!isSupabaseConfigured && (
          <div style={{
            display: 'flex',
            gap: '0.75rem',
            padding: '1rem',
            borderRadius: '8px',
            background: 'rgba(245, 158, 11, 0.08)',
            border: '1px solid rgba(245, 158, 11, 0.2)',
            color: '#f59e0b',
            fontSize: '0.85rem',
            marginBottom: '1.5rem'
          }}>
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <div>
              <p style={{ fontWeight: 700 }}>Supabase Offline Mode</p>
              <p>Signing in will automatically launch the fully functional offline Demo Dashboard.</p>
            </div>
          </div>
        )}

        {error && (
          <div style={{
            padding: '0.75rem 1rem',
            borderRadius: '8px',
            backgroundColor: 'rgba(239, 68, 68, 0.08)',
            border: '1px solid rgba(239, 68, 68, 0.2)',
            color: '#ef4444',
            fontSize: '0.875rem',
            marginBottom: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <AlertCircle className="w-5 h-5" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <div style={{ position: 'relative' }}>
              <Mail style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', width: '18px', color: 'var(--text-muted)' }} />
              <input
                type="email"
                required
                className="input-field"
                placeholder="you@domain.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{ paddingLeft: '2.5rem', width: '100%' }}
              />
            </div>
          </div>

          <div className="form-group">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
              <label className="form-label">Password</label>
              <Link to="/forgot-password" style={{ fontSize: '0.8rem', color: 'var(--primary)', textDecoration: 'none' }}>Forgot Password?</Link>
            </div>
            <div style={{ position: 'relative' }}>
              <Lock style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', width: '18px', color: 'var(--text-muted)' }} />
              <input
                type="password"
                required
                className="input-field"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ paddingLeft: '2.5rem', width: '100%' }}
              />
            </div>
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '0.85rem' }} disabled={loading}>
            {loading ? <span className="spinner"></span> : <>Log In <ArrowRight className="w-4 h-4" /></>}
          </button>
        </form>

        <div style={{ margin: '1.5rem 0', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ flex: 1, height: '1px', background: 'var(--border-light)' }}></div>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>OR SIGN IN WITH</span>
          <div style={{ flex: 1, height: '1px', background: 'var(--border-light)' }}></div>
        </div>

        <button
          onClick={handleGoogleLogin}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem',
            width: '100%',
            padding: '0.75rem',
            borderRadius: '8px',
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid var(--border-light)',
            color: 'var(--text-primary)',
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'all var(--transition-fast)'
          }}
          className="google-btn"
        >
          <Chrome className="w-5 h-5" />
          <span>Google Workspace</span>
        </button>

        {!isSupabaseConfigured && (
          <button
            onClick={handleBypassDemo}
            style={{
              marginTop: '1rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '100%',
              padding: '0.75rem',
              borderRadius: '8px',
              background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.2) 0%, rgba(99, 102, 241, 0.2) 100%)',
              border: '1px solid var(--primary)',
              color: 'var(--text-primary)',
              fontWeight: 700,
              cursor: 'pointer'
            }}
          >
            Bypass with Demo Account
          </button>
        )}

        <div style={{ marginTop: '2rem', textAlign: 'center', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
          Don't have an account? <Link to="/signup" style={{ color: 'var(--primary)', fontWeight: 600, textDecoration: 'none' }}>Sign Up</Link>
        </div>
      </div>
      <style>{`
        .google-btn:hover { background: rgba(255,255,255,0.08) !important; }
      `}</style>
    </div>
  )
}
