export interface Habit {
  id: string;
  name: string;
  description?: string;
  frequency: HabitFrequency;
  category: string;
  color: string;
  icon?: string;
  createdAt: Date;
  targetCount: number;
  isActive: boolean;
  tags: string[];
}

export interface HabitEntry {
  id: string;
  habitId: string;
  date: string; // YYYY-MM-DD format
  completed: boolean;
  count: number;
  mood?: number; // 1-5 scale
  energy?: number; // 1-5 scale
  notes?: string;
  completedAt?: Date;
}

export interface HabitFrequency {
  type: "daily" | "weekly" | "custom";
  timesPerWeek?: number;
  daysOfWeek?: number[]; // 0-6 (Sunday-Saturday)
  customSchedule?: string[];
}

export interface HabitStats {
  habitId: string;
  currentStreak: number;
  longestStreak: number;
  totalCompleted: number;
  completionRate: number;
  weeklyProgress: number;
  monthlyProgress: number;
}

export interface WeeklyReflection {
  id: string;
  week: string; // YYYY-WW format
  reflection: string;
  mood: number;
  energy: number;
  goals: string[];
  challenges: string[];
  wins: string[];
  createdAt: Date;
}

export interface AppSettings {
  theme: "light" | "dark" | "auto";
  notifications: {
    enabled: boolean;
    reminderTime: string;
    soundEnabled: boolean;
  };
  layout: "compact" | "card";
  startOfWeek: number; // 0-6 (Sunday-Saturday)
}
