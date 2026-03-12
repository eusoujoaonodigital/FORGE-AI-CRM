import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Plus, Globe, Pencil, Copy, Trash2, ExternalLink, BarChart3, X } from "lucide-react";
import PageAnalytics from "@/components/dashboard/PageAnalytics";

interface LandingPage {
  id: string; slug: string; title: string; is_published: boolean;
  meta_title: string | null; meta_description: string | null;
  pixel_meta_id: string | null; pixel_google_id: string | null;
  created_at: string; _viewCount?: number;
}

const LandingPagesList = () => {
  const [pages, setPages] = useState<LandingPage[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState<string | null>(null);
  const [form, setForm] = useState({ title: "", slug: "", meta_title: "", meta_description: "", pixel_meta_id: "", pixel_google_id: "" });
  const { toast } = useToast();
  const navigate = useNavigate();

  const fetchPages = async () => {
    const { data } = await supabase.from("landing_pages").select("*").order("created_at", { ascending: false });
    if (!data) return;
    const { data: views } = await supabase.from("page_views").select("page_id");
    const viewMap: Record<string, number> = {};
    (views || []).forEach((v: any) => { viewMap[v.page_id] = (viewMap[v.page_id] || 0) + 1; });
    setPages(data.map((p: any) => ({ ...p, _viewCount: viewMap[p.id] || 0 })));
  };

  useEffect(() => { fetchPages(); }, []);

  const handleCreate = async () => {
    if (!form.title || !form.slug) { toast({ title: "Preencha título e slug", variant: "destructive" }); return; }
    const { data, error } = await supabase.from("landing_pages").insert({
      title: form.title, slug: form.slug, meta_title: form.meta_title || null, meta_description: form.meta_description || null,
      pixel_meta_id: form.pixel_meta_id || null, pixel_google_id: form.pixel_google_id || null, is_published: false,
    }).select("id").single();
    if (error) { toast({ title: error.message, variant: "destructive" }); return; }
    await supabase.from("landing_page_sections").insert({
      page_id: data.id, section_type: "hero", order: 0,
      config: { headline: "Título Principal", subtitle: "Subtítulo da sua landing page", ctaText: "Comece Agora", ctaUrl: "#", badge: "🔥 Oferta Especial", bgColor: "#000000", textColor: "#ffffff", accentColor: "#84CC16", animation: "fade-in", paddingY: "80", bgPattern: "none" },
    });
    toast({ title: "Landing Page criada!" });
    setShowForm(false);
    setForm({ title: "", slug: "", meta_title: "", meta_description: "", pixel_meta_id: "", pixel_google_id: "" });
    navigate(`/editor/${data.id}`);
  };

  const handleDuplicate = async (page: LandingPage) => {
    const newSlug = `${page.slug}-copy-${Date.now().toString(36)}`;
    const { data, error } = await supabase.from("landing_pages").insert({
      title: `${page.title} (Cópia)`, slug: newSlug, is_published: false,
      meta_title: page.meta_title, meta_description: page.meta_description, pixel_meta_id: page.pixel_meta_id, pixel_google_id: page.pixel_google_id,
    }).select("id").single();
    if (error) { toast({ title: error.message, variant: "destructive" }); return; }
    const { data: sections } = await supabase.from("landing_page_sections").select("*").eq("page_id", page.id);
    if (sections && sections.length > 0) {
      await supabase.from("landing_page_sections").insert(sections.map((s: any) => ({ page_id: data.id, section_type: s.section_type, order: s.order, config: s.config, is_visible: s.is_visible })));
    }
    toast({ title: "Página duplicada!" });
    fetchPages();
  };

  const handleDelete = async (id: string) => {
    await supabase.from("landing_pages").delete().eq("id", id);
    toast({ title: "Página excluída" });
    fetchPages();
  };

  const handleTogglePublish = async (id: string, current: boolean) => {
    await supabase.from("landing_pages").update({ is_published: !current }).eq("id", id);
    fetchPages();
  };

  if (showAnalytics) {
    return (
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold tracking-tighter">Analytics da <span className="text-gradient-lime">Página</span></h2>
          <Button variant="ghost" onClick={() => setShowAnalytics(null)}><X className="w-4 h-4" /> Voltar</Button>
        </div>
        <PageAnalytics pageId={showAnalytics} />
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold tracking-tighter">Landing <span className="text-gradient-lime">Pages</span></h2>
        <Button variant="lime" size="sm" onClick={() => setShowForm(!showForm)}>
          {showForm ? <><X className="w-4 h-4" /> Cancelar</> : <><Plus className="w-4 h-4" /> Nova Página</>}
        </Button>
      </div>

      {showForm && (
        <div className="surface-card-lime rounded-lg p-5 mb-6 space-y-4">
          <h3 className="font-bold text-sm">Nova Landing Page</h3>
          <div className="grid sm:grid-cols-2 gap-3">
            <div><Label>Título</Label><Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Minha Landing Page" className="mt-1 bg-secondary/50 border-border" /></div>
            <div><Label>Slug (URL)</Label><Input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "") })} placeholder="minha-pagina" className="mt-1 bg-secondary/50 border-border" /><p className="text-xs text-muted-foreground mt-1">/p/{form.slug || "..."}</p></div>
            <div><Label>Meta Title (SEO)</Label><Input value={form.meta_title} onChange={(e) => setForm({ ...form, meta_title: e.target.value })} className="mt-1 bg-secondary/50 border-border" /></div>
            <div><Label>Meta Description</Label><Input value={form.meta_description} onChange={(e) => setForm({ ...form, meta_description: e.target.value })} className="mt-1 bg-secondary/50 border-border" /></div>
            <div><Label>Pixel Meta (ID)</Label><Input value={form.pixel_meta_id} onChange={(e) => setForm({ ...form, pixel_meta_id: e.target.value })} className="mt-1 bg-secondary/50 border-border" /></div>
            <div><Label>Pixel Google (ID)</Label><Input value={form.pixel_google_id} onChange={(e) => setForm({ ...form, pixel_google_id: e.target.value })} className="mt-1 bg-secondary/50 border-border" /></div>
          </div>
          <Button variant="lime" onClick={handleCreate}>Criar e Editar</Button>
        </div>
      )}

      {pages.length === 0 ? (
        <div className="surface-card rounded-lg p-12 text-center">
          <Globe className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
          <p className="text-muted-foreground text-sm">Nenhuma landing page</p>
          <Button variant="lime-outline" size="sm" className="mt-4" onClick={() => setShowForm(true)}><Plus className="w-4 h-4" /> Criar primeira</Button>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {pages.map((page) => (
            <div key={page.id} className="surface-card rounded-lg p-5 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-sm truncate">{page.title}</h3>
                <Switch checked={page.is_published} onCheckedChange={() => handleTogglePublish(page.id, page.is_published)} />
              </div>
              <p className="text-xs text-muted-foreground font-mono">/p/{page.slug}</p>
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <span className={page.is_published ? "text-lime" : "text-yellow-400"}>{page.is_published ? "Live" : "Draft"}</span>
                <span>{page._viewCount} views</span>
              </div>
              <div className="flex gap-1 pt-2 border-t border-border">
                <Button variant="ghost" size="sm" className="h-7 text-xs flex-1" onClick={() => navigate(`/editor/${page.id}`)}><Pencil className="w-3 h-3" /> Editar</Button>
                <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={() => window.open(`/p/${page.slug}`, "_blank")}><ExternalLink className="w-3 h-3" /></Button>
                <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={() => setShowAnalytics(page.id)}><BarChart3 className="w-3 h-3" /></Button>
                <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={() => handleDuplicate(page)}><Copy className="w-3 h-3" /></Button>
                <Button variant="ghost" size="sm" className="h-7 text-xs text-destructive" onClick={() => handleDelete(page.id)}><Trash2 className="w-3 h-3" /></Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default LandingPagesList;
