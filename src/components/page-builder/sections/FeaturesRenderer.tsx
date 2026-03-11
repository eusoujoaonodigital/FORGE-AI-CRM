import { motion } from "framer-motion";
import { getAnimation } from "./animations";

const FeaturesRenderer = ({ config: c }: { config: any; isEditor?: boolean }) => {
  const items = c.items || [];
  return (
    <section style={{ backgroundColor: c.bgColor || "#0a0a0f", color: c.textColor || "#fff", paddingTop: `${c.paddingY || 60}px`, paddingBottom: `${c.paddingY || 60}px` }}>
      <motion.div className="max-w-5xl mx-auto px-6" {...getAnimation(c.animation)}>
        {c.title && <h2 className="text-3xl font-display font-bold text-center mb-10">{c.title}</h2>}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {items.map((item: any, i: number) => (
            <div key={i} className="text-center p-4">
              <span className="text-3xl mb-3 block">{item.icon}</span>
              <h3 className="font-display font-bold mb-1">{item.title}</h3>
              <p className="text-xs opacity-70">{item.description}</p>
            </div>
          ))}
        </div>
      </motion.div>
    </section>
  );
};

export default FeaturesRenderer;
