import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useStore, Website } from '../store/useStore'
import api from '../services/api'
import { Globe, PlusCircle, Layout, Eye, Trash2, Calendar, Edit3, ArrowRight } from 'lucide-react'

export const MyWebsites: React.FC = () => {
  const navigate = useNavigate()
  const { websites, setWebsites, removeWebsite, loadingWebsites, setLoadingWebsites, setActiveWebsite } = useStore()
  const [filter, setFilter] = React.useState<'all' | 'published' | 'draft'>('all')

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

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this website? This action cannot be undone.")) {
      try {
        await api.delete(`/websites/${id}`)
        removeWebsite(id)
      } catch (err) {
        console.error("Failed to delete website:", err)
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

  const filteredWebsites = websites.filter(ws => {
    if (filter === 'all') return true
    return ws.status === filter
  })

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
      
      {/* Page Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 800 }}>My Websites</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Manage your drafts, publish templates, and review live links.</p>
        </div>
        <button onClick={() => navigate('/dashboard/create')} className="btn btn-primary">
          <PlusCircle className="w-5 h-5" /> Generate Website
        </button>
      </div>

      {/* Tabs Filter Bar */}
      <div style={{ display: 'flex', gap: '1rem', borderBottom: '1px solid var(--border-light)', paddingBottom: '0.75rem' }}>
        {(['all', 'published', 'draft'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            style={{
              background: 'none',
              border: 'none',
              color: filter === tab ? 'var(--text-primary)' : 'var(--text-muted)',
              fontWeight: 700,
              fontSize: '0.95rem',
              cursor: 'pointer',
              borderBottom: filter === tab ? '3px solid var(--primary)' : '3px solid transparent',
              paddingBottom: '0.75rem',
              textTransform: 'capitalize'
            }}
          >
            {tab} Sites ({websites.filter(w => tab === 'all' ? true : w.status === tab).length})
          </button>
        ))}
      </div>

      {/* Websites Grid */}
      {loadingWebsites ? (
        <div className="grid-cols-3">
          <div style={{ height: '240px', borderRadius: '16px' }} className="skeleton-line"></div>
          <div style={{ height: '240px', borderRadius: '16px' }} className="skeleton-line"></div>
          <div style={{ height: '240px', borderRadius: '16px' }} className="skeleton-line"></div>
        </div>
      ) : filteredWebsites.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '5rem 2rem',
          background: 'rgba(255,255,255,0.01)',
          borderRadius: '16px',
          border: '1px dashed var(--border-light)',
          color: 'var(--text-muted)'
        }}>
          <Globe className="w-12 h-12" style={{ display: 'inline-block', marginBottom: '1.5rem' }} />
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem', color: 'var(--text-primary)' }}>No Websites Found</h3>
          <p style={{ fontSize: '0.9rem', marginBottom: '2rem' }}>You don't have any websites in the "{filter}" tab.</p>
          <button onClick={() => navigate('/dashboard/create')} className="btn btn-primary">
            Create Website Now
          </button>
        </div>
      ) : (
        <div className="grid-cols-3">
          {filteredWebsites.map((site) => (
            <div
              key={site.id}
              className="glass-panel"
              style={{
                borderRadius: '16px',
                overflow: 'hidden',
                background: 'var(--bg-dark-card)',
                border: '1px solid var(--border-light)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                transition: 'all 0.3s ease'
              }}
            >
              {/* Card Header design */}
              <div style={{
                padding: '2rem 1.5rem',
                borderBottom: '1px solid var(--border-light)',
                background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.05) 0%, transparent 100%)'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem' }}>
                  <span style={{
                    padding: '0.2rem 0.5rem',
                    borderRadius: '50px',
                    fontSize: '0.7rem',
                    fontWeight: 700,
                    backgroundColor: site.status === 'published' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(245, 158, 11, 0.1)',
                    color: site.status === 'published' ? '#10b981' : '#f59e0b',
                    border: site.status === 'published' ? '1px solid rgba(16,185,129,0.2)' : '1px solid rgba(245,158,11,0.2)'
                  }}>
                    {site.status.toUpperCase()}
                  </span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: 'var(--text-muted)', fontSize: '0.75rem' }}>
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{new Date(site.created_at).toLocaleDateString()}</span>
                  </div>
                </div>

                <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
                  {site.business_name}
                </h3>
                <div style={{ display: 'flex', gap: '1rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                  <span>Type: <strong>{site.business_type}</strong></span>
                  <span>Theme: <strong>{site.theme}</strong></span>
                </div>
              </div>

              {/* Card Footer Actions */}
              <div style={{ padding: '1.25rem 1.5rem', display: 'flex', justifyContent: 'space-between', background: 'rgba(0,0,0,0.1)' }}>
                <button
                  onClick={() => handleEdit(site.id)}
                  className="btn btn-secondary"
                  style={{ padding: '0.5rem 0.85rem', fontSize: '0.8rem', gap: '0.25rem' }}
                >
                  <Edit3 className="w-3.5 h-3.5" /> Edit Visuals
                </button>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  {site.status === 'published' && (
                    <a
                      href={`/site/${site.published_url || site.id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-secondary"
                      style={{ padding: '0.5rem', display: 'flex', alignItems: 'center' }}
                      title="View Published Site"
                    >
                      <Eye className="w-4 h-4" />
                    </a>
                  )}
                  <button
                    onClick={() => handleDelete(site.id)}
                    className="btn btn-secondary"
                    style={{ padding: '0.5rem', display: 'flex', alignItems: 'center', color: '#ef4444', borderColor: 'rgba(239, 68, 68, 0.1)' }}
                    title="Delete Website"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

            </div>
          ))}
        </div>
      )}
    </div>
  )
}
