import React from 'react'
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { useStore } from '../store/useStore'
import { supabase } from '../services/supabase'
import {
  LayoutDashboard,
  PlusCircle,
  Globe,
  Image,
  Search,
  Settings,
  User,
  CreditCard,
  ShieldAlert,
  LogOut,
  Sparkles,
  Menu,
  X
} from 'lucide-react'

export const DashboardLayout: React.FC = () => {
  const { user, logout } = useStore()
  const location = useLocation()
  const navigate = useNavigate()
  const [mobileOpen, setMobileOpen] = React.useState(false)

  const handleLogout = async () => {
    if (supabase) {
      await supabase.auth.signOut()
    }
    logout()
    navigate('/')
  }

  const menuItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Create Website', path: '/dashboard/create', icon: PlusCircle },
    { name: 'My Websites', path: '/dashboard/websites', icon: Globe },
    { name: 'Media Library', path: '/dashboard/media', icon: Image },
    { name: 'SEO Settings', path: '/dashboard/seo', icon: Search },
    { name: 'Billing & Plan', path: '/dashboard/billing', icon: CreditCard },
    { name: 'Profile Settings', path: '/dashboard/profile', icon: User },
    { name: 'Global Settings', path: '/dashboard/settings', icon: Settings },
    { name: 'Admin Panel', path: '/dashboard/admin', icon: ShieldAlert }
  ]

  const SidebarContent = () => (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', padding: '2rem 1.5rem' }}>
      {/* Brand Header */}
      <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 800, fontSize: '1.25rem', color: 'var(--text-primary)', marginBottom: '2.5rem' }}>
        <Sparkles className="text-primary w-6 h-6" style={{ color: 'var(--primary)' }} />
        <span>Antigravity <span className="gradient-text">SaaS</span></span>
      </Link>

      {/* Navigation List */}
      <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', flex: 1 }}>
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path
          const Icon = item.icon
          return (
            <Link
              key={item.name}
              to={item.path}
              onClick={() => setMobileOpen(false)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '0.85rem 1.25rem',
                borderRadius: '10px',
                textDecoration: 'none',
                color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
                background: isActive ? 'linear-gradient(135deg, rgba(99, 102, 241, 0.15) 0%, rgba(6, 182, 212, 0.05) 100%)' : 'transparent',
                border: isActive ? '1px solid rgba(99, 102, 241, 0.2)' : '1px solid transparent',
                fontWeight: isActive ? 600 : 500,
                transition: 'all 0.2s ease'
              }}
              className="dashboard-nav-item"
            >
              <Icon className="w-5 h-5" style={{ color: isActive ? 'var(--primary)' : 'inherit' }} />
              <span>{item.name}</span>
            </Link>
          )
        })}
      </nav>

      {/* User Details & Sign Out */}
      <div style={{ borderTop: '1px solid var(--border-light)', paddingTop: '1.5rem', marginTop: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, var(--primary) 0%, var(--accent) 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 700,
            color: '#fff'
          }}>
            {user?.full_name?.charAt(0).toUpperCase() || user?.email.charAt(0).toUpperCase() || 'U'}
          </div>
          <div style={{ overflow: 'hidden' }}>
            <h4 style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-primary)', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
              {user?.full_name || 'Authenticated User'}
            </h4>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
              {user?.email}
            </p>
          </div>
        </div>

        <button
          onClick={handleLogout}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            width: '100%',
            padding: '0.75rem 1.25rem',
            borderRadius: '8px',
            background: 'rgba(239, 68, 68, 0.05)',
            border: '1px solid rgba(239, 68, 68, 0.1)',
            color: '#ef4444',
            fontWeight: 600,
            cursor: 'pointer',
            justifyContent: 'center',
            transition: 'all 0.2s ease'
          }}
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  )

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-dark)' }}>
      {/* Background gradients */}
      <div className="gradient-bg">
        <div className="gradient-glow-1"></div>
        <div className="gradient-glow-2"></div>
      </div>

      {/* Sidebar for Desktop */}
      <aside className="glass-panel" style={{
        width: '280px',
        position: 'fixed',
        top: '1rem',
        bottom: '1rem',
        left: '1rem',
        zIndex: 900,
        borderRadius: '16px',
        border: '1px solid var(--border-light)',
        display: 'block'
      }}>
        <SidebarContent />
      </aside>

      {/* Mobile Top Bar */}
      <header className="glass-panel mobile-header" style={{
        position: 'fixed',
        top: '0',
        left: '0',
        right: '0',
        height: '60px',
        zIndex: 800,
        padding: '0 1rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderRadius: '0',
        borderBottom: '1px solid var(--border-light)'
      }}>
        <button onClick={() => setMobileOpen(true)} style={{ background: 'none', border: 'none', color: 'var(--text-primary)', cursor: 'pointer' }}>
          <Menu className="w-6 h-6" />
        </button>
        <span style={{ fontWeight: 800, color: 'var(--text-primary)' }}>Dashboard</span>
        <div style={{ width: '24px' }}></div> {/* spacer */}
      </header>

      {/* Mobile Navigation Drawer */}
      {mobileOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.8)',
          zIndex: 1000,
          backdropFilter: 'blur(4px)'
        }}>
          <div className="glass-panel" style={{
            width: '280px',
            height: '100%',
            position: 'relative',
            borderRadius: '0'
          }}>
            <button
              onClick={() => setMobileOpen(false)}
              style={{ position: 'absolute', top: '1.25rem', right: '1.25rem', background: 'none', border: 'none', color: 'var(--text-primary)', cursor: 'pointer' }}
            >
              <X className="w-6 h-6" />
            </button>
            <SidebarContent />
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main style={{
        flex: 1,
        marginLeft: '310px',
        padding: '2rem',
        minHeight: '100vh',
        width: 'calc(100% - 310px)'
      }} className="dashboard-main-content">
        <Outlet />
      </main>

      {/* Add responsive overrides style tag */}
      <style>{`
        .mobile-header { display: none !important; }
        @media (max-width: 1024px) {
          .glass-panel[style*="width: 280px"] { display: none !important; }
          .mobile-header { display: flex !important; }
          .dashboard-main-content {
            margin-left: 0 !important;
            width: 100% !important;
            padding-top: 80px !important;
          }
        }
      `}</style>
    </div>
  )
}
