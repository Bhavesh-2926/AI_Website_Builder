import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useStore, Website } from '../store/useStore'
import api from '../services/api'
import {
  Globe,
  FileText,
  Clock,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Eye,
  PlusCircle,
  Activity,
  Trash2
} from 'lucide-react'

export const Dashboard: React.FC = () => {
  const navigate = useNavigate()
  const { websites, setWebsites, removeWebsite, loadingWebsites, setLoadingWebsites, setActiveWebsite } = useStore()
  
  React.useEffect(() => {
    const fetchSites = async () => {
      setLoadingWebsites(true)
      try {
        const res = await api.get<Website[]>('/websites')
        setWebsites(res.data)
      } catch (err) {
        console.error("Failed to load websites:", err)
      } finally {
        setLoadingWebsites(false)
      }
    }
    fetchSites()
  }, [])

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation()
    if (confirm("Are you sure you want to delete this website? This action is permanent and deletes all pages, styles, and settings.")) {
      try {
        await api.delete(`/websites/${id}`)
        removeWebsite(id)
      } catch (err) {
        console.error("Failed to delete site:", err)
      }
    }
  }

  const handleEdit = async (id: string) => {
    try {
      const res = await api.get(`/websites/${id}`)
      setActiveWebsite(res.data)
      navigate(`/dashboard/editor/${id}`)
    } catch (err) {
      console.error("Failed to load website details:", err)
    }
  }

  const totalSites = websites.length
  const publishedSites = websites.filter(w => w.status === 'published').length
  const draftSites = websites.filter(w => w.status === 'draft').length

  const recentSites = websites.slice(0, 3)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
      
      {/* Title greeting */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 800 }}>Workspace Dashboard</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Welcome to your agent website builder cockpit.</p>
        </div>
        <button onClick={() => navigate('/dashboard/create')} className="btn btn-primary">
          <PlusCircle className="w-5 h-5" /> Generate New Website
        </button>
      </div>

      {/* Statistics Cards */}
      <div className="grid-cols-3">
        <div className="glass-panel" style={{ padding: '2rem', display: 'flex', alignItems: 'center', gap: '1.5rem', background: 'var(--bg-dark-card)' }}>
          <div style={{ padding: '1rem', borderRadius: '12px', background: 'rgba(99, 102, 241, 0.1)', color: 'var(--primary)' }}>
            <Globe className="w-8 h-8" />
          </div>
          <div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: 600 }}>TOTAL WEBSITES</p>
            <h2 style={{ fontSize: '2.25rem', fontWeight: 800 }}>{totalSites}</h2>
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '2rem', display: 'flex', alignItems: 'center', gap: '1.5rem', background: 'var(--bg-dark-card)' }}>
          <div style={{ padding: '1rem', borderRadius: '12px', background: 'rgba(16, 185, 129, 0.1)', color: '#10b981' }}>
            <TrendingUp className="w-8 h-8" />
          </div>
          <div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: 600 }}>PUBLISHED SITES</p>
            <h2 style={{ fontSize: '2.25rem', fontWeight: 800 }}>{publishedSites}</h2>
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '2rem', display: 'flex', alignItems: 'center', gap: '1.5rem', background: 'var(--bg-dark-card)' }}>
          <div style={{ padding: '1rem', borderRadius: '12px', background: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b' }}>
            <FileText className="w-8 h-8" />
          </div>
          <div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: 600 }}>DRAFT WEBSITES</p>
            <h2 style={{ fontSize: '2.25rem', fontWeight: 800 }}>{draftSites}</h2>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.3fr 0.7fr', gap: '2.5rem' }} className="dashboard-grid-mobile">
        
        {/* Left Side: Recent Websites Table/List */}
        <div className="glass-panel" style={{ padding: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Clock className="w-5 h-5 text-primary" style={{ color: 'var(--primary)' }} /> Recent Deployments
            </h3>
            {websites.length > 3 && (
              <button onClick={() => navigate('/dashboard/websites')} style={{ background: 'none', border: 'none', color: 'var(--primary)', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                View All <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>

          {loadingWebsites ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ height: '50px', borderRadius: '8px' }} className="skeleton-line"></div>
              <div style={{ height: '50px', borderRadius: '8px' }} className="skeleton-line"></div>
              <div style={{ height: '50px', borderRadius: '8px' }} className="skeleton-line"></div>
            </div>
          ) : websites.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem 0', color: 'var(--text-muted)' }}>
              <Globe className="w-12 h-12" style={{ display: 'inline-block', marginBottom: '1rem', color: 'var(--text-muted)' }} />
              <p style={{ fontWeight: 600, marginBottom: '0.5rem' }}>No websites built yet</p>
              <p style={{ fontSize: '0.85rem', marginBottom: '1.5rem' }}>Let our agents construct your landing page layout in seconds.</p>
              <button onClick={() => navigate('/dashboard/create')} className="btn btn-primary" style={{ padding: '0.6rem 1.5rem' }}>
                Create First Site <Sparkles className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {recentSites.map((site) => (
                <div
                  key={site.id}
                  onClick={() => handleEdit(site.id)}
                  className="glass-panel-hover"
                  style={{
                    padding: '1.25rem 1.5rem',
                    borderRadius: '12px',
                    border: '1px solid var(--border-light)',
                    background: 'rgba(255, 255, 255, 0.02)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <div>
                    <h4 style={{ fontWeight: 700, fontSize: '1.1rem' }}>{site.business_name}</h4>
                    <div style={{ display: 'flex', gap: '1rem', marginTop: '0.25rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      <span>Category: <strong>{site.business_type}</strong></span>
                      <span>Theme: <strong>{site.theme}</strong></span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                    <span style={{
                      padding: '0.25rem 0.6rem',
                      borderRadius: '50px',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      backgroundColor: site.status === 'published' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(245, 158, 11, 0.1)',
                      color: site.status === 'published' ? '#10b981' : '#f59e0b',
                      border: site.status === 'published' ? '1px solid rgba(16,185,129,0.2)' : '1px solid rgba(245,158,11,0.2)'
                    }}>
                      {site.status.toUpperCase()}
                    </span>

                    <button
                      onClick={(e) => handleDelete(e, site.id)}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: 'var(--text-muted)',
                        cursor: 'pointer',
                        padding: '0.5rem',
                        borderRadius: '6px',
                        transition: 'all 0.2s ease'
                      }}
                      className="delete-hover"
                    >
                      <Trash2 className="w-4 h-4 text-red-500 hover:text-red-700" style={{ color: '#ef4444' }} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Side: Quick Action and Activities */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
          
          {/* Quick Actions List */}
          <div className="glass-panel" style={{ padding: '2rem' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Activity className="w-5 h-5 text-primary" style={{ color: 'var(--primary)' }} /> Quick Operations
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <button onClick={() => navigate('/dashboard/create')} className="btn btn-secondary" style={{ justifyContent: 'space-between', fontSize: '0.9rem' }}>
                <span>Wizard Website Generator</span> <ArrowRight className="w-4 h-4" />
              </button>
              <button onClick={() => navigate('/dashboard/media')} className="btn btn-secondary" style={{ justifyContent: 'space-between', fontSize: '0.9rem' }}>
                <span>Upload Logo & Assets</span> <ArrowRight className="w-4 h-4" />
              </button>
              <button onClick={() => navigate('/dashboard/seo')} className="btn btn-secondary" style={{ justifyContent: 'space-between', fontSize: '0.9rem' }}>
                <span>Run SEO Optimizer</span> <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Recent Activity stream */}
          <div className="glass-panel" style={{ padding: '2rem' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Activity className="w-5 h-5 text-primary" style={{ color: 'var(--primary)' }} /> Live Audit Logs
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', fontSize: '0.85rem' }}>
              <div style={{ display: 'flex', gap: '0.5rem', color: 'var(--text-secondary)' }}>
                <span style={{ color: 'var(--primary)', fontWeight: 700 }}>•</span>
                <div>
                  <p>Content Copywriter Agent deployed Home copy</p>
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>2 minutes ago</span>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem', color: 'var(--text-secondary)' }}>
                <span style={{ color: 'var(--secondary)', fontWeight: 700 }}>•</span>
                <div>
                  <p>Design Agent generated Glassmorphism palette</p>
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>2 minutes ago</span>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem', color: 'var(--text-secondary)' }}>
                <span style={{ color: '#10b981', fontWeight: 700 }}>•</span>
                <div>
                  <p>Supabase Schema initialized for workspace</p>
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>1 hour ago</span>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
      
      <style>{`
        .delete-hover:hover { background: rgba(239, 68, 68, 0.1) !important; }
        @media (max-width: 1024px) {
          .dashboard-grid-mobile { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  )
}
