import { CommonModule } from "@angular/common";
import { Component, computed } from "@angular/core";
import { RouterModule } from "@angular/router";
import { HabitService } from "../../services/habit.service";
import { StatisticsService } from "../../services/statistics.service";
import { HabitStatsComponent } from "./habit-stats.component";

@Component({
  selector: "app-habit-stats-container",

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

    // Go back exactly 52 weeks (364 days) from today
    startDate.setDate(endDate.getDate() - 364);

    const data = this.statisticsService.getHeatmapData(startDate, endDate);

    // Ensure we have exactly 52 weeks (364 days)
    const totalDays = 52 * 7;
    const paddedData: Array<{ date: string; value: number; level: number }> =
      [];

    // Fill in any missing days at the beginning
    for (let i = 0; i < totalDays; i++) {
      const currentDate = new Date(startDate);
      currentDate.setDate(startDate.getDate() + i);
      const dateStr = currentDate.toISOString().split("T")[0];

      const existingDay = data.find((d) => d.date === dateStr);
      if (existingDay) {
        paddedData.push(existingDay);
      } else {
        paddedData.push({
          date: dateStr,
          value: 0,
          level: 0,
        });
      }
    }

    // Group into exactly 52 weeks
    const weeks: Array<Array<{ date: string; value: number; level: number }>> =
      [];
    for (let i = 0; i < 52; i++) {
      const weekStart = i * 7;
      const weekEnd = weekStart + 7;
      weeks.push(paddedData.slice(weekStart, weekEnd));
    }

    return weeks;
  });

  insights = computed(() => {
    return this.statisticsService.getPersonalInsights();
  });

  constructor(
    private habitService: HabitService,
    private statisticsService: StatisticsService,
  ) { }
}
