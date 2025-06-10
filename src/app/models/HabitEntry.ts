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
