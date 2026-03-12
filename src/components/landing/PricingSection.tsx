import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Check, Zap } from "lucide-react";
import { useNavigate } from "react-router-dom";

const plans = [
  {
    name: "Starter",
    price: "Grátis",
    unit: "",
    description: "Para quem está começando a organizar seus leads.",
    features: ["1 Pipeline", "50 Leads", "1 Landing Page", "Analytics básico", "Formulário de contato"],
    highlight: false,
  },
  {
    name: "Pro",
    price: "R$ 97",
    unit: "/mês",
    description: "Para equipes que precisam de performance.",
    features: ["Pipelines ilimitados", "Leads ilimitados", "10 Landing Pages", "Analytics avançado", "Quiz Builder", "Pixel & UTM tracking", "Suporte prioritário"],
    highlight: true,
  },
  {
    name: "Enterprise",
    price: "R$ 297",
    unit: "/mês",
    description: "Para operações de alta escala e customização.",
    features: ["Tudo do Pro", "Landing Pages ilimitadas", "Custom domain", "API access", "White label", "Onboarding dedicado", "SLA garantido"],
    highlight: false,
  },
];

const container = { hidden: {}, show: { transition: { staggerChildren: 0.1 } } };
const item = { hidden: { opacity: 0, y: 30 }, show: { opacity: 1, y: 0, transition: { duration: 0.5 } } };

const PricingSection = () => {
  const navigate = useNavigate();

  return (
    <section id="planos" className="relative py-24 md:py-32 grid-bg-subtle">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[400px] h-[200px] bg-lime/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="container relative z-10">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tighter mb-4">
            Planos que <span className="text-gradient-lime">escalam com você</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            Comece grátis. Upgrade quando precisar.
          </p>
        </motion.div>

        <motion.div variants={container} initial="hidden" whileInView="show" viewport={{ once: true }}
          className="grid md:grid-cols-3 gap-4 max-w-5xl mx-auto">
          {plans.map((plan) => (
            <motion.div key={plan.name} variants={item}
              className={`relative rounded-lg p-6 md:p-8 flex flex-col ${plan.highlight ? "surface-card-lime shadow-lime" : "surface-card"}`}>
              {plan.highlight && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-gradient-lime rounded-full text-xs font-bold text-primary-foreground flex items-center gap-1">
                  <Zap className="w-3 h-3" /> POPULAR
                </div>
              )}
              <h3 className="text-lg font-bold tracking-tight mb-1">{plan.name}</h3>
              <div className="mb-1">
                <span className="text-3xl md:text-4xl font-bold tracking-tighter text-gradient-lime">{plan.price}</span>
                {plan.unit && <span className="text-muted-foreground text-sm">{plan.unit}</span>}
              </div>
              <p className="text-sm text-muted-foreground mb-6">{plan.description}</p>
              <ul className="space-y-2.5 mb-8 flex-1">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm text-secondary-foreground">
                    <Check className="w-4 h-4 text-lime mt-0.5 shrink-0" />{f}
                  </li>
                ))}
              </ul>
              <Button variant={plan.highlight ? "lime" : "lime-outline"} size="lg" className="w-full" onClick={() => navigate("/auth")}>
                {plan.price === "Grátis" ? "Começar Grátis" : "Assinar Agora"}
              </Button>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default PricingSection;
