import { useState } from "react";
import { motion } from "framer-motion";
import { getAnimation } from "./animations";
import { supabase } from "@/integrations/supabase/client";

const ContactFormRenderer = ({ config: c, isEditor }: { config: any; isEditor?: boolean }) => {
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isEditor) return;
    await supabase.from("leads").insert({
      name: form.name, email: form.email || null, phone: form.phone || null,
      source: "landing_page", notes: form.message || null, status: "new",
    });
    setSent(true);
  };

  return (
    <section style={{ backgroundColor: c.bgColor || "#0d0d12", color: c.textColor || "#fff", paddingTop: `${c.paddingY || 60}px`, paddingBottom: `${c.paddingY || 60}px` }}>
      <motion.div className="max-w-lg mx-auto px-6" {...getAnimation(c.animation)}>
        {c.title && <h2 className="text-3xl font-display font-bold text-center mb-2">{c.title}</h2>}
        {c.subtitle && <p className="text-center text-sm opacity-70 mb-8">{c.subtitle}</p>}
        {sent ? (
          <div className="text-center p-8 border border-white/10 rounded-xl">
            <p className="text-lg font-display font-bold" style={{ color: c.accentColor }}>Obrigado!</p>
            <p className="text-sm opacity-70 mt-2">Entraremos em contato em breve.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <input placeholder="Nome" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required
              className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-sm focus:border-white/30 outline-none" />
            <input placeholder="E-mail" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-sm focus:border-white/30 outline-none" />
            <input placeholder="Telefone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })}
              className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-sm focus:border-white/30 outline-none" />
            <textarea placeholder="Mensagem (opcional)" value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} rows={3}
              className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-sm focus:border-white/30 outline-none resize-none" />
            <button type="submit"
              className="w-full py-3 rounded-lg font-semibold text-sm transition-all hover:scale-[1.02]"
              style={{ backgroundColor: c.accentColor || "#C8A94E", color: c.bgColor || "#0a0a0f" }}>
              {c.ctaText || "Enviar"}
            </button>
          </form>
        )}
      </motion.div>
    </section>
  );
};

export default ContactFormRenderer;
