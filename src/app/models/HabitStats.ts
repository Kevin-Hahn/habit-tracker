export interface HabitStats {
  habitId: string;
  currentStreak: number;
  longestStreak: number;
  totalCompleted: number;
  completionRate: number;
  weeklyProgress: number;
  monthlyProgress: number;
}
