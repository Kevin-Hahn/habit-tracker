import { Component, computed } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { HabitService } from "../../services/habit.service";
import { StatisticsService } from "../../services/statistics.service";
import { HabitStatsComponent } from "./habit-stats.component";

@Component({
  selector: "app-habit-stats-container",
  standalone: true,
  imports: [CommonModule, RouterModule, HabitStatsComponent],
  template: `
    <app-habit-stats
      [totalHabits]="totalHabits()"
      [longestStreak]="longestStreak()"
      [completionRate]="completionRate()"
      [activeStreaks]="activeStreaks()"
      [trendData]="trendData()"
      [trendLinePoints]="trendLinePoints()"
      [categoryStats]="categoryStats()"
      [streakData]="streakData()"
      [heatmapData]="heatmapData()"
      [insights]="insights()"
    >
    </app-habit-stats>
  `,
})
export class HabitStatsContainerComponent {
  totalHabits = computed(() => this.habitService.activeHabits().length);

  longestStreak = computed(() => {
    const streaks = this.habitService
      .activeHabits()
      .map((habit) => this.habitService.getHabitStats(habit.id).longestStreak);
    return streaks.length > 0 ? Math.max(...streaks) : 0;
  });

  completionRate = computed(() => {
    const trends = this.statisticsService.getCompletionTrend(30);
    const average =
      trends.reduce((sum, day) => sum + day.rate, 0) / trends.length;
    return Math.round(average * 100);
  });

  activeStreaks = computed(() => {
    return this.habitService
      .activeHabits()
      .filter(
        (habit) => this.habitService.getHabitStats(habit.id).currentStreak > 0,
      ).length;
  });

  trendData = computed(() => {
    return this.statisticsService.getCompletionTrend(30);
  });

  trendLinePoints = computed(() => {
    const data = this.trendData();
    return data
      .map((point, index) => {
        const x = (index / (data.length - 1)) * 100;
        const y = 100 - point.rate * 100;
        return `${x},${y}`;
      })
      .join(" ");
  });

  categoryStats = computed(() => {
    return this.statisticsService.getCategoryStats();
  });

  streakData = computed(() => {
    return this.statisticsService
      .getAllStreaks()
      .filter((streak) => streak.currentStreak > 0)
      .sort((a, b) => b.currentStreak - a.currentStreak);
  });

  heatmapData = computed(() => {
    const endDate = new Date();
    const startDate = new Date();

    // Always show a full year for meaningful data - go back 52 weeks from today
    startDate.setDate(endDate.getDate() - 52 * 7);

    const data = this.statisticsService.getHeatmapData(startDate, endDate);

    // Group into weeks (7 days each), ensuring we always have 52 weeks
    const weeks: Array<Array<{ date: string; value: number; level: number }>> =
      [];

    // Start from the beginning and create exactly 52 weeks
    for (let weekIndex = 0; weekIndex < 52; weekIndex++) {
      const weekStart = weekIndex * 7;
      const weekEnd = Math.min(weekStart + 7, data.length);

      if (weekStart < data.length) {
        const week = data.slice(weekStart, weekEnd);

        // If this week has fewer than 7 days, pad it with empty days
        while (week.length < 7) {
          const lastDate =
            week.length > 0
              ? week[week.length - 1].date
              : startDate.toISOString().split("T")[0];
          const nextDate = new Date(lastDate);
          nextDate.setDate(nextDate.getDate() + 1);

          week.push({
            date: nextDate.toISOString().split("T")[0],
            value: 0,
            level: 0,
          });
        }

        weeks.push(week);
      }
    }

    return weeks;
  });

  insights = computed(() => {
    return this.statisticsService.getPersonalInsights();
  });

  constructor(
    private habitService: HabitService,
    private statisticsService: StatisticsService,
  ) {}
}
