import React from 'react'
import { Link } from 'react-router-dom'
import { Zap, Paintbrush, FileText, Image, Search, ShieldCheck } from 'lucide-react'

export const FeaturesPage: React.FC = () => {
  const features = [
    {
      icon: Zap,
      title: "Real-time AI Generation",
      description: "Our requirement, content, and design agents structure your website blueprint, generate professional copy, and configure custom styling tokens in under 10 seconds."
    },
    {
      icon: Paintbrush,
      title: "Visual Live Editor",
      description: "Easily modify header titles, descriptions, theme primary/secondary colors, fonts, roundness styles, and item pricing directly from an inline, split-screen editor dashboard."
    },
    {
      icon: Image,
      title: "AI DALL-E Image Creator",
      description: "Generate matching branding imagery directly from text prompts. We process the images and upload them into your personal Supabase Storage asset bucket."
    },
    {
      icon: Search,
      title: "SEO Management Swarm",
      description: "Auto-generate search-engine optimized title headers, keywords, description tags, and social media OpenGraph cards based on your company type."
    },
    {
      icon: FileText,
      title: "Multi-Section Templates",
      description: "Get category-specific designs for Bakeries, Cafes, Gyms, Restaurants, Portfolios, Agencies, and E-commerce shops with prebuilt menu systems and testimonials."
    },
    {
      icon: ShieldCheck,
      title: "One-Click Instant Hosting",
      description: "Press publish to immediately switch your website status from Draft to Published, mapping it to a unique URL slug accessible publicly."
    }
  ]

  return (
    <div className="container" style={{ padding: '3rem 0 6rem 0' }}>
      <header style={{ textAlign: 'center', marginBottom: '5rem' }}>
        <h1 style={{ fontSize: '3.5rem', fontWeight: 800, marginBottom: '1.5rem' }}>
          Explore Our <span className="gradient-text">Features</span>
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.25rem', maxWidth: '650px', margin: '0 auto' }}>
          We provide everything you need to generate, customize, edit, manage, and host professional landing pages for your business.
        </p>
      </header>

      <div className="grid-cols-3" style={{ marginBottom: '6rem' }}>
        {features.map((feat, idx) => {
          const Icon = feat.icon
          return (
            <div key={idx} className="glass-panel glass-panel-hover" style={{ padding: '2.5rem 2rem' }}>
              <div style={{
                color: 'var(--primary)',
                background: 'rgba(99, 102, 241, 0.1)',
                padding: '0.75rem',
                borderRadius: '12px',
                display: 'inline-flex',
                marginBottom: '1.5rem'
              }}>
                <Icon className="w-7 h-7" />
              </div>
              <h3 style={{ fontSize: '1.35rem', fontWeight: 700, marginBottom: '1rem' }}>{feat.title}</h3>
              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6, fontSize: '0.95rem' }}>{feat.description}</p>
            </div>
          )
        })}
      </div>

      {/* Visual walkthrough banner */}
      <div className="glass-panel" style={{
        padding: '4rem 3rem',
        display: 'grid',
        gridTemplateColumns: '1.10fr 0.90fr',
        gap: '4rem',
        alignItems: 'center',
        background: 'linear-gradient(135deg, rgba(13, 20, 38, 0.4) 0%, rgba(99, 102, 241, 0.05) 100%)',
        border: '1px solid var(--border-light)',
        borderRadius: '24px'
      }}>
        <div>
          <h2 style={{ fontSize: '2.25rem', marginBottom: '1.5rem' }}>The Visual Sandbox Editor</h2>
          <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '2rem' }}>
            Our visual sandbox editor gives you full control over style tokens. Watch updates reflect on the page instantly, without code compilation or page refreshes. Toggle easily between Desktop and Mobile previews to guarantee a responsive mobile-first look.
          </p>
          <Link to="/signup" className="btn btn-primary">
            Start Editing Free
          </Link>
        </div>
        <div style={{
          background: 'rgba(0,0,0,0.4)',
          borderRadius: '16px',
          border: '1px solid var(--border-light)',
          padding: '1.5rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-light)', paddingBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Color Preferences</span>
            <span style={{ fontSize: '0.8rem', color: 'var(--primary)', fontWeight: 600 }}>Interactive Preview</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: 'var(--primary)', border: '2px solid #fff' }}></div>
            <div>
              <p style={{ fontSize: '0.9rem', fontWeight: 600 }}>Primary Brand Theme</p>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Hex: #6366F1 (Indigo)</p>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: 'var(--secondary)', border: '2px solid #fff' }}></div>
            <div>
              <p style={{ fontSize: '0.9rem', fontWeight: 600 }}>Secondary Accent Style</p>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Hex: #06B6D4 (Cyan)</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
