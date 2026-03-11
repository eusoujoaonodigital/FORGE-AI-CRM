import { motion } from "framer-motion";
import { getAnimation } from "./animations";

const BenefitsRenderer = ({ config: c }: { config: any; isEditor?: boolean }) => {
  const items = c.items || [];
  return (
    <section style={{ backgroundColor: c.bgColor || "#0a0a0f", color: c.textColor || "#fff", paddingTop: `${c.paddingY || 60}px`, paddingBottom: `${c.paddingY || 60}px` }}>
      <motion.div className="max-w-5xl mx-auto px-6" {...getAnimation(c.animation)}>
        {c.title && <h2 className="text-3xl font-display font-bold text-center mb-10">{c.title}</h2>}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item: any, i: number) => (
            <div key={i} className="p-6 rounded-xl border border-white/10 hover:border-white/20 transition-colors" style={{ backgroundColor: `${c.accentColor || "#C8A94E"}08` }}>
              <span className="text-3xl mb-3 block">{item.icon}</span>
              <h3 className="font-display font-bold text-lg mb-2">{item.title}</h3>
              <p className="text-sm opacity-70">{item.description}</p>
            </div>
          ))}
        </div>
      </motion.div>
    </section>
  );
};

export default BenefitsRenderer;
