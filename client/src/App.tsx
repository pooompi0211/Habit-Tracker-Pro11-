import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { BottomNav } from "@/components/BottomNav";
import { AnimatePresence } from "framer-motion";

import Home from "@/pages/Home";
import Calendar from "@/pages/Calendar";
import AddHabit from "@/pages/AddHabit";
import Statistics from "@/pages/Statistics";
import Settings from "@/pages/Settings";
import NotFound from "@/pages/not-found";

function Router() {
  const [location] = useLocation();

  // Hide bottom nav on specific pages if needed (e.g. Add Habit)
  const showBottomNav = location !== "/add-habit";

  return (
    <>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/calendar" component={Calendar} />
        <Route path="/add-habit" component={AddHabit} />
        <Route path="/statistics" component={Statistics} />
        <Route path="/settings" component={Settings} />
        <Route component={NotFound} />
      </Switch>
      {showBottomNav && <BottomNav />}
    </>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Toaster />
      <Router />
    </QueryClientProvider>
  );
}

export default App;
