import { PageHeader } from "@/components/PageHeader";
import { TrendingUp, Award, Calendar as CalendarIcon, Target, Zap } from "lucide-react";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { format, subDays, eachDayOfInterval, isSameDay } from "date-fns";

interface Habit {
  id: string;
  name: string;
  progress: Record<string, boolean>;
  frequency: string;
  days: number[];
}

export default function Statistics() {
  const [habits, setHabits] = useState<Habit[]>([]);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("habits") || "[]");
    setHabits(stored);
  }, []);

  const calculateStats = () => {
    const last7Days = eachDayOfInterval({
      start: subDays(new Date(), 6),
      end: new Date(),
    });

    let totalPossible = 0;
    let totalCompleted = 0;

    habits.forEach(h => {
      last7Days.forEach(day => {
        const dayIdx = day.getDay();
        const dateStr = format(day, "yyyy-MM-dd");
        
        if (h.frequency === "daily" || (h.days && h.days.includes(dayIdx))) {
          totalPossible++;
          if (h.progress && h.progress[dateStr]) totalCompleted++;
        }
      });
    });

    const completionRate = totalPossible > 0 ? Math.round((totalCompleted / totalPossible) * 100) : 0;

    const currentStreak = habits.reduce((max, h) => {
      let streak = 0;
      let checkDate = new Date();
      while (true) {
        const dateStr = format(checkDate, "yyyy-MM-dd");
        if (h.progress && h.progress[dateStr]) {
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
      return Math.max(max, streak);
    }, 0);

    return { completionRate, currentStreak, totalHabits: habits.length };
  };

  const stats = calculateStats();

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
      <PageHeader title="Statistics" subtitle="Your journey in numbers" />

      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-2 gap-4"
      >
        <motion.div variants={item} className="col-span-2 bg-white rounded-3xl p-6 border border-border/50 shadow-sm flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
            <TrendingUp className="w-8 h-8" />
          </div>
          <div>
            <p className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Completion Rate</p>
            <p className="text-3xl font-black text-foreground">{stats.completionRate}% <span className="text-sm font-medium text-muted-foreground">last 7 days</span></p>
          </div>
        </motion.div>

        <motion.div variants={item} className="bg-white rounded-3xl p-6 border border-border/50 shadow-sm">
          <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-500 flex items-center justify-center mb-4">
            <Zap className="w-5 h-5 fill-current" />
          </div>
          <p className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Best Streak</p>
          <p className="text-2xl font-black text-foreground">{stats.currentStreak} Days</p>
        </motion.div>

        <motion.div variants={item} className="bg-white rounded-3xl p-6 border border-border/50 shadow-sm">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-500 flex items-center justify-center mb-4">
            <Award className="w-5 h-5" />
          </div>
          <p className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Total Habits</p>
          <p className="text-2xl font-black text-foreground">{stats.totalHabits}</p>
        </motion.div>

        <motion.div variants={item} className="col-span-2 bg-secondary/30 rounded-3xl p-8 border border-dashed border-border text-center">
          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm mx-auto mb-4">
            <Target className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="font-bold text-lg mb-2">Detailed Analytics</h3>
          <p className="text-muted-foreground text-sm max-w-[220px] mx-auto">
            Charts and monthly progress reports will appear as you track more data.
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}
