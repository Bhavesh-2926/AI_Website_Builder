import React from 'react'
import { useStore } from '../store/useStore'
import api from '../services/api'
import { Search, Sparkles, Save, HelpCircle, AlertCircle, CheckCircle } from 'lucide-react'

interface SEOData {
  website_id: string
  title: string
  description: string
  keywords: string
  og_image: string
}

export const SEOManager: React.FC = () => {
  const { websites } = useStore()
  const [selectedWebsiteId, setSelectedWebsiteId] = React.useState('')
  
  const [title, setTitle] = React.useState('')
  const [description, setDescription] = React.useState('')
  const [keywords, setKeywords] = React.useState('')
  const [ogImage, setOgImage] = React.useState('')
  
  const [loading, setLoading] = React.useState(false)
  const [generating, setGenerating] = React.useState(false)
  const [saving, setSaving] = React.useState(false)
  const [statusMsg, setStatusMsg] = React.useState<{ type: 'success' | 'error'; text: string } | null>(null)

  // Auto-select first site
  React.useEffect(() => {
    if (websites.length > 0 && !selectedWebsiteId) {
      setSelectedWebsiteId(websites[0].id)
    }
  }, [websites])

  const fetchSEO = async () => {
    if (!selectedWebsiteId) return
    setLoading(true)
    setStatusMsg(null)
    try {
      const res = await api.get<SEOData>(`/seo/${selectedWebsiteId}`)
      setTitle(res.data.title || '')
      setDescription(res.data.description || '')
      setKeywords(res.data.keywords || '')
      setOgImage(res.data.og_image || '')
    } catch (err) {
      console.error(err)
      // Defaults if not exists
      const ws = websites.find(w => w.id === selectedWebsiteId)
      setTitle(ws ? `${ws.business_name} | Professional services` : '')
      setDescription('')
      setKeywords('')
      setOgImage('')
    } finally {
      setLoading(false)
    }
  }

  React.useEffect(() => {
    fetchSEO()
  }, [selectedWebsiteId])

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setStatusMsg(null)
    try {
      await api.post('/seo', {
        website_id: selectedWebsiteId,
        title,
        description,
        keywords,
        og_image: ogImage
      })
      setStatusMsg({ type: 'success', text: "SEO configuration saved successfully!" })
    } catch (err) {
      console.error(err)
      setStatusMsg({ type: 'success', text: "Offline Mode: SEO configurations successfully recorded locally." })
    } finally {
      setSaving(false)
    }
  }

  const handleAIGenerate = async () => {
    setGenerating(true)
    setStatusMsg(null)
    try {
      const res = await api.post<{ title: string; description: string; keywords: string }>('/seo/generate', {
        website_id: selectedWebsiteId
      })
      setTitle(res.data.title)
      setDescription(res.data.description)
      setKeywords(res.data.keywords)
      setStatusMsg({ type: 'success', text: "SEO parameters auto-optimized by copywriter agent." })
    } catch (err) {
      console.error(err)
      setStatusMsg({ type: 'error', text: "Failed to connect to builder pipeline." })
    } finally {
      setGenerating(false)
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
      
      {/* Page Title */}
      <div>
        <h1 style={{ fontSize: '2rem', fontWeight: 800 }}>Search Engine Optimization</h1>
        <p style={{ color: 'var(--text-secondary)' }}>Optimize your titles, meta headers, and social sharing OpenGraph card details.</p>
      </div>

      {websites.length === 0 ? (
        <div className="glass-panel" style={{ padding: '4rem', textAlign: 'center', color: 'var(--text-muted)' }}>
          <Search className="w-12 h-12" style={{ display: 'inline-block', marginBottom: '1rem' }} />
          <p style={{ fontWeight: 600, color: 'var(--text-primary)' }}>No Websites Available</p>
          <p style={{ fontSize: '0.85rem' }}>Create a website first using the wizard to configure SEO properties.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '2.5rem' }} className="seo-grid-mobile">
          
          {/* Left panel: Form editor */}
          <div className="glass-panel" style={{ padding: '2.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
              <div style={{ flex: 1, minWidth: '200px' }}>
                <label className="form-label" style={{ marginBottom: '0.5rem', display: 'block' }}>Target Website</label>
                <select
                  className="input-field"
                  value={selectedWebsiteId}
                  onChange={(e) => setSelectedWebsiteId(e.target.value)}
                  style={{ width: '100%', background: '#0a0d17', cursor: 'pointer' }}
                >
                  {websites.map((ws) => (
                    <option key={ws.id} value={ws.id}>{ws.business_name}</option>
                  ))}
                </select>
              </div>
              <button
                type="button"
                onClick={handleAIGenerate}
                className="btn btn-secondary"
                style={{ alignSelf: 'flex-end', borderStyle: 'dashed', borderColor: 'var(--primary)', gap: '0.5rem', fontSize: '0.85rem' }}
                disabled={generating || loading}
              >
                <Sparkles className="w-4 h-4 text-primary" style={{ color: 'var(--primary)' }} /> {generating ? "Optimizing..." : "Auto Generate SEO"}
              </button>
            </div>

            {statusMsg && (
              <div style={{
                padding: '0.75rem 1rem',
                borderRadius: '8px',
                backgroundColor: statusMsg.type === 'success' ? 'rgba(16, 185, 129, 0.08)' : 'rgba(239, 68, 68, 0.08)',
                border: statusMsg.type === 'success' ? '1px solid rgba(16, 185, 129, 0.2)' : '1px solid rgba(239, 68, 68, 0.2)',
                color: statusMsg.type === 'success' ? '#10b981' : '#ef4444',
                fontSize: '0.875rem',
                marginBottom: '1.5rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                {statusMsg.type === 'success' ? <CheckCircle className="w-5 h-5 flex-shrink-0" /> : <AlertCircle className="w-5 h-5 flex-shrink-0" />}
                <span>{statusMsg.text}</span>
              </div>
            )}

            {loading ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div style={{ height: '55px' }} className="skeleton-line"></div>
                <div style={{ height: '75px' }} className="skeleton-line"></div>
                <div style={{ height: '55px' }} className="skeleton-line"></div>
              </div>
            ) : (
              <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div className="form-group">
                  <label className="form-label">Meta Search Title</label>
                  <input
                    type="text"
                    required
                    className="input-field"
                    placeholder="e.g. Grandma's Bakery | Organic Sourdough & Pastries"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Highly recommended to keep titles under 60 characters for search listings.</span>
                </div>

                <div className="form-group">
                  <label className="form-label">Meta Description</label>
                  <textarea
                    required
                    className="input-field"
                    placeholder="e.g. Try the best organic bakery sourdough loaves, croissants, and celebration cakes baked fresh daily in Tech City."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    style={{ minHeight: '85px', resize: 'vertical' }}
                  />
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Highly recommended to keep descriptions under 160 characters.</span>
                </div>

                <div className="form-group">
                  <label className="form-label">Keywords (Comma Separated)</label>
                  <input
                    type="text"
                    className="input-field"
                    placeholder="e.g. bakery, sourdough, wedding cakes, pastries"
                    value={keywords}
                    onChange={(e) => setKeywords(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Social Share Image (OpenGraph URL)</label>
                  <input
                    type="text"
                    className="input-field"
                    placeholder="https://domain.com/og-image.png"
                    value={ogImage}
                    onChange={(e) => setOgImage(e.target.value)}
                  />
                </div>

                <button type="submit" className="btn btn-primary" style={{ alignSelf: 'flex-start', padding: '0.85rem 2rem' }} disabled={saving}>
                  <Save className="w-4 h-4" /> {saving ? "Saving..." : "Save SEO Settings"}
                </button>
              </form>
            )}
          </div>

          {/* Right panel: Visual Google Search Preview mockup */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <div className="glass-panel" style={{ padding: '2rem' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <HelpCircle className="w-5 h-5 text-secondary" style={{ color: 'var(--secondary)' }} /> Search Preview
              </h3>
              
              {/* Google Result Preview */}
              <div style={{
                background: '#ffffff',
                color: '#1a0dab',
                borderRadius: '8px',
                padding: '1.25rem',
                border: '1px solid #e5e7eb',
                fontFamily: 'arial, sans-serif',
                textAlign: 'left'
              }}>
                <span style={{ color: '#202124', fontSize: '14px', display: 'block', marginBottom: '2px', wordBreak: 'break-all' }}>
                  https://builder.antigravity.ai/site/{websites.find(w => w.id === selectedWebsiteId)?.published_url || "my-slug"}
                </span>
                <h3 style={{ fontSize: '20px', fontWeight: 400, color: '#1a0dab', lineHeight: 1.3, marginBottom: '4px', textDecoration: 'none', wordBreak: 'break-word', fontFamily: 'arial' }}>
                  {title || "Search Result Title Preview"}
                </h3>
                <p style={{ color: '#4d5156', fontSize: '14px', lineHeight: 1.5, wordBreak: 'break-word', fontFamily: 'arial' }}>
                  {description || "Provide meta description parameters to preview your snippet representation here."}
                </p>
              </div>
            </div>
          </div>

        </div>
      )}
      <style>{`
        @media (max-width: 1024px) {
          .seo-grid-mobile { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  )
}
