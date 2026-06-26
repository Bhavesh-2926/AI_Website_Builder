import React from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Sparkles, ArrowRight, Zap, Paintbrush, Search, Eye, ShieldCheck, Heart } from 'lucide-react'

export const LandingPage: React.FC = () => {
  const navigate = useNavigate()

  return (
    <div className="container" style={{ paddingBottom: '5rem' }}>
      {/* Hero Section */}
      <section style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        padding: '6rem 1rem 4rem 1rem',
        position: 'relative'
      }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.4rem 1rem',
            borderRadius: '50px',
            background: 'rgba(99, 102, 241, 0.1)',
            border: '1px solid rgba(99, 102, 241, 0.2)',
            color: '#818cf8',
            fontSize: '0.875rem',
            fontWeight: 600,
            marginBottom: '2rem'
          }}
        >
          <Sparkles className="w-4 h-4" />
          <span>Next-Generation Website Generation</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.8 }}
          style={{
            fontSize: '4.25rem',
            fontWeight: 800,
            lineHeight: 1.1,
            maxWidth: '900px',
            marginBottom: '1.5rem',
            letterSpacing: '-0.03em'
          }}
        >
          Create Stunning Websites in Seconds using <span className="gradient-text">Collaborative Agents</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          style={{
            fontSize: '1.25rem',
            color: 'var(--text-secondary)',
            maxWidth: '650px',
            marginBottom: '3rem',
            lineHeight: 1.6
          }}
        >
          Experience our collaborative multi-agent architecture. Define your brand name, select a design system, and let our agents deploy your pages instantly.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}
        >
          <button onClick={() => navigate('/signup')} className="btn btn-primary" style={{ padding: '1rem 2.25rem', fontSize: '1.05rem' }}>
            Generate Your Site Free <ArrowRight className="w-5 h-5" />
          </button>
          <button onClick={() => navigate('/features')} className="btn btn-secondary" style={{ padding: '1rem 2rem', fontSize: '1.05rem' }}>
            Learn How It Works
          </button>
        </motion.div>
      </section>

      {/* Floating UI Mockup */}
      <section style={{ margin: '4rem 0 8rem 0' }}>
        <motion.div
          initial={{ opacity: 0, y: 65 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="glass-panel"
          style={{
            padding: '1.5rem',
            borderRadius: '20px',
            maxWidth: '1000px',
            margin: '0 auto',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 40px rgba(99, 102, 241, 0.15)',
            border: '1px solid rgba(255, 255, 255, 0.08)'
          }}
        >
          <div style={{ display: 'flex', gap: '6px', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-light)', paddingBottom: '0.75rem' }}>
            <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#ef4444' }}></div>
            <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#f59e0b' }}></div>
            <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#10b981' }}></div>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginLeft: '1rem' }}>https://builder.antigravity.ai/editor</span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: '1.5rem', height: '400px', background: 'rgba(10, 14, 26, 0.4)', borderRadius: '12px', overflow: 'hidden' }}>
            {/* mock left panel */}
            <div style={{ borderRight: '1px solid var(--border-light)', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ height: '30px', borderRadius: '6px' }} className="skeleton-line"></div>
              <div style={{ height: '18px', borderRadius: '4px', width: '70%' }} className="skeleton-line"></div>
              <div style={{ height: '18px', borderRadius: '4px', width: '50%' }} className="skeleton-line"></div>
              <div style={{ height: '100px', borderRadius: '8px', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-light)' }}></div>
              <div style={{ height: '35px', borderRadius: '6px', background: 'var(--primary)' }}></div>
            </div>
            {/* mock viewport */}
            <div style={{ padding: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
              <h2 className="gradient-text" style={{ fontSize: '2.5rem', fontWeight: 800 }}>Custom Bakery Shop</h2>
              <p style={{ color: 'var(--text-secondary)', maxWidth: '400px', margin: '1rem 0' }}>Freshly baked sourdough breads and croissants made with organic ingredients daily.</p>
              <button className="btn btn-primary" style={{ padding: '0.6rem 1.5rem', borderRadius: '50px' }} disabled>Order Now</button>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Features Showcase */}
      <section style={{ marginBottom: '8rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <h2 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '1rem' }}>Powerful Agent Swarm</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>Three specialized Agents work in sync to construct your website.</p>
        </div>

        <div className="grid-cols-3">
          <div className="glass-panel glass-panel-hover" style={{ padding: '2.5rem 2rem' }}>
            <div style={{ color: 'var(--primary)', marginBottom: '1.5rem', display: 'inline-flex', padding: '0.75rem', borderRadius: '12px', background: 'rgba(99, 102, 241, 0.1)' }}>
              <Zap className="w-8 h-8" />
            </div>
            <h3 style={{ fontSize: '1.35rem', fontWeight: 700, marginBottom: '1rem' }}>1. Requirement Agent</h3>
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6 }}>Parses business name, categories, target audience preferences, and translates them into an active website structural mapping blueprint.</p>
          </div>

          <div className="glass-panel glass-panel-hover" style={{ padding: '2.5rem 2rem' }}>
            <div style={{ color: 'var(--secondary)', marginBottom: '1.5rem', display: 'inline-flex', padding: '0.75rem', borderRadius: '12px', background: 'rgba(6, 182, 212, 0.1)' }}>
              <Paintbrush className="w-8 h-8" />
            </div>
            <h3 style={{ fontSize: '1.35rem', fontWeight: 700, marginBottom: '1rem' }}>2. Design System Agent</h3>
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6 }}>Picks custom palettes, fonts, borders, shadows, navigation styles, and Framer Motion animation timings to match the requested theme context.</p>
          </div>

          <div className="glass-panel glass-panel-hover" style={{ padding: '2.5rem 2rem' }}>
            <div style={{ color: 'var(--accent)', marginBottom: '1.5rem', display: 'inline-flex', padding: '0.75rem', borderRadius: '12px', background: 'rgba(236, 72, 153, 0.1)' }}>
              <Sparkles className="w-8 h-8" />
            </div>
            <h3 style={{ fontSize: '1.35rem', fontWeight: 700, marginBottom: '1rem' }}>3. Copywriting Agent</h3>
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6 }}>Writes professional, SEO-friendly marketing copy, feature columns, reviews, menus, contact structures, and headings tailored to your industry.</p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="glass-panel" style={{
        padding: '4rem 2rem',
        display: 'flex',
        justifyContent: 'space-around',
        flexWrap: 'wrap',
        gap: '2rem',
        textAlign: 'center',
        marginBottom: '8rem',
        background: 'rgba(255,255,255,0.02)',
        border: '1px solid var(--border-light)'
      }}>
        <div>
          <h2 style={{ fontSize: '3rem', fontWeight: 800, color: 'var(--primary)' }}>50,000+</h2>
          <p style={{ color: 'var(--text-secondary)', fontWeight: 600 }}>Websites Generated</p>
        </div>
        <div>
          <h2 style={{ fontSize: '3rem', fontWeight: 800, color: 'var(--secondary)' }}>10 Seconds</h2>
          <p style={{ color: 'var(--text-secondary)', fontWeight: 600 }}>Average Build Time</p>
        </div>
        <div>
          <h2 style={{ fontSize: '3rem', fontWeight: 800, color: 'var(--accent)' }}>99.99%</h2>
          <p style={{ color: 'var(--text-secondary)', fontWeight: 600 }}>Server Hosting Uptime</p>
        </div>
      </section>

      {/* CTA Section */}
      <section className="glass-panel" style={{
        padding: '5rem 3rem',
        borderRadius: '24px',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
        border: '1px solid var(--border-glow)'
      }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'radial-gradient(circle at center, rgba(99,102,241,0.06) 0%, transparent 60%)', zIndex: -1 }}></div>
        <h2 style={{ fontSize: '2.75rem', fontWeight: 800, marginBottom: '1rem' }}>Ready to Launch Your Website?</h2>
        <p style={{ color: 'var(--text-secondary)', maxWidth: '550px', margin: '0 auto 2.5rem auto', fontSize: '1.1rem' }}>
          Skip the developer fees, wireframes, and design arguments. Deploy a gorgeous glassmorphic business site in less than a minute.
        </p>
        <button onClick={() => navigate('/signup')} className="btn btn-primary" style={{ padding: '1rem 2.5rem', fontSize: '1.1rem' }}>
          Create My Website Now <Sparkles className="w-5 h-5" />
        </button>
      </section>
    </div>
  )
}
