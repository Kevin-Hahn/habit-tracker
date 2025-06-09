import { CommonModule } from "@angular/common";
import { Component, computed, signal } from "@angular/core";
import { RouterModule } from "@angular/router";
import { WeeklyReflection } from "../../models/habit.model";
import { StorageService } from "../../services/storage.service";
import { ReflectionComponent } from "./reflection.component";

@Component({
  selector: "app-reflection-container",

  imports: [CommonModule, RouterModule, ReflectionComponent],
  template: `
    <app-reflection
      [currentReflection]="currentReflection()"
      [reflectionText]="reflectionText()"
      [pastReflections]="pastReflections()"
      [currentWeekRange]="getCurrentWeekRange()"
      [saveStatus]="saveStatus()"
      [isFormValid]="isFormValid() ?? false"
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

  isFormValid = computed(() => {
    const current = this.currentReflection();
    const reflectionTextValue = this.reflectionText();

    return (
      reflectionTextValue.trim().length > 0 ||
      (current.wins && current.wins.length > 0) ||
      (current.challenges && current.challenges.length > 0) ||
      (current.goals && current.goals.length > 0)
    );
  });

  constructor(
    private storageService: StorageService,
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
    try {
      this.saveStatus.set("saving");

      const current = this.currentReflection();
      const reflectionTextValue = this.reflectionText();

      if (!this.hasContent(current, reflectionTextValue)) {
        this.handleEmptyReflection();
        return;
      }

      const reflection = this.buildReflection(current, reflectionTextValue);
      const reflections = this.storageService.getReflections();
      this.saveOrUpdateReflection(reflections, reflection);
      this.storageService.saveReflections(reflections);
      this.saveStatus.set("saved");
      setTimeout(() => this.saveStatus.set("idle"), 2000);
      console.log("Reflection saved successfully!", reflection);
    } catch (error) {
      this.handleSaveError(error);
    }
  }

  private hasContent(current: Partial<WeeklyReflection>, reflectionTextValue: string): boolean {
    return (
      reflectionTextValue.trim().length > 0 ||
      (!!current.wins && current.wins.length > 0) ||
      (!!current.challenges && current.challenges.length > 0) ||
      (!!current.goals && current.goals.length > 0)
    );
  }

  private handleEmptyReflection(): void {
    this.saveStatus.set("error");
    setTimeout(() => this.saveStatus.set("idle"), 2000);
    console.warn("Cannot save empty reflection. Please add some content.");
  }

  private buildReflection(current: Partial<WeeklyReflection>, reflectionTextValue: string): WeeklyReflection {
    return {
      id: this.generateId(),
      week: this.getCurrentWeek(),
      reflection: reflectionTextValue,
      mood: current.mood || 3,
      energy: current.energy || 3,
      goals: current.goals || [],
      challenges: current.challenges || [],
      wins: current.wins || [],
      createdAt: new Date(),
    };
  }

  private saveOrUpdateReflection(reflections: WeeklyReflection[], reflection: WeeklyReflection): void {
    const existingIndex = reflections.findIndex((r) => r.week === reflection.week);
    if (existingIndex >= 0) {
      reflection.id = reflections[existingIndex].id;
      reflection.createdAt = reflections[existingIndex].createdAt;
      reflections[existingIndex] = reflection;
    } else {
      reflections.push(reflection);
    }
  }

  private handleSaveError(error: unknown): void {
    console.error("Error saving reflection:", error);
    this.saveStatus.set("error");
    setTimeout(() => this.saveStatus.set("idle"), 3000);
  }

  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }
}
