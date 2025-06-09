import { CommonModule } from "@angular/common";
import { Component, EventEmitter, Input, Output } from "@angular/core";
import { Habit, HabitStats } from "../../models/habit.model";

@Component({
  selector: "app-habit-card",
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./habit-card.component.html",
  styleUrls: ["./habit-card.component.css"],
})
export class HabitCardComponent {
  @Input() habit!: Habit;
  @Input() isCompleted!: boolean;
  @Input() stats!: HabitStats;
  @Input() weeklyProgress!: number;

  @Output() toggle = new EventEmitter<void>();
  @Output() edit = new EventEmitter<void>();
  @Output() delete = new EventEmitter<void>();

  handleToggle(): void {
    this.toggle.emit();

    // Add animation feedback
    const button = event?.target as HTMLButtonElement;
    if (button) {
      button.style.transform = "scale(0.95)";
      setTimeout(() => {
        button.style.transform = "scale(1)";
      }, 150);
    }
  }

  handleDelete(): void {
    this.delete.emit();
  }
}
