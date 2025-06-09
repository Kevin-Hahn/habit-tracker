import { Component, computed, signal } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { HabitService } from "../../services/habit.service";
import { StatisticsService } from "../../services/statistics.service";
import { ThemeService } from "../../services/theme.service";
import { HabitFormComponent } from "../habit-form/habit-form.component";
import { HabitDashboardComponent } from "./habit-dashboard.component";
import { Habit, HabitEntry } from "../../models/habit.model";

@Component({
  selector: "app-habit-dashboard-container",
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    HabitFormComponent,
    HabitDashboardComponent,
  ],
  template: `
    <app-habit-dashboard
      [todayDate]="todayDate"
      [completedToday]="completedToday()"
      [totalHabitsToday]="totalHabitsToday()"
      [progressOffset]="progressOffset()"
      [longestStreak]="longestStreak()"
      [currentStreaks]="currentStreaks()"
      [weeklyCompletion]="weeklyCompletion()"
      [activeHabits]="habitService.activeHabits()"
      [isDarkTheme]="themeService.isDark()"
      [showHabitForm]="showHabitForm()"
      [editingHabit]="editingHabit()"
      (toggleTheme)="themeService.toggleTheme()"
      (toggleHabit)="toggleHabit($event)"
      (openHabitForm)="openHabitForm($event)"
      (closeHabitForm)="closeHabitForm()"
      (habitCreated)="onHabitCreated($event)"
      (habitUpdated)="onHabitUpdated($event)"
      (openMoodTracker)="openMoodTracker()"
    >
    </app-habit-dashboard>

    <!-- Habit Form Modal -->
    @if (showHabitForm()) {
      <app-habit-form
        [editingHabit]="editingHabit()"
        (close)="closeHabitForm()"
        (habitCreated)="onHabitCreated($event)"
        (habitUpdated)="onHabitUpdated($event)"
      >
      </app-habit-form>
    }
  `,
})
export class HabitDashboardContainerComponent {
  todayDate = new Date();

  // Modal state
  showHabitForm = signal(false);
  editingHabit = signal<Habit | null>(null);

  // Computed values
  completedToday = computed(
    () =>
      this.habitService
        .todayEntries()
        .filter((entry: HabitEntry) => entry.completed).length,
  );

  totalHabitsToday = computed(() => this.habitService.activeHabits().length);

  progressOffset = computed(() => {
    const circumference = 2 * Math.PI * 26;
    const total = this.totalHabitsToday();
    const completed = this.completedToday();
    const percentage = total > 0 ? completed / total : 0;
    return circumference - percentage * circumference;
  });

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

  constructor(
    public habitService: HabitService,
    public statisticsService: StatisticsService,
    public themeService: ThemeService,
  ) {}

  // Event handlers
  toggleHabit(habitId: string): void {
    this.habitService.toggleHabitCompletion(habitId);
  }

  openHabitForm(habit?: Habit): void {
    this.editingHabit.set(habit || null);
    this.showHabitForm.set(true);
  }

  closeHabitForm(): void {
    this.showHabitForm.set(false);
    this.editingHabit.set(null);
  }

  onHabitCreated(habit: Habit): void {
    this.closeHabitForm();
  }

  onHabitUpdated(habit: Habit): void {
    this.closeHabitForm();
  }

  openMoodTracker(): void {
    console.log("Open mood tracker - redirecting to reflection");
  }

  // Helper methods for child component
  isHabitCompleted(habitId: string): boolean {
    const today = new Date().toISOString().split("T")[0];
    const entry = this.habitService
      .todayEntries()
      .find(
        (entry: HabitEntry) =>
          entry.habitId === habitId && entry.date === today,
      );
    return entry?.completed || false;
  }

  getHabitStats(habitId: string) {
    return this.habitService.getHabitStats(habitId);
  }

  getWeeklyProgress(habitId: string): number {
    const today = new Date();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay() + 1);

    let completedThisWeek = 0;
    for (let i = 0; i < 7; i++) {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);
      const dateStr = date.toISOString().split("T")[0];

      const entry = this.habitService
        .getEntriesForDate(dateStr)
        .find((entry: HabitEntry) => entry.habitId === habitId);

      if (entry?.completed) {
        completedThisWeek++;
      }
    }

    return completedThisWeek;
  }
}
