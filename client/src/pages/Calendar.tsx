import { PageHeader } from "@/components/PageHeader";
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react";

export default function Calendar() {
  return (
    <div className="min-h-screen bg-background pb-24 px-6 pt-safe">
      <PageHeader title="Schedule" subtitle="Track your consistency" />

      <div className="bg-white rounded-3xl p-6 shadow-sm border border-border/50">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-xl font-bold font-display">October 2023</h2>
          <div className="flex gap-2">
            <button className="p-2 hover:bg-secondary rounded-full transition-colors">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button className="p-2 hover:bg-secondary rounded-full transition-colors">
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Calendar Grid Placeholder */}
        <div className="grid grid-cols-7 gap-4 mb-4">
          {["S", "M", "T", "W", "T", "F", "S"].map((day) => (
            <div key={day} className="text-center text-sm font-bold text-muted-foreground">
              {day}
            </div>
          ))}
        </div>
        
        <div className="grid grid-cols-7 gap-y-6 gap-x-2 place-items-center">
          {Array.from({ length: 31 }).map((_, i) => (
            <div 
              key={i} 
              className={`
                w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-all cursor-pointer hover:bg-secondary
                ${i === 14 ? 'bg-primary text-white shadow-lg shadow-primary/30' : 'text-foreground'}
                ${i < 5 ? 'opacity-30' : ''}
              `}
            >
              {i + 1}
            </div>
          ))}
        </div>
      </div>

      <div className="mt-8 flex flex-col items-center justify-center p-12 text-center bg-secondary/30 rounded-3xl border border-dashed border-border">
        <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm mb-4">
          <CalendarIcon className="w-8 h-8 text-muted-foreground" />
        </div>
        <h3 className="font-bold text-lg mb-2">Calendar View</h3>
        <p className="text-muted-foreground max-w-[200px]">
          Detailed history and streaks will be displayed here soon.
        </p>
      </div>
    </div>
  );
}
