import { motion } from "framer-motion";
import { getAnimation } from "./animations";

const CTARenderer = ({ config: c, isEditor }: { config: any; isEditor?: boolean }) => {
  return (
    <section style={{ backgroundColor: c.bgColor || "#0a0a0f", background: c.bgGradient || c.bgColor || "#0a0a0f", color: c.textColor || "#fff", paddingTop: `${c.paddingY || 60}px`, paddingBottom: `${c.paddingY || 60}px` }}>
      <motion.div className="max-w-3xl mx-auto px-6 text-center" {...getAnimation(c.animation)}>
        <h2 className="text-3xl font-display font-bold mb-4">{c.headline || "CTA"}</h2>
        {c.description && <p className="text-lg opacity-70 mb-8">{c.description}</p>}
        {c.ctaText && (
          <a href={isEditor ? undefined : c.ctaUrl || "#"}
            className="inline-flex items-center px-8 py-3.5 rounded-xl font-semibold text-sm transition-all hover:scale-105"
            style={{ backgroundColor: c.accentColor || "#C8A94E", color: c.bgColor || "#0a0a0f" }}
            onClick={isEditor ? (e) => e.preventDefault() : undefined}>
            {c.ctaText}
          </a>
        )}
      </motion.div>
    </section>
  );
};

export default CTARenderer;
