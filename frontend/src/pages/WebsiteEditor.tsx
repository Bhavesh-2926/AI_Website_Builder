import React from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useStore, ActiveWebsitePayload } from '../store/useStore'
import api from '../services/api'
import { TemplateRenderer } from '../templates/TemplateRenderer'
import { downloadSite } from '../utils/downloadSite'
import {
  Save,
  Globe,
  Settings,
  ChevronLeft,
  Smartphone,
  Monitor,
  Eye,
  EyeOff,
  Sparkles,
  Layout,
  Palette,
  AlignLeft,
  X,
  FileText,
  AlertCircle,
  Download
} from 'lucide-react'

export const WebsiteEditor: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const {
    activeWebsite,
    setActiveWebsite,
    activePage,
    setActivePage,
    updateActiveWebsiteContent,
    updateActiveWebsiteDesign,
    previewMode,
    setPreviewMode,
    deviceView,
    setDeviceView,
    selectedElement,
    setSelectedElement
  } = useStore()

  const [saving, setSaving] = React.useState(false)
  const [showPublishModal, setShowPublishModal] = React.useState(false)
  const [customSlug, setCustomSlug] = React.useState('')
  const [publishing, setPublishing] = React.useState(false)
  const [publishStatus, setPublishStatus] = React.useState<string | null>(null)
  
  // Selected tab in editor sidebar
  const [editorTab, setEditorTab] = React.useState<'pages' | 'theme' | 'content'>('content')

  // Fetch website details if not loaded
  React.useEffect(() => {
    const fetchDetails = async () => {
      if (!activeWebsite || activeWebsite.website.id !== id) {
        try {
          const res = await api.get<ActiveWebsitePayload>(`/websites/${id}`)
          setActiveWebsite(res.data)
          if (res.data.website.published_url) {
            setCustomSlug(res.data.website.published_url)
          }
        } catch (err) {
          console.error("Failed to load website details:", err)
        }
      }
    }
    fetchDetails()
  }, [id])

  if (!activeWebsite) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '80vh', flexDirection: 'column', gap: '1rem' }}>
        <span className="spinner"></span>
        <p style={{ color: 'var(--text-secondary)' }}>Loading Website Builder Visual Editor...</p>
      </div>
    )
  }

  const { website, content, design } = activeWebsite
  const pagesList = Object.keys(content)
  const currentPageContent = content[activePage] || {}

  // Handle saving changes manually
  const handleSave = async () => {
    setSaving(true)
    try {
      // 1. Save Content for each page
      for (const pageName of pagesList) {
        await api.put(`/websites/${id}/content`, {
          page_name: pageName,
          content_json: content[pageName]
        })
      }
      // 2. Save Design configuration
      if (design) {
        await api.put(`/websites/${id}/design`, {
          design_json: design
        })
      }
      alert("Website changes saved successfully!")
    } catch (err) {
      console.error("Failed to save changes:", err)
      alert("Failed to save changes. Operating in offline demo save.")
    } finally {
      setSaving(false)
    }
  }

  // Handle publishing website
  const handlePublish = async () => {
    setPublishing(true)
    setPublishStatus(null)
    try {
      const res = await api.post('/publish', {
        website_id: id,
        custom_slug: customSlug
      })
      
      const updatedSlug = res.data.website.published_url
      setCustomSlug(updatedSlug)
      
      // Update website status in store
      setActiveWebsite({
        ...activeWebsite,
        website: res.data.website
      })

      setPublishStatus(`Success! Published publicly at: /site/${updatedSlug}`)
    } catch (err) {
      console.error(err)
      // Mock publish fallback
      const fallbackSlug = customSlug || website.business_name.toLowerCase().replace(/ /g, '-')
      setActiveWebsite({
        ...activeWebsite,
        website: {
          ...website,
          status: 'published',
          published_url: fallbackSlug
        }
      })
      setPublishStatus(`Offline Sandbox success. Site slug configured as: /site/${fallbackSlug}`)
    } finally {
      setPublishing(false)
    }
  }

  // Handle inline element edits
  const handleEditElement = (elementId: string, currentText: string) => {
    setEditorTab('content')
    setSelectedElement(elementId)
  }

  // Dynamically update nested key inside currentPageContent JSON
  const updateNestedContent = (keyPath: string, value: string) => {
    const updatedContent = JSON.parse(JSON.stringify(currentPageContent))
    const keys = keyPath.split(/[.[\]]/).filter(Boolean)
    
    let current = updatedContent
    for (let i = 0; i < keys.length - 1; i++) {
      const key = keys[i]
      // Check if key is a index number
      const nextKey = keys[i + 1]
      const isNextNum = !isNaN(Number(nextKey))
      
      if (!current[key]) {
        current[key] = isNextNum ? [] : {}
      }
      current = current[key]
    }
    
    current[keys[keys.length - 1]] = value
    updateActiveWebsiteContent(activePage, updatedContent)
  }

  // Resolve content value from keyPath
  const resolveContentValue = (keyPath: string): string => {
    const keys = keyPath.split(/[.[\]]/).filter(Boolean)
    let current = currentPageContent
    for (const key of keys) {
      if (current === undefined || current === null) return ''
      current = current[key]
    }
    return typeof current === 'string' ? current : ''
  }

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      margin: '-2rem', // offset layout padding
      position: 'relative',
      overflow: 'hidden'
    }}>
      
      {/* Editor Control Header */}
      <header className="glass-panel" style={{
        padding: '0.75rem 2rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderRadius: '0',
        borderBottom: '1px solid var(--border-light)',
        background: 'rgba(10, 14, 26, 0.9)',
        zIndex: 100
      }}>
        {/* Left header controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <button onClick={() => navigate('/dashboard/websites')} style={{
            background: 'none',
            border: 'none',
            color: 'var(--text-secondary)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.25rem',
            fontWeight: 600
          }}>
            <ChevronLeft className="w-5 h-5" /> Dashboard
          </button>
          <div style={{ width: '1px', height: '24px', background: 'var(--border-light)' }}></div>
          <div>
            <h2 style={{ fontSize: '1.1rem', fontWeight: 800 }}>{website.business_name}</h2>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Status: <strong>{website.status}</strong></span>
          </div>
        </div>

        {/* Viewport scale toggles */}
        {!previewMode && (
          <div style={{ display: 'flex', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-light)', borderRadius: '8px', padding: '2px' }}>
            <button onClick={() => setDeviceView('desktop')} style={{
              background: deviceView === 'desktop' ? 'var(--primary)' : 'none',
              border: 'none',
              color: '#fff',
              padding: '0.35rem 0.75rem',
              borderRadius: '6px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.25rem',
              fontWeight: 600,
              fontSize: '0.8rem'
            }}>
              <Monitor className="w-4 h-4" /> Desktop
            </button>
            <button onClick={() => setDeviceView('mobile')} style={{
              background: deviceView === 'mobile' ? 'var(--primary)' : 'none',
              border: 'none',
              color: '#fff',
              padding: '0.35rem 0.75rem',
              borderRadius: '6px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.25rem',
              fontWeight: 600,
              fontSize: '0.8rem'
            }}>
              <Smartphone className="w-4 h-4" /> Mobile
            </button>
          </div>
        )}

        {/* Editor CTA operations */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <button onClick={() => setPreviewMode(!previewMode)} className="btn btn-secondary" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}>
            {previewMode ? <><EyeOff className="w-4 h-4" /> Edit Layout</> : <><Eye className="w-4 h-4" /> Hide Panels</>}
          </button>
          <button onClick={handleSave} className="btn btn-secondary" style={{ padding: '0.5rem 1.25rem', fontSize: '0.85rem' }} disabled={saving}>
            <Save className="w-4 h-4" /> {saving ? "Saving..." : "Save Draft"}
          </button>
          <button onClick={() => downloadSite(activeWebsite)} className="btn btn-secondary" style={{ padding: '0.5rem 1.25rem', fontSize: '0.85rem' }}>
            <Download className="w-4 h-4" /> Download Code
          </button>
          <button onClick={() => setShowPublishModal(true)} className="btn btn-primary" style={{ padding: '0.5rem 1.25rem', fontSize: '0.85rem' }}>
            <Globe className="w-4 h-4" /> Go Live
          </button>
        </div>
      </header>

      {/* Editor Body */}
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden', background: '#070b13' }}>
        
        {/* Left Side: Editorial Settings Panel */}
        {!previewMode && (
          <aside className="glass-panel" style={{
            width: '350px',
            borderRadius: '0',
            borderRight: '1px solid var(--border-light)',
            display: 'flex',
            flexDirection: 'column',
            zIndex: 50
          }}>
            {/* Control Sidebar Tabs */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', borderBottom: '1px solid var(--border-light)' }}>
              <button
                onClick={() => setEditorTab('content')}
                style={{
                  background: 'none',
                  border: 'none',
                  padding: '1rem 0',
                  color: editorTab === 'content' ? 'var(--primary)' : 'var(--text-secondary)',
                  borderBottom: editorTab === 'content' ? '2.5px solid var(--primary)' : '2.5px solid transparent',
                  cursor: 'pointer',
                  fontWeight: 700,
                  fontSize: '0.85rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.25rem'
                }}
              >
                <AlignLeft className="w-4 h-4" /> Content
              </button>
              <button
                onClick={() => setEditorTab('theme')}
                style={{
                  background: 'none',
                  border: 'none',
                  padding: '1rem 0',
                  color: editorTab === 'theme' ? 'var(--primary)' : 'var(--text-secondary)',
                  borderBottom: editorTab === 'theme' ? '2.5px solid var(--primary)' : '2.5px solid transparent',
                  cursor: 'pointer',
                  fontWeight: 700,
                  fontSize: '0.85rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.25rem'
                }}
              >
                <Palette className="w-4 h-4" /> Theme
              </button>
              <button
                onClick={() => setEditorTab('pages')}
                style={{
                  background: 'none',
                  border: 'none',
                  padding: '1rem 0',
                  color: editorTab === 'pages' ? 'var(--primary)' : 'var(--text-secondary)',
                  borderBottom: editorTab === 'pages' ? '2.5px solid var(--primary)' : '2.5px solid transparent',
                  cursor: 'pointer',
                  fontWeight: 700,
                  fontSize: '0.85rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.25rem'
                }}
              >
                <Layout className="w-4 h-4" /> Pages
              </button>
            </div>

            {/* Tab panel scroll box */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '1.75rem' }}>
              
              {/* TAB 1: Pages List navigation */}
              {editorTab === 'pages' && (
                <div>
                  <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem', fontWeight: 800 }}>Manage Pages</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {pagesList.map((pgName) => (
                      <button
                        key={pgName}
                        onClick={() => setActivePage(pgName)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.75rem',
                          padding: '0.75rem 1rem',
                          borderRadius: '8px',
                          border: activePage === pgName ? '1px solid var(--primary)' : '1px solid var(--border-light)',
                          background: activePage === pgName ? 'rgba(99, 102, 241, 0.08)' : 'rgba(255,255,255,0.01)',
                          color: activePage === pgName ? 'var(--text-primary)' : 'var(--text-secondary)',
                          fontWeight: 600,
                          cursor: 'pointer',
                          textAlign: 'left'
                        }}
                      >
                        <FileText className="w-4 h-4 text-primary" />
                        <span>{pgName} Page</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 2: Design system Tokens */}
              {editorTab === 'theme' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 800 }}>Design Tokens</h3>
                  
                  {/* Font dropdown selection */}
                  <div className="form-group">
                    <label className="form-label">Google Typography Font</label>
                    <select
                      className="input-field"
                      value={design?.font || 'Outfit'}
                      onChange={(e) => updateActiveWebsiteDesign({ font: e.target.value })}
                      style={{ background: '#0a0d17', cursor: 'pointer' }}
                    >
                      <option value="Outfit">Outfit (Clean Sans)</option>
                      <option value="Inter">Inter (SaaS Standard)</option>
                      <option value="Poppins">Poppins (Friendly Geometric)</option>
                      <option value="Playfair Display">Playfair Display (Elegant Serif)</option>
                      <option value="Roboto">Roboto (Corporate Neo-grotesque)</option>
                    </select>
                  </div>

                  {/* Theme Colors selection */}
                  <div className="form-group">
                    <label className="form-label">Primary Styling Color</label>
                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                      <input type="color" className="input-field" style={{ width: '45px', padding: '0', border: 'none', cursor: 'pointer' }} value={design?.primary || '#6366f1'} onChange={(e) => updateActiveWebsiteDesign({ primary: e.target.value })} />
                      <input type="text" className="input-field" style={{ flex: 1, fontSize: '0.85rem' }} value={design?.primary || ''} onChange={(e) => updateActiveWebsiteDesign({ primary: e.target.value })} />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Secondary Support Color</label>
                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                      <input type="color" className="input-field" style={{ width: '45px', padding: '0', border: 'none', cursor: 'pointer' }} value={design?.secondary || '#06b6d4'} onChange={(e) => updateActiveWebsiteDesign({ secondary: e.target.value })} />
                      <input type="text" className="input-field" style={{ flex: 1, fontSize: '0.85rem' }} value={design?.secondary || ''} onChange={(e) => updateActiveWebsiteDesign({ secondary: e.target.value })} />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Accent Highlight Color</label>
                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                      <input type="color" className="input-field" style={{ width: '45px', padding: '0', border: 'none', cursor: 'pointer' }} value={design?.accent || '#ec4899'} onChange={(e) => updateActiveWebsiteDesign({ accent: e.target.value })} />
                      <input type="text" className="input-field" style={{ flex: 1, fontSize: '0.85rem' }} value={design?.accent || ''} onChange={(e) => updateActiveWebsiteDesign({ accent: e.target.value })} />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Theme Background Base</label>
                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                      <input type="color" className="input-field" style={{ width: '45px', padding: '0', border: 'none', cursor: 'pointer' }} value={design?.background || '#0a0e1a'} onChange={(e) => updateActiveWebsiteDesign({ background: e.target.value })} />
                      <input type="text" className="input-field" style={{ flex: 1, fontSize: '0.85rem' }} value={design?.background || ''} onChange={(e) => updateActiveWebsiteDesign({ background: e.target.value })} />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Border Radius Roundness</label>
                    <select
                      className="input-field"
                      value={design?.border_radius || '16px'}
                      onChange={(e) => updateActiveWebsiteDesign({ border_radius: e.target.value })}
                      style={{ background: '#0a0d17', cursor: 'pointer' }}
                    >
                      <option value="0px">0px (Flat sharp)</option>
                      <option value="4px">4px (Classic angular)</option>
                      <option value="8px">8px (Standard pill)</option>
                      <option value="16px">16px (Fluid Modern)</option>
                      <option value="30px">30px (Dynamic bubble)</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Glass Blur Strength</label>
                    <select
                      className="input-field"
                      value={design?.styles?.blur_strength || '16px'}
                      onChange={(e) => updateActiveWebsiteDesign({ styles: { blur_strength: e.target.value } })}
                      style={{ background: '#0a0d17', cursor: 'pointer' }}
                    >
                      <option value="4px">4px (Low glass blur)</option>
                      <option value="16px">16px (Medium standard)</option>
                      <option value="32px">32px (Deep frost reflection)</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Card Border & Glow Effect</label>
                    <select
                      className="input-field"
                      value={design?.styles?.glow_intensity || 'low'}
                      onChange={(e) => updateActiveWebsiteDesign({ styles: { glow_intensity: e.target.value } })}
                      style={{ background: '#0a0d17', cursor: 'pointer' }}
                    >
                      <option value="low">Soft Translucent (Default)</option>
                      <option value="high">Accent Glowing Border</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Hover Animation Effect</label>
                    <select
                      className="input-field"
                      value={design?.styles?.hover_animation || 'translate-up'}
                      onChange={(e) => updateActiveWebsiteDesign({ styles: { hover_animation: e.target.value } })}
                      style={{ background: '#0a0d17', cursor: 'pointer' }}
                    >
                      <option value="translate-up">Float Slide (Classic)</option>
                      <option value="scale-up">Pop Zoom (Geometric scale)</option>
                    </select>
                  </div>
                </div>
              )}

              {/* TAB 3: Text content overrides */}
              {editorTab === 'content' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 800 }}>Page Content Copy</h3>
                    <span style={{ fontSize: '0.75rem', padding: '0.2rem 0.5rem', background: 'rgba(99,102,241,0.1)', color: 'var(--primary)', borderRadius: '50px', fontWeight: 700 }}>
                      {activePage.toUpperCase()}
                    </span>
                  </div>

                  {selectedElement ? (
                    <div style={{
                      padding: '1rem',
                      borderRadius: '8px',
                      background: 'rgba(99, 102, 241, 0.05)',
                      border: '1px solid rgba(99, 102, 241, 0.2)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.75rem'
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--primary)', textTransform: 'uppercase' }}>Selected Field</span>
                        <button onClick={() => setSelectedElement(null)} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}>
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                      <p style={{ fontSize: '0.85rem', fontFamily: 'monospace', color: 'var(--text-secondary)' }}>Path: {selectedElement}</p>
                      
                      <textarea
                        className="input-field"
                        value={resolveContentValue(selectedElement)}
                        onChange={(e) => updateNestedContent(selectedElement, e.target.value)}
                        style={{ width: '100%', minHeight: '100px', resize: 'vertical', fontSize: '0.9rem', padding: '0.5rem' }}
                      />
                      <button onClick={() => setSelectedElement(null)} className="btn btn-primary" style={{ padding: '0.4rem 1rem', fontSize: '0.8rem', alignSelf: 'flex-end' }}>
                        Confirm Edit
                      </button>
                    </div>
                  ) : (
                    <div style={{ padding: '1.5rem 0', textAlign: 'center', border: '1px dashed var(--border-light)', borderRadius: '8px' }}>
                      <FileText className="w-10 h-10 text-muted" style={{ display: 'inline-block', marginBottom: '0.5rem', color: 'var(--text-muted)' }} />
                      <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', padding: '0 1rem' }}>
                        Click on any text or button inside the template view to edit its text inline.
                      </p>
                    </div>
                  )}

                  {/* Section list preview helper */}
                  <div style={{ borderTop: '1px solid var(--border-light)', paddingTop: '1.5rem' }}>
                    <p style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '0.75rem' }}>Available Sections</p>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                      {currentPageContent.hero && (
                        <button onClick={() => handleEditElement('hero.title', currentPageContent.hero.title)} style={{ padding: '0.35rem 0.6rem', border: '1px solid var(--border-light)', background: 'rgba(255,255,255,0.02)', color: 'var(--text-secondary)', borderRadius: '6px', fontSize: '0.75rem', cursor: 'pointer' }}>
                          Hero Title
                        </button>
                      )}
                      {currentPageContent.hero && (
                        <button onClick={() => handleEditElement('hero.subtitle', currentPageContent.hero.subtitle)} style={{ padding: '0.35rem 0.6rem', border: '1px solid var(--border-light)', background: 'rgba(255,255,255,0.02)', color: 'var(--text-secondary)', borderRadius: '6px', fontSize: '0.75rem', cursor: 'pointer' }}>
                          Hero Subtitle
                        </button>
                      )}
                      {currentPageContent.intro && (
                        <button onClick={() => handleEditElement('intro', currentPageContent.intro)} style={{ padding: '0.35rem 0.6rem', border: '1px solid var(--border-light)', background: 'rgba(255,255,255,0.02)', color: 'var(--text-secondary)', borderRadius: '6px', fontSize: '0.75rem', cursor: 'pointer' }}>
                          Philosophy Text
                        </button>
                      )}
                    </div>
                  </div>

                </div>
              )}

            </div>
          </aside>
        )}

        {/* Right Side: Sandbox Viewport Preview Frame */}
        <section style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: previewMode ? '0' : '2rem',
          overflow: 'hidden',
          position: 'relative'
        }}>
          
          {/* Scrollable frame mimicking device viewport sizing */}
          <div style={{
            width: deviceView === 'mobile' && !previewMode ? '375px' : '100%',
            height: deviceView === 'mobile' && !previewMode ? '700px' : '100%',
            borderRadius: deviceView === 'mobile' && !previewMode ? '32px' : '0px',
            border: deviceView === 'mobile' && !previewMode ? '10px solid #222' : 'none',
            boxShadow: deviceView === 'mobile' && !previewMode ? '0 25px 50px -12px rgba(0, 0, 0, 0.8)' : 'none',
            overflowY: 'auto',
            transition: 'all 0.3s ease',
            background: design?.background || '#0a0e1a'
          }}>
            <TemplateRenderer isEditable={!previewMode} onEditElement={handleEditElement} />
          </div>

        </section>

      </div>

      {/* PUBLISH MODAL CONFIGURATION */}
      {showPublishModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.85)',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backdropFilter: 'blur(5px)'
        }}>
          <div className="glass-panel" style={{
            maxWidth: '480px',
            width: '100%',
            padding: '2.5rem',
            border: '1px solid var(--border-glow)',
            position: 'relative'
          }}>
            <button onClick={() => { setShowPublishModal(false); setPublishStatus(null); }} style={{ position: 'absolute', top: '1.25rem', right: '1.25rem', background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}>
              <X className="w-6 h-6" />
            </button>

            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
              <Globe className="w-12 h-12 text-primary" style={{ color: 'var(--primary)', display: 'inline-block', marginBottom: '0.75rem' }} />
              <h2 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Publish Website</h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Deploy your website layout publicly.</p>
            </div>

            {publishStatus ? (
              <div style={{
                padding: '1rem',
                borderRadius: '8px',
                background: 'rgba(16, 185, 129, 0.08)',
                border: '1px solid rgba(16, 185, 129, 0.2)',
                color: '#10b981',
                fontSize: '0.9rem',
                marginBottom: '1.5rem',
                wordBreak: 'break-all'
              }}>
                <p style={{ fontWeight: 700, marginBottom: '0.25rem' }}>Site Published!</p>
                <p>{publishStatus}</p>
                <div style={{ marginTop: '1.5rem', display: 'flex', gap: '0.75rem' }}>
                  <a
                    href={`/site/${customSlug || id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-primary"
                    style={{ flex: 1, padding: '0.5rem', fontSize: '0.85rem', textDecoration: 'none', textAlign: 'center' }}
                  >
                    View Live Website
                  </a>
                  <button
                    onClick={() => { setShowPublishModal(false); setPublishStatus(null); }}
                    className="btn btn-secondary"
                    style={{ flex: 1, padding: '0.5rem', fontSize: '0.85rem' }}
                  >
                    Close Modal
                  </button>
                </div>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div className="form-group">
                  <label className="form-label">Customize Site Slug (Sub-path URL)</label>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <span style={{
                      padding: '0.75rem 0.5rem 0.75rem 1rem',
                      background: 'rgba(255,255,255,0.02)',
                      border: '1px solid var(--border-light)',
                      borderRight: 'none',
                      borderTopLeftRadius: '8px',
                      borderBottomLeftRadius: '8px',
                      color: 'var(--text-muted)',
                      fontSize: '0.9rem'
                    }}>
                      /site/
                    </span>
                    <input
                      type="text"
                      className="input-field"
                      placeholder="e.g. delicious-bakery"
                      value={customSlug}
                      onChange={(e) => setCustomSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                      style={{
                        flex: 1,
                        borderTopLeftRadius: '0px',
                        borderBottomLeftRadius: '0px',
                        paddingLeft: '0.25rem'
                      }}
                    />
                  </div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Alphanumerics and hyphens only. Must be unique.</span>
                </div>

                <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
                  <button
                    onClick={() => { setShowPublishModal(false); setPublishStatus(null); }}
                    className="btn btn-secondary"
                    style={{ flex: 1 }}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handlePublish}
                    className="btn btn-primary"
                    style={{ flex: 1 }}
                    disabled={publishing}
                  >
                    {publishing ? <span className="spinner"></span> : "Confirm & Deploy"}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  )
}
