import { PageHeader } from "@/components/PageHeader";
import { CheckCircle2, Quote, Zap, Circle, User, Bell, Moon, LogOut, ChevronRight, Info, Trash2 } from "lucide-react";
import { useState, useEffect } from "react";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useTheme } from "@/App";

export default function Settings() {
  const { toast } = useToast();
  const { theme, setTheme } = useTheme();
  const [notifications, setNotifications] = useState(true);

  const toggleDarkMode = (checked: boolean) => {
    setTheme(checked ? "dark" : "light");
  };

  const handleReset = () => {
    if (confirm("Are you sure you want to delete all habits and progress? This cannot be undone.")) {
      localStorage.removeItem("habits");
      toast({ title: "Data Reset", description: "All habits have been cleared." });
      window.location.reload();
    }
  };

  return (
    <div className="min-h-screen bg-background pb-24 px-6 pt-safe">
      <PageHeader title="Settings" subtitle="Customize your experience" />

      <div className="space-y-8">
        <div>
          <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-4 px-2">
            App Settings
          </h3>
          <div className="bg-card rounded-3xl overflow-hidden border border-border/50 shadow-sm divide-y divide-border/50">
            <div className="flex items-center p-4">
              <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center mr-4">
                <Moon className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <p className="font-bold text-card-foreground">Dark Mode</p>
                <p className="text-sm text-muted-foreground">Adjust the app appearance</p>
              </div>
              <Switch checked={theme === "dark"} onCheckedChange={toggleDarkMode} />
            </div>

            <div className="flex items-center p-4">
              <div className="w-10 h-10 rounded-full bg-accent/10 text-accent flex items-center justify-center mr-4">
                <Bell className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <p className="font-bold text-card-foreground">Notifications</p>
                <p className="text-sm text-muted-foreground">Daily reminders & updates</p>
              </div>
              <Switch checked={notifications} onCheckedChange={setNotifications} />
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-4 px-2">
            Data Management
          </h3>
          <div className="bg-card rounded-3xl overflow-hidden border border-border/50 shadow-sm divide-y divide-border/50">
            <div onClick={handleReset} className="flex items-center p-4 hover:bg-destructive/10 cursor-pointer transition-colors group">
              <div className="w-10 h-10 rounded-full bg-destructive/10 text-destructive flex items-center justify-center mr-4 group-hover:bg-destructive/20">
                <Trash2 className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <p className="font-bold text-destructive">Reset All Data</p>
                <p className="text-sm text-destructive/60">Clear habits and history</p>
              </div>
              <ChevronRight className="w-5 h-5 text-destructive/20" />
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-4 px-2">
            About
          </h3>
          <div className="bg-card rounded-3xl overflow-hidden border border-border/50 shadow-sm divide-y divide-border/50 text-left">
            <div className="flex items-center p-4">
              <div className="w-10 h-10 rounded-full bg-secondary text-secondary-foreground flex items-center justify-center mr-4">
                <Info className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <p className="font-bold text-card-foreground">Habit Tracker Pro</p>
                <p className="text-sm text-muted-foreground">Version 1.0.0 • Premium Edition</p>
              </div>
            </div>
          </div>
        </div>

        <p className="text-center text-xs text-muted-foreground font-medium pt-4 uppercase tracking-widest opacity-50">
          All data is stored locally on your device.
        </p>
      </div>
    </div>
  );
}
