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
  X
} from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";

const NAV_ITEMS = [
  { href: "/", label: "Home", icon: Home },
  { href: "/learn", label: "Modules", icon: BookOpen },
  { href: "/quiz", label: "Quizzes", icon: HelpCircle },
  { href: "/case-studies", label: "Case Studies", icon: FileText },
  { href: "/forum", label: "Intel Forum", icon: MessageSquare },
  { href: "/dashboard", label: "Command Center", icon: LayoutDashboard },
  { href: "/badges", label: "Awards", icon: Award },
];

export function Layout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-[100dvh] flex w-full bg-background text-foreground overflow-hidden">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-64 flex-col border-r border-border bg-card/50 backdrop-blur-xl shrink-0 h-screen sticky top-0 z-20">
        <div className="h-16 flex items-center px-6 border-b border-border">
          <Link href="/" className="flex items-center gap-3 text-primary hover:opacity-80 transition-opacity">
            <Shield className="w-6 h-6" />
            <span className="font-serif font-bold text-xl tracking-tight text-foreground">InfoShield</span>
          </Link>
        </div>
        
        <nav className="flex-1 py-6 px-3 flex flex-col gap-1 overflow-y-auto">
          {NAV_ITEMS.map((item) => {
            const isActive = location === item.href || (item.href !== "/" && location.startsWith(item.href));
            const Icon = item.icon;
            
            return (
              <Link key={item.href} href={item.href}>
                <div 
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-md transition-all duration-200 cursor-pointer ${
                    isActive 
                      ? "bg-primary/10 text-primary font-medium" 
                      : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                  }`}
                >
                  <Icon className={`w-5 h-5 ${isActive ? "text-primary" : ""}`} />
                  {item.label}
                </div>
              </Link>
            );
          })}
        </nav>
        
        <div className="p-4 border-t border-border">
          <div className="bg-secondary/50 rounded-lg p-4">
            <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mb-1">Status</p>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-sm font-medium">Clearance: Guest</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 border-b border-border bg-background/95 backdrop-blur z-30 flex items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2 text-primary">
          <Shield className="w-5 h-5" />
          <span className="font-serif font-bold text-lg text-foreground">InfoShield</span>
        </Link>
        <Button variant="ghost" size="icon" onClick={() => setMobileMenuOpen(true)}>
          <Menu className="w-6 h-6" />
        </Button>
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
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 bottom-0 w-3/4 max-w-xs bg-card border-l border-border z-50 flex flex-col md:hidden"
            >
              <div className="h-16 flex items-center justify-between px-4 border-b border-border">
                <span className="font-serif font-bold text-lg">Menu</span>
                <Button variant="ghost" size="icon" onClick={() => setMobileMenuOpen(false)}>
                  <X className="w-6 h-6" />
                </Button>
              </div>
              <nav className="flex-1 py-4 px-2 flex flex-col gap-1 overflow-y-auto">
                {NAV_ITEMS.map((item) => {
                  const isActive = location === item.href || (item.href !== "/" && location.startsWith(item.href));
                  const Icon = item.icon;
                  return (
                    <Link key={item.href} href={item.href} onClick={() => setMobileMenuOpen(false)}>
                      <div className={`flex items-center gap-3 px-4 py-3 rounded-md transition-all ${
                        isActive ? "bg-primary/10 text-primary font-medium" : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                      }`}>
                        <Icon className="w-5 h-5" />
                        {item.label}
                      </div>
                    </Link>
                  );
                })}
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="flex-1 flex flex-col w-full h-screen overflow-y-auto md:pt-0 pt-16 relative">
        {children}
      </main>
    </div>
  );
}
