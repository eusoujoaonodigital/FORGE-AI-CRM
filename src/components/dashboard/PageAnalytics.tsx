import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Eye, Users, TrendingUp } from "lucide-react";
import { format, subDays } from "date-fns";

interface Props {
  pageId: string;
}

const PageAnalytics = ({ pageId }: Props) => {
  const [stats, setStats] = useState({ total: 0, unique: 0, today: 0 });
  const [utmBreakdown, setUtmBreakdown] = useState<{ source: string; count: number }[]>([]);
  const [dailyViews, setDailyViews] = useState<{ date: string; count: number }[]>([]);

  useEffect(() => {
    const fetch = async () => {
      const { data: views } = await supabase.from("page_views").select("*").eq("page_id", pageId);
      if (!views) return;

      const total = views.length;
      const uniqueVisitors = new Set(views.map((v: any) => v.visitor_id).filter(Boolean)).size;
      const todayStr = format(new Date(), "yyyy-MM-dd");
      const today = views.filter((v: any) => v.created_at.startsWith(todayStr)).length;
      setStats({ total, unique: uniqueVisitors, today });

      // UTM breakdown
      const utmMap: Record<string, number> = {};
      views.forEach((v: any) => {
        const src = v.utm_source || "direto";
        utmMap[src] = (utmMap[src] || 0) + 1;
      });
      setUtmBreakdown(Object.entries(utmMap).map(([source, count]) => ({ source, count })).sort((a, b) => b.count - a.count));

      // Daily views (last 14 days)
      const daily: Record<string, number> = {};
      for (let i = 13; i >= 0; i--) {
        daily[format(subDays(new Date(), i), "MM/dd")] = 0;
      }
      views.forEach((v: any) => {
        const d = format(new Date(v.created_at), "MM/dd");
        if (daily[d] !== undefined) daily[d]++;
      });
      setDailyViews(Object.entries(daily).map(([date, count]) => ({ date, count })));
    };
    fetch();
  }, [pageId]);

  const maxDaily = Math.max(...dailyViews.map(d => d.count), 1);

  return (
    <div className="space-y-6">
      {/* Summary cards */}
      <div className="grid sm:grid-cols-3 gap-4">
        {[
          { label: "Total de Acessos", value: stats.total, icon: Eye, color: "text-gold" },
          { label: "Visitantes Únicos", value: stats.unique, icon: Users, color: "text-blue-400" },
          { label: "Acessos Hoje", value: stats.today, icon: TrendingUp, color: "text-green-400" },
        ].map(c => (
          <div key={c.label} className="glass-card rounded-xl p-5">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm text-muted-foreground">{c.label}</p>
              <c.icon className={`w-5 h-5 ${c.color}`} />
            </div>
            <p className="text-2xl font-display font-bold">{c.value}</p>
          </div>
        ))}
      </div>

      {/* Bar chart */}
      <div className="glass-card rounded-xl p-5">
        <p className="text-sm font-medium mb-4">Acessos por dia (últimos 14 dias)</p>
        <div className="flex items-end gap-1 h-32">
          {dailyViews.map(d => (
            <div key={d.date} className="flex-1 flex flex-col items-center gap-1">
              <span className="text-[9px] text-muted-foreground">{d.count || ""}</span>
              <div className="w-full bg-gold/60 rounded-t" style={{ height: `${(d.count / maxDaily) * 100}%`, minHeight: d.count > 0 ? 4 : 0 }} />
              <span className="text-[8px] text-muted-foreground">{d.date}</span>
            </div>
          ))}
        </div>
      </div>

      {/* UTM breakdown */}
      <div className="glass-card rounded-xl p-5">
        <p className="text-sm font-medium mb-4">Fontes de Tráfego (UTM Source)</p>
        {utmBreakdown.length === 0 ? (
          <p className="text-xs text-muted-foreground">Nenhum acesso registrado</p>
        ) : (
          <div className="space-y-2">
            {utmBreakdown.map(u => (
              <div key={u.source} className="flex items-center gap-3">
                <span className="text-sm flex-1">{u.source}</span>
                <div className="flex-1 h-2 bg-secondary/50 rounded-full overflow-hidden">
                  <div className="h-full bg-gold/60 rounded-full" style={{ width: `${(u.count / stats.total) * 100}%` }} />
                </div>
                <span className="text-xs text-muted-foreground w-12 text-right">{u.count}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PageAnalytics;
