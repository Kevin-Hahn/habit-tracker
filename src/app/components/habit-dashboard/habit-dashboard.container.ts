import { CommonModule } from "@angular/common";
import { Component, computed, signal } from "@angular/core";
import { Router, RouterModule } from "@angular/router";
import { Habit, HabitEntry } from "../../models/habit.model";
import { HabitService } from "../../services/habit.service";
import { StatisticsService } from "../../services/statistics.service";
import { ThemeService } from "../../services/theme.service";
import { QuestionDialogComponent } from "../question-dialog/question-dialog.component";
import { HabitDashboardComponent } from "./habit-dashboard.component";
import { HabitFormContainerComponent } from "./habit-form/habit-form.container";

@Component({
  selector: "app-habit-dashboard-container",

  imports: [
    CommonModule,
    RouterModule,
    HabitFormContainerComponent,
    HabitDashboardComponent,
    QuestionDialogComponent,
  ],
  template: `
    <app-habit-dashboard
      [todayDate]="todayDate"
      [completedToday]="completedToday()"
      [totalHabitsToday]="totalHabitsToday()"
      [progressOffset]="progressOffset()"
      [activeHabits]="habitService.activeHabits()"
      [isDarkTheme]="themeService.isDark()"
      [showHabitForm]="showHabitForm()"
      [editingHabit]="editingHabit()"
      (toggleTheme)="themeService.toggleTheme()"
      (toggleHabit)="toggleHabit($event)"
      (openHabitForm)="openHabitForm($event)"
      (closeHabitForm)="closeHabitForm()"
      (deleteHabit)="onRequestDeleteHabit($event)"
    >
    </app-habit-dashboard>

    <!-- Habit Form Modal -->
    @if (showHabitForm()) {
      <app-habit-form-container
        [editingHabit]="editingHabit()"
        (close)="closeHabitForm()"
        (habitCreated)="closeHabitForm()"
        (habitUpdated)="closeHabitForm()"
      >
      </app-habit-form-container>
    }

    <!-- Question Dialog for Delete -->
    @if (habitToDelete()) {
      <app-question-dialog
        [title]="'Delete Habit?'"
        [text]="'Are you sure you want to delete this habit? This action cannot be undone.'"
        [acceptLabel]="'Delete'"
        [cancelLabel]="'Cancel'"
        (accept)="onConfirmDeleteHabit()"
        (cancel)="onCancelDeleteHabit()"
      />
    }
  `,
})
export class HabitDashboardContainerComponent {
  todayDate = new Date();

  // Modal state
  showHabitForm = signal(false);
  editingHabit = signal<Habit | null>(null);
  habitToDelete = signal<string | null>(null);

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



  constructor(
    public habitService: HabitService,
    public statisticsService: StatisticsService,
    public themeService: ThemeService,
    private router: Router,
  ) { }

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

  onRequestDeleteHabit(habitId: string): void {
    this.habitToDelete.set(habitId);
  }

  onConfirmDeleteHabit(): void {
    const id = this.habitToDelete();
    if (id) {
      this.habitService.deleteHabit(id);
      if (this.editingHabit() && this.editingHabit()!.id === id) {
        this.closeHabitForm();
      }
    }
    this.habitToDelete.set(null);
  }

  onCancelDeleteHabit(): void {
    this.habitToDelete.set(null);
  }

}
