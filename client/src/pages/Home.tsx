import { PageHeader } from "@/components/PageHeader";
import { CheckCircle2, Quote, Zap, Circle, Clock, Target as GoalIcon, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { format, isSameDay, subDays } from "date-fns";
import { shouldShowHabit, type Habit } from "@/lib/habit-logic";
import { getDailyQuote, getMotivatorMessage } from "@/lib/motivator";

export default function Home() {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [quote, setQuote] = useState(getDailyQuote());
  const [motivator, setMotivator] = useState("");
  const [showMotivator, setShowMotivator] = useState(false);
  
  const todayDate = new Date();
  const todayStr = format(todayDate, "yyyy-MM-dd");

  useEffect(() => {
    const loadHabits = () => {
      const stored = JSON.parse(localStorage.getItem("habits") || "[]");
      setHabits(stored);
      setMotivator(getMotivatorMessage(stored));
      setShowMotivator(true);
      // Auto-hide motivator after 5 seconds if it's just a welcome
      setTimeout(() => setShowMotivator(false), 5000);
    };
    loadHabits();
    window.addEventListener('storage', loadHabits);
    return () => window.removeEventListener('storage', loadHabits);
  }, []);

  const todayHabits = habits.filter(h => shouldShowHabit(h, todayDate));
  const completedCount = todayHabits.filter(h => h.progress && h.progress[todayStr]).length;

  const toggleHabit = (id: string) => {
    const updated = habits.map(h => {
      if (h.id === id) {
        const newProgress = { ...(h.progress || {}) };
        const isCompleting = !newProgress[todayStr];
        if (isCompleting) {
          newProgress[todayStr] = true;
          // Show success motivator
          setMotivator(`Awesome! ${h.name} completed!`);
          setShowMotivator(true);
          setTimeout(() => setShowMotivator(false), 3000);
        } else {
          delete newProgress[todayStr];
        }
        return { ...h, progress: newProgress };
      }
      return h;
    });
    setHabits(updated);
    localStorage.setItem("habits", JSON.stringify(updated));
  };

  const calculateStreak = (habit: Habit) => {
    let streak = 0;
    let checkDate = new Date();
    while (true) {
      const dateStr = format(checkDate, "yyyy-MM-dd");
      if (habit.progress && habit.progress[dateStr]) {
        streak++;
        checkDate = subDays(checkDate, 1);
      } else {
        if (isSameDay(checkDate, new Date())) {
          checkDate = subDays(checkDate, 1);
          continue;
        }
        break;
      }
    }
    return streak;
  };

  return (
    <div className="min-h-screen bg-background pb-24 px-6 pt-safe overflow-x-hidden">
      <PageHeader 
        title="Habit Tracker" 
        subtitle={format(todayDate, "EEEE, MMMM do")}
      />
      
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
        <AnimatePresence>
          {showMotivator && (
            <motion.div 
              initial={{ height: 0, opacity: 0, scale: 0.95 }}
              animate={{ height: "auto", opacity: 1, scale: 1 }}
              exit={{ height: 0, opacity: 0, scale: 0.95 }}
              className="bg-primary/10 border border-primary/20 rounded-2xl p-4 flex items-center gap-3 overflow-hidden"
            >
              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                <Sparkles className="w-4 h-4 text-primary" />
              </div>
              <p className="text-sm font-bold text-primary">{motivator}</p>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="bg-gradient-to-br from-primary to-violet-600 rounded-3xl p-6 text-white shadow-xl relative overflow-hidden">
          <Quote className="absolute top-0 right-0 p-8 opacity-10" size={120} />
          <div className="relative z-10">
            <div className="bg-white/20 w-fit p-2 rounded-xl mb-4 backdrop-blur-md">
              <Zap className="w-5 h-5 text-yellow-300 fill-yellow-300" />
            </div>
            <p className="text-lg font-medium leading-relaxed italic">"{quote.text}"</p>
            <p className="mt-4 text-white/80 font-bold text-sm">— {quote.author}</p>
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-foreground">Today's Tasks</h2>
            <span className="text-sm font-bold text-primary bg-primary/10 px-3 py-1 rounded-full">
              {completedCount}/{todayHabits.length} Done
            </span>
          </div>
          
          <div className="space-y-3">
            {todayHabits.map((habit) => {
              const isCompleted = habit.progress && habit.progress[todayStr];
              const streak = calculateStreak(habit);
              
              return (
                <div 
                  key={habit.id} 
                  onClick={() => toggleHabit(habit.id)}
                  className={`group bg-card rounded-2xl p-4 border transition-all duration-300 flex items-center gap-4 cursor-pointer active:scale-[0.98] ${isCompleted ? 'border-primary/50 bg-primary/5 shadow-none' : 'border-border/50 shadow-sm'}`}
                >
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${isCompleted ? 'bg-primary text-primary-foreground' : 'bg-secondary text-muted-foreground group-hover:bg-primary/10'}`}>
                    {isCompleted ? <CheckCircle2 className="w-6 h-6" /> : <Circle className="w-6 h-6" />}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className={`font-bold ${isCompleted ? 'text-primary' : 'text-card-foreground'}`}>{habit.name}</h3>
                      {habit.frequency === "timed" && habit.scheduledTime && (
                        <div className="flex items-center gap-1 text-xs font-bold text-muted-foreground">
                          <Clock className="w-3 h-3" />
                          {habit.scheduledTime}
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-3 mt-1">
                      {streak > 0 && (
                        <div className="flex items-center gap-1 text-[10px] font-black uppercase tracking-wider text-orange-500">
                          <Zap className="w-3 h-3 fill-current" />
                          {streak} Day Streak
                        </div>
                      )}
                      {habit.frequency === "goal" && habit.goalStreak && (
                        <div className="flex items-center gap-1 text-[10px] font-black uppercase tracking-wider text-blue-500">
                          <GoalIcon className="w-3 h-3" />
                          Target: {habit.goalStreak}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
            
            {todayHabits.length === 0 && (
              <div className="text-center py-12 px-6 bg-secondary/30 rounded-3xl border border-dashed border-border">
                <p className="text-muted-foreground font-bold">Nothing scheduled for today!</p>
                <p className="text-xs text-muted-foreground/60 mt-2 uppercase tracking-widest">Rest up or add a new goal.</p>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
