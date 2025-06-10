export const HABIT_CATEGORIES = [
  'Health',
  'Learning',
  'Personal',
  'Work',
  'Social',
  'Creative',
  'Spiritual',
  'Other',
] as const;

export type HabitCategory = (typeof HABIT_CATEGORIES)[number];
