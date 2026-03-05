import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, MessageCircle } from "lucide-react";

const CTASection = () => {
  return (
    <section className="py-24 md:py-32 relative overflow-hidden">
      <div className="absolute inset-0 bg-gold/[0.03]" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-gold/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="container relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="glass-card-gold rounded-3xl p-8 md:p-16 text-center max-w-3xl mx-auto"
        >
          <h2 className="text-3xl md:text-5xl font-bold font-display mb-4">
            Pronto para{" "}
            <span className="text-gradient-gold">Elevar Seu Nível</span>?
          </h2>
          <p className="text-muted-foreground text-lg mb-8 max-w-lg mx-auto">
            Agende uma visita gratuita e descubra como nosso espaço pode transformar
            a percepção dos seus clientes sobre você.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button variant="gold" size="xl" className="w-full sm:w-auto">
              Agendar Visita Gratuita
              <ArrowRight className="w-5 h-5" />
            </Button>
            <Button variant="gold-outline" size="xl" className="w-full sm:w-auto">
              <MessageCircle className="w-5 h-5" />
              Falar no WhatsApp
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CTASection;
