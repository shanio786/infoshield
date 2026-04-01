import { useParams } from "wouter";
import { useGetCaseStudy, getGetCaseStudyQueryKey } from "@workspace/api-client-react";
import { motion } from "framer-motion";
import { Link } from "wouter";
import { ArrowLeft, Calendar, Tag, Target, AlertTriangle } from "lucide-react";
import ReactMarkdown from "react-markdown";

export function CaseStudyDetail() {
  const params = useParams<{ slug: string }>();
  const slug = params.slug || "";

  const { data: study, isLoading } = useGetCaseStudy(slug, {
    query: { enabled: !!slug, queryKey: getGetCaseStudyQueryKey(slug) }
  });

  if (isLoading) return <div className="p-10 text-center animate-pulse text-muted-foreground">Retrieving archives...</div>;
  if (!study) return <div className="p-10 text-center text-destructive">Archive not found.</div>;

  return (
    <div className="flex flex-col h-full w-full bg-background">
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-md border-b border-border px-6 py-4 flex items-center">
        <Link href="/case-studies" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Archives
        </Link>
      </div>

      <div className="flex-1 overflow-y-auto">
        <article className="max-w-4xl mx-auto px-6 py-12 md:py-20">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <header className="mb-16 border-b border-border pb-12">
              <div className="flex flex-wrap gap-4 mb-6">
                <span className="inline-flex items-center px-3 py-1 rounded bg-secondary/50 border border-border text-xs font-mono font-bold tracking-wider text-muted-foreground">
                  <Calendar className="w-3.5 h-3.5 mr-2" /> {study.year}
                </span>
                <span className="inline-flex items-center px-3 py-1 rounded bg-secondary/50 border border-border text-xs font-mono font-bold tracking-wider text-primary">
                  <Tag className="w-3.5 h-3.5 mr-2" /> {study.category}
                </span>
              </div>
              
              <h1 className="text-5xl md:text-6xl font-serif font-bold text-foreground leading-tight tracking-tight mb-4">
                {study.title}
              </h1>
              <p className="text-xl md:text-2xl text-muted-foreground font-serif italic">
                {study.subtitle}
              </p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              <div className="lg:col-span-2">
                <div className="prose prose-invert prose-slate max-w-none prose-headings:font-serif prose-headings:text-foreground prose-p:text-muted-foreground prose-p:leading-relaxed prose-a:text-primary prose-strong:text-foreground">
                  <ReactMarkdown>{study.content}</ReactMarkdown>
                </div>
              </div>

              <div className="lg:col-span-1 space-y-8">
                <div className="bg-card border border-destructive/20 p-6 rounded-lg relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-3 opacity-10">
                    <AlertTriangle className="w-24 h-24 text-destructive" />
                  </div>
                  <h3 className="text-lg font-bold font-serif mb-3 text-destructive flex items-center relative z-10">
                    <Target className="w-5 h-5 mr-2" />
                    Impact Analysis
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed relative z-10">
                    {study.impact}
                  </p>
                </div>

                <div className="bg-secondary/20 border border-border p-6 rounded-lg">
                  <h3 className="text-lg font-bold font-serif mb-4 text-primary">Key Takeaways</h3>
                  <ul className="space-y-3">
                    {study.lessons.map((lesson, idx) => (
                      <li key={idx} className="flex items-start text-sm text-muted-foreground">
                        <span className="text-primary font-mono font-bold mr-3">{idx + 1}.</span>
                        <span className="leading-relaxed">{lesson}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-card border border-border p-6 rounded-lg">
                  <h3 className="text-sm font-bold font-serif mb-4 uppercase tracking-widest text-muted-foreground">Sources</h3>
                  <ul className="space-y-2">
                    {study.sources.map((source, idx) => (
                      <li key={idx} className="text-xs text-muted-foreground break-words font-mono opacity-70 hover:opacity-100 transition-opacity">
                        {source}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </motion.div>
        </article>
      </div>
    </div>
  );
}
