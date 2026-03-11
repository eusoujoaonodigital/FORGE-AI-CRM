import { motion } from "framer-motion";
import { getAnimation } from "./animations";

const GalleryRenderer = ({ config: c }: { config: any; isEditor?: boolean }) => {
  const images = c.images || [];
  return (
    <section style={{ backgroundColor: c.bgColor || "#0a0a0f", color: c.textColor || "#fff", paddingTop: `${c.paddingY || 60}px`, paddingBottom: `${c.paddingY || 60}px` }}>
      <motion.div className="max-w-5xl mx-auto px-6" {...getAnimation(c.animation)}>
        {c.title && <h2 className="text-3xl font-display font-bold text-center mb-10">{c.title}</h2>}
        {images.length === 0 ? (
          <p className="text-center text-sm opacity-50">Adicione imagens no editor</p>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
            {images.map((img: any, i: number) => (
              <img key={i} src={img.url} alt={img.alt || ""} className="w-full h-48 object-cover rounded-xl" />
            ))}
          </div>
        )}
      </motion.div>
    </section>
  );
};

export default GalleryRenderer;
