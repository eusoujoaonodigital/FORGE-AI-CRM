import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  LogOut, LayoutDashboard, Users, Calendar, BarChart3,
  Globe, FileQuestion, Settings, Zap
} from "lucide-react";
import CRMKanban from "@/components/dashboard/CRMKanban";
import Analytics from "@/components/dashboard/Analytics";
import BookingsList from "@/components/dashboard/BookingsList";
import LeadsList from "@/components/dashboard/LeadsList";
import LandingPagesList from "@/components/dashboard/LandingPagesList";
import QuizList from "@/components/dashboard/QuizList";

const tabs = [
  { id: "kanban", label: "Pipeline", icon: LayoutDashboard, group: "crm" },
  { id: "leads", label: "Leads", icon: Users, group: "crm" },
  { id: "bookings", label: "Reservas", icon: Calendar, group: "crm" },
  { id: "analytics", label: "Analytics", icon: BarChart3, group: "crm" },
  { id: "pages", label: "Pages", icon: Globe, group: "tools" },
  { id: "quizzes", label: "Quizzes", icon: FileQuestion, group: "tools" },
] as const;

type Tab = (typeof tabs)[number]["id"];

const Dashboard = () => {
  const { user, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<Tab>("kanban");

  useEffect(() => {
    if (!loading && !user) navigate("/auth");
  }, [user, loading, navigate]);

  if (loading) return <div className="min-h-screen bg-background flex items-center justify-center"><p className="text-muted-foreground text-sm">Carregando...</p></div>;
  if (!user) return null;

  const crmTabs = tabs.filter(t => t.group === "crm");
  const toolsTabs = tabs.filter(t => t.group === "tools");

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside className="w-56 border-r border-border bg-card hidden md:flex flex-col shrink-0">
        <div className="h-14 flex items-center px-5 border-b border-border">
          <a href="/" className="text-base font-bold tracking-tighter">
            <span className="text-gradient-lime">Forge</span>
            <span className="text-foreground"> AI</span>
          </a>
        </div>
        <nav className="flex-1 py-4 px-3 space-y-0.5">
          <p className="text-[10px] uppercase tracking-widest text-muted-foreground px-3 mb-2 font-medium">CRM</p>
          {crmTabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${activeTab === tab.id ? "bg-secondary text-foreground font-medium" : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"}`}>
                <Icon className="w-4 h-4" /> {tab.label}
              </button>
            );
          })}
          <div className="pt-4 pb-1">
            <p className="text-[10px] uppercase tracking-widest text-muted-foreground px-3 mb-2 font-medium">Ferramentas</p>
          </div>
          {toolsTabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${activeTab === tab.id ? "bg-secondary text-foreground font-medium" : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"}`}>
                <Icon className="w-4 h-4" /> {tab.label}
              </button>
            );
          })}
        </nav>
        <div className="p-3 border-t border-border">
          <Button variant="ghost" size="sm" onClick={signOut} className="w-full justify-start text-muted-foreground text-sm">
            <LogOut className="w-4 h-4" /> Sair
          </Button>
        </div>
      </aside>

      {/* Mobile nav */}
      <div className="fixed bottom-0 left-0 right-0 md:hidden bg-card border-t border-border z-50">
        <div className="flex overflow-x-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                className={`flex-1 min-w-[60px] flex flex-col items-center py-3 text-[10px] ${activeTab === tab.id ? "text-lime" : "text-muted-foreground"}`}>
                <Icon className="w-5 h-5 mb-1" /> {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main */}
      <main className="flex-1 overflow-auto pb-20 md:pb-0">
        <div className="p-6 md:p-8">
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} key={activeTab} transition={{ duration: 0.2 }}>
            {activeTab === "kanban" && <CRMKanban />}
            {activeTab === "leads" && <LeadsList />}
            {activeTab === "bookings" && <BookingsList />}
            {activeTab === "analytics" && <Analytics />}
            {activeTab === "pages" && <LandingPagesList />}
            {activeTab === "quizzes" && <QuizList />}
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
