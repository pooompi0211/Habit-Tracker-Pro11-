import { useState } from "react";
import { useLocation } from "wouter";
import { ArrowLeft, Sparkles, Clock, Repeat, Target, Calendar as CalendarIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export default function AddHabit() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    name: "",
    motivation: "",
    frequency: "daily" as "daily" | "weekly" | "custom" | "timed" | "goal",
    days: [] as number[],
    scheduledTime: "",
    goalStreak: 7,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) return;

    if (formData.frequency === "custom" && formData.days.length === 0) {
      toast({ 
        title: "Selection Required", 
        description: "Please select at least one day for custom frequency.", 
        variant: "destructive" 
      });
      return;
    }

    const habits = JSON.parse(localStorage.getItem("habits") || "[]");
    const newHabit = {
      ...formData,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString(),
      progress: {},
    };

    localStorage.setItem("habits", JSON.stringify([...habits, newHabit]));
    
    toast({ title: "Habit Created", description: "Let's start tracking!" });
    setLocation("/");
  };

  const toggleDay = (index: number) => {
    setFormData(prev => ({
      ...prev,
      days: prev.days.includes(index) 
        ? prev.days.filter(d => d !== index)
        : [...prev.days, index]
    }));
  };

  return (
    <div className="min-h-screen bg-background pb-24 px-6 pt-safe flex flex-col">
      <div className="flex items-center gap-4 py-6 mb-4">
        <Button 
          variant="outline"
          size="icon"
          onClick={() => setLocation("/")}
          className="rounded-full hover:bg-secondary"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <h1 className="text-2xl font-bold font-display text-foreground">New Habit</h1>
      </div>

      <form onSubmit={handleSubmit} className="flex-1 flex flex-col max-w-lg mx-auto w-full">
        <div className="space-y-6 flex-1 overflow-y-auto pb-6">
          <div className="space-y-3">
            <label className="text-sm font-bold uppercase tracking-wider text-muted-foreground opacity-70">
              Habit Name
            </label>
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-primary">
                <Sparkles className="w-6 h-6" />
              </div>
              <input
                autoFocus
                type="text"
                placeholder="e.g., Read 30 mins"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className="w-full bg-card text-foreground text-xl font-bold p-6 pl-14 rounded-3xl border border-border/50 shadow-sm focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all placeholder:text-muted-foreground/30"
              />
            </div>
          </div>

          <div className="space-y-4">
            <label className="text-sm font-bold uppercase tracking-wider text-muted-foreground opacity-70">
              Frequency Type
            </label>
            <div className="grid grid-cols-2 gap-3">
              {[
                { id: "daily", icon: Repeat, label: "Daily" },
                { id: "weekly", icon: CalendarIcon, label: "Weekly" },
                { id: "custom", icon: Clock, label: "Custom" },
                { id: "timed", icon: Clock, label: "Timed" },
                { id: "goal", icon: Target, label: "Goal" },
              ].map((type) => (
                <button 
                  key={type.id}
                  type="button" 
                  onClick={() => setFormData(p => ({ ...p, frequency: type.id as any }))}
                  className={`p-4 rounded-2xl border transition-all text-left flex flex-col gap-2 ${formData.frequency === type.id ? 'border-primary bg-primary/10 ring-2 ring-primary/20' : 'bg-card border-border/50 shadow-sm'}`}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${formData.frequency === type.id ? 'bg-primary text-primary-foreground' : 'bg-secondary text-muted-foreground'}`}>
                    <type.icon className="w-4 h-4" />
                  </div>
                  <span className={`font-bold text-sm ${formData.frequency === type.id ? 'text-primary' : 'text-card-foreground'}`}>{type.label}</span>
                </button>
              ))}
            </div>

            {formData.frequency === "custom" && (
              <div className="flex flex-wrap gap-2 p-4 bg-card rounded-2xl border border-border/50 shadow-sm">
                {DAYS.map((day, i) => (
                  <Button
                    key={day}
                    type="button"
                    variant={formData.days.includes(i) ? "default" : "outline"}
                    className="flex-1 min-w-[60px] font-bold"
                    onClick={() => toggleDay(i)}
                  >
                    {day}
                  </Button>
                ))}
              </div>
            )}

            {formData.frequency === "timed" && (
              <div className="p-4 bg-card rounded-2xl border border-border/50 shadow-sm">
                <input 
                  type="time" 
                  value={formData.scheduledTime}
                  onChange={(e) => setFormData(p => ({ ...p, scheduledTime: e.target.value }))}
                  className="w-full bg-transparent text-foreground text-lg font-bold focus:outline-none"
                />
              </div>
            )}

            {formData.frequency === "goal" && (
              <div className="p-4 bg-card rounded-2xl border border-border/50 shadow-sm space-y-2">
                <span className="text-sm font-bold text-muted-foreground">Goal Streak: {formData.goalStreak} Days</span>
                <input 
                  type="range" 
                  min="1" 
                  max="30" 
                  value={formData.goalStreak}
                  onChange={(e) => setFormData(p => ({ ...p, goalStreak: parseInt(e.target.value) }))}
                  className="w-full accent-primary"
                />
              </div>
            )}
          </div>

          <div className="space-y-3">
            <label className="text-sm font-bold uppercase tracking-wider text-muted-foreground opacity-70">
              Motivation
            </label>
            <textarea
              placeholder="Why is this important?"
              value={formData.motivation}
              onChange={(e) => setFormData(prev => ({ ...prev, motivation: e.target.value }))}
              className="w-full bg-card text-foreground p-6 rounded-3xl border border-border/50 shadow-sm focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all min-h-[100px] resize-none placeholder:text-muted-foreground/30"
            />
          </div>
        </div>

        <div className="mt-4 pb-6">
          <Button
            type="submit"
            disabled={!formData.name}
            className="w-full h-14 rounded-2xl text-lg font-bold shadow-xl shadow-primary/30"
          >
            Create Habit
          </Button>
        </div>
      </form>
    </div>
  );
}
