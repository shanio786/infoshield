import { useListQuizzes, getListQuizzesQueryKey, useGetUserProgress, getGetUserProgressQueryKey } from "@workspace/api-client-react";
import { motion } from "framer-motion";
import { Link } from "wouter";
import { HelpCircle, CheckCircle, XCircle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export function QuizHub() {
  const { data: quizzes, isLoading: quizzesLoading } = useListQuizzes({}, {
    query: { queryKey: getListQuizzesQueryKey() }
  });

  const { data: progress } = useGetUserProgress("guest-user", {
    query: { queryKey: getGetUserProgressQueryKey("guest-user") }
  });

  // Map progress to quiz status
  const attemptsByQuiz = progress?.quizAttempts.reduce((acc, attempt) => {
    acc[attempt.quizId] = attempt;
    return acc;
  }, {} as Record<number, any>) || {};

  return (
    <div className="max-w-5xl mx-auto p-6 md:p-10 w-full">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="mb-10">
          <h1 className="text-4xl font-serif font-bold tracking-tight mb-3">Simulations & Assessments</h1>
          <p className="text-muted-foreground text-lg max-w-2xl">
            Test your ability to analyze, verify, and counter information threats in simulated environments.
          </p>
        </div>

        {quizzesLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-48 bg-card/50 animate-pulse rounded-lg border border-border" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {quizzes?.map((quiz, index) => {
              const attempt = attemptsByQuiz[quiz.id];
              const isPassed = attempt?.passed;
              const hasAttempted = !!attempt;

              return (
                <motion.div
                  key={quiz.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                >
                  <Link href={`/quiz/${quiz.id}`}>
                    <Card className={`h-full cursor-pointer transition-all duration-300 border-border hover:border-primary/50 hover:shadow-md ${isPassed ? 'bg-secondary/10' : 'bg-card'}`}>
                      <CardHeader>
                        <div className="flex justify-between items-start mb-2">
                          <Badge variant="outline" className="bg-background text-xs font-mono">
                            {quiz.questionCount} Questions
                          </Badge>
                          {hasAttempted && (
                            isPassed ? (
                              <div className="flex items-center text-green-500 text-sm font-medium">
                                <CheckCircle className="w-4 h-4 mr-1" /> Passed ({attempt.score}%)
                              </div>
                            ) : (
                              <div className="flex items-center text-destructive text-sm font-medium">
                                <XCircle className="w-4 h-4 mr-1" /> Failed ({attempt.score}%)
                              </div>
                            )
                          )}
                        </div>
                        <CardTitle className="text-2xl font-serif leading-tight group-hover:text-primary transition-colors">
                          {quiz.title}
                        </CardTitle>
                        <CardDescription className="text-base text-muted-foreground mt-2 line-clamp-2">
                          {quiz.description}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <HelpCircle className="w-4 h-4 mr-2" />
                          Passing Score: {quiz.passingScore}%
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        )}
      </motion.div>
    </div>
  );
}
