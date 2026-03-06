import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { getUTMParams } from "@/hooks/useUTM";
import { ArrowRight, CheckCircle } from "lucide-react";

interface Question {
  id: string;
  text: string;
  type: "text" | "multiple_choice";
  options?: string[];
}

interface Quiz {
  id: string;
  title: string;
  description: string | null;
  questions: Question[];
}

const QuizPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [responses, setResponses] = useState<Record<string, string>>({});
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;
    supabase
      .from("quizzes")
      .select("*")
      .eq("slug", slug)
      .eq("is_active", true)
      .maybeSingle()
      .then(({ data }) => {
        if (data) {
          const questions = Array.isArray(data.questions) ? data.questions as unknown as Question[] : [];
          setQuiz({ ...data, questions });
        }
        setLoading(false);
      });
  }, [slug]);

  const handleSubmit = async () => {
    if (!quiz) return;
    setLoading(true);
    const utm = getUTMParams();

    try {
      // Create lead
      const { data: lead, error: leadErr } = await supabase
        .from("leads")
        .insert({ name, email, phone, source: "quiz", quiz_responses: responses, ...utm })
        .select("id")
        .single();
      if (leadErr) throw leadErr;

      // Save quiz response
      await supabase.from("quiz_responses").insert({
        quiz_id: quiz.id,
        lead_id: lead.id,
        responses,
        utm_source: utm.utm_source,
        utm_medium: utm.utm_medium,
        utm_campaign: utm.utm_campaign,
      });

      // Add to pipeline first stage
      const { data: firstStage } = await supabase
        .from("pipeline_stages")
        .select("id")
        .eq("pipeline_type", "vendas")
        .order("order", { ascending: true })
        .limit(1)
        .single();

      if (firstStage) {
        await supabase.from("pipeline_cards").insert({
          lead_id: lead.id,
          stage_id: firstStage.id,
          order: 0,
        });
      }

      setSubmitted(true);
      toast({ title: "Respostas enviadas com sucesso!" });
    } catch (err: unknown) {
      toast({ title: "Erro", description: err instanceof Error ? err.message : "Erro ao enviar", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="min-h-screen bg-background flex items-center justify-center"><p className="text-muted-foreground">Carregando...</p></div>;
  if (!quiz) return <div className="min-h-screen bg-background flex items-center justify-center flex-col gap-4"><p className="text-muted-foreground">Quiz não encontrado</p><Button variant="gold-outline" onClick={() => navigate("/")}>Voltar</Button></div>;

  if (submitted) {
    return (
      <div className="min-h-screen bg-background grid-bg flex items-center justify-center p-4">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="glass-card-gold rounded-2xl p-12 text-center max-w-md">
          <CheckCircle className="w-16 h-16 text-gold mx-auto mb-4" />
          <h2 className="text-2xl font-display font-bold mb-2">Obrigado!</h2>
          <p className="text-muted-foreground">Suas respostas foram enviadas. Entraremos em contato em breve.</p>
        </motion.div>
      </div>
    );
  }

  const questions = quiz.questions;
  const isContactStep = currentStep >= questions.length;
  const progress = ((currentStep) / (questions.length + 1)) * 100;

  return (
    <div className="min-h-screen bg-background grid-bg flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        {/* Progress bar */}
        <div className="h-1.5 bg-secondary rounded-full mb-8 overflow-hidden">
          <motion.div className="h-full bg-gradient-gold rounded-full" animate={{ width: `${progress}%` }} />
        </div>

        <motion.div key={currentStep} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="glass-card-gold rounded-2xl p-8">
          <p className="text-xs text-muted-foreground mb-1">{quiz.title}</p>

          {!isContactStep ? (
            <>
              <h2 className="text-xl font-display font-bold mb-6">{questions[currentStep].text}</h2>
              {questions[currentStep].type === "multiple_choice" && questions[currentStep].options ? (
                <div className="space-y-3">
                  {questions[currentStep].options!.map((opt) => (
                    <button key={opt}
                      onClick={() => {
                        setResponses((prev) => ({ ...prev, [questions[currentStep].id]: opt }));
                        setCurrentStep((s) => s + 1);
                      }}
                      className={`w-full text-left px-4 py-3 rounded-xl text-sm transition-all ${responses[questions[currentStep].id] === opt ? "bg-gold/20 border border-gold/40 text-gold" : "glass-card hover:border-gold/20"}`}>
                      {opt}
                    </button>
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  <Input value={responses[questions[currentStep].id] || ""} onChange={(e) => setResponses((prev) => ({ ...prev, [questions[currentStep].id]: e.target.value }))}
                    placeholder="Sua resposta..." className="bg-secondary/50 border-border/50" />
                  <Button variant="gold" onClick={() => setCurrentStep((s) => s + 1)} disabled={!responses[questions[currentStep].id]}>
                    Próxima <ArrowRight className="w-4 h-4" />
                  </Button>
                </div>
              )}
            </>
          ) : (
            <>
              <h2 className="text-xl font-display font-bold mb-6">Quase lá! Seus dados</h2>
              <div className="space-y-4">
                <Input placeholder="Nome" value={name} onChange={(e) => setName(e.target.value)} className="bg-secondary/50 border-border/50" />
                <Input placeholder="E-mail" type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="bg-secondary/50 border-border/50" />
                <Input placeholder="WhatsApp" value={phone} onChange={(e) => setPhone(e.target.value)} className="bg-secondary/50 border-border/50" />
                <Button variant="gold" size="lg" className="w-full" onClick={handleSubmit} disabled={!name || !email || loading}>
                  {loading ? "Enviando..." : "Enviar Respostas"}
                </Button>
              </div>
            </>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default QuizPage;
