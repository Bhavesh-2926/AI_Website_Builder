import React from 'react'
import { Sparkles, Brain, Cpu, Server } from 'lucide-react'

export const AboutPage: React.FC = () => {
  return (
    <div className="container" style={{ padding: '3rem 0 6rem 0', maxWidth: '850px' }}>
      <header style={{ textAlign: 'center', marginBottom: '5rem' }}>
        <h1 style={{ fontSize: '3.5rem', fontWeight: 800, marginBottom: '1.5rem' }}>
          Our <span className="gradient-text">Story & Vision</span>
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.25rem', lineHeight: 1.6 }}>
          Building websites historically meant wrestling with templates, hiring expensive developers, or writing code from scratch. We are here to change that.
        </p>
      </header>

      {/* Narrative Section */}
      <section className="glass-panel" style={{ padding: '3rem 2.5rem', marginBottom: '4rem' }}>
        <h2 style={{ fontSize: '1.75rem', marginBottom: '1.25rem', color: 'var(--primary)' }}>Autonomous Website Creation</h2>
        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8, marginBottom: '1.5rem', fontSize: '1.05rem' }}>
          At Antigravity SaaS, we believe in the power of multi-agent orchestration. Instead of a single model guessing what you need, we use three distinct AI agents working collaboratively: a Business Requirement Agent, a UI/UX Design System Agent, and a Conversion Copywriting Agent.
        </p>
        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8, fontSize: '1.05rem' }}>
          By dividing requirements analysis, branding assets curation, and marketing copy generation, our agents build customized websites in seconds. You get clean layouts, high-ranking SEO properties, and automated image generation from one interface.
        </p>
      </section>

      {/* Columns details */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'flex-start' }}>
          <div style={{
            background: 'rgba(99, 102, 241, 0.1)',
            color: 'var(--primary)',
            padding: '0.75rem',
            borderRadius: '10px'
          }}>
            <Brain className="w-6 h-6" />
          </div>
          <div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.5rem' }}>Cognitive Layout Mapping</h3>
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6 }}>Our requirement parser converts business context into structured JSON templates, preventing visual formatting errors common in standard models.</p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'flex-start' }}>
          <div style={{
            background: 'rgba(6, 182, 212, 0.1)',
            color: 'var(--secondary)',
            padding: '0.75rem',
            borderRadius: '10px'
          }}>
            <Cpu className="w-6 h-6" />
          </div>
          <div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.5rem' }}>DALL-E 3 Image Generation</h3>
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6 }}>Generate professional logos and photos directly inside the dashboard, automatically uploading them into Supabase Storage.</p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'flex-start' }}>
          <div style={{
            background: 'rgba(236, 72, 153, 0.1)',
            color: 'var(--accent)',
            padding: '0.75rem',
            borderRadius: '10px'
          }}>
            <Server className="w-6 h-6" />
          </div>
          <div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.5rem' }}>Deploy Instantly</h3>
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6 }}>Host your generated websites globally. A single toggle switches your site status, generating unique slugs that render immediately for visitors.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
