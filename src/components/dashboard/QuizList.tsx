import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Plus, X, FileQuestion, Copy, Pencil, Trash2, Eye, GripVertical } from "lucide-react";

interface Question { id: string; text: string; type: "text" | "multiple_choice"; options?: string[]; }
interface Quiz { id: string; title: string; description: string | null; slug: string; is_active: boolean; questions: Question[]; created_at: string; _responseCount?: number; }

const generateId = () => Math.random().toString(36).substring(2, 9);

const QuizList = () => {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [editing, setEditing] = useState<Quiz | null>(null);
  const [showResponses, setShowResponses] = useState<string | null>(null);
  const [responses, setResponses] = useState<any[]>([]);
  const { toast } = useToast();

  const fetchQuizzes = async () => {
    const { data } = await supabase.from("quizzes").select("*").order("created_at", { ascending: false });
    if (!data) return;
    const { data: counts } = await supabase.from("quiz_responses").select("quiz_id");
    const countMap: Record<string, number> = {};
    (counts || []).forEach((r: any) => { countMap[r.quiz_id] = (countMap[r.quiz_id] || 0) + 1; });
    setQuizzes(data.map((q: any) => ({ ...q, questions: Array.isArray(q.questions) ? q.questions as Question[] : [], _responseCount: countMap[q.id] || 0 })));
  };

  useEffect(() => { fetchQuizzes(); }, []);

  const startNew = () => setEditing({ id: "", title: "", description: "", slug: "", is_active: true, questions: [{ id: generateId(), text: "", type: "multiple_choice", options: ["", ""] }], created_at: "" });
  const startEdit = (quiz: Quiz) => setEditing({ ...quiz });

  const handleSave = async () => {
    if (!editing || !editing.title || !editing.slug) { toast({ title: "Preencha título e slug", variant: "destructive" }); return; }
    const payload = { title: editing.title, description: editing.description, slug: editing.slug, is_active: editing.is_active, questions: editing.questions as any };
    if (editing.id) {
      const { error } = await supabase.from("quizzes").update(payload).eq("id", editing.id);
      if (error) { toast({ title: "Erro ao salvar", variant: "destructive" }); return; }
    } else {
      const { error } = await supabase.from("quizzes").insert(payload);
      if (error) { toast({ title: error.message, variant: "destructive" }); return; }
    }
    toast({ title: "Quiz salvo!" }); setEditing(null); fetchQuizzes();
  };

  const handleDelete = async (id: string) => { await supabase.from("quizzes").delete().eq("id", id); toast({ title: "Quiz excluído" }); fetchQuizzes(); };
  const handleCopyLink = (slug: string) => { navigator.clipboard.writeText(`${window.location.origin}/quiz/${slug}`); toast({ title: "Link copiado!" }); };

  const fetchResponses = async (quizId: string) => {
    setShowResponses(quizId);
    const { data } = await supabase.from("quiz_responses").select("*, lead:leads(name, email)").eq("quiz_id", quizId).order("completed_at", { ascending: false });
    setResponses(data || []);
  };

  const addQuestion = () => { if (!editing) return; setEditing({ ...editing, questions: [...editing.questions, { id: generateId(), text: "", type: "multiple_choice", options: ["", ""] }] }); };
  const updateQuestion = (idx: number, field: string, value: any) => { if (!editing) return; const q = [...editing.questions]; (q[idx] as any)[field] = value; setEditing({ ...editing, questions: q }); };
  const removeQuestion = (idx: number) => { if (!editing) return; setEditing({ ...editing, questions: editing.questions.filter((_, i) => i !== idx) }); };
  const addOption = (qIdx: number) => { if (!editing) return; const q = [...editing.questions]; q[qIdx].options = [...(q[qIdx].options || []), ""]; setEditing({ ...editing, questions: q }); };
  const updateOption = (qIdx: number, oIdx: number, value: string) => { if (!editing) return; const q = [...editing.questions]; const opts = [...(q[qIdx].options || [])]; opts[oIdx] = value; q[qIdx].options = opts; setEditing({ ...editing, questions: q }); };
  const removeOption = (qIdx: number, oIdx: number) => { if (!editing) return; const q = [...editing.questions]; q[qIdx].options = (q[qIdx].options || []).filter((_, i) => i !== oIdx); setEditing({ ...editing, questions: q }); };

  if (showResponses) {
    return (
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold tracking-tighter">Respostas do <span className="text-gradient-lime">Quiz</span></h2>
          <Button variant="ghost" onClick={() => setShowResponses(null)}><X className="w-4 h-4" /> Voltar</Button>
        </div>
        {responses.length === 0 ? (
          <div className="surface-card rounded-lg p-12 text-center"><p className="text-muted-foreground text-sm">Nenhuma resposta</p></div>
        ) : (
          <div className="space-y-2">
            {responses.map((r: any) => (
              <div key={r.id} className="surface-card rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <p className="font-medium text-sm">{r.lead?.name || "Anônimo"}</p>
                  <p className="text-xs text-muted-foreground">{new Date(r.completed_at).toLocaleDateString("pt-BR")}</p>
                </div>
                {r.lead?.email && <p className="text-xs text-muted-foreground mb-2">{r.lead.email}</p>}
                <div className="bg-secondary rounded-lg p-3 mt-2">
                  {Object.entries(r.responses as Record<string, string>).map(([k, v]) => (
                    <p key={k} className="text-xs"><span className="text-muted-foreground">{k}:</span> {v}</p>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  if (editing) {
    return (
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold tracking-tighter">{editing.id ? "Editar" : "Novo"} <span className="text-gradient-lime">Quiz</span></h2>
          <div className="flex gap-2">
            <Button variant="ghost" onClick={() => setEditing(null)}><X className="w-4 h-4" /> Cancelar</Button>
            <Button variant="lime" onClick={handleSave}>Salvar Quiz</Button>
          </div>
        </div>
        <div className="grid lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="surface-card-lime rounded-lg p-5 space-y-4">
              <div><Label>Título</Label><Input value={editing.title} onChange={(e) => setEditing({ ...editing, title: e.target.value })} className="mt-1 bg-secondary/50 border-border" placeholder="Descubra seu perfil..." /></div>
              <div><Label>Slug (URL)</Label><Input value={editing.slug} onChange={(e) => setEditing({ ...editing, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "") })} className="mt-1 bg-secondary/50 border-border" /><p className="text-xs text-muted-foreground mt-1 font-mono">/quiz/{editing.slug || "..."}</p></div>
              <div><Label>Descrição</Label><Textarea value={editing.description || ""} onChange={(e) => setEditing({ ...editing, description: e.target.value })} className="mt-1 bg-secondary/50 border-border" rows={2} /></div>
              <div className="flex items-center gap-3"><Switch checked={editing.is_active} onCheckedChange={(v) => setEditing({ ...editing, is_active: v })} /><Label>Ativo</Label></div>
            </div>
            <div className="space-y-3">
              {editing.questions.map((q, qIdx) => (
                <div key={q.id} className="surface-card rounded-lg p-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <GripVertical className="w-4 h-4 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground font-medium">Pergunta {qIdx + 1}</span>
                    <div className="ml-auto flex gap-1">
                      <select value={q.type} onChange={(e) => updateQuestion(qIdx, "type", e.target.value)} className="text-xs bg-secondary border border-border rounded-lg px-2 py-1">
                        <option value="multiple_choice">Múltipla escolha</option><option value="text">Texto livre</option>
                      </select>
                      <button onClick={() => removeQuestion(qIdx)} className="p-1 text-destructive hover:bg-destructive/20 rounded-lg"><Trash2 className="w-3.5 h-3.5" /></button>
                    </div>
                  </div>
                  <Input value={q.text} onChange={(e) => updateQuestion(qIdx, "text", e.target.value)} placeholder="Qual é a sua pergunta?" className="bg-secondary/50 border-border" />
                  {q.type === "multiple_choice" && (
                    <div className="space-y-2 pl-4">
                      {(q.options || []).map((opt, oIdx) => (
                        <div key={oIdx} className="flex gap-2 items-center">
                          <Input value={opt} onChange={(e) => updateOption(qIdx, oIdx, e.target.value)} placeholder={`Opção ${oIdx + 1}`} className="h-8 text-xs bg-secondary/50 border-border" />
                          <button onClick={() => removeOption(qIdx, oIdx)} className="p-1 text-muted-foreground hover:text-destructive"><X className="w-3 h-3" /></button>
                        </div>
                      ))}
                      <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={() => addOption(qIdx)}><Plus className="w-3 h-3" /> Opção</Button>
                    </div>
                  )}
                </div>
              ))}
              <Button variant="lime-outline" size="sm" onClick={addQuestion} className="w-full"><Plus className="w-4 h-4" /> Adicionar Pergunta</Button>
            </div>
          </div>
          <div className="surface-card rounded-lg p-6">
            <p className="text-xs text-muted-foreground mb-4 uppercase tracking-wider font-medium">Preview</p>
            <div className="space-y-6">
              <h3 className="text-xl font-bold tracking-tight">{editing.title || "Título do Quiz"}</h3>
              {editing.description && <p className="text-sm text-muted-foreground">{editing.description}</p>}
              {editing.questions.map((q, i) => (
                <div key={q.id} className="border border-border rounded-lg p-4">
                  <p className="text-sm font-medium mb-3">{i + 1}. {q.text || "Pergunta sem texto"}</p>
                  {q.type === "multiple_choice" ? (
                    <div className="space-y-2">{(q.options || []).filter(Boolean).map((opt, oi) => (<div key={oi} className="px-3 py-2 rounded-lg bg-secondary text-xs">{opt}</div>))}</div>
                  ) : (<div className="h-8 bg-secondary rounded-lg" />)}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold tracking-tighter">Quizzes <span className="text-gradient-lime">Interativos</span></h2>
        <Button variant="lime" size="sm" onClick={startNew}><Plus className="w-4 h-4" /> Novo Quiz</Button>
      </div>
      {quizzes.length === 0 ? (
        <div className="surface-card rounded-lg p-12 text-center">
          <FileQuestion className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
          <p className="text-muted-foreground text-sm">Nenhum quiz criado</p>
          <Button variant="lime-outline" size="sm" className="mt-4" onClick={startNew}><Plus className="w-4 h-4" /> Criar primeiro</Button>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {quizzes.map((quiz) => (
            <div key={quiz.id} className="surface-card rounded-lg p-5 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-sm truncate">{quiz.title}</h3>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${quiz.is_active ? "bg-lime/10 text-lime" : "bg-destructive/10 text-destructive"}`}>
                  {quiz.is_active ? "Ativo" : "Inativo"}
                </span>
              </div>
              <p className="text-xs text-muted-foreground font-mono">/quiz/{quiz.slug}</p>
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <span>{quiz.questions.length} perguntas</span><span>{quiz._responseCount} respostas</span>
              </div>
              <div className="flex gap-1 pt-2 border-t border-border">
                <Button variant="ghost" size="sm" className="h-7 text-xs flex-1" onClick={() => startEdit(quiz)}><Pencil className="w-3 h-3" /> Editar</Button>
                <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={() => handleCopyLink(quiz.slug)}><Copy className="w-3 h-3" /></Button>
                <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={() => fetchResponses(quiz.id)}><Eye className="w-3 h-3" /></Button>
                <Button variant="ghost" size="sm" className="h-7 text-xs text-destructive" onClick={() => handleDelete(quiz.id)}><Trash2 className="w-3 h-3" /></Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default QuizList;
