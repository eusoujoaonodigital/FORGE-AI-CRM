import { motion } from "framer-motion";
import { getAnimation } from "./animations";

const TestimonialsRenderer = ({ config: c }: { config: any; isEditor?: boolean }) => {
  const items = c.items || [];
  return (
    <section style={{ backgroundColor: c.bgColor || "#0a0a0f", color: c.textColor || "#fff", paddingTop: `${c.paddingY || 60}px`, paddingBottom: `${c.paddingY || 60}px` }}>
      <motion.div className="max-w-5xl mx-auto px-6" {...getAnimation(c.animation)}>
        {c.title && <h2 className="text-3xl font-display font-bold text-center mb-10">{c.title}</h2>}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item: any, i: number) => (
            <div key={i} className="p-6 rounded-xl border border-white/10">
              <p className="text-sm italic opacity-80 mb-4">"{item.text}"</p>
              <div className="flex items-center gap-3">
                {item.avatar && <img src={item.avatar} alt={item.name} className="w-10 h-10 rounded-full object-cover" />}
                <div>
                  <p className="font-medium text-sm">{item.name}</p>
                  {item.role && <p className="text-xs opacity-50">{item.role}</p>}
                </div>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </section>
  );
};

export default TestimonialsRenderer;
