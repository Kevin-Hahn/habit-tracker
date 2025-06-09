import { Component, Input, Output, EventEmitter } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { WeeklyReflection } from "../../models/habit.model";
import { MOOD_OPTIONS, ENERGY_LEVELS } from "../../constants/habit.constants";

@Component({
  selector: "app-reflection",
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="reflection-container">
      <!-- Header -->
      <header class="reflection-header">
        <div class="header-content">
          <button
            class="back-button"
            routerLink="/"
            aria-label="Go back to dashboard"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <path d="M19 12H6m6-6l-6 6 6 6" />
            </svg>
          </button>
          <div class="header-info">
            <h1 class="reflection-title">Weekly Reflection</h1>
            <p class="reflection-subtitle">
              Reflect on your progress and plan ahead
            </p>
          </div>
        </div>
      </header>

      <!-- Current Week Reflection -->
      <div class="reflection-form-section">
        <div class="form-container">
          <div class="form-header">
            <h2 class="form-title">This Week's Reflection</h2>
            <p class="form-subtitle">Week of {{ currentWeekRange }}</p>
          </div>

          <form class="reflection-form" (ngSubmit)="saveReflection.emit()">
            <!-- Mood & Energy -->
            <div class="form-section">
              <h3 class="section-title">How are you feeling?</h3>

              <div class="mood-energy-grid">
                <div class="mood-section">
                  <label class="form-label">Overall Mood</label>
                  <div class="mood-picker">
                    @for (mood of moods; track mood.value) {
                      <button
                        type="button"
                        class="mood-option"
                        [class.selected]="currentReflection.mood === mood.value"
                        (click)="
                          updateReflection.emit({
                            key: 'mood',
                            value: mood.value,
                          })
                        "
                        [attr.aria-label]="mood.label"
                      >
                        <span class="mood-emoji">{{ mood.emoji }}</span>
                        <span class="mood-label">{{ mood.label }}</span>
                      </button>
                    }
                  </div>
                </div>

                <div class="energy-section">
                  <label class="form-label">Energy Level</label>
                  <div class="energy-picker">
                    @for (energy of energyLevels; track energy.value) {
                      <button
                        type="button"
                        class="energy-option"
                        [class.selected]="
                          currentReflection.energy === energy.value
                        "
                        (click)="
                          updateReflection.emit({
                            key: 'energy',
                            value: energy.value,
                          })
                        "
                        [attr.aria-label]="energy.label"
                      >
                        <span class="energy-icon">{{ energy.icon }}</span>
                        <span class="energy-label">{{ energy.label }}</span>
                      </button>
                    }
                  </div>
                </div>
              </div>
            </div>

            <!-- Main Reflection -->
            <div class="form-section">
              <label for="reflection-text" class="form-label"
                >What happened this week?</label
              >
              <textarea
                id="reflection-text"
                class="form-textarea"
                [ngModel]="reflectionText"
                (ngModelChange)="updateReflectionText.emit($event)"
                name="reflection"
                placeholder="Share your thoughts, challenges, insights, or anything significant that happened this week..."
                rows="6"
              ></textarea>
            </div>

            <!-- Wins -->
            <div class="form-section">
              <h3 class="section-title">Wins & Accomplishments 🎉</h3>
              <div class="list-input-section">
                <div class="input-group">
                  <input
                    type="text"
                    class="form-input"
                    placeholder="Add a win and press Enter"
                    (keydown.enter)="handleAddWin($event)"
                    #winInput
                  />
                  <button
                    type="button"
                    class="add-button"
                    (click)="handleAddWinFromButton(winInput)"
                  >
                    Add
                  </button>
                </div>

                @if (
                  currentReflection.wins && currentReflection.wins.length > 0
                ) {
                  <div class="list-items">
                    @for (
                      win of currentReflection.wins;
                      track win;
                      let i = $index
                    ) {
                      <div class="list-item win-item">
                        <span class="item-icon">🏆</span>
                        <span class="item-text">{{ win }}</span>
                        <button
                          type="button"
                          class="remove-button"
                          (click)="removeWin.emit(i)"
                          aria-label="Remove win"
                        >
                          ×
                        </button>
                      </div>
                    }
                  </div>
                }
              </div>
            </div>

            <!-- Challenges -->
            <div class="form-section">
              <h3 class="section-title">Challenges & Struggles 💪</h3>
              <div class="list-input-section">
                <div class="input-group">
                  <input
                    type="text"
                    class="form-input"
                    placeholder="Add a challenge and press Enter"
                    (keydown.enter)="handleAddChallenge($event)"
                    #challengeInput
                  />
                  <button
                    type="button"
                    class="add-button"
                    (click)="handleAddChallengeFromButton(challengeInput)"
                  >
                    Add
                  </button>
                </div>

                @if (
                  currentReflection.challenges &&
                  currentReflection.challenges.length > 0
                ) {
                  <div class="list-items">
                    @for (
                      challenge of currentReflection.challenges;
                      track challenge;
                      let i = $index
                    ) {
                      <div class="list-item challenge-item">
                        <span class="item-icon">⚡</span>
                        <span class="item-text">{{ challenge }}</span>
                        <button
                          type="button"
                          class="remove-button"
                          (click)="removeChallenge.emit(i)"
                          aria-label="Remove challenge"
                        >
                          ×
                        </button>
                      </div>
                    }
                  </div>
                }
              </div>
            </div>

            <!-- Goals for Next Week -->
            <div class="form-section">
              <h3 class="section-title">Goals for Next Week 🎯</h3>
              <div class="list-input-section">
                <div class="input-group">
                  <input
                    type="text"
                    class="form-input"
                    placeholder="Add a goal and press Enter"
                    (keydown.enter)="handleAddGoal($event)"
                    #goalInput
                  />
                  <button
                    type="button"
                    class="add-button"
                    (click)="handleAddGoalFromButton(goalInput)"
                  >
                    Add
                  </button>
                </div>

                @if (
                  currentReflection.goals && currentReflection.goals.length > 0
                ) {
                  <div class="list-items">
                    @for (
                      goal of currentReflection.goals;
                      track goal;
                      let i = $index
                    ) {
                      <div class="list-item goal-item">
                        <span class="item-icon">🎯</span>
                        <span class="item-text">{{ goal }}</span>
                        <button
                          type="button"
                          class="remove-button"
                          (click)="removeGoal.emit(i)"
                          aria-label="Remove goal"
                        >
                          ×
                        </button>
                      </div>
                    }
                  </div>
                }
              </div>
            </div>

            <!-- Form Actions -->
            <div class="form-actions">
              <button type="button" class="button-secondary" routerLink="/">
                Cancel
              </button>
              <button type="submit" class="button-primary">
                Save Reflection
              </button>
            </div>
          </form>
        </div>
      </div>

      <!-- Past Reflections -->
      <div class="past-reflections-section">
        <h2 class="section-title">Past Reflections</h2>

        @if (pastReflections.length === 0) {
          <div class="empty-state">
            <div class="empty-icon">📝</div>
            <p class="empty-text">
              No past reflections yet. Start your first reflection above!
            </p>
          </div>
        } @else {
          <div class="reflections-grid">
            @for (reflection of pastReflections; track reflection.id) {
              <div class="reflection-card">
                <div class="reflection-header">
                  <h3 class="reflection-week">{{ reflection.week }}</h3>
                  <div class="reflection-mood-energy">
                    <span class="mood-indicator">{{
                      getMoodEmoji(reflection.mood)
                    }}</span>
                    <span class="energy-indicator">{{
                      getEnergyIcon(reflection.energy)
                    }}</span>
                  </div>
                </div>

                @if (reflection.reflection) {
                  <p class="reflection-text">{{ reflection.reflection }}</p>
                }

                @if (reflection.wins && reflection.wins.length > 0) {
                  <div class="reflection-section">
                    <h4 class="section-header">Wins</h4>
                    <ul class="section-list">
                      @for (win of reflection.wins; track win) {
                        <li>{{ win }}</li>
                      }
                    </ul>
                  </div>
                }

                @if (reflection.goals && reflection.goals.length > 0) {
                  <div class="reflection-section">
                    <h4 class="section-header">Goals</h4>
                    <ul class="section-list">
                      @for (goal of reflection.goals; track goal) {
                        <li>{{ goal }}</li>
                      }
                    </ul>
                  </div>
                }

                <div class="reflection-date">
                  {{ reflection.createdAt | date: "mediumDate" }}
                </div>
              </div>
            }
          </div>
        }
      </div>
    </div>
  `,
  styleUrls: ["./reflection.component.css"],
})
export class ReflectionComponent {
  @Input() currentReflection!: Partial<WeeklyReflection>;
  @Input() reflectionText!: string;
  @Input() pastReflections!: WeeklyReflection[];
  @Input() currentWeekRange!: string;

  @Output() updateReflection = new EventEmitter<{
    key: keyof WeeklyReflection;
    value: any;
  }>();
  @Output() updateReflectionText = new EventEmitter<string>();
  @Output() addWin = new EventEmitter<string>();
  @Output() removeWin = new EventEmitter<number>();
  @Output() addChallenge = new EventEmitter<string>();
  @Output() removeChallenge = new EventEmitter<number>();
  @Output() addGoal = new EventEmitter<string>();
  @Output() removeGoal = new EventEmitter<number>();
  @Output() saveReflection = new EventEmitter<void>();

  moods = MOOD_OPTIONS;
  energyLevels = ENERGY_LEVELS;

  handleAddWin(event: Event): void {
    event.preventDefault();
    const input = event.target as HTMLInputElement;
    const win = input.value.trim();

    if (win) {
      this.addWin.emit(win);
      input.value = "";
    }
  }

  handleAddWinFromButton(input: HTMLInputElement): void {
    const win = input.value.trim();
    if (win) {
      this.addWin.emit(win);
      input.value = "";
    }
  }

  handleAddChallenge(event: Event): void {
    event.preventDefault();
    const input = event.target as HTMLInputElement;
    const challenge = input.value.trim();

    if (challenge) {
      this.addChallenge.emit(challenge);
      input.value = "";
    }
  }

  handleAddChallengeFromButton(input: HTMLInputElement): void {
    const challenge = input.value.trim();
    if (challenge) {
      this.addChallenge.emit(challenge);
      input.value = "";
    }
  }

  handleAddGoal(event: Event): void {
    event.preventDefault();
    const input = event.target as HTMLInputElement;
    const goal = input.value.trim();

    if (goal) {
      this.addGoal.emit(goal);
      input.value = "";
    }
  }

  handleAddGoalFromButton(input: HTMLInputElement): void {
    const goal = input.value.trim();
    if (goal) {
      this.addGoal.emit(goal);
      input.value = "";
    }
  }

  getMoodEmoji(mood: number): string {
    const moodData = this.moods.find((m) => m.value === mood);
    return moodData?.emoji || "😐";
  }

  getEnergyIcon(energy: number): string {
    const energyData = this.energyLevels.find((e) => e.value === energy);
    return energyData?.icon || "🔋";
  }
}
