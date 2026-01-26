import { PageHeader } from "@/components/PageHeader";
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, CheckCircle2, Circle } from "lucide-react";
import { useState, useEffect } from "react";
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, getDay } from "date-fns";
import { Button } from "@/components/ui/button";

interface Habit {
  id: string;
  name: string;
  progress: Record<string, boolean>;
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
    const dayHabits = habits.filter(h => {
      // In a real app we'd filter by schedule too, but let's simplify for calendar view
      // Just show if ANY habit was completed or scheduled
      return true;
    });
    
    if (dayHabits.length === 0) return "none";
    const completed = dayHabits.filter(h => h.progress[dateStr]).length;
    if (completed === 0) return "uncompleted";
    if (completed === dayHabits.length) return "full";
    return "partial";
  };

  const selectedDayStr = format(selectedDay, "yyyy-MM-dd");
  const selectedDayHabits = habits.filter(h => {
    // Show all habits for simplicity in history view
    return true;
  });

  return (
    <div className="min-h-screen bg-background pb-24 px-6 pt-safe">
      <PageHeader title="Schedule" subtitle="Track your consistency" />

      <div className="bg-white rounded-3xl p-6 shadow-sm border border-border/50">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-xl font-bold font-display">{format(currentDate, "MMMM yyyy")}</h2>
          <div className="flex gap-2">
            <Button variant="ghost" size="icon" onClick={prevMonth} className="rounded-full">
              <ChevronLeft className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="icon" onClick={nextMonth} className="rounded-full">
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
          {/* Padding for start of month */}
          {Array.from({ length: getDay(monthStart) }).map((_, i) => (
            <div key={`pad-${i}`} className="w-10 h-10" />
          ))}
          
          {days.map((day) => {
            const status = getDayStatus(day);
            const isToday = isSameDay(day, new Date());
            const isSelected = isSameDay(day, selectedDay);
            
            return (
              <div 
                key={day.toISOString()} 
                onClick={() => setSelectedDay(day)}
                className={`
                  relative w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-all cursor-pointer
                  ${isSelected ? 'bg-primary text-white shadow-lg shadow-primary/30' : 'hover:bg-secondary'}
                  ${isToday && !isSelected ? 'text-primary font-bold ring-2 ring-primary/20' : 'text-foreground'}
                `}
              >
                {format(day, "d")}
                {status !== "none" && !isSelected && (
                  <div className={`absolute -bottom-1 w-1 h-1 rounded-full ${status === 'full' ? 'bg-green-500' : status === 'partial' ? 'bg-yellow-500' : 'bg-red-300'}`} />
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-8 space-y-4">
        <h3 className="font-bold text-lg px-2">
          {isSameDay(selectedDay, new Date()) ? "Today's History" : format(selectedDay, "MMM d, yyyy")}
        </h3>
        
        <div className="space-y-3">
          {selectedDayHabits.map(habit => (
            <div key={habit.id} className="bg-white rounded-2xl p-4 border border-border/50 flex items-center gap-4">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${habit.progress[selectedDayStr] ? 'text-green-500 bg-green-50' : 'text-muted-foreground bg-secondary'}`}>
                {habit.progress[selectedDayStr] ? <CheckCircle2 className="w-5 h-5" /> : <Circle className="w-5 h-5" />}
              </div>
              <span className={`font-medium ${habit.progress[selectedDayStr] ? 'text-foreground' : 'text-muted-foreground'}`}>
                {habit.name}
              </span>
            </div>
          ))}
          
          {selectedDayHabits.length === 0 && (
            <div className="text-center py-8 text-muted-foreground bg-secondary/20 rounded-2xl">
              No habits recorded.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
