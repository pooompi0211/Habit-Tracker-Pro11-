import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { ArrowLeft, Sparkles, Clock, Repeat, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export default function AddHabit() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    name: "",
    motivation: "",
    frequency: "daily" as "daily" | "custom",
    days: [] as number[],
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
          className="rounded-full"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <h1 className="text-2xl font-bold font-display">New Habit</h1>
      </div>

      <form onSubmit={handleSubmit} className="flex-1 flex flex-col max-w-lg mx-auto w-full">
        <div className="space-y-8 flex-1">
          <div className="space-y-3">
            <label className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
              What do you want to achieve?
            </label>
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-primary">
                <Sparkles className="w-6 h-6" />
              </div>
              <input
                autoFocus
                type="text"
                placeholder="e.g., Read 30 mins, Drink Water"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className="w-full bg-white text-xl font-bold p-6 pl-14 rounded-3xl border border-border/50 shadow-sm focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all placeholder:text-muted-foreground/40"
              />
            </div>
          </div>

          <div className="space-y-4">
            <label className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
              Frequency
            </label>
            <div className="grid grid-cols-2 gap-4">
              <button 
                type="button" 
                onClick={() => setFormData(p => ({ ...p, frequency: "daily" }))}
                className={`p-4 rounded-2xl border transition-all text-left flex flex-col gap-2 ${formData.frequency === "daily" ? 'border-primary bg-primary/5 ring-2 ring-primary/20' : 'bg-white border-border/50'}`}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${formData.frequency === "daily" ? 'bg-primary text-white' : 'bg-orange-50 text-orange-500'}`}>
                  <Repeat className="w-4 h-4" />
                </div>
                <span className="font-bold text-sm">Every day</span>
              </button>

              <button 
                type="button" 
                onClick={() => setFormData(p => ({ ...p, frequency: "custom" }))}
                className={`p-4 rounded-2xl border transition-all text-left flex flex-col gap-2 ${formData.frequency === "custom" ? 'border-primary bg-primary/5 ring-2 ring-primary/20' : 'bg-white border-border/50'}`}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${formData.frequency === "custom" ? 'bg-primary text-white' : 'bg-blue-50 text-blue-500'}`}>
                  <Clock className="w-4 h-4" />
                </div>
                <span className="font-bold text-sm">Custom days</span>
              </button>
            </div>

            {formData.frequency === "custom" && (
              <div className="flex flex-wrap gap-2 p-4 bg-white rounded-2xl border border-border/50">
                {DAYS.map((day, i) => (
                  <Button
                    key={day}
                    type="button"
                    variant={formData.days.includes(i) ? "default" : "outline"}
                    className="flex-1 min-w-[60px]"
                    onClick={() => toggleDay(i)}
                  >
                    {day}
                  </Button>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-3">
            <label className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
              Motivation (Optional)
            </label>
            <textarea
              placeholder="Why is this important to you?"
              value={formData.motivation}
              onChange={(e) => setFormData(prev => ({ ...prev, motivation: e.target.value }))}
              className="w-full bg-white p-6 rounded-3xl border border-border/50 shadow-sm focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all min-h-[120px] resize-none"
            />
          </div>
        </div>

        <div className="mt-8 sticky bottom-6">
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
