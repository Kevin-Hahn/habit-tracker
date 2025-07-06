import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CHART_LEVELS } from '../../constants/CHART_LEVELS';
import { HabitStatsChartsComponent } from './components/habit-stats-charts/habit-stats-charts.component';
import { HabitStatsHeatmapComponent } from './components/habit-stats-heatmap/habit-stats-heatmap.component';
import { HabitStatsOverviewComponent } from './components/habit-stats-overview/habit-stats-overview.component';
import { HabitStatsStreaksComponent } from './components/habit-stats-streaks/habit-stats-streaks.component';

interface TrendData {
  date: string;
  rate: number;
}

interface CategoryStats {
  category: string;
  completionRate: number;
  totalHabits: number;
}

interface StreakData {
  habitId: string;
  habitName: string;
  currentStreak: number;
  longestStreak: number;
}

interface HeatmapWeek {
  date: string;
  value: number;
  level: number;
}

@Component({
  selector: 'app-habit-stats',
  imports: [
    CommonModule,
    RouterModule,
    HabitStatsOverviewComponent,
    HabitStatsChartsComponent,
    HabitStatsStreaksComponent,
    HabitStatsHeatmapComponent,
  ],
  templateUrl: './habit-stats.component.html',
  styleUrls: ['./habit-stats.component.css'],
})
export class HabitStatsComponent {
  @Input() totalHabits!: number;
  @Input() longestStreak!: number;
  @Input() completionRate!: number;
  @Input() activeStreaks!: number;
  @Input() trendData!: TrendData[];
  @Input() trendLinePoints!: string;
  @Input() categoryStats!: CategoryStats[];
  @Input() streakData!: StreakData[];
  @Input() heatmapData!: HeatmapWeek[][];
  @Input() insights!: string[];

  chartLevels = CHART_LEVELS;
}
