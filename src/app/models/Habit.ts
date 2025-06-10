import { HabitFrequency } from './HabitFrequency';

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
