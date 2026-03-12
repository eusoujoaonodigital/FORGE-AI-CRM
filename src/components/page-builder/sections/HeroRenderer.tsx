import { motion } from "framer-motion";
import { getAnimation } from "@/components/page-builder/sections/animations";

const getPatternStyle = (pattern: string): React.CSSProperties => {
  switch (pattern) {
    case "dots":
      return { backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.06) 1px, transparent 1px)", backgroundSize: "24px 24px" };
    case "squares":
      return { backgroundImage: "linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)", backgroundSize: "40px 40px" };
    case "mesh":
      return {};
    case "noise":
      return {};
    default:
      return {};
  }
};

const getCtaHref = (config: any) => {
  if (config.ctaAction === "whatsapp") return `https://wa.me/${(config.ctaUrl || "").replace(/\D/g, "")}`;
  if (config.ctaAction === "scroll") return `#${config.ctaUrl || ""}`;
  return config.ctaUrl || "#";
};

const HeroRenderer = ({ config: c, isEditor }: { config: any; isEditor?: boolean }) => {
  const patternStyle = getPatternStyle(c.bgPattern || "none");
  const style: React.CSSProperties = {
    backgroundColor: c.bgColor || "#000000",
    background: c.bgGradient || c.bgColor || "#000000",
    color: c.textColor || "#ffffff",
    paddingTop: `${c.paddingY || 80}px`,
    paddingBottom: `${c.paddingY || 80}px`,
    ...patternStyle,
    fontFamily: c.fontFamily || "Inter, sans-serif",
  };

  const headingStyle: React.CSSProperties = {
    fontSize: `${c.headingSize || 48}px`,
    fontWeight: c.headingWeight || 700,
    letterSpacing: "-0.025em",
    lineHeight: 1,
    ...(c.gradientText ? {
      background: `linear-gradient(135deg, ${c.textColor || "#fff"}, ${c.accentColor || "#84CC16"})`,
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
      backgroundClip: "text",
    } : {}),
  };

  const btnStyle: React.CSSProperties = c.btnStyle === "outline"
    ? { border: `2px solid ${c.accentColor || "#84CC16"}`, color: c.accentColor || "#84CC16", backgroundColor: "transparent" }
    : c.btnStyle === "ghost"
    ? { color: c.accentColor || "#84CC16", backgroundColor: "transparent" }
    : { backgroundColor: c.accentColor || "#84CC16", color: c.bgColor || "#000" };

  return (
    <section style={style} className={c.bgPattern === "noise" ? "noise-bg" : ""}>
      <motion.div className="max-w-4xl mx-auto px-6 text-center relative z-10" {...getAnimation(c.animation)}>
        {c.badge && (
          <span className="inline-block px-4 py-1.5 rounded-full text-xs font-medium mb-6 border"
            style={{ borderColor: `${c.accentColor || "#84CC16"}30`, color: c.accentColor || "#84CC16", backgroundColor: `${c.accentColor || "#84CC16"}10` }}>
            {c.badge}
          </span>
        )}
        <h1 style={headingStyle} className="mb-6">
          {c.headline || "Título Principal"}
        </h1>
        <p className="mb-8 opacity-60 max-w-2xl mx-auto" style={{ fontSize: `${c.subtitleSize || 18}px` }}>
          {c.subtitle || "Subtítulo"}
        </p>
        {c.ctaText && (
          <a href={isEditor ? undefined : getCtaHref(c)}
            className={`inline-flex items-center px-8 py-3.5 rounded-lg font-semibold text-sm transition-all hover:scale-105 ${c.btnStyle === "rounded-full" ? "!rounded-full" : ""}`}
            style={btnStyle}
            onClick={isEditor ? (e) => e.preventDefault() : c.ctaAction === "scroll" ? (e) => { e.preventDefault(); document.getElementById(c.ctaUrl)?.scrollIntoView({ behavior: "smooth" }); } : undefined}>
            {c.ctaText}
          </a>
        )}
      </motion.div>
    </section>
  );
};

export default HeroRenderer;
