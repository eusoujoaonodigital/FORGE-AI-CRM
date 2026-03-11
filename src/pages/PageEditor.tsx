import { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { ArrowLeft, Save, Eye, Plus, Trash2, GripVertical, ChevronUp, ChevronDown, EyeOff } from "lucide-react";
import SectionEditor from "@/components/page-builder/SectionEditor";
import SectionPreview from "@/components/page-builder/SectionPreview";
import AddSectionModal from "@/components/page-builder/AddSectionModal";

interface Section {
  id: string;
  section_type: string;
  order: number;
  config: any;
  is_visible: boolean;
}

interface PageData {
  id: string;
  title: string;
  slug: string;
  is_published: boolean;
  meta_title: string | null;
  meta_description: string | null;
  pixel_meta_id: string | null;
  pixel_google_id: string | null;
}

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

  useEffect(() => {
    if (!authLoading && !user) navigate("/auth");
  }, [user, authLoading, navigate]);

  const fetchData = useCallback(async () => {
    if (!pageId) return;
    const [{ data: pageData }, { data: sectionsData }] = await Promise.all([
      supabase.from("landing_pages").select("*").eq("id", pageId).single(),
      supabase.from("landing_page_sections").select("*").eq("page_id", pageId).order("order", { ascending: true }),
    ]);
    if (pageData) setPage(pageData as PageData);
    if (sectionsData) {
      setSections(sectionsData as Section[]);
      if (!selectedSection && sectionsData.length > 0) setSelectedSection(sectionsData[0].id);
    }
  }, [pageId]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleSave = async () => {
    if (!page) return;
    setSaving(true);
    try {
      await supabase.from("landing_pages").update({
        title: page.title, slug: page.slug, is_published: page.is_published,
        meta_title: page.meta_title, meta_description: page.meta_description,
        pixel_meta_id: page.pixel_meta_id, pixel_google_id: page.pixel_google_id,
        updated_at: new Date().toISOString(),
      }).eq("id", page.id);

      for (const section of sections) {
        await supabase.from("landing_page_sections").update({
          config: section.config, order: section.order, is_visible: section.is_visible,
        }).eq("id", section.id);
      }
      toast({ title: "Página salva!" });
    } catch {
      toast({ title: "Erro ao salvar", variant: "destructive" });
    }
    setSaving(false);
  };

  const handleAddSection = async (type: string) => {
    if (!pageId) return;
    const defaultConfigs: Record<string, any> = {
      hero: { headline: "Título Principal", subtitle: "Subtítulo", ctaText: "Comece Agora", ctaUrl: "#", badge: "", bgColor: "#0a0a0f", textColor: "#ffffff", accentColor: "#C8A94E", animation: "fade-in", paddingY: "80", bgGradient: "", headingSize: "48", subtitleSize: "18" },
      benefits: { title: "Por que nos escolher?", subtitle: "", bgColor: "#0a0a0f", textColor: "#ffffff", accentColor: "#C8A94E", animation: "slide-up", paddingY: "60", items: [{ icon: "✅", title: "Benefício 1", description: "Descrição do benefício" }, { icon: "⚡", title: "Benefício 2", description: "Descrição do benefício" }, { icon: "🎯", title: "Benefício 3", description: "Descrição do benefício" }] },
      pricing: { title: "Planos e Preços", subtitle: "", bgColor: "#0d0d12", textColor: "#ffffff", accentColor: "#C8A94E", animation: "scale-in", paddingY: "60", plans: [{ name: "Básico", price: "97", features: ["Feature 1", "Feature 2"], ctaText: "Escolher", ctaUrl: "#", highlight: false }, { name: "Premium", price: "197", features: ["Feature 1", "Feature 2", "Feature 3"], ctaText: "Escolher", ctaUrl: "#", highlight: true }] },
      cta: { headline: "Pronto para começar?", description: "Não perca essa oportunidade.", ctaText: "Quero Começar", ctaUrl: "#", bgColor: "#0a0a0f", textColor: "#ffffff", accentColor: "#C8A94E", animation: "fade-in", paddingY: "60", bgGradient: "" },
      testimonials: { title: "O que dizem nossos clientes", bgColor: "#0a0a0f", textColor: "#ffffff", accentColor: "#C8A94E", animation: "slide-up", paddingY: "60", items: [{ name: "João Silva", role: "CEO", text: "Excelente serviço!", avatar: "" }] },
      faq: { title: "Perguntas Frequentes", bgColor: "#0d0d12", textColor: "#ffffff", accentColor: "#C8A94E", animation: "fade-in", paddingY: "60", items: [{ question: "Pergunta 1?", answer: "Resposta 1" }] },
      features: { title: "Nossos Recursos", bgColor: "#0a0a0f", textColor: "#ffffff", accentColor: "#C8A94E", animation: "slide-up", paddingY: "60", items: [{ icon: "🚀", title: "Recurso 1", description: "Descrição" }] },
      gallery: { title: "Galeria", bgColor: "#0a0a0f", textColor: "#ffffff", paddingY: "60", animation: "fade-in", images: [] },
      contact_form: { title: "Entre em Contato", subtitle: "Preencha o formulário", bgColor: "#0d0d12", textColor: "#ffffff", accentColor: "#C8A94E", animation: "fade-in", paddingY: "60", fields: ["name", "email", "phone"], ctaText: "Enviar" },
      custom_html: { html: "<div style='text-align:center;padding:40px'><h2>Conteúdo Personalizado</h2></div>", bgColor: "#0a0a0f", paddingY: "40" },
    };
    const { data, error } = await supabase.from("landing_page_sections").insert({
      page_id: pageId, section_type: type, order: sections.length,
      config: defaultConfigs[type] || {},
    }).select("*").single();
    if (data) {
      setSections([...sections, data as Section]);
      setSelectedSection(data.id);
    }
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
    const newSections = [...sections];
    const swapIdx = direction === "up" ? idx - 1 : idx + 1;
    [newSections[idx], newSections[swapIdx]] = [newSections[swapIdx], newSections[idx]];
    newSections.forEach((s, i) => s.order = i);
    setSections(newSections);
  };

  const updateSectionConfig = (id: string, config: any) => {
    setSections(sections.map(s => s.id === id ? { ...s, config } : s));
  };

  const toggleVisibility = (id: string) => {
    setSections(sections.map(s => s.id === id ? { ...s, is_visible: !s.is_visible } : s));
  };

  if (!page) return <div className="min-h-screen bg-background flex items-center justify-center"><p className="text-muted-foreground">Carregando...</p></div>;

  const selected = sections.find(s => s.id === selectedSection);

  return (
    <div className="h-screen bg-background flex flex-col">
      {/* Top bar */}
      <header className="h-14 border-b border-border/50 glass-card flex items-center justify-between px-4 shrink-0">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={() => navigate("/dashboard")}><ArrowLeft className="w-4 h-4" /></Button>
          <span className="font-display font-bold text-sm">{page.title}</span>
          <span className={`px-2 py-0.5 rounded-full text-[10px] ${page.is_published ? "bg-green-500/10 text-green-400" : "bg-yellow-500/10 text-yellow-400"}`}>
            {page.is_published ? "Publicada" : "Rascunho"}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={() => setShowSettings(!showSettings)}>⚙️</Button>
          <Button variant="ghost" size="sm" onClick={() => window.open(`/p/${page.slug}`, "_blank")}><Eye className="w-4 h-4" /></Button>
          <Button variant="gold" size="sm" onClick={handleSave} disabled={saving}>
            <Save className="w-4 h-4" /> {saving ? "Salvando..." : "Salvar"}
          </Button>
        </div>
      </header>

      {/* Settings panel */}
      {showSettings && (
        <div className="border-b border-border/50 glass-card p-4">
          <div className="grid sm:grid-cols-3 lg:grid-cols-6 gap-3 max-w-6xl">
            <div>
              <Label className="text-xs">Título</Label>
              <Input value={page.title} onChange={(e) => setPage({ ...page, title: e.target.value })} className="h-8 text-xs bg-secondary/50 border-border/50 mt-1" />
            </div>
            <div>
              <Label className="text-xs">Slug</Label>
              <Input value={page.slug} onChange={(e) => setPage({ ...page, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "") })} className="h-8 text-xs bg-secondary/50 border-border/50 mt-1" />
            </div>
            <div>
              <Label className="text-xs">Meta Title</Label>
              <Input value={page.meta_title || ""} onChange={(e) => setPage({ ...page, meta_title: e.target.value })} className="h-8 text-xs bg-secondary/50 border-border/50 mt-1" />
            </div>
            <div>
              <Label className="text-xs">Pixel Meta</Label>
              <Input value={page.pixel_meta_id || ""} onChange={(e) => setPage({ ...page, pixel_meta_id: e.target.value })} className="h-8 text-xs bg-secondary/50 border-border/50 mt-1" />
            </div>
            <div>
              <Label className="text-xs">Pixel Google</Label>
              <Input value={page.pixel_google_id || ""} onChange={(e) => setPage({ ...page, pixel_google_id: e.target.value })} className="h-8 text-xs bg-secondary/50 border-border/50 mt-1" />
            </div>
            <div className="flex items-end gap-2">
              <div className="flex items-center gap-2">
                <Switch checked={page.is_published} onCheckedChange={(v) => setPage({ ...page, is_published: v })} />
                <Label className="text-xs">Publicada</Label>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-1 overflow-hidden">
        {/* Left panel: section list */}
        <div className="w-56 border-r border-border/50 glass-card flex flex-col shrink-0">
          <div className="p-3 border-b border-border/30 flex items-center justify-between">
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Seções</p>
            <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={() => setShowAddModal(true)}><Plus className="w-3.5 h-3.5" /></Button>
          </div>
          <div className="flex-1 overflow-y-auto p-2 space-y-1">
            {sections.map((s) => (
              <div key={s.id}
                onClick={() => setSelectedSection(s.id)}
                className={`flex items-center gap-2 px-2 py-2 rounded-lg text-xs cursor-pointer transition-colors ${selectedSection === s.id ? "bg-gold/10 text-gold" : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"} ${!s.is_visible ? "opacity-50" : ""}`}>
                <GripVertical className="w-3 h-3 shrink-0" />
                <span className="flex-1 truncate">{sectionLabels[s.section_type] || s.section_type}</span>
                <div className="flex gap-0.5">
                  <button onClick={(e) => { e.stopPropagation(); moveSection(s.id, "up"); }} className="p-0.5 hover:text-gold"><ChevronUp className="w-3 h-3" /></button>
                  <button onClick={(e) => { e.stopPropagation(); moveSection(s.id, "down"); }} className="p-0.5 hover:text-gold"><ChevronDown className="w-3 h-3" /></button>
                  <button onClick={(e) => { e.stopPropagation(); toggleVisibility(s.id); }} className="p-0.5 hover:text-gold">{s.is_visible ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}</button>
                  <button onClick={(e) => { e.stopPropagation(); handleDeleteSection(s.id); }} className="p-0.5 hover:text-destructive"><Trash2 className="w-3 h-3" /></button>
                </div>
              </div>
            ))}
          </div>
          <div className="p-2 border-t border-border/30">
            <Button variant="gold-outline" size="sm" className="w-full h-8 text-xs" onClick={() => setShowAddModal(true)}><Plus className="w-3 h-3" /> Adicionar Seção</Button>
          </div>
        </div>

        {/* Center: Preview */}
        <div className="flex-1 overflow-y-auto bg-[#1a1a2e]/50">
          <SectionPreview sections={sections.filter(s => s.is_visible)} selectedId={selectedSection} onSelect={setSelectedSection} />
        </div>

        {/* Right panel: Editor */}
        <div className="w-80 border-l border-border/50 glass-card overflow-y-auto shrink-0">
          {selected ? (
            <SectionEditor section={selected} onChange={(config) => updateSectionConfig(selected.id, config)} />
          ) : (
            <div className="p-6 text-center text-muted-foreground text-sm">Selecione uma seção para editar</div>
          )}
        </div>
      </div>

      {showAddModal && <AddSectionModal onAdd={handleAddSection} onClose={() => setShowAddModal(false)} />}
    </div>
  );
};

export default PageEditor;
