import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { LogOut, LayoutDashboard, Users, Calendar, BarChart3 } from "lucide-react";
import CRMKanban from "@/components/dashboard/CRMKanban";
import Analytics from "@/components/dashboard/Analytics";
import BookingsList from "@/components/dashboard/BookingsList";
import LeadsList from "@/components/dashboard/LeadsList";

const tabs = [
  { id: "kanban", label: "Pipeline", icon: LayoutDashboard },
  { id: "leads", label: "Leads", icon: Users },
  { id: "bookings", label: "Reservas", icon: Calendar },
  { id: "analytics", label: "Métricas", icon: BarChart3 },
] as const;

type Tab = (typeof tabs)[number]["id"];

const Dashboard = () => {
  const { user, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<Tab>("kanban");

  useEffect(() => {
    if (!loading && !user) navigate("/auth");
  }, [user, loading, navigate]);

  if (loading) return <div className="min-h-screen bg-background flex items-center justify-center"><p className="text-muted-foreground">Carregando...</p></div>;
  if (!user) return null;

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside className="w-64 border-r border-border/50 glass-card hidden md:flex flex-col p-4">
        <a href="/" className="text-lg font-display font-bold text-gradient-gold mb-8 px-2">
          CoWork<span className="text-foreground">Elite</span>
        </a>
        <nav className="flex-1 space-y-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${activeTab === tab.id ? "bg-gold/10 text-gold font-medium" : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"}`}>
                <Icon className="w-4 h-4" /> {tab.label}
              </button>
            );
          })}
        </nav>
        <Button variant="ghost" size="sm" onClick={signOut} className="justify-start text-muted-foreground">
          <LogOut className="w-4 h-4" /> Sair
        </Button>
      </aside>

      {/* Mobile nav */}
      <div className="fixed bottom-0 left-0 right-0 md:hidden glass-card border-t border-border/50 z-50">
        <div className="flex">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                className={`flex-1 flex flex-col items-center py-3 text-xs ${activeTab === tab.id ? "text-gold" : "text-muted-foreground"}`}>
                <Icon className="w-5 h-5 mb-1" /> {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main */}
      <main className="flex-1 overflow-auto pb-20 md:pb-0">
        <div className="p-6 md:p-8">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} key={activeTab}>
            {activeTab === "kanban" && <CRMKanban />}
            {activeTab === "leads" && <LeadsList />}
            {activeTab === "bookings" && <BookingsList />}
            {activeTab === "analytics" && <Analytics />}
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
