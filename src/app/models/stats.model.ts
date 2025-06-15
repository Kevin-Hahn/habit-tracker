
export interface DayStats {
    date: string;
    completedHabits: number;
    totalHabits: number;
    completionRate: number;
    mood?: number;
    energy?: number;
}

export interface WeekStats {
    week: string;
    completedHabits: number;
    totalPossibleHabits: number;
    completionRate: number;
    averageMood?: number;
    averageEnergy?: number;
}

export interface HeatmapData {
    date: string;
    value: number;
    level: number; // 0-4 for intensity
}
