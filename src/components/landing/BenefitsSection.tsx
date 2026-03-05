import { motion } from "framer-motion";
import { Shield, Wifi, MapPin, Users, Coffee, Monitor } from "lucide-react";

const benefits = [
  {
    icon: MapPin,
    title: "Endereço Comercial Premium",
    description: "Impressione seus clientes com um endereço nobre que transmite credibilidade e autoridade.",
  },
  {
    icon: Monitor,
    title: "Infraestrutura Completa",
    description: "Salas equipadas com TV, projetor, quadro branco e tudo que você precisa para performar.",
  },
  {
    icon: Wifi,
    title: "Internet Fibra Dedicada",
    description: "Conexão ultrarrápida e estável para videochamadas, uploads e trabalho sem interrupção.",
  },
  {
    icon: Shield,
    title: "Segurança 24h",
    description: "Acesso biométrico, câmeras e monitoramento para você focar no que importa.",
  },
  {
    icon: Users,
    title: "Networking Estratégico",
    description: "Comunidade de profissionais, eventos e oportunidades de parcerias reais.",
  },
  {
    icon: Coffee,
    title: "Café & Conforto",
    description: "Ambiente climatizado, café premium, copa equipada e áreas de descompressão.",
  },
];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45 } },
};

const BenefitsSection = () => {
  return (
    <section className="py-24 md:py-32">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-bold font-display mb-4">
            Por que Profissionais de{" "}
            <span className="text-gradient-gold">Alto Nível</span> nos Escolhem
          </h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            Cada detalhe pensado para elevar seu posicionamento e produtividade.
          </p>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {benefits.map((b) => {
            const Icon = b.icon;
            return (
              <motion.div
                key={b.title}
                variants={item}
                className="glass-card rounded-2xl p-6 group hover:border-gold/20 transition-colors duration-300"
              >
                <div className="p-3 rounded-xl bg-gold/10 w-fit mb-4 group-hover:bg-gold/15 transition-colors">
                  <Icon className="w-6 h-6 text-gold" />
                </div>
                <h3 className="text-lg font-display font-bold mb-2">{b.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{b.description}</p>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
};

export default BenefitsSection;
