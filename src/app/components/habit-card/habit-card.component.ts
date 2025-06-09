import { Component, Input, Output, EventEmitter } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Habit, HabitStats } from "../../models/habit.model";

@Component({
  selector: "app-habit-card",
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="habit-card" [class.completed]="isCompleted">
      <div class="habit-header">
        <div class="habit-info">
          <div class="habit-color" [style.background-color]="habit.color"></div>
          <div class="habit-details">
            <h3 class="habit-name">{{ habit.name }}</h3>
            @if (habit.description) {
              <p class="habit-description">{{ habit.description }}</p>
            }
          </div>
        </div>
        <button
          class="habit-toggle"
          [class.completed]="isCompleted"
          (click)="handleToggle()"
          [attr.aria-label]="
            'Mark ' +
            habit.name +
            ' as ' +
            (isCompleted ? 'incomplete' : 'complete')
          "
        >
          @if (isCompleted) {
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
          <span class="stat-value">{{ stats.currentStreak }}</span>
          <span class="stat-unit">day streak</span>
        </div>
        @if (habit.frequency.type === "weekly") {
          <div class="habit-stat">
            <span class="stat-value">{{ weeklyProgress }}</span>
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
  `,
  styleUrls: ["./habit-card.component.css"],
})
export class HabitCardComponent {
  @Input() habit!: Habit;
  @Input() isCompleted!: boolean;
  @Input() stats!: HabitStats;
  @Input() weeklyProgress!: number;

  @Output() toggle = new EventEmitter<void>();
  @Output() edit = new EventEmitter<void>();

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
}
