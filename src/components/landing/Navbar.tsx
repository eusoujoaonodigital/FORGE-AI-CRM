import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Menu, X, LogIn } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

const links = [
  { label: "Benefícios", href: "#beneficios" },
  { label: "Planos", href: "#planos" },
  { label: "Contato", href: "#contato" },
];

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-card border-b border-border/50">
      <div className="container flex items-center justify-between h-16">
        <a href="/" className="text-xl font-display font-bold text-gradient-gold">
          CoWork<span className="text-foreground">Elite</span>
        </a>

        <div className="hidden md:flex items-center gap-8">
          {links.map((l) => (
            <a key={l.href} href={l.href} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              {l.label}
            </a>
          ))}
          {user ? (
            <Button variant="gold-outline" size="sm" onClick={() => navigate("/dashboard")}>
              Dashboard
            </Button>
          ) : (
            <Button variant="ghost" size="sm" onClick={() => navigate("/auth")} className="text-muted-foreground hover:text-foreground">
              <LogIn className="w-4 h-4" /> Entrar
            </Button>
          )}
          <Button variant="gold" size="sm" onClick={() => navigate("/agendar")}>
            Reservar Sala
          </Button>
        </div>

        <button onClick={() => setOpen(!open)} className="md:hidden p-2 text-foreground">
          {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
            className="md:hidden glass-card border-t border-border/50 overflow-hidden">
            <div className="container py-4 flex flex-col gap-4">
              {links.map((l) => (
                <a key={l.href} href={l.href} onClick={() => setOpen(false)} className="text-sm text-muted-foreground hover:text-foreground transition-colors py-2">
                  {l.label}
                </a>
              ))}
              {user ? (
                <Button variant="gold-outline" size="sm" className="w-full" onClick={() => { setOpen(false); navigate("/dashboard"); }}>
                  Dashboard
                </Button>
              ) : (
                <Button variant="ghost" size="sm" className="w-full justify-start" onClick={() => { setOpen(false); navigate("/auth"); }}>
                  <LogIn className="w-4 h-4" /> Entrar
                </Button>
              )}
              <Button variant="gold" size="sm" className="w-full" onClick={() => { setOpen(false); navigate("/agendar"); }}>
                Reservar Sala
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
