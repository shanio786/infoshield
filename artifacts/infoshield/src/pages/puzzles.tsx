import { motion } from "framer-motion";
import { Puzzle, Lock, CheckCircle } from "lucide-react";
import { useAuth } from "@/context/auth";
import { WordMatchPuzzle } from "@/components/puzzles/WordMatchPuzzle";
import { FillBlankPuzzle } from "@/components/puzzles/FillBlankPuzzle";
import { DragOrderPuzzle } from "@/components/puzzles/DragOrderPuzzle";
import { LoginRequiredBanner } from "@/components/login-required-banner";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");

const PUZZLES = [
  {
    id: 1,
    type: "word_match" as const,
    title: "Disinformation Terminology",
    module: "Module 1: Foundations",
    description: "Match key terms with their correct definitions",
    xp: 30,
    data: {
      pairs: [
        { term: "Disinformation", definition: "Deliberately false information spread to deceive" },
        { term: "Misinformation", definition: "False information spread without harmful intent" },
        { term: "Malinformation", definition: "True information used to cause harm" },
        { term: "Deepfake", definition: "AI-generated synthetic media that mimics real people" },
        { term: "Echo Chamber", definition: "An environment where beliefs are reinforced without challenge" },
      ]
    }
  },
  {
    id: 2,
    type: "fill_blank" as const,
    title: "Information Operations: Fill the Gaps",
    module: "Module 2: Spread Mechanisms",
    description: "Complete sentences about how disinformation spreads",
    xp: 25,
    data: {
      questions: [
        { sentence: "Social media algorithms create ___ loops that reinforce existing beliefs.", answer: "filter bubble", hint: "Two words" },
        { sentence: "The ___ effect refers to how false information is often better remembered than corrections.", answer: "continued influence", hint: "Two words" },
        { sentence: "___ bots are automated accounts used to amplify disinformation at scale.", answer: "social media", hint: "Two words" },
        { sentence: "A ___ is a compelling narrative built around a false or misleading claim.", answer: "narrative", hint: "One word" },
      ]
    }
  },
  {
    id: 3,
    type: "drag_order" as const,
    title: "The Disinformation Lifecycle",
    module: "Module 1: Foundations",
    description: "Arrange the stages of a disinformation campaign in correct order",
    xp: 35,
    data: {
      items: [
        "Content is amplified by bots and coordinated accounts",
        "False narrative is fabricated by bad actors",
        "Mainstream media picks up the story",
        "Target audience is identified and profiled",
        "Content goes viral on social media platforms",
        "Public belief and behaviour is influenced",
      ],
      correctOrder: [1, 3, 0, 4, 2, 5]
    }
  },
  {
    id: 4,
    type: "word_match" as const,
    title: "Australian Case Study Terms",
    module: "Module 4: Australian Context",
    description: "Match Australian disinformation cases with their descriptions",
    xp: 30,
    data: {
      pairs: [
        { term: "Death Tax Myth", definition: "2019 election misinformation targeting Labor's franking credits policy" },
        { term: "AEC", definition: "Australia's independent electoral management body" },
        { term: "Referendum disinformation", definition: "False claims about the 2023 Voice to Parliament vote" },
        { term: "Foreign interference", definition: "State-sponsored campaigns aimed at influencing Australian politics" },
      ]
    }
  },
  {
    id: 5,
    type: "fill_blank" as const,
    title: "Fact-Checking Techniques",
    module: "Module 5: Counter-Measures",
    description: "Test your knowledge of fact-checking methodology",
    xp: 25,
    data: {
      questions: [
        { sentence: "___ involves tracing an image back to its original source to verify context.", answer: "reverse image search", hint: "Three words" },
        { sentence: "The SIFT method stands for Stop, ___, Find better sources, and Trace claims.", answer: "Investigate the source", hint: "Three words" },
        { sentence: "A ___ is a correction published alongside or after false information has spread.", answer: "retraction", hint: "One word" },
        { sentence: "___ literacy is the ability to critically evaluate online media and information.", answer: "media", hint: "One word" },
      ]
    }
  },
];

export function PuzzlesPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [completed, setCompleted] = useState<Set<number>>(new Set());

  const handleComplete = async (puzzleId: number, score: number) => {
    if (completed.has(puzzleId)) return;
    const userId = user?.id ?? "guest-user";

    try {
      const res = await fetch(`${BASE}/api/puzzles/${puzzleId}/complete`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, score }),
      });
      const data = await res.json() as { alreadyCompleted: boolean };
      if (!data.alreadyCompleted) {
        const puzzle = PUZZLES.find(p => p.id === puzzleId);
        toast({
          title: "Puzzle Complete!",
          description: `+${puzzle?.xp ?? 25} XP earned`,
        });
      }
      setCompleted(prev => new Set([...prev, puzzleId]));
    } catch {
      setCompleted(prev => new Set([...prev, puzzleId]));
    }
  };

  return (
    <div className="flex flex-col min-h-full">
      {/* Header */}
      <div className="border-b border-border bg-card/30 px-6 py-10">
        <div className="max-w-4xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex items-center gap-2 text-xs font-semibold tracking-widest uppercase text-muted-foreground mb-3">
              <Puzzle className="w-3.5 h-3.5" />
              Interactive Exercises
            </div>
            <h1 className="text-4xl font-serif font-bold text-foreground mb-2">Intelligence Puzzles</h1>
            <p className="text-muted-foreground">
              Apply your knowledge through matching exercises, gap-fills, and sequencing challenges.
            </p>
            <div className="flex items-center gap-2 mt-4 text-sm text-muted-foreground">
              <CheckCircle className="w-4 h-4 text-primary" />
              {completed.size}/{PUZZLES.length} completed
            </div>
          </motion.div>
        </div>
      </div>

      {/* Puzzles */}
      <div className="flex-1 px-6 py-10">
        <div className="max-w-4xl mx-auto space-y-6">
          {PUZZLES.map((puzzle, i) => (
            <motion.div
              key={puzzle.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className={`border rounded-lg overflow-hidden transition-colors ${
                completed.has(puzzle.id) ? "border-primary/30 bg-primary/5" : "border-border bg-card"
              }`}
            >
              {/* Puzzle header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-border">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-muted-foreground">{puzzle.module}</span>
                    {completed.has(puzzle.id) && (
                      <span className="inline-flex items-center gap-1 text-xs font-semibold text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                        <CheckCircle className="w-3 h-3" /> Complete
                      </span>
                    )}
                  </div>
                  <h2 className="font-serif font-semibold text-foreground mt-0.5">{puzzle.title}</h2>
                  <p className="text-xs text-muted-foreground">{puzzle.description}</p>
                </div>
                <div className="text-right shrink-0 ml-4">
                  <div className="text-lg font-bold text-primary">+{puzzle.xp}</div>
                  <div className="text-xs text-muted-foreground uppercase tracking-wider">XP</div>
                </div>
              </div>

              {/* Puzzle content */}
              <div className="p-6">
                {!user ? (
                  <LoginRequiredBanner action="attempt puzzles and earn XP" compact />
                ) : (
                  <>
                    {puzzle.type === "word_match" && (
                      <WordMatchPuzzle
                        title=""
                        pairs={(puzzle.data as { pairs: { term: string; definition: string }[] }).pairs}
                        onComplete={(score) => handleComplete(puzzle.id, score)}
                      />
                    )}
                    {puzzle.type === "fill_blank" && (
                      <FillBlankPuzzle
                        title=""
                        questions={(puzzle.data as { questions: { sentence: string; answer: string; hint?: string }[] }).questions}
                        onComplete={(score) => handleComplete(puzzle.id, score)}
                      />
                    )}
                    {puzzle.type === "drag_order" && (
                      <DragOrderPuzzle
                        title=""
                        items={(puzzle.data as { items: string[]; correctOrder: number[] }).items}
                        correctOrder={(puzzle.data as { items: string[]; correctOrder: number[] }).correctOrder}
                        onComplete={(score) => handleComplete(puzzle.id, score)}
                      />
                    )}
                  </>
                )}
              </div>
            </motion.div>
          ))}

          {/* Locked placeholder */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="border border-dashed border-border rounded-lg p-8 text-center"
          >
            <Lock className="w-8 h-8 text-muted-foreground mx-auto mb-3" />
            <p className="text-sm font-medium text-muted-foreground">More puzzles coming soon</p>
            <p className="text-xs text-muted-foreground mt-1">Complete all modules to unlock</p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
