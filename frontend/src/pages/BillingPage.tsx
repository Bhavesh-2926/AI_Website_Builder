import React from 'react'
import { useStore } from '../store/useStore'
import { CreditCard, Check, ShieldCheck, Sparkles, TrendingUp } from 'lucide-react'

export const BillingPage: React.FC = () => {
  const { websites } = useStore()
  
  const siteCount = websites.length
  const currentPlan = siteCount > 1 ? "Professional" : "Starter"

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
      
      {/* Title */}
      <div>
        <h1 style={{ fontSize: '2rem', fontWeight: 800 }}>Billing & Subscriptions</h1>
        <p style={{ color: 'var(--text-secondary)' }}>Manage your payment methods, billing history, and upgrade subscription levels.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '2.5rem' }} className="billing-grid-mobile">
        
        {/* Left Side: Plans detail */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          
          {/* Current plan banner */}
          <div className="glass-panel" style={{
            padding: '2.5rem',
            border: '1px solid var(--border-glow)',
            background: 'linear-gradient(135deg, rgba(13, 20, 38, 0.7) 0%, rgba(99, 102, 241, 0.05) 100%)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '1.5rem'
          }}>
            <div>
              <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--primary)', textTransform: 'uppercase' }}>Active Account Plan</span>
              <h2 style={{ fontSize: '2.25rem', fontWeight: 800, marginTop: '0.25rem' }}>{currentPlan} Plan</h2>
              <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem' }}>Your subscription renews automatically on July 26, 2026.</p>
            </div>
            
            <div style={{ textAlign: 'right' }}>
              <span style={{ fontSize: '2.25rem', fontWeight: 800 }}>{currentPlan === 'Starter' ? '$0' : '$19'}</span>
              <span style={{ color: 'var(--text-muted)' }}> / mo</span>
              <p style={{ fontSize: '0.8rem', color: '#10b981', fontWeight: 600, marginTop: '0.25rem' }}>Active Status</p>
            </div>
          </div>

          {/* Upgrade Plan Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }} className="inner-grid-mobile">
            <div className="glass-panel" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', opacity: currentPlan === 'Starter' ? 1 : 0.6 }}>
              <div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem' }}>Starter</h3>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>Basic mock generation and testing</p>
                <h2 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '1.5rem' }}>Free</h2>
                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                  <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Check className="w-4 h-4 text-primary" /> 1 Draft site</li>
                  <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Check className="w-4 h-4 text-primary" /> Standard templates</li>
                </ul>
              </div>
              {currentPlan === 'Starter' ? (
                <button className="btn btn-secondary" style={{ width: '100%', marginTop: '2rem', cursor: 'not-allowed' }} disabled>Current Plan</button>
              ) : (
                <button className="btn btn-secondary" style={{ width: '100%', marginTop: '2rem' }}>Downgrade</button>
              )}
            </div>

            <div className="glass-panel" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', border: currentPlan === 'Professional' ? '1px solid var(--primary)' : '1px solid var(--border-light)' }}>
              <div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  Professional <Sparkles className="w-4 h-4 text-primary" style={{ color: 'var(--primary)' }} />
                </h3>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>Full autonomous business custom hosting</p>
                <h2 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '1.5rem' }}>$19 <span style={{ fontSize: '0.9rem', fontWeight: 500, color: 'var(--text-muted)' }}>/mo</span></h2>
                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                  <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Check className="w-4 h-4 text-primary" /> Unlimited websites</li>
                  <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Check className="w-4 h-4 text-primary" /> DALL-E Image Tokens</li>
                  <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Check className="w-4 h-4 text-primary" /> Custom DNS domains</li>
                </ul>
              </div>
              {currentPlan === 'Professional' ? (
                <button className="btn btn-secondary" style={{ width: '100%', marginTop: '2rem', cursor: 'not-allowed' }} disabled>Current Plan</button>
              ) : (
                <button className="btn btn-primary" style={{ width: '100%', marginTop: '2rem' }}>Upgrade Now</button>
              )}
            </div>
          </div>

        </div>

        {/* Right Side: Usage tracker & payment methods */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          
          {/* Usage Meter */}
          <div className="glass-panel" style={{ padding: '2rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <TrendingUp className="w-5 h-5 text-secondary" style={{ color: 'var(--secondary)' }} /> Plan Resource Usage
            </h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.4rem' }}>
                  <span>Generated Sites</span>
                  <span>{siteCount} {currentPlan === 'Starter' ? '/ 1' : '/ Unlimited'}</span>
                </div>
                <div style={{ height: '8px', background: 'var(--border-light)', borderRadius: '50px', position: 'relative', overflow: 'hidden' }}>
                  <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: currentPlan === 'Starter' ? `${Math.min((siteCount / 1) * 100, 100)}%` : '15%',
                    height: '100%',
                    background: 'var(--primary)',
                    borderRadius: '50px'
                  }}></div>
                </div>
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.4rem' }}>
                  <span>DALL-E Image Tokens</span>
                  <span>{currentPlan === 'Starter' ? '0 / 0' : '15 / 100'}</span>
                </div>
                <div style={{ height: '8px', background: 'var(--border-light)', borderRadius: '50px', position: 'relative', overflow: 'hidden' }}>
                  <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: currentPlan === 'Starter' ? '0%' : '15%',
                    height: '100%',
                    background: 'var(--secondary)',
                    borderRadius: '50px'
                  }}></div>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Method mockup */}
          <div className="glass-panel" style={{ padding: '2rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <CreditCard className="w-5 h-5 text-primary" style={{ color: 'var(--primary)' }} /> Payment Details
            </h3>
            <div style={{
              border: '1px solid var(--border-light)',
              borderRadius: '8px',
              padding: '1rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              background: 'rgba(255,255,255,0.01)',
              fontSize: '0.9rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{ fontWeight: 800, fontSize: '0.75rem', background: '#e0e0e0', color: '#1a1a1a', padding: '0.2rem 0.5rem', borderRadius: '4px' }}>VISA</div>
                <span>•••• •••• •••• 4242</span>
              </div>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Exp: 12/28</span>
            </div>
          </div>

        </div>

      </div>
      <style>{`
        @media (max-width: 1024px) {
          .billing-grid-mobile { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 768px) {
          .inner-grid-mobile { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  )
}
