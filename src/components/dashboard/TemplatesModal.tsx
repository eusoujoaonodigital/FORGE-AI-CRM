import { X, Sparkles, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface PageTemplate {
  name: string;
  description: string;
  preview: string;
  category: string;
  sections: { section_type: string; order: number; config: any }[];
}

const templates: PageTemplate[] = [
  {
    name: "VSL — Vídeo de Vendas",
    description: "Página com vídeo de vendas, headline forte, urgência e escassez. Ideal para lançamentos.",
    preview: "🎬",
    category: "Vendas",
    sections: [
      { section_type: "hero", order: 0, config: { headline: "Descubra o Método que Já Transformou +10.000 Vidas", subtitle: "Assista ao vídeo abaixo e veja como funciona — antes que a oferta expire.", ctaText: "QUERO ACESSO AGORA →", ctaUrl: "#pricing", ctaAction: "scroll", badge: "🔥 OFERTA POR TEMPO LIMITADO", bgColor: "#000000", textColor: "#ffffff", accentColor: "#84CC16", animation: "fade-in", paddingY: "100", bgPattern: "dots", headingSize: "52", subtitleSize: "20", headingWeight: "900", fontFamily: "Inter", gradientText: true, bgGradient: "linear-gradient(180deg, #000000 0%, #0a1a00 100%)" }},
      { section_type: "benefits", order: 1, config: { title: "Por Que Este Método Funciona?", subtitle: "Resultados comprovados por milhares de clientes", bgColor: "#0A0A0A", textColor: "#ffffff", accentColor: "#84CC16", animation: "slide-up", paddingY: "60", bgPattern: "none", items: [{ icon: "✅", title: "Resultado em 7 dias", description: "Veja as primeiras mudanças na primeira semana." }, { icon: "🎯", title: "100% Prático", description: "Sem teoria desnecessária. Passo a passo direto ao ponto." }, { icon: "🔒", title: "Garantia de 30 Dias", description: "Se não gostar, devolvemos seu dinheiro. Sem perguntas." }, { icon: "⚡", title: "Acesso Imediato", description: "Comece agora mesmo após a confirmação." }, { icon: "📱", title: "Acesse de Qualquer Lugar", description: "Celular, tablet ou computador." }, { icon: "🏆", title: "+10.000 Alunos", description: "A maior comunidade do segmento no Brasil." }] }},
      { section_type: "testimonials", order: 2, config: { title: "Veja o Que Nossos Clientes Dizem", bgColor: "#000000", textColor: "#ffffff", accentColor: "#84CC16", animation: "slide-up", paddingY: "60", bgPattern: "none", items: [{ name: "Maria Silva", role: "Empresária", text: "Em apenas 2 semanas já vi resultados. Recomendo demais!", avatar: "" }, { name: "Carlos Souza", role: "Profissional Liberal", text: "Melhor investimento que fiz. O método é simples e funciona.", avatar: "" }, { name: "Ana Costa", role: "Estudante", text: "Transformou minha vida. Não imaginava que seria tão rápido.", avatar: "" }] }},
      { section_type: "pricing", order: 3, config: { title: "Escolha Seu Plano", subtitle: "Oferta especial com desconto por tempo limitado", bgColor: "#0A0A0A", textColor: "#ffffff", accentColor: "#84CC16", animation: "scale-in", paddingY: "60", bgPattern: "dots", plans: [{ name: "Essencial", price: "97", features: ["Acesso completo ao método", "Suporte por 30 dias", "Comunidade exclusiva", "Bônus: E-book"], ctaText: "QUERO ESSE →", ctaUrl: "#", highlight: false }, { name: "Premium", price: "197", features: ["Tudo do Essencial", "Mentoria em grupo", "Acesso vitalício", "3 Bônus exclusivos", "Certificado"], ctaText: "QUERO ESSE →", ctaUrl: "#", highlight: true }] }},
      { section_type: "faq", order: 4, config: { title: "Perguntas Frequentes", bgColor: "#000000", textColor: "#ffffff", accentColor: "#84CC16", animation: "fade-in", paddingY: "60", bgPattern: "none", items: [{ question: "Para quem é este método?", answer: "Para qualquer pessoa que queira transformar seus resultados de forma prática e rápida." }, { question: "Tem garantia?", answer: "Sim! 30 dias de garantia incondicional. Se não gostar, devolvemos 100% do valor." }, { question: "Preciso de experiência prévia?", answer: "Não! O método foi criado para iniciantes e profissionais." }] }},
      { section_type: "cta", order: 5, config: { headline: "⏰ Essa Oferta Expira em Breve", description: "Não perca a chance de transformar seus resultados. Garanta seu acesso agora com desconto exclusivo.", ctaText: "GARANTIR MINHA VAGA →", ctaUrl: "#", ctaAction: "scroll", bgColor: "#0a1a00", textColor: "#ffffff", accentColor: "#84CC16", animation: "fade-in", paddingY: "80", bgGradient: "linear-gradient(135deg, #0a1a00 0%, #000000 100%)", bgPattern: "none" }},
    ],
  },
  {
    name: "Sales Letter — Carta de Vendas",
    description: "Carta longa com storytelling, provas sociais, garantia e múltiplos CTAs. Formato clássico de DR.",
    preview: "📝",
    category: "Vendas",
    sections: [
      { section_type: "hero", order: 0, config: { headline: "A Verdade Que Ninguém Te Conta Sobre [Resultado]", subtitle: "Como profissionais comuns estão conseguindo [resultado desejado] sem [obstáculo comum] — mesmo que [objeção principal].", ctaText: "Leia a História Completa ↓", ctaUrl: "story", ctaAction: "scroll", badge: "📖 HISTÓRIA REAL", bgColor: "#0a0a0a", textColor: "#ffffff", accentColor: "#84CC16", animation: "fade-in", paddingY: "100", bgPattern: "none", headingSize: "44", subtitleSize: "18", headingWeight: "800", fontFamily: "Georgia", gradientText: false, bgGradient: "" }},
      { section_type: "custom_html", order: 1, config: { html: "<div style='max-width:680px;margin:0 auto;padding:40px 20px;color:#d4d4d4;font-family:Georgia,serif;line-height:1.8;font-size:17px'><p><strong style='color:#fff'>Querido leitor,</strong></p><p>Se você está cansado de tentar [solução comum] sem resultados, esta será a mensagem mais importante que você vai ler hoje.</p><p>Meu nome é [Seu Nome] e há 3 anos eu estava exatamente onde você está agora...</p><p style='color:#84CC16;font-weight:bold'>Até que descobri um método diferente.</p><p>Um método que não exige [obstáculo 1], não precisa de [obstáculo 2] e funciona mesmo para quem [objeção principal].</p></div>", bgColor: "#0a0a0a", paddingY: "0", bgPattern: "none" }},
      { section_type: "benefits", order: 2, config: { title: "O Que Você Vai Descobrir:", subtitle: "", bgColor: "#000000", textColor: "#ffffff", accentColor: "#84CC16", animation: "slide-up", paddingY: "60", bgPattern: "none", items: [{ icon: "1️⃣", title: "O Método Validado", description: "O passo a passo exato que já ajudou +5.000 pessoas." }, { icon: "2️⃣", title: "Os 3 Erros Fatais", description: "Descubra o que está sabotando seus resultados sem você saber." }, { icon: "3️⃣", title: "A Fórmula Secreta", description: "A estratégia que os líderes do mercado usam todos os dias." }] }},
      { section_type: "testimonials", order: 3, config: { title: "Histórias Reais de Transformação", bgColor: "#0A0A0A", textColor: "#ffffff", accentColor: "#84CC16", animation: "slide-up", paddingY: "60", bgPattern: "none", items: [{ name: "Roberto Lima", role: "Empresário", text: "Eu era cético, mas os resultados apareceram na primeira semana. Incrível.", avatar: "" }, { name: "Fernanda Souza", role: "Autônoma", text: "Finalmente algo que funciona de verdade. Recomendo para todos.", avatar: "" }] }},
      { section_type: "pricing", order: 4, config: { title: "Seu Investimento", subtitle: "Quanto vale transformar seus resultados para sempre?", bgColor: "#000000", textColor: "#ffffff", accentColor: "#84CC16", animation: "scale-in", paddingY: "60", bgPattern: "dots", plans: [{ name: "Acesso Completo", price: "147", features: ["Método completo em vídeo", "Planilhas e templates", "Comunidade VIP", "Suporte por 60 dias", "Garantia incondicional de 30 dias", "Bônus: Masterclass exclusiva"], ctaText: "SIM, EU QUERO! →", ctaUrl: "#", highlight: true }] }},
      { section_type: "faq", order: 5, config: { title: "Dúvidas? Respondemos Aqui", bgColor: "#0A0A0A", textColor: "#ffffff", accentColor: "#84CC16", animation: "fade-in", paddingY: "60", bgPattern: "none", items: [{ question: "Funciona para iniciantes?", answer: "Sim! O método é 100% didático e começa do zero." }, { question: "Qual a garantia?", answer: "30 dias incondicionais. Risco zero para você." }, { question: "Quanto tempo leva para ver resultados?", answer: "A maioria dos alunos vê os primeiros resultados entre 7 e 14 dias." }] }},
      { section_type: "cta", order: 6, config: { headline: "A Decisão É Sua", description: "Você pode continuar fazendo o que sempre fez... ou pode escolher um caminho diferente. Hoje. Agora.", ctaText: "QUERO TRANSFORMAR MEUS RESULTADOS →", ctaUrl: "#", ctaAction: "link", bgColor: "#000000", textColor: "#ffffff", accentColor: "#84CC16", animation: "fade-in", paddingY: "80", bgGradient: "linear-gradient(180deg, #0a0a0a, #000)", bgPattern: "none" }},
    ],
  },
  {
    name: "Squeeze — Captura de Leads",
    description: "Página curta e direta para capturar email/WhatsApp com isca digital (ebook, aula grátis).",
    preview: "🧲",
    category: "Captura",
    sections: [
      { section_type: "hero", order: 0, config: { headline: "E-book Grátis: [Título da Isca Digital]", subtitle: "Baixe agora o guia completo com [X] estratégias para [resultado]. 100% gratuito.", ctaText: "BAIXAR AGORA — É GRÁTIS →", ctaUrl: "#form", ctaAction: "scroll", badge: "📚 MATERIAL GRATUITO", bgColor: "#000000", textColor: "#ffffff", accentColor: "#84CC16", animation: "fade-in", paddingY: "100", bgPattern: "dots", headingSize: "48", subtitleSize: "20", headingWeight: "800", fontFamily: "Inter", gradientText: true, bgGradient: "linear-gradient(180deg, #000 0%, #0a1a00 100%)" }},
      { section_type: "benefits", order: 1, config: { title: "O Que Você Vai Aprender:", subtitle: "", bgColor: "#0A0A0A", textColor: "#ffffff", accentColor: "#84CC16", animation: "slide-up", paddingY: "50", bgPattern: "none", items: [{ icon: "📖", title: "Capítulo 1: Fundamentos", description: "A base que todo profissional precisa dominar." }, { icon: "🎯", title: "Capítulo 2: Estratégias", description: "As táticas que geram resultados reais." }, { icon: "🚀", title: "Capítulo 3: Escala", description: "Como multiplicar seus resultados." }] }},
      { section_type: "contact_form", order: 2, config: { title: "Receba Seu E-book Agora", subtitle: "Preencha abaixo e receba imediatamente no seu email.", bgColor: "#000000", textColor: "#ffffff", accentColor: "#84CC16", animation: "scale-in", paddingY: "60", bgPattern: "dots", fields: ["name", "email", "phone"], ctaText: "ENVIAR MEU E-BOOK GRÁTIS →" }},
    ],
  },
  {
    name: "Webinar — Evento Online",
    description: "Página de inscrição para evento ao vivo com palestrante, benefícios e urgência. Ideal para lançamentos.",
    preview: "🎙️",
    category: "Evento",
    sections: [
      { section_type: "hero", order: 0, config: { headline: "Masterclass Gratuita: Como [Resultado] em [Prazo]", subtitle: "Evento ao vivo com [Nome do Palestrante] — Vagas limitadas a 500 participantes.\n\n📅 [Data] às [Hora] | 🔴 Ao Vivo e Gratuito", ctaText: "GARANTIR MINHA VAGA GRÁTIS →", ctaUrl: "#form", ctaAction: "scroll", badge: "🔴 AO VIVO E GRATUITO", bgColor: "#000000", textColor: "#ffffff", accentColor: "#ef4444", animation: "fade-in", paddingY: "100", bgPattern: "mesh", headingSize: "48", subtitleSize: "18", headingWeight: "800", fontFamily: "Inter", gradientText: false, bgGradient: "linear-gradient(135deg, #000 0%, #1a0000 50%, #000 100%)" }},
      { section_type: "benefits", order: 1, config: { title: "Nesta Masterclass Você Vai Aprender:", subtitle: "", bgColor: "#0A0A0A", textColor: "#ffffff", accentColor: "#ef4444", animation: "slide-up", paddingY: "60", bgPattern: "none", items: [{ icon: "🎯", title: "Estratégia #1", description: "O framework completo para [resultado] que os top performers usam." }, { icon: "⚡", title: "Estratégia #2", description: "Como eliminar [problema] da sua rotina em menos de 1 semana." }, { icon: "💰", title: "Estratégia #3", description: "O método de [resultado] que gera [número] em [prazo]." }, { icon: "🔥", title: "Bônus Exclusivo", description: "Planilha + Checklist para aplicar tudo no dia seguinte." }] }},
      { section_type: "features", order: 2, config: { title: "Sobre o Palestrante", bgColor: "#000000", textColor: "#ffffff", accentColor: "#ef4444", animation: "fade-in", paddingY: "60", bgPattern: "none", items: [{ icon: "🏆", title: "+10 Anos de Experiência", description: "Referência nacional no mercado." }, { icon: "📚", title: "Autor Best-Seller", description: "Livro mais vendido na categoria." }, { icon: "🎓", title: "+50.000 Alunos", description: "Impactou milhares de profissionais." }] }},
      { section_type: "contact_form", order: 3, config: { title: "Inscreva-se Gratuitamente", subtitle: "Preencha seus dados para garantir sua vaga na Masterclass.", bgColor: "#0A0A0A", textColor: "#ffffff", accentColor: "#ef4444", animation: "scale-in", paddingY: "60", bgPattern: "dots", fields: ["name", "email", "phone"], ctaText: "GARANTIR MINHA VAGA →" }},
      { section_type: "cta", order: 4, config: { headline: "⚠️ Vagas Limitadas — Garanta a Sua", description: "Apenas 500 vagas disponíveis. Quando acabar, acabou. Não deixe para depois.", ctaText: "QUERO PARTICIPAR →", ctaUrl: "#form", ctaAction: "scroll", bgColor: "#000000", textColor: "#ffffff", accentColor: "#ef4444", animation: "fade-in", paddingY: "70", bgGradient: "linear-gradient(180deg, #0a0a0a, #1a0000)", bgPattern: "none" }},
    ],
  },
  {
    name: "Forge — Estilo Corporativo Tech",
    description: "Dark mode moderno com verde lima neon. Estilo Linear/Vercel para SaaS e produtos tech.",
    preview: "⚡",
    category: "SaaS",
    sections: [
      { section_type: "hero", order: 0, config: { headline: "Construa. Escale. Domine.", subtitle: "A plataforma all-in-one para acelerar suas vendas com automação inteligente e dados em tempo real.", ctaText: "Começar Gratuitamente →", ctaUrl: "#pricing", ctaAction: "scroll", badge: "✨ Novo: AI Copilot integrado", bgColor: "#000000", textColor: "#ffffff", accentColor: "#84CC16", animation: "fade-in", paddingY: "100", bgPattern: "dots", headingSize: "56", subtitleSize: "18", headingWeight: "900", fontFamily: "Inter", gradientText: true, bgGradient: "linear-gradient(180deg, #000 0%, #050a00 100%)" }},
      { section_type: "features", order: 1, config: { title: "Tudo que você precisa, em um só lugar", bgColor: "#0A0A0A", textColor: "#ffffff", accentColor: "#84CC16", animation: "slide-up", paddingY: "60", bgPattern: "none", items: [{ icon: "📊", title: "Analytics em Tempo Real", description: "Dashboards com métricas que importam: conversão, LTV, CAC." }, { icon: "🤖", title: "Automação Inteligente", description: "Fluxos automatizados de nurturing e follow-up." }, { icon: "🌐", title: "Landing Pages em Minutos", description: "Builder drag-and-drop com templates de alta conversão." }, { icon: "🔗", title: "Integrações Nativas", description: "WhatsApp, email, calendário e mais de 50 ferramentas." }, { icon: "🛡️", title: "Segurança Enterprise", description: "Dados criptografados e conformidade com LGPD." }, { icon: "📱", title: "Mobile First", description: "Funciona perfeitamente em qualquer dispositivo." }] }},
      { section_type: "pricing", order: 2, config: { title: "Planos Transparentes", subtitle: "Sem surpresas. Cancele quando quiser.", bgColor: "#000000", textColor: "#ffffff", accentColor: "#84CC16", animation: "scale-in", paddingY: "60", bgPattern: "dots", plans: [{ name: "Starter", price: "0", features: ["Até 100 leads", "1 landing page", "Analytics básico", "Suporte por email"], ctaText: "Começar Grátis", ctaUrl: "#", highlight: false }, { name: "Pro", price: "97", features: ["Leads ilimitados", "Landing pages ilimitadas", "Analytics avançado", "CRM completo", "Automações", "Suporte prioritário"], ctaText: "Assinar Pro →", ctaUrl: "#", highlight: true }, { name: "Enterprise", price: "297", features: ["Tudo do Pro", "API access", "Custom domain", "White-label", "Onboarding dedicado", "SLA garantido"], ctaText: "Falar com Vendas", ctaUrl: "#", highlight: false }] }},
      { section_type: "testimonials", order: 3, config: { title: "Empresas que confiam na Forge", bgColor: "#0A0A0A", textColor: "#ffffff", accentColor: "#84CC16", animation: "slide-up", paddingY: "60", bgPattern: "none", items: [{ name: "Lucas Mendes", role: "CEO, TechScale", text: "Triplicamos nosso pipeline em 3 meses usando o Forge AI CRM.", avatar: "" }, { name: "Camila Torres", role: "Head de Growth, StartupX", text: "A melhor ferramenta de vendas que já usei. Interface incrível.", avatar: "" }, { name: "Rafael Lima", role: "Founder, AgênciaDigital", text: "O landing page builder economiza horas do nosso time toda semana.", avatar: "" }] }},
      { section_type: "cta", order: 4, config: { headline: "Pronto para acelerar?", description: "Comece gratuitamente e escale conforme cresce. Sem cartão de crédito.", ctaText: "Criar Conta Grátis →", ctaUrl: "/auth", ctaAction: "link", bgColor: "#000000", textColor: "#ffffff", accentColor: "#84CC16", animation: "fade-in", paddingY: "80", bgGradient: "linear-gradient(135deg, #000 0%, #0a1a00 100%)", bgPattern: "none" }},
    ],
  },
];

interface Props {
  onSelect: (template: PageTemplate) => void;
  onClose: () => void;
}

const TemplatesModal = ({ onSelect, onClose }: Props) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm" onClick={onClose}>
      <div className="surface-card rounded-lg p-6 w-full max-w-3xl max-h-[85vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-bold text-lg tracking-tighter flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-lime" /> Templates Prontos
          </h3>
          <button onClick={onClose} className="p-1 hover:bg-secondary rounded-lg"><X className="w-5 h-5" /></button>
        </div>
        <p className="text-sm text-muted-foreground mb-6">Escolha um modelo de página de alta conversão e personalize no editor.</p>
        <div className="grid sm:grid-cols-2 gap-4">
          {templates.map((t, i) => (
            <button key={i} onClick={() => onSelect(t)}
              className="text-left p-5 rounded-lg border border-border hover:border-lime/30 hover:bg-lime/5 transition-all group">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-3xl">{t.preview}</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-secondary text-muted-foreground">{t.category}</span>
              </div>
              <p className="font-semibold text-sm mb-1 group-hover:text-lime transition-colors">{t.name}</p>
              <p className="text-xs text-muted-foreground leading-relaxed">{t.description}</p>
              <div className="flex items-center gap-1 mt-3 text-[10px] text-muted-foreground">
                <Copy className="w-3 h-3" /> {t.sections.length} seções pré-configuradas
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TemplatesModal;
export { templates };
