import { useNavigate } from "react-router-dom";

const Footer = () => {
  const navigate = useNavigate();

  return (
    <footer className="border-t border-border py-10">
      <div className="container">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <a href="/" className="text-lg font-bold tracking-tighter">
            <span className="text-gradient-lime">Forge</span>
            <span className="text-foreground"> AI</span>
          </a>
          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <a href="#recursos" className="hover:text-foreground transition-colors">Recursos</a>
            <a href="#planos" className="hover:text-foreground transition-colors">Planos</a>
            <a href="#contato" className="hover:text-foreground transition-colors">Contato</a>
            <button onClick={() => navigate("/auth")} className="hover:text-lime transition-colors">Login</button>
          </div>
          <p className="text-xs text-muted-foreground">© 2026 Forge AI CRM. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
