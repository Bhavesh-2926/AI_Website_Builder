-- Supabase Database Schema for AI Website Builder SaaS

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Users Table (links to Supabase Auth)
CREATE TABLE IF NOT EXISTS public.users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Websites Table
CREATE TABLE IF NOT EXISTS public.websites (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    business_name TEXT NOT NULL,
    business_type TEXT NOT NULL, -- e.g., 'Bakery', 'Restaurant', 'Cafe', etc.
    theme TEXT NOT NULL, -- e.g., 'Glassmorphism', 'Modern', 'Luxury', etc.
    status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published')) NOT NULL,
    published_url TEXT UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Index on user_id for faster lookup
CREATE INDEX IF NOT EXISTS idx_websites_user_id ON public.websites(user_id);
-- Index on published_url for lookup when rendering public sites
CREATE INDEX IF NOT EXISTS idx_websites_published_url ON public.websites(published_url);

-- 3. Website Content Table (Handles sections and text for each page)
CREATE TABLE IF NOT EXISTS public.website_content (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    website_id UUID NOT NULL REFERENCES public.websites(id) ON DELETE CASCADE,
    page_name TEXT NOT NULL, -- e.g., 'Home', 'About', 'Services', 'Contact'
    content_json JSONB NOT NULL, -- Stores dynamic blocks
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(website_id, page_name)
);

CREATE INDEX IF NOT EXISTS idx_website_content_website_id ON public.website_content(website_id);

-- 4. Website Design Table (Color preferences, fonts, typography)
CREATE TABLE IF NOT EXISTS public.website_design (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    website_id UUID UNIQUE NOT NULL REFERENCES public.websites(id) ON DELETE CASCADE,
    design_json JSONB NOT NULL, -- font, primary, secondary, accent, style configs
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. Media Table (Stores uploaded or AI generated files)
CREATE TABLE IF NOT EXISTS public.media (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    website_id UUID NOT NULL REFERENCES public.websites(id) ON DELETE CASCADE,
    file_url TEXT NOT NULL,
    file_type TEXT NOT NULL, -- e.g., 'image/png', 'image/jpeg', 'video/mp4'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_media_website_id ON public.media(website_id);

-- 6. SEO Table
CREATE TABLE IF NOT EXISTS public.seo (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    website_id UUID UNIQUE NOT NULL REFERENCES public.websites(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    keywords TEXT,
    og_image TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 7. Settings Table (Configuration like domains, analytics integrations, etc.)
CREATE TABLE IF NOT EXISTS public.settings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    website_id UUID UNIQUE NOT NULL REFERENCES public.websites(id) ON DELETE CASCADE,
    settings_json JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ----------------------------------------------------
-- ENABLE ROW LEVEL SECURITY (RLS)
-- ----------------------------------------------------
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.websites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.website_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.website_design ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.media ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.seo ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;

-- ----------------------------------------------------
-- RLS POLICIES FOR USERS
-- ----------------------------------------------------
CREATE POLICY "Users can read own record" ON public.users 
    FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can insert own record" ON public.users 
    FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update own record" ON public.users 
    FOR UPDATE USING (auth.uid() = id);

-- ----------------------------------------------------
-- RLS POLICIES FOR WEBSITES
-- ----------------------------------------------------
CREATE POLICY "Users can manage own websites" ON public.websites 
    FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Anyone can view published websites" ON public.websites 
    FOR SELECT USING (status = 'published');

-- ----------------------------------------------------
-- RLS POLICIES FOR WEBSITE_CONTENT
-- ----------------------------------------------------
CREATE POLICY "Users can manage content of own websites" ON public.website_content 
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.websites 
            WHERE websites.id = website_content.website_id AND websites.user_id = auth.uid()
        )
    );
CREATE POLICY "Anyone can view content of published websites" ON public.website_content 
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.websites 
            WHERE websites.id = website_content.website_id AND websites.status = 'published'
        )
    );

-- ----------------------------------------------------
-- RLS POLICIES FOR WEBSITE_DESIGN
-- ----------------------------------------------------
CREATE POLICY "Users can manage design of own websites" ON public.website_design 
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.websites 
            WHERE websites.id = website_design.website_id AND websites.user_id = auth.uid()
        )
    );
CREATE POLICY "Anyone can view design of published websites" ON public.website_design 
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.websites 
            WHERE websites.id = website_design.website_id AND websites.status = 'published'
        )
    );

-- ----------------------------------------------------
-- RLS POLICIES FOR MEDIA
-- ----------------------------------------------------
CREATE POLICY "Users can manage media of own websites" ON public.media 
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.websites 
            WHERE websites.id = media.website_id AND websites.user_id = auth.uid()
        )
    );
CREATE POLICY "Anyone can view media of published websites" ON public.media 
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.websites 
            WHERE websites.id = media.website_id AND websites.status = 'published'
        )
    );

-- ----------------------------------------------------
-- RLS POLICIES FOR SEO
-- ----------------------------------------------------
CREATE POLICY "Users can manage SEO of own websites" ON public.seo 
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.websites 
            WHERE websites.id = seo.website_id AND websites.user_id = auth.uid()
        )
    );
CREATE POLICY "Anyone can view SEO of published websites" ON public.seo 
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.websites 
            WHERE websites.id = seo.website_id AND websites.status = 'published'
        )
    );

-- ----------------------------------------------------
-- RLS POLICIES FOR SETTINGS
-- ----------------------------------------------------
CREATE POLICY "Users can manage settings of own websites" ON public.settings 
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.websites 
            WHERE websites.id = settings.website_id AND websites.user_id = auth.uid()
        )
    );

-- ----------------------------------------------------
-- AUTOMATIC USER SYNC TRIGGER
-- ----------------------------------------------------
-- When a user registers with Supabase Auth, trigger copies their details to public.users
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.users (id, email, full_name)
  VALUES (
    new.id,
    new.email,
    COALESCE(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', '')
  )
  ON CONFLICT (id) DO UPDATE
  SET email = new.email,
      full_name = COALESCE(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', public.users.full_name);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
