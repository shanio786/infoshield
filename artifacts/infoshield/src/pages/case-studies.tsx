import { useListCaseStudies, getListCaseStudiesQueryKey } from "@workspace/api-client-react";
import { motion } from "framer-motion";
import { Link } from "wouter";
import { FileText, Calendar, ArrowRight } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export function CaseStudies() {
  const { data: caseStudies, isLoading } = useListCaseStudies({
    query: { queryKey: getListCaseStudiesQueryKey() }
  });

  return (
    <div className="max-w-5xl mx-auto p-6 md:p-10 w-full">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
        <h1 className="text-4xl font-serif font-bold tracking-tight mb-3 flex items-center gap-3">
          <FileText className="w-10 h-10 text-primary" /> Disinformation Archives
        </h1>
        <p className="text-muted-foreground text-lg max-w-2xl">
          Historical analysis of major information warfare campaigns, their mechanics, and real-world impact.
        </p>
      </motion.div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2].map((i) => (
            <div key={i} className="h-64 bg-card/50 animate-pulse rounded-lg border border-border" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {caseStudies?.map((study, index) => (
            <motion.div
              key={study.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
            >
              <Link href={`/case-studies/${study.slug}`}>
                <Card className="h-full flex flex-col group hover:border-primary/50 transition-colors bg-card border-border overflow-hidden">
                  <div className="h-2 w-full bg-gradient-to-r from-primary to-blue-500" />
                  <CardHeader>
                    <div className="flex justify-between items-start mb-3">
                      <Badge variant="secondary" className="bg-secondary text-secondary-foreground text-xs font-mono uppercase tracking-wider">
                        {study.category}
                      </Badge>
                      <div className="flex items-center text-sm font-medium text-muted-foreground font-mono">
                        <Calendar className="w-4 h-4 mr-1.5" />
                        {study.year}
                      </div>
                    </div>
                    <CardTitle className="text-2xl font-serif leading-tight group-hover:text-primary transition-colors">
                      {study.title}
                    </CardTitle>
                    <CardDescription className="text-base font-medium text-muted-foreground">
                      {study.subtitle}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex-1 flex flex-col">
                    <p className="text-sm text-muted-foreground leading-relaxed mb-6 line-clamp-3">
                      {study.summary}
                    </p>
                    <div className="mt-auto flex items-center text-primary text-sm font-bold uppercase tracking-widest">
                      Access File <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
