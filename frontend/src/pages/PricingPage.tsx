import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Check, Sparkles } from 'lucide-react'

export const PricingPage: React.FC = () => {
  const navigate = useNavigate()

  const plans = [
    {
      name: "Starter",
      price: "$0",
      description: "Perfect for testing our generator capabilities and building simple mock layouts.",
      features: [
        "1 Draft Website",
        "Standard templates (Bakery, Gym, etc.)",
        "Free hosting under subdomains",
        "Stock Unsplash image integration",
        "Local visual text editor"
      ],
      cta: "Sign Up Free",
      popular: false
    },
    {
      name: "Professional",
      price: "$19",
      description: "For active business owners looking to deploy production-ready customized websites.",
      features: [
        "Unlimited generated websites",
        "Advanced Copywriting (GPT powered)",
        "Automated Image Generation (DALL-E 3)",
        "SEO Meta Tags automation",
        "Custom domain support",
        "Premium Glassmorphism themes",
        "Priority email support"
      ],
      cta: "Start 7-Day Trial",
      popular: true
    },
    {
      name: "Enterprise",
      price: "$49",
      description: "For agency owners managing multiple clients and custom domain setups.",
      features: [
        "Everything in Professional",
        "White-label branding options",
        "Custom styling code injection",
        "Dedicated agent parameters tuning",
        "Collaborative multi-user login",
        "99.9% uptime Service Level SLA",
        "Dedicated account support manager"
      ],
      cta: "Contact Sales",
      popular: false
    }
  ]

  return (
    <div className="container" style={{ padding: '3rem 0 6rem 0' }}>
      <header style={{ textAlign: 'center', marginBottom: '5rem' }}>
        <h1 style={{ fontSize: '3.5rem', fontWeight: 800, marginBottom: '1.5rem' }}>
          Flexible Plans for Every <span className="gradient-text">Creator</span>
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.25rem', maxWidth: '650px', margin: '0 auto' }}>
          Choose the plan that fits your growth. Scale up your websites, hosting, and creation credits as your business expands.
        </p>
      </header>

      <div className="grid-cols-3" style={{ alignItems: 'stretch' }}>
        {plans.map((plan, idx) => (
          <div 
            key={idx}
            className="glass-panel"
            style={{
              padding: '3rem 2rem',
              borderRadius: '20px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              background: plan.popular 
                ? 'linear-gradient(135deg, rgba(13, 20, 38, 0.7) 0%, rgba(99, 102, 241, 0.08) 100%)' 
                : 'var(--bg-dark-card)',
              border: plan.popular 
                ? '2px solid var(--primary)' 
                : '1px solid var(--border-light)',
              boxShadow: plan.popular 
                ? '0 10px 25px rgba(99,102,241,0.15)' 
                : 'var(--shadow-glass)',
              position: 'relative'
            }}
          >
            {plan.popular && (
              <span style={{
                position: 'absolute',
                top: '1rem',
                right: '1rem',
                padding: '0.25rem 0.75rem',
                borderRadius: '50px',
                background: 'var(--primary)',
                color: '#fff',
                fontSize: '0.75rem',
                fontWeight: 700,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.25rem'
              }}>
                <Sparkles className="w-3 h-3" /> Popular
              </span>
            )}

            <div>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.5rem' }}>{plan.name}</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '2rem' }}>{plan.description}</p>
              
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.25rem', marginBottom: '2rem' }}>
                <span style={{ fontSize: '3rem', fontWeight: 800 }}>{plan.price}</span>
                <span style={{ color: 'var(--text-muted)' }}>/ month</span>
              </div>

              <ul style={{ display: 'flex', flexDirection: 'column', gap: '1rem', listStyle: 'none', marginBottom: '3rem' }}>
                {plan.features.map((feat, i) => (
                  <li key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.95rem' }}>
                    <Check className="w-5 h-5 text-primary" style={{ color: 'var(--primary)', flexShrink: 0 }} />
                    <span style={{ color: 'var(--text-secondary)' }}>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>

            <button 
              onClick={() => navigate('/signup')} 
              className={`btn ${plan.popular ? 'btn-primary' : 'btn-secondary'}`}
              style={{ width: '100%', padding: '0.85rem' }}
            >
              {plan.cta}
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
