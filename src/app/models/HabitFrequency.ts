export interface HabitFrequency {
  type: 'daily' | 'weekly' | 'custom';
  timesPerWeek?: number;
  daysOfWeek?: number[]; // 0-6 (Sunday-Saturday)
  customSchedule?: string[];
}
