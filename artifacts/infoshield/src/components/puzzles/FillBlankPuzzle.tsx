import { useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle, XCircle, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";

interface FillBlankQuestion {
  sentence: string; // Use ___ for the blank
  answer: string;
  hint?: string;
}

interface FillBlankPuzzleProps {
  title: string;
  questions: FillBlankQuestion[];
  onComplete?: (score: number) => void;
}

export function FillBlankPuzzle({ title, questions, onComplete }: FillBlankPuzzleProps) {
  const [answers, setAnswers] = useState<string[]>(questions.map(() => ""));
  const [submitted, setSubmitted] = useState(false);
  const [results, setResults] = useState<boolean[]>([]);

  const handleSubmit = () => {
    const res = questions.map((q, i) =>
      answers[i].trim().toLowerCase() === q.answer.toLowerCase()
    );
    setResults(res);
    setSubmitted(true);
    const score = Math.round((res.filter(Boolean).length / questions.length) * 100);
    onComplete?.(score);
  };

  const reset = () => {
    setAnswers(questions.map(() => ""));
    setSubmitted(false);
    setResults([]);
  };

  const correctCount = results.filter(Boolean).length;
  const score = submitted ? Math.round((correctCount / questions.length) * 100) : 0;

  return (
    <div className="space-y-5">
      <h3 className="font-serif font-bold text-lg text-foreground">{title}</h3>
      <p className="text-xs text-muted-foreground uppercase tracking-widest">Fill in the blanks</p>

      <div className="space-y-4">
        {questions.map((q, idx) => {
          const parts = q.sentence.split("___");
          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.08 }}
              className={`p-4 rounded-md border transition-colors ${
                submitted
                  ? results[idx]
                    ? "border-primary/40 bg-primary/5"
                    : "border-destructive/40 bg-destructive/5"
                  : "border-border bg-card"
              }`}
            >
              <div className="flex items-start gap-2">
                <span className="text-xs font-mono text-muted-foreground mt-1 shrink-0">
                  {(idx + 1).toString().padStart(2, "0")}
                </span>
                <div className="flex-1">
                  <p className="text-sm text-foreground leading-relaxed flex flex-wrap items-center gap-1">
                    <span>{parts[0]}</span>
                    <input
                      type="text"
                      value={answers[idx]}
                      onChange={(e) => {
                        const a = [...answers];
                        a[idx] = e.target.value;
                        setAnswers(a);
                      }}
                      disabled={submitted}
                      placeholder="type answer..."
                      className={`inline-block min-w-[120px] px-2 py-0.5 text-sm border-b-2 bg-transparent focus:outline-none transition-colors ${
                        submitted
                          ? results[idx]
                            ? "border-primary text-primary"
                            : "border-destructive text-destructive"
                          : "border-primary/50 focus:border-primary text-foreground"
                      }`}
                    />
                    {parts[1] && <span>{parts[1]}</span>}
                  </p>
                  {submitted && !results[idx] && (
                    <p className="text-xs text-muted-foreground mt-1.5">
                      Correct answer: <span className="text-primary font-medium">{q.answer}</span>
                    </p>
                  )}
                  {q.hint && !submitted && (
                    <p className="text-xs text-muted-foreground mt-1">Hint: {q.hint}</p>
                  )}
                </div>
                {submitted && (
                  results[idx]
                    ? <CheckCircle className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                    : <XCircle className="w-4 h-4 text-destructive shrink-0 mt-0.5" />
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      {submitted ? (
        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center gap-2 text-sm">
            <Trophy className={`w-4 h-4 ${score >= 70 ? "text-primary" : "text-muted-foreground"}`} />
            <span className={score >= 70 ? "text-primary font-semibold" : "text-muted-foreground"}>
              {correctCount}/{questions.length} correct — {score}%
            </span>
          </div>
          <Button variant="outline" size="sm" onClick={reset}>Try Again</Button>
        </div>
      ) : (
        <Button onClick={handleSubmit} disabled={answers.some(a => !a.trim())} className="w-full">
          Check Answers
        </Button>
      )}
    </div>
  );
}
