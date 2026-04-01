import { motion } from "framer-motion";
import { Link } from "wouter";
import { LogIn, Shield } from "lucide-react";

interface LoginRequiredBannerProps {
  action?: string;
  compact?: boolean;
}

export function LoginRequiredBanner({ action = "track your progress", compact = false }: LoginRequiredBannerProps) {
  if (compact) {
    return (
      <div className="flex items-center gap-3 p-4 rounded-lg border border-primary/30 bg-primary/5">
        <Shield className="w-5 h-5 text-primary shrink-0" />
        <div className="flex-1 min-w-0">
          <p className="text-sm text-foreground font-medium">Sign in to {action}</p>
          <p className="text-xs text-muted-foreground">Free account — takes 30 seconds</p>
        </div>
        <Link href="/login">
          <button className="shrink-0 bg-primary text-primary-foreground text-xs font-bold px-4 py-2 rounded-md hover:opacity-90 transition-opacity flex items-center gap-1.5">
            <LogIn className="w-3.5 h-3.5" />
            Sign In
          </button>
        </Link>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative overflow-hidden rounded-xl border border-primary/30 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent p-8 text-center"
    >
      <div className="absolute inset-0 bg-[linear-gradient(rgba(14,165,233,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(14,165,233,0.04)_1px,transparent_1px)] bg-[size:30px_30px] pointer-events-none" />

      <div className="relative z-10">
        <div className="w-14 h-14 rounded-full bg-primary/15 border border-primary/30 flex items-center justify-center mx-auto mb-4">
          <Shield className="w-7 h-7 text-primary" />
        </div>

        <h3 className="text-xl font-serif font-bold text-foreground mb-2">
          Agent Authentication Required
        </h3>
        <p className="text-muted-foreground text-sm mb-6 max-w-sm mx-auto">
          Sign in to {action}. Create a free account and track your progress, earn XP, and collect badges.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link href="/login">
            <button className="bg-primary text-primary-foreground font-bold px-6 py-2.5 rounded-lg hover:opacity-90 transition-opacity flex items-center gap-2 text-sm">
              <LogIn className="w-4 h-4" />
              Sign In / Register
            </button>
          </Link>
          <p className="text-xs text-muted-foreground">Free · No credit card needed</p>
        </div>
      </div>
    </motion.div>
  );
}
