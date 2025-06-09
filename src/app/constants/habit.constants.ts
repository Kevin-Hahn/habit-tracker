export const HABIT_CATEGORIES = [
  "Health",
  "Learning",
  "Personal",
  "Work",
  "Social",
  "Creative",
  "Spiritual",
  "Other",
] as const;

export const HABIT_COLORS = [
  "#059669",
  "#16a34a",
  "#22c55e",
  "#65a30d",
  "#84cc16",
  "#a3a316",
  "#ca8a04",
  "#d97706",
  "#ea580c",
  "#dc2626",
  "#b91c1c",
  "#991b1b",
  "#0891b2",
  "#0e7490",
  "#155e75",
  "#164e63",
  "#92400e",
  "#a16207",
] as const;

export const WEEK_DAYS = [
  { value: 1, short: "Mon", full: "Monday" },
  { value: 2, short: "Tue", full: "Tuesday" },
  { value: 3, short: "Wed", full: "Wednesday" },
  { value: 4, short: "Thu", full: "Thursday" },
  { value: 5, short: "Fri", full: "Friday" },
  { value: 6, short: "Sat", full: "Saturday" },
  { value: 0, short: "Sun", full: "Sunday" },
] as const;

export const MOOD_OPTIONS = [
  { value: 1, emoji: "😢", label: "Very Low" },
  { value: 2, emoji: "😔", label: "Low" },
  { value: 3, emoji: "😐", label: "Neutral" },
  { value: 4, emoji: "😊", label: "Good" },
  { value: 5, emoji: "😄", label: "Excellent" },
] as const;

export const ENERGY_LEVELS = [
  { value: 1, icon: "🔋", label: "Drained" },
  { value: 2, icon: "🔋", label: "Low" },
  { value: 3, icon: "🔋", label: "Moderate" },
  { value: 4, icon: "⚡", label: "High" },
  { value: 5, icon: "⚡", label: "Energized" },
] as const;

export type HabitCategory = (typeof HABIT_CATEGORIES)[number];
export type HabitColor = (typeof HABIT_COLORS)[number];
export type WeekDay = (typeof WEEK_DAYS)[number];
export type MoodOption = (typeof MOOD_OPTIONS)[number];
export type EnergyLevel = (typeof ENERGY_LEVELS)[number];
