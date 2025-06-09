import { CommonModule } from "@angular/common";
import { Component, EventEmitter, Input, Output } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { ENERGY_LEVELS, MOOD_OPTIONS } from "../../constants/habit.constants";
import { WeeklyReflection } from "../../models/habit.model";

@Component({
  selector: "app-reflection",

  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: "./reflection.component.html",
  styleUrls: ["./reflection.component.css"],
})
export class ReflectionComponent {
  @Input() currentReflection!: Partial<WeeklyReflection>;
  @Input() reflectionText!: string;
  @Input() pastReflections!: WeeklyReflection[];
  @Input() currentWeekRange!: string;
  @Input() saveStatus!: "idle" | "saving" | "saved" | "error";
  @Input() isFormValid!: boolean;

  @Output() updateReflection = new EventEmitter<{
    key: keyof WeeklyReflection;
    value: number;
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
