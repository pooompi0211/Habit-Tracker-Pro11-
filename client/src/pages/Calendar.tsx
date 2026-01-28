import { PageHeader } from "@/components/PageHeader";
import { ChevronLeft, ChevronRight, CheckCircle2, Circle, Check } from "lucide-react";
import { useState, useEffect } from "react";
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, getDay, isAfter, startOfDay } from "date-fns";
import { Button } from "@/components/ui/button";
import { shouldShowHabit, type Habit } from "@/lib/habit-logic";
import { motion, AnimatePresence } from "framer-motion";

export default function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [habits, setHabits] = useState<Habit[]>([]);
  const [selectedDay, setSelectedDay] = useState<Date>(new Date());

  useEffect(() => {
    const loadHabits = () => {
      const stored = JSON.parse(localStorage.getItem("habits") || "[]");
      setHabits(stored);
    };
    loadHabits();
    window.addEventListener('storage', loadHabits);
    return () => window.removeEventListener('storage', loadHabits);
  }, []);

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const prevMonth = () => setCurrentDate(subMonths(currentDate, 1));
  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));

  const getDayStatus = (date: Date) => {
    const dateStr = format(date, "yyyy-MM-dd");
    const today = startOfDay(new Date());
    const dayStart = startOfDay(date);
    
    if (isAfter(dayStart, today)) return "none";
    
    const scheduledHabits = habits.filter(h => shouldShowHabit(h, date));
    if (scheduledHabits.length === 0) return "none";

    const completed = scheduledHabits.filter(h => h.progress && h.progress[dateStr]).length;
    const isCompleted = completed > 0 && completed === scheduledHabits.length;

    if (isSameDay(dayStart, today)) {
      return isCompleted ? "full" : "pending";
    } else {
      return isCompleted ? "full" : "none";
    }
  };

  const selectedDayStr = format(selectedDay, "yyyy-MM-dd");
  const selectedDayHabits = habits.filter(h => shouldShowHabit(h, selectedDay));

  return (
    <div className="min-h-screen bg-background pb-32 px-6 pt-safe">
      <PageHeader title="Progress" subtitle="Your habit journey" />

      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-card rounded-3xl p-6 shadow-xl border border-border/50"
      >
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-xl font-bold font-display text-card-foreground">{format(currentDate, "MMMM yyyy")}</h2>
          <div className="flex gap-1">
            <Button variant="ghost" size="icon" onClick={prevMonth} className="rounded-full hover-elevate active-elevate-2">
              <ChevronLeft className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="icon" onClick={nextMonth} className="rounded-full hover-elevate active-elevate-2">
              <ChevronRight className="w-5 h-5" />
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-4 mb-4 text-center">
          {["S", "M", "T", "W", "T", "F", "S"].map((day) => (
            <div key={day} className="text-[10px] font-black uppercase tracking-widest text-muted-foreground opacity-50">
              {day}
            </div>
          ))}
        </div>
        
        <div className="grid grid-cols-7 gap-y-4 gap-x-1 place-items-center">
          {Array.from({ length: getDay(monthStart) }).map((_, i) => (
            <div key={`pad-${i}`} className="w-10 h-10" />
          ))}
          
          {daysInMonth.map((day) => {
            const status = getDayStatus(day);
            const isToday = isSameDay(day, new Date());
            const isSelected = isSameDay(day, selectedDay);
            
            return (
              <div 
                key={day.toISOString()} 
                onClick={() => setSelectedDay(day)}
                className={`
                  relative w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all cursor-pointer select-none
                  ${isSelected ? 'bg-primary text-primary-foreground shadow-lg scale-110 z-10' : 'hover:bg-secondary text-card-foreground'}
                  ${isToday && !isSelected ? 'text-primary ring-2 ring-primary/20 ring-offset-2 ring-offset-card' : ''}
                `}
              >
                {format(day, "d")}
                <AnimatePresence>
                  {status === 'full' && (
                    <motion.div 
                      initial={{ scale: 0 }} 
                      animate={{ scale: 1 }}
                      className="absolute -bottom-1 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-card flex items-center justify-center"
                    >
                      <Check className="w-1.5 h-1.5 text-white" strokeWidth={5} />
                    </motion.div>
                  )}
                  {status === 'pending' && (
                    <motion.div 
                      initial={{ scale: 0 }} 
                      animate={{ scale: 1 }}
                      className="absolute -bottom-1 w-2.5 h-2.5 bg-orange-500 rounded-full border-2 border-card shadow-sm"
                    />
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </motion.div>

      <div className="mt-8 space-y-4">
        <div className="flex items-center justify-between px-2">
          <h3 className="font-bold text-lg text-foreground">
            {isSameDay(selectedDay, new Date()) ? "Today" : format(selectedDay, "MMMM do")}
          </h3>
          <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground opacity-50">
            {selectedDayHabits.length} Habits
          </span>
        </div>
        
        <div className="space-y-3">
          {selectedDayHabits.map((habit, idx) => {
            const isCompleted = habit.progress && habit.progress[selectedDayStr];
            return (
              <motion.div 
                key={habit.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.05 }}
                className={`bg-card rounded-2xl p-5 border transition-all active-elevate-2 shadow-sm ${isCompleted ? 'border-green-500/30 bg-green-500/5' : 'border-border/50'}`}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${isCompleted ? 'text-green-500 bg-green-500/10' : 'text-muted-foreground bg-secondary'}`}>
                    {isCompleted ? <CheckCircle2 className="w-6 h-6" /> : <Circle className="w-6 h-6" />}
                  </div>
                  <div className="flex-1">
                    <span className={`font-bold block text-base ${isCompleted ? 'text-card-foreground' : 'text-muted-foreground opacity-70'}`}>
                      {habit.name}
                    </span>
                    {habit.scheduledTime && (
                      <div className="flex items-center gap-1 mt-0.5 opacity-60">
                        <Check className="w-3 h-3 text-muted-foreground" />
                        <span className="text-[10px] font-black text-muted-foreground uppercase tracking-wider">{habit.scheduledTime}</span>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
          
          {selectedDayHabits.length === 0 && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12 text-muted-foreground bg-secondary/10 rounded-3xl border border-dashed border-border"
            >
              <p className="text-sm font-bold opacity-40 uppercase tracking-widest">Free Day</p>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
