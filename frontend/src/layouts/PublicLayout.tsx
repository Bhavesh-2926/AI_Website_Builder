import React from 'react'
import { Link, Outlet, useNavigate } from 'react-router-dom'
import { useStore } from '../store/useStore'
import { Sparkles, Moon, Sun, ArrowRight } from 'lucide-react'

export const PublicLayout: React.FC = () => {
  const { user, theme, toggleTheme } = useStore()
  const navigate = useNavigate()

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Background radial glows */}
      <div className="gradient-bg">
        <div className="gradient-glow-1"></div>
        <div className="gradient-glow-2"></div>
      </div>

      {/* Main Navbar */}
      <header className="glass-panel" style={{
        position: 'sticky',
        top: '1rem',
        margin: '0 2rem',
        zIndex: 1000,
        padding: '0.75rem 2rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderRadius: '12px',
        border: '1px solid var(--border-light)'
      }}>
        <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 800, fontSize: '1.25rem', color: 'var(--text-primary)' }}>
          <Sparkles className="text-primary w-6 h-6" style={{ color: 'var(--primary)' }} />
          <span>Antigravity <span className="gradient-text">Builder</span></span>
        </Link>

        {/* Desktop nav links */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
          <Link to="/features" style={{ textDecoration: 'none', color: 'var(--text-secondary)', fontWeight: 500, fontSize: '0.95rem' }} className="hover-nav">Features</Link>
          <Link to="/pricing" style={{ textDecoration: 'none', color: 'var(--text-secondary)', fontWeight: 500, fontSize: '0.95rem' }} className="hover-nav">Pricing</Link>
          <Link to="/about" style={{ textDecoration: 'none', color: 'var(--text-secondary)', fontWeight: 500, fontSize: '0.95rem' }} className="hover-nav">About</Link>
          <Link to="/contact" style={{ textDecoration: 'none', color: 'var(--text-secondary)', fontWeight: 500, fontSize: '0.95rem' }} className="hover-nav">Contact</Link>
        </nav>

        {/* Action button triggers */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <button onClick={toggleTheme} style={{
            background: 'none',
            border: 'none',
            color: 'var(--text-primary)',
            cursor: 'pointer',
            padding: '0.5rem',
            display: 'flex'
          }}>
            {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
          
          {user ? (
            <button onClick={() => navigate('/dashboard')} className="btn btn-primary" style={{ padding: '0.5rem 1.25rem', fontSize: '0.9rem' }}>
              Dashboard <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <>
              <Link to="/login" style={{ textDecoration: 'none', color: 'var(--text-primary)', fontWeight: 600, fontSize: '0.9rem' }}>Login</Link>
              <Link to="/signup" className="btn btn-primary" style={{ padding: '0.5rem 1.25rem', fontSize: '0.9rem' }}>Get Started</Link>
            </>
          )}
        </div>
      </header>

      {/* Main Public Page Outlet */}
      <main style={{ flex: 1, padding: '2rem 0' }}>
        <Outlet />
      </main>

      {/* Footer */}
      <footer style={{
        padding: '3rem 2rem',
        borderTop: '1px solid var(--border-light)',
        textAlign: 'center',
        background: 'rgba(0,0,0,0.2)',
        color: 'var(--text-muted)',
        fontSize: '0.9rem'
      }}>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', marginBottom: '1rem' }}>
          <Link to="/features" style={{ textDecoration: 'none', color: 'var(--text-muted)' }}>Features</Link>
          <Link to="/pricing" style={{ textDecoration: 'none', color: 'var(--text-muted)' }}>Pricing</Link>
          <Link to="/about" style={{ textDecoration: 'none', color: 'var(--text-muted)' }}>About Us</Link>
          <Link to="/contact" style={{ textDecoration: 'none', color: 'var(--text-muted)' }}>Contact</Link>
        </div>
        <p>&copy; {new Date().getFullYear()} Antigravity Builder SaaS. Created for professional web generation.</p>
      </footer>
    </div>
  )
}
