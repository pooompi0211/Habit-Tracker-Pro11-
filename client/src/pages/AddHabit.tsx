import { useState } from "react";
import { useLocation } from "wouter";
import { ArrowLeft, Sparkles, Clock, Repeat } from "lucide-react";
import { useCreateHabit } from "@/hooks/use-habits";
import { useToast } from "@/hooks/use-toast";

export default function AddHabit() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const createHabit = useCreateHabit();
  
  const [formData, setFormData] = useState({
    title: "",
    description: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title) return;

    try {
      await createHabit.mutateAsync(formData);
      toast({ title: "Habit Created", description: "Let's start tracking!" });
      setLocation("/");
    } catch (error: any) {
      toast({ 
        title: "Error", 
        description: error.message, 
        variant: "destructive" 
      });
    }
  };

  return (
    <div className="min-h-screen bg-background pb-24 px-6 pt-safe flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-4 py-6 mb-4">
        <button 
          onClick={() => setLocation("/")}
          className="w-10 h-10 rounded-full bg-white border border-border shadow-sm flex items-center justify-center hover:bg-secondary transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-2xl font-bold font-display">New Habit</h1>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="flex-1 flex flex-col max-w-lg mx-auto w-full">
        <div className="space-y-8 flex-1">
          {/* Title Input */}
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
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                className="w-full bg-white text-xl font-bold p-6 pl-14 rounded-3xl border border-border/50 shadow-sm focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all placeholder:text-muted-foreground/40"
              />
            </div>
          </div>

          {/* Settings Section Placeholder */}
          <div className="grid grid-cols-2 gap-4">
            <button type="button" className="p-4 bg-white rounded-2xl border border-border/50 flex flex-col gap-3 hover:border-primary/50 hover:shadow-md transition-all text-left group">
              <div className="w-10 h-10 rounded-full bg-orange-50 text-orange-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Repeat className="w-5 h-5" />
              </div>
              <div>
                <span className="block font-bold text-sm">Frequency</span>
                <span className="text-xs text-muted-foreground">Every day</span>
              </div>
            </button>

            <button type="button" className="p-4 bg-white rounded-2xl border border-border/50 flex flex-col gap-3 hover:border-primary/50 hover:shadow-md transition-all text-left group">
              <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <span className="block font-bold text-sm">Reminder</span>
                <span className="text-xs text-muted-foreground">Off</span>
              </div>
            </button>
          </div>

          <div className="space-y-3">
            <label className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
              Description (Optional)
            </label>
            <textarea
              placeholder="Why is this important to you?"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              className="w-full bg-white p-6 rounded-3xl border border-border/50 shadow-sm focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all min-h-[120px] resize-none"
            />
          </div>
        </div>

        <div className="mt-8 sticky bottom-6">
          <button
            type="submit"
            disabled={!formData.title || createHabit.isPending}
            className="w-full bg-primary text-primary-foreground font-bold text-lg py-4 rounded-2xl shadow-xl shadow-primary/30 hover:shadow-2xl hover:shadow-primary/40 hover:-translate-y-1 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none transition-all duration-300"
          >
            {createHabit.isPending ? "Creating..." : "Create Habit"}
          </button>
        </div>
      </form>
    </div>
  );
}
