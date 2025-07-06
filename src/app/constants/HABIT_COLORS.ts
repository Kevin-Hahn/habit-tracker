export const HABIT_COLORS = [
  '#059669',
  '#16a34a',
  '#22c55e',
  '#65a30d',
  '#84cc16',
  '#a3a316',
  '#ca8a04',
  '#d97706',
  '#ea580c',
  '#dc2626',
  '#b91c1c',
  '#991b1b',
  '#0891b2',
  '#0e7490',
  '#155e75',
  '#164e63',
  '#92400e',
  '#a16207',
] as const;

export type HabitColor = (typeof HABIT_COLORS)[number];
