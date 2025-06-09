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
  styles: [
    `
      .habit-card {
        background: var(--bg-secondary);
        border: 1px solid var(--border-color);
        border-radius: 16px;
        padding: 1.5rem;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        position: relative;
        overflow: hidden;
      }

      .habit-card:hover {
        border-color: var(--accent-primary);
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
        transform: translateY(-2px);
      }

      .habit-card.completed {
        background: var(--success-bg);
        border-color: var(--success-border);
      }

      .habit-card.completed::before {
        content: "";
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 3px;
        background: var(--success-color);
      }

      .habit-header {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        margin-bottom: 1rem;
      }

      .habit-info {
        display: flex;
        align-items: flex-start;
        gap: 0.75rem;
        flex: 1;
      }

      .habit-color {
        width: 12px;
        height: 12px;
        border-radius: 50%;
        margin-top: 0.25rem;
        flex-shrink: 0;
      }

      .habit-details {
        flex: 1;
      }

      .habit-name {
        font-size: 1.1rem;
        font-weight: 600;
        margin: 0 0 0.25rem 0;
        color: var(--text-primary);
        line-height: 1.3;
      }

      .habit-description {
        font-size: 0.875rem;
        color: var(--text-secondary);
        margin: 0;
        line-height: 1.4;
      }

      .habit-toggle {
        width: 44px;
        height: 44px;
        border-radius: 50%;
        border: 2px solid var(--border-color);
        background: var(--bg-primary);
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        flex-shrink: 0;
      }

      .habit-toggle:hover {
        border-color: var(--accent-primary);
        background: var(--accent-primary);
        color: white;
        transform: scale(1.05);
      }

      .habit-toggle.completed {
        background: var(--success-color);
        border-color: var(--success-color);
        color: white;
      }

      .toggle-circle {
        width: 16px;
        height: 16px;
        border-radius: 50%;
        background: var(--border-color);
        transition: all 0.2s ease;
      }

      .habit-toggle:hover .toggle-circle {
        background: white;
      }

      .habit-stats {
        display: flex;
        gap: 1.5rem;
        margin-bottom: 1rem;
      }

      .habit-stat {
        display: flex;
        align-items: baseline;
        gap: 0.25rem;
      }

      .stat-value {
        font-weight: 700;
        color: var(--text-primary);
        font-size: 1rem;
      }

      .stat-unit {
        font-size: 0.8rem;
        color: var(--text-secondary);
      }

      .habit-tags {
        display: flex;
        flex-wrap: wrap;
        gap: 0.5rem;
      }

      .habit-tag {
        background: var(--bg-tertiary);
        color: var(--text-secondary);
        padding: 0.25rem 0.5rem;
        border-radius: 6px;
        font-size: 0.75rem;
        font-weight: 500;
      }

      @keyframes completionPulse {
        0% {
          transform: scale(1);
        }
        50% {
          transform: scale(1.1);
        }
        100% {
          transform: scale(1);
        }
      }

      .habit-toggle.completed {
        animation: completionPulse 0.6s ease-out;
      }

      @media (max-width: 480px) {
        .habit-card {
          padding: 1.25rem;
        }

        .habit-stats {
          flex-direction: column;
          gap: 0.5rem;
        }
      }
    `,
  ],
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
