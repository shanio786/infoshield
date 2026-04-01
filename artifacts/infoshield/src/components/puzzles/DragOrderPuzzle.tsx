import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GripVertical, CheckCircle, XCircle, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DragOrderPuzzleProps {
  title: string;
  items: string[];
  correctOrder: number[]; // indices into items[] in correct order
  onComplete?: (score: number) => void;
}

export function DragOrderPuzzle({ title, items, correctOrder, onComplete }: DragOrderPuzzleProps) {
  const [order, setOrder] = useState(() =>
    [...items].map((text, i) => ({ id: i, text })).sort(() => Math.random() - 0.5)
  );
  const [dragIdx, setDragIdx] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [correct, setCorrect] = useState(false);

  const handleDragStart = (idx: number) => setDragIdx(idx);

  const handleDrop = (targetIdx: number) => {
    if (dragIdx === null || dragIdx === targetIdx) return;
    const newOrder = [...order];
    const [dragged] = newOrder.splice(dragIdx, 1);
    newOrder.splice(targetIdx, 0, dragged);
    setOrder(newOrder);
    setDragIdx(null);
  };

  const handleSubmit = () => {
    const isCorrect = order.every((item, idx) => item.id === correctOrder[idx]);
    setCorrect(isCorrect);
    setSubmitted(true);
    onComplete?.(isCorrect ? 100 : 40);
  };

  const reset = () => {
    setOrder([...items].map((text, i) => ({ id: i, text })).sort(() => Math.random() - 0.5));
    setSubmitted(false);
    setCorrect(false);
  };

  return (
    <div className="space-y-4">
      <h3 className="font-serif font-bold text-lg text-foreground">{title}</h3>
      <p className="text-xs text-muted-foreground uppercase tracking-widest">Drag items into the correct order</p>

      <div className="space-y-2">
        <AnimatePresence>
          {order.map((item, idx) => (
            <motion.div
              key={item.id}
              layout
              layoutId={`item-${item.id}`}
              draggable={!submitted}
              onDragStart={() => handleDragStart(idx)}
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => handleDrop(idx)}
              className={`flex items-center gap-3 p-3 rounded-md border cursor-grab active:cursor-grabbing transition-all ${
                submitted
                  ? correct
                    ? "border-primary/40 bg-primary/5"
                    : item.id === correctOrder[idx]
                    ? "border-primary/30 bg-primary/5"
                    : "border-destructive/30 bg-destructive/5"
                  : dragIdx === idx
                  ? "border-primary bg-primary/10 opacity-50 scale-95"
                  : "border-border bg-card hover:border-primary/40 hover:bg-secondary/30"
              }`}
            >
              <GripVertical className="w-4 h-4 text-muted-foreground shrink-0" />
              <span className="text-xs font-mono text-muted-foreground w-5 shrink-0">{idx + 1}.</span>
              <span className="text-sm text-foreground flex-1">{item.text}</span>
              {submitted && (
                item.id === correctOrder[idx]
                  ? <CheckCircle className="w-4 h-4 text-primary shrink-0" />
                  : <XCircle className="w-4 h-4 text-destructive shrink-0" />
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {submitted ? (
        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center gap-2 text-sm">
            <Trophy className={`w-4 h-4 ${correct ? "text-primary" : "text-muted-foreground"}`} />
            <span className={correct ? "text-primary font-semibold" : "text-muted-foreground"}>
              {correct ? "Perfect order!" : "Not quite — check the correct order"}
            </span>
          </div>
          <Button variant="outline" size="sm" onClick={reset}>Try Again</Button>
        </div>
      ) : (
        <Button onClick={handleSubmit} className="w-full">
          Check Order
        </Button>
      )}

      {submitted && !correct && (
        <div className="text-xs text-muted-foreground bg-secondary/30 rounded-md p-3 border border-border">
          <p className="font-medium text-foreground mb-1">Correct order:</p>
          {correctOrder.map((itemIdx, pos) => (
            <p key={pos}>{pos + 1}. {items[itemIdx]}</p>
          ))}
        </div>
      )}
    </div>
  );
}
