import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Zap } from "lucide-react";
import { useNavigate } from "react-router-dom";

const HeroSection = () => {
  const navigate = useNavigate();

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden dot-grid">
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-lime/5 rounded-full blur-[150px] pointer-events-none" />

      <div className="container relative z-10 py-20 md:py-32">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-lime/20 bg-lime/5 mb-8">
            <Zap className="w-3.5 h-3.5 text-lime" />
            <span className="text-xs text-lime font-medium tracking-wide">Plataforma de Aceleração de Vendas</span>
          </motion.div>

          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tighter leading-[0.95] mb-6">
            Converta mais.{" "}
            <span className="text-gradient-lime">Venda melhor.</span>{" "}
            Escale rápido.
          </motion.h1>

          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
            CRM visual, landing pages de alta conversão, quizzes interativos e analytics avançado — tudo em uma única plataforma.
          </motion.p>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button variant="lime" size="xl" className="w-full sm:w-auto" onClick={() => navigate("/auth")}>
              Começar Grátis <ArrowRight className="w-5 h-5" />
            </Button>
            <Button variant="lime-outline" size="xl" className="w-full sm:w-auto" onClick={() => document.getElementById("recursos")?.scrollIntoView({ behavior: "smooth" })}>
              Ver Recursos
            </Button>
          </motion.div>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, delay: 0.5 }}
            className="mt-16 grid grid-cols-3 gap-8 max-w-md mx-auto">
            {[
              { value: "10x", label: "Mais conversões" },
              { value: "500+", label: "Empresas" },
              { value: "99.9%", label: "Uptime" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-2xl md:text-3xl font-bold text-gradient-lime tracking-tighter">{stat.value}</p>
                <p className="text-xs text-muted-foreground mt-1">{stat.label}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
