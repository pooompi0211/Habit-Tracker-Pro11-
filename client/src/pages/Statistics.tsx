import { PageHeader } from "@/components/PageHeader";
import { BarChart, Activity, TrendingUp } from "lucide-react";

export default function Statistics() {
  return (
    <div className="min-h-screen bg-background pb-24 px-6 pt-safe">
      <PageHeader title="Insights" subtitle="Visualize your progress" />

      <div className="grid gap-6">
        {/* Placeholder Chart Card */}
        <div className="bg-white rounded-3xl p-6 border border-border/50 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-50 text-green-600 rounded-xl">
                <TrendingUp className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg">Weekly Completion</h3>
            </div>
          </div>
          
          <div className="h-48 flex items-end justify-between px-2 gap-2">
            {[40, 70, 30, 85, 60, 50, 90].map((h, i) => (
              <div key={i} className="w-full bg-secondary rounded-t-lg relative group">
                <div 
                  style={{ height: `${h}%` }} 
                  className="absolute bottom-0 w-full bg-primary rounded-t-lg transition-all duration-500 group-hover:bg-primary/80"
                />
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-2 text-xs font-bold text-muted-foreground uppercase px-1">
            <span>M</span><span>T</span><span>W</span><span>T</span><span>F</span><span>S</span><span>S</span>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white p-6 rounded-3xl border border-border/50 shadow-sm flex flex-col items-center justify-center text-center gap-2">
            <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mb-1">
              <Activity className="w-6 h-6" />
            </div>
            <span className="text-3xl font-display font-bold">85%</span>
            <span className="text-sm text-muted-foreground font-medium">Completion Rate</span>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-border/50 shadow-sm flex flex-col items-center justify-center text-center gap-2">
            <div className="w-12 h-12 rounded-full bg-orange-50 text-orange-600 flex items-center justify-center mb-1">
              <BarChart className="w-6 h-6" />
            </div>
            <span className="text-3xl font-display font-bold">12</span>
            <span className="text-sm text-muted-foreground font-medium">Best Streak</span>
          </div>
        </div>
      </div>
    </div>
  );
}
