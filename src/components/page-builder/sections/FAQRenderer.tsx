import { useState } from "react";
import { motion } from "framer-motion";
import { getAnimation } from "./animations";
import { ChevronDown } from "lucide-react";

const FAQRenderer = ({ config: c }: { config: any; isEditor?: boolean }) => {
  const items = c.items || [];
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  return (
    <section style={{ backgroundColor: c.bgColor || "#0d0d12", color: c.textColor || "#fff", paddingTop: `${c.paddingY || 60}px`, paddingBottom: `${c.paddingY || 60}px` }}>
      <motion.div className="max-w-3xl mx-auto px-6" {...getAnimation(c.animation)}>
        {c.title && <h2 className="text-3xl font-display font-bold text-center mb-10">{c.title}</h2>}
        <div className="space-y-3">
          {items.map((item: any, i: number) => (
            <div key={i} className="border border-white/10 rounded-xl overflow-hidden">
              <button onClick={() => setOpenIdx(openIdx === i ? null : i)}
                className="w-full flex items-center justify-between px-5 py-4 text-left text-sm font-medium hover:bg-white/5 transition-colors">
                {item.question}
                <ChevronDown className={`w-4 h-4 transition-transform ${openIdx === i ? "rotate-180" : ""}`} />
              </button>
              {openIdx === i && (
                <div className="px-5 pb-4 text-sm opacity-70">{item.answer}</div>
              )}
            </div>
          ))}
        </div>
      </motion.div>
    </section>
  );
};

export default FAQRenderer;
