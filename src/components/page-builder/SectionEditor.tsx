import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";

interface Props {
  section: { id: string; section_type: string; config: any };
  onChange: (config: any) => void;
}

const animations = [
  { value: "none", label: "Nenhuma" },
  { value: "fade-in", label: "Fade In" },
  { value: "slide-up", label: "Slide Up" },
  { value: "slide-left", label: "Slide Left" },
  { value: "scale-in", label: "Scale In" },
];

const SectionEditor = ({ section, onChange }: Props) => {
  const c = section.config;
  const set = (key: string, value: any) => onChange({ ...c, [key]: value });

  const renderCommonFields = () => (
    <div className="space-y-3 border-t border-border/30 pt-3 mt-3">
      <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">Estilo</p>
      <div className="grid grid-cols-2 gap-2">
        <div>
          <Label className="text-xs">Cor de fundo</Label>
          <div className="flex gap-1 mt-1">
            <input type="color" value={c.bgColor || "#0a0a0f"} onChange={(e) => set("bgColor", e.target.value)} className="w-8 h-8 rounded cursor-pointer border-0" />
            <Input value={c.bgColor || ""} onChange={(e) => set("bgColor", e.target.value)} className="h-8 text-xs bg-secondary/50 border-border/50 flex-1" />
          </div>
        </div>
        <div>
          <Label className="text-xs">Cor do texto</Label>
          <div className="flex gap-1 mt-1">
            <input type="color" value={c.textColor || "#ffffff"} onChange={(e) => set("textColor", e.target.value)} className="w-8 h-8 rounded cursor-pointer border-0" />
            <Input value={c.textColor || ""} onChange={(e) => set("textColor", e.target.value)} className="h-8 text-xs bg-secondary/50 border-border/50 flex-1" />
          </div>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <div>
          <Label className="text-xs">Cor destaque</Label>
          <div className="flex gap-1 mt-1">
            <input type="color" value={c.accentColor || "#C8A94E"} onChange={(e) => set("accentColor", e.target.value)} className="w-8 h-8 rounded cursor-pointer border-0" />
            <Input value={c.accentColor || ""} onChange={(e) => set("accentColor", e.target.value)} className="h-8 text-xs bg-secondary/50 border-border/50 flex-1" />
          </div>
        </div>
        <div>
          <Label className="text-xs">Gradiente fundo</Label>
          <Input value={c.bgGradient || ""} onChange={(e) => set("bgGradient", e.target.value)} placeholder="linear-gradient(...)" className="h-8 text-xs bg-secondary/50 border-border/50 mt-1" />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <div>
          <Label className="text-xs">Animação</Label>
          <select value={c.animation || "none"} onChange={(e) => set("animation", e.target.value)}
            className="w-full h-8 text-xs bg-secondary/50 border border-border/50 rounded-md px-2 mt-1">
            {animations.map(a => <option key={a.value} value={a.value}>{a.label}</option>)}
          </select>
        </div>
        <div>
          <Label className="text-xs">Padding (px)</Label>
          <Input type="number" value={c.paddingY || "60"} onChange={(e) => set("paddingY", e.target.value)} className="h-8 text-xs bg-secondary/50 border-border/50 mt-1" />
        </div>
      </div>
    </div>
  );

  const renderListItems = (key: string, fields: { name: string; label: string; type?: string }[]) => {
    const items = c[key] || [];
    return (
      <div className="space-y-2">
        <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">Itens</p>
        {items.map((item: any, idx: number) => (
          <div key={idx} className="bg-secondary/20 rounded-lg p-3 space-y-2 relative">
            <button onClick={() => set(key, items.filter((_: any, i: number) => i !== idx))}
              className="absolute top-2 right-2 p-0.5 text-destructive hover:bg-destructive/20 rounded"><Trash2 className="w-3 h-3" /></button>
            {fields.map(f => (
              <div key={f.name}>
                <Label className="text-[10px]">{f.label}</Label>
                {f.type === "textarea" ? (
                  <Textarea value={item[f.name] || ""} onChange={(e) => {
                    const newItems = [...items];
                    newItems[idx] = { ...newItems[idx], [f.name]: e.target.value };
                    set(key, newItems);
                  }} className="text-xs bg-secondary/50 border-border/50 mt-0.5" rows={2} />
                ) : (
                  <Input value={item[f.name] || ""} onChange={(e) => {
                    const newItems = [...items];
                    newItems[idx] = { ...newItems[idx], [f.name]: e.target.value };
                    set(key, newItems);
                  }} className="h-7 text-xs bg-secondary/50 border-border/50 mt-0.5" />
                )}
              </div>
            ))}
          </div>
        ))}
        <Button variant="ghost" size="sm" className="w-full h-7 text-xs" onClick={() => {
          const newItem: any = {};
          fields.forEach(f => newItem[f.name] = "");
          set(key, [...items, newItem]);
        }}><Plus className="w-3 h-3" /> Adicionar</Button>
      </div>
    );
  };

  return (
    <div className="p-4 space-y-4">
      <p className="text-xs uppercase tracking-wider text-muted-foreground font-medium">
        {section.section_type.replace("_", " ")}
      </p>

      {/* Type-specific fields */}
      {(section.section_type === "hero" || section.section_type === "cta") && (
        <div className="space-y-3">
          <div>
            <Label className="text-xs">Headline</Label>
            <Input value={c.headline || ""} onChange={(e) => set("headline", e.target.value)} className="h-8 text-xs bg-secondary/50 border-border/50 mt-1" />
          </div>
          {section.section_type === "hero" && (
            <div>
              <Label className="text-xs">Subtítulo</Label>
              <Textarea value={c.subtitle || ""} onChange={(e) => set("subtitle", e.target.value)} className="text-xs bg-secondary/50 border-border/50 mt-1" rows={2} />
            </div>
          )}
          {section.section_type === "cta" && (
            <div>
              <Label className="text-xs">Descrição</Label>
              <Textarea value={c.description || ""} onChange={(e) => set("description", e.target.value)} className="text-xs bg-secondary/50 border-border/50 mt-1" rows={2} />
            </div>
          )}
          {section.section_type === "hero" && (
            <div>
              <Label className="text-xs">Badge</Label>
              <Input value={c.badge || ""} onChange={(e) => set("badge", e.target.value)} className="h-8 text-xs bg-secondary/50 border-border/50 mt-1" />
            </div>
          )}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label className="text-xs">Texto do botão</Label>
              <Input value={c.ctaText || ""} onChange={(e) => set("ctaText", e.target.value)} className="h-8 text-xs bg-secondary/50 border-border/50 mt-1" />
            </div>
            <div>
              <Label className="text-xs">URL do botão</Label>
              <Input value={c.ctaUrl || ""} onChange={(e) => set("ctaUrl", e.target.value)} className="h-8 text-xs bg-secondary/50 border-border/50 mt-1" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label className="text-xs">Tamanho heading</Label>
              <Input type="number" value={c.headingSize || "48"} onChange={(e) => set("headingSize", e.target.value)} className="h-8 text-xs bg-secondary/50 border-border/50 mt-1" />
            </div>
            <div>
              <Label className="text-xs">Tamanho subtítulo</Label>
              <Input type="number" value={c.subtitleSize || "18"} onChange={(e) => set("subtitleSize", e.target.value)} className="h-8 text-xs bg-secondary/50 border-border/50 mt-1" />
            </div>
          </div>
        </div>
      )}

      {section.section_type === "benefits" && (
        <div className="space-y-3">
          <div>
            <Label className="text-xs">Título da seção</Label>
            <Input value={c.title || ""} onChange={(e) => set("title", e.target.value)} className="h-8 text-xs bg-secondary/50 border-border/50 mt-1" />
          </div>
          {renderListItems("items", [
            { name: "icon", label: "Ícone (emoji)" },
            { name: "title", label: "Título" },
            { name: "description", label: "Descrição", type: "textarea" },
          ])}
        </div>
      )}

      {section.section_type === "features" && (
        <div className="space-y-3">
          <div>
            <Label className="text-xs">Título</Label>
            <Input value={c.title || ""} onChange={(e) => set("title", e.target.value)} className="h-8 text-xs bg-secondary/50 border-border/50 mt-1" />
          </div>
          {renderListItems("items", [
            { name: "icon", label: "Ícone" },
            { name: "title", label: "Título" },
            { name: "description", label: "Descrição", type: "textarea" },
          ])}
        </div>
      )}

      {section.section_type === "pricing" && (
        <div className="space-y-3">
          <div>
            <Label className="text-xs">Título</Label>
            <Input value={c.title || ""} onChange={(e) => set("title", e.target.value)} className="h-8 text-xs bg-secondary/50 border-border/50 mt-1" />
          </div>
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">Planos</p>
          {(c.plans || []).map((plan: any, idx: number) => (
            <div key={idx} className="bg-secondary/20 rounded-lg p-3 space-y-2 relative">
              <button onClick={() => set("plans", (c.plans || []).filter((_: any, i: number) => i !== idx))}
                className="absolute top-2 right-2 p-0.5 text-destructive hover:bg-destructive/20 rounded"><Trash2 className="w-3 h-3" /></button>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label className="text-[10px]">Nome</Label>
                  <Input value={plan.name || ""} onChange={(e) => {
                    const plans = [...(c.plans || [])];
                    plans[idx] = { ...plans[idx], name: e.target.value };
                    set("plans", plans);
                  }} className="h-7 text-xs bg-secondary/50 border-border/50 mt-0.5" />
                </div>
                <div>
                  <Label className="text-[10px]">Preço</Label>
                  <Input value={plan.price || ""} onChange={(e) => {
                    const plans = [...(c.plans || [])];
                    plans[idx] = { ...plans[idx], price: e.target.value };
                    set("plans", plans);
                  }} className="h-7 text-xs bg-secondary/50 border-border/50 mt-0.5" />
                </div>
              </div>
              <div>
                <Label className="text-[10px]">Features (uma por linha)</Label>
                <Textarea value={(plan.features || []).join("\n")} onChange={(e) => {
                  const plans = [...(c.plans || [])];
                  plans[idx] = { ...plans[idx], features: e.target.value.split("\n") };
                  set("plans", plans);
                }} className="text-xs bg-secondary/50 border-border/50 mt-0.5" rows={3} />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label className="text-[10px]">CTA</Label>
                  <Input value={plan.ctaText || ""} onChange={(e) => {
                    const plans = [...(c.plans || [])];
                    plans[idx] = { ...plans[idx], ctaText: e.target.value };
                    set("plans", plans);
                  }} className="h-7 text-xs bg-secondary/50 border-border/50 mt-0.5" />
                </div>
                <div>
                  <Label className="text-[10px]">URL</Label>
                  <Input value={plan.ctaUrl || ""} onChange={(e) => {
                    const plans = [...(c.plans || [])];
                    plans[idx] = { ...plans[idx], ctaUrl: e.target.value };
                    set("plans", plans);
                  }} className="h-7 text-xs bg-secondary/50 border-border/50 mt-0.5" />
                </div>
              </div>
              <label className="flex items-center gap-2 text-xs">
                <input type="checkbox" checked={plan.highlight || false} onChange={(e) => {
                  const plans = [...(c.plans || [])];
                  plans[idx] = { ...plans[idx], highlight: e.target.checked };
                  set("plans", plans);
                }} /> Destacar
              </label>
            </div>
          ))}
          <Button variant="ghost" size="sm" className="w-full h-7 text-xs" onClick={() => set("plans", [...(c.plans || []), { name: "", price: "", features: [], ctaText: "Escolher", ctaUrl: "#", highlight: false }])}><Plus className="w-3 h-3" /> Plano</Button>
        </div>
      )}

      {section.section_type === "testimonials" && (
        <div className="space-y-3">
          <div>
            <Label className="text-xs">Título</Label>
            <Input value={c.title || ""} onChange={(e) => set("title", e.target.value)} className="h-8 text-xs bg-secondary/50 border-border/50 mt-1" />
          </div>
          {renderListItems("items", [
            { name: "name", label: "Nome" },
            { name: "role", label: "Cargo" },
            { name: "text", label: "Depoimento", type: "textarea" },
            { name: "avatar", label: "URL Avatar" },
          ])}
        </div>
      )}

      {section.section_type === "faq" && (
        <div className="space-y-3">
          <div>
            <Label className="text-xs">Título</Label>
            <Input value={c.title || ""} onChange={(e) => set("title", e.target.value)} className="h-8 text-xs bg-secondary/50 border-border/50 mt-1" />
          </div>
          {renderListItems("items", [
            { name: "question", label: "Pergunta" },
            { name: "answer", label: "Resposta", type: "textarea" },
          ])}
        </div>
      )}

      {section.section_type === "gallery" && (
        <div className="space-y-3">
          <div>
            <Label className="text-xs">Título</Label>
            <Input value={c.title || ""} onChange={(e) => set("title", e.target.value)} className="h-8 text-xs bg-secondary/50 border-border/50 mt-1" />
          </div>
          {renderListItems("images", [
            { name: "url", label: "URL da imagem" },
            { name: "alt", label: "Texto alternativo" },
          ])}
        </div>
      )}

      {section.section_type === "contact_form" && (
        <div className="space-y-3">
          <div>
            <Label className="text-xs">Título</Label>
            <Input value={c.title || ""} onChange={(e) => set("title", e.target.value)} className="h-8 text-xs bg-secondary/50 border-border/50 mt-1" />
          </div>
          <div>
            <Label className="text-xs">Subtítulo</Label>
            <Input value={c.subtitle || ""} onChange={(e) => set("subtitle", e.target.value)} className="h-8 text-xs bg-secondary/50 border-border/50 mt-1" />
          </div>
          <div>
            <Label className="text-xs">Texto do botão</Label>
            <Input value={c.ctaText || ""} onChange={(e) => set("ctaText", e.target.value)} className="h-8 text-xs bg-secondary/50 border-border/50 mt-1" />
          </div>
        </div>
      )}

      {section.section_type === "custom_html" && (
        <div>
          <Label className="text-xs">HTML</Label>
          <Textarea value={c.html || ""} onChange={(e) => set("html", e.target.value)} className="text-xs bg-secondary/50 border-border/50 mt-1 font-mono" rows={12} />
        </div>
      )}

      {renderCommonFields()}
    </div>
  );
};

export default SectionEditor;
