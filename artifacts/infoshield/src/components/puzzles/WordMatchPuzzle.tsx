import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, RefreshCw, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";

interface WordMatchItem {
  term: string;
  definition: string;
}

interface WordMatchPuzzleProps {
  title: string;
  pairs: WordMatchItem[];
  onComplete?: (score: number) => void;
}

export function WordMatchPuzzle({ title, pairs, onComplete }: WordMatchPuzzleProps) {
  const [selectedTerm, setSelectedTerm] = useState<number | null>(null);
  const [matched, setMatched] = useState<Set<number>>(new Set());
  const [wrongPair, setWrongPair] = useState<number | null>(null);
  const [completed, setCompleted] = useState(false);
  const [attempts, setAttempts] = useState(0);

  const shuffledDefs = useCallback(() => {
    return [...pairs].map((p, i) => ({ ...p, originalIdx: i })).sort(() => Math.random() - 0.5);
  }, [pairs]);

  const [definitions] = useState(() => shuffledDefs());

  const handleTermClick = (idx: number) => {
    if (matched.has(idx) || completed) return;
    setSelectedTerm(idx === selectedTerm ? null : idx);
    setWrongPair(null);
  };

  const handleDefClick = (originalIdx: number) => {
    if (matched.has(originalIdx) || completed) return;
    if (selectedTerm === null) return;

    setAttempts(a => a + 1);

    if (selectedTerm === originalIdx) {
      const newMatched = new Set(matched);
      newMatched.add(originalIdx);
      setMatched(newMatched);
      setSelectedTerm(null);
      if (newMatched.size === pairs.length) {
        setCompleted(true);
        const score = Math.max(60, 100 - (attempts * 5));
        onComplete?.(score);
      }
    } else {
      setWrongPair(originalIdx);
      setTimeout(() => { setWrongPair(null); setSelectedTerm(null); }, 600);
    }
  };

  const reset = () => {
    setMatched(new Set());
    setSelectedTerm(null);
    setWrongPair(null);
    setCompleted(false);
    setAttempts(0);
  };

  if (completed) {
    return (
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="flex flex-col items-center justify-center py-10 text-center gap-4"
      >
        <div className="w-16 h-16 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center">
          <Trophy className="w-8 h-8 text-primary" />
        </div>
        <h3 className="text-xl font-serif font-bold">All Pairs Matched!</h3>
        <p className="text-muted-foreground text-sm">Score: {Math.max(60, 100 - attempts * 5)}% — {attempts} attempts</p>
        <Button variant="outline" size="sm" onClick={reset}>
          <RefreshCw className="w-3.5 h-3.5 mr-2" />
          Try Again
        </Button>
      </motion.div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="font-serif font-bold text-lg text-foreground">{title}</h3>
      <p className="text-xs text-muted-foreground uppercase tracking-widest">Select a term, then its matching definition</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* Terms column */}
        <div className="space-y-2">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Terms</p>
          {pairs.map((p, idx) => (
            <motion.button
              key={idx}
              whileTap={{ scale: 0.97 }}
              onClick={() => handleTermClick(idx)}
              disabled={matched.has(idx)}
              className={`w-full text-left px-4 py-3 rounded-md border text-sm font-medium transition-all duration-150 ${
                matched.has(idx)
                  ? "border-primary/30 bg-primary/10 text-primary opacity-60 cursor-default"
                  : selectedTerm === idx
                  ? "border-primary bg-primary/15 text-primary ring-1 ring-primary"
                  : "border-border bg-card hover:border-primary/50 hover:bg-secondary/50 text-foreground cursor-pointer"
              }`}
            >
              <span className="flex items-center gap-2">
                {matched.has(idx) && <CheckCircle className="w-3.5 h-3.5 text-primary shrink-0" />}
                {p.term}
              </span>
            </motion.button>
          ))}
        </div>

        {/* Definitions column */}
        <div className="space-y-2">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Definitions</p>
          {definitions.map((d) => (
            <motion.button
              key={d.originalIdx}
              whileTap={{ scale: 0.97 }}
              onClick={() => handleDefClick(d.originalIdx)}
              disabled={matched.has(d.originalIdx) || selectedTerm === null}
              className={`w-full text-left px-4 py-3 rounded-md border text-sm transition-all duration-150 ${
                matched.has(d.originalIdx)
                  ? "border-primary/30 bg-primary/10 text-primary opacity-60 cursor-default"
                  : wrongPair === d.originalIdx
                  ? "border-destructive bg-destructive/10 text-destructive"
                  : selectedTerm !== null
                  ? "border-border bg-card hover:border-primary/50 hover:bg-secondary/50 text-foreground cursor-pointer"
                  : "border-border bg-card text-muted-foreground cursor-default opacity-70"
              }`}
            >
              {d.definition}
            </motion.button>
          ))}
        </div>
      </div>

      <p className="text-xs text-muted-foreground text-right">
        {matched.size}/{pairs.length} matched · {attempts} attempts
      </p>
    </div>
  );
}
