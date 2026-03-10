import { useNavigate } from "react-router-dom";

const Footer = () => {
  const navigate = useNavigate();

  return (
    <footer className="border-t border-border/50 py-12">
      <div className="container">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <a href="/" className="text-lg font-display font-bold text-gradient-gold">
            CoWork<span className="text-foreground">Elite</span>
          </a>
          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <a href="#planos" className="hover:text-foreground transition-colors">Planos</a>
            <a href="#beneficios" className="hover:text-foreground transition-colors">Benefícios</a>
            <a href="#contato" className="hover:text-foreground transition-colors">Contato</a>
            <button onClick={() => navigate("/agendar")} className="hover:text-foreground transition-colors">Agendar</button>
            <button onClick={() => navigate("/auth")} className="hover:text-gold transition-colors">Login</button>
          </div>
          <p className="text-xs text-muted-foreground">© 2026 CoWorkElite. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
