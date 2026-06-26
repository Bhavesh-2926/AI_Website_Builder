import React from 'react'
import { motion } from 'framer-motion'
import * as Icons from 'lucide-react'

// Common props for all category templates
interface TemplateProps {
  businessName: string
  businessType: string
  activePage: string
  content: Record<string, any>
  design: any
  onEditElement?: (elementId: string, currentText: string) => void
  isEditable?: boolean
}

// Helper to render lucide icon by name dynamically
const DynamicIcon = ({ name, className = 'w-6 h-6' }: { name: string; className?: string }) => {
  const IconComponent = (Icons as any)[name] || Icons.HelpCircle
  return <IconComponent className={className} />
}

// ----------------------------------------------------
// SHARED TEMPLATE COMPONENTS
// ----------------------------------------------------

export const TemplateNavbar = ({ businessName, pages, activePage, setActivePage, design }: any) => {
  const isGlass = design?.styles?.navbar === 'floating-glass'
  const isBlur = design?.styles?.navbar === 'sticky-blur'
  
  return (
    <nav className={`template-nav ${design?.styles?.navbar || 'classic-clean'}`} style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '1.25rem 2rem',
      borderRadius: isGlass ? design?.border_radius || '16px' : '0px',
      margin: isGlass ? '1rem' : '0',
      background: isGlass ? 'rgba(255,255,255,0.03)' : isBlur ? 'rgba(10, 14, 26, 0.85)' : 'transparent',
      backdropFilter: (isGlass || isBlur) ? 'blur(12px)' : 'none',
      borderBottom: isGlass ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(255,255,255,0.05)',
      position: 'sticky',
      top: '0',
      zIndex: 100
    }}>
      <div style={{ fontWeight: 800, fontSize: '1.4rem', color: 'var(--primary-color)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <Icons.Sparkles className="w-6 h-6 text-primary" style={{ color: 'var(--primary-color)' }} />
        {businessName}
      </div>
      <div style={{ display: 'flex', gap: '1.5rem', listStyle: 'none' }}>
        {pages.map((page: string) => (
          <li key={page}>
            <button 
              onClick={() => setActivePage(page)}
              style={{
                background: 'none',
                border: 'none',
                color: activePage === page ? 'var(--primary-color)' : 'var(--text-color)',
                fontWeight: activePage === page ? 700 : 500,
                cursor: 'pointer',
                fontSize: '0.95rem',
                borderBottom: activePage === page ? '2px solid var(--primary-color)' : '2px solid transparent',
                paddingBottom: '2px',
                transition: 'all 0.2s ease'
              }}
            >
              {page}
            </button>
          </li>
        ))}
      </div>
    </nav>
  )
}

export const TemplateFooter = ({ businessName }: { businessName: string }) => {
  return (
    <footer style={{
      padding: '3rem 2rem',
      borderTop: '1px solid rgba(255,255,255,0.05)',
      textAlign: 'center',
      marginTop: '4rem',
      color: 'var(--text-muted)'
    }}>
      <div style={{ display: 'flex', justifyContent: 'center', gap: '1.5rem', marginBottom: '1.5rem' }}>
        <Icons.Facebook className="w-5 h-5 cursor-pointer hover:text-white" />
        <Icons.Twitter className="w-5 h-5 cursor-pointer hover:text-white" />
        <Icons.Instagram className="w-5 h-5 cursor-pointer hover:text-white" />
      </div>
      <p style={{ fontSize: '0.9rem' }}>&copy; {new Date().getFullYear()} {businessName}. All rights reserved.</p>
    </footer>
  )
}

// ----------------------------------------------------
// 1. HOME PAGE COMPONENT
// ----------------------------------------------------
export const HomePage: React.FC<any> = ({ data, onEdit, isEditable }) => {
  const hero = data.hero || { title: 'Welcome', subtitle: 'Subtitle text here', cta_text: 'Get Started' }
  const features = data.features || []

  return (
    <div style={{ padding: '2rem' }}>
      {/* Hero Section */}
      <section style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        padding: '6rem 1rem',
        background: 'radial-gradient(circle, rgba(99, 102, 241, 0.05) 0%, transparent 80%)',
        borderRadius: '24px',
        marginBottom: '4rem'
      }}>
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          onClick={() => isEditable && onEdit?.('hero.title', hero.title)}
          style={{
            fontSize: '3.5rem',
            fontWeight: 800,
            marginBottom: '1.5rem',
            cursor: isEditable ? 'pointer' : 'default',
            border: isEditable ? '1px dashed rgba(255,255,255,0.2)' : 'none',
            padding: '4px 8px',
            borderRadius: '4px',
            lineHeight: 1.2
          }}
        >
          {hero.title}
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          onClick={() => isEditable && onEdit?.('hero.subtitle', hero.subtitle)}
          style={{
            fontSize: '1.25rem',
            color: 'var(--text-muted)',
            maxWidth: '650px',
            marginBottom: '2.5rem',
            cursor: isEditable ? 'pointer' : 'default',
            border: isEditable ? '1px dashed rgba(255,255,255,0.2)' : 'none',
            padding: '4px 8px',
            borderRadius: '4px'
          }}
        >
          {hero.subtitle}
        </motion.p>

        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => isEditable && onEdit?.('hero.cta_text', hero.cta_text)}
          style={{
            background: 'linear-gradient(135deg, var(--primary-color) 0%, var(--secondary-color) 100%)',
            color: '#fff',
            border: 'none',
            padding: '1rem 2rem',
            borderRadius: '50px',
            fontSize: '1rem',
            fontWeight: 700,
            cursor: 'pointer',
            boxShadow: '0 4px 15px rgba(99,102,241,0.2)',
            borderStyle: isEditable ? 'dashed' : 'none',
            borderColor: 'rgba(255,255,255,0.4)',
            borderWidth: isEditable ? '1px' : '0px'
          }}
        >
          {hero.cta_text}
        </motion.button>
      </section>

      {/* Intro Context */}
      {data.intro && (
        <section style={{ maxWidth: '800px', margin: '0 auto 5rem auto', textAlign: 'center' }}>
          <h2 style={{ fontSize: '2rem', marginBottom: '1.5rem' }}>Our Philosophy</h2>
          <p 
            onClick={() => isEditable && onEdit?.('intro', data.intro)}
            style={{
              color: 'var(--text-muted)',
              lineHeight: 1.8,
              fontSize: '1.1rem',
              cursor: isEditable ? 'pointer' : 'default',
              border: isEditable ? '1px dashed rgba(255,255,255,0.2)' : 'none',
              padding: '8px',
              borderRadius: '4px'
            }}
          >
            {data.intro}
          </p>
        </section>
      )}

      {/* Features Grid */}
      {features.length > 0 && (
        <section style={{ marginBottom: '4rem' }}>
          <h2 style={{ fontSize: '2.25rem', textAlign: 'center', marginBottom: '3rem' }}>Why Choose Us</h2>
          <div className="grid-cols-3">
            {features.map((feat: any, idx: number) => (
              <div 
                key={idx}
                className="glass-panel" 
                style={{
                  padding: '2.5rem 2rem',
                  borderRadius: 'var(--border-radius)',
                  border: '1px solid rgba(255,255,255,0.06)',
                  textAlign: 'center',
                  background: 'var(--surface-color)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '1rem'
                }}
              >
                <div style={{
                  padding: '1rem',
                  borderRadius: '50%',
                  background: 'rgba(99, 102, 241, 0.1)',
                  color: 'var(--primary-color)',
                  display: 'inline-flex'
                }}>
                  <DynamicIcon name={feat.icon || 'Sparkles'} />
                </div>
                <h3 
                  onClick={() => isEditable && onEdit?.(`features[${idx}].title`, feat.title)}
                  style={{
                    fontSize: '1.25rem',
                    fontWeight: 700,
                    cursor: isEditable ? 'pointer' : 'default',
                    border: isEditable ? '1px dashed rgba(255,255,255,0.2)' : 'none',
                    padding: '2px 4px'
                  }}
                >
                  {feat.title}
                </h3>
                <p 
                  onClick={() => isEditable && onEdit?.(`features[${idx}].description`, feat.description)}
                  style={{
                    color: 'var(--text-muted)',
                    fontSize: '0.95rem',
                    lineHeight: 1.6,
                    cursor: isEditable ? 'pointer' : 'default',
                    border: isEditable ? '1px dashed rgba(255,255,255,0.2)' : 'none',
                    padding: '2px 4px'
                  }}
                >
                  {feat.description}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}

// ----------------------------------------------------
// 2. ABOUT PAGE COMPONENT
// ----------------------------------------------------
export const AboutPage: React.FC<any> = ({ data, onEdit, isEditable }) => {
  const story = data.story || { headline: 'Our Story', full_text: 'Founded in 2026...' }
  const values = data.values || []

  return (
    <div style={{ padding: '3rem 2rem', maxWidth: '1000px', margin: '0 auto' }}>
      <section style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '3rem', alignItems: 'center', marginBottom: '5rem' }}>
        <div>
          <h1 
            onClick={() => isEditable && onEdit?.('story.headline', story.headline)}
            style={{
              fontSize: '2.75rem',
              marginBottom: '2rem',
              cursor: isEditable ? 'pointer' : 'default',
              border: isEditable ? '1px dashed rgba(255,255,255,0.2)' : 'none',
              padding: '4px'
            }}
          >
            {story.headline}
          </h1>
          <p 
            onClick={() => isEditable && onEdit?.('story.full_text', story.full_text)}
            style={{
              color: 'var(--text-muted)',
              lineHeight: 1.8,
              fontSize: '1.05rem',
              cursor: isEditable ? 'pointer' : 'default',
              border: isEditable ? '1px dashed rgba(255,255,255,0.2)' : 'none',
              padding: '6px'
            }}
          >
            {story.full_text}
          </p>
        </div>
        {story.image_url && (
          <div style={{ borderRadius: '16px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)' }}>
            <img src={story.image_url} alt="About Us Story" style={{ width: '100%', height: 'auto', display: 'block' }} />
          </div>
        )}
      </section>

      {values.length > 0 && (
        <section>
          <h2 style={{ fontSize: '2.25rem', textAlign: 'center', marginBottom: '3rem' }}>Our Core Values</h2>
          <div className="grid-cols-3">
            {values.map((val: any, idx: number) => (
              <div 
                key={idx}
                className="glass-panel"
                style={{
                  padding: '2rem',
                  borderRadius: 'var(--border-radius)',
                  background: 'var(--surface-color)',
                  border: '1px solid rgba(255,255,255,0.06)'
                }}
              >
                <h3 
                  onClick={() => isEditable && onEdit?.(`values[${idx}].title`, val.title)}
                  style={{
                    fontSize: '1.25rem',
                    fontWeight: 700,
                    marginBottom: '1rem',
                    color: 'var(--primary-color)',
                    cursor: isEditable ? 'pointer' : 'default',
                    border: isEditable ? '1px dashed rgba(255,255,255,0.2)' : 'none'
                  }}
                >
                  {val.title}
                </h3>
                <p 
                  onClick={() => isEditable && onEdit?.(`values[${idx}].desc`, val.desc)}
                  style={{
                    color: 'var(--text-muted)',
                    fontSize: '0.95rem',
                    lineHeight: 1.6,
                    cursor: isEditable ? 'pointer' : 'default',
                    border: isEditable ? '1px dashed rgba(255,255,255,0.2)' : 'none'
                  }}
                >
                  {val.desc}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}

// ----------------------------------------------------
// 3. SERVICES / MENU / GALLERY PAGE COMPONENT
// ----------------------------------------------------
export const ServicesPage: React.FC<any> = ({ data, onEdit, isEditable }) => {
  const items = data.items || []
  const title = data.title || 'Our Offerings'
  const subtitle = data.subtitle || 'What we bring to you'

  return (
    <div style={{ padding: '3rem 2rem' }}>
      <header style={{ textAlign: 'center', marginBottom: '4rem' }}>
        <h1 
          onClick={() => isEditable && onEdit?.('title', title)}
          style={{
            fontSize: '2.75rem',
            marginBottom: '1rem',
            cursor: isEditable ? 'pointer' : 'default',
            border: isEditable ? '1px dashed rgba(255,255,255,0.2)' : 'none'
          }}
        >
          {title}
        </h1>
        <p 
          onClick={() => isEditable && onEdit?.('subtitle', subtitle)}
          style={{
            color: 'var(--text-muted)',
            fontSize: '1.1rem',
            cursor: isEditable ? 'pointer' : 'default',
            border: isEditable ? '1px dashed rgba(255,255,255,0.2)' : 'none'
          }}
        >
          {subtitle}
        </p>
      </header>

      <div className="grid-cols-3">
        {items.map((item: any, idx: number) => (
          <div 
            key={idx}
            className="glass-panel" 
            style={{
              borderRadius: 'var(--border-radius)',
              overflow: 'hidden',
              background: 'var(--surface-color)',
              border: '1px solid rgba(255,255,255,0.06)'
            }}
          >
            {item.image_url && (
              <div style={{ height: '220px', overflow: 'hidden', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <img src={item.image_url} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
            )}
            <div style={{ padding: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h3 
                  onClick={() => isEditable && onEdit?.(`items[${idx}].name`, item.name)}
                  style={{
                    fontSize: '1.25rem',
                    fontWeight: 700,
                    cursor: isEditable ? 'pointer' : 'default',
                    border: isEditable ? '1px dashed rgba(255,255,255,0.2)' : 'none'
                  }}
                >
                  {item.name}
                </h3>
                {item.price && (
                  <span 
                    onClick={() => isEditable && onEdit?.(`items[${idx}].price`, item.price)}
                    style={{
                      fontSize: '1.1rem',
                      fontWeight: 700,
                      color: 'var(--accent-color)',
                      cursor: isEditable ? 'pointer' : 'default',
                      border: isEditable ? '1px dashed rgba(255,255,255,0.2)' : 'none'
                    }}
                  >
                    {item.price}
                  </span>
                )}
              </div>
              <p 
                onClick={() => isEditable && onEdit?.(`items[${idx}].description`, item.description)}
                style={{
                  color: 'var(--text-muted)',
                  fontSize: '0.925rem',
                  lineHeight: 1.5,
                  cursor: isEditable ? 'pointer' : 'default',
                  border: isEditable ? '1px dashed rgba(255,255,255,0.2)' : 'none'
                }}
              >
                {item.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ----------------------------------------------------
// 4. TESTIMONIALS PAGE COMPONENT
// ----------------------------------------------------
export const TestimonialsPage: React.FC<any> = ({ data, onEdit, isEditable }) => {
  const reviews = data.reviews || []
  const title = data.title || 'Client Reviews'
  const subtitle = data.subtitle || 'What our customers say'

  return (
    <div style={{ padding: '3rem 2rem' }}>
      <header style={{ textAlign: 'center', marginBottom: '4rem' }}>
        <h1 
          onClick={() => isEditable && onEdit?.('title', title)}
          style={{
            fontSize: '2.75rem',
            marginBottom: '1rem',
            cursor: isEditable ? 'pointer' : 'default',
            border: isEditable ? '1px dashed rgba(255,255,255,0.2)' : 'none'
          }}
        >
          {title}
        </h1>
        <p 
          onClick={() => isEditable && onEdit?.('subtitle', subtitle)}
          style={{
            color: 'var(--text-muted)',
            fontSize: '1.1rem',
            cursor: isEditable ? 'pointer' : 'default',
            border: isEditable ? '1px dashed rgba(255,255,255,0.2)' : 'none'
          }}
        >
          {subtitle}
        </p>
      </header>

      <div className="grid-cols-3">
        {reviews.map((rev: any, idx: number) => (
          <div 
            key={idx}
            className="glass-panel" 
            style={{
              padding: '2rem',
              borderRadius: 'var(--border-radius)',
              background: 'var(--surface-color)',
              border: '1px solid rgba(255,255,255,0.06)'
            }}
          >
            {/* Stars */}
            <div style={{ display: 'flex', gap: '0.2rem', marginBottom: '1rem', color: 'var(--accent-color)' }}>
              {Array.from({ length: rev.rating || 5 }).map((_, i) => (
                <Icons.Star key={i} className="w-5 h-5 fill-current" />
              ))}
            </div>
            
            <p 
              onClick={() => isEditable && onEdit?.(`reviews[${idx}].text`, rev.text)}
              style={{
                fontStyle: 'italic',
                color: 'var(--text-secondary)',
                lineHeight: 1.6,
                marginBottom: '1.5rem',
                cursor: isEditable ? 'pointer' : 'default',
                border: isEditable ? '1px dashed rgba(255,255,255,0.2)' : 'none'
              }}
            >
              "{rev.text}"
            </p>

            <div>
              <h4 
                onClick={() => isEditable && onEdit?.(`reviews[${idx}].name`, rev.name)}
                style={{
                  fontWeight: 700,
                  fontSize: '1rem',
                  cursor: isEditable ? 'pointer' : 'default',
                  border: isEditable ? '1px dashed rgba(255,255,255,0.2)' : 'none'
                }}
              >
                {rev.name}
              </h4>
              <span 
                onClick={() => isEditable && onEdit?.(`reviews[${idx}].role`, rev.role)}
                style={{
                  fontSize: '0.85rem',
                  color: 'var(--text-muted)',
                  cursor: isEditable ? 'pointer' : 'default',
                  border: isEditable ? '1px dashed rgba(255,255,255,0.2)' : 'none'
                }}
              >
                {rev.role}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ----------------------------------------------------
// 5. BLOG PAGE COMPONENT
// ----------------------------------------------------
export const BlogPage: React.FC<any> = ({ data, onEdit, isEditable }) => {
  const posts = data.posts || []
  const title = data.title || 'Latest Updates'
  const subtitle = data.subtitle || 'Read our blog'

  return (
    <div style={{ padding: '3rem 2rem' }}>
      <header style={{ textAlign: 'center', marginBottom: '4rem' }}>
        <h1 
          onClick={() => isEditable && onEdit?.('title', title)}
          style={{
            fontSize: '2.75rem',
            marginBottom: '1rem',
            cursor: isEditable ? 'pointer' : 'default',
            border: isEditable ? '1px dashed rgba(255,255,255,0.2)' : 'none'
          }}
        >
          {title}
        </h1>
        <p 
          onClick={() => isEditable && onEdit?.('subtitle', subtitle)}
          style={{
            color: 'var(--text-muted)',
            fontSize: '1.1rem',
            cursor: isEditable ? 'pointer' : 'default',
            border: isEditable ? '1px dashed rgba(255,255,255,0.2)' : 'none'
          }}
        >
          {subtitle}
        </p>
      </header>

      <div className="grid-cols-3">
        {posts.map((post: any, idx: number) => (
          <article 
            key={idx}
            className="glass-panel" 
            style={{
              padding: '2rem',
              borderRadius: 'var(--border-radius)',
              background: 'var(--surface-color)',
              border: '1px solid rgba(255,255,255,0.06)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}
          >
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
                <span>{post.date}</span>
                <span>{post.read_time}</span>
              </div>
              <h3 
                onClick={() => isEditable && onEdit?.(`posts[${idx}].title`, post.title)}
                style={{
                  fontSize: '1.25rem',
                  fontWeight: 700,
                  marginBottom: '1rem',
                  lineHeight: 1.4,
                  cursor: isEditable ? 'pointer' : 'default',
                  border: isEditable ? '1px dashed rgba(255,255,255,0.2)' : 'none'
                }}
              >
                {post.title}
              </h3>
              <p 
                onClick={() => isEditable && onEdit?.(`posts[${idx}].excerpt`, post.excerpt)}
                style={{
                  color: 'var(--text-muted)',
                  fontSize: '0.9rem',
                  lineHeight: 1.6,
                  marginBottom: '1.5rem',
                  cursor: isEditable ? 'pointer' : 'default',
                  border: isEditable ? '1px dashed rgba(255,255,255,0.2)' : 'none'
                }}
              >
                {post.excerpt}
              </p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '1rem' }}>
              <Icons.User className="w-4 h-4 text-primary" />
              <span 
                onClick={() => isEditable && onEdit?.(`posts[${idx}].author`, post.author)}
                style={{
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  cursor: isEditable ? 'pointer' : 'default',
                  border: isEditable ? '1px dashed rgba(255,255,255,0.2)' : 'none'
                }}
              >
                By {post.author}
              </span>
            </div>
          </article>
        ))}
      </div>
    </div>
  )
}

// ----------------------------------------------------
// 6. CONTACT PAGE COMPONENT
// ----------------------------------------------------
export const ContactPage: React.FC<any> = ({ data, onEdit, isEditable }) => {
  const headline = data.headline || 'Contact Us'
  const email = data.email || 'hello@business.com'
  const phone = data.phone || '(555) 123-4567'
  const address = data.address || '123 Business St'
  const hours = data.hours || []
  
  return (
    <div style={{ padding: '3rem 2rem', maxWidth: '1100px', margin: '0 auto' }}>
      <header style={{ textAlign: 'center', marginBottom: '4rem' }}>
        <h1 
          onClick={() => isEditable && onEdit?.('headline', headline)}
          style={{
            fontSize: '2.75rem',
            marginBottom: '1rem',
            cursor: isEditable ? 'pointer' : 'default',
            border: isEditable ? '1px dashed rgba(255,255,255,0.2)' : 'none'
          }}
        >
          {headline}
        </h1>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '4rem' }}>
        {/* Left Side: Contact Form */}
        <div className="glass-panel" style={{ padding: '2.5rem', borderRadius: 'var(--border-radius)', background: 'var(--surface-color)' }}>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>Send Us a Message</h2>
          <form onSubmit={(e) => e.preventDefault()} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div className="form-group">
              <label className="form-label">Your Name</label>
              <input type="text" placeholder="John Doe" className="input-field" disabled />
            </div>
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input type="email" placeholder="john@example.com" className="input-field" disabled />
            </div>
            <div className="form-group">
              <label className="form-label">Message</label>
              <textarea placeholder="How can we help you?" className="input-field" style={{ minHeight: '120px', resize: 'vertical' }} disabled></textarea>
            </div>
            <button className="btn btn-primary" style={{ alignSelf: 'flex-start' }} disabled>
              Submit Inquiry
            </button>
          </form>
        </div>

        {/* Right Side: Information details */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
          <div>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Icons.MapPin className="text-primary" style={{ color: 'var(--primary-color)' }} /> Address
            </h3>
            <p 
              onClick={() => isEditable && onEdit?.('address', address)}
              style={{
                color: 'var(--text-secondary)',
                cursor: isEditable ? 'pointer' : 'default',
                border: isEditable ? '1px dashed rgba(255,255,255,0.2)' : 'none'
              }}
            >
              {address}
            </p>
          </div>

          <div>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Icons.Phone className="text-primary" style={{ color: 'var(--primary-color)' }} /> Phone
            </h3>
            <p 
              onClick={() => isEditable && onEdit?.('phone', phone)}
              style={{
                color: 'var(--text-secondary)',
                cursor: isEditable ? 'pointer' : 'default',
                border: isEditable ? '1px dashed rgba(255,255,255,0.2)' : 'none'
              }}
            >
              {phone}
            </p>
          </div>

          <div>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Icons.Mail className="text-primary" style={{ color: 'var(--primary-color)' }} /> Email
            </h3>
            <p 
              onClick={() => isEditable && onEdit?.('email', email)}
              style={{
                color: 'var(--text-secondary)',
                cursor: isEditable ? 'pointer' : 'default',
                border: isEditable ? '1px dashed rgba(255,255,255,0.2)' : 'none'
              }}
            >
              {email}
            </p>
          </div>

          {hours.length > 0 && (
            <div>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Icons.Clock className="text-primary" style={{ color: 'var(--primary-color)' }} /> Business Hours
              </h3>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.4rem', color: 'var(--text-secondary)', paddingLeft: '1.75rem' }}>
                {hours.map((hr: string, i: number) => (
                  <li key={i}>{hr}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// ----------------------------------------------------
// MAIN TEMPLATE LAYOUT ASSEMBLY
// ----------------------------------------------------
export const MasterTemplateRenderer: React.FC<TemplateProps & { setActivePage: (p: string) => void }> = ({
  businessName,
  businessType,
  activePage,
  setActivePage,
  content,
  design,
  onEditElement,
  isEditable
}) => {
  // Bind design configurations to local CSS properties
  const cssVariables = {
    '--primary-color': design?.primary || '#6366f1',
    '--secondary-color': design?.secondary || '#06b6d4',
    '--accent-color': design?.accent || '#ec4899',
    '--background-color': design?.background || '#0a0e1a',
    '--surface-color': design?.surface || 'rgba(13, 20, 38, 0.6)',
    '--text-color': design?.text_color || '#f8fafc',
    '--border-radius': design?.border_radius || '16px',
    '--text-muted': design?.text_color ? `${design.text_color}cc` : '#94a3b8',
    'fontFamily': design?.font || 'Outfit',
  } as React.CSSProperties

  const pageData = content[activePage] || {}
  const pagesList = Object.keys(content)

  const renderPage = () => {
    switch (activePage) {
      case 'Home':
        return <HomePage data={pageData} onEdit={onEditElement} isEditable={isEditable} />
      case 'About':
        return <AboutPage data={pageData} onEdit={onEditElement} isEditable={isEditable} />
      case 'Services':
      case 'Menu':
      case 'Gallery':
        return <ServicesPage data={pageData} onEdit={onEditElement} isEditable={isEditable} />
      case 'Testimonials':
        return <TestimonialsPage data={pageData} onEdit={onEditElement} isEditable={isEditable} />
      case 'Blog':
        return <BlogPage data={pageData} onEdit={onEditElement} isEditable={isEditable} />
      case 'Contact':
        return <ContactPage data={pageData} onEdit={onEditElement} isEditable={isEditable} />
      default:
        return (
          <div style={{ padding: '4rem', textAlign: 'center' }}>
            <h2>Page Not Configured</h2>
            <p>Select another page link from the navigation menu above.</p>
          </div>
        )
    }
  }

  return (
    <div className="template-viewport-wrapper" style={{
      ...cssVariables,
      minHeight: '100vh',
      backgroundColor: 'var(--background-color)',
      color: 'var(--text-color)',
      transition: 'all 0.3s ease',
      position: 'relative',
      paddingBottom: '2rem'
    }}>
      <TemplateNavbar 
        businessName={businessName} 
        pages={pagesList} 
        activePage={activePage} 
        setActivePage={setActivePage}
        design={design}
      />
      
      <main style={{ minHeight: '60vh' }}>
        {renderPage()}
      </main>

      <TemplateFooter businessName={businessName} />
    </div>
  )
}
