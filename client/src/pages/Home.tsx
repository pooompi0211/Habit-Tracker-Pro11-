import { PageHeader } from "@/components/PageHeader";
import { CheckCircle2, Quote, Zap, Circle, Clock, Target as GoalIcon } from "lucide-react";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { format, startOfDay, isSameDay } from "date-fns";

interface Habit {
  id: string;
  name: string;
  motivation: string;
  frequency: "daily" | "weekly" | "custom" | "timed" | "goal";
  days: number[];
  scheduledTime?: string;
  goalStreak?: number;
  progress: Record<string, boolean>;
  createdAt: string;
}

const MOTIVATIONAL_QUOTES = [
  { text: "Excellence is not an act, but a habit. We are what we repeatedly do.", author: "Aristotle" },
  { text: "The secret of your future is hidden in your daily routine.", author: "Mike Murdock" },
  { text: "Motivation is what gets you started. Habit is what keeps you going.", author: "Jim Ryun" },
  { text: "Your habits will determine your future.", author: "Jack Canfield" },
  { text: "Successful people are simply those with successful habits.", author: "Brian Tracy" },
  { text: "First we make our habits, then our habits make us.", author: "Charles C. Noble" },
  { text: "Atomic habits are the building blocks of remarkable results.", author: "James Clear" },
  { text: "Small habits can make a big difference.", author: "Unknown" },
  { text: "Discipline is choosing between what you want now and what you want most.", author: "Abraham Lincoln" },
  { text: "Consistency is the foundation of virtue.", author: "Francis Bacon" }
];

export default function Home() {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [quote, setQuote] = useState(MOTIVATIONAL_QUOTES[0]);
  
  const todayDate = new Date();
  const todayStr = format(todayDate, "yyyy-MM-dd");
  const todayDayIndex = todayDate.getDay();

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("habits") || "[]");
    setHabits(stored);

    const dayOfYear = Math.floor((todayDate.getTime() - new Date(todayDate.getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24));
    setQuote(MOTIVATIONAL_QUOTES[dayOfYear % MOTIVATIONAL_QUOTES.length]);
  }, []);

  const todayHabits = habits.filter(h => {
    if (h.frequency === "daily" || h.frequency === "timed" || h.frequency === "goal") return true;
    if (h.frequency === "weekly") {
      // For weekly, we check if today is Monday (default) or if it's the creation day if no days specified
      return todayDayIndex === 1; 
    }
    if (h.frequency === "custom") {
      return h.days && h.days.includes(todayDayIndex);
    }
    return false;
  });

  const completedCount = todayHabits.filter(h => h.progress && h.progress[todayStr]).length;

  const toggleHabit = (id: string) => {
    const updated = habits.map(h => {
      if (h.id === id) {
        const newProgress = { ...(h.progress || {}) };
        const isCompleting = !newProgress[todayStr];
        if (isCompleting) {
          newProgress[todayStr] = true;
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
        checkDate.setDate(checkDate.getDate() - 1);
      } else {
        if (isSameDay(checkDate, new Date())) {
          checkDate.setDate(checkDate.getDate() - 1);
          continue;
        }
        break;
      }
    }
    return streak;
  };

  return (
    <div className="min-h-screen bg-background pb-24 px-6 pt-safe">
      <PageHeader 
        title="Habit Tracker" 
        subtitle={format(todayDate, "EEEE, MMMM do")}
      />
      
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
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
