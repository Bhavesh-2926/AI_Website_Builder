import { create } from 'zustand'

export interface UserProfile {
  id: string
  email: string
  full_name?: string
}

export interface Website {
  id: string
  user_id: string
  business_name: string
  business_type: string
  theme: string
  status: 'draft' | 'published'
  published_url: string | null
  created_at: string
}

export interface WebsiteDesign {
  font: string
  primary: string
  secondary: string
  accent: string
  background: string
  surface: string
  text_color: string
  border_radius: string
  styles: {
    navbar?: string
    hero?: string
    card?: string
    footer?: string
    animation?: string
    blur_strength?: string
    glow_intensity?: string
    hover_animation?: string
  }
}

export interface SEOData {
  id?: string
  website_id: string
  title: string
  description: string
  keywords: string
  og_image: string
}

export interface WebsiteSettings {
  analytics_id?: string
  custom_domain?: string
  enable_contact_form?: boolean
}

export interface ActiveWebsitePayload {
  website: Website
  content: Record<string, any> // map of page_name -> page content json
  design: WebsiteDesign | null
  seo: SEOData | null
  settings: WebsiteSettings | null
}

interface AppState {
  // Auth state
  user: UserProfile | null
  token: string | null
  setAuth: (user: UserProfile | null, token: string | null) => void
  logout: () => void

  // Websites state
  websites: Website[]
  setWebsites: (websites: Website[]) => void
  addWebsite: (website: Website) => void
  removeWebsite: (websiteId: string) => void
  activeWebsite: ActiveWebsitePayload | null
  setActiveWebsite: (payload: ActiveWebsitePayload | null) => void
  updateActiveWebsiteContent: (pageName: string, contentJson: any) => void
  updateActiveWebsiteDesign: (design: Partial<WebsiteDesign>) => void
  updateActiveWebsiteSEO: (seo: Partial<SEOData>) => void
  updateActiveWebsiteSettings: (settings: Partial<WebsiteSettings>) => void
  loadingWebsites: boolean
  setLoadingWebsites: (loading: boolean) => void

  // Editor configuration
  activePage: string
  setActivePage: (page: string) => void
  previewMode: boolean
  setPreviewMode: (preview: boolean) => void
  deviceView: 'desktop' | 'mobile'
  setDeviceView: (view: 'desktop' | 'mobile') => void
  selectedElement: string | null
  setSelectedElement: (elementId: string | null) => void

  // Styling theme
  theme: 'dark' | 'light'
  toggleTheme: () => void
}

export const useStore = create<AppState>((set) => ({
  // Auth Store
  user: null,
  token: null,
  setAuth: (user, token) => set({ user, token }),
  logout: () => set({ user: null, token: null, websites: [], activeWebsite: null }),

  // Websites Store
  websites: [],
  setWebsites: (websites) => set({ websites }),
  addWebsite: (website) => set((state) => ({ websites: [website, ...state.websites] })),
  removeWebsite: (websiteId) => set((state) => ({ 
    websites: state.websites.filter((w) => w.id !== websiteId),
    activeWebsite: state.activeWebsite?.website.id === websiteId ? null : state.activeWebsite
  })),
  activeWebsite: null,
  setActiveWebsite: (payload) => set({ 
    activeWebsite: payload,
    activePage: payload?.content ? Object.keys(payload.content)[0] || 'Home' : 'Home'
  }),
  updateActiveWebsiteContent: (pageName, contentJson) => set((state) => {
    if (!state.activeWebsite) return {};
    return {
      activeWebsite: {
        ...state.activeWebsite,
        content: {
          ...state.activeWebsite.content,
          [pageName]: contentJson
        }
      }
    }
  }),
  updateActiveWebsiteDesign: (newDesign) => set((state) => {
    if (!state.activeWebsite) return {};
    const currentDesign = state.activeWebsite.design || {
      font: 'Inter',
      primary: '#6366f1',
      secondary: '#06b6d4',
      accent: '#ec4899',
      background: '#0a0e1a',
      surface: 'rgba(13, 20, 38, 0.6)',
      text_color: '#f8fafc',
      border_radius: '16px',
      styles: { navbar: 'floating-glass', hero: 'centered-gradient', card: 'glassmorphic-glow', footer: 'dark-compact', animation: 'fade-in-up' }
    };
    return {
      activeWebsite: {
        ...state.activeWebsite,
        design: {
          ...currentDesign,
          ...newDesign,
          styles: {
            ...currentDesign.styles,
            ...(newDesign.styles || {})
          }
        }
      }
    }
  }),
  updateActiveWebsiteSEO: (newSEO) => set((state) => {
    if (!state.activeWebsite) return {};
    const currentSEO = state.activeWebsite.seo || {
      website_id: state.activeWebsite.website.id,
      title: state.activeWebsite.website.business_name,
      description: '',
      keywords: '',
      og_image: ''
    };
    return {
      activeWebsite: {
        ...state.activeWebsite,
        seo: {
          ...currentSEO,
          ...newSEO
        }
      }
    }
  }),
  updateActiveWebsiteSettings: (newSettings) => set((state) => {
    if (!state.activeWebsite) return {};
    const currentSettings = state.activeWebsite.settings || {
      analytics_id: '',
      custom_domain: '',
      enable_contact_form: true
    };
    return {
      activeWebsite: {
        ...state.activeWebsite,
        settings: {
          ...currentSettings,
          ...newSettings
        }
      }
    }
  }),
  loadingWebsites: false,
  setLoadingWebsites: (loadingWebsites) => set({ loadingWebsites }),

  // Editor Store
  activePage: 'Home',
  setActivePage: (activePage) => set({ activePage }),
  previewMode: false,
  setPreviewMode: (previewMode) => set({ previewMode }),
  deviceView: 'desktop',
  setDeviceView: (deviceView) => set({ deviceView }),
  selectedElement: null,
  setSelectedElement: (selectedElement) => set({ selectedElement }),

  // Theme Store
  theme: 'dark',
  toggleTheme: () => set((state) => {
    const nextTheme = state.theme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', nextTheme);
    return { theme: nextTheme };
  })
}));
