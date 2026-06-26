import React from 'react'
import { useStore } from '../store/useStore'
import { ShieldCheck, Users, Globe, Cpu, Server, Activity } from 'lucide-react'

export const AdminPanel: React.FC = () => {
  const { websites } = useStore()
  
  const systemStats = [
    { name: "Global Active Users", count: "128 Users", icon: Users, color: "var(--primary)" },
    { name: "Generated Websites", count: `${Math.max(websites.length + 32, 32)} Sites`, icon: Globe, color: "var(--secondary)" },
    { name: "Agent Worker CPUs", count: "1.4% Load", icon: Cpu, color: "#10b981" },
    { name: "Database Rows", count: "482 Records", icon: Server, color: "var(--accent)" }
  ]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
      
      {/* Page Title */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <div style={{ padding: '0.5rem', borderRadius: '50%', background: 'rgba(99,102,241,0.1)', color: 'var(--primary)' }}>
          <ShieldCheck className="w-8 h-8" />
        </div>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 800 }}>Admin Panel cockpit</h1>
          <p style={{ color: 'var(--text-secondary)' }}>System statistics monitor, user logs audits, and website configurations overrides.</p>
        </div>
      </div>

      {/* Stats Widgets */}
      <div className="grid-cols-4">
        {systemStats.map((stat, idx) => {
          const Icon = stat.icon
          return (
            <div key={idx} className="glass-panel" style={{ padding: '1.75rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ padding: '0.65rem', borderRadius: '10px', background: 'rgba(255,255,255,0.03)', color: stat.color }}>
                <Icon className="w-6 h-6" />
              </div>
              <div>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>{stat.name}</p>
                <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '0.15rem' }}>{stat.count}</h3>
              </div>
            </div>
          )
        })}
      </div>

      {/* Logs and site monitor lists */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2.5rem' }} className="admin-grid-mobile">
        
        {/* User registers audit logs */}
        <div className="glass-panel" style={{ padding: '2rem' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Activity className="w-5 h-5 text-primary" style={{ color: 'var(--primary)' }} /> Registered Accounts
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem', borderBottom: '1px solid var(--border-light)' }}>
              <div>
                <p style={{ fontWeight: 600 }}>Sarah Chen</p>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>sarah@chenmedia.io</span>
              </div>
              <span style={{ fontSize: '0.8rem', color: '#10b981', fontWeight: 700 }}>Pro Level</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem', borderBottom: '1px solid var(--border-light)' }}>
              <div>
                <p style={{ fontWeight: 600 }}>Jean Dupont</p>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>j.dupont@bakery-paris.fr</span>
              </div>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Starter</span>
            </div>
          </div>
        </div>

        {/* Global Generated Websites */}
        <div className="glass-panel" style={{ padding: '2rem' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Globe className="w-5 h-5 text-secondary" style={{ color: 'var(--secondary)' }} /> Deployed Swarm Websites
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem', borderBottom: '1px solid var(--border-light)' }}>
              <div>
                <p style={{ fontWeight: 600 }}>Parisian Croissant</p>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Type: Bakery | Theme: Glassmorphism</span>
              </div>
              <span style={{ fontSize: '0.8rem', color: '#10b981', fontWeight: 700 }}>PUBLISHED</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem', borderBottom: '1px solid var(--border-light)' }}>
              <div>
                <p style={{ fontWeight: 600 }}>FitFlow Yoga Studio</p>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Type: Gym | Theme: Minimalist</span>
              </div>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>DRAFT</span>
            </div>
          </div>
        </div>

      </div>
      <style>{`
        @media (max-width: 768px) {
          .admin-grid-mobile { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  )
}
