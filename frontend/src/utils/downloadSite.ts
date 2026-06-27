import { ActiveWebsitePayload } from '../store/useStore'

// Helper to escape HTML tags to prevent XSS in download
const escapeHtml = (text: any): string => {
  if (typeof text !== 'string') return String(text || '')
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}

export const downloadSite = (payload: ActiveWebsitePayload) => {
  const { website, content, design, seo } = payload
  const fontName = design?.font || 'Outfit'
  const primary = design?.primary || '#6366f1'
  const secondary = design?.secondary || '#06b6d4'
  const accent = design?.accent || '#ec4899'
  const background = design?.background || '#0a0e1a'
  const surface = design?.surface || 'rgba(13, 20, 38, 0.6)'
  const textColor = design?.text_color || '#f8fafc'
  const borderRadius = design?.border_radius || '16px'
  const textMuted = design?.text_color ? `${design.text_color}cc` : '#94a3b8'

  const navbarStyle = design?.styles?.navbar || 'classic-clean'
  const isNavbarGlass = navbarStyle === 'floating-glass'
  const isNavbarBlur = navbarStyle === 'sticky-blur'
  
  const pagesList = Object.keys(content)
  const websiteTitle = seo?.title || website.business_name
  const websiteDesc = seo?.description || `Welcome to ${website.business_name} - ${website.business_type} website.`
  const keywords = seo?.keywords || ''

  // Generate static CSS variables and styling overrides
  const styleHeader = `
    :root {
      --primary-color: ${primary};
      --secondary-color: ${secondary};
      --accent-color: ${accent};
      --background-color: ${background};
      --surface-color: ${surface};
      --text-color: ${textColor};
      --text-muted: ${textMuted};
      --border-radius: ${borderRadius};
      --font-family: '${fontName}', system-ui, -apple-system, sans-serif;
    }

    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    body {
      font-family: var(--font-family);
      background-color: var(--background-color);
      color: var(--text-color);
      min-height: 100vh;
      line-height: 1.6;
      overflow-x: hidden;
      position: relative;
    }

    .background-glows {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      overflow: hidden;
      pointer-events: none;
      z-index: -1;
    }

    .glow-1 {
      position: absolute;
      top: -10%;
      left: -10%;
      width: 50vw;
      height: 50vw;
      border-radius: 50%;
      background: radial-gradient(circle, rgba(99, 102, 241, 0.12) 0%, transparent 70%);
      filter: blur(80px);
    }

    .glow-2 {
      position: absolute;
      bottom: -10%;
      right: -10%;
      width: 50vw;
      height: 50vw;
      border-radius: 50%;
      background: radial-gradient(circle, rgba(6, 182, 212, 0.1) 0%, transparent 70%);
      filter: blur(80px);
    }

    /* Template Navbar */
    .template-nav {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 1.25rem 2rem;
      position: sticky;
      top: 0;
      z-index: 100;
      transition: all 0.3s ease;
    }

    .template-nav.floating-glass {
      border-radius: var(--border-radius);
      margin: 1rem;
      background: rgba(255, 255, 255, 0.03);
      backdrop-filter: blur(12px);
      -webkit-backdrop-filter: blur(12px);
      border: 1px solid rgba(255, 255, 255, 0.08);
    }

    .template-nav.sticky-blur {
      background: rgba(10, 14, 26, 0.85);
      backdrop-filter: blur(12px);
      -webkit-backdrop-filter: blur(12px);
      border-bottom: 1px solid rgba(255, 255, 255, 0.05);
    }

    .template-nav.classic-clean {
      background: transparent;
      border-bottom: 1px solid rgba(255, 255, 255, 0.05);
    }

    .nav-logo {
      font-weight: 800;
      font-size: 1.4rem;
      color: var(--primary-color);
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .nav-links {
      display: flex;
      gap: 1.5rem;
      list-style: none;
    }

    .nav-btn {
      background: none;
      border: none;
      color: var(--text-color);
      font-weight: 500;
      cursor: pointer;
      font-size: 0.95rem;
      border-bottom: 2px solid transparent;
      padding-bottom: 4px;
      transition: all 0.2s ease;
      font-family: var(--font-family);
    }

    .nav-btn.active {
      color: var(--primary-color);
      border-bottom-color: var(--primary-color);
      font-weight: 700;
    }

    /* Container Layout */
    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 2rem;
    }

    .grid-cols-3 {
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: 2rem;
    }

    .grid-cols-2 {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 3rem;
      align-items: center;
    }

    /* Glass Panels */
    .glass-panel {
      padding: 2.5rem 2rem;
      border-radius: var(--border-radius);
      border: 1px solid rgba(255, 255, 255, 0.06);
      background: var(--surface-color);
      backdrop-filter: blur(16px);
      -webkit-backdrop-filter: blur(16px);
      display: flex;
      flex-direction: column;
      gap: 1rem;
      transition: all 0.3s ease;
    }

    .glass-panel:hover {
      border-color: rgba(99, 102, 241, 0.2);
      transform: translateY(-4px);
    }

    /* Buttons */
    .cta-button {
      background: linear-gradient(135deg, var(--primary-color) 0%, var(--secondary-color) 100%);
      color: #fff;
      border: none;
      padding: 1rem 2rem;
      border-radius: 50px;
      font-size: 1rem;
      font-weight: 700;
      cursor: pointer;
      box-shadow: 0 4px 15px rgba(99, 102, 241, 0.2);
      transition: all 0.2s ease;
      text-decoration: none;
      display: inline-block;
      text-align: center;
    }

    .cta-button:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(99, 102, 241, 0.3);
    }

    /* Form Fields */
    .form-group {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      text-align: left;
    }

    .form-label {
      font-size: 0.875rem;
      font-weight: 600;
      color: var(--text-color);
    }

    .input-field {
      width: 100%;
      padding: 0.75rem 1rem;
      background: rgba(255, 255, 255, 0.03);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 8px;
      color: var(--text-color);
      font-family: var(--font-family);
      outline: none;
      transition: all 0.2s ease;
    }

    .input-field:focus {
      border-color: var(--primary-color);
      background: rgba(255, 255, 255, 0.06);
    }

    .btn-submit {
      background: var(--primary-color);
      color: white;
      font-weight: 600;
      padding: 0.75rem 1.5rem;
      border-radius: 8px;
      border: none;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .btn-submit:hover {
      background: var(--secondary-color);
    }

    /* Responsive Queries */
    @media (max-width: 1024px) {
      .grid-cols-3 {
        grid-template-columns: repeat(2, minmax(0, 1fr));
      }
    }

    @media (max-width: 768px) {
      .grid-cols-2, .grid-cols-3 {
        grid-template-columns: 1fr;
      }
      .template-nav {
        flex-direction: column;
        gap: 1rem;
        text-align: center;
      }
      .nav-links {
        width: 100%;
        justify-content: center;
        flex-wrap: wrap;
      }
    }

    /* Footer styling */
    footer {
      padding: 3rem 2rem;
      border-top: 1px solid rgba(255, 255, 255, 0.05);
      text-align: center;
      margin-top: 4rem;
      color: var(--text-muted);
    }

    .footer-socials {
      display: flex;
      justify-content: center;
      gap: 1.5rem;
      margin-bottom: 1.5rem;
    }

    .social-icon {
      color: var(--text-muted);
      cursor: pointer;
      transition: color 0.2s ease;
    }

    .social-icon:hover {
      color: white;
    }
  `

  // Helper page render functions mapped to Vanilla HTML strings
  const renderPageHTML = (pageName: string, pageData: any): string => {
    switch (pageName) {
      case 'Home': {
        const hero = pageData.hero || { title: 'Welcome', subtitle: 'Subtitle text here', cta_text: 'Get Started' }
        const features = pageData.features || []
        const intro = pageData.intro || ''

        return `
          <div style="padding: 2rem;">
            <!-- Hero Section -->
            <section style="display: flex; flex-direction: column; align-items: center; text-align: center; padding: 6rem 1rem; background: radial-gradient(circle, rgba(99, 102, 241, 0.05) 0%, transparent 80%); border-radius: 24px; margin-bottom: 4rem;">
              <h1 style="font-size: 3.5rem; font-weight: 800; margin-bottom: 1.5rem; line-height: 1.2;">
                ${escapeHtml(hero.title)}
              </h1>
              <p style="font-size: 1.25rem; color: var(--text-muted); max-width: 650px; margin-bottom: 2.5rem;">
                ${escapeHtml(hero.subtitle)}
              </p>
              <button class="cta-button" onclick="navigateTo('Contact')">
                ${escapeHtml(hero.cta_text)}
              </button>
            </section>

            <!-- Intro Section -->
            ${intro ? `
            <section style="max-width: 800px; margin: 0 auto 5rem auto; text-align: center;">
              <h2 style="font-size: 2rem; margin-bottom: 1.5rem;">Our Philosophy</h2>
              <p style="color: var(--text-muted); line-height: 1.8; font-size: 1.1rem;">
                ${escapeHtml(intro)}
              </p>
            </section>
            ` : ''}

            <!-- Features Section -->
            ${features.length > 0 ? `
            <section style="margin-bottom: 4rem;">
              <h2 style="font-size: 2.25rem; text-align: center; margin-bottom: 3rem;">Why Choose Us</h2>
              <div class="grid-cols-3">
                ${features.map((feat: any) => `
                  <div class="glass-panel" style="text-align: center; align-items: center;">
                    <div style="padding: 1rem; border-radius: 50%; background: rgba(99, 102, 241, 0.1); color: var(--primary-color); display: inline-flex;">
                      <i data-lucide="${escapeHtml(feat.icon || 'sparkles')}"></i>
                    </div>
                    <h3 style="font-size: 1.25rem; font-weight: 700;">${escapeHtml(feat.title)}</h3>
                    <p style="color: var(--text-muted); font-size: 0.95rem; line-height: 1.6;">
                      ${escapeHtml(feat.description)}
                    </p>
                  </div>
                `).join('')}
              </div>
            </section>
            ` : ''}
          </div>
        `
      }
      case 'About': {
        const story = pageData.story || { headline: 'Our Story', full_text: 'About details...' }
        const values = pageData.values || []

        return `
          <div style="padding: 3rem 2rem; max-width: 1000px; margin: 0 auto;">
            <section class="grid-cols-2" style="margin-bottom: 5rem;">
              <div>
                <h1 style="font-size: 2.75rem; margin-bottom: 2rem;">${escapeHtml(story.headline)}</h1>
                <p style="color: var(--text-muted); line-height: 1.8; font-size: 1.05rem;">
                  ${escapeHtml(story.full_text)}
                </p>
              </div>
              ${story.image_url ? `
                <div style="border-radius: 16px; overflow: hidden; border: 1px solid rgba(255,255,255,0.1);">
                  <img src="${escapeHtml(story.image_url)}" alt="Story image" style="width: 100%; height: auto; display: block;" />
                </div>
              ` : ''}
            </section>

            ${values.length > 0 ? `
              <section>
                <h2 style="font-size: 2.25rem; text-align: center; margin-bottom: 3rem;">Our Core Values</h2>
                <div class="grid-cols-3">
                  ${values.map((val: any) => `
                    <div class="glass-panel">
                      <h3 style="font-size: 1.25rem; font-weight: 700; margin-bottom: 1rem; color: var(--primary-color);">
                        ${escapeHtml(val.title)}
                      </h3>
                      <p style="color: var(--text-muted); font-size: 0.95rem; line-height: 1.6;">
                        ${escapeHtml(val.desc)}
                      </p>
                    </div>
                  `).join('')}
                </div>
              </section>
            ` : ''}
          </div>
        `
      }
      case 'Services':
      case 'Menu':
      case 'Gallery': {
        const items = pageData.items || []
        const title = pageData.title || 'Our Offerings'
        const subtitle = pageData.subtitle || 'What we bring to you'

        return `
          <div style="padding: 3rem 2rem;">
            <header style="text-align: center; margin-bottom: 4rem;">
              <h1 style="font-size: 2.75rem; margin-bottom: 1rem;">${escapeHtml(title)}</h1>
              <p style="color: var(--text-muted); font-size: 1.1rem;">${escapeHtml(subtitle)}</p>
            </header>

            <div class="grid-cols-3">
              ${items.map((item: any) => `
                <div class="glass-panel" style="padding: 0; overflow: hidden;">
                  ${item.image_url ? `
                    <div style="height: 220px; overflow: hidden; border-bottom: 1px solid rgba(255,255,255,0.05);">
                      <img src="${escapeHtml(item.image_url)}" alt="${escapeHtml(item.name)}" style="width: 100%; height: 100%; object-fit: cover;" />
                    </div>
                  ` : ''}
                  <div style="padding: 1.5rem;">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
                      <h3 style="font-size: 1.25rem; font-weight: 700;">${escapeHtml(item.name)}</h3>
                      ${item.price ? `
                        <span style="font-size: 1.1rem; font-weight: 700; color: var(--accent-color);">
                          ${escapeHtml(item.price)}
                        </span>
                      ` : ''}
                    </div>
                    <p style="color: var(--text-muted); font-size: 0.925rem; line-height: 1.5;">
                      ${escapeHtml(item.description)}
                    </p>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>
        `
      }
      case 'Testimonials': {
        const reviews = pageData.reviews || []
        const title = pageData.title || 'Client Reviews'
        const subtitle = pageData.subtitle || 'What our customers say'

        return `
          <div style="padding: 3rem 2rem;">
            <header style="text-align: center; margin-bottom: 4rem;">
              <h1 style="font-size: 2.75rem; margin-bottom: 1rem;">${escapeHtml(title)}</h1>
              <p style="color: var(--text-muted); font-size: 1.1rem;">${escapeHtml(subtitle)}</p>
            </header>

            <div class="grid-cols-3">
              ${reviews.map((rev: any) => `
                <div class="glass-panel">
                  <div style="display: flex; gap: 0.2rem; margin-bottom: 1rem; color: var(--accent-color);">
                    ${Array.from({ length: rev.rating || 5 }).map(() => `
                      <i data-lucide="star" style="fill: currentColor; width: 20px; height: 20px;"></i>
                    `).join('')}
                  </div>
                  <p style="font-style: italic; color: var(--text-color); opacity: 0.85; line-height: 1.6; margin-bottom: 1.5rem;">
                    "${escapeHtml(rev.text)}"
                  </p>
                  <div>
                    <h4 style="font-weight: 700; font-size: 1rem;">${escapeHtml(rev.name)}</h4>
                    <span style="font-size: 0.85rem; color: var(--text-muted);">${escapeHtml(rev.role)}</span>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>
        `
      }
      case 'Blog': {
        const posts = pageData.posts || []
        const title = pageData.title || 'Latest Updates'
        const subtitle = pageData.subtitle || 'Read our blog'

        return `
          <div style="padding: 3rem 2rem;">
            <header style="text-align: center; margin-bottom: 4rem;">
              <h1 style="font-size: 2.75rem; margin-bottom: 1rem;">${escapeHtml(title)}</h1>
              <p style="color: var(--text-muted); font-size: 1.1rem;">${escapeHtml(subtitle)}</p>
            </header>

            <div class="grid-cols-3">
              ${posts.map((post: any) => `
                <div class="glass-panel" style="justify-content: space-between;">
                  <div>
                    <div style="display: flex; justify-content: space-between; font-size: 0.8rem; color: var(--text-muted); margin-bottom: 1rem;">
                      <span>${escapeHtml(post.date)}</span>
                      <span>${escapeHtml(post.read_time)}</span>
                    </div>
                    <h3 style="font-size: 1.25rem; font-weight: 700; margin-bottom: 1rem; line-height: 1.4;">
                      ${escapeHtml(post.title)}
                    </h3>
                    <p style="color: var(--text-muted); font-size: 0.9rem; line-height: 1.6; margin-bottom: 1.5rem;">
                      ${escapeHtml(post.excerpt)}
                    </p>
                  </div>
                  <div style="display: flex; align-items: center; gap: 0.5rem; border-top: 1px solid rgba(255,255,255,0.05); padding-top: 1rem;">
                    <i data-lucide="user" style="width: 16px; height: 16px; color: var(--primary-color);"></i>
                    <span style="font-size: 0.85rem; font-weight: 600;">By ${escapeHtml(post.author)}</span>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>
        `
      }
      case 'Contact': {
        const headline = pageData.headline || 'Contact Us'
        const email = pageData.email || 'hello@business.com'
        const phone = pageData.phone || '(555) 123-4567'
        const address = pageData.address || '123 Business St'
        const hours = pageData.hours || []

        return `
          <div style="padding: 3rem 2rem; max-width: 1100px; margin: 0 auto;">
            <header style="text-align: center; margin-bottom: 4rem;">
              <h1 style="font-size: 2.75rem; margin-bottom: 1rem;">${escapeHtml(headline)}</h1>
            </header>

            <div style="display: grid; grid-template-columns: 1.2fr 0.8fr; gap: 4rem;" class="contact-grid">
              <!-- Contact Form -->
              <div class="glass-panel">
                <h2 style="font-size: 1.5rem; margin-bottom: 1.5rem;">Send Us a Message</h2>
                <form id="contactForm" onsubmit="handleContactSubmit(event)" style="display: flex; flex-direction: column; gap: 1.25rem;">
                  <div class="form-group">
                    <label class="form-label">Your Name</label>
                    <input type="text" placeholder="John Doe" class="input-field" required />
                  </div>
                  <div class="form-group">
                    <label class="form-label">Email Address</label>
                    <input type="email" placeholder="john@example.com" class="input-field" required />
                  </div>
                  <div class="form-group">
                    <label class="form-label">Message</label>
                    <textarea placeholder="How can we help you?" class="input-field" style="min-height: 120px; resize: vertical;" required></textarea>
                  </div>
                  <button type="submit" class="btn-submit" style="align-self: flex-start;">
                    Submit Inquiry
                  </button>
                </form>
              </div>

              <!-- Information Details -->
              <div style="display: flex; flex-direction: column; gap: 2.5rem;">
                <div>
                  <h3 style="font-size: 1.25rem; margin-bottom: 1rem; display: flex; align-items: center; gap: 0.5rem;">
                    <i data-lucide="map-pin" style="color: var(--primary-color);"></i> Address
                  </h3>
                  <p style="color: var(--text-color); opacity: 0.8;">${escapeHtml(address)}</p>
                </div>

                <div>
                  <h3 style="font-size: 1.25rem; margin-bottom: 1rem; display: flex; align-items: center; gap: 0.5rem;">
                    <i data-lucide="phone" style="color: var(--primary-color);"></i> Phone
                  </h3>
                  <p style="color: var(--text-color); opacity: 0.8;">${escapeHtml(phone)}</p>
                </div>

                <div>
                  <h3 style="font-size: 1.25rem; margin-bottom: 1rem; display: flex; align-items: center; gap: 0.5rem;">
                    <i data-lucide="mail" style="color: var(--primary-color);"></i> Email
                  </h3>
                  <p style="color: var(--text-color); opacity: 0.8;">${escapeHtml(email)}</p>
                </div>

                ${hours.length > 0 ? `
                  <div>
                    <h3 style="font-size: 1.25rem; margin-bottom: 1rem; display: flex; align-items: center; gap: 0.5rem;">
                      <i data-lucide="clock" style="color: var(--primary-color);"></i> Business Hours
                    </h3>
                    <ul style="list-style: none; display: flex; flex-direction: column; gap: 0.4rem; color: var(--text-color); opacity: 0.7; padding-left: 1.75rem;">
                      ${hours.map((hr: string) => `<li>${escapeHtml(hr)}</li>`).join('')}
                    </ul>
                  </div>
                ` : ''}
              </div>
            </div>
          </div>
        `
      }
      default:
        return `<div style="padding: 4rem; text-align: center;"><h2>Page Not Configured</h2></div>`
    }
  }

  // Build the complete standalone page layout
  const fullHtmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(websiteTitle)}</title>
  <meta name="description" content="${escapeHtml(websiteDesc)}">
  <meta name="keywords" content="${escapeHtml(keywords)}">
  
  <!-- Google Fonts -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=${fontName.replace(/\s+/g, '+')}:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
  
  <!-- CSS Stylesheet -->
  <style>
    ${styleHeader}
  </style>
</head>
<body>

  <!-- Dynamic Radial Glow Gradients -->
  <div class="background-glows">
    <div class="glow-1"></div>
    <div class="glow-2"></div>
  </div>

  <!-- Navbar -->
  <nav class="template-nav ${navbarStyle}">
    <div class="nav-logo">
      <i data-lucide="sparkles"></i>
      ${escapeHtml(website.business_name)}
    </div>
    <ul class="nav-links">
      ${pagesList.map((page: string) => `
        <li>
          <button 
            class="nav-btn ${page === 'Home' ? 'active' : ''}" 
            data-page="${page}" 
            onclick="navigateTo('${page}')">
            ${escapeHtml(page)}
          </button>
        </li>
      `).join('')}
    </ul>
  </nav>

  <!-- Main Multi-page Sections -->
  <main style="min-height: 60vh;">
    ${pagesList.map((page: string) => `
      <div id="page-section-${page}" class="page-section-container" style="display: ${page === 'Home' ? 'block' : 'none'};">
        ${renderPageHTML(page, content[page] || {})}
      </div>
    `).join('')}
  </main>

  <!-- Footer -->
  <footer>
    <div class="footer-socials">
      <i data-lucide="facebook" class="social-icon"></i>
      <i data-lucide="twitter" class="social-icon"></i>
      <i data-lucide="instagram" class="social-icon"></i>
    </div>
    <p style="font-size: 0.9rem;">&copy; ${new Date().getFullYear()} ${escapeHtml(website.business_name)}. All rights reserved.</p>
  </footer>

  <!-- CDN Lucide Icons & Routing Logic -->
  <script src="https://unpkg.com/lucide@latest"></script>
  <script>
    // Initialize Lucide SVG Icons
    lucide.createIcons();

    // Tab-based SPA Router
    function navigateTo(pageName) {
      // Hide all pages
      document.querySelectorAll('.page-section-container').forEach(el => {
        el.style.display = 'none';
      });
      
      // Show requested page
      const targetPage = document.getElementById('page-section-' + pageName);
      if (targetPage) {
        targetPage.style.display = 'block';
      }

      // Update Nav Class states
      document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.classList.remove('active');
      });
      const activeBtn = document.querySelector(\`[data-page="\${pageName}"]\`);
      if (activeBtn) {
        activeBtn.classList.add('active');
      }

      // Scroll to top
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // Interactive Demo Form Submit Handler
    function handleContactSubmit(event) {
      event.preventDefault();
      alert('Thank you for contacting us! Your demo message has been simulated successfully.');
      event.target.reset();
    }
  </script>
</body>
</html>`

  // Client-Side download blob creation
  const blob = new Blob([fullHtmlContent], { type: 'text/html;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.setAttribute('download', `${website.business_name.toLowerCase().replace(/[^a-z0-9]/g, '_')}_website.html`)
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}
