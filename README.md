# AI Website Builder SaaS

A production-ready SaaS application allowing users to generate complete business landing websites in seconds using a collaborative swarm of three specialized AI Agents (Requirement, Content, and Design Agents), edit them visually, upload assets, optimize SEO, and host them instantly.

---

## Technical Stack

- **Frontend**: React 19, TypeScript, Vite, custom HSL Vanilla CSS, Framer Motion, Zustand state, Axios, Supabase Client JS.
- **Backend**: Python, FastAPI, Uvicorn, OpenAI API SDK.
- **Database / Auth / Storage**: Supabase PostgreSQL database, Supabase Auth, and Supabase Storage bucket.

---

## Folder Structure

```text
AI-Website-Builder/
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
        ├── agents/             # Requirement, Content, & Design AI agents
        ├── services/           # OpenAI and Supabase SDK python connectors
        └── routes/             # REST routing controllers
```

---

## Step-by-Step Local Setup

### 1. Database Setup (Supabase)
1. Register or Log in to [Supabase](https://supabase.com/).
2. Create a new project.
3. Open the **SQL Editor** in your Supabase dashboard.
4. Copy and run the entire query content from [supabase_schema.sql](supabase_schema.sql) to generate the tables, index lookups, and triggers.
5. Create a public storage bucket named `website-assets` under **Storage** and ensure public read access is enabled.

### 2. Configure Environment Variables
Copy `.env.example` to `.env` at the root and fill in your keys:
```bash
# For backend
OPENAI_API_KEY=your_openai_api_key
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key

# For frontend
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

*Note: If you leave these credentials blank, the frontend and backend automatically run in an **Offline Mock Sandbox** mode, simulating accounts logins and loading handcrafted templates and images, allowing you to test the SaaS without paying token fees.*

### 3. Run Backend (FastAPI)
Navigate to the `backend/` directory:
```bash
cd backend
# Create virtual environment
python -m venv venv
# Activate virtual environment (Windows powershell)
.\venv\Scripts\Activate.ps1
# Install packages
pip install -r requirements.txt
# Start server
uvicorn app.main:app --reload --port 8000
```
The API docs will be active at `http://localhost:8000/docs`.

### 4. Run Frontend (React 19)
Navigate to the `frontend/` directory:
```bash
cd frontend
# Install packages
npm install
# Start developer server
npm run dev
```
Open `http://localhost:3000` in your web browser.

---

## Deployment Guides

### Backend Deployment (Railway)
1. Create a project on [Railway](https://railway.app/).
2. Connect your GitHub repository containing the `backend/` directory.
3. Railway will read the `backend/Dockerfile` and compile the environment.
4. Add your variables in the Railway variable settings (`OPENAI_API_KEY`, `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `PORT=8000`).

### Frontend Deployment (Vercel)
1. Import your project into [Vercel](https://vercel.com/).
2. Configure the root directory to `frontend`.
3. Set the build script to `npm run build` and output directory to `dist`.
4. Add environment configurations `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`.
