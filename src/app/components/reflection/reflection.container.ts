import { Component, signal, computed } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule, Router } from "@angular/router";
import { StorageService } from "../../services/storage.service";
import { ReflectionComponent } from "./reflection.component";
import { WeeklyReflection } from "../../models/habit.model";

@Component({
  selector: "app-reflection-container",
  standalone: true,
  imports: [CommonModule, RouterModule, ReflectionComponent],
  template: `
    <app-reflection
      [currentReflection]="currentReflection()"
      [reflectionText]="reflectionText()"
      [pastReflections]="pastReflections()"
      [currentWeekRange]="getCurrentWeekRange()"
      (updateReflection)="updateReflection($event.key, $event.value)"
      (updateReflectionText)="updateReflectionText($event)"
      (addWin)="addWin($event)"
      (removeWin)="removeWin($event)"
      (addChallenge)="addChallenge($event)"
      (removeChallenge)="removeChallenge($event)"
      (addGoal)="addGoal($event)"
      (removeGoal)="removeGoal($event)"
      (saveReflection)="saveReflection()"
    >
    </app-reflection>
  `,
})
export class ReflectionContainerComponent {
  reflectionText = signal("");
  saveStatus = signal<"idle" | "saving" | "saved" | "error">("idle");

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

  constructor(
    private storageService: StorageService,
    private router: Router,
  ) {
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

  updateReflectionText(text: string): void {
    this.reflectionText.set(text);
  }

  addWin(win: string): void {
    if (win.trim()) {
      this.currentReflection.update((current) => ({
        ...current,
        wins: [...(current.wins || []), win.trim()],
      }));
    }
  }

  removeWin(index: number): void {
    this.currentReflection.update((current) => ({
      ...current,
      wins: current.wins?.filter((_, i) => i !== index) || [],
    }));
  }

  addChallenge(challenge: string): void {
    if (challenge.trim()) {
      this.currentReflection.update((current) => ({
        ...current,
        challenges: [...(current.challenges || []), challenge.trim()],
      }));
    }
  }

  removeChallenge(index: number): void {
    this.currentReflection.update((current) => ({
      ...current,
      challenges: current.challenges?.filter((_, i) => i !== index) || [],
    }));
  }

  addGoal(goal: string): void {
    if (goal.trim()) {
      this.currentReflection.update((current) => ({
        ...current,
        goals: [...(current.goals || []), goal.trim()],
      }));
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
    console.log("Reflection saved successfully!");
  }

  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }
}
