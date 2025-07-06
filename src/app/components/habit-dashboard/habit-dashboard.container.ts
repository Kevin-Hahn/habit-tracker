import { CommonModule } from "@angular/common";
import { Component, inject, signal } from "@angular/core";
import { RouterModule } from "@angular/router";
import { Habit } from "../../models/habit.model";
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
      (toggleHabit)="toggleHabit($event)"
      (openHabitForm)="openHabitForm($event)"
      (closeHabitForm)="closeHabitForm()"
      (deleteHabit)="onRequestDeleteHabit($event)"
    />

    <!-- Habit Form Modal -->
    @if (showHabitForm()) {
      <app-habit-form-container
        (close)="closeHabitForm()"
        (habitCreated)="closeHabitForm()"
        (habitUpdated)="closeHabitForm()"
        [editingHabit]="editingHabit()"
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
  protected readonly habitService = inject(HabitService);
  protected readonly statisticsService = inject(StatisticsService);
  protected readonly themeService = inject(ThemeService);

  todayDate = new Date();

  // Modal state
  showHabitForm = signal(false);
  editingHabit = signal<Habit | null>(null);
  habitToDelete = signal<string | null>(null);

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
