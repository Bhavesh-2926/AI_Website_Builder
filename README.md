# SwiftSite - Premium Website Builder SaaS

SwiftSite is a production-ready SaaS application allowing users to generate complete business landing websites in seconds using a collaborative swarm of three specialized Generation Engines (Requirement Engine, Content Copywriting Engine, and Design System Engine), edit them visually in a split-panel sandbox, upload assets, optimize SEO, and host them instantly.

Designed for speed, visual excellence, and ease of use, SwiftSite allows users to customize and export fully functional standalone websites.

---

## 🛠️ Technical Stack

- **Frontend**: React 19, TypeScript, Vite, custom HSL Vanilla CSS, Zustand State Management, Framer Motion, Axios, Supabase Client SDK, Lucide Icons.
- **Backend**: Python 3.11, FastAPI, Uvicorn, OpenAI GPT & DALL-E APIs (acting as the text & asset generation engines), Supabase Python SDK.
- **Database / Auth / Storage**: Supabase PostgreSQL database, Supabase Auth, and Supabase Storage bucket.

---

## ✨ Core Features

### 1. Collaborative Generation Engines
- **Requirement Engine**: Processes wizard specifications and maps them to clean user business types.
- **Content Copywriting Engine**: Generates customized copywriting, faq lists, testimonials, values, and menus.
- **Design System Engine**: Formulates curated, modern HSL color palettes, typography rules, spacing tokens, and animation presets.

### 2. Live Split-Panel Visual Editor
- Edit headers, texts, and buttons inline or in the sidebar.
- Switch pages instantly inside the rendering viewport sandbox.
- Tweak design parameters (fonts, roundness, primary/secondary colors, background gradients) and preview modifications in real-time.

### 3. Deep Visual Style Customizer
- **Glass Blur Strength**: Adjust between Low, Standard, and Deep frosting.
- **Card Border & Glow Effect**: Choose between Soft Translucent borders or Accent Glowing borders that use your primary theme color.
- **Hover Animation**: Tweak hover transitions between Classic Float Slide or Pop Zoom scaling.

### 4. Style-Driven Structural Layouts
The layout structure of your website dynamically adjusts based on the selected design style (not just changing colors!):
- **Hero Styles**: Supports Centered Gradient (default), Split-Screen (side-by-side copywriting and product mockup), and Minimal Left (sleek, left-aligned, high-end editorial).
- **Card Types**: Support Glass Panels, Minimal Border (sharp corners, thin borders), Luxury Gold (golden borders, dark gradients), and Corporate Solid (slate backgrounds with clean shadows).

### 5. Standalone Code Exporter
- Click **"Download Code"** inside the editor to bundle the entire site.
- Compiles all wizard widgets, pages, custom styling variables, and content into a single, fully responsive static HTML page.
- Runs offline instantly, powered by Lucide Icon CDN and Vanilla JS single-page routing.

### 6. Developer Testing Sandbox (Offline Mode)
- **Auth Bypass**: Test the frontend directly without Supabase credentials using the "Bypass with Demo Account" button.
- **In-Memory Generation**: The FastAPI server falls back to beautiful pre-set templates and curated Unsplash imagery if OpenAI keys are absent, allowing testing without paying API fees.

---

## 📂 Folder Structure

```text
AI_Website_Builder/
├── supabase_schema.sql         # Supabase PostgreSQL tables & RLS policies
├── .env.example                # Environment variables template
├── README.md                   # Setup and deployment guides
│
├── frontend/                   # React 19 / Vite client
│   ├── index.html              # Main HTML mounting file & Google Fonts
│   ├── package.json            # Client packages configuration
│   ├── tsconfig.json           # TypeScript configuration
│   ├── vite.config.ts          # Vite bundle proxy configuration
│   └── src/
│       ├── main.tsx            # React mounting entrypoint
│       ├── App.tsx             # React routes and auth listener
│       ├── index.css           # Vanilla CSS tokens and animations
│       ├── layouts/            # Dashboard and public page frames
│       ├── pages/              # Wizard, Editor, Dashboard, Auth screens
│       ├── services/           # Axios and Supabase SDK client wrappers
│       ├── store/              # Zustand state manager
│       └── templates/          # Visual layouts & rendering engine
│
└── backend/                    # Python FastAPI service
    ├── requirements.txt        # Backend python libraries configuration
    ├── Dockerfile              # Docker container wrapper configuration
    └── app/
        ├── main.py             # Uvicorn FastAPI listener
        ├── core/               # App configuration & security decoders
        ├── agents/             # Generation engines (Requirement, Content, Design)
        ├── services/           # OpenAI and Supabase SDK python connectors
        └── routes/             # REST routing controllers
```

---

## 🚀 Step-by-Step Local Setup

### 1. Database Setup (Supabase)
1. Create a new project on [Supabase](https://supabase.com/).
2. Open the **SQL Editor** in your Supabase project dashboard.
3. Paste the entire script from `supabase_schema.sql` and run it to create your schema, indices, and auth triggers.
4. Go to **Storage**, create a public bucket named `website-assets`, and confirm that public read permissions are active.

### 2. Configure Environment Variables
Copy `.env.example` to `.env` in the root directory:
```bash
# For backend
OPENAI_API_KEY=your_openai_api_key
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key

# For frontend
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

### 3. Run Backend (FastAPI)
Navigate to the `backend/` directory:
```bash
cd backend
# Create virtual environment
python -m venv venv
# Activate virtual environment (Windows)
.\venv\Scripts\Activate.ps1
# Install packages
pip install -r requirements.txt
# Start server
uvicorn app.main:app --reload --port 8000
```
Interactive Swagger API docs will be running at `http://localhost:8000/docs`.

### 4. Run Frontend (React 19)
Navigate to the `frontend/` directory:
```bash
cd frontend
# Install packages
npm install
# Start developer server
npm run dev
```
Open **`http://localhost:3000`** in Google Chrome.

---

## 🚢 Deployment Guides

### Backend Deployment (Railway)
1. Import your project into [Railway](https://railway.app/).
2. Connect your GitHub repository.
3. Railway automatically detects the `backend/Dockerfile` and bundles the container.
4. Set the environment variables in Railway's Settings tab (`OPENAI_API_KEY`, `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `PORT=8000`).

### Frontend Deployment (Vercel)
1. Import your project into [Vercel](https://vercel.com/).
2. Set the root directory to `frontend`.
3. Set the build script to `npm run build` and the output directory to `dist`.
4. Configure environment keys `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`.
