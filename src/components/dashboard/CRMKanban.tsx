import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { DndContext, closestCenter, DragEndEvent, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useToast } from "@/hooks/use-toast";
import { User, Phone, Mail } from "lucide-react";

interface Stage { id: string; name: string; color: string | null; order: number; }
interface Lead { id: string; name: string; email: string | null; phone: string | null; company: string | null; }
interface Card { id: string; stage_id: string; lead_id: string; order: number; value: number | null; lead: Lead | null; }

const pipelineTypes = [
  { value: "vendas", label: "Vendas" },
  { value: "retencao", label: "Retenção" },
  { value: "onboarding", label: "Onboarding" },
];

function SortableCard({ card }: { card: Card }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: card.id });
  const style = { transform: CSS.Transform.toString(transform), transition };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}
      className="glass-card rounded-lg p-3 cursor-grab active:cursor-grabbing hover:border-gold/20 transition-colors">
      <div className="flex items-center gap-2 mb-1">
        <User className="w-3.5 h-3.5 text-gold" />
        <p className="text-sm font-medium truncate">{card.lead?.name || "Lead"}</p>
      </div>
      {card.lead?.email && <p className="text-xs text-muted-foreground flex items-center gap-1"><Mail className="w-3 h-3" />{card.lead.email}</p>}
      {card.lead?.phone && <p className="text-xs text-muted-foreground flex items-center gap-1"><Phone className="w-3 h-3" />{card.lead.phone}</p>}
      {card.value ? <p className="text-xs text-gold mt-1 font-medium">R$ {card.value}</p> : null}
    </div>
  );
}

const CRMKanban = () => {
  const [pipelineType, setPipelineType] = useState("vendas");
  const [stages, setStages] = useState<Stage[]>([]);
  const [cards, setCards] = useState<Card[]>([]);
  const { toast } = useToast();
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

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

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-display font-bold">Pipeline <span className="text-gradient-gold">CRM</span></h2>
        <div className="flex gap-2">
          {pipelineTypes.map((p) => (
            <button key={p.value} onClick={() => setPipelineType(p.value)}
              className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${pipelineType === p.value ? "bg-gold/10 text-gold font-medium" : "text-muted-foreground hover:text-foreground"}`}>
              {p.label}
            </button>
          ))}
        </div>
      </div>

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
                </div>
                <SortableContext items={stageCards.map((c) => c.id)} strategy={verticalListSortingStrategy}>
                  <div className="space-y-2 min-h-[100px] p-2 rounded-xl bg-secondary/20 border border-border/30">
                    {stageCards.map((card) => (
                      <SortableCard key={card.id} card={card} />
                    ))}
                    {stageCards.length === 0 && (
                      <p className="text-xs text-muted-foreground text-center py-8">Sem cards</p>
                    )}
                  </div>
                </SortableContext>
              </div>
            );
          })}
        </div>
      </DndContext>
    </div>
  );
};

export default CRMKanban;
