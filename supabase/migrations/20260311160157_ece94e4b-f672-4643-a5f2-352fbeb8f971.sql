
-- Landing Pages table
CREATE TABLE public.landing_pages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  title text NOT NULL,
  is_published boolean NOT NULL DEFAULT false,
  meta_title text,
  meta_description text,
  pixel_meta_id text,
  pixel_google_id text,
  favicon_url text,
  custom_css text,
  created_by uuid REFERENCES auth.users(id),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.landing_pages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Auth can manage landing pages" ON public.landing_pages FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Public can view published pages" ON public.landing_pages FOR SELECT TO anon USING (is_published = true);

-- Landing Page Sections table
CREATE TABLE public.landing_page_sections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  page_id uuid REFERENCES public.landing_pages(id) ON DELETE CASCADE NOT NULL,
  section_type text NOT NULL,
  "order" integer NOT NULL DEFAULT 0,
  config jsonb NOT NULL DEFAULT '{}'::jsonb,
  is_visible boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.landing_page_sections ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Auth can manage sections" ON public.landing_page_sections FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Public can view sections" ON public.landing_page_sections FOR SELECT TO anon USING (
  EXISTS (SELECT 1 FROM public.landing_pages lp WHERE lp.id = page_id AND lp.is_published = true)
);

-- Page Views table (analytics)
CREATE TABLE public.page_views (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  page_id uuid REFERENCES public.landing_pages(id) ON DELETE CASCADE NOT NULL,
  visitor_id text,
  utm_source text,
  utm_medium text,
  utm_campaign text,
  utm_content text,
  utm_term text,
  referrer text,
  user_agent text,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.page_views ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert page views" ON public.page_views FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "Auth can insert page views" ON public.page_views FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Auth can view page views" ON public.page_views FOR SELECT TO authenticated USING (true);

-- Add DELETE policy for leads (missing)
CREATE POLICY "Auth can delete leads" ON public.leads FOR DELETE TO authenticated USING (true);

-- Indexes for performance
CREATE INDEX idx_landing_pages_slug ON public.landing_pages(slug);
CREATE INDEX idx_landing_page_sections_page_id ON public.landing_page_sections(page_id);
CREATE INDEX idx_page_views_page_id ON public.page_views(page_id);
CREATE INDEX idx_page_views_created_at ON public.page_views(created_at);
