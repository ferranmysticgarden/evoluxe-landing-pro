import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { normalizeAndValidateUrl } from "@/lib/urlValidation";
import { Plus, ExternalLink, Trash2, RefreshCw, BarChart3, Clock } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

interface Project {
  id: string;
  name: string;
  url: string;
  created_at: string;
  last_analyzed_at: string | null;
  status: string;
}

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, subscriptionData } = useAuth();
  const { toast } = useToast();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newProjectName, setNewProjectName] = useState("");
  const [newProjectUrl, setNewProjectUrl] = useState("");
  const [isAdding, setIsAdding] = useState(false);

  // Get project limit based on subscription
  const getProjectLimit = () => {
    if (!subscriptionData?.subscribed) return 0;
    if (subscriptionData.product_id === "prod_TH9wmvuriJwECc") return 10; // Starter
    return 999; // Pro and Enterprise = unlimited
  };

  const projectLimit = getProjectLimit();
  const canAddMore = projects.length < projectLimit;

  useEffect(() => {
    if (!user) {
      navigate("/auth");
      return;
    }
    loadProjects();
  }, [user, navigate]);

  const loadProjects = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('status', 'active')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProjects(data || []);
    } catch (error) {
      console.error('Error loading projects:', error);
      toast({
        title: "Error",
        description: "No se pudieron cargar los proyectos",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddProject = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!canAddMore) {
      toast({
        title: "Límite alcanzado",
        description: `Tu plan permite máximo ${projectLimit} proyectos. Actualiza para añadir más.`,
        variant: "destructive",
      });
      return;
    }

    setIsAdding(true);
    try {
      const { normalizedUrl } = normalizeAndValidateUrl(newProjectUrl);

      const { error } = await supabase
        .from('projects')
        .insert({
          user_id: user!.id,
          name: newProjectName.trim(),
          url: normalizedUrl,
        });

      if (error) throw error;

      toast({
        title: "Proyecto añadido",
        description: "Tu proyecto se ha creado correctamente",
      });

      setIsAddDialogOpen(false);
      setNewProjectName("");
      setNewProjectUrl("");
      loadProjects();
    } catch (error) {
      console.error('Error adding project:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "No se pudo añadir el proyecto",
        variant: "destructive",
      });
    } finally {
      setIsAdding(false);
    }
  };


  const handleDeleteProject = async (projectId: string, projectName: string) => {
    if (!confirm(`¿Eliminar proyecto "${projectName}"?`)) return;

    try {
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', projectId);

      if (error) throw error;

      toast({
        title: "Proyecto eliminado",
        description: "El proyecto se ha eliminado correctamente",
      });

      loadProjects();
    } catch (error) {
      console.error('Error deleting project:', error);
      toast({
        title: "Error",
        description: "No se pudo eliminar el proyecto",
        variant: "destructive",
      });
    }
  };

  const handleAnalyzeProject = async (projectId: string) => {
    navigate(`/project/${projectId}`);
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

  if (!subscriptionData?.subscribed) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-20">
          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle>Suscripción Requerida</CardTitle>
              <CardDescription>
                Necesitas una suscripción activa para acceder al dashboard
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={() => navigate("/#pricing")}>
                Ver Planes
              </Button>
            </CardContent>
          </Card>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Mis Proyectos</h1>
            <p className="text-muted-foreground">
              {projects.length} / {projectLimit === 999 ? '∞' : projectLimit} proyectos
            </p>
          </div>
          
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button disabled={!canAddMore}>
                <Plus className="h-4 w-4 mr-2" />
                Nuevo Proyecto
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Añadir Proyecto</DialogTitle>
                <DialogDescription>
                  Añade un nuevo sitio web para monitorizar su SEO
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleAddProject} className="space-y-4">
                <div>
                  <Label htmlFor="name">Nombre del Proyecto</Label>
                  <Input
                    id="name"
                    placeholder="Mi Sitio Web"
                    value={newProjectName}
                    onChange={(e) => setNewProjectName(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="url">URL</Label>
                  <Input
                    id="url"
                    type="text"
                    placeholder="example.com"
                    value={newProjectUrl}
                    onChange={(e) => setNewProjectUrl(e.target.value)}
                    required
                  />
                </div>
                <Button type="submit" disabled={isAdding} className="w-full">
                  {isAdding ? "Añadiendo..." : "Añadir Proyecto"}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Projects Grid */}
        {projects.length === 0 ? (
          <Card>
            <CardContent className="py-16 text-center">
              <BarChart3 className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-xl font-semibold mb-2">No tienes proyectos</h3>
              <p className="text-muted-foreground mb-4">
                Añade tu primer sitio web para comenzar a monitorizar su SEO
              </p>
              <Button onClick={() => setIsAddDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Añadir Primer Proyecto
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => (
              <Card key={project.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <CardTitle className="text-lg">{project.name}</CardTitle>
                      <CardDescription className="flex items-center gap-1 mt-1">
                        <ExternalLink className="h-3 w-3" />
                        {project.url.replace(/^https?:\/\//, '')}
                      </CardDescription>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteProject(project.id, project.name)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  {project.last_analyzed_at ? (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      Último análisis: {new Date(project.last_analyzed_at).toLocaleDateString('es-ES')}
                    </div>
                  ) : (
                    <div className="text-sm text-muted-foreground">
                      Sin análisis aún
                    </div>
                  )}
                  
                  <div className="flex gap-2">
                    <Button
                      className="flex-1"
                      onClick={() => handleAnalyzeProject(project.id)}
                    >
                      <BarChart3 className="h-4 w-4 mr-2" />
                      Ver Análisis
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Dashboard;
