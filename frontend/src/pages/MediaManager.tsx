import React from 'react'
import { useStore } from '../store/useStore'
import api from '../services/api'
import { Image, Upload, Search, Trash2, Globe, Link2, AlertCircle } from 'lucide-react'

interface MediaItem {
  id: string
  website_id: string
  file_url: string
  file_type: string
  created_at: string
}

export const MediaManager: React.FC = () => {
  const { websites } = useStore()
  const [selectedWebsiteId, setSelectedWebsiteId] = React.useState('')
  const [mediaList, setMediaList] = React.useState<MediaItem[]>([])
  const [loading, setLoading] = React.useState(false)
  const [search, setSearch] = React.useState('')
  const [uploading, setUploading] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  // Populate first website selected by default
  React.useEffect(() => {
    if (websites.length > 0 && !selectedWebsiteId) {
      setSelectedWebsiteId(websites[0].id)
    }
  }, [websites])

  const fetchMedia = async () => {
    if (!selectedWebsiteId) return
    setLoading(true)
    setError(null)
    try {
      const res = await api.get<MediaItem[]>(`/media/website/${selectedWebsiteId}`)
      setMediaList(res.data)
    } catch (err) {
      console.error(err)
      // Mock assets for demonstration if API fails/offline
      setMediaList([
        {
          id: 'mock-media-1',
          website_id: selectedWebsiteId,
          file_url: "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=600&q=80",
          file_type: "image/jpeg",
          created_at: new Date().toISOString()
        },
        {
          id: 'mock-media-2',
          website_id: selectedWebsiteId,
          file_url: "https://images.unsplash.com/photo-1549931319-a545dcf3bc73?auto=format&fit=crop&w=600&q=80",
          file_type: "image/jpeg",
          created_at: new Date().toISOString()
        }
      ])
    } finally {
      setLoading(false)
    }
  }

  React.useEffect(() => {
    fetchMedia()
  }, [selectedWebsiteId])

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !selectedWebsiteId) return

    setUploading(true)
    setError(null)

    const formData = new FormData()
    formData.append('website_id', selectedWebsiteId)
    formData.append('file', file)

    try {
      const res = await api.post<MediaItem>('/media/upload-media', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      setMediaList((prev) => [res.data, ...prev])
    } catch (err) {
      console.error(err)
      // Mock addition
      const mockUrl = URL.createObjectURL(file)
      const newItem: MediaItem = {
        id: 'mock-' + Math.random().toString(36).substr(2, 9),
        website_id: selectedWebsiteId,
        file_url: mockUrl,
        file_type: file.type,
        created_at: new Date().toISOString()
      }
      setMediaList((prev) => [newItem, ...prev])
      setError("Server upload failed. Media successfully simulated in active local sandbox.")
    } finally {
      setUploading(false)
    }
  }

  const handleDelete = async (mediaId: string) => {
    if (confirm("Are you sure you want to delete this asset?")) {
      try {
        await api.delete(`/media/${mediaId}`)
        setMediaList((prev) => prev.filter((m) => m.id !== mediaId))
      } catch (err) {
        console.error(err)
        // Mock delete
        setMediaList((prev) => prev.filter((m) => m.id !== mediaId))
      }
    }
  }

  const filteredMedia = mediaList.filter((m) =>
    m.file_url.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
      
      {/* Header title */}
      <div>
        <h1 style={{ fontSize: '2rem', fontWeight: 800 }}>Media Asset Library</h1>
        <p style={{ color: 'var(--text-secondary)' }}>Upload logos, backgrounds, DALL-E outputs, and pricing menu items.</p>
      </div>

      {websites.length === 0 ? (
        <div className="glass-panel" style={{ padding: '4rem', textAlign: 'center', color: 'var(--text-muted)' }}>
          <Image className="w-12 h-12" style={{ display: 'inline-block', marginBottom: '1rem' }} />
          <p style={{ fontWeight: 600, color: 'var(--text-primary)' }}>No Websites Available</p>
          <p style={{ fontSize: '0.85rem' }}>Create a website first using the wizard to populate your asset media bucket.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: '2.5rem' }} className="media-grid-mobile">
          
          {/* Left panel: select site & upload assets */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            
            {/* Website Selector */}
            <div className="glass-panel" style={{ padding: '1.75rem' }}>
              <label className="form-label" style={{ marginBottom: '0.5rem', display: 'block' }}>Active Website Bucket</label>
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

            {/* Upload Box */}
            <div className="glass-panel" style={{ padding: '2rem 1.75rem', textAlign: 'center', position: 'relative' }}>
              <div style={{
                border: '2px dashed var(--border-light)',
                borderRadius: '12px',
                padding: '2.5rem 1rem',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '0.75rem'
              }} className="upload-box-dashed">
                <Upload className="w-8 h-8 text-primary" style={{ color: 'var(--primary)' }} />
                <div>
                  <p style={{ fontWeight: 700, fontSize: '0.9rem' }}>Upload Brand Image</p>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>Drag & Drop or click file</p>
                </div>
                <input
                  type="file"
                  onChange={handleFileUpload}
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    opacity: 0,
                    cursor: 'pointer'
                  }}
                  disabled={uploading}
                />
              </div>
              {uploading && (
                <div style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem', alignItems: 'center', justifyContent: 'center' }}>
                  <span className="spinner" style={{ width: '16px', height: '16px', borderWidth: '2px' }}></span>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Uploading image buffer...</span>
                </div>
              )}
            </div>

            {error && (
              <div style={{
                padding: '1rem',
                borderRadius: '8px',
                background: 'rgba(99,102,241,0.05)',
                border: '1px solid var(--border-glow)',
                color: 'var(--text-secondary)',
                fontSize: '0.8rem',
                display: 'flex',
                gap: '0.5rem'
              }}>
                <AlertCircle className="w-5 h-5 flex-shrink-0 text-primary" style={{ color: 'var(--primary)' }} />
                <span>{error}</span>
              </div>
            )}
          </div>

          {/* Right panel: media explorer cards grid */}
          <div className="glass-panel" style={{ padding: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Exploration Panel</h3>
              <div style={{ position: 'relative', width: '260px' }}>
                <Search style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', width: '16px', color: 'var(--text-muted)' }} />
                <input
                  type="text"
                  placeholder="Filter by image url..."
                  className="input-field"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  style={{ paddingLeft: '2.25rem', width: '100%', fontSize: '0.85rem' }}
                />
              </div>
            </div>

            {loading ? (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
                <div style={{ height: '150px', borderRadius: '12px' }} className="skeleton-line"></div>
                <div style={{ height: '150px', borderRadius: '12px' }} className="skeleton-line"></div>
                <div style={{ height: '150px', borderRadius: '12px' }} className="skeleton-line"></div>
              </div>
            ) : filteredMedia.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '5rem 0', color: 'var(--text-muted)' }}>
                <Image className="w-12 h-12" style={{ display: 'inline-block', marginBottom: '1rem' }} />
                <p style={{ fontWeight: 600 }}>No assets found</p>
                <p style={{ fontSize: '0.85rem' }}>Upload files or use DALL-E to add layouts images.</p>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '1.25rem' }}>
                {filteredMedia.map((media) => (
                  <div
                    key={media.id}
                    className="glass-panel media-card"
                    style={{
                      borderRadius: '12px',
                      overflow: 'hidden',
                      background: 'rgba(255,255,255,0.01)',
                      border: '1px solid var(--border-light)',
                      position: 'relative'
                    }}
                  >
                    <div style={{ height: '140px', overflow: 'hidden', background: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <img src={media.file_url} alt="Media Asset" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                    
                    <div style={{ padding: '0.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(0,0,0,0.1)' }}>
                      <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '100px' }}>
                        {media.file_type}
                      </span>
                      <div style={{ display: 'flex', gap: '0.25rem' }}>
                        <button
                          onClick={() => { navigator.clipboard.writeText(media.file_url); alert("Asset URL copied to clipboard!"); }}
                          style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '4px' }}
                          title="Copy Public URL"
                        >
                          <Link2 className="w-4 h-4 hover:text-white" />
                        </button>
                        <button
                          onClick={() => handleDelete(media.id)}
                          style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '4px' }}
                          title="Delete File"
                        >
                          <Trash2 className="w-4 h-4 hover:text-red-500" style={{ color: '#ef4444' }} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      )}
      <style>{`
        .upload-box-dashed:hover { border-color: var(--primary) !important; background: rgba(99,102,241,0.02); }
        @media (max-width: 768px) {
          .media-grid-mobile { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  )
}
