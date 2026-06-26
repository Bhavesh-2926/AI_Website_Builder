import React from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import { MasterTemplateRenderer } from '../templates/BusinessTemplates'
import { AlertCircle, Sparkles } from 'lucide-react'

interface PublishedPayload {
  website: {
    id: string
    business_name: string
    business_type: string
    theme: string
    status: string
  }
  content: Record<string, any>
  design: any
  seo: any
}

export const PublishedWebsite: React.FC = () => {
  const { slug_or_id } = useParams<{ slug_or_id: string }>()
  
  const [data, setData] = React.useState<PublishedPayload | null>(null)
  const [activePage, setActivePage] = React.useState('Home')
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)

  React.useEffect(() => {
    const fetchPublicSite = async () => {
      setLoading(true)
      setError(null)
      try {
        // Public Axios call bypasses custom JWT header interceptor
        const res = await axios.get<PublishedPayload>(`/api/published/${slug_or_id}`)
        setData(res.data)
        
        // Find default starting page (usually Home)
        const pages = Object.keys(res.data.content)
        if (pages.length > 0) {
          setActivePage(pages[0])
        }

        // Apply SEO properties dynamically to document head
        if (res.data.seo) {
          document.title = res.data.seo.title || res.data.website.business_name
          
          // Update meta tags
          let metaDesc = document.querySelector('meta[name="description"]')
          if (!metaDesc) {
            metaDesc = document.createElement('meta')
            metaDesc.setAttribute('name', 'description')
            document.head.appendChild(metaDesc)
          }
          metaDesc.setAttribute('content', res.data.seo.description || '')

          let metaKeywords = document.querySelector('meta[name="keywords"]')
          if (!metaKeywords) {
            metaKeywords = document.createElement('meta')
            metaKeywords.setAttribute('name', 'keywords')
            document.head.appendChild(metaKeywords)
          }
          metaKeywords.setAttribute('content', res.data.seo.keywords || '')
        }
      } catch (err: any) {
        console.error("Public site fetch failed:", err)
        setError(err.response?.data?.detail || "This website is currently offline, in draft, or not published yet.")
      } finally {
        setLoading(false)
      }
    }
    
    if (slug_or_id) {
      fetchPublicSite()
    }
  }, [slug_or_id])

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        flexDirection: 'column',
        gap: '1rem',
        backgroundColor: '#0a0e1a',
        color: '#fff'
      }}>
        <span className="spinner"></span>
        <p style={{ color: '#94a3b8', fontSize: '0.95rem' }}>Loading Deployed Site Workspace...</p>
      </div>
    )
  }

  if (error || !data) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        flexDirection: 'column',
        gap: '1rem',
        backgroundColor: '#0a0e1a',
        color: '#fff',
        padding: '2rem',
        textAlign: 'center'
      }}>
        <div style={{
          padding: '1rem',
          borderRadius: '50%',
          background: 'rgba(239, 68, 68, 0.1)',
          color: '#ef4444',
          marginBottom: '1rem',
          display: 'inline-flex'
        }}>
          <AlertCircle className="w-10 h-10" />
        </div>
        <h2 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Website Offline</h2>
        <p style={{ color: '#94a3b8', maxWidth: '450px' }}>{error}</p>
        <a href="/" className="btn btn-primary" style={{ marginTop: '2rem' }}>
          Build Your Own Website <Sparkles className="w-4 h-4" />
        </a>
      </div>
    )
  }

  const { website, content, design } = data

  return (
    <MasterTemplateRenderer
      businessName={website.business_name}
      businessType={website.business_type}
      activePage={activePage}
      setActivePage={setActivePage}
      content={content}
      design={design}
      isEditable={false}
    />
  )
}
