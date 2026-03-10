import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { TrendingUp, Users, DollarSign, Percent, Calendar, Building } from "lucide-react";
import { format, subMonths } from "date-fns";

const Analytics = () => {
  const [stats, setStats] = useState({ mrr: 0, totalLeads: 0, totalBookings: 0, churnRate: 0, ltv: 0, occupancy: 0 });

  useEffect(() => {
    const fetchStats = async () => {
      const [{ count: leadCount }, { count: bookingCount }, { data: subs }, { data: allSubs }, { data: rooms }, { data: todayBookings }] = await Promise.all([
        supabase.from("leads").select("id", { count: "exact", head: true }),
        supabase.from("bookings").select("id", { count: "exact", head: true }),
        supabase.from("subscriptions").select("*").eq("status", "active"),
        supabase.from("subscriptions").select("*"),
        supabase.from("rooms").select("id", { count: "exact", head: true }),
        supabase.from("bookings").select("id", { count: "exact", head: true }).eq("booking_date", format(new Date(), "yyyy-MM-dd")).neq("status", "cancelled"),
      ]);

      const activeSubs = subs || [];
      const mrr = activeSubs.reduce((sum, s) => sum + Number(s.price), 0);

      // Churn: cancelled last month / total active
      const lastMonth = format(subMonths(new Date(), 1), "yyyy-MM");
      const cancelled = (allSubs || []).filter((s) => s.cancelled_at && s.cancelled_at.startsWith(lastMonth)).length;
      const churnRate = activeSubs.length > 0 ? Math.round((cancelled / (activeSubs.length + cancelled)) * 100) : 0;

      // LTV: avg subscription price * avg lifetime (simplified: MRR / churn rate or 12 months if no churn)
      const avgPrice = activeSubs.length > 0 ? mrr / activeSubs.length : 0;
      const ltv = churnRate > 0 ? Math.round(avgPrice / (churnRate / 100)) : Math.round(avgPrice * 12);

      // Occupancy: today's bookings / (rooms * 13 slots)
      const totalSlots = (rooms?.length || 1) * 13;
      const occupancy = Math.round(((todayBookings?.length || 0) / totalSlots) * 100);

      setStats({
        mrr,
        totalLeads: leadCount || 0,
        totalBookings: bookingCount || 0,
        churnRate,
        ltv,
        occupancy,
      });
    };
    fetchStats();
  }, []);

  const cards = [
    { label: "MRR", value: `R$ ${stats.mrr.toLocaleString("pt-BR")}`, icon: DollarSign, color: "text-green-400" },
    { label: "Total de Leads", value: stats.totalLeads.toString(), icon: Users, color: "text-gold" },
    { label: "Total de Reservas", value: stats.totalBookings.toString(), icon: Calendar, color: "text-blue-400" },
    { label: "Taxa de Churn", value: `${stats.churnRate}%`, icon: Percent, color: "text-red-400" },
    { label: "LTV Estimado", value: `R$ ${stats.ltv.toLocaleString("pt-BR")}`, icon: TrendingUp, color: "text-gold-light" },
    { label: "Ocupação Hoje", value: `${stats.occupancy}%`, icon: Building, color: "text-blue-400" },
  ];

  return (
    <div>
      <h2 className="text-2xl font-display font-bold mb-6">Métricas & <span className="text-gradient-gold">Analytics</span></h2>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
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
