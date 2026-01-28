import { Link, useLocation } from "wouter";
import { Home, Calendar, Plus, BarChart2, Settings } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

export function BottomNav() {
  const [location] = useLocation();

  const navItems = [
    { icon: Home, label: "Home", href: "/" },
    { icon: Calendar, label: "Calendar", href: "/calendar" },
    { icon: Plus, label: "Add", href: "/add-habit", isSpecial: true },
    { icon: BarChart2, label: "Stats", href: "/statistics" },
    { icon: Settings, label: "Settings", href: "/settings" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-card/80 backdrop-blur-lg border-t border-border/50 pb-safe shadow-lg">
      <div className="max-w-md mx-auto px-4 h-20 flex items-center justify-between relative">
        {navItems.map((item) => {
          const isActive = location === item.href;
          
          if (item.isSpecial) {
            return (
              <Link key={item.href} href={item.href} className="relative -top-5">
                <motion.div 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={cn(
                  "w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-transform",
                  isActive 
                    ? "bg-primary text-primary-foreground shadow-primary/40 ring-4 ring-primary/20" 
                    : "bg-primary text-primary-foreground shadow-primary/30 hover:bg-primary/90"
                )}>
                  <item.icon className="w-7 h-7" strokeWidth={2.5} />
                </motion.div>
              </Link>
            );
          }

          return (
            <Link key={item.href} href={item.href}>
              <div className={cn(
                "flex flex-col items-center justify-center gap-1 w-12 transition-colors duration-200 cursor-pointer relative",
                isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
              )}>
                {isActive && (
                  <motion.div
                    layoutId="nav-glow"
                    className="absolute -top-6 w-8 h-1 bg-primary rounded-full shadow-[0_0_10px_rgba(124,92,255,0.5)]"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
                <item.icon 
                  className={cn("w-6 h-6 transition-all", isActive && "scale-110")} 
                  strokeWidth={isActive ? 2.5 : 2} 
                />
                <span className={cn("text-[10px] font-bold tracking-tight transition-all duration-300", isActive ? "opacity-100 translate-y-0" : "opacity-0 translate-y-1 h-0 overflow-hidden")}>
                  {item.label}
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
