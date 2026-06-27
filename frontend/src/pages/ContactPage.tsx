import React from 'react'
import { Mail, Phone, MapPin, Send } from 'lucide-react'

export const ContactPage: React.FC = () => {
  const [submitted, setSubmitted] = React.useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
  }

  return (
    <div className="container" style={{ padding: '3rem 0 6rem 0', maxWidth: '1000px' }}>
      <header style={{ textAlign: 'center', marginBottom: '5rem' }}>
        <h1 style={{ fontSize: '3.5rem', fontWeight: 800, marginBottom: '1.5rem' }}>
          Get in <span className="gradient-text">Touch</span>
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.25rem', maxWidth: '600px', margin: '0 auto' }}>
          Have questions about our collaborative builders, enterprise hosting, or pricing structures? Send us a message and we'll reply shortly.
        </p>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '4rem' }}>
        {/* Contact Form */}
        <div className="glass-panel" style={{ padding: '3rem 2.5rem' }}>
          {submitted ? (
            <div style={{ textAlign: 'center', padding: '3rem 0' }}>
              <div style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                background: 'rgba(16, 185, 129, 0.1)',
                color: '#10b981',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1.5rem'
              }}>
                <Send className="w-8 h-8" />
              </div>
              <h2 style={{ fontSize: '1.75rem', marginBottom: '0.75rem' }}>Message Sent!</h2>
              <p style={{ color: 'var(--text-secondary)' }}>We've received your query. Our team will get back to you within 24 hours.</p>
              <button onClick={() => setSubmitted(false)} className="btn btn-secondary" style={{ marginTop: '2rem' }}>
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }} className="grid-mobile-single">
                <div className="form-group">
                  <label className="form-label">First Name</label>
                  <input type="text" className="input-field" placeholder="John" required />
                </div>
                <div className="form-group">
                  <label className="form-label">Last Name</label>
                  <input type="text" className="input-field" placeholder="Doe" required />
                </div>
              </div>
              
              <div className="form-group">
                <label className="form-label">Email Address</label>
                <input type="email" className="input-field" placeholder="john@example.com" required />
              </div>

              <div className="form-group">
                <label className="form-label">Message</label>
                <textarea className="input-field" placeholder="Describe what you are looking for..." style={{ minHeight: '130px', resize: 'vertical' }} required></textarea>
              </div>

              <button type="submit" className="btn btn-primary" style={{ alignSelf: 'flex-start', padding: '0.85rem 2rem' }}>
                Submit Message <Send className="w-4 h-4" />
              </button>
            </form>
          )}
        </div>

        {/* Contact details */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem', justifyContent: 'center' }}>
          <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'center' }}>
            <div style={{
              background: 'rgba(99, 102, 241, 0.1)',
              color: 'var(--primary)',
              padding: '0.75rem',
              borderRadius: '10px'
            }}>
              <Mail className="w-6 h-6" />
            </div>
            <div>
              <h4 style={{ fontWeight: 700, fontSize: '1.1rem' }}>Email Support</h4>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>support@swiftsite.com</p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'center' }}>
            <div style={{
              background: 'rgba(6, 182, 212, 0.1)',
              color: 'var(--secondary)',
              padding: '0.75rem',
              borderRadius: '10px'
            }}>
              <Phone className="w-6 h-6" />
            </div>
            <div>
              <h4 style={{ fontWeight: 700, fontSize: '1.1rem' }}>Call Us</h4>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>+1 (555) 123-4567</p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'center' }}>
            <div style={{
              background: 'rgba(236, 72, 153, 0.1)',
              color: 'var(--accent)',
              padding: '0.75rem',
              borderRadius: '10px'
            }}>
              <MapPin className="w-6 h-6" />
            </div>
            <div>
              <h4 style={{ fontWeight: 700, fontSize: '1.1rem' }}>Headquarters</h4>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>100 Pine Street, San Francisco, CA</p>
            </div>
          </div>
        </div>
      </div>
      <style>{`
        @media (max-width: 768px) {
          .grid-mobile-single { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  )
}
