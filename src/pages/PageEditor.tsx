import { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { ArrowLeft, Save, Eye, Plus, Trash2, GripVertical, ChevronUp, ChevronDown, EyeOff, Settings } from "lucide-react";
import SectionEditor from "@/components/page-builder/SectionEditor";
import SectionPreview from "@/components/page-builder/SectionPreview";
import AddSectionModal from "@/components/page-builder/AddSectionModal";

interface Section { id: string; section_type: string; order: number; config: any; is_visible: boolean; }
interface PageData { id: string; title: string; slug: string; is_published: boolean; meta_title: string | null; meta_description: string | null; pixel_meta_id: string | null; pixel_google_id: string | null; }

const sectionLabels: Record<string, string> = {
  hero: "Hero", benefits: "Benefícios", pricing: "Preços", cta: "CTA",
  testimonials: "Depoimentos", faq: "FAQ", features: "Features",
  gallery: "Galeria", contact_form: "Formulário", custom_html: "HTML Livre",
};

const PageEditor = () => {
  const { pageId } = useParams();
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { toast } = useToast();
  const [page, setPage] = useState<PageData | null>(null);
  const [sections, setSections] = useState<Section[]>([]);
  const [selectedSection, setSelectedSection] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => { if (!authLoading && !user) navigate("/auth"); }, [user, authLoading, navigate]);

  const fetchData = useCallback(async () => {
    if (!pageId) return;
    const [{ data: pageData }, { data: sectionsData }] = await Promise.all([
      supabase.from("landing_pages").select("*").eq("id", pageId).single(),
      supabase.from("landing_page_sections").select("*").eq("page_id", pageId).order("order", { ascending: true }),
    ]);
    if (pageData) setPage(pageData as PageData);
    if (sectionsData) { setSections(sectionsData as Section[]); if (!selectedSection && sectionsData.length > 0) setSelectedSection(sectionsData[0].id); }
  }, [pageId]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleSave = async () => {
    if (!page) return; setSaving(true);
    try {
      await supabase.from("landing_pages").update({ title: page.title, slug: page.slug, is_published: page.is_published, meta_title: page.meta_title, meta_description: page.meta_description, pixel_meta_id: page.pixel_meta_id, pixel_google_id: page.pixel_google_id, updated_at: new Date().toISOString() }).eq("id", page.id);
      for (const section of sections) await supabase.from("landing_page_sections").update({ config: section.config, order: section.order, is_visible: section.is_visible }).eq("id", section.id);
      toast({ title: "Página salva!" });
    } catch { toast({ title: "Erro ao salvar", variant: "destructive" }); }
    setSaving(false);
  };

  const handleAddSection = async (type: string) => {
    if (!pageId) return;
    const defaultConfigs: Record<string, any> = {
      hero: { headline: "Título Principal", subtitle: "Subtítulo", ctaText: "Comece Agora", ctaUrl: "#", ctaAction: "link", badge: "", bgColor: "#000000", textColor: "#ffffff", accentColor: "#84CC16", animation: "fade-in", paddingY: "80", bgGradient: "", bgPattern: "none", headingSize: "48", subtitleSize: "18", headingWeight: "800", fontFamily: "Inter", gradientText: false },
      benefits: { title: "Por que nos escolher?", subtitle: "", bgColor: "#000000", textColor: "#ffffff", accentColor: "#84CC16", animation: "slide-up", paddingY: "60", bgPattern: "none", items: [{ icon: "✅", title: "Benefício 1", description: "Descrição do benefício" }, { icon: "⚡", title: "Benefício 2", description: "Descrição do benefício" }, { icon: "🎯", title: "Benefício 3", description: "Descrição do benefício" }] },
      pricing: { title: "Planos e Preços", subtitle: "", bgColor: "#0A0A0A", textColor: "#ffffff", accentColor: "#84CC16", animation: "scale-in", paddingY: "60", bgPattern: "none", plans: [{ name: "Básico", price: "97", features: ["Feature 1", "Feature 2"], ctaText: "Escolher", ctaUrl: "#", highlight: false }, { name: "Premium", price: "197", features: ["Feature 1", "Feature 2", "Feature 3"], ctaText: "Escolher", ctaUrl: "#", highlight: true }] },
      cta: { headline: "Pronto para começar?", description: "Não perca essa oportunidade.", ctaText: "Quero Começar", ctaUrl: "#", ctaAction: "link", bgColor: "#000000", textColor: "#ffffff", accentColor: "#84CC16", animation: "fade-in", paddingY: "60", bgGradient: "", bgPattern: "none" },
      testimonials: { title: "O que dizem nossos clientes", bgColor: "#000000", textColor: "#ffffff", accentColor: "#84CC16", animation: "slide-up", paddingY: "60", bgPattern: "none", items: [{ name: "João Silva", role: "CEO", text: "Excelente!", avatar: "" }] },
      faq: { title: "Perguntas Frequentes", bgColor: "#0A0A0A", textColor: "#ffffff", accentColor: "#84CC16", animation: "fade-in", paddingY: "60", bgPattern: "none", items: [{ question: "Pergunta 1?", answer: "Resposta 1" }] },
      features: { title: "Nossos Recursos", bgColor: "#000000", textColor: "#ffffff", accentColor: "#84CC16", animation: "slide-up", paddingY: "60", bgPattern: "none", items: [{ icon: "🚀", title: "Recurso 1", description: "Descrição" }] },
      gallery: { title: "Galeria", bgColor: "#000000", textColor: "#ffffff", paddingY: "60", animation: "fade-in", bgPattern: "none", images: [] },
      contact_form: { title: "Entre em Contato", subtitle: "Preencha o formulário", bgColor: "#0A0A0A", textColor: "#ffffff", accentColor: "#84CC16", animation: "fade-in", paddingY: "60", bgPattern: "none", fields: ["name", "email", "phone"], ctaText: "Enviar" },
      custom_html: { html: "<div style='text-align:center;padding:40px'><h2>Conteúdo</h2></div>", bgColor: "#000000", paddingY: "40", bgPattern: "none" },
    };
    const { data } = await supabase.from("landing_page_sections").insert({ page_id: pageId, section_type: type, order: sections.length, config: defaultConfigs[type] || {} }).select("*").single();
    if (data) { setSections([...sections, data as Section]); setSelectedSection(data.id); }
    setShowAddModal(false);
  };

  const handleDeleteSection = async (id: string) => {
    await supabase.from("landing_page_sections").delete().eq("id", id);
    setSections(sections.filter(s => s.id !== id));
    if (selectedSection === id) setSelectedSection(sections[0]?.id || null);
  };

  const moveSection = (id: string, direction: "up" | "down") => {
    const idx = sections.findIndex(s => s.id === id);
    if ((direction === "up" && idx === 0) || (direction === "down" && idx === sections.length - 1)) return;
    const ns = [...sections]; const si = direction === "up" ? idx - 1 : idx + 1;
    [ns[idx], ns[si]] = [ns[si], ns[idx]]; ns.forEach((s, i) => s.order = i); setSections(ns);
  };

  const updateSectionConfig = (id: string, config: any) => setSections(sections.map(s => s.id === id ? { ...s, config } : s));
  const toggleVisibility = (id: string) => setSections(sections.map(s => s.id === id ? { ...s, is_visible: !s.is_visible } : s));

  if (!page) return <div className="min-h-screen bg-background flex items-center justify-center"><p className="text-muted-foreground text-sm">Carregando...</p></div>;

  const selected = sections.find(s => s.id === selectedSection);

  return (
    <div className="h-screen bg-background flex flex-col">
      <header className="h-12 border-b border-border bg-card flex items-center justify-between px-4 shrink-0">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={() => navigate("/dashboard")}><ArrowLeft className="w-4 h-4" /></Button>
          <span className="font-semibold text-sm tracking-tight">{page.title}</span>
          <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${page.is_published ? "bg-lime/10 text-lime" : "bg-yellow-500/10 text-yellow-400"}`}>
            {page.is_published ? "Live" : "Draft"}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={() => setShowSettings(!showSettings)}><Settings className="w-4 h-4" /></Button>
          <Button variant="ghost" size="sm" onClick={() => window.open(`/p/${page.slug}`, "_blank")}><Eye className="w-4 h-4" /></Button>
          <Button variant="lime" size="sm" onClick={handleSave} disabled={saving}>
            <Save className="w-4 h-4" /> {saving ? "..." : "Salvar"}
          </Button>
        </div>
      </header>

      {showSettings && (
        <div className="border-b border-border bg-card p-4">
          <div className="grid sm:grid-cols-3 lg:grid-cols-6 gap-3 max-w-6xl">
            <div><Label className="text-xs">Título</Label><Input value={page.title} onChange={(e) => setPage({ ...page, title: e.target.value })} className="h-8 text-xs bg-secondary border-border mt-1" /></div>
            <div><Label className="text-xs">Slug</Label><Input value={page.slug} onChange={(e) => setPage({ ...page, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "") })} className="h-8 text-xs bg-secondary border-border mt-1" /></div>
            <div><Label className="text-xs">Meta Title</Label><Input value={page.meta_title || ""} onChange={(e) => setPage({ ...page, meta_title: e.target.value })} className="h-8 text-xs bg-secondary border-border mt-1" /></div>
            <div><Label className="text-xs">Pixel Meta</Label><Input value={page.pixel_meta_id || ""} onChange={(e) => setPage({ ...page, pixel_meta_id: e.target.value })} className="h-8 text-xs bg-secondary border-border mt-1" /></div>
            <div><Label className="text-xs">Pixel Google</Label><Input value={page.pixel_google_id || ""} onChange={(e) => setPage({ ...page, pixel_google_id: e.target.value })} className="h-8 text-xs bg-secondary border-border mt-1" /></div>
            <div className="flex items-end gap-2"><Switch checked={page.is_published} onCheckedChange={(v) => setPage({ ...page, is_published: v })} /><Label className="text-xs">Publicar</Label></div>
          </div>
        </div>
      )}

      <div className="flex flex-1 overflow-hidden">
        <div className="w-52 border-r border-border bg-card flex flex-col shrink-0">
          <div className="p-3 border-b border-border flex items-center justify-between">
            <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-medium">Seções</p>
            <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={() => setShowAddModal(true)}><Plus className="w-3.5 h-3.5" /></Button>
          </div>
          <div className="flex-1 overflow-y-auto p-2 space-y-0.5">
            {sections.map((s) => (
              <div key={s.id} onClick={() => setSelectedSection(s.id)}
                className={`flex items-center gap-1.5 px-2 py-2 rounded-lg text-xs cursor-pointer transition-colors ${selectedSection === s.id ? "bg-secondary text-foreground font-medium" : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"} ${!s.is_visible ? "opacity-40" : ""}`}>
                <GripVertical className="w-3 h-3 shrink-0" />
                <span className="flex-1 truncate">{sectionLabels[s.section_type] || s.section_type}</span>
                <div className="flex gap-0.5 shrink-0">
                  <button onClick={(e) => { e.stopPropagation(); moveSection(s.id, "up"); }} className="p-0.5 hover:text-lime"><ChevronUp className="w-3 h-3" /></button>
                  <button onClick={(e) => { e.stopPropagation(); moveSection(s.id, "down"); }} className="p-0.5 hover:text-lime"><ChevronDown className="w-3 h-3" /></button>
                  <button onClick={(e) => { e.stopPropagation(); toggleVisibility(s.id); }} className="p-0.5 hover:text-lime">{s.is_visible ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}</button>
                  <button onClick={(e) => { e.stopPropagation(); handleDeleteSection(s.id); }} className="p-0.5 hover:text-destructive"><Trash2 className="w-3 h-3" /></button>
                </div>
              </div>
            ))}
          </div>
          <div className="p-2 border-t border-border">
            <Button variant="lime-outline" size="sm" className="w-full h-8 text-xs" onClick={() => setShowAddModal(true)}><Plus className="w-3 h-3" /> Adicionar</Button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto bg-secondary/20">
          <SectionPreview sections={sections.filter(s => s.is_visible)} selectedId={selectedSection} onSelect={setSelectedSection} />
        </div>

        <div className="w-80 border-l border-border bg-card overflow-y-auto shrink-0">
          {selected ? (
            <SectionEditor section={selected} onChange={(config) => updateSectionConfig(selected.id, config)} />
          ) : (
            <div className="p-6 text-center text-muted-foreground text-sm">Selecione uma seção</div>
          )}
        </div>
      </div>

      {showAddModal && <AddSectionModal onAdd={handleAddSection} onClose={() => setShowAddModal(false)} />}
    </div>
  );
};

export default PageEditor;
