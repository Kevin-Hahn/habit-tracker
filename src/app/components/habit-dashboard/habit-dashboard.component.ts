import { CommonModule } from "@angular/common";
import { Component, input, Input, output } from "@angular/core";
import { RouterModule } from "@angular/router";
import { PROGRESS_RING_CONFIG } from "../../constants/ui.constants";
import { Habit, HabitStats } from "../../models/habit.model";
import { HabitCardComponent } from "../habit-card/habit-card.component";
import { HabitQuickactionBarComponent } from "./habit-quickaction-bar/habit-quickaction-bar.component";
import { HabitQuickstatsComponent } from "./habit-quickstats/habit-quickstats.component";

@Component({
  selector: "app-habit-dashboard",
  imports: [CommonModule, RouterModule, HabitCardComponent, HabitQuickstatsComponent, HabitQuickactionBarComponent],
  templateUrl: "./habit-dashboard.component.html",
  styleUrls: ["./habit-dashboard.component.css"],
})
export class HabitDashboardComponent {
  todayDate = input.required<Date>();
  completedToday = input.required<number>();
  totalHabitsToday = input.required<number>();
  progressOffset = input.required<number>();
  activeHabits = input.required<Habit[]>();
  isDarkTheme = input.required<boolean>();
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

  circumference = PROGRESS_RING_CONFIG.circumference;
}
