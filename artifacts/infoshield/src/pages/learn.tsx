import { useListModules, getListModulesQueryKey } from "@workspace/api-client-react";
import { motion } from "framer-motion";
import { Link } from "wouter";
import { Clock, BookOpen, ChevronRight } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DynamicIcon } from "@/lib/icon-map";

export function Learn() {
  const { data: modules, isLoading } = useListModules({
    query: { queryKey: getListModulesQueryKey() }
  });

  return (
    <div className="max-w-5xl mx-auto p-6 md:p-10 w-full">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="mb-10">
          <h1 className="text-4xl font-serif font-bold tracking-tight mb-3">Intelligence Modules</h1>
          <p className="text-muted-foreground text-lg max-w-2xl">
            Structured briefings designed to build your capability in identifying and analyzing information threats.
          </p>
        </div>

        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-40 bg-card/50 animate-pulse rounded-lg border border-border" />
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {modules?.map((module, index) => (
              <motion.div
                key={module.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <Link href={`/learn/${module.id}`}>
                  <Card className="group hover:bg-secondary/50 hover:border-primary/50 transition-all duration-300 cursor-pointer overflow-hidden border-border bg-card">
                    <div className="flex flex-col md:flex-row md:items-center">
                      <div className="p-6 md:w-1/4 flex flex-col justify-center border-b md:border-b-0 md:border-r border-border bg-secondary/20">
                        <div className="mb-3 text-primary">
                          <DynamicIcon name={module.icon ?? "BookOpen"} className="w-10 h-10" />
                        </div>
                        <Badge variant="outline" className="w-fit text-xs font-mono uppercase border-primary/30 text-primary bg-primary/5">
                          Level {module.level}
                        </Badge>
                      </div>
                      <div className="p-6 flex-1 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                        <div>
                          <CardTitle className="text-2xl font-serif mb-2 group-hover:text-primary transition-colors">
                            {module.title}
                          </CardTitle>
                          <CardDescription className="text-base text-muted-foreground">
                            {module.description}
                          </CardDescription>
                        </div>
                        <div className="flex items-center gap-6 shrink-0 text-sm text-muted-foreground font-medium">
                          <div className="flex items-center gap-2">
                            <BookOpen className="w-4 h-4" />
                            {module.lessonCount} lessons
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4" />
                            {module.estimatedMinutes}m
                          </div>
                          <div className="w-10 h-10 rounded-full bg-background border border-border flex items-center justify-center group-hover:bg-primary group-hover:border-primary group-hover:text-primary-foreground transition-colors ml-2">
                            <ChevronRight className="w-5 h-5" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
}
