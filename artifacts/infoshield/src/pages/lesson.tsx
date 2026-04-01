import { useParams, useLocation } from "wouter";
import { 
  useGetLesson, getGetLessonQueryKey, 
  useGetModule, getGetModuleQueryKey,
  useCompleteLesson,
  useGetUserProgress, getGetUserProgressQueryKey
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Link } from "wouter";
import { ArrowLeft, CheckCircle, ChevronLeft, ChevronRight, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import ReactMarkdown from "react-markdown";
import { useAuth } from "@/context/auth";

export function LessonDetail() {
  const params = useParams<{ moduleId: string; lessonId: string }>();
  const moduleId = parseInt(params.moduleId || "0");
  const lessonId = parseInt(params.lessonId || "0");
  const queryClient = useQueryClient();
  const [, setLocation] = useLocation();
  const { user } = useAuth();
  const userId = user?.id ?? "guest-user";

  const { data: lesson, isLoading: lessonLoading } = useGetLesson(lessonId, {
    query: { enabled: !!lessonId, queryKey: getGetLessonQueryKey(lessonId) }
  });

  const { data: moduleData } = useGetModule(moduleId, {
    query: { enabled: !!moduleId, queryKey: getGetModuleQueryKey(moduleId) }
  });

  const { data: progress } = useGetUserProgress(userId, {
    query: { queryKey: getGetUserProgressQueryKey(userId) }
  });

  const completeMutation = useCompleteLesson();

  const isCompleted = progress?.completedLessons.includes(lessonId);

  // Find prev/next lessons
  const currentIndex = moduleData?.lessons.findIndex(l => l.id === lessonId) ?? -1;
  const prevLesson = currentIndex > 0 ? moduleData?.lessons[currentIndex - 1] : null;
  const nextLesson = currentIndex !== -1 && moduleData ? moduleData.lessons[currentIndex + 1] : null;

  const handleMarkComplete = () => {
    completeMutation.mutate({
      userId,
      data: { lessonId, moduleId }
    }, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getGetUserProgressQueryKey(userId) });
        if (nextLesson) {
          setLocation(`/learn/${moduleId}/lesson/${nextLesson.id}`);
        } else {
          setLocation(`/learn/${moduleId}`);
        }
      }
    });
  };

  if (lessonLoading) {
    return <div className="p-10 text-center animate-pulse">Decrypting data...</div>;
  }

  if (!lesson) {
    return <div className="p-10 text-center text-destructive">Intel not found.</div>;
  }

  return (
    <div className="flex flex-col h-full w-full">
      {/* Top Bar */}
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-md border-b border-border px-4 py-3 flex items-center justify-between">
        <Link href={`/learn/${moduleId}`} className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" />
          <span className="hidden sm:inline">Back to Briefing</span>
        </Link>
        <div className="text-sm font-mono font-medium text-muted-foreground">
          {moduleData?.title} — {currentIndex + 1} / {moduleData?.lessons.length}
        </div>
        <div className="flex items-center gap-2">
          {isCompleted && (
            <span className="text-xs font-bold text-primary flex items-center bg-primary/10 px-2 py-1 rounded">
              <CheckCircle className="w-3.5 h-3.5 mr-1" /> Cleared
            </span>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="max-w-3xl mx-auto px-6 py-12 md:py-16">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <div className="mb-10">
              <div className="flex items-center text-muted-foreground text-sm font-medium mb-4">
                <Clock className="w-4 h-4 mr-1.5" />
                {lesson.estimatedMinutes} min read
              </div>
              <h1 className="text-4xl md:text-5xl font-serif font-bold text-foreground leading-tight tracking-tight">
                {lesson.title}
              </h1>
            </div>

            <div className="prose prose-invert prose-slate max-w-none prose-headings:font-serif prose-headings:text-foreground prose-p:text-muted-foreground prose-p:leading-relaxed prose-a:text-primary prose-a:no-underline hover:prose-a:underline prose-strong:text-foreground">
              <ReactMarkdown>{lesson.content}</ReactMarkdown>
            </div>

            <div className="mt-16 pt-8 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex gap-4 w-full sm:w-auto">
                {prevLesson && (
                  <Link href={`/learn/${moduleId}/lesson/${prevLesson.id}`}>
                    <Button variant="outline" className="w-full sm:w-auto">
                      <ChevronLeft className="w-4 h-4 mr-2" />
                      Previous
                    </Button>
                  </Link>
                )}
              </div>
              
              <Button 
                onClick={handleMarkComplete} 
                disabled={completeMutation.isPending}
                className={`w-full sm:w-auto px-8 ${isCompleted ? 'bg-secondary text-foreground hover:bg-secondary/80' : ''}`}
              >
                {completeMutation.isPending ? "Logging..." : (
                  isCompleted && nextLesson ? "Continue to Next" : 
                  isCompleted ? "Return to Module" : "Mark as Cleared"
                )}
                {nextLesson && !isCompleted && <ChevronRight className="w-4 h-4 ml-2" />}
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
