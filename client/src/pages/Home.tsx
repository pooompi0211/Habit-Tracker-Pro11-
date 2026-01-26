import { PageHeader } from "@/components/PageHeader";
import { CheckCircle2, Quote, Zap, Circle } from "lucide-react";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { format } from "date-fns";

interface Habit {
  id: string;
  name: string;
  motivation: string;
  frequency: "daily" | "custom";
  days: number[];
  progress: Record<string, boolean>;
}

const MOTIVATORS = [
  "You're doing great! Keep it up.",
  "Small steps lead to big changes.",
  "Consistent action is the key to success.",
  "Keep going, you're becoming the best version of yourself!",
  "Another one down! You're unstoppable."
];

export default function Home() {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [motivator, setMotivator] = useState("");
  
  const today = format(new Date(), "yyyy-MM-dd");
  const todayDayIndex = new Date().getDay();

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("habits") || "[]");
    setHabits(stored);
  }, []);

  const todayHabits = habits.filter(h => {
    if (h.frequency === "daily") return true;
    return h.days && h.days.includes(todayDayIndex);
  });

  const completedCount = todayHabits.filter(h => h.progress && h.progress[today]).length;

  const toggleHabit = (id: string) => {
    const updated = habits.map(h => {
      if (h.id === id) {
        const newProgress = { ...(h.progress || {}) };
        const isCompleting = !newProgress[today];
        if (isCompleting) {
          newProgress[today] = true;
          setMotivator(MOTIVATORS[Math.floor(Math.random() * MOTIVATORS.length)]);
        } else {
          delete newProgress[today];
        }
        return { ...h, progress: newProgress };
      }
      return h;
    });
    setHabits(updated);
    localStorage.setItem("habits", JSON.stringify(updated));
  };

  const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen bg-background pb-24 px-6 pt-safe">
      <PageHeader 
        title="Good Morning!" 
        subtitle="Let's make today count."
      />
      
      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="space-y-6"
      >
        <motion.div variants={item} className="bg-gradient-to-br from-primary to-violet-600 rounded-3xl p-6 text-white shadow-xl shadow-primary/20 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-10">
            <Quote size={120} />
          </div>
          <div className="relative z-10">
            <div className="bg-white/20 w-fit p-2 rounded-xl mb-4 backdrop-blur-md">
              <Zap className="w-5 h-5 text-yellow-300 fill-yellow-300" />
            </div>
            <p className="text-xl font-medium leading-relaxed font-display">
              {motivator || "\"Excellence is not an act, but a habit. We are what we repeatedly do.\""}
            </p>
            <p className="mt-4 text-white/80 font-medium text-sm tracking-wide uppercase">
              {motivator ? "— Your AI Motivator" : "— Aristotle"}
            </p>
          </div>
        </motion.div>

        <motion.div variants={item}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-foreground">Today's Goals</h2>
            <span className="text-sm font-medium text-muted-foreground">
              {completedCount}/{todayHabits.length} Completed
            </span>
          </div>
          
          <div className="space-y-3">
            {todayHabits.map((habit) => (
              <div 
                key={habit.id} 
                onClick={() => toggleHabit(habit.id)}
                className={`group bg-white rounded-2xl p-4 border transition-all duration-300 flex items-center gap-4 cursor-pointer active:scale-[0.98] ${habit.progress && habit.progress[today] ? 'border-primary/50 bg-primary/5' : 'border-border/50 shadow-sm'}`}
              >
                <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${habit.progress && habit.progress[today] ? 'bg-primary text-white' : 'bg-secondary text-muted-foreground group-hover:bg-primary/10'}`}>
                  {habit.progress && habit.progress[today] ? <CheckCircle2 className="w-6 h-6" /> : <Circle className="w-6 h-6" />}
                </div>
                <div className="flex-1">
                  <h3 className={`font-bold transition-all ${habit.progress && habit.progress[today] ? 'text-primary' : 'text-foreground'}`}>
                    {habit.name}
                  </h3>
                  <p className="text-sm text-muted-foreground line-clamp-1">{habit.motivation}</p>
                </div>
              </div>
            ))}
            
            {todayHabits.length === 0 && (
              <div className="text-center py-12 px-6 bg-secondary/30 rounded-3xl border border-dashed border-border">
                <p className="text-muted-foreground font-medium">No habits scheduled for today.</p>
                <p className="text-xs text-muted-foreground/60 mt-1">Go to Add Habit to create a new one!</p>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
