import { PageHeader } from "@/components/PageHeader";
import { TrendingUp, Award, Target, Zap, Calendar as CalendarIcon, XCircle, CheckCircle2 } from "lucide-react";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { format, subDays, eachDayOfInterval, isSameDay, startOfDay, isBefore } from "date-fns";
import { shouldShowHabit, type Habit } from "@/lib/habit-logic";

export default function Statistics() {
  const [habits, setHabits] = useState<Habit[]>([]);
  const today = startOfDay(new Date());

  useEffect(() => {
    const loadHabits = () => {
      const stored = JSON.parse(localStorage.getItem("habits") || "[]");
      setHabits(stored);
    };
    loadHabits();
    window.addEventListener('storage', loadHabits);
    return () => window.removeEventListener('storage', loadHabits);
  }, []);

  const calculateStats = () => {
    const todayStr = format(today, "yyyy-MM-dd");
    const last7Days = eachDayOfInterval({ start: subDays(today, 6), end: today });
    const last30Days = eachDayOfInterval({ start: subDays(today, 29), end: today });

    let habitsScheduledToday = 0;
    let habitsCompletedToday = 0;
    let totalScheduledLast7Days = 0;
    let totalCompletedLast7Days = 0;
    let totalScheduledLast30Days = 0;
    let totalCompletedLast30Days = 0;

    habits.forEach(h => {
      // Today's stats
      if (shouldShowHabit(h, today)) {
        habitsScheduledToday++;
        if (h.progress && h.progress[todayStr]) habitsCompletedToday++;
      }

      // Last 7 days stats
      last7Days.forEach(day => {
        if (shouldShowHabit(h, day)) {
          totalScheduledLast7Days++;
          if (h.progress && h.progress[format(day, "yyyy-MM-dd")]) totalCompletedLast7Days++;
        }
      });

      // Last 30 days stats
      last30Days.forEach(day => {
        if (shouldShowHabit(h, day)) {
          totalScheduledLast30Days++;
          if (h.progress && h.progress[format(day, "yyyy-MM-dd")]) totalCompletedLast30Days++;
        }
      });
    });

    const completionRate7d = totalScheduledLast7Days > 0 ? Math.round((totalCompletedLast7Days / totalScheduledLast7Days) * 100) : 0;
    const completionRate30d = totalScheduledLast30Days > 0 ? Math.round((totalCompletedLast30Days / totalScheduledLast30Days) * 100) : 0;

    // Streak calculation
    const calculateStreaks = (habit: Habit) => {
      let current = 0;
      let longest = 0;
      let tempStreak = 0;
      
      // Sort progress dates to iterate backwards
      const days = eachDayOfInterval({ 
        start: startOfDay(new Date(habit.createdAt)), 
        end: today 
      }).reverse();

      let isCurrentStreak = true;
      days.forEach((day, index) => {
        const dateStr = format(day, "yyyy-MM-dd");
        if (shouldShowHabit(habit, day)) {
          if (habit.progress && habit.progress[dateStr]) {
            tempStreak++;
            if (isCurrentStreak) current++;
          } else {
            // If it's today and not completed yet, don't break current streak
            if (isSameDay(day, today)) return;
            
            isCurrentStreak = false;
            longest = Math.max(longest, tempStreak);
            tempStreak = 0;
          }
        }
      });
      longest = Math.max(longest, tempStreak);
      return { current, longest };
    };

    const streaks = habits.map(calculateStreaks);
    const currentStreak = streaks.length > 0 ? Math.max(...streaks.map(s => s.current)) : 0;
    const bestStreak = streaks.length > 0 ? Math.max(...streaks.map(s => s.longest)) : 0;

    return { 
      completionRate7d,
      completionRate30d,
      currentStreak, 
      bestStreak,
      totalHabits: habits.length,
      habitsCompletedToday,
      habitsScheduledToday,
      last7Days,
      totalCompletedLast30Days,
      totalScheduledLast30Days
    };
  };

  const stats = calculateStats();

  return (
    <div className="min-h-screen bg-background pb-24 px-6 pt-safe">
      <PageHeader title="Statistics" subtitle="Real-time performance" />

      <div className="grid grid-cols-2 gap-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="col-span-2 bg-card rounded-3xl p-6 border border-border/50 shadow-sm flex items-center gap-4"
        >
          <div className="w-14 h-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
            <TrendingUp className="w-8 h-8" />
          </div>
          <div className="flex-1">
            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground opacity-60">Today's Progress</p>
            <p className="text-3xl font-black text-card-foreground">
              {stats.habitsCompletedToday} <span className="text-lg font-bold text-muted-foreground">/ {stats.habitsScheduledToday}</span>
            </p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-black text-primary">
              {stats.habitsScheduledToday > 0 ? Math.round((stats.habitsCompletedToday / stats.habitsScheduledToday) * 100) : 0}%
            </p>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-card rounded-3xl p-6 border border-border/50 shadow-sm"
        >
          <Zap className="w-6 h-6 text-orange-500 mb-4 fill-current" />
          <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground opacity-60">Current Streak</p>
          <p className="text-2xl font-black text-card-foreground">{stats.currentStreak} <span className="text-xs font-bold text-muted-foreground">Days</span></p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-card rounded-3xl p-6 border border-border/50 shadow-sm"
        >
          <Award className="w-6 h-6 text-yellow-500 mb-4" />
          <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground opacity-60">Best Streak</p>
          <p className="text-2xl font-black text-card-foreground">{stats.bestStreak} <span className="text-xs font-bold text-muted-foreground">Days</span></p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="col-span-2 bg-card rounded-3xl p-6 border border-border/50 shadow-sm"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-black text-sm uppercase tracking-widest text-muted-foreground opacity-60">Weekly Overview</h3>
            <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full">{stats.completionRate7d}% Rate</span>
          </div>
          <div className="flex justify-between items-end gap-1 h-20">
            {stats.last7Days.map((day, i) => {
              const dayStr = format(day, "yyyy-MM-dd");
              let totalScheduled = 0;
              let totalCompleted = 0;
              habits.forEach(h => {
                if (shouldShowHabit(h, day)) {
                  totalScheduled++;
                  if (h.progress && h.progress[dayStr]) totalCompleted++;
                }
              });
              const percent = totalScheduled > 0 ? (totalCompleted / totalScheduled) * 100 : 0;
              const isToday = isSameDay(day, today);
              
              return (
                <div key={dayStr} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group relative">
                  <div 
                    className={`w-full rounded-t-lg transition-all duration-500 ease-out ${isToday ? 'bg-primary' : 'bg-primary/20 group-hover:bg-primary/40'}`}
                    style={{ height: `${Math.max(percent, 8)}%` }}
                  />
                  <span className={`text-[10px] font-bold ${isToday ? 'text-primary' : 'text-muted-foreground'}`}>{format(day, "EEE").charAt(0)}</span>
                </div>
              );
            })}
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="col-span-2 bg-card rounded-3xl p-6 border border-border/50 shadow-sm"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-black text-sm uppercase tracking-widest text-muted-foreground opacity-60">Monthly Summary</h3>
              <p className="text-2xl font-black mt-1">{stats.totalCompletedLast30Days} <span className="text-xs font-bold text-muted-foreground">Check-ins</span></p>
            </div>
            <div className="w-12 h-12 bg-secondary rounded-2xl flex items-center justify-center">
              <CalendarIcon className="w-6 h-6 text-muted-foreground" />
            </div>
          </div>
          <div className="space-y-3 mt-6">
            <div className="flex justify-between items-center text-xs font-bold">
              <span className="text-muted-foreground uppercase tracking-widest">30-Day Completion Rate</span>
              <span>{stats.completionRate30d}%</span>
            </div>
            <div className="w-full bg-secondary h-2 rounded-full overflow-hidden">
              <div 
                className="bg-primary h-full transition-all duration-1000" 
                style={{ width: `${stats.completionRate30d}%` }} 
              />
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
