import { CommonModule } from "@angular/common";
import { Component, computed, inject, input, Input, output } from "@angular/core";
import { RouterModule } from "@angular/router";
import { PROGRESS_RING_CONFIG } from "../../constants/ui.constants";
import { Habit, HabitEntry, HabitStats } from "../../models/habit.model";
import { HabitService } from "../../services/habit.service";
import { ThemeToggleComponent } from "../theme-toggle/theme-toggle.component";
import { HabitCardComponent } from "./habit-card/habit-card.component";
import { HabitQuickactionBarComponent } from "./habit-quickaction-bar/habit-quickaction-bar.component";
import { HabitQuickstatsComponent } from "./habit-quickstats/habit-quickstats.component";

@Component({
  selector: "app-habit-dashboard",
  imports: [CommonModule, RouterModule, HabitCardComponent, HabitQuickstatsComponent, HabitQuickactionBarComponent, ThemeToggleComponent],
  templateUrl: "./habit-dashboard.component.html",
  styleUrls: ["./habit-dashboard.component.css"],
})
export class HabitDashboardComponent {
  private readonly habitService = inject(HabitService);

  showHabitForm = input.required<boolean>();
  editingHabit = input.required<Habit | null>();

  // Function inputs for complex logic
  @Input() isHabitCompleted!: (habitId: string) => boolean;
  @Input() getHabitStats!: (habitId: string) => HabitStats;
  @Input() getWeeklyProgress!: (habitId: string) => number;

  toggleTheme = output<void>();
  toggleHabit = output<string>();
  openHabitForm = output<Habit | undefined>();
  closeHabitForm = output<void>();
  habitCreated = output<Habit>();
  habitUpdated = output<Habit>();
  deleteHabit = output<string>();

  today = new Date();

  circumference = PROGRESS_RING_CONFIG.circumference;

  activeHabits = computed(() => this.habitService.activeHabits());

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
}
