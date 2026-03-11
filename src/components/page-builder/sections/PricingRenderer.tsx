import { motion } from "framer-motion";
import { getAnimation } from "./animations";

const PricingRenderer = ({ config: c, isEditor }: { config: any; isEditor?: boolean }) => {
  const plans = c.plans || [];
  return (
    <section style={{ backgroundColor: c.bgColor || "#0d0d12", color: c.textColor || "#fff", paddingTop: `${c.paddingY || 60}px`, paddingBottom: `${c.paddingY || 60}px` }}>
      <motion.div className="max-w-5xl mx-auto px-6" {...getAnimation(c.animation)}>
        {c.title && <h2 className="text-3xl font-display font-bold text-center mb-10">{c.title}</h2>}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {plans.map((plan: any, i: number) => (
            <div key={i} className={`p-6 rounded-xl border transition-all ${plan.highlight ? "border-2 scale-105" : "border-white/10"}`}
              style={plan.highlight ? { borderColor: c.accentColor || "#C8A94E", boxShadow: `0 0 30px ${c.accentColor || "#C8A94E"}20` } : {}}>
              <h3 className="font-display font-bold text-xl mb-1">{plan.name}</h3>
              <p className="text-3xl font-bold mb-4" style={{ color: c.accentColor || "#C8A94E" }}>
                R$ {plan.price}<span className="text-sm font-normal opacity-50">/mês</span>
              </p>
              <ul className="space-y-2 mb-6">
                {(plan.features || []).filter(Boolean).map((f: string, fi: number) => (
                  <li key={fi} className="text-sm flex items-center gap-2"><span style={{ color: c.accentColor }}>✓</span> {f}</li>
                ))}
              </ul>
              <a href={isEditor ? undefined : plan.ctaUrl || "#"}
                className="block text-center px-6 py-2.5 rounded-lg font-semibold text-sm transition-all hover:scale-105"
                style={plan.highlight ? { backgroundColor: c.accentColor || "#C8A94E", color: c.bgColor || "#0a0a0f" } : { border: `1px solid ${c.accentColor || "#C8A94E"}`, color: c.accentColor }}
                onClick={isEditor ? (e) => e.preventDefault() : undefined}>
                {plan.ctaText || "Escolher"}
              </a>
            </div>
          ))}
        </div>
      </motion.div>
    </section>
  );
};

export default PricingRenderer;
