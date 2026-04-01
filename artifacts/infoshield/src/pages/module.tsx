import { useParams } from "wouter";
import { useGetModule, getGetModuleQueryKey, useGetUserProgress, getGetUserProgressQueryKey } from "@workspace/api-client-react";
import { motion } from "framer-motion";
import { Link } from "wouter";
import { Clock, CheckCircle, Circle, ArrowLeft, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DynamicIcon } from "@/lib/icon-map";

export function ModuleDetail() {
  const params = useParams<{ moduleId: string }>();
  const moduleId = parseInt(params.moduleId || "0");

  const { data: moduleData, isLoading } = useGetModule(moduleId, {
    query: { enabled: !!moduleId, queryKey: getGetModuleQueryKey(moduleId) }
  });

  const { data: progress } = useGetUserProgress("guest-user", {
    query: { queryKey: getGetUserProgressQueryKey("guest-user") }
  });

  const completedLessonIds = new Set(progress?.completedLessons || []);

  if (isLoading) {
    return <div className="p-10 text-center animate-pulse text-muted-foreground">Loading briefing...</div>;
  }

  if (!moduleData) {
    return <div className="p-10 text-center text-destructive">Module not found.</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6 md:p-10 w-full">
      <Link href="/learn" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-primary transition-colors mb-8">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Modules
      </Link>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="flex items-start gap-6 mb-12">
          <div className="p-4 bg-secondary/30 rounded-xl border border-border text-primary">
            <DynamicIcon name={moduleData.icon ?? "BookOpen"} className="w-14 h-14" />
          </div>
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="px-2.5 py-0.5 rounded text-xs font-mono font-bold bg-primary/10 text-primary border border-primary/20">
                LEVEL {moduleData.level}
              </span>
              <span className="flex items-center text-sm text-muted-foreground font-medium">
                <Clock className="w-4 h-4 mr-1.5" />
                {moduleData.estimatedMinutes}m total
              </span>
            </div>
            <h1 className="text-4xl font-serif font-bold tracking-tight mb-3">{moduleData.title}</h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              {moduleData.description}
            </p>
          </div>
        </div>

        <div className="space-y-6">
          <h2 className="text-xl font-bold font-serif flex items-center gap-2 border-b border-border pb-4">
            <BookOpen className="w-5 h-5 text-primary" />
            Briefing Contents
          </h2>
          
          <div className="relative border-l-2 border-border ml-4 space-y-8 py-4">
            {moduleData.lessons.map((lesson, index) => {
              const isCompleted = completedLessonIds.has(lesson.id);
              
              return (
                <div key={lesson.id} className="relative pl-8">
                  <div className={`absolute -left-[11px] top-1 bg-background rounded-full ${isCompleted ? 'text-primary' : 'text-muted-foreground'}`}>
                    {isCompleted ? (
                      <CheckCircle className="w-5 h-5 bg-background" />
                    ) : (
                      <Circle className="w-5 h-5 bg-background" />
                    )}
                  </div>
                  
                  <Link href={`/learn/${moduleData.id}/lesson/${lesson.id}`}>
                    <div className="group block bg-card border border-border hover:border-primary/50 rounded-lg p-5 transition-all duration-200 hover:shadow-md cursor-pointer">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-mono text-muted-foreground font-semibold tracking-wider">
                          LESSON {index + 1}
                        </span>
                        <span className="text-xs font-medium text-muted-foreground flex items-center">
                          <Clock className="w-3.5 h-3.5 mr-1" />
                          {lesson.estimatedMinutes}m
                        </span>
                      </div>
                      <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">
                        {lesson.title}
                      </h3>
                      {isCompleted && (
                        <div className="mt-3 inline-flex items-center text-xs font-medium text-primary bg-primary/10 px-2 py-1 rounded">
                          Cleared
                        </div>
                      )}
                    </div>
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
