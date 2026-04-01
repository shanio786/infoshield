import { motion } from "framer-motion";
import { useGetGlobalStats, getGetGlobalStatsQueryKey } from "@workspace/api-client-react";
import { ShieldAlert, Users, Award, Target, ArrowRight } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";

export function Home() {
  const { data: stats, isLoading } = useGetGlobalStats({
    query: { queryKey: getGetGlobalStatsQueryKey() }
  });

  return (
    <div className="flex flex-col min-h-full">
      {/* Hero Section */}
      <section className="relative flex-1 flex flex-col items-center justify-center px-6 py-24 text-center overflow-hidden">
        <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_center,hsl(190,90%,50%,0.15)_0,transparent_50%)] pointer-events-none" />
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="z-10 max-w-4xl mx-auto"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/80 border border-border text-xs font-medium tracking-widest uppercase text-muted-foreground mb-8">
            <ShieldAlert className="w-4 h-4 text-primary" />
            University of Canberra Cyber Project
          </div>
          
          <h1 className="text-5xl md:text-7xl font-serif font-bold text-foreground tracking-tight leading-tight mb-6">
            Understand the Mechanics of <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-400">Information Warfare</span>
          </h1>
          
          <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed">
            A professional intelligence briefing on how disinformation campaigns manipulate public perception. Equip yourself to recognize, analyze, and neutralize narrative threats.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/learn">
              <Button size="lg" className="h-12 px-8 text-base font-medium rounded-sm w-full sm:w-auto">
                Begin Briefing
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Link href="/case-studies">
              <Button size="lg" variant="outline" className="h-12 px-8 text-base font-medium rounded-sm w-full sm:w-auto border-border hover:bg-secondary">
                View Case Studies
              </Button>
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-6 border-t border-border bg-card/30">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <StatCard 
              icon={Users} 
              value={isLoading ? "..." : stats?.totalUsers.toLocaleString()} 
              label="Active Analysts" 
              delay={0.1} 
            />
            <StatCard 
              icon={Target} 
              value={isLoading ? "..." : stats?.totalLessonsCompleted.toLocaleString()} 
              label="Briefings Cleared" 
              delay={0.2} 
            />
            <StatCard 
              icon={ShieldAlert} 
              value={isLoading ? "..." : stats?.totalQuizzesTaken.toLocaleString()} 
              label="Simulations Run" 
              delay={0.3} 
            />
            <StatCard 
              icon={Award} 
              value={isLoading ? "..." : stats?.totalBadgesAwarded.toLocaleString()} 
              label="Commendations" 
              delay={0.4} 
            />
          </div>
        </div>
      </section>
    </div>
  );
}

function StatCard({ icon: Icon, value, label, delay }: { icon: any, value: React.ReactNode, label: string, delay: number }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className="flex flex-col items-center justify-center p-6 bg-card border border-border rounded-lg shadow-sm"
    >
      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
        <Icon className="w-6 h-6 text-primary" />
      </div>
      <div className="text-3xl font-bold text-foreground mb-1 font-serif">{value}</div>
      <div className="text-sm font-medium text-muted-foreground uppercase tracking-wider">{label}</div>
    </motion.div>
  );
}
