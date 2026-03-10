import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Check, Zap, Clock, CalendarDays } from "lucide-react";
import { useNavigate } from "react-router-dom";

const plans = [
  {
    name: "Por Hora", icon: Clock, priceOnline: "R$ 25", priceWalkIn: "R$ 35", unit: "/hora",
    description: "Ideal para reuniões rápidas e atendimentos pontuais.",
    features: ["Wi-Fi de alta velocidade", "Café e água inclusos", "Recepção profissional", "Endereço comercial"],
    highlight: false,
  },
  {
    name: "Diária", icon: CalendarDays, priceOnline: "R$ 149", priceWalkIn: "R$ 189", unit: "/dia",
    description: "Perfeito para dias intensos de trabalho e produtividade.",
    features: ["Tudo do plano Por Hora", "Sala privativa o dia todo", "Impressora e scanner", "Armário individual", "Sala de reunião 1h grátis"],
    highlight: true,
  },
  {
    name: "Mensal", icon: Zap, priceOnline: "R$ 1.490", priceWalkIn: "R$ 1.790", unit: "/mês",
    description: "Seu escritório profissional com custo inteligente.",
    features: ["Tudo do plano Diária", "Mesa fixa dedicada", "Endereço fiscal completo", "Sala de reunião 8h/mês", "Desconto em eventos", "Suporte prioritário"],
    highlight: false,
  },
];

const container = { hidden: {}, show: { transition: { staggerChildren: 0.12 } } };
const item = { hidden: { opacity: 0, y: 30 }, show: { opacity: 1, y: 0, transition: { duration: 0.5 } } };

const PricingSection = () => {
  const navigate = useNavigate();

  return (
    <section id="planos" className="relative py-24 md:py-32 grid-bg-subtle">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[300px] bg-gold/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="container relative z-10">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold font-display mb-4">
            Planos que <span className="text-gradient-gold">Cabem no Seu Crescimento</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            Preço exclusivo online. Reserve pelo site e economize até 25%.
          </p>
        </motion.div>

        <motion.div variants={container} initial="hidden" whileInView="show" viewport={{ once: true }}
          className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {plans.map((plan) => {
            const Icon = plan.icon;
            return (
              <motion.div key={plan.name} variants={item}
                className={`relative rounded-2xl p-6 md:p-8 flex flex-col ${plan.highlight ? "glass-card-gold shadow-gold-lg scale-[1.02] md:scale-105" : "glass-card"}`}>
                {plan.highlight && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-gold rounded-full text-xs font-bold text-primary-foreground">
                    MAIS POPULAR
                  </div>
                )}
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 rounded-lg bg-gold/10"><Icon className="w-5 h-5 text-gold" /></div>
                  <h3 className="text-xl font-display font-bold">{plan.name}</h3>
                </div>
                <div className="mb-1">
                  <span className="text-3xl md:text-4xl font-bold text-gradient-gold font-display">{plan.priceOnline}</span>
                  <span className="text-muted-foreground text-sm">{plan.unit}</span>
                </div>
                <p className="text-xs text-muted-foreground mb-4">Presencial: {plan.priceWalkIn}{plan.unit}</p>
                <p className="text-sm text-secondary-foreground mb-6">{plan.description}</p>
                <ul className="space-y-3 mb-8 flex-1">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm text-secondary-foreground">
                      <Check className="w-4 h-4 text-gold mt-0.5 shrink-0" />{f}
                    </li>
                  ))}
                </ul>
                <Button variant={plan.highlight ? "gold" : "gold-outline"} size="lg" className="w-full" onClick={() => navigate("/agendar")}>
                  Reservar Agora
                </Button>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
};

export default PricingSection;
