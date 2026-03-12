import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Eye, Users, TrendingUp } from "lucide-react";
import { format, subDays } from "date-fns";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface Props { pageId: string; }

const PageAnalytics = ({ pageId }: Props) => {
  const [stats, setStats] = useState({ total: 0, unique: 0, today: 0 });
  const [utmBreakdown, setUtmBreakdown] = useState<{ source: string; count: number }[]>([]);
  const [dailyViews, setDailyViews] = useState<{ date: string; views: number }[]>([]);

  useEffect(() => {
    const fetch = async () => {
      const { data: views } = await supabase.from("page_views").select("*").eq("page_id", pageId);
      if (!views) return;
      const total = views.length;
      const uniqueVisitors = new Set(views.map((v: any) => v.visitor_id).filter(Boolean)).size;
      const todayStr = format(new Date(), "yyyy-MM-dd");
      const today = views.filter((v: any) => v.created_at.startsWith(todayStr)).length;
      setStats({ total, unique: uniqueVisitors, today });

      const utmMap: Record<string, number> = {};
      views.forEach((v: any) => { const src = v.utm_source || "direto"; utmMap[src] = (utmMap[src] || 0) + 1; });
      setUtmBreakdown(Object.entries(utmMap).map(([source, count]) => ({ source, count })).sort((a, b) => b.count - a.count));

      const daily: Record<string, number> = {};
      for (let i = 13; i >= 0; i--) daily[format(subDays(new Date(), i), "MM/dd")] = 0;
      views.forEach((v: any) => { const d = format(new Date(v.created_at), "MM/dd"); if (daily[d] !== undefined) daily[d]++; });
      setDailyViews(Object.entries(daily).map(([date, views]) => ({ date, views })));
    };
    fetch();
  }, [pageId]);

  return (
    <div className="space-y-4">
      <div className="grid sm:grid-cols-3 gap-3">
        {[
          { label: "Total de Acessos", value: stats.total, icon: Eye, color: "text-lime" },
          { label: "Visitantes Únicos", value: stats.unique, icon: Users, color: "text-foreground" },
          { label: "Acessos Hoje", value: stats.today, icon: TrendingUp, color: "text-lime" },
        ].map(c => (
          <div key={c.label} className="surface-card rounded-lg p-5">
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium">{c.label}</p>
              <c.icon className={`w-4 h-4 ${c.color}`} />
            </div>
            <p className="text-2xl font-bold tracking-tighter">{c.value}</p>
          </div>
        ))}
      </div>

      <div className="surface-card rounded-lg p-5">
        <p className="text-sm font-medium mb-4">Acessos por dia (14 dias)</p>
        <ResponsiveContainer width="100%" height={200}>
          <AreaChart data={dailyViews}>
            <defs>
              <linearGradient id="pageLimeFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(84, 81%, 44%)" stopOpacity={0.3} />
                <stop offset="95%" stopColor="hsl(84, 81%, 44%)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(0, 0%, 12%)" />
            <XAxis dataKey="date" tick={{ fontSize: 10, fill: 'hsl(0, 0%, 45%)' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 10, fill: 'hsl(0, 0%, 45%)' }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={{ background: 'hsl(0, 0%, 4%)', border: '1px solid hsl(0, 0%, 12%)', borderRadius: 8, fontSize: 12 }} />
            <Area type="monotone" dataKey="views" stroke="hsl(84, 81%, 44%)" fill="url(#pageLimeFill)" strokeWidth={2} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="surface-card rounded-lg p-5">
        <p className="text-sm font-medium mb-4">Fontes de Tráfego (UTM Source)</p>
        {utmBreakdown.length === 0 ? (
          <p className="text-xs text-muted-foreground">Nenhum acesso registrado</p>
        ) : (
          <div className="space-y-2">
            {utmBreakdown.map(u => (
              <div key={u.source} className="flex items-center gap-3">
                <span className="text-sm flex-1 font-mono">{u.source}</span>
                <div className="flex-1 h-1.5 bg-secondary rounded-full overflow-hidden">
                  <div className="h-full bg-lime/60 rounded-full" style={{ width: `${(u.count / stats.total) * 100}%` }} />
                </div>
                <span className="text-xs text-muted-foreground w-10 text-right">{u.count}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PageAnalytics;
