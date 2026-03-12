import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { DndContext, closestCorners, DragEndEvent, DragOverEvent, DragOverlay, DragStartEvent, PointerSensor, useSensor, useSensors, useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User, Phone, Mail, Plus, X, DollarSign, Trash2, Search } from "lucide-react";

interface Stage { id: string; name: string; color: string | null; order: number; pipeline_type: string; }
interface Lead { id: string; name: string; email: string | null; phone: string | null; company: string | null; }
interface Card { id: string; stage_id: string; lead_id: string; order: number; value: number | null; lead: Lead | null; }

function CardContent({ card }: { card: Card }) {
  return (
    <div className="surface-card rounded-lg p-3">
      <div className="flex items-center gap-2 mb-1">
        <User className="w-3.5 h-3.5 text-lime shrink-0" />
        <p className="text-sm font-medium truncate">{card.lead?.name || "Lead"}</p>
      </div>
      {card.lead?.email && <p className="text-xs text-muted-foreground flex items-center gap-1"><Mail className="w-3 h-3" />{card.lead.email}</p>}
      {card.lead?.phone && <p className="text-xs text-muted-foreground flex items-center gap-1"><Phone className="w-3 h-3" />{card.lead.phone}</p>}
      {card.value ? <p className="text-xs text-lime mt-1 font-medium flex items-center gap-1"><DollarSign className="w-3 h-3" />R$ {card.value}</p> : null}
    </div>
  );
}

function SortableCard({ card, onDelete }: { card: Card; onDelete: (id: string) => void }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: card.id });
  const style = { transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.3 : 1 };
  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing group relative">
      <CardContent card={card} />
      <button onClick={(e) => { e.stopPropagation(); onDelete(card.id); }}
        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 p-1 rounded-lg bg-destructive/20 hover:bg-destructive/40 text-destructive transition-all">
        <Trash2 className="w-3 h-3" />
      </button>
    </div>
  );
}

function DroppableColumn({ id, children }: { id: string; children: React.ReactNode }) {
  const { setNodeRef, isOver } = useDroppable({ id });
  return (
    <div ref={setNodeRef} className={`space-y-2 min-h-[100px] p-2 rounded-lg border transition-colors ${isOver ? "bg-lime/5 border-lime/20" : "bg-secondary/30 border-border"}`}>
      {children}
    </div>
  );
}

const CRMKanban = () => {
  const [pipelineTypes, setPipelineTypes] = useState<string[]>([]);
  const [pipelineType, setPipelineType] = useState("");
  const [stages, setStages] = useState<Stage[]>([]);
  const [cards, setCards] = useState<Card[]>([]);
  const [activeCard, setActiveCard] = useState<Card | null>(null);
  const [showAddLead, setShowAddLead] = useState<string | null>(null);
  const [showAddStage, setShowAddStage] = useState(false);
  const [showNewPipeline, setShowNewPipeline] = useState(false);
  const [newPipelineName, setNewPipelineName] = useState("");
  const [newLead, setNewLead] = useState({ name: "", email: "", phone: "", value: "" });
  const [newStageName, setNewStageName] = useState("");
  const [newStageColor, setNewStageColor] = useState("#84CC16");
  const [showGlobalLead, setShowGlobalLead] = useState(false);
  const [globalLead, setGlobalLead] = useState({ name: "", email: "", phone: "", company: "", value: "" });
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 8 } }));

  const fetchPipelineTypes = useCallback(async () => {
    const { data } = await supabase.from("pipeline_stages").select("pipeline_type");
    if (data) { const types = [...new Set(data.map(d => d.pipeline_type))]; setPipelineTypes(types); if (!pipelineType && types.length > 0) setPipelineType(types[0]); }
  }, []);

  useEffect(() => { fetchPipelineTypes(); }, [fetchPipelineTypes]);

  const fetchData = useCallback(async () => {
    if (!pipelineType) return;
    const { data: stagesData } = await supabase.from("pipeline_stages").select("*").eq("pipeline_type", pipelineType).order("order", { ascending: true });
    if (stagesData) {
      setStages(stagesData);
      const stageIds = stagesData.map(s => s.id);
      if (stageIds.length > 0) {
        const { data: cardsData } = await supabase.from("pipeline_cards").select("*,lead:leads(*)").in("stage_id", stageIds).order("order", { ascending: true });
        if (cardsData) setCards(cardsData as unknown as Card[]);
      } else setCards([]);
    }
  }, [pipelineType]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleDragStart = (event: DragStartEvent) => { const card = cards.find(c => c.id === event.active.id); if (card) setActiveCard(card); };
  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event; if (!over) return;
    const activeId = active.id as string; const overId = over.id as string;
    const ac = cards.find(c => c.id === activeId); if (!ac) return;
    const overStage = stages.find(s => s.id === overId); const overCard = cards.find(c => c.id === overId);
    const targetStageId = overStage?.id || overCard?.stage_id;
    if (targetStageId && targetStageId !== ac.stage_id) setCards(prev => prev.map(c => c.id === activeId ? { ...c, stage_id: targetStageId } : c));
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    setActiveCard(null); const { active, over } = event; if (!over) return;
    const card = cards.find(c => c.id === active.id as string); if (!card) return;
    const { error } = await supabase.from("pipeline_cards").update({ stage_id: card.stage_id }).eq("id", card.id);
    if (error) { toast({ title: "Erro ao mover", variant: "destructive" }); fetchData(); }
  };

  const handleDeleteCard = async (cardId: string) => { setCards(prev => prev.filter(c => c.id !== cardId)); await supabase.from("pipeline_cards").delete().eq("id", cardId); };
  const handleDeleteStage = async (stageId: string) => {
    if (cards.filter(c => c.stage_id === stageId).length > 0) { toast({ title: "Remova os cards primeiro", variant: "destructive" }); return; }
    await supabase.from("pipeline_stages").delete().eq("id", stageId); fetchData();
  };

  const handleAddLead = async (stageId: string) => {
    if (!newLead.name) return; setLoading(true);
    try {
      const { data: lead, error: le } = await supabase.from("leads").insert({ name: newLead.name, email: newLead.email || null, phone: newLead.phone || null, source: "manual", status: "new" }).select("id").single();
      if (le) throw le;
      await supabase.from("pipeline_cards").insert({ lead_id: lead.id, stage_id: stageId, order: cards.filter(c => c.stage_id === stageId).length, value: newLead.value ? parseFloat(newLead.value) : null });
      toast({ title: "Lead adicionado!" }); setNewLead({ name: "", email: "", phone: "", value: "" }); setShowAddLead(null); fetchData();
    } catch (err: any) { toast({ title: err.message, variant: "destructive" }); } finally { setLoading(false); }
  };

  const handleAddStage = async () => {
    if (!newStageName) return; setLoading(true);
    try {
      await supabase.from("pipeline_stages").insert({ name: newStageName, pipeline_type: pipelineType, order: stages.length, color: newStageColor });
      toast({ title: "Etapa criada!" }); setNewStageName(""); setShowAddStage(false); fetchData();
    } catch (err: any) { toast({ title: err.message, variant: "destructive" }); } finally { setLoading(false); }
  };

  const handleCreatePipeline = async () => {
    if (!newPipelineName) return;
    const slug = newPipelineName.toLowerCase().replace(/\s+/g, "_").replace(/[^a-z0-9_]/g, "");
    await supabase.from("pipeline_stages").insert({ name: "Novo Lead", pipeline_type: slug, order: 0, color: "#84CC16" });
    toast({ title: `Pipeline "${newPipelineName}" criado!` }); setNewPipelineName(""); setShowNewPipeline(false);
    await fetchPipelineTypes(); setPipelineType(slug);
  };

  const handleGlobalAddLead = async () => {
    if (!globalLead.name) return; setLoading(true);
    try {
      const { data: lead, error: le } = await supabase.from("leads").insert({ name: globalLead.name, email: globalLead.email || null, phone: globalLead.phone || null, company: globalLead.company || null, source: "manual", status: "new" }).select("id").single();
      if (le) throw le;
      if (stages.length > 0) await supabase.from("pipeline_cards").insert({ lead_id: lead.id, stage_id: stages[0].id, order: 0, value: globalLead.value ? parseFloat(globalLead.value) : null });
      toast({ title: "Lead criado!" }); setGlobalLead({ name: "", email: "", phone: "", company: "", value: "" }); setShowGlobalLead(false); fetchData();
    } catch (err: any) { toast({ title: err.message, variant: "destructive" }); } finally { setLoading(false); }
  };

  const handleDeletePipeline = async () => {
    if (cards.length > 0) { toast({ title: "Remova todos os cards primeiro", variant: "destructive" }); return; }
    for (const s of stages) await supabase.from("pipeline_stages").delete().eq("id", s.id);
    toast({ title: "Pipeline excluído" }); await fetchPipelineTypes(); setPipelineType(pipelineTypes.filter(p => p !== pipelineType)[0] || "");
  };

  const filteredCards = searchTerm ? cards.filter(c => c.lead?.name?.toLowerCase().includes(searchTerm.toLowerCase()) || c.lead?.email?.toLowerCase().includes(searchTerm.toLowerCase())) : cards;
  const stageColors = ["#84CC16", "#22C55E", "#3B82F6", "#F97316", "#EF4444", "#8B5CF6", "#EC4899"];

  return (
    <div>
      <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
        <h2 className="text-2xl font-bold tracking-tighter">Pipeline <span className="text-gradient-lime">CRM</span></h2>
        <div className="flex items-center gap-2 flex-wrap">
          <Button variant="lime" size="sm" onClick={() => setShowGlobalLead(true)}><Plus className="w-4 h-4" /> Novo Lead</Button>
          <Button variant="lime-outline" size="sm" onClick={() => setShowAddStage(!showAddStage)}><Plus className="w-4 h-4" /> Etapa</Button>
          <Button variant="ghost" size="sm" onClick={() => setShowNewPipeline(!showNewPipeline)}><Plus className="w-4 h-4" /> Pipeline</Button>
        </div>
      </div>

      <div className="flex items-center gap-2 mb-4 flex-wrap">
        <div className="flex gap-1 bg-secondary rounded-lg p-1 flex-wrap">
          {pipelineTypes.map(p => (
            <button key={p} onClick={() => setPipelineType(p)}
              className={`px-3 py-1.5 rounded-md text-sm transition-all ${pipelineType === p ? "bg-lime/10 text-lime font-medium" : "text-muted-foreground hover:text-foreground"}`}>
              {p}
            </button>
          ))}
        </div>
        {pipelineType && stages.length === 0 && (
          <Button variant="ghost" size="sm" className="text-destructive text-xs" onClick={handleDeletePipeline}><Trash2 className="w-3 h-3" /> Excluir</Button>
        )}
        <div className="ml-auto flex items-center gap-1 bg-secondary rounded-lg px-2">
          <Search className="w-3.5 h-3.5 text-muted-foreground" />
          <input value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Buscar..." className="bg-transparent text-sm py-1.5 outline-none w-32" />
        </div>
      </div>

      {showGlobalLead && (
        <div className="surface-card-lime rounded-lg p-4 mb-4 space-y-3">
          <h3 className="font-bold text-sm">Novo Lead Global</h3>
          <div className="grid sm:grid-cols-5 gap-2">
            <Input placeholder="Nome *" value={globalLead.name} onChange={(e) => setGlobalLead({ ...globalLead, name: e.target.value })} className="h-8 text-xs bg-secondary/50 border-border" />
            <Input placeholder="E-mail" value={globalLead.email} onChange={(e) => setGlobalLead({ ...globalLead, email: e.target.value })} className="h-8 text-xs bg-secondary/50 border-border" />
            <Input placeholder="Telefone" value={globalLead.phone} onChange={(e) => setGlobalLead({ ...globalLead, phone: e.target.value })} className="h-8 text-xs bg-secondary/50 border-border" />
            <Input placeholder="Empresa" value={globalLead.company} onChange={(e) => setGlobalLead({ ...globalLead, company: e.target.value })} className="h-8 text-xs bg-secondary/50 border-border" />
            <Input placeholder="Valor R$" type="number" value={globalLead.value} onChange={(e) => setGlobalLead({ ...globalLead, value: e.target.value })} className="h-8 text-xs bg-secondary/50 border-border" />
          </div>
          <div className="flex gap-2">
            <Button variant="lime" size="sm" className="h-7 text-xs" onClick={handleGlobalAddLead} disabled={!globalLead.name || loading}>{loading ? "..." : "Criar Lead"}</Button>
            <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={() => setShowGlobalLead(false)}><X className="w-3 h-3" /></Button>
          </div>
        </div>
      )}

      {showNewPipeline && (
        <div className="surface-card-lime rounded-lg p-4 mb-4 flex items-end gap-3">
          <div className="flex-1">
            <Label className="text-xs">Nome do pipeline</Label>
            <Input placeholder="Ex: Pós-venda" value={newPipelineName} onChange={(e) => setNewPipelineName(e.target.value)} className="mt-1 h-8 text-xs bg-secondary/50 border-border" />
          </div>
          <Button variant="lime" size="sm" className="h-8" onClick={handleCreatePipeline} disabled={!newPipelineName}>Criar</Button>
          <Button variant="ghost" size="sm" className="h-8" onClick={() => setShowNewPipeline(false)}><X className="w-4 h-4" /></Button>
        </div>
      )}

      {showAddStage && (
        <div className="surface-card-lime rounded-lg p-4 mb-4 flex items-end gap-3 flex-wrap">
          <div className="flex-1 min-w-[200px]">
            <Label className="text-xs">Nome da etapa</Label>
            <Input placeholder="Ex: Qualificação" value={newStageName} onChange={(e) => setNewStageName(e.target.value)} className="mt-1 bg-secondary/50 border-border" />
          </div>
          <div>
            <Label className="text-xs">Cor</Label>
            <div className="flex gap-1.5 mt-1">
              {stageColors.map(c => (
                <button key={c} onClick={() => setNewStageColor(c)}
                  className={`w-6 h-6 rounded-full border-2 transition-all ${newStageColor === c ? "border-foreground scale-110" : "border-transparent"}`}
                  style={{ backgroundColor: c }} />
              ))}
            </div>
          </div>
          <Button variant="lime" size="sm" onClick={handleAddStage} disabled={!newStageName || loading}>Criar</Button>
          <Button variant="ghost" size="sm" onClick={() => setShowAddStage(false)}><X className="w-4 h-4" /></Button>
        </div>
      )}

      <DndContext sensors={sensors} collisionDetection={closestCorners} onDragStart={handleDragStart} onDragOver={handleDragOver} onDragEnd={handleDragEnd}>
        <div className="flex gap-3 overflow-x-auto pb-4">
          {stages.map(stage => {
            const stageCards = filteredCards.filter(c => c.stage_id === stage.id);
            return (
              <div key={stage.id} className="flex-shrink-0 w-72">
                <div className="flex items-center gap-2 mb-3 px-1">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: stage.color || "hsl(84, 81%, 44%)" }} />
                  <h3 className="text-sm font-medium">{stage.name}</h3>
                  <span className="text-xs text-muted-foreground ml-auto">{stageCards.length}</span>
                  <button onClick={() => setShowAddLead(showAddLead === stage.id ? null : stage.id)} className="p-1 rounded-lg hover:bg-secondary text-muted-foreground hover:text-lime transition-colors"><Plus className="w-3.5 h-3.5" /></button>
                  <button onClick={() => handleDeleteStage(stage.id)} className="p-1 rounded-lg hover:bg-destructive/20 text-muted-foreground hover:text-destructive transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
                </div>

                {showAddLead === stage.id && (
                  <div className="surface-card-lime rounded-lg p-3 mb-2 space-y-2">
                    <Input placeholder="Nome *" value={newLead.name} onChange={(e) => setNewLead({ ...newLead, name: e.target.value })} className="h-8 text-xs bg-secondary/50 border-border" />
                    <Input placeholder="E-mail" value={newLead.email} onChange={(e) => setNewLead({ ...newLead, email: e.target.value })} className="h-8 text-xs bg-secondary/50 border-border" />
                    <Input placeholder="Telefone" value={newLead.phone} onChange={(e) => setNewLead({ ...newLead, phone: e.target.value })} className="h-8 text-xs bg-secondary/50 border-border" />
                    <Input placeholder="Valor R$" type="number" value={newLead.value} onChange={(e) => setNewLead({ ...newLead, value: e.target.value })} className="h-8 text-xs bg-secondary/50 border-border" />
                    <div className="flex gap-2">
                      <Button variant="lime" size="sm" className="h-7 text-xs flex-1" onClick={() => handleAddLead(stage.id)} disabled={!newLead.name || loading}>{loading ? "..." : "Adicionar"}</Button>
                      <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={() => setShowAddLead(null)}><X className="w-3 h-3" /></Button>
                    </div>
                  </div>
                )}

                <DroppableColumn id={stage.id}>
                  <SortableContext items={stageCards.map(c => c.id)} strategy={verticalListSortingStrategy}>
                    {stageCards.map(card => <SortableCard key={card.id} card={card} onDelete={handleDeleteCard} />)}
                  </SortableContext>
                </DroppableColumn>
              </div>
            );
          })}
        </div>
        <DragOverlay>{activeCard ? <CardContent card={activeCard} /> : null}</DragOverlay>
      </DndContext>
    </div>
  );
};

export default CRMKanban;
