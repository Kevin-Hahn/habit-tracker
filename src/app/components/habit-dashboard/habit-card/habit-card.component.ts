import { CommonModule } from "@angular/common";
import { Component, computed, inject, input, output } from "@angular/core";
import { Habit, HabitEntry, HabitStats } from "../../../models/habit.model";
import { HabitService } from "../../../services/habit.service";

@Component({
  selector: "app-habit-card",
  imports: [CommonModule],
  templateUrl: "./habit-card.component.html",
  styleUrls: ["./habit-card.component.css"],
})
export class HabitCardComponent {
  habitService = inject(HabitService);
  habit = input.required<Habit>();

  toggle = output();
  edit = output();
  delete = output();

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
}
