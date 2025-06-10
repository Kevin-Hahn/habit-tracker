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
