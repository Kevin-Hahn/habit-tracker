import { Component, signal, computed } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { StorageService } from "../../services/storage.service";
import { WeeklyReflection } from "../../models/habit.model";

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
            <p class="form-subtitle">Week of {{ getCurrentWeekRange() }}</p>
          </div>

          <form class="reflection-form" (ngSubmit)="saveReflection()">
            <!-- Mood & Energy -->
            <div class="form-section">
              <h3 class="section-title">How are you feeling?</h3>

              <div class="mood-energy-grid">
                <div class="mood-section">
                  <label class="form-label">Overall Mood</label>
                  <div class="mood-picker">
                    @for (mood of moods; track mood.value; let i = $index) {
                      <button
                        type="button"
                        class="mood-option"
                        [class.selected]="
                          currentReflection().mood === mood.value
                        "
                        (click)="updateReflection('mood', mood.value)"
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
                    @for (
                      energy of energyLevels;
                      track energy.value;
                      let i = $index
                    ) {
                      <button
                        type="button"
                        class="energy-option"
                        [class.selected]="
                          currentReflection().energy === energy.value
                        "
                        (click)="updateReflection('energy', energy.value)"
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
                [(ngModel)]="reflectionText"
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
                    (keydown.enter)="addWin($event)"
                    #winInput
                  />
                  <button
                    type="button"
                    class="add-button"
                    (click)="addWinFromButton(winInput)"
                  >
                    Add
                  </button>
                </div>

                @if (
                  currentReflection().wins &&
                  currentReflection().wins!.length > 0
                ) {
                  <div class="list-items">
                    @for (
                      win of currentReflection().wins;
                      track win;
                      let i = $index
                    ) {
                      <div class="list-item win-item">
                        <span class="item-icon">🏆</span>
                        <span class="item-text">{{ win }}</span>
                        <button
                          type="button"
                          class="remove-button"
                          (click)="removeWin(i)"
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
                    (keydown.enter)="addChallenge($event)"
                    #challengeInput
                  />
                  <button
                    type="button"
                    class="add-button"
                    (click)="addChallengeFromButton(challengeInput)"
                  >
                    Add
                  </button>
                </div>

                @if (
                  currentReflection().challenges &&
                  currentReflection().challenges!.length > 0
                ) {
                  <div class="list-items">
                    @for (
                      challenge of currentReflection().challenges;
                      track challenge;
                      let i = $index
                    ) {
                      <div class="list-item challenge-item">
                        <span class="item-icon">⚡</span>
                        <span class="item-text">{{ challenge }}</span>
                        <button
                          type="button"
                          class="remove-button"
                          (click)="removeChallenge(i)"
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
                    (keydown.enter)="addGoal($event)"
                    #goalInput
                  />
                  <button
                    type="button"
                    class="add-button"
                    (click)="addGoalFromButton(goalInput)"
                  >
                    Add
                  </button>
                </div>

                @if (
                  currentReflection().goals &&
                  currentReflection().goals!.length > 0
                ) {
                  <div class="list-items">
                    @for (
                      goal of currentReflection().goals;
                      track goal;
                      let i = $index
                    ) {
                      <div class="list-item goal-item">
                        <span class="item-icon">🎯</span>
                        <span class="item-text">{{ goal }}</span>
                        <button
                          type="button"
                          class="remove-button"
                          (click)="removeGoal(i)"
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

        @if (pastReflections().length === 0) {
          <div class="empty-state">
            <div class="empty-icon">📝</div>
            <p class="empty-text">
              No past reflections yet. Start your first reflection above!
            </p>
          </div>
        } @else {
          <div class="reflections-grid">
            @for (reflection of pastReflections(); track reflection.id) {
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

                @if (reflection.wins.length > 0) {
                  <div class="reflection-section">
                    <h4 class="section-header">Wins</h4>
                    <ul class="section-list">
                      @for (win of reflection.wins; track win) {
                        <li>{{ win }}</li>
                      }
                    </ul>
                  </div>
                }

                @if (reflection.goals.length > 0) {
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
  reflectionText = signal("");

  currentReflection = signal<Partial<WeeklyReflection>>({
    mood: 3,
    energy: 3,
    wins: [],
    challenges: [],
    goals: [],
  });

  pastReflections = computed(() => {
    const reflections = this.storageService.getReflections();
    return reflections.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
  });

  moods = [
    { value: 1, emoji: "😢", label: "Very Low" },
    { value: 2, emoji: "😔", label: "Low" },
    { value: 3, emoji: "😐", label: "Neutral" },
    { value: 4, emoji: "😊", label: "Good" },
    { value: 5, emoji: "😄", label: "Excellent" },
  ];

  energyLevels = [
    { value: 1, icon: "🔋", label: "Drained" },
    { value: 2, icon: "🔋", label: "Low" },
    { value: 3, icon: "🔋", label: "Moderate" },
    { value: 4, icon: "⚡", label: "High" },
    { value: 5, icon: "⚡", label: "Energized" },
  ];

  constructor(private storageService: StorageService) {
    this.loadCurrentWeekReflection();
  }

  private loadCurrentWeekReflection(): void {
    const currentWeek = this.getCurrentWeek();
    const reflections = this.storageService.getReflections();
    const existing = reflections.find((r) => r.week === currentWeek);

    if (existing) {
      this.currentReflection.set(existing);
      this.reflectionText.set(existing.reflection);
    }
  }

  getCurrentWeek(): string {
    const now = new Date();
    const year = now.getFullYear();
    const firstDayOfYear = new Date(year, 0, 1);
    const pastDaysOfYear =
      (now.getTime() - firstDayOfYear.getTime()) / 86400000;
    const weekNumber = Math.ceil(
      (pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7,
    );
    return `${year}-W${weekNumber.toString().padStart(2, "0")}`;
  }

  getCurrentWeekRange(): string {
    const now = new Date();
    const dayOfWeek = now.getDay();
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1)); // Monday

    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);

    const formatDate = (date: Date) =>
      date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });

    return `${formatDate(startOfWeek)} - ${formatDate(endOfWeek)}`;
  }

  updateReflection<K extends keyof WeeklyReflection>(
    key: K,
    value: WeeklyReflection[K],
  ): void {
    this.currentReflection.update((current) => ({
      ...current,
      [key]: value,
    }));
  }

  addWin(event: Event): void {
    event.preventDefault();
    const input = event.target as HTMLInputElement;
    const win = input.value.trim();

    if (win) {
      this.currentReflection.update((current) => ({
        ...current,
        wins: [...(current.wins || []), win],
      }));
      input.value = "";
    }
  }

  addWinFromButton(input: HTMLInputElement): void {
    const win = input.value.trim();
    if (win) {
      this.currentReflection.update((current) => ({
        ...current,
        wins: [...(current.wins || []), win],
      }));
      input.value = "";
    }
  }

  removeWin(index: number): void {
    this.currentReflection.update((current) => ({
      ...current,
      wins: current.wins?.filter((_, i) => i !== index) || [],
    }));
  }

  addChallenge(event: Event): void {
    event.preventDefault();
    const input = event.target as HTMLInputElement;
    const challenge = input.value.trim();

    if (challenge) {
      this.currentReflection.update((current) => ({
        ...current,
        challenges: [...(current.challenges || []), challenge],
      }));
      input.value = "";
    }
  }

  addChallengeFromButton(input: HTMLInputElement): void {
    const challenge = input.value.trim();
    if (challenge) {
      this.currentReflection.update((current) => ({
        ...current,
        challenges: [...(current.challenges || []), challenge],
      }));
      input.value = "";
    }
  }

  removeChallenge(index: number): void {
    this.currentReflection.update((current) => ({
      ...current,
      challenges: current.challenges?.filter((_, i) => i !== index) || [],
    }));
  }

  addGoal(event: Event): void {
    event.preventDefault();
    const input = event.target as HTMLInputElement;
    const goal = input.value.trim();

    if (goal) {
      this.currentReflection.update((current) => ({
        ...current,
        goals: [...(current.goals || []), goal],
      }));
      input.value = "";
    }
  }

  addGoalFromButton(input: HTMLInputElement): void {
    const goal = input.value.trim();
    if (goal) {
      this.currentReflection.update((current) => ({
        ...current,
        goals: [...(current.goals || []), goal],
      }));
      input.value = "";
    }
  }

  removeGoal(index: number): void {
    this.currentReflection.update((current) => ({
      ...current,
      goals: current.goals?.filter((_, i) => i !== index) || [],
    }));
  }

  saveReflection(): void {
    const reflection: WeeklyReflection = {
      id: this.generateId(),
      week: this.getCurrentWeek(),
      reflection: this.reflectionText(),
      mood: this.currentReflection().mood || 3,
      energy: this.currentReflection().energy || 3,
      goals: this.currentReflection().goals || [],
      challenges: this.currentReflection().challenges || [],
      wins: this.currentReflection().wins || [],
      createdAt: new Date(),
    };

    const reflections = this.storageService.getReflections();
    const existingIndex = reflections.findIndex(
      (r) => r.week === reflection.week,
    );

    if (existingIndex >= 0) {
      reflections[existingIndex] = reflection;
    } else {
      reflections.push(reflection);
    }

    this.storageService.saveReflections(reflections);

    // Show success feedback (could be a toast notification)
    console.log("Reflection saved successfully!");
  }

  getMoodEmoji(mood: number): string {
    const moodData = this.moods.find((m) => m.value === mood);
    return moodData?.emoji || "😐";
  }

  getEnergyIcon(energy: number): string {
    const energyData = this.energyLevels.find((e) => e.value === energy);
    return energyData?.icon || "🔋";
  }

  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }
}
