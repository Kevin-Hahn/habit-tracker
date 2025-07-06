import { CommonModule } from "@angular/common";
import { Component, computed, inject, input, output, signal } from "@angular/core";
import type { Habit } from "../../../models/Habit";
import type { HabitEntry } from "../../../models/HabitEntry";
import type { HabitStats } from "../../../models/HabitStats";
import { HabitService } from "../../../services/habit.service";
import { HabitCalendarDialogContainer } from './habit-calendar-dialog.container';

@Component({
  selector: "app-habit-card",
  imports: [CommonModule, HabitCalendarDialogContainer],
  templateUrl: "./habit-card.component.html",
  styleUrls: ["./habit-card.component.css"],
})
export class HabitCardComponent {
  habitService = inject(HabitService);
  habit = input.required<Habit>();

  toggle = output();
  edit = output();
  delete = output();

  showCalendarDialog = signal(false);

  isCompleted = computed(() => {
    const habit = this.habit();
    const today = new Date().toISOString().split("T")[0];
    const entry = this.habitService
      .todayEntries()
      .find(
        (entry: HabitEntry) =>
          entry.habitId === habit.id && entry.date === today,
      );
    return entry?.completed ?? false;
  })

  readonly stats = computed((): HabitStats => {
    const habit = this.habit();
    return this.habitService.getHabitStats(habit.id);
  });

  readonly weeklyProgress = computed((): number => {
    const habit = this.habit();
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
        .find((entry: HabitEntry) => entry.habitId === habit.id);

      if (entry?.completed) {
        completedThisWeek++;
      }
    }

    return completedThisWeek;
  });

  get completedDates() {
    return this.habitService.entries().filter(e => e.habitId === this.habit().id && e.completed).map(e => e.date);
  }

  openCalendarDialog = () => this.showCalendarDialog.set(true);
  closeCalendarDialog = () => this.showCalendarDialog.set(false);
  onMarkDone = (date: string) => {
    this.habitService.toggleHabitCompletion(this.habit().id, date);
  };
}
