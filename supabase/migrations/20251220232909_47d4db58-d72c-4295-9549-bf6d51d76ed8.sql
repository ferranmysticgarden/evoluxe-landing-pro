-- Primero, eliminar las políticas existentes que pueden estar mal configuradas
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can view own projects" ON public.projects;
DROP POLICY IF EXISTS "Users can create own projects" ON public.projects;
DROP POLICY IF EXISTS "Users can update own projects" ON public.projects;
DROP POLICY IF EXISTS "Users can delete own projects" ON public.projects;
DROP POLICY IF EXISTS "Users can view analyses of own projects" ON public.seo_analyses;
DROP POLICY IF EXISTS "Users can create analyses for own projects" ON public.seo_analyses;

-- Recrear políticas PERMISSIVE correctas para profiles
CREATE POLICY "Authenticated users can view own profile" 
ON public.profiles 
FOR SELECT 
TO authenticated
USING (auth.uid() = id);

CREATE POLICY "Authenticated users can update own profile" 
ON public.profiles 
FOR UPDATE 
TO authenticated
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

CREATE POLICY "System can insert profiles" 
ON public.profiles 
FOR INSERT 
TO authenticated
WITH CHECK (auth.uid() = id);

-- Recrear políticas PERMISSIVE correctas para projects
CREATE POLICY "Authenticated users can view own projects" 
ON public.projects 
FOR SELECT 
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Authenticated users can create own projects" 
ON public.projects 
FOR INSERT 
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Authenticated users can update own projects" 
ON public.projects 
FOR UPDATE 
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Authenticated users can delete own projects" 
ON public.projects 
FOR DELETE 
TO authenticated
USING (auth.uid() = user_id);

-- Recrear políticas PERMISSIVE correctas para seo_analyses
CREATE POLICY "Authenticated users can view own analyses" 
ON public.seo_analyses 
FOR SELECT 
TO authenticated
USING (EXISTS (
  SELECT 1 FROM public.projects 
  WHERE projects.id = seo_analyses.project_id 
  AND projects.user_id = auth.uid()
));

CREATE POLICY "Authenticated users can create analyses for own projects" 
ON public.seo_analyses 
FOR INSERT 
TO authenticated
WITH CHECK (EXISTS (
  SELECT 1 FROM public.projects 
  WHERE projects.id = seo_analyses.project_id 
  AND projects.user_id = auth.uid()
));

CREATE POLICY "Authenticated users can delete own analyses" 
ON public.seo_analyses 
FOR DELETE 
TO authenticated
USING (EXISTS (
  SELECT 1 FROM public.projects 
  WHERE projects.id = seo_analyses.project_id 
  AND projects.user_id = auth.uid()
));