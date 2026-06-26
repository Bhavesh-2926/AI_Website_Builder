import React from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useStore } from '../store/useStore'
import api from '../services/api'
import {
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Briefcase,
  Layers,
  CheckCircle,
  Palette,
  Layout,
  Terminal,
  Activity
} from 'lucide-react'

export const CreateWebsiteWizard: React.FC = () => {
  const navigate = useNavigate()
  const { setActiveWebsite, addWebsite } = useStore()
  
  const [step, setStep] = React.useState(1)
  
  // Wizard state variables
  const [businessName, setBusinessName] = React.useState('')
  const [businessCategory, setBusinessCategory] = React.useState('Bakery')
  const [theme, setTheme] = React.useState('Glassmorphism')
  const [pages, setPages] = React.useState<string[]>(['Home', 'About', 'Services', 'Contact'])
  const [primaryColor, setPrimaryColor] = React.useState('#6366f1')
  const [secondaryColor, setSecondaryColor] = React.useState('#06b6d4')
  const [accentColor, setAccentColor] = React.useState('#ec4899')
  
  // Loading generation logging state
  const [generating, setGenerating] = React.useState(false)
  const [logs, setLogs] = React.useState<string[]>([])

  const categories = ['Bakery', 'Cafe', 'Restaurant', 'Portfolio', 'Gym', 'Agency', 'Ecommerce']
  const themes = ['Glassmorphism', 'Modern', 'Luxury', 'Minimal', 'Dark', 'Corporate']
  const availablePages = ['Home', 'About', 'Services', 'Gallery', 'Menu', 'Testimonials', 'Blog', 'Contact']

  const handlePageToggle = (pName: string) => {
    if (pName === 'Home') return // Home is mandatory
    setPages((prev) => 
      prev.includes(pName) ? prev.filter((p) => p !== pName) : [...prev, pName]
    )
  }

  // Pre-configured theme color sets
  React.useEffect(() => {
    const colorSets: Record<string, string[]> = {
      'Glassmorphism': ['#818cf8', '#38bdf8', '#f43f5e'],
      'Modern': ['#10b981', '#6366f1', '#ec4899'],
      'Luxury': ['#d4af37', '#1c1c1c', '#800020'],
      'Minimal': ['#000000', '#737373', '#a3a3a3'],
      'Dark': ['#3b82f6', '#10b981', '#8b5cf6'],
      'Corporate': ['#1e3a8a', '#4b5563', '#0d9488']
    }
    const set = colorSets[theme] || ['#6366f1', '#06b6d4', '#ec4899']
    setPrimaryColor(set[0])
    setSecondaryColor(set[1])
    setAccentColor(set[2])
  }, [theme])

  const triggerGeneration = async () => {
    setGenerating(true)
    setLogs([])

    const addLog = (msg: string, delay: number) => {
      return new Promise<void>((resolve) => {
        setTimeout(() => {
          setLogs((prev) => [...prev, msg])
          resolve()
        }, delay)
      })
    }

    // Interactive logs mock progress
    await addLog("🚀 Spawning Requirement Agent...", 200)
    await addLog("✓ Requirement Agent: Processing Business Details & Pages manifest", 600)
    await addLog("🧠 Spawning Copywriting Agent...", 500)
    await addLog("✓ Copywriting Agent: Querying OpenAI Chat Models (GPT-4o-mini)", 400)
    await addLog("✍ Copywriting Agent: Compiling headlines, FAQs, menus, and marketing copy", 900)
    await addLog("🎨 Spawning Design System Agent...", 500)
    await addLog("✓ Design Agent: Structuring border radius variables and style frameworks", 600)
    await addLog("💿 Writing records to database tables...", 500)

    try {
      const payload = {
        business_name: businessName || 'My Business',
        business_category: businessCategory,
        theme: theme,
        pages: pages,
        color_preference: {
          primary: primaryColor,
          secondary: secondaryColor,
          accent: accentColor
        }
      }

      const res = await api.post('/ai/generate-website', payload)
      
      await addLog("✓ Website Generated Successfully!", 300)
      
      // Save in store
      addWebsite(res.data.website)
      setActiveWebsite(res.data)
      
      setTimeout(() => {
        navigate(`/dashboard/editor/${res.data.website_id}`)
      }, 800)

    } catch (err) {
      console.error(err)
      await addLog("❌ Error: API Generation pipeline failed. Bypassing with mock details.", 300)
      
      // Mock Bypass setup if server returns error or offline
      const mockId = 'mock-' + Math.random().toString(36).substr(2, 9)
      const websiteItem = {
        id: mockId,
        user_id: '00000000-0000-0000-0000-000000000000',
        business_name: businessName || 'My Local Business',
        business_type: businessCategory,
        theme: theme,
        status: 'draft' as const,
        published_url: null,
        created_at: new Date().toISOString()
      }
      
      const contentMap: Record<string, any> = {}
      pages.forEach(p => {
        contentMap[p] = {
          hero: { title: `Welcome to ${websiteItem.business_name}`, subtitle: `Expert ${websiteItem.business_type} services.`, cta_text: 'Get Started' },
          intro: `We stand for quality and reliability. Let us help you succeed.`,
          features: [
            { icon: 'Award', title: 'Top Rated', description: 'Recognized for excellent service.' },
            { icon: 'Heart', title: 'Family Owned', description: 'Caring for our customers personally.' }
          ]
        }
      })

      const designItem = {
        font: theme === 'Luxury' ? 'Playfair Display' : 'Outfit',
        primary: primaryColor,
        secondary: secondaryColor,
        accent: accentColor,
        background: theme === 'Dark' ? '#030712' : '#ffffff',
        surface: 'rgba(255, 255, 255, 0.05)',
        text_color: theme === 'Dark' ? '#f9fafb' : '#0a0a0a',
        border_radius: '12px',
        styles: { navbar: 'floating-glass', hero: 'centered-gradient', card: 'glassmorphic-glow', footer: 'dark-compact', animation: 'fade-in-up' }
      }

      addWebsite(websiteItem)
      setActiveWebsite({
        website: websiteItem,
        content: contentMap,
        design: designItem,
        seo: null,
        settings: null
      })

      setTimeout(() => {
        navigate(`/dashboard/editor/${mockId}`)
      }, 1000)
    }
  }

  const nextStep = () => {
    if (step === 1 && !businessName.trim()) {
      alert("Please enter your Business Name to proceed.")
      return
    }
    if (step < 6) setStep(step + 1)
    else triggerGeneration()
  }

  const prevStep = () => {
    if (step > 1) setStep(step - 1)
  }

  // Animation variants
  const slideVariants = {
    initial: { opacity: 0, x: 50 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -50 }
  }

  if (generating) {
    return (
      <div style={{ maxWidth: '600px', margin: '4rem auto' }}>
        <div className="glass-panel" style={{ padding: '3rem', border: '1px solid var(--border-glow)' }}>
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <Sparkles className="w-12 h-12 text-primary spinner" style={{ color: 'var(--primary)', display: 'inline-block', marginBottom: '1rem' }} />
            <h2 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Generating Website...</h2>
            <p style={{ color: 'var(--text-secondary)' }}>Our agents are constructing your digital workspace layout.</p>
          </div>

          {/* Console Logger box */}
          <div style={{
            background: '#040711',
            borderRadius: '12px',
            border: '1px solid var(--border-light)',
            padding: '1.5rem',
            fontFamily: 'monospace',
            fontSize: '0.85rem',
            color: '#34d399',
            minHeight: '220px',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.5rem',
            overflowY: 'auto'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '0.5rem', color: '#94a3b8', marginBottom: '0.5rem' }}>
              <Terminal className="w-4 h-4" /> <span>Agent Terminal Output</span>
            </div>
            {logs.map((log, index) => (
              <div key={index}>{log}</div>
            ))}
            <div style={{ display: 'flex', gap: '0.25rem', alignItems: 'center', color: '#94a3b8' }}>
              <span className="spinner" style={{ width: '12px', height: '12px', borderWidth: '2px' }}></span>
              <span>Waiting for final compiler response...</span>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div style={{ maxWidth: '650px', margin: '2rem auto' }}>
      
      {/* Wizard Progress Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--primary)' }}>Step {step} of 6</span>
        <div style={{ flex: 1, height: '4px', background: 'var(--border-light)', margin: '0 1rem', borderRadius: '50px', position: 'relative' }}>
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: `${(step / 6) * 100}%`,
            height: '100%',
            background: 'linear-gradient(90deg, var(--primary) 0%, var(--secondary) 100%)',
            borderRadius: '50px',
            transition: 'width 0.3s ease'
          }}></div>
        </div>
        <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{Math.round((step / 6) * 100)}% Complete</span>
      </div>

      <div className="glass-panel" style={{ padding: '3.5rem 3rem', border: '1px solid var(--border-light)' }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            variants={slideVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.3 }}
          >
            {/* STEP 1: Business Name */}
            {step === 1 && (
              <div>
                <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '0.75rem' }}>Let's Name Your Website</h2>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '2.5rem' }}>Enter the official trading name of your business or brand.</p>
                <div className="form-group">
                  <label className="form-label">Business Name</label>
                  <input
                    type="text"
                    required
                    className="input-field"
                    placeholder="e.g. Sourdough Bakery, FitFlow Gym"
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    style={{ padding: '1rem', fontSize: '1.05rem' }}
                  />
                </div>
              </div>
            )}

            {/* STEP 2: Business Category */}
            {step === 2 && (
              <div>
                <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '0.75rem' }}>Select Category</h2>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>This helps our AI select the correct template layouts, services, and menus.</p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: '1rem' }}>
                  {categories.map((cat) => {
                    const selected = businessCategory === cat
                    return (
                      <button
                        key={cat}
                        onClick={() => setBusinessCategory(cat)}
                        style={{
                          padding: '1.25rem 0.5rem',
                          borderRadius: '12px',
                          border: selected ? '2px solid var(--primary)' : '1px solid var(--border-light)',
                          background: selected ? 'rgba(99,102,241,0.08)' : 'rgba(255,255,255,0.02)',
                          color: selected ? 'var(--text-primary)' : 'var(--text-secondary)',
                          cursor: 'pointer',
                          fontWeight: 600,
                          textAlign: 'center',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          gap: '0.5rem',
                          transition: 'all 0.2s ease'
                        }}
                      >
                        <Briefcase className="w-5 h-5 text-primary" style={{ color: selected ? 'var(--primary)' : 'inherit' }} />
                        <span style={{ fontSize: '0.9rem' }}>{cat}</span>
                      </button>
                    )
                  })}
                </div>
              </div>
            )}

            {/* STEP 3: Theme Selection */}
            {step === 3 && (
              <div>
                <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '0.75rem' }}>Select Theme Aesthetic</h2>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>Define the core CSS design tokens and layout styling theme.</p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: '1rem' }}>
                  {themes.map((th) => {
                    const selected = theme === th
                    return (
                      <button
                        key={th}
                        onClick={() => setTheme(th)}
                        style={{
                          padding: '1.25rem 0.5rem',
                          borderRadius: '12px',
                          border: selected ? '2px solid var(--primary)' : '1px solid var(--border-light)',
                          background: selected ? 'rgba(99,102,241,0.08)' : 'rgba(255,255,255,0.02)',
                          color: selected ? 'var(--text-primary)' : 'var(--text-secondary)',
                          cursor: 'pointer',
                          fontWeight: 600,
                          textAlign: 'center',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          gap: '0.5rem',
                          transition: 'all 0.2s ease'
                        }}
                      >
                        <Layers className="w-5 h-5 text-primary" style={{ color: selected ? 'var(--primary)' : 'inherit' }} />
                        <span style={{ fontSize: '0.9rem' }}>{th}</span>
                      </button>
                    )
                  })}
                </div>
              </div>
            )}

            {/* STEP 4: Required Pages */}
            {step === 4 && (
              <div>
                <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '0.75rem' }}>Required Pages</h2>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>Check off the navigation pages you want our agents to compile copy for.</p>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  {availablePages.map((pg) => {
                    const checked = pages.includes(pg)
                    const isHome = pg === 'Home'
                    return (
                      <button
                        key={pg}
                        onClick={() => handlePageToggle(pg)}
                        disabled={isHome}
                        style={{
                          padding: '1rem 1.5rem',
                          borderRadius: '10px',
                          border: checked ? '1px solid var(--primary)' : '1px solid var(--border-light)',
                          background: checked ? 'rgba(99,102,241,0.06)' : 'rgba(255,255,255,0.01)',
                          color: checked ? 'var(--text-primary)' : 'var(--text-muted)',
                          cursor: isHome ? 'not-allowed' : 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          fontWeight: 600
                        }}
                      >
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <Layout className="w-4 h-4 text-primary" /> {pg}
                        </span>
                        <CheckCircle className={`w-5 h-5 ${checked ? 'text-primary' : 'text-muted'}`} style={{ color: checked ? 'var(--primary)' : 'var(--text-muted)', opacity: checked ? 1 : 0.2 }} />
                      </button>
                    )
                  })}
                </div>
              </div>
            )}

            {/* STEP 5: Color Preference */}
            {step === 5 && (
              <div>
                <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '0.75rem' }}>Color Palette Customizer</h2>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '2.5rem' }}>Adjust primary, secondary, and accent colors, loaded automatically from the {theme} theme preset.</p>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <Palette className="w-5 h-5 text-primary" style={{ color: primaryColor }} />
                      <div>
                        <p style={{ fontWeight: 600, fontSize: '0.95rem' }}>Primary Theme Color</p>
                        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Main links, button backgrounds</p>
                      </div>
                    </div>
                    <input type="color" className="color-picker-input" value={primaryColor} onChange={(e) => setPrimaryColor(e.target.value)} style={{ width: '45px', height: '40px', border: 'none', background: 'none', cursor: 'pointer' }} />
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <Palette className="w-5 h-5 text-secondary" style={{ color: secondaryColor }} />
                      <div>
                        <p style={{ fontWeight: 600, fontSize: '0.95rem' }}>Secondary Support Color</p>
                        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Gradients mix, sub-nav bars</p>
                      </div>
                    </div>
                    <input type="color" className="color-picker-input" value={secondaryColor} onChange={(e) => setSecondaryColor(e.target.value)} style={{ width: '45px', height: '40px', border: 'none', background: 'none', cursor: 'pointer' }} />
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <Palette className="w-5 h-5 text-accent" style={{ color: accentColor }} />
                      <div>
                        <p style={{ fontWeight: 600, fontSize: '0.95rem' }}>Accent Highlighting Color</p>
                        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Item price tags, rating stars</p>
                      </div>
                    </div>
                    <input type="color" className="color-picker-input" value={accentColor} onChange={(e) => setAccentColor(e.target.value)} style={{ width: '45px', height: '40px', border: 'none', background: 'none', cursor: 'pointer' }} />
                  </div>
                </div>
              </div>
            )}

            {/* STEP 6: Generate Website */}
            {step === 6 && (
              <div style={{ textAlign: 'center' }}>
                <Sparkles className="w-14 h-14 text-primary" style={{ color: 'var(--primary)', marginBottom: '1.5rem', display: 'inline-block' }} />
                <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '0.75rem' }}>Ready to Generate?</h2>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '2.5rem', maxWidth: '450px', margin: '0 auto 2.5rem auto' }}>
                  Our three agents are standing by. Click generate to orchestrate the backend and build your customized brand site details.
                </p>
                <div className="glass-panel" style={{ padding: '1.5rem', textAlign: 'left', background: 'rgba(255,255,255,0.01)', border: '1px solid var(--border-light)', marginBottom: '2rem' }}>
                  <p style={{ fontSize: '0.95rem', marginBottom: '0.5rem' }}><strong>Site Name:</strong> {businessName}</p>
                  <p style={{ fontSize: '0.95rem', marginBottom: '0.5rem' }}><strong>Category:</strong> {businessCategory}</p>
                  <p style={{ fontSize: '0.95rem', marginBottom: '0.5rem' }}><strong>Theme Style:</strong> {theme}</p>
                  <p style={{ fontSize: '0.95rem' }}><strong>Page Count:</strong> {pages.length} Pages</p>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Wizard Controls */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '3.5rem', borderTop: '1px solid var(--border-light)', paddingTop: '1.75rem' }}>
          {step > 1 ? (
            <button onClick={prevStep} className="btn btn-secondary">
              <ArrowLeft className="w-4 h-4" /> Back
            </button>
          ) : (
            <div style={{ width: '100px' }}></div>
          )}

          <button onClick={nextStep} className="btn btn-primary">
            {step === 6 ? <>Spawn Agent Pipeline <Sparkles className="w-4 h-4" /></> : <>Continue <ArrowRight className="w-4 h-4" /></>}
          </button>
        </div>

      </div>
    </div>
  )
}
