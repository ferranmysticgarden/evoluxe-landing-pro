-- Create projects table
CREATE TABLE public.projects (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  url TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  last_analyzed_at TIMESTAMP WITH TIME ZONE,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'paused', 'archived'))
);

-- Create SEO analyses table for historical tracking
CREATE TABLE public.seo_analyses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  analyzed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  overall_score INTEGER NOT NULL CHECK (overall_score >= 0 AND overall_score <= 100),
  
  -- Technical SEO metrics
  title TEXT,
  title_length INTEGER,
  meta_description TEXT,
  meta_description_length INTEGER,
  h1_count INTEGER,
  h1_tags TEXT[],
  h2_count INTEGER,
  canonical_url TEXT,
  robots_meta TEXT,
  
  -- Performance metrics
  page_load_time NUMERIC,
  page_size_kb NUMERIC,
  
  -- Content metrics
  word_count INTEGER,
  images_total INTEGER,
  images_with_alt INTEGER,
  images_without_alt INTEGER,
  internal_links INTEGER,
  external_links INTEGER,
  
  -- Mobile & UX
  mobile_friendly BOOLEAN,
  has_viewport_meta BOOLEAN,
  
  -- Security
  is_https BOOLEAN,
  
  -- Structured data
  has_schema_markup BOOLEAN,
  schema_types TEXT[],
  
  -- Social
  og_title TEXT,
  og_description TEXT,
  og_image TEXT,
  twitter_card TEXT,
  
  -- Issues and recommendations
  critical_issues TEXT[],
  warnings TEXT[],
  recommendations TEXT[],
  
  -- Raw data
  raw_html TEXT
);

-- Enable RLS on projects
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

-- Enable RLS on seo_analyses
ALTER TABLE public.seo_analyses ENABLE ROW LEVEL SECURITY;

-- RLS Policies for projects
CREATE POLICY "Users can view own projects"
  ON public.projects FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own projects"
  ON public.projects FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own projects"
  ON public.projects FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own projects"
  ON public.projects FOR DELETE
  USING (auth.uid() = user_id);

-- RLS Policies for seo_analyses
CREATE POLICY "Users can view analyses of own projects"
  ON public.seo_analyses FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.projects
      WHERE projects.id = seo_analyses.project_id
      AND projects.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create analyses for own projects"
  ON public.seo_analyses FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.projects
      WHERE projects.id = seo_analyses.project_id
      AND projects.user_id = auth.uid()
    )
  );

-- Trigger for updating updated_at
CREATE TRIGGER update_projects_updated_at
  BEFORE UPDATE ON public.projects
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- Create indexes for better performance
CREATE INDEX idx_projects_user_id ON public.projects(user_id);
CREATE INDEX idx_projects_status ON public.projects(status);
CREATE INDEX idx_seo_analyses_project_id ON public.seo_analyses(project_id);
CREATE INDEX idx_seo_analyses_analyzed_at ON public.seo_analyses(analyzed_at DESC);