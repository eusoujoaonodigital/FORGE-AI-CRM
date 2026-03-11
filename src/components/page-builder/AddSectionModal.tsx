import { X } from "lucide-react";

const sectionTypes = [
  { type: "hero", label: "Hero", icon: "🎯", desc: "Seção principal com headline, CTA e badge" },
  { type: "benefits", label: "Benefícios", icon: "✅", desc: "Grid de benefícios com ícones" },
  { type: "pricing", label: "Preços", icon: "💰", desc: "Tabela de planos e preços" },
  { type: "cta", label: "CTA", icon: "🚀", desc: "Chamada para ação com botão" },
  { type: "testimonials", label: "Depoimentos", icon: "💬", desc: "Cards de depoimentos" },
  { type: "faq", label: "FAQ", icon: "❓", desc: "Perguntas frequentes em accordion" },
  { type: "features", label: "Features", icon: "⚡", desc: "Grid de funcionalidades" },
  { type: "gallery", label: "Galeria", icon: "🖼️", desc: "Grid de imagens" },
  { type: "contact_form", label: "Formulário", icon: "📝", desc: "Formulário de contato que gera lead" },
  { type: "custom_html", label: "HTML Livre", icon: "🧩", desc: "Bloco de HTML personalizado" },
];

const AddSectionModal = ({ onAdd, onClose }: { onAdd: (type: string) => void; onClose: () => void }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <div className="glass-card-gold rounded-2xl p-6 w-full max-w-lg max-h-[80vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-display font-bold text-lg">Adicionar Seção</h3>
          <button onClick={onClose} className="p-1 hover:bg-secondary/50 rounded"><X className="w-5 h-5" /></button>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {sectionTypes.map(s => (
            <button key={s.type} onClick={() => onAdd(s.type)}
              className="text-left p-4 rounded-xl border border-border/30 hover:border-gold/40 hover:bg-gold/5 transition-all">
              <span className="text-2xl">{s.icon}</span>
              <p className="font-medium text-sm mt-2">{s.label}</p>
              <p className="text-xs text-muted-foreground mt-1">{s.desc}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AddSectionModal;
