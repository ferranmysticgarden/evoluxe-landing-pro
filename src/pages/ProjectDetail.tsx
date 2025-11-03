import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, RefreshCw, AlertCircle, AlertTriangle, CheckCircle2, ExternalLink, Clock, FileText, Image, Link, Smartphone, Shield, Code, BarChart3 } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Project {
  id: string;
  name: string;
  url: string;
  last_analyzed_at: string | null;
}

interface Analysis {
  id: string;
  analyzed_at: string;
  overall_score: number;
  title: string;
  title_length: number;
  meta_description: string;
  meta_description_length: number;
  h1_count: number;
  h1_tags: string[];
  h2_count: number;
  canonical_url: string;
  robots_meta: string;
  page_load_time: number;
  page_size_kb: number;
  word_count: number;
  images_total: number;
  images_with_alt: number;
  images_without_alt: number;
  internal_links: number;
  external_links: number;
  mobile_friendly: boolean;
  has_viewport_meta: boolean;
  is_https: boolean;
  has_schema_markup: boolean;
  schema_types: string[];
  og_title: string;
  og_description: string;
  og_image: string;
  twitter_card: string;
  critical_issues: string[];
  warnings: string[];
  recommendations: string[];
}

const ProjectDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [project, setProject] = useState<Project | null>(null);
  const [latestAnalysis, setLatestAnalysis] = useState<Analysis | null>(null);
  const [analysisHistory, setAnalysisHistory] = useState<Analysis[]>([]);
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate("/auth");
      return;
    }
    loadProjectData();
  }, [id, user, navigate]);

  const loadProjectData = async () => {
    try {
      setLoading(true);

      // Load project
      const { data: projectData, error: projectError } = await supabase
        .from('projects')
        .select('*')
        .eq('id', id)
        .single();

      if (projectError) throw projectError;
      setProject(projectData);

      // Load latest analysis
      const { data: analysisData, error: analysisError } = await supabase
        .from('seo_analyses')
        .select('*')
        .eq('project_id', id)
        .order('analyzed_at', { ascending: false })
        .limit(10);

      if (analysisError) throw analysisError;
      
      if (analysisData && analysisData.length > 0) {
        setLatestAnalysis(analysisData[0]);
        setAnalysisHistory(analysisData);
      }
    } catch (error) {
      console.error('Error loading project:', error);
      toast({
        title: "Error",
        description: "No se pudo cargar el proyecto",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAnalyze = async () => {
    setAnalyzing(true);
    try {
      const { data, error } = await supabase.functions.invoke('analyze-project', {
        body: { projectId: id }
      });

      if (error) throw error;

      if (data.success) {
        toast({
          title: "Análisis completado",
          description: `Score SEO: ${data.score}%`,
        });
        loadProjectData();
      } else {
        throw new Error(data.error || "Error al analizar");
      }
    } catch (error) {
      console.error('Error analyzing:', error);
      toast({
        title: "Error al analizar",
        description: error instanceof Error ? error.message : "No se pudo completar el análisis",
        variant: "destructive",
      });
    } finally {
      setAnalyzing(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const getScoreLabel = (score: number) => {
    if (score >= 80) return "Excelente";
    if (score >= 60) return "Bueno";
    if (score >= 40) return "Necesita Mejoras";
    return "Crítico";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-20">
          <div className="text-center">Cargando...</div>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-20">
          <Card>
            <CardContent className="py-8 text-center">
              <p>Proyecto no encontrado</p>
              <Button onClick={() => navigate("/dashboard")} className="mt-4">
                Volver al Dashboard
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate("/dashboard")}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver al Dashboard
          </Button>
          
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-foreground">{project.name}</h1>
              <a
                href={project.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary flex items-center gap-2 mt-2"
              >
                <ExternalLink className="h-4 w-4" />
                {project.url}
              </a>
            </div>
            
            <Button onClick={handleAnalyze} disabled={analyzing}>
              <RefreshCw className={`h-4 w-4 mr-2 ${analyzing ? 'animate-spin' : ''}`} />
              {analyzing ? "Analizando..." : "Analizar Ahora"}
            </Button>
          </div>
        </div>

        {!latestAnalysis ? (
          <Card>
            <CardContent className="py-16 text-center">
              <BarChart3 className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-xl font-semibold mb-2">Sin análisis aún</h3>
              <p className="text-muted-foreground mb-4">
                Ejecuta tu primer análisis SEO de este proyecto
              </p>
              <Button onClick={handleAnalyze} disabled={analyzing}>
                <RefreshCw className={`h-4 w-4 mr-2 ${analyzing ? 'animate-spin' : ''}`} />
                Iniciar Análisis
              </Button>
            </CardContent>
          </Card>
        ) : (
          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList>
              <TabsTrigger value="overview">Resumen</TabsTrigger>
              <TabsTrigger value="technical">Técnico</TabsTrigger>
              <TabsTrigger value="content">Contenido</TabsTrigger>
              <TabsTrigger value="social">Social</TabsTrigger>
              <TabsTrigger value="history">Histórico</TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6">
              {/* Score Card */}
              <Card>
                <CardHeader>
                  <CardTitle>Score SEO General</CardTitle>
                  <CardDescription>
                    Última actualización: {new Date(latestAnalysis.analyzed_at).toLocaleString('es-ES')}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Puntuación</span>
                    <span className={`text-4xl font-bold ${getScoreColor(latestAnalysis.overall_score)}`}>
                      {latestAnalysis.overall_score}%
                    </span>
                  </div>
                  <Progress value={latestAnalysis.overall_score} className="h-3" />
                  <p className="text-center text-muted-foreground">
                    {getScoreLabel(latestAnalysis.overall_score)}
                  </p>
                </CardContent>
              </Card>

              {/* Issues Grid */}
              <div className="grid gap-6 md:grid-cols-3">
                {/* Critical Issues */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base flex items-center gap-2">
                      <AlertCircle className="h-5 w-5 text-red-600" />
                      Críticos
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold mb-2">
                      {latestAnalysis.critical_issues.length}
                    </div>
                    <ul className="space-y-1 text-sm">
                      {latestAnalysis.critical_issues.slice(0, 3).map((issue, i) => (
                        <li key={i} className="text-red-600">{issue}</li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>

                {/* Warnings */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base flex items-center gap-2">
                      <AlertTriangle className="h-5 w-5 text-yellow-600" />
                      Advertencias
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold mb-2">
                      {latestAnalysis.warnings.length}
                    </div>
                    <ul className="space-y-1 text-sm">
                      {latestAnalysis.warnings.slice(0, 3).map((warning, i) => (
                        <li key={i} className="text-yellow-600">{warning}</li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>

                {/* Recommendations */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base flex items-center gap-2">
                      <CheckCircle2 className="h-5 w-5 text-blue-600" />
                      Recomendaciones
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold mb-2">
                      {latestAnalysis.recommendations.length}
                    </div>
                    <ul className="space-y-1 text-sm">
                      {latestAnalysis.recommendations.slice(0, 3).map((rec, i) => (
                        <li key={i} className="text-blue-600">{rec}</li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Technical Tab */}
            <TabsContent value="technical" className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                {/* Page Info */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <FileText className="h-5 w-5" />
                      Información de Página
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <div className="text-sm font-medium text-muted-foreground">Título</div>
                      <div className="text-sm">{latestAnalysis.title || "Sin título"}</div>
                      <Badge variant={latestAnalysis.title_length >= 30 && latestAnalysis.title_length <= 60 ? "default" : "destructive"}>
                        {latestAnalysis.title_length} caracteres
                      </Badge>
                    </div>
                    
                    <div>
                      <div className="text-sm font-medium text-muted-foreground">Meta Description</div>
                      <div className="text-sm">{latestAnalysis.meta_description || "Sin meta description"}</div>
                      <Badge variant={latestAnalysis.meta_description_length >= 120 && latestAnalysis.meta_description_length <= 160 ? "default" : "destructive"}>
                        {latestAnalysis.meta_description_length} caracteres
                      </Badge>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="text-sm font-medium text-muted-foreground">H1 Tags</div>
                        <div className="text-2xl font-bold">{latestAnalysis.h1_count}</div>
                      </div>
                      <div>
                        <div className="text-sm font-medium text-muted-foreground">H2 Tags</div>
                        <div className="text-2xl font-bold">{latestAnalysis.h2_count}</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Performance */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Clock className="h-5 w-5" />
                      Rendimiento
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm font-medium">Tiempo de Carga</span>
                        <span className="text-sm font-bold">
                          {(latestAnalysis.page_load_time / 1000).toFixed(2)}s
                        </span>
                      </div>
                      <Badge variant={latestAnalysis.page_load_time < 3000 ? "default" : "destructive"}>
                        {latestAnalysis.page_load_time < 3000 ? "Rápido" : "Lento"}
                      </Badge>
                    </div>

                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm font-medium">Tamaño de Página</span>
                        <span className="text-sm font-bold">
                          {latestAnalysis.page_size_kb.toFixed(0)} KB
                        </span>
                      </div>
                      <Badge variant={latestAnalysis.page_size_kb < 3000 ? "default" : "destructive"}>
                        {latestAnalysis.page_size_kb < 3000 ? "Óptimo" : "Pesado"}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>

                {/* Security & Mobile */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Shield className="h-5 w-5" />
                      Seguridad & Móvil
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">HTTPS</span>
                      <Badge variant={latestAnalysis.is_https ? "default" : "destructive"}>
                        {latestAnalysis.is_https ? "✓ Activado" : "✗ Desactivado"}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Mobile Friendly</span>
                      <Badge variant={latestAnalysis.mobile_friendly ? "default" : "destructive"}>
                        {latestAnalysis.mobile_friendly ? "✓ Sí" : "✗ No"}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Viewport Meta</span>
                      <Badge variant={latestAnalysis.has_viewport_meta ? "default" : "destructive"}>
                        {latestAnalysis.has_viewport_meta ? "✓ Sí" : "✗ No"}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>

                {/* Schema Markup */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Code className="h-5 w-5" />
                      Datos Estructurados
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Schema Markup</span>
                      <Badge variant={latestAnalysis.has_schema_markup ? "default" : "destructive"}>
                        {latestAnalysis.has_schema_markup ? "✓ Detectado" : "✗ No detectado"}
                      </Badge>
                    </div>
                    {latestAnalysis.schema_types.length > 0 && (
                      <div>
                        <div className="text-sm font-medium mb-2">Tipos detectados:</div>
                        <div className="flex flex-wrap gap-2">
                          {latestAnalysis.schema_types.map((type, i) => (
                            <Badge key={i} variant="outline">{type}</Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Content Tab */}
            <TabsContent value="content" className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                {/* Content Stats */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <FileText className="h-5 w-5" />
                      Estadísticas de Contenido
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm font-medium">Palabras Totales</span>
                        <span className="text-2xl font-bold">{latestAnalysis.word_count}</span>
                      </div>
                      <Badge variant={latestAnalysis.word_count >= 300 ? "default" : "destructive"}>
                        {latestAnalysis.word_count >= 300 ? "Suficiente" : "Muy corto"}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>

                {/* Images */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Image className="h-5 w-5" />
                      Imágenes
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <div className="text-sm text-muted-foreground">Total</div>
                        <div className="text-2xl font-bold">{latestAnalysis.images_total}</div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">Con ALT</div>
                        <div className="text-2xl font-bold text-green-600">{latestAnalysis.images_with_alt}</div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">Sin ALT</div>
                        <div className="text-2xl font-bold text-red-600">{latestAnalysis.images_without_alt}</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Links */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Link className="h-5 w-5" />
                      Enlaces
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="text-sm text-muted-foreground">Internos</div>
                        <div className="text-2xl font-bold">{latestAnalysis.internal_links}</div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">Externos</div>
                        <div className="text-2xl font-bold">{latestAnalysis.external_links}</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Social Tab */}
            <TabsContent value="social" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Open Graph & Twitter Cards</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="text-sm font-medium text-muted-foreground mb-1">OG Title</div>
                    <div className="text-sm">{latestAnalysis.og_title || "No configurado"}</div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-muted-foreground mb-1">OG Description</div>
                    <div className="text-sm">{latestAnalysis.og_description || "No configurado"}</div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-muted-foreground mb-1">OG Image</div>
                    <div className="text-sm">{latestAnalysis.og_image || "No configurado"}</div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-muted-foreground mb-1">Twitter Card</div>
                    <Badge variant={latestAnalysis.twitter_card ? "default" : "destructive"}>
                      {latestAnalysis.twitter_card || "No configurado"}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* History Tab */}
            <TabsContent value="history" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Histórico de Análisis</CardTitle>
                  <CardDescription>
                    Evolución del score SEO a lo largo del tiempo
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {analysisHistory.map((analysis) => (
                      <div key={analysis.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <div className="font-medium">
                            {new Date(analysis.analyzed_at).toLocaleString('es-ES')}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {analysis.critical_issues.length} críticos, {analysis.warnings.length} advertencias
                          </div>
                        </div>
                        <div className={`text-3xl font-bold ${getScoreColor(analysis.overall_score)}`}>
                          {analysis.overall_score}%
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default ProjectDetail;
