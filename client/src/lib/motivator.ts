import { format, isSameDay, subDays } from "date-fns";
import { type Habit } from "@/lib/habit-logic";

const MOTIVATIONAL_MESSAGES = {
  STREAK: [
    "You're on fire! {streak} days of {habit} is incredible!",
    "Consistency is key, and you've got it. {streak} days strong!",
    "Keep that momentum! {habit} is becoming part of who you are.",
    "Unstoppable! {streak} days of dedication to {habit}.",
  ],
  SUCCESS: [
    "Great job completing {habit} today!",
    "One step closer to your goals. Well done with {habit}!",
    "You're making it look easy! {habit} done.",
    "That's how it's done. Stay disciplined!",
  ],
  MISSING: [
    "Don't let {habit} slip! You can do this today.",
    "Every day is a new chance to start again with {habit}.",
    "Remember why you started {habit}. You've got this!",
    "Small steps lead to big changes. Try to fit in {habit} today.",
  ],
  WELCOME: [
    "Ready to conquer your goals today?",
    "A new day means new opportunities for progress.",
    "Small habits, big results. Let's get started!",
    "Discipline is the bridge between goals and accomplishment.",
  ]
};

const QUOTES = [
  { text: "Excellence is not an act, but a habit. We are what we repeatedly do.", author: "Aristotle" },
  { text: "The secret of your future is hidden in your daily routine.", author: "Mike Murdock" },
  { text: "Motivation is what gets you started. Habit is what keeps you going.", author: "Jim Ryun" },
  { text: "Your habits will determine your future.", author: "Jack Canfield" },
  { text: "Successful people are simply those with successful habits.", author: "Brian Tracy" },
  { text: "First we make our habits, then our habits make us.", author: "Charles C. Noble" },
  { text: "Atomic habits are the building blocks of remarkable results.", author: "James Clear" },
  { text: "Discipline is choosing between what you want now and what you want most.", author: "Abraham Lincoln" },
  { text: "Consistency is the foundation of virtue.", author: "Francis Bacon" },
  { text: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
  { text: "It does not matter how slowly you go as long as you do not stop.", author: "Confucius" },
  { text: "Start where you are. Use what you have. Do what you can.", author: "Arthur Ashe" },
  { text: "The future depends on what you do today.", author: "Mahatma Gandhi" },
  { text: "Don't watch the clock; do what it does. Keep going.", author: "Sam Levenson" }
];

export function getDailyQuote(): { text: string; author: string } {
  const today = new Date();
  const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24));
  // Use day of year to cycle through quotes, ensuring 7-day no-repeat is inherent if QUOTES.length > 7
  return QUOTES[dayOfYear % QUOTES.length];
}

export function getMotivatorMessage(habits: Habit[]): string {
  const todayStr = format(new Date(), "yyyy-MM-dd");
  
  // 1. Check for high streaks
  const streaks = habits.map(h => ({ name: h.name, streak: calculateStreak(h) }));
  const highStreak = streaks.find(s => s.streak >= 3);
  if (highStreak) {
    const msg = MOTIVATIONAL_MESSAGES.STREAK[Math.floor(Math.random() * MOTIVATIONAL_MESSAGES.STREAK.length)];
    return msg.replace("{habit}", highStreak.name).replace("{streak}", highStreak.streak.toString());
  }

  // 2. Check for habits needing completion today
  const pending = habits.filter(h => {
    // This is a simplification, ideally we'd use shouldShowHabit here but we want to avoid circular imports if possible
    // For now we just check if it was completed today
    return !h.progress || !h.progress[todayStr];
  });
  
  if (pending.length > 0) {
    const randomPending = pending[Math.floor(Math.random() * pending.length)];
    const msg = MOTIVATIONAL_MESSAGES.MISSING[Math.floor(Math.random() * MOTIVATIONAL_MESSAGES.MISSING.length)];
    return msg.replace("{habit}", randomPending.name);
  }

  // 3. Fallback to welcome
  return MOTIVATIONAL_MESSAGES.WELCOME[Math.floor(Math.random() * MOTIVATIONAL_MESSAGES.WELCOME.length)];
}

function calculateStreak(habit: Habit) {
  let streak = 0;
  let checkDate = new Date();
  while (true) {
    const dateStr = format(checkDate, "yyyy-MM-dd");
    if (habit.progress && habit.progress[dateStr]) {
      streak++;
      checkDate = subDays(checkDate, 1);
    } else {
      if (isSameDay(checkDate, new Date())) {
        checkDate = subDays(checkDate, 1);
        continue;
      }
      break;
    }
  }
  return streak;
}
