import { useState } from "react";
import { useParams, useLocation } from "wouter";
import { useGetQuiz, getGetQuizQueryKey, useSubmitQuiz, QuizResult } from "@workspace/api-client-react";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, AlertCircle, ArrowRight, CheckCircle2, XCircle, Award } from "lucide-react";
import { DynamicIcon } from "@/lib/icon-map";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

export function QuizDetail() {
  const params = useParams<{ quizId: string }>();
  const quizId = parseInt(params.quizId || "0");
  const [, setLocation] = useLocation();

  const { data: quiz, isLoading } = useGetQuiz(quizId, {
    query: { enabled: !!quizId, queryKey: getGetQuizQueryKey(quizId) }
  });

  const submitMutation = useSubmitQuiz();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [showHint, setShowHint] = useState(false);
  const [result, setResult] = useState<QuizResult | null>(null);

  const question = quiz?.questions[currentIndex];
  const isLast = currentIndex === (quiz?.questions.length ?? 0) - 1;
  const isAnswered = question ? answers[question.id] !== undefined : false;

  const handleSelect = (optionIdx: number) => {
    if (!question) return;
    setAnswers(prev => ({ ...prev, [question.id]: optionIdx }));
  };

  const handleNext = () => {
    if (isLast) {
      // Submit
      if (!quiz) return;
      
      const formattedAnswers = Object.entries(answers).map(([qId, selectedOption]) => ({
        questionId: parseInt(qId),
        selectedOption
      }));

      submitMutation.mutate({
        quizId,
        data: { userId: "guest-user", answers: formattedAnswers }
      }, {
        onSuccess: (data) => setResult(data)
      });
    } else {
      setCurrentIndex(c => c + 1);
      setShowHint(false);
    }
  };

  if (isLoading) return <div className="p-10 text-center animate-pulse text-muted-foreground">Initializing simulation...</div>;
  if (!quiz) return <div className="p-10 text-center text-destructive">Simulation not found.</div>;

  if (result) {
    return (
      <div className="max-w-2xl mx-auto p-6 md:p-10 w-full min-h-screen flex flex-col items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full bg-card border border-border rounded-xl p-8 md:p-12 text-center shadow-xl"
        >
          <div className="w-24 h-24 mx-auto rounded-full flex items-center justify-center mb-6 shadow-inner">
            {result.passed ? (
              <div className="w-full h-full bg-green-500/20 text-green-500 rounded-full flex items-center justify-center border-4 border-green-500/30">
                <CheckCircle2 className="w-12 h-12" />
              </div>
            ) : (
              <div className="w-full h-full bg-destructive/20 text-destructive rounded-full flex items-center justify-center border-4 border-destructive/30">
                <XCircle className="w-12 h-12" />
              </div>
            )}
          </div>
          
          <h2 className="text-3xl font-serif font-bold mb-2">
            {result.passed ? "Simulation Cleared" : "Simulation Failed"}
          </h2>
          <p className="text-muted-foreground text-lg mb-8">
            Score: <span className="font-bold text-foreground">{result.score}%</span> (Required: {quiz.passingScore}%)
          </p>

          {result.badgesEarned.length > 0 && (
            <div className="bg-secondary/50 rounded-lg p-6 mb-8 text-left border border-primary/20">
              <h3 className="text-sm font-bold tracking-widest uppercase text-muted-foreground flex items-center mb-4">
                <Award className="w-4 h-4 mr-2 text-primary" /> Commendations Awarded
              </h3>
              <div className="flex gap-4">
                {result.badgesEarned.map(badge => (
                  <div key={badge.id} className="flex flex-col items-center gap-2">
                    <DynamicIcon name={badge.icon ?? "Award"} className="w-9 h-9 text-primary" />
                    <span className="text-xs font-medium text-center">{badge.name}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex gap-4 justify-center">
            <Button variant="outline" onClick={() => setLocation("/quiz")}>
              Return to Hub
            </Button>
            {result.passed ? (
              <Button onClick={() => setLocation("/dashboard")}>
                View Command Center
              </Button>
            ) : (
              <Button onClick={() => {
                setResult(null);
                setCurrentIndex(0);
                setAnswers({});
              }}>
                Retry Simulation
              </Button>
            )}
          </div>
        </motion.div>
      </div>
    );
  }

  const progressPct = ((currentIndex) / quiz.questions.length) * 100;

  return (
    <div className="max-w-3xl mx-auto p-6 md:p-10 w-full flex flex-col min-h-full">
      <div className="mb-12">
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm font-mono text-muted-foreground font-bold tracking-wider">
            {quiz.title.toUpperCase()}
          </span>
          <span className="text-sm font-medium text-muted-foreground">
            {currentIndex + 1} / {quiz.questions.length}
          </span>
        </div>
        <Progress value={progressPct} className="h-2 bg-secondary" />
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
          className="flex-1"
        >
          {question && (
            <div className="bg-card border border-border rounded-xl p-6 md:p-10 shadow-lg">
              <h2 className="text-2xl font-serif font-semibold text-foreground mb-8 leading-snug">
                {question.question}
              </h2>

              <div className="space-y-3 mb-8">
                {question.options.map((opt, idx) => {
                  const isSelected = answers[question.id] === idx;
                  return (
                    <button
                      key={idx}
                      onClick={() => handleSelect(idx)}
                      className={`w-full text-left p-4 rounded-lg border transition-all duration-200 ${
                        isSelected 
                          ? "bg-primary/10 border-primary text-foreground shadow-sm" 
                          : "bg-background border-border text-muted-foreground hover:border-primary/50 hover:text-foreground"
                      }`}
                    >
                      <div className="flex items-center">
                        <div className={`w-5 h-5 rounded-full border mr-3 flex items-center justify-center shrink-0 ${
                          isSelected ? "border-primary bg-primary text-background" : "border-muted-foreground"
                        }`}>
                          {isSelected && <div className="w-2 h-2 rounded-full bg-background" />}
                        </div>
                        <span className="text-lg">{opt}</span>
                      </div>
                    </button>
                  );
                })}
              </div>

              {question.hint && !showHint && (
                <button 
                  onClick={() => setShowHint(true)}
                  className="text-sm text-primary/80 hover:text-primary flex items-center transition-colors mb-6"
                >
                  <AlertCircle className="w-4 h-4 mr-1.5" /> Request Intel Hint
                </button>
              )}

              {showHint && question.hint && (
                <div className="bg-secondary/50 border border-primary/20 rounded-md p-4 text-sm text-muted-foreground mb-6 flex items-start gap-3">
                  <Shield className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                  <p>{question.hint}</p>
                </div>
              )}
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      <div className="mt-8 flex justify-end">
        <Button 
          size="lg" 
          disabled={!isAnswered || submitMutation.isPending} 
          onClick={handleNext}
          className="px-8 font-semibold"
        >
          {submitMutation.isPending ? "Transmitting..." : (isLast ? "Submit Analysis" : "Next Question")}
          {!isLast && !submitMutation.isPending && <ArrowRight className="w-4 h-4 ml-2" />}
        </Button>
      </div>
    </div>
  );
}
