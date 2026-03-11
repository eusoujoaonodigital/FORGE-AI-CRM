import { motion } from "framer-motion";
import { getAnimation } from "@/components/page-builder/sections/animations";

const HeroRenderer = ({ config: c, isEditor }: { config: any; isEditor?: boolean }) => {
  const style: React.CSSProperties = {
    backgroundColor: c.bgColor || "#0a0a0f",
    background: c.bgGradient || c.bgColor || "#0a0a0f",
    color: c.textColor || "#ffffff",
    paddingTop: `${c.paddingY || 80}px`,
    paddingBottom: `${c.paddingY || 80}px`,
  };

  return (
    <section style={style}>
      <motion.div className="max-w-4xl mx-auto px-6 text-center" {...getAnimation(c.animation)}>
        {c.badge && (
          <span className="inline-block px-4 py-1.5 rounded-full text-xs font-medium mb-6 border"
            style={{ borderColor: `${c.accentColor || "#C8A94E"}40`, color: c.accentColor || "#C8A94E", backgroundColor: `${c.accentColor || "#C8A94E"}15` }}>
            {c.badge}
          </span>
        )}
        <h1 className="font-display font-bold leading-tight mb-6" style={{ fontSize: `${c.headingSize || 48}px` }}>
          {c.headline || "Título Principal"}
        </h1>
        <p className="mb-8 opacity-70 max-w-2xl mx-auto" style={{ fontSize: `${c.subtitleSize || 18}px` }}>
          {c.subtitle || "Subtítulo"}
        </p>
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

export default HeroRenderer;
