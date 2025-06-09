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
    startDate.setFullYear(endDate.getFullYear(), 0, 1); // Start of current year

    // If we're early in the year, show previous year + current year for more data
    const daysSinceYearStart = Math.floor(
      (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24),
    );
    if (daysSinceYearStart < 90) {
      startDate.setFullYear(endDate.getFullYear() - 1, 0, 1); // Show previous year too
    }

    const data = this.statisticsService.getHeatmapData(startDate, endDate);

    // Group into weeks (7 days each)
    const weeks: Array<Array<{ date: string; value: number; level: number }>> =
      [];

    // Start from the first Monday of the date range for proper week alignment
    const firstDay = new Date(startDate);
    const dayOfWeek = firstDay.getDay();
    const daysToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
    firstDay.setDate(firstDay.getDate() - daysToMonday);

    let currentWeek: Array<{ date: string; value: number; level: number }> = [];

    for (let i = 0; i < data.length; i++) {
      currentWeek.push(data[i]);

      if (currentWeek.length === 7) {
        weeks.push(currentWeek);
        currentWeek = [];
      }
    }

    // Add any remaining days as the last week
    if (currentWeek.length > 0) {
      weeks.push(currentWeek);
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
