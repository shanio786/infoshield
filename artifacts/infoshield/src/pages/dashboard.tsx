import { useGetDashboard, getGetDashboardQueryKey } from "@workspace/api-client-react";
import { motion } from "framer-motion";
import { Link } from "wouter";
import { Target, BookOpen, ShieldAlert, Zap, TrendingUp, ChevronRight, Award } from "lucide-react";
import { DynamicIcon } from "@/lib/icon-map";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function Dashboard() {
  const { data: dashboard, isLoading } = useGetDashboard("guest-user", {
    query: { queryKey: getGetDashboardQueryKey("guest-user") }
  });

  if (isLoading) {
    return <div className="p-10 text-center animate-pulse">Loading Command Center...</div>;
  }

  if (!dashboard) {
    return <div className="p-10 text-center text-destructive">Failed to load data.</div>;
  }

  // Calculate XP progress to next level
  const baseXPForCurrentLevel = (dashboard.level - 1) * 1000;
  const nextLevelXP = dashboard.level * 1000;
  const currentLevelProgress = dashboard.totalXp - baseXPForCurrentLevel;
  const xpNeeded = nextLevelXP - baseXPForCurrentLevel;
  const progressPct = Math.min(100, Math.max(0, (currentLevelProgress / xpNeeded) * 100));

  const modulePct = (dashboard.modulesCompleted / dashboard.modulesTotal) * 100 || 0;

  return (
    <div className="max-w-6xl mx-auto p-6 md:p-10 w-full space-y-8">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-border pb-6">
        <div>
          <h1 className="text-4xl font-serif font-bold tracking-tight">Command Center</h1>
          <p className="text-muted-foreground mt-2 text-lg">Analyst: <span className="font-mono text-primary uppercase">guest-user</span></p>
        </div>
        <div className="flex gap-4">
          <div className="bg-card border border-border rounded-lg p-3 flex flex-col items-center min-w-[100px]">
            <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1">Level</span>
            <span className="text-3xl font-serif font-bold text-primary">{dashboard.level}</span>
          </div>
          <div className="bg-card border border-border rounded-lg p-3 flex flex-col items-center min-w-[100px]">
            <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1">Streak</span>
            <span className="text-3xl font-serif font-bold text-orange-400 flex items-center"><Zap className="w-5 h-5 mr-1" />{dashboard.currentStreak}</span>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* XP Progress */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="md:col-span-2">
          <Card className="h-full bg-secondary/20 border-primary/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-mono text-muted-foreground tracking-widest uppercase">Clearance Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-end mb-2">
                <span className="text-2xl font-bold text-foreground">{dashboard.totalXp.toLocaleString()} XP</span>
                <span className="text-sm text-muted-foreground">Next Level: {nextLevelXP.toLocaleString()} XP</span>
              </div>
              <Progress value={progressPct} className="h-3" />
            </CardContent>
          </Card>
        </motion.div>

        {/* Stats Summary */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="grid grid-cols-2 gap-4">
          <div className="bg-card border border-border rounded-lg p-4 flex flex-col justify-center">
            <BookOpen className="w-5 h-5 text-primary mb-2" />
            <span className="text-2xl font-bold">{dashboard.lessonsCompleted}</span>
            <span className="text-xs text-muted-foreground uppercase">Lessons</span>
          </div>
          <div className="bg-card border border-border rounded-lg p-4 flex flex-col justify-center">
            <Target className="w-5 h-5 text-primary mb-2" />
            <span className="text-2xl font-bold">{dashboard.quizzesPassed}</span>
            <span className="text-xs text-muted-foreground uppercase">Simulations</span>
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Next Module Action */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-primary" /> Active Directive
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-6">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-muted-foreground">Module Completion</span>
                  <span className="font-bold">{dashboard.modulesCompleted} / {dashboard.modulesTotal}</span>
                </div>
                <Progress value={modulePct} className="h-2 bg-secondary" />
              </div>
              
              {dashboard.nextModule ? (
                <div className="bg-secondary/30 rounded-lg p-5 border border-border">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-xs font-mono text-primary font-bold tracking-wider mb-1 block">RECOMMENDED NEXT</span>
                      <h3 className="text-xl font-serif font-bold mb-1">{dashboard.nextModule.title}</h3>
                      <p className="text-sm text-muted-foreground line-clamp-2">{dashboard.nextModule.description}</p>
                    </div>
                    <div className="text-primary opacity-80">
                      <DynamicIcon name={dashboard.nextModule.icon ?? "BookOpen"} className="w-10 h-10" />
                    </div>
                  </div>
                  <Link href={`/learn/${dashboard.nextModule.id}`}>
                    <button className="mt-4 w-full bg-primary text-primary-foreground font-medium py-2.5 rounded-md hover:opacity-90 transition-opacity flex items-center justify-center">
                      Commence Briefing <ChevronRight className="w-4 h-4 ml-1" />
                    </button>
                  </Link>
                </div>
              ) : (
                <div className="text-center p-8 text-muted-foreground bg-secondary/10 rounded-lg border border-border">
                  <ShieldAlert className="w-12 h-12 mx-auto mb-3 opacity-20" />
                  <p>All core directives completed. Awaiting further intelligence.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Recent Activity */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Activity Log</CardTitle>
            </CardHeader>
            <CardContent>
              {dashboard.recentActivity.length === 0 ? (
                <p className="text-muted-foreground text-center p-6">No recent activity detected.</p>
              ) : (
                <div className="space-y-0 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-border before:to-transparent">
                  {dashboard.recentActivity.map((activity, i) => (
                    <div key={i} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active pb-6">
                      <div className="flex items-center justify-center w-10 h-10 rounded-full border border-background bg-secondary text-primary shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow">
                        {activity.type === 'lesson' ? <BookOpen className="w-4 h-4" /> : 
                         activity.type === 'quiz' ? <Target className="w-4 h-4" /> : 
                         <Award className="w-4 h-4" />}
                      </div>
                      <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded bg-card border border-border shadow-sm">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-bold text-sm text-foreground">{activity.type.toUpperCase()}</span>
                          <span className="text-xs text-muted-foreground">{new Date(activity.timestamp).toLocaleDateString()}</span>
                        </div>
                        <p className="text-sm text-muted-foreground">{activity.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
