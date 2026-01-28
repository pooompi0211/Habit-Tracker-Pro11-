import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { BottomNav } from "@/components/BottomNav";
import { ThemeProvider } from "@/hooks/use-theme";
import { AnimatePresence, motion } from "framer-motion";

import Home from "@/pages/Home";
import Calendar from "@/pages/Calendar";
import AddHabit from "@/pages/AddHabit";
import Statistics from "@/pages/Statistics";
import Settings from "@/pages/Settings";
import NotFound from "@/pages/not-found";

const PageTransition = ({ children }: { children: React.ReactNode }) => (
  <motion.div
    initial={{ opacity: 0, x: 20 }}
    animate={{ opacity: 1, x: 0 }}
    exit={{ opacity: 0, x: -20 }}
    transition={{ duration: 0.2 }}
    className="w-full"
  >
    {children}
  </motion.div>
);

function Router() {
  const [location] = useLocation();
  const showBottomNav = location !== "/add-habit";

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <main className="flex-1">
        <AnimatePresence mode="wait">
          <Switch location={location} key={location}>
            <Route path="/">
              <PageTransition><Home /></PageTransition>
            </Route>
            <Route path="/calendar">
              <PageTransition><Calendar /></PageTransition>
            </Route>
            <Route path="/add-habit">
              <PageTransition><AddHabit /></PageTransition>
            </Route>
            <Route path="/statistics">
              <PageTransition><Statistics /></PageTransition>
            </Route>
            <Route path="/settings">
              <PageTransition><Settings /></PageTransition>
            </Route>
            <Route>
              <PageTransition><NotFound /></PageTransition>
            </Route>
          </Switch>
        </AnimatePresence>
      </main>
      {showBottomNav && <BottomNav />}
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <Toaster />
        <Router />
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;
