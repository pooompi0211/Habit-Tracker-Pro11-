import { Link, useLocation } from "wouter";
import { Home, Calendar, Plus, BarChart2, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

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
      <div className="max-w-md mx-auto px-4 h-20 flex items-center justify-between">
        {navItems.map((item) => {
          const isActive = location === item.href;
          
          if (item.isSpecial) {
            return (
              <Link key={item.href} href={item.href} className="relative -top-5">
                <div className={cn(
                  "w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-transform hover:scale-105 active:scale-95",
                  isActive 
                    ? "bg-primary text-primary-foreground shadow-primary/40 ring-4 ring-primary/20" 
                    : "bg-primary text-primary-foreground shadow-primary/30 hover:bg-primary/90"
                )}>
                  <item.icon className="w-7 h-7" strokeWidth={2.5} />
                </div>
              </Link>
            );
          }

          return (
            <Link key={item.href} href={item.href}>
              <div className={cn(
                "flex flex-col items-center justify-center gap-1 w-12 transition-colors duration-200 cursor-pointer",
                isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
              )}>
                <item.icon 
                  className={cn("w-6 h-6 transition-all", isActive && "fill-current/10 scale-110")} 
                  strokeWidth={isActive ? 2.5 : 2} 
                />
                <span className={cn("text-[10px] font-bold tracking-tight", isActive ? "opacity-100" : "opacity-0 scale-0 h-0 overflow-hidden")}>
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
