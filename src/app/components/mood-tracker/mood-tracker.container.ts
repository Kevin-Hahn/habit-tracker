import { CommonModule } from "@angular/common";
import { Component, computed, signal } from "@angular/core";
import { RouterModule } from "@angular/router";
import { HabitService } from "../../services/habit.service";
import { StorageService } from "../../services/storage.service";
import { MoodTrackerComponent } from "./mood-tracker.component";

interface MoodEntry {
  id: string;
  date: string;
  mood: number;
  energy: number;
  notes?: string;
  createdAt: Date;
}

@Component({
  selector: "app-mood-tracker-container",

  imports: [CommonModule, RouterModule, MoodTrackerComponent],
  template: `
    <app-mood-tracker
      [todayMood]="todayMood()"
      [todayEnergy]="todayEnergy()"
      [recentMoods]="recentMoods()"
      [moodTrend]="moodTrend()"
      [energyTrend]="energyTrend()"
      [moodStats]="moodStats()"
      [energyStats]="energyStats()"
      (updateMood)="updateMood($event)"
      (updateEnergy)="updateEnergy($event)"
      (saveMoodEntry)="saveMoodEntry($event)"
    >
    </app-mood-tracker>
  `,
})
export class MoodTrackerContainerComponent {
  private moodEntries = signal<MoodEntry[]>([]);

  todayMood = signal<number>(3);
  todayEnergy = signal<number>(3);

  recentMoods = computed(() => {
    return this.moodEntries()
      .slice(-7)
      .map((entry) => ({
        date: entry.date,
        mood: entry.mood,
        energy: entry.energy,
      }));
  });

  moodTrend = computed(() => {
    const entries = this.moodEntries().slice(-30);
    return entries.map((entry) => ({
      date: entry.date,
      value: entry.mood,
    }));
  });

  energyTrend = computed(() => {
    const entries = this.moodEntries().slice(-30);
    return entries.map((entry) => ({
      date: entry.date,
      value: entry.energy,
    }));
  });

  moodStats = computed(() => {
    const moods = this.moodEntries().map((e) => e.mood);
    if (moods.length === 0) return { average: 3, highest: 3, lowest: 3 };

    return {
      average:
        Math.round(
          (moods.reduce((sum, mood) => sum + mood, 0) / moods.length) * 10,
        ) / 10,
      highest: Math.max(...moods),
      lowest: Math.min(...moods),
    };
  });

  energyStats = computed(() => {
    const energies = this.moodEntries().map((e) => e.energy);
    if (energies.length === 0) return { average: 3, highest: 3, lowest: 3 };

    return {
      average:
        Math.round(
          (energies.reduce((sum, energy) => sum + energy, 0) /
            energies.length) *
          10,
        ) / 10,
      highest: Math.max(...energies),
      lowest: Math.min(...energies),
    };
  });

  constructor(
    private habitService: HabitService,
    private storageService: StorageService,
  ) {
    this.loadMoodEntries();
    this.loadTodayMoodFromHabits();
  }

  private loadMoodEntries(): void {
    // Load mood entries from storage (we'll store them separately from habit entries)
    const stored =
      this.storageService.getItem<MoodEntry[]>("mood-entries") || [];
    this.moodEntries.set(
      stored.map((entry) => ({
        ...entry,
        createdAt: new Date(entry.createdAt),
      })),
    );

    // Load today's mood if exists
    const today = new Date().toISOString().split("T")[0];
    const todayEntry = stored.find((entry) => entry.date === today);
    if (todayEntry) {
      this.todayMood.set(todayEntry.mood);
      this.todayEnergy.set(todayEntry.energy);
    }
  }

  private loadTodayMoodFromHabits(): void {
    // Also check today's habit entries for mood/energy data
    const todayEntries = this.habitService.todayEntries();
    const entriesWithMood = todayEntries.filter(
      (entry) => entry.mood && entry.energy,
    );

    if (entriesWithMood.length > 0) {
      const avgMood =
        entriesWithMood.reduce((sum, entry) => sum + (entry.mood || 0), 0) /
        entriesWithMood.length;
      const avgEnergy =
        entriesWithMood.reduce((sum, entry) => sum + (entry.energy || 0), 0) /
        entriesWithMood.length;

      this.todayMood.set(Math.round(avgMood));
      this.todayEnergy.set(Math.round(avgEnergy));
    }
  }

  updateMood(mood: number): void {
    this.todayMood.set(mood);
  }

  updateEnergy(energy: number): void {
    this.todayEnergy.set(energy);
  }

  saveMoodEntry(notes?: string): void {
    const today = new Date().toISOString().split("T")[0];
    const entry: MoodEntry = {
      id: this.generateId(),
      date: today,
      mood: this.todayMood(),
      energy: this.todayEnergy(),
      notes,
      createdAt: new Date(),
    };

    const currentEntries = this.moodEntries();
    const existingIndex = currentEntries.findIndex((e) => e.date === today);

    let updatedEntries: MoodEntry[];
    if (existingIndex >= 0) {
      updatedEntries = currentEntries.map((e, i) =>
        i === existingIndex ? entry : e,
      );
    } else {
      updatedEntries = [...currentEntries, entry];
    }

    this.moodEntries.set(updatedEntries);
    this.storageService.setItem("mood-entries", updatedEntries);

    // Also update today's habit entries with this mood/energy
    this.updateHabitsWithMoodEnergy();
  }

  private updateHabitsWithMoodEnergy(): void {
    const todayEntries = this.habitService.todayEntries();
    const mood = this.todayMood();
    const energy = this.todayEnergy();

    todayEntries.forEach((entry) => {
      if (entry.completed) {
        this.habitService.updateEntry(entry.id, { mood, energy });
      }
    });
  }

  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }
}
