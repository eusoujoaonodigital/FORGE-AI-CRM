import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Save, Eye, Palette, Type, Layout, Calendar } from "lucide-react";

interface BookingConfig {
  // Branding
  brandName: string;
  logoUrl: string;
  tagline: string;
  description: string;
  // Colors
  bgColor: string;
  cardBgColor: string;
  textColor: string;
  accentColor: string;
  accentTextColor: string;
  // Typography
  fontFamily: string;
  headingSize: string;
  // Layout
  showAmenities: boolean;
  showCapacity: boolean;
  showPriceComparison: boolean;
  showGuestForm: boolean;
  // Custom fields
  customFieldLabel1: string;
  customFieldLabel2: string;
  customFieldEnabled1: boolean;
  customFieldEnabled2: boolean;
  // CTA
  ctaText: string;
  successMessage: string;
  // Background
  bgPattern: string;
  bgGradient: string;
}

const defaultConfig: BookingConfig = {
  brandName: "Forge AI",
  logoUrl: "",
  tagline: "Reserve seu espaço",
  description: "Agende online e pague até 25% menos.",
  bgColor: "#000000",
  cardBgColor: "#0A0A0A",
  textColor: "#ffffff",
  accentColor: "#84CC16",
  accentTextColor: "#000000",
  fontFamily: "Inter",
  headingSize: "36",
  showAmenities: true,
  showCapacity: true,
  showPriceComparison: true,
  showGuestForm: true,
  customFieldLabel1: "",
  customFieldLabel2: "",
  customFieldEnabled1: false,
  customFieldEnabled2: false,
  ctaText: "Confirmar Reserva",
  successMessage: "Reserva confirmada com sucesso!",
  bgPattern: "none",
  bgGradient: "",
};

const BOOKING_PAGE_SLUG = "_booking_config";

const bgPatterns = [
  { value: "none", label: "Nenhum" },
  { value: "dots", label: "Dots Grid" },
  { value: "squares", label: "Square Grid" },
  { value: "noise", label: "Noise" },
];

const BookingPageEditor = () => {
  const [config, setConfig] = useState<BookingConfig>(defaultConfig);
  const [saving, setSaving] = useState(false);
  const [pageId, setPageId] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    loadConfig();
  }, []);

  const loadConfig = async () => {
    const { data } = await supabase.from("landing_pages").select("id, custom_css").eq("slug", BOOKING_PAGE_SLUG).single();
    if (data) {
      setPageId(data.id);
      try {
        const parsed = JSON.parse(data.custom_css || "{}");
        setConfig({ ...defaultConfig, ...parsed });
      } catch { /* use defaults */ }
    }
  };

  const handleSave = async () => {
    setSaving(true);
    const configJson = JSON.stringify(config);
    if (pageId) {
      await supabase.from("landing_pages").update({ custom_css: configJson, updated_at: new Date().toISOString() }).eq("id", pageId);
    } else {
      const { data } = await supabase.from("landing_pages").insert({
        title: "Booking Config", slug: BOOKING_PAGE_SLUG, is_published: false, custom_css: configJson,
      }).select("id").single();
      if (data) setPageId(data.id);
    }
    toast({ title: "Configurações salvas!" });
    setSaving(false);
  };

  const set = (key: keyof BookingConfig, value: any) => setConfig({ ...config, [key]: value });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold tracking-tighter">Página de <span className="text-gradient-lime">Reservas</span></h2>
        <div className="flex gap-2">
          <Button variant="ghost" size="sm" onClick={() => window.open("/agendar", "_blank")}><Eye className="w-4 h-4" /> Preview</Button>
          <Button variant="lime" size="sm" onClick={handleSave} disabled={saving}><Save className="w-4 h-4" /> {saving ? "..." : "Salvar"}</Button>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Branding */}
        <div className="surface-card rounded-lg p-5 space-y-4">
          <h3 className="font-semibold text-sm flex items-center gap-2"><Type className="w-4 h-4 text-lime" /> Branding & Textos</h3>
          <div><Label className="text-xs">Nome da Marca</Label><Input value={config.brandName} onChange={e => set("brandName", e.target.value)} className="mt-1 h-9 text-sm bg-secondary border-border" /></div>
          <div><Label className="text-xs">Logo URL</Label><Input value={config.logoUrl} onChange={e => set("logoUrl", e.target.value)} placeholder="https://..." className="mt-1 h-9 text-sm bg-secondary border-border" /></div>
          <div><Label className="text-xs">Tagline (título da página)</Label><Input value={config.tagline} onChange={e => set("tagline", e.target.value)} className="mt-1 h-9 text-sm bg-secondary border-border" /></div>
          <div><Label className="text-xs">Descrição</Label><Textarea value={config.description} onChange={e => set("description", e.target.value)} className="mt-1 text-sm bg-secondary border-border" rows={2} /></div>
          <div><Label className="text-xs">Texto do botão CTA</Label><Input value={config.ctaText} onChange={e => set("ctaText", e.target.value)} className="mt-1 h-9 text-sm bg-secondary border-border" /></div>
          <div><Label className="text-xs">Mensagem de sucesso</Label><Input value={config.successMessage} onChange={e => set("successMessage", e.target.value)} className="mt-1 h-9 text-sm bg-secondary border-border" /></div>
        </div>

        {/* Colors */}
        <div className="surface-card rounded-lg p-5 space-y-4">
          <h3 className="font-semibold text-sm flex items-center gap-2"><Palette className="w-4 h-4 text-lime" /> Cores & Visual</h3>
          <div className="grid grid-cols-2 gap-3">
            {[
              { key: "bgColor" as const, label: "Fundo" },
              { key: "cardBgColor" as const, label: "Cards" },
              { key: "textColor" as const, label: "Texto" },
              { key: "accentColor" as const, label: "Destaque" },
            ].map(c2 => (
              <div key={c2.key}>
                <Label className="text-xs">{c2.label}</Label>
                <div className="flex gap-1 mt-1">
                  <input type="color" value={config[c2.key]} onChange={e => set(c2.key, e.target.value)} className="w-8 h-8 rounded cursor-pointer border-0 bg-transparent" />
                  <Input value={config[c2.key]} onChange={e => set(c2.key, e.target.value)} className="h-8 text-xs bg-secondary border-border flex-1" />
                </div>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-xs">Padrão de fundo</Label>
              <select value={config.bgPattern} onChange={e => set("bgPattern", e.target.value)} className="w-full h-8 text-xs bg-secondary border border-border rounded-lg px-2 mt-1">
                {bgPatterns.map(p => <option key={p.value} value={p.value}>{p.label}</option>)}
              </select>
            </div>
            <div>
              <Label className="text-xs">Tamanho título (px)</Label>
              <Input type="number" value={config.headingSize} onChange={e => set("headingSize", e.target.value)} className="h-8 text-xs bg-secondary border-border mt-1" />
            </div>
          </div>
          <div>
            <Label className="text-xs">Gradiente (CSS)</Label>
            <Input value={config.bgGradient} onChange={e => set("bgGradient", e.target.value)} placeholder="linear-gradient(...)" className="h-8 text-xs bg-secondary border-border mt-1" />
          </div>
        </div>

        {/* Layout */}
        <div className="surface-card rounded-lg p-5 space-y-4">
          <h3 className="font-semibold text-sm flex items-center gap-2"><Layout className="w-4 h-4 text-lime" /> Layout & Campos</h3>
          <div className="space-y-3">
            {[
              { key: "showAmenities" as const, label: "Mostrar amenidades das salas" },
              { key: "showCapacity" as const, label: "Mostrar capacidade" },
              { key: "showPriceComparison" as const, label: "Mostrar comparação online vs balcão" },
              { key: "showGuestForm" as const, label: "Formulário para visitantes" },
            ].map(item => (
              <label key={item.key} className="flex items-center justify-between text-sm">
                <span>{item.label}</span>
                <Switch checked={config[item.key]} onCheckedChange={v => set(item.key, v)} />
              </label>
            ))}
          </div>
        </div>

        {/* Custom Fields */}
        <div className="surface-card rounded-lg p-5 space-y-4">
          <h3 className="font-semibold text-sm flex items-center gap-2"><Calendar className="w-4 h-4 text-lime" /> Campos Customizados</h3>
          <p className="text-xs text-muted-foreground">Adicione campos extras no formulário de reserva.</p>
          {[1, 2].map(n => (
            <div key={n} className="flex items-center gap-3">
              <Switch checked={config[`customFieldEnabled${n}` as keyof BookingConfig] as boolean} onCheckedChange={v => set(`customFieldEnabled${n}` as keyof BookingConfig, v)} />
              <Input value={config[`customFieldLabel${n}` as keyof BookingConfig] as string} onChange={e => set(`customFieldLabel${n}` as keyof BookingConfig, e.target.value)} placeholder={`Label do campo ${n}`} className="h-8 text-xs bg-secondary border-border flex-1" disabled={!config[`customFieldEnabled${n}` as keyof BookingConfig]} />
            </div>
          ))}
        </div>
      </div>

      {/* Preview card */}
      <div className="mt-6 surface-card-lime rounded-lg p-5">
        <h3 className="font-semibold text-sm mb-3">Preview do Estilo</h3>
        <div className="rounded-lg p-8 text-center" style={{ background: config.bgGradient || config.bgColor, color: config.textColor }}>
          {config.logoUrl && <img src={config.logoUrl} alt="Logo" className="h-8 mx-auto mb-4" />}
          <h2 style={{ fontSize: `${config.headingSize}px`, fontFamily: config.fontFamily }} className="font-bold tracking-tighter mb-2">{config.tagline}</h2>
          <p className="opacity-70 text-sm mb-4">{config.description}</p>
          <div className="inline-flex px-6 py-2.5 rounded-lg font-semibold text-sm" style={{ backgroundColor: config.accentColor, color: config.accentTextColor }}>{config.ctaText}</div>
        </div>
      </div>
    </div>
  );
};

export default BookingPageEditor;
export { BOOKING_PAGE_SLUG, defaultConfig };
export type { BookingConfig };
