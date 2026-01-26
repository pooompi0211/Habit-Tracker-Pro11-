import { PageHeader } from "@/components/PageHeader";
import { CheckCircle2, Quote, Zap } from "lucide-react";
import { motion } from "framer-motion";

export default function Home() {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
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
        {/* Motivational Quote Card */}
        <motion.div variants={item} className="bg-gradient-to-br from-primary to-violet-600 rounded-3xl p-6 text-white shadow-xl shadow-primary/20 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-10">
            <Quote size={120} />
          </div>
          <div className="relative z-10">
            <div className="bg-white/20 w-fit p-2 rounded-xl mb-4 backdrop-blur-md">
              <Zap className="w-5 h-5 text-yellow-300 fill-yellow-300" />
            </div>
            <p className="text-xl font-medium leading-relaxed font-display">
              "Excellence is not an act, but a habit. We are what we repeatedly do."
            </p>
            <p className="mt-4 text-white/80 font-medium text-sm tracking-wide uppercase">
              — Aristotle
            </p>
          </div>
        </motion.div>

        {/* Placeholder for Today's Habits */}
        <motion.div variants={item}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-foreground">Today's Goals</h2>
            <span className="text-sm font-medium text-muted-foreground">0/5 Completed</span>
          </div>
          
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="group bg-white rounded-2xl p-4 border border-border/50 shadow-sm hover:shadow-md hover:border-primary/20 transition-all duration-300 flex items-center gap-4 cursor-pointer active:scale-[0.98]">
                <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <div className="h-4 w-32 bg-secondary rounded-full mb-2 group-hover:bg-primary/10 transition-colors" />
                  <div className="h-3 w-20 bg-secondary/50 rounded-full" />
                </div>
              </div>
            ))}
            
            <div className="text-center py-8 text-muted-foreground/60">
              <p>Your active habits will appear here.</p>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
