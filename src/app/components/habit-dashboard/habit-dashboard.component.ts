import { Component, computed, signal } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { HabitService } from "../../services/habit.service";
import { StatisticsService } from "../../services/statistics.service";
import { ThemeService } from "../../services/theme.service";
import { HabitFormComponent } from "../habit-form/habit-form.component";
import { Habit, HabitEntry } from "../../models/habit.model";

@Component({
  selector: "app-habit-dashboard",
  standalone: true,
  imports: [CommonModule, RouterModule, HabitFormComponent],
  template: `
    <div class="dashboard-container">
      <!-- Header -->
      <header class="dashboard-header">
        <div class="header-content">
          <div class="header-left">
            <h1 class="dashboard-title">Today's Habits</h1>
            <p class="dashboard-subtitle">{{ todayDate | date: "fullDate" }}</p>
          </div>
          <div class="header-right">
            <div class="completion-circle">
              <svg class="progress-ring" width="60" height="60">
                <circle
                  class="progress-ring-background"
                  stroke="currentColor"
                  stroke-width="4"
                  fill="transparent"
                  r="26"
                  cx="30"
                  cy="30"
                />
                <circle
                  class="progress-ring-progress"
                  stroke="currentColor"
                  stroke-width="4"
                  fill="transparent"
                  r="26"
                  cx="30"
                  cy="30"
                  [style.stroke-dasharray]="circumference"
                  [style.stroke-dashoffset]="progressOffset()"
                />
              </svg>
              <div class="progress-text">
                <span class="progress-number">{{ completedToday() }}</span>
                <span class="progress-total">/{{ totalHabitsToday() }}</span>
              </div>
            </div>
            <button
              class="theme-toggle"
              (click)="themeService.toggleTheme()"
              [attr.aria-label]="
                'Switch to ' +
                (themeService.isDark() ? 'light' : 'dark') +
                ' theme'
              "
            >
              @if (themeService.isDark()) {
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                >
                  <circle cx="12" cy="12" r="5" />
                  <path
                    d="M12 1v2M12 21v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M1 12h2M21 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4"
                  />
                </svg>
              } @else {
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                >
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                </svg>
              }
            </button>
          </div>
        </div>

        <!-- Quick Stats -->
        <div class="quick-stats">
          <div class="stat-card">
            <div class="stat-icon">🔥</div>
            <div class="stat-content">
              <div class="stat-number">{{ longestStreak() }}</div>
              <div class="stat-label">Longest Streak</div>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-icon">📈</div>
            <div class="stat-content">
              <div class="stat-number">{{ weeklyCompletion() }}%</div>
              <div class="stat-label">This Week</div>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-icon">⚡</div>
            <div class="stat-content">
              <div class="stat-number">{{ currentStreaks() }}</div>
              <div class="stat-label">Active Streaks</div>
            </div>
          </div>
        </div>
      </header>

      <!-- Habits List -->
      <main class="habits-main">
        @if (habitService.activeHabits().length === 0) {
          <div class="empty-state">
            <div class="empty-icon">🎯</div>
            <h2 class="empty-title">No habits yet</h2>
            <p class="empty-description">
              Create your first habit to start building better routines
            </p>
            <button class="create-habit-button" (click)="createFirstHabit()">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
              >
                <path d="M12 5v14M5 12h14" />
              </svg>
              Create Your First Habit
            </button>
          </div>
        } @else {
          <div class="habits-grid">
            @for (habit of habitService.activeHabits(); track habit.id) {
              <div
                class="habit-card"
                [class.completed]="isHabitCompleted(habit.id)"
              >
                <div class="habit-header">
                  <div class="habit-info">
                    <div
                      class="habit-color"
                      [style.background-color]="habit.color"
                    ></div>
                    <div class="habit-details">
                      <h3 class="habit-name">{{ habit.name }}</h3>
                      @if (habit.description) {
                        <p class="habit-description">{{ habit.description }}</p>
                      }
                    </div>
                  </div>
                  <button
                    class="habit-toggle"
                    [class.completed]="isHabitCompleted(habit.id)"
                    (click)="toggleHabit(habit.id)"
                    [attr.aria-label]="
                      'Mark ' +
                      habit.name +
                      ' as ' +
                      (isHabitCompleted(habit.id) ? 'incomplete' : 'complete')
                    "
                  >
                    @if (isHabitCompleted(habit.id)) {
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                      >
                        <path d="M20 6L9 17l-5-5" />
                      </svg>
                    } @else {
                      <div class="toggle-circle"></div>
                    }
                  </button>
                </div>

                <div class="habit-stats">
                  <div class="habit-stat">
                    <span class="stat-value">{{
                      getHabitStats(habit.id).currentStreak
                    }}</span>
                    <span class="stat-unit">day streak</span>
                  </div>
                  @if (habit.frequency.type === "weekly") {
                    <div class="habit-stat">
                      <span class="stat-value">{{
                        getWeeklyProgress(habit.id)
                      }}</span>
                      <span class="stat-unit"
                        >/ {{ habit.frequency.timesPerWeek }} this week</span
                      >
                    </div>
                  }
                </div>

                @if (habit.tags && habit.tags.length > 0) {
                  <div class="habit-tags">
                    @for (tag of habit.tags; track tag) {
                      <span class="habit-tag">{{ tag }}</span>
                    }
                  </div>
                }
              </div>
            }
          </div>
        }

        <!-- Floating Action Button -->
        <button
          class="fab"
          (click)="openHabitForm()"
          aria-label="Add new habit"
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          >
            <path d="M12 5v14M5 12h14" />
          </svg>
        </button>
      </main>

      <!-- Quick Action Bar -->
      <div class="quick-actions">
        <button class="quick-action" routerLink="/stats">
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          >
            <path d="M3 3v18h18" />
            <path d="M7 12l3-3 3 3 5-5" />
          </svg>
          Stats
        </button>
        <button class="quick-action" (click)="openMoodTracker()">
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          >
            <circle cx="12" cy="12" r="10" />
            <path d="M8 14s1.5 2 4 2 4-2 4-2" />
            <path d="M9 9h.01M15 9h.01" />
          </svg>
          Mood
        </button>
        <button class="quick-action" routerLink="/reflection">
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          >
            <path
              d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"
            />
          </svg>
          Reflect
        </button>
      </div>
    </div>

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
  styleUrls: ["./habit-dashboard.component.css"],
})
export class HabitDashboardComponent {
  todayDate = new Date();
  circumference = 2 * Math.PI * 26; // radius 26

  // Modal state
  showHabitForm = signal(false);
  editingHabit = signal<Habit | null>(null);

  // Computed values based on service signals
  completedToday = computed(
    () =>
      this.habitService
        .todayEntries()
        .filter((entry: HabitEntry) => entry.completed).length,
  );

  totalHabitsToday = computed(() => this.habitService.activeHabits().length);

  progressOffset = computed(() => {
    const total = this.totalHabitsToday();
    const completed = this.completedToday();
    const percentage = total > 0 ? completed / total : 0;
    return this.circumference - percentage * this.circumference;
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

  toggleHabit(habitId: string): void {
    this.habitService.toggleHabitCompletion(habitId);

    // Add a subtle animation effect
    const button = event?.target as HTMLButtonElement;
    if (button) {
      button.style.transform = "scale(0.95)";
      setTimeout(() => {
        button.style.transform = "scale(1)";
      }, 150);
    }
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
        .find((entry) => entry.habitId === habitId);

      if (entry?.completed) {
        completedThisWeek++;
      }
    }

    return completedThisWeek;
  }

  createFirstHabit(): void {
    this.openHabitForm();
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
    // Habit is already created by the service, just close the modal
    this.closeHabitForm();
  }

  onHabitUpdated(habit: Habit): void {
    // Habit is already updated by the service, just close the modal
    this.closeHabitForm();
  }

  openMoodTracker(): void {
    // This would typically open a mood tracking modal
    // For now, just navigate to reflection page
    console.log("Open mood tracker - redirecting to reflection");
  }
}
