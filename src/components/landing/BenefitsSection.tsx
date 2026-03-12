import { motion } from "framer-motion";
import { BarChart3, Globe, Users, Zap, Target, Layers } from "lucide-react";

const benefits = [
  {
    icon: BarChart3,
    title: "Pipeline Visual",
    description: "CRM Kanban com drag-and-drop, múltiplos funis e gestão completa de leads em tempo real.",
  },
  {
    icon: Globe,
    title: "Landing Page Builder",
    description: "Crie páginas de alta conversão com editor visual. Customize cores, tipografia e animações.",
  },
  {
    icon: Target,
    title: "Quizzes Interativos",
    description: "Capture leads qualificados com quizzes que segmentam e enriquecem seu pipeline automaticamente.",
  },
  {
    icon: Zap,
    title: "Analytics Pro",
    description: "Métricas de conversão, LTV, CAC e tracking com UTM e Pixel integrados por página.",
  },
  {
    icon: Users,
    title: "Gestão de Leads",
    description: "Cadastro automático via formulários, quizzes e landing pages. Score e segmentação.",
  },
  {
    icon: Layers,
    title: "Multi-Pipeline",
    description: "Crie pipelines personalizados para vendas, pós-venda, onboarding e qualquer fluxo.",
  },
];

const container = { hidden: {}, show: { transition: { staggerChildren: 0.06 } } };
const item = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { duration: 0.4 } } };

const BenefitsSection = () => {
  return (
    <section id="recursos" className="py-24 md:py-32">
      <div className="container">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tighter mb-4">
            Tudo que você precisa para{" "}
            <span className="text-gradient-lime">acelerar vendas</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            Uma plataforma completa para converter, gerenciar e escalar.
          </p>
        </motion.div>

        <motion.div variants={container} initial="hidden" whileInView="show" viewport={{ once: true }} className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {benefits.map((b) => {
            const Icon = b.icon;
            return (
              <motion.div key={b.title} variants={item}
                className="surface-card rounded-lg p-6 group hover:border-lime/20 transition-colors duration-200">
                <div className="p-2.5 rounded-lg bg-lime/10 w-fit mb-4 group-hover:bg-lime/15 transition-colors">
                  <Icon className="w-5 h-5 text-lime" />
                </div>
                <h3 className="text-base font-semibold tracking-tight mb-2">{b.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{b.description}</p>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
};

export default BenefitsSection;
