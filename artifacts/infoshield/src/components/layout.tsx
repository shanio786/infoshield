import { Link, useLocation } from "wouter";
import {
  Shield,
  Home,
  BookOpen,
  HelpCircle,
  LayoutDashboard,
  Award,
  FileText,
  MessageSquare,
  Menu,
  X,
  Puzzle,
  LogOut,
  ChevronDown,
} from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/auth";

const NAV_ITEMS = [
  { href: "/", label: "Home", icon: Home },
  { href: "/learn", label: "Modules", icon: BookOpen },
  { href: "/quiz", label: "Quizzes", icon: HelpCircle },
  { href: "/puzzles", label: "Puzzles", icon: Puzzle },
  { href: "/case-studies", label: "Case Studies", icon: FileText },
  { href: "/forum", label: "Intel Forum", icon: MessageSquare },
  { href: "/dashboard", label: "Command Center", icon: LayoutDashboard },
  { href: "/badges", label: "Awards", icon: Award },
];

function UserMenu() {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  if (!user) return null;

  const initials = user.displayName.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase();

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 px-2 py-2 rounded-sm hover:bg-secondary/60 transition-colors w-full text-left"
      >
        <div className="w-7 h-7 rounded-sm bg-primary/20 border border-primary/30 flex items-center justify-center text-xs font-bold text-primary shrink-0">
          {initials}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-semibold text-foreground truncate">{user.displayName}</p>
          <p className="text-[10px] text-muted-foreground uppercase tracking-wider">{user.role}</p>
        </div>
        <ChevronDown className={`w-3.5 h-3.5 text-muted-foreground transition-transform shrink-0 ${open ? "rotate-180" : ""}`} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 4, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.97 }}
            transition={{ duration: 0.12 }}
            className="absolute bottom-full left-0 right-0 mb-1 bg-card border border-border rounded-sm shadow-xl overflow-hidden z-50"
          >
            <div className="px-3 py-2 border-b border-border">
              <p className="text-[10px] text-muted-foreground truncate">{user.email}</p>
            </div>
            <button
              onClick={() => { logout(); setOpen(false); }}
              className="flex items-center gap-2 w-full px-3 py-2 text-xs text-muted-foreground hover:text-destructive hover:bg-destructive/5 transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              Sign Out
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function Layout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, logout } = useAuth();

  const initials = user?.displayName.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase() ?? "?";

  return (
    <div className="min-h-[100dvh] flex w-full bg-background text-foreground overflow-hidden">
      {/* Subtle grid background */}
      <div className="fixed inset-0 bg-[linear-gradient(rgba(14,165,233,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(14,165,233,0.025)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none z-0" />

      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-58 flex-col border-r border-border bg-card/40 backdrop-blur-xl shrink-0 h-screen sticky top-0 z-20" style={{ width: "230px" }}>
        {/* Logo */}
        <div className="h-14 flex items-center px-4 border-b border-border">
          <Link href="/" className="flex items-center gap-2.5 hover:opacity-80 transition-opacity">
            <div className="w-7 h-7 rounded-sm bg-primary/15 border border-primary/30 flex items-center justify-center">
              <Shield className="w-3.5 h-3.5 text-primary" />
            </div>
            <div>
              <span className="font-serif font-bold text-base tracking-tight text-foreground leading-none">InfoShield</span>
              <div className="text-[9px] text-muted-foreground tracking-[0.25em] uppercase leading-none mt-0.5">UC · 2026-S1-35</div>
            </div>
          </Link>
        </div>

        {/* Nav */}
        <nav className="flex-1 py-3 px-2 flex flex-col gap-0.5 overflow-y-auto">
          <p className="text-[9px] font-bold text-muted-foreground tracking-[0.25em] uppercase px-2 mb-1.5 mt-1">Sections</p>
          {NAV_ITEMS.map((item) => {
            const isActive = location === item.href || (item.href !== "/" && location.startsWith(item.href));
            const Icon = item.icon;

            return (
              <Link key={item.href} href={item.href}>
                <div
                  className={`flex items-center gap-2.5 px-2 py-1.5 rounded-sm text-[13px] transition-all duration-100 cursor-pointer ${
                    isActive
                      ? "bg-primary/10 text-primary font-semibold border-l-2 border-primary pl-[5px]"
                      : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5 shrink-0" />
                  {item.label}
                </div>
              </Link>
            );
          })}
        </nav>

        {/* Status + User */}
        <div className="p-2 border-t border-border space-y-1.5">
          <div className="px-2 py-1.5 bg-secondary/30 rounded-sm border border-border/50">
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">System Online</span>
            </div>
          </div>
          <UserMenu />
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-14 border-b border-border bg-background/95 backdrop-blur z-30 flex items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          <Shield className="w-4 h-4 text-primary" />
          <span className="font-serif font-bold text-base text-foreground">InfoShield</span>
        </Link>
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-sm bg-primary/20 border border-primary/30 flex items-center justify-center text-[11px] font-bold text-primary">
            {initials}
          </div>
          <Button variant="ghost" size="icon" onClick={() => setMobileMenuOpen(true)} className="w-8 h-8">
            <Menu className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 md:hidden"
              onClick={() => setMobileMenuOpen(false)}
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 220 }}
              className="fixed top-0 right-0 bottom-0 w-72 bg-card border-l border-border z-50 flex flex-col md:hidden"
            >
              <div className="h-14 flex items-center justify-between px-4 border-b border-border">
                <span className="font-serif font-bold">InfoShield</span>
                <Button variant="ghost" size="icon" onClick={() => setMobileMenuOpen(false)} className="w-8 h-8">
                  <X className="w-4 h-4" />
                </Button>
              </div>

              {user && (
                <div className="px-4 py-3 border-b border-border bg-secondary/20">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-sm bg-primary/20 border border-primary/30 flex items-center justify-center text-sm font-bold text-primary">
                      {initials}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-foreground">{user.displayName}</p>
                      <p className="text-xs text-muted-foreground">{user.email}</p>
                    </div>
                  </div>
                </div>
              )}

              <nav className="flex-1 py-3 px-2 flex flex-col gap-0.5 overflow-y-auto">
                {NAV_ITEMS.map((item) => {
                  const isActive = location === item.href || (item.href !== "/" && location.startsWith(item.href));
                  const Icon = item.icon;
                  return (
                    <Link key={item.href} href={item.href} onClick={() => setMobileMenuOpen(false)}>
                      <div className={`flex items-center gap-3 px-4 py-2.5 rounded-sm text-sm transition-all ${
                        isActive ? "bg-primary/10 text-primary font-medium" : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                      }`}>
                        <Icon className="w-4 h-4" />
                        {item.label}
                      </div>
                    </Link>
                  );
                })}
              </nav>

              <div className="p-3 border-t border-border">
                <button
                  onClick={() => { logout(); setMobileMenuOpen(false); }}
                  className="flex items-center gap-3 w-full px-4 py-2.5 rounded-sm text-sm text-muted-foreground hover:text-destructive hover:bg-destructive/5 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="flex-1 flex flex-col w-full min-h-screen overflow-y-auto md:pt-0 pt-14 relative z-10">
        {children}
      </main>
    </div>
  );
}
