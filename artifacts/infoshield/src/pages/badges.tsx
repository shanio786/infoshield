import { useListBadges, getListBadgesQueryKey, useGetUserProgress, getGetUserProgressQueryKey } from "@workspace/api-client-react";
import { motion } from "framer-motion";
import { Award, Lock } from "lucide-react";
import { DynamicIcon } from "@/lib/icon-map";
import { Card, CardContent } from "@/components/ui/card";
import { Badge as UiBadge } from "@/components/ui/badge";
import { useAuth } from "@/context/auth";

export function Badges() {
  const { user } = useAuth();
  const userId = user?.id ?? "guest-user";
  const { data: allBadges, isLoading: badgesLoading } = useListBadges({
    query: { queryKey: getListBadgesQueryKey() }
  });

  const { data: progress } = useGetUserProgress(userId, {
    query: { queryKey: getGetUserProgressQueryKey(userId) }
  });

  if (badgesLoading) {
    return <div className="p-10 text-center animate-pulse">Loading commendations...</div>;
  }

  const earnedBadgeIds = new Set(progress?.earnedBadges.map(b => b.id) || []);

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'legendary': return 'text-amber-500 border-amber-500 bg-amber-500/10';
      case 'rare': return 'text-purple-400 border-purple-400 bg-purple-400/10';
      case 'uncommon': return 'text-blue-400 border-blue-400 bg-blue-400/10';
      default: return 'text-slate-300 border-slate-600 bg-slate-800';
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6 md:p-10 w-full">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
        <h1 className="text-4xl font-serif font-bold tracking-tight mb-3 flex items-center gap-3">
          <Award className="w-10 h-10 text-primary" /> Commendations
        </h1>
        <p className="text-muted-foreground text-lg max-w-2xl">
          Track your achievements and special recognitions across intelligence operations.
        </p>
      </motion.div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {allBadges?.map((badge, index) => {
          const isEarned = earnedBadgeIds.has(badge.id);

          return (
            <motion.div
              key={badge.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
            >
              <Card className={`h-full border transition-all ${isEarned ? 'bg-card border-border' : 'bg-background border-border/50 opacity-60 grayscale'}`}>
                <CardContent className="p-6 flex flex-col items-center text-center relative h-full">
                  {!isEarned && (
                    <div className="absolute top-3 right-3 text-muted-foreground">
                      <Lock className="w-4 h-4" />
                    </div>
                  )}
                  
                  <div className={`mb-4 p-4 rounded-full ${isEarned ? 'bg-secondary text-primary' : 'bg-muted text-muted-foreground'}`}>
                    <DynamicIcon name={badge.icon ?? "Award"} className="w-10 h-10" />
                  </div>
                  
                  <UiBadge variant="outline" className={`mb-3 text-[10px] uppercase tracking-wider font-mono ${getRarityColor(badge.rarity)}`}>
                    {badge.rarity}
                  </UiBadge>
                  
                  <h3 className={`font-bold font-serif mb-2 leading-tight ${isEarned ? 'text-foreground' : 'text-muted-foreground'}`}>
                    {badge.name}
                  </h3>
                  
                  <p className="text-xs text-muted-foreground mt-auto">
                    {badge.description}
                  </p>
                  
                  {isEarned && (
                    <div className="mt-4 pt-3 border-t border-border w-full text-xs font-mono text-primary font-bold">
                      +{badge.xpValue} XP
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
