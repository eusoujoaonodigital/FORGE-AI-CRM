import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { TrendingUp, Users, DollarSign, Percent } from "lucide-react";

const Analytics = () => {
  const [stats, setStats] = useState({ mrr: 0, totalLeads: 0, totalBookings: 0, churnRate: 0 });

  useEffect(() => {
    const fetchStats = async () => {
      const [{ count: leadCount }, { count: bookingCount }, { data: subs }] = await Promise.all([
        supabase.from("leads").select("id", { count: "exact", head: true }),
        supabase.from("bookings").select("id", { count: "exact", head: true }),
        supabase.from("subscriptions").select("*").eq("status", "active"),
      ]);

      const mrr = subs?.reduce((sum, s) => sum + Number(s.price), 0) || 0;
      setStats({
        mrr,
        totalLeads: leadCount || 0,
        totalBookings: bookingCount || 0,
        churnRate: 0,
      });
    };
    fetchStats();
  }, []);

  const cards = [
    { label: "MRR", value: `R$ ${stats.mrr.toLocaleString("pt-BR")}`, icon: DollarSign, color: "text-green-400" },
    { label: "Total de Leads", value: stats.totalLeads.toString(), icon: Users, color: "text-gold" },
    { label: "Total de Reservas", value: stats.totalBookings.toString(), icon: TrendingUp, color: "text-blue-400" },
    { label: "Taxa de Churn", value: `${stats.churnRate}%`, icon: Percent, color: "text-red-400" },
  ];

  return (
    <div>
      <h2 className="text-2xl font-display font-bold mb-6">Métricas & <span className="text-gradient-gold">Analytics</span></h2>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <div key={card.label} className="glass-card rounded-xl p-5">
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm text-muted-foreground">{card.label}</p>
                <Icon className={`w-5 h-5 ${card.color}`} />
              </div>
              <p className="text-2xl font-display font-bold">{card.value}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Analytics;
