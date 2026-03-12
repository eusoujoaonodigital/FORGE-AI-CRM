import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { TrendingUp, Users, DollarSign, Percent, Calendar, Building, Target } from "lucide-react";
import { format, subMonths, subDays } from "date-fns";
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const Analytics = () => {
  const [stats, setStats] = useState({ mrr: 0, totalLeads: 0, totalBookings: 0, churnRate: 0, ltv: 0, occupancy: 0, conversionRate: 0 });
  const [dailyLeads, setDailyLeads] = useState<{ date: string; count: number }[]>([]);
  const [stageConversion, setStageConversion] = useState<{ stage: string; count: number }[]>([]);

  useEffect(() => {
    const fetchStats = async () => {
      const [{ count: leadCount }, { count: bookingCount }, { data: subs }, { data: allSubs }, { data: rooms }, { data: todayBookings }, { data: leads }, { data: stages }, { data: cards }] = await Promise.all([
        supabase.from("leads").select("id", { count: "exact", head: true }),
        supabase.from("bookings").select("id", { count: "exact", head: true }),
        supabase.from("subscriptions").select("*").eq("status", "active"),
        supabase.from("subscriptions").select("*"),
        supabase.from("rooms").select("id", { count: "exact", head: true }),
        supabase.from("bookings").select("id", { count: "exact", head: true }).eq("booking_date", format(new Date(), "yyyy-MM-dd")).neq("status", "cancelled"),
        supabase.from("leads").select("created_at").order("created_at", { ascending: false }).limit(500),
        supabase.from("pipeline_stages").select("id, name, order").order("order", { ascending: true }).limit(20),
        supabase.from("pipeline_cards").select("stage_id"),
      ]);

      const activeSubs = subs || [];
      const mrr = activeSubs.reduce((sum, s) => sum + Number(s.price), 0);

      const lastMonth = format(subMonths(new Date(), 1), "yyyy-MM");
      const cancelled = (allSubs || []).filter((s) => s.cancelled_at && s.cancelled_at.startsWith(lastMonth)).length;
      const churnRate = activeSubs.length > 0 ? Math.round((cancelled / (activeSubs.length + cancelled)) * 100) : 0;

      const avgPrice = activeSubs.length > 0 ? mrr / activeSubs.length : 0;
      const ltv = churnRate > 0 ? Math.round(avgPrice / (churnRate / 100)) : Math.round(avgPrice * 12);

      const totalSlots = (rooms?.length || 1) * 13;
      const occupancy = Math.round(((todayBookings?.length || 0) / totalSlots) * 100);

      // Conversion: leads with cards / total leads
      const leadsWithCards = new Set((cards || []).map(c => c.stage_id)).size;
      const conversionRate = (leadCount || 0) > 0 ? Math.round(((cards || []).length / (leadCount || 1)) * 100) : 0;

      setStats({ mrr, totalLeads: leadCount || 0, totalBookings: bookingCount || 0, churnRate, ltv, occupancy, conversionRate });

      // Daily leads (last 14 days)
      const daily: Record<string, number> = {};
      for (let i = 13; i >= 0; i--) daily[format(subDays(new Date(), i), "MM/dd")] = 0;
      (leads || []).forEach((l: any) => {
        const d = format(new Date(l.created_at), "MM/dd");
        if (daily[d] !== undefined) daily[d]++;
      });
      setDailyLeads(Object.entries(daily).map(([date, count]) => ({ date, count })));

      // Stage conversion
      const stageMap: Record<string, number> = {};
      (stages || []).forEach((s: any) => { stageMap[s.id] = 0; });
      (cards || []).forEach((c: any) => { if (stageMap[c.stage_id] !== undefined) stageMap[c.stage_id]++; });
      setStageConversion((stages || []).map((s: any) => ({ stage: s.name, count: stageMap[s.id] || 0 })));
    };
    fetchStats();
  }, []);

  const metricCards = [
    { label: "MRR", value: `R$ ${stats.mrr.toLocaleString("pt-BR")}`, icon: DollarSign, color: "text-lime" },
    { label: "Total Leads", value: stats.totalLeads.toString(), icon: Users, color: "text-foreground" },
    { label: "Reservas", value: stats.totalBookings.toString(), icon: Calendar, color: "text-foreground" },
    { label: "Churn", value: `${stats.churnRate}%`, icon: Percent, color: stats.churnRate > 10 ? "text-destructive" : "text-lime" },
    { label: "LTV", value: `R$ ${stats.ltv.toLocaleString("pt-BR")}`, icon: TrendingUp, color: "text-lime-light" },
    { label: "Conversão", value: `${stats.conversionRate}%`, icon: Target, color: "text-lime" },
  ];

  return (
    <div>
      <h2 className="text-2xl font-bold tracking-tighter mb-6">Analytics <span className="text-gradient-lime">Pro</span></h2>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-8">
        {metricCards.map((card) => {
          const Icon = card.icon;
          return (
            <div key={card.label} className="surface-card rounded-lg p-5">
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium">{card.label}</p>
                <Icon className={`w-4 h-4 ${card.color}`} />
              </div>
              <p className="text-2xl font-bold tracking-tighter">{card.value}</p>
            </div>
          );
        })}
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        {/* Area chart: daily leads */}
        <div className="surface-card rounded-lg p-5">
          <p className="text-sm font-medium mb-4">Leads por dia (14 dias)</p>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={dailyLeads}>
              <defs>
                <linearGradient id="limeFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(84, 81%, 44%)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(84, 81%, 44%)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(0, 0%, 12%)" />
              <XAxis dataKey="date" tick={{ fontSize: 10, fill: 'hsl(0, 0%, 45%)' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: 'hsl(0, 0%, 45%)' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: 'hsl(0, 0%, 4%)', border: '1px solid hsl(0, 0%, 12%)', borderRadius: 8, fontSize: 12 }} />
              <Area type="monotone" dataKey="count" stroke="hsl(84, 81%, 44%)" fill="url(#limeFill)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Bar chart: stage conversion */}
        <div className="surface-card rounded-lg p-5">
          <p className="text-sm font-medium mb-4">Cards por etapa do pipeline</p>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={stageConversion}>
              <defs>
                <linearGradient id="barFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(84, 81%, 44%)" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="hsl(84, 81%, 44%)" stopOpacity={0.3} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(0, 0%, 12%)" />
              <XAxis dataKey="stage" tick={{ fontSize: 10, fill: 'hsl(0, 0%, 45%)' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: 'hsl(0, 0%, 45%)' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: 'hsl(0, 0%, 4%)', border: '1px solid hsl(0, 0%, 12%)', borderRadius: 8, fontSize: 12 }} />
              <Bar dataKey="count" fill="url(#barFill)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
