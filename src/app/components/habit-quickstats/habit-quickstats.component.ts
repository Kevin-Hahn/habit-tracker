import { Component, computed, inject } from "@angular/core";
import { Habit } from "../../models/habit.model";
import { HabitService } from "../../services/habit.service";
import { StatisticsService } from "../../services/statistics.service";

@Component({
    selector: "app-habit-quickstats",
    templateUrl: "./habit-quickstats.component.html",
    styleUrls: ["./habit-quickstats.component.css"],
})
export class HabitQuickstatsComponent {
    readonly habitService = inject(HabitService);
    readonly statisticsService = inject(StatisticsService);

    longestStreak = computed(() => {
        const streaks = this.habitService
            .activeHabits()
            .map(
                (habit: Habit) =>
                    this.habitService.getHabitStats(habit.id).longestStreak,
            );
        return streaks.length > 0 ? Math.max(...streaks) : 0;
    });

    currentStreaks = computed(() => {
        return this.habitService
            .activeHabits()
            .filter(
                (habit: Habit) =>
                    this.habitService.getHabitStats(habit.id).currentStreak > 0,
            ).length;
    });

    weeklyCompletion = computed(() => {
        const today = new Date();
        const startOfWeek = new Date(today);
        startOfWeek.setDate(today.getDate() - today.getDay() + 1);
        const weekStats = this.statisticsService.getWeekStats(startOfWeek);
        return Math.round(weekStats.completionRate * 100);
    });
};