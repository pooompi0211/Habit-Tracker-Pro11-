import { PageHeader } from "@/components/PageHeader";
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, CheckCircle2, Circle, Check } from "lucide-react";
import { useState, useEffect } from "react";
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, getDay, isAfter, startOfDay, isBefore } from "date-fns";
import { Button } from "@/components/ui/button";

interface Habit {
  id: string;
  name: string;
  progress: Record<string, boolean>;
  frequency: "daily" | "weekly" | "custom" | "timed" | "goal";
  days?: number[];
  scheduledTime?: string;
  goalStreak?: number;
}

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
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const prevMonth = () => setCurrentDate(subMonths(currentDate, 1));
  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));

  const getDayStatus = (date: Date) => {
    const dateStr = format(date, "yyyy-MM-dd");
    const dayIdx = getDay(date);
    const today = startOfDay(new Date());
    const isFuture = isAfter(startOfDay(date), today);
    const isPast = isBefore(startOfDay(date), today);
    
    const scheduledHabits = habits.filter(h => {
      if (h.frequency === "daily" || h.frequency === "timed" || h.frequency === "goal") return true;
      if (h.frequency === "weekly") return dayIdx === 1; // Default weekly to Monday for simplicity
      return h.days && h.days.includes(dayIdx);
    });

    if (scheduledHabits.length === 0 || isFuture) return "none";

    const completed = scheduledHabits.filter(h => h.progress && h.progress[dateStr]).length;
    
    if (completed === scheduledHabits.length) return "full";
    if (isPast || isToday(date)) {
      if (completed === 0) return "none-completed";
      return "partial";
    }
    return "none";
  };

  const isToday = (date: Date) => isSameDay(date, new Date());

  const selectedDayStr = format(selectedDay, "yyyy-MM-dd");
  const selectedDayIdx = getDay(selectedDay);
  const selectedDayHabits = habits.filter(h => {
    if (h.frequency === "daily" || h.frequency === "timed" || h.frequency === "goal") return true;
    if (h.frequency === "weekly") return selectedDayIdx === 1;
    return h.days && h.days.includes(selectedDayIdx);
  });

  return (
    <div className="min-h-screen bg-background pb-24 px-6 pt-safe">
      <PageHeader title="Schedule" subtitle="Track your consistency" />

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

        <div className="grid grid-cols-7 gap-4 mb-4">
          {["S", "M", "T", "W", "T", "F", "S"].map((day) => (
            <div key={day} className="text-center text-sm font-bold text-muted-foreground">
              {day}
            </div>
          ))}
        </div>
        
        <div className="grid grid-cols-7 gap-y-4 gap-x-2 place-items-center">
          {Array.from({ length: getDay(monthStart) }).map((_, i) => (
            <div key={`pad-${i}`} className="w-10 h-10" />
          ))}
          
          {days.map((day) => {
            const status = getDayStatus(day);
            const isTodayDate = isToday(day);
            const isSelected = isSameDay(day, selectedDay);
            
            return (
              <div 
                key={day.toISOString()} 
                onClick={() => setSelectedDay(day)}
                className={`
                  relative w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-all cursor-pointer
                  ${isSelected ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/30' : 'hover:bg-secondary text-card-foreground'}
                  ${isTodayDate && !isSelected ? 'text-primary font-bold ring-2 ring-primary/20' : ''}
                `}
              >
                {format(day, "d")}
                {status === 'full' && (
                  <div className="absolute -bottom-1 w-3 h-3 bg-green-500 rounded-full border-2 border-card flex items-center justify-center">
                    <Check className="w-2 h-2 text-white" strokeWidth={4} />
                  </div>
                )}
                {status === 'partial' && (
                  <div className="absolute -bottom-1 w-2 h-2 bg-yellow-500 rounded-full border border-card" />
                )}
                {status === 'none-completed' && (
                  <div className="absolute -bottom-1 w-2 h-2 bg-orange-500 rounded-full border border-card" />
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-8 space-y-4">
        <h3 className="font-bold text-lg px-2 text-foreground">
          {isToday(selectedDay) ? "Today's History" : format(selectedDay, "MMM d, yyyy")}
        </h3>
        
        <div className="space-y-3">
          {selectedDayHabits.map(habit => (
            <div key={habit.id} className="bg-card rounded-2xl p-4 border border-border/50 flex items-center gap-4 shadow-sm">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${habit.progress && habit.progress[selectedDayStr] ? 'text-green-500 bg-green-500/10' : 'text-muted-foreground bg-secondary'}`}>
                {habit.progress && habit.progress[selectedDayStr] ? <CheckCircle2 className="w-5 h-5" /> : <Circle className="w-5 h-5" />}
              </div>
              <div className="flex-1">
                <span className={`font-bold block ${habit.progress && habit.progress[selectedDayStr] ? 'text-card-foreground' : 'text-muted-foreground opacity-70'}`}>
                  {habit.name}
                </span>
                {habit.scheduledTime && <span className="text-xs text-muted-foreground">{habit.scheduledTime}</span>}
              </div>
            </div>
          ))}
          
          {selectedDayHabits.length === 0 && (
            <div className="text-center py-12 text-muted-foreground bg-secondary/20 rounded-3xl border border-dashed border-border">
              No habits scheduled for this day.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
