import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Users, Mail, Phone, Building, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

interface Lead {
  id: string; name: string; email: string | null; phone: string | null;
  company: string | null; status: string; source: string | null;
  utm_source: string | null; utm_medium: string | null; utm_campaign: string | null; created_at: string;
}

const LeadsList = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phone: "", company: "", source: "manual" });
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const fetchLeads = () => {
    supabase.from("leads").select("*").order("created_at", { ascending: false }).limit(100)
      .then(({ data }) => { if (data) setLeads(data); });
  };

  useEffect(() => { fetchLeads(); }, []);

  const handleCreate = async () => {
    if (!form.name) return;
    setLoading(true);
    try {
      const { error } = await supabase.from("leads").insert({ name: form.name, email: form.email || null, phone: form.phone || null, company: form.company || null, source: form.source, status: "new" });
      if (error) throw error;
      const { data: lead } = await supabase.from("leads").select("id").eq("name", form.name).order("created_at", { ascending: false }).limit(1).single();
      if (lead) {
        const { data: firstStage } = await supabase.from("pipeline_stages").select("id").eq("pipeline_type", "vendas").order("order", { ascending: true }).limit(1).single();
        if (firstStage) await supabase.from("pipeline_cards").insert({ lead_id: lead.id, stage_id: firstStage.id, order: 0 });
      }
      toast({ title: "Lead criado!" });
      setForm({ name: "", email: "", phone: "", company: "", source: "manual" });
      setShowForm(false);
      fetchLeads();
    } catch (err: unknown) {
      toast({ title: "Erro", description: err instanceof Error ? err.message : "Erro ao criar", variant: "destructive" });
    } finally { setLoading(false); }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold tracking-tighter">Todos os <span className="text-gradient-lime">Leads</span></h2>
        <Button variant="lime" size="sm" onClick={() => setShowForm(!showForm)}>
          {showForm ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
          {showForm ? "Cancelar" : "Novo Lead"}
        </Button>
      </div>

      {showForm && (
        <div className="surface-card-lime rounded-lg p-5 mb-6 space-y-4">
          <h3 className="font-bold text-sm">Cadastrar Novo Lead</h3>
          <div className="grid sm:grid-cols-2 gap-3">
            <div><Label>Nome *</Label><Input placeholder="Nome" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="mt-1 bg-secondary/50 border-border" /></div>
            <div><Label>E-mail</Label><Input type="email" placeholder="email@exemplo.com" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="mt-1 bg-secondary/50 border-border" /></div>
            <div><Label>Telefone</Label><Input placeholder="(11) 99999-9999" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="mt-1 bg-secondary/50 border-border" /></div>
            <div><Label>Empresa</Label><Input placeholder="Empresa" value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} className="mt-1 bg-secondary/50 border-border" /></div>
          </div>
          <div className="flex gap-2">
            <select value={form.source} onChange={(e) => setForm({ ...form, source: e.target.value })} className="bg-secondary border border-border rounded-lg px-3 py-2 text-sm">
              <option value="manual">Manual</option><option value="website">Website</option><option value="whatsapp">WhatsApp</option><option value="indicacao">Indicação</option>
            </select>
            <Button variant="lime" onClick={handleCreate} disabled={!form.name || loading}>{loading ? "Criando..." : "Criar Lead"}</Button>
          </div>
        </div>
      )}

      {leads.length === 0 ? (
        <div className="surface-card rounded-lg p-12 text-center">
          <Users className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
          <p className="text-muted-foreground text-sm">Nenhum lead registrado</p>
          <Button variant="lime-outline" size="sm" className="mt-4" onClick={() => setShowForm(true)}><Plus className="w-4 h-4" /> Criar primeiro</Button>
        </div>
      ) : (
        <div className="space-y-2">
          {leads.map((lead) => (
            <div key={lead.id} className="surface-card rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-sm">{lead.name}</p>
                  <div className="flex items-center gap-3 mt-1 flex-wrap">
                    {lead.email && <span className="text-xs text-muted-foreground flex items-center gap-1"><Mail className="w-3 h-3" />{lead.email}</span>}
                    {lead.phone && <span className="text-xs text-muted-foreground flex items-center gap-1"><Phone className="w-3 h-3" />{lead.phone}</span>}
                    {lead.company && <span className="text-xs text-muted-foreground flex items-center gap-1"><Building className="w-3 h-3" />{lead.company}</span>}
                  </div>
                </div>
                <div className="text-right">
                  <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-lime/10 text-lime">{lead.status}</span>
                  {lead.source && <p className="text-xs text-muted-foreground mt-1">{lead.source}</p>}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default LeadsList;
