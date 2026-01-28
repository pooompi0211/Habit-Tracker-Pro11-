import { PageHeader } from "@/components/PageHeader";
import { ChevronLeft, ChevronRight, CheckCircle2, Circle, Check } from "lucide-react";
import { useState, useEffect } from "react";
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, getDay, isAfter, startOfDay } from "date-fns";
import { Button } from "@/components/ui/button";
import { shouldShowHabit, type Habit } from "@/lib/habit-logic";

export default function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [habits, setHabits] = useState<Habit[]>([]);
  const [selectedDay, setSelectedDay] = useState<Date>(new Date());

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("habits") || "[]");
    setHabits(stored);
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
    const isFuture = isAfter(dayStart, today);
    
    const scheduledHabits = habits.filter(h => shouldShowHabit(h, date));

    if (scheduledHabits.length === 0 || isFuture) return "none";

    const completed = scheduledHabits.filter(h => h.progress && h.progress[dateStr]).length;
    
    if (completed === scheduledHabits.length) return "full";
    if (dayStart <= today) {
      if (completed === 0) return "missed";
      return "partial";
    }
    return "none";
  };

  const selectedDayStr = format(selectedDay, "yyyy-MM-dd");
  const selectedDayHabits = habits.filter(h => shouldShowHabit(h, selectedDay));

  return (
    <div className="min-h-screen bg-background pb-24 px-6 pt-safe">
      <PageHeader title="Progress" subtitle="Your habit journey" />

      <div className="bg-card rounded-3xl p-6 shadow-sm border border-border/50">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-xl font-bold font-display text-card-foreground">{format(currentDate, "MMMM yyyy")}</h2>
          <div className="flex gap-2">
            <Button variant="ghost" size="icon" onClick={prevMonth} className="rounded-full hover:bg-secondary">
              <ChevronLeft className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="icon" onClick={nextMonth} className="rounded-full hover:bg-secondary">
              <ChevronRight className="w-5 h-5" />
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-4 mb-4 text-center">
          {["S", "M", "T", "W", "T", "F", "S"].map((day) => (
            <div key={day} className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
              {day}
            </div>
          ))}
        </div>
        
        <div className="grid grid-cols-7 gap-y-4 gap-x-2 place-items-center">
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
                  relative w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all cursor-pointer
                  ${isSelected ? 'bg-primary text-primary-foreground shadow-lg scale-110 z-10' : 'hover:bg-secondary text-card-foreground'}
                  ${isToday && !isSelected ? 'text-primary ring-2 ring-primary/20 ring-offset-2 ring-offset-card' : ''}
                `}
              >
                {format(day, "d")}
                {status === 'full' && (
                  <div className="absolute -bottom-1 w-3 h-3 bg-green-500 rounded-full border-2 border-card flex items-center justify-center">
                    <Check className="w-1.5 h-1.5 text-white" strokeWidth={5} />
                  </div>
                )}
                {status === 'partial' && (
                  <div className="absolute -bottom-1 w-2 h-2 bg-yellow-500 rounded-full border border-card" />
                )}
                {status === 'missed' && (
                  <div className="absolute -bottom-1 w-2 h-2 bg-orange-500 rounded-full border border-card" />
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-8 space-y-4">
        <div className="flex items-center justify-between px-2">
          <h3 className="font-bold text-lg text-foreground">
            {isSameDay(selectedDay, new Date()) ? "Today" : format(selectedDay, "MMMM do")}
          </h3>
          <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground opacity-60">
            {selectedDayHabits.length} Habits Scheduled
          </span>
        </div>
        
        <div className="space-y-3">
          {selectedDayHabits.map(habit => {
            const isCompleted = habit.progress && habit.progress[selectedDayStr];
            return (
              <div key={habit.id} className={`bg-card rounded-2xl p-4 border transition-all ${isCompleted ? 'border-green-500/30 bg-green-500/5' : 'border-border/50 shadow-sm'}`}>
                <div className="flex items-center gap-4">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${isCompleted ? 'text-green-500 bg-green-500/10' : 'text-muted-foreground bg-secondary'}`}>
                    {isCompleted ? <CheckCircle2 className="w-5 h-5" /> : <Circle className="w-5 h-5" />}
                  </div>
                  <div className="flex-1">
                    <span className={`font-bold block text-sm ${isCompleted ? 'text-card-foreground' : 'text-muted-foreground opacity-70'}`}>
                      {habit.name}
                    </span>
                    {habit.scheduledTime && (
                      <span className="text-[10px] font-bold text-muted-foreground uppercase">{habit.scheduledTime}</span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
          
          {selectedDayHabits.length === 0 && (
            <div className="text-center py-10 text-muted-foreground bg-secondary/10 rounded-3xl border border-dashed border-border">
              <p className="text-sm font-bold opacity-60">Nothing scheduled for this day.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
