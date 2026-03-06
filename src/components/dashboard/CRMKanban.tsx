import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { DndContext, closestCenter, DragEndEvent, DragOverEvent, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User, Phone, Mail, Plus, X, DollarSign } from "lucide-react";

interface Stage { id: string; name: string; color: string | null; order: number; }
interface Lead { id: string; name: string; email: string | null; phone: string | null; company: string | null; }
interface Card { id: string; stage_id: string; lead_id: string; order: number; value: number | null; lead: Lead | null; }

const pipelineTypes = [
  { value: "vendas", label: "Vendas" },
  { value: "retencao", label: "Retenção" },
  { value: "onboarding", label: "Onboarding" },
];

function SortableCard({ card }: { card: Card }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: card.id });
  const style = { transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.5 : 1 };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}
      className="glass-card rounded-lg p-3 cursor-grab active:cursor-grabbing hover:border-gold/20 transition-colors">
      <div className="flex items-center gap-2 mb-1">
        <User className="w-3.5 h-3.5 text-gold shrink-0" />
        <p className="text-sm font-medium truncate">{card.lead?.name || "Lead"}</p>
      </div>
      {card.lead?.email && <p className="text-xs text-muted-foreground flex items-center gap-1"><Mail className="w-3 h-3" />{card.lead.email}</p>}
      {card.lead?.phone && <p className="text-xs text-muted-foreground flex items-center gap-1"><Phone className="w-3 h-3" />{card.lead.phone}</p>}
      {card.value ? <p className="text-xs text-gold mt-1 font-medium flex items-center gap-1"><DollarSign className="w-3 h-3" />R$ {card.value}</p> : null}
    </div>
  );
}

const CRMKanban = () => {
  const [pipelineType, setPipelineType] = useState("vendas");
  const [stages, setStages] = useState<Stage[]>([]);
  const [cards, setCards] = useState<Card[]>([]);
  const [showAddLead, setShowAddLead] = useState<string | null>(null);
  const [showAddStage, setShowAddStage] = useState(false);
  const [newLead, setNewLead] = useState({ name: "", email: "", phone: "", value: "" });
  const [newStageName, setNewStageName] = useState("");
  const [newStageColor, setNewStageColor] = useState("#C8A94E");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 8 } }));

  const fetchData = useCallback(async () => {
    const { data: stagesData } = await supabase.from("pipeline_stages").select("*").eq("pipeline_type", pipelineType).order("order", { ascending: true });
    if (stagesData) {
      setStages(stagesData);
      const stageIds = stagesData.map((s) => s.id);
      if (stageIds.length > 0) {
        const { data: cardsData } = await supabase.from("pipeline_cards").select("*,lead:leads(*)").in("stage_id", stageIds).order("order", { ascending: true });
        if (cardsData) setCards(cardsData as unknown as Card[]);
      } else {
        setCards([]);
      }
    }
  }, [pipelineType]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const cardId = active.id as string;
    const overStageId = stages.find((s) => s.id === over.id)?.id;
    const overCard = cards.find((c) => c.id === over.id);
    const targetStageId = overStageId || overCard?.stage_id;

    if (!targetStageId) return;

    setCards((prev) => prev.map((c) => c.id === cardId ? { ...c, stage_id: targetStageId } : c));

    const { error } = await supabase.from("pipeline_cards").update({ stage_id: targetStageId }).eq("id", cardId);
    if (error) {
      toast({ title: "Erro ao mover card", variant: "destructive" });
      fetchData();
    }
  };

  const handleAddLead = async (stageId: string) => {
    if (!newLead.name) return;
    setLoading(true);
    try {
      // Create lead
      const { data: lead, error: leadErr } = await supabase.from("leads").insert({
        name: newLead.name,
        email: newLead.email || null,
        phone: newLead.phone || null,
        source: "manual",
        status: "new",
      }).select("id").single();
      if (leadErr) throw leadErr;

      // Create pipeline card
      const { error: cardErr } = await supabase.from("pipeline_cards").insert({
        lead_id: lead.id,
        stage_id: stageId,
        order: cards.filter((c) => c.stage_id === stageId).length,
        value: newLead.value ? parseFloat(newLead.value) : null,
      });
      if (cardErr) throw cardErr;

      toast({ title: "Lead adicionado ao pipeline!" });
      setNewLead({ name: "", email: "", phone: "", value: "" });
      setShowAddLead(null);
      fetchData();
    } catch (err: unknown) {
      toast({ title: "Erro", description: err instanceof Error ? err.message : "Erro", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleAddStage = async () => {
    if (!newStageName) return;
    setLoading(true);
    try {
      const { error } = await supabase.from("pipeline_stages").insert({
        name: newStageName,
        pipeline_type: pipelineType,
        order: stages.length,
        color: newStageColor,
      });
      if (error) throw error;
      toast({ title: "Etapa criada!" });
      setNewStageName("");
      setShowAddStage(false);
      fetchData();
    } catch (err: unknown) {
      toast({ title: "Erro", description: err instanceof Error ? err.message : "Erro", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const stageColors = ["#C8A94E", "#22C55E", "#3B82F6", "#F97316", "#EF4444", "#8B5CF6", "#EC4899"];

  return (
    <div>
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <h2 className="text-2xl font-display font-bold">Pipeline <span className="text-gradient-gold">CRM</span></h2>
        <div className="flex items-center gap-2">
          <div className="flex gap-1 bg-secondary/30 rounded-lg p-1">
            {pipelineTypes.map((p) => (
              <button key={p.value} onClick={() => setPipelineType(p.value)}
                className={`px-3 py-1.5 rounded-md text-sm transition-all ${pipelineType === p.value ? "bg-gold/15 text-gold font-medium shadow-sm" : "text-muted-foreground hover:text-foreground"}`}>
                {p.label}
              </button>
            ))}
          </div>
          <Button variant="gold-outline" size="sm" onClick={() => setShowAddStage(!showAddStage)}>
            <Plus className="w-4 h-4" /> Etapa
          </Button>
        </div>
      </div>

      {/* Add Stage Form */}
      {showAddStage && (
        <div className="glass-card-gold rounded-xl p-4 mb-6 flex items-end gap-3 flex-wrap">
          <div className="flex-1 min-w-[200px]">
            <Label>Nome da etapa</Label>
            <Input placeholder="Ex: Qualificação" value={newStageName} onChange={(e) => setNewStageName(e.target.value)} className="mt-1 bg-secondary/50 border-border/50" />
          </div>
          <div>
            <Label>Cor</Label>
            <div className="flex gap-1.5 mt-1">
              {stageColors.map((c) => (
                <button key={c} onClick={() => setNewStageColor(c)}
                  className={`w-7 h-7 rounded-full border-2 transition-all ${newStageColor === c ? "border-foreground scale-110" : "border-transparent"}`}
                  style={{ backgroundColor: c }} />
              ))}
            </div>
          </div>
          <Button variant="gold" size="sm" onClick={handleAddStage} disabled={!newStageName || loading}>Criar</Button>
          <Button variant="ghost" size="sm" onClick={() => setShowAddStage(false)}><X className="w-4 h-4" /></Button>
        </div>
      )}

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <div className="flex gap-4 overflow-x-auto pb-4">
          {stages.map((stage) => {
            const stageCards = cards.filter((c) => c.stage_id === stage.id);
            return (
              <div key={stage.id} className="flex-shrink-0 w-72">
                <div className="flex items-center gap-2 mb-3 px-1">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: stage.color || "hsl(var(--gold))" }} />
                  <h3 className="text-sm font-medium">{stage.name}</h3>
                  <span className="text-xs text-muted-foreground ml-auto">{stageCards.length}</span>
                  <button onClick={() => setShowAddLead(showAddLead === stage.id ? null : stage.id)}
                    className="p-1 rounded hover:bg-secondary/50 text-muted-foreground hover:text-gold transition-colors">
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Add lead inline form */}
                {showAddLead === stage.id && (
                  <div className="glass-card-gold rounded-lg p-3 mb-2 space-y-2">
                    <Input placeholder="Nome *" value={newLead.name} onChange={(e) => setNewLead({ ...newLead, name: e.target.value })} className="h-8 text-xs bg-secondary/50 border-border/50" />
                    <Input placeholder="E-mail" value={newLead.email} onChange={(e) => setNewLead({ ...newLead, email: e.target.value })} className="h-8 text-xs bg-secondary/50 border-border/50" />
                    <Input placeholder="Telefone" value={newLead.phone} onChange={(e) => setNewLead({ ...newLead, phone: e.target.value })} className="h-8 text-xs bg-secondary/50 border-border/50" />
                    <Input placeholder="Valor R$" type="number" value={newLead.value} onChange={(e) => setNewLead({ ...newLead, value: e.target.value })} className="h-8 text-xs bg-secondary/50 border-border/50" />
                    <div className="flex gap-2">
                      <Button variant="gold" size="sm" className="h-7 text-xs flex-1" onClick={() => handleAddLead(stage.id)} disabled={!newLead.name || loading}>
                        {loading ? "..." : "Adicionar"}
                      </Button>
                      <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={() => { setShowAddLead(null); setNewLead({ name: "", email: "", phone: "", value: "" }); }}>
                        <X className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                )}

                <SortableContext items={stageCards.map((c) => c.id)} strategy={verticalListSortingStrategy}>
                  <div className="space-y-2 min-h-[100px] p-2 rounded-xl bg-secondary/20 border border-border/30">
                    {stageCards.map((card) => (
                      <SortableCard key={card.id} card={card} />
                    ))}
                    {stageCards.length === 0 && showAddLead !== stage.id && (
                      <button onClick={() => setShowAddLead(stage.id)}
                        className="w-full text-xs text-muted-foreground text-center py-8 hover:text-gold transition-colors">
                        <Plus className="w-4 h-4 mx-auto mb-1" />
                        Adicionar lead
                      </button>
                    )}
                  </div>
                </SortableContext>
              </div>
            );
          })}

          {/* Quick add stage column */}
          {!showAddStage && (
            <button onClick={() => setShowAddStage(true)}
              className="flex-shrink-0 w-72 min-h-[150px] rounded-xl border-2 border-dashed border-border/30 flex flex-col items-center justify-center text-muted-foreground hover:text-gold hover:border-gold/30 transition-colors">
              <Plus className="w-6 h-6 mb-2" />
              <span className="text-sm">Nova Etapa</span>
            </button>
          )}
        </div>
      </DndContext>
    </div>
  );
};

export default CRMKanban;
