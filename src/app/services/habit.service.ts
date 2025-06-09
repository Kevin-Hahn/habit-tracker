import { Injectable, computed, signal } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import { StorageService } from "./storage.service";
import { Habit, HabitEntry, HabitStats } from "../models/habit.model";

@Injectable({
  providedIn: "root",
})
export class HabitService {
  // Signals for reactive state
  private habitsSignal = signal<Habit[]>([]);
  private entriesSignal = signal<HabitEntry[]>([]);

  // Public readonly signals
  habits = this.habitsSignal.asReadonly();
  entries = this.entriesSignal.asReadonly();

  // Computed values
  activeHabits = computed(() =>
    this.habits().filter((habit) => habit.isActive),
  );

  todayEntries = computed(() => {
    const today = new Date().toISOString().split("T")[0];
    return this.entries().filter((entry) => entry.date === today);
  });

  constructor(private storageService: StorageService) {
    this.loadData();
  }

  private loadData(): void {
    const habits = this.storageService.getHabits().map(this.parseHabitDates);
    const entries = this.storageService.getEntries().map(this.parseEntryDates);

    this.habitsSignal.set(habits);
    this.entriesSignal.set(entries);
  }

  private parseHabitDates(habit: any): Habit {
    return {
      ...habit,
      createdAt: new Date(habit.createdAt),
    };
  }

  private parseEntryDates(entry: any): HabitEntry {
    return {
      ...entry,
      completedAt: entry.completedAt ? new Date(entry.completedAt) : undefined,
    };
  }

  // Habit CRUD operations
  createHabit(habitData: Omit<Habit, "id" | "createdAt">): Habit {
    const habit: Habit = {
      ...habitData,
      id: this.generateId(),
      createdAt: new Date(),
    };

    const currentHabits = this.habits();
    const updatedHabits = [...currentHabits, habit];

    this.habitsSignal.set(updatedHabits);
    this.storageService.saveHabits(updatedHabits);

    return habit;
  }

  updateHabit(id: string, updates: Partial<Habit>): void {
    const currentHabits = this.habits();
    const updatedHabits = currentHabits.map((habit) =>
      habit.id === id ? { ...habit, ...updates } : habit,
    );

    this.habitsSignal.set(updatedHabits);
    this.storageService.saveHabits(updatedHabits);
  }

  deleteHabit(id: string): void {
    const updatedHabits = this.habits().filter((habit) => habit.id !== id);
    const updatedEntries = this.entries().filter(
      (entry) => entry.habitId !== id,
    );

    this.habitsSignal.set(updatedHabits);
    this.entriesSignal.set(updatedEntries);
    this.storageService.saveHabits(updatedHabits);
    this.storageService.saveEntries(updatedEntries);
  }

  // Entry operations
  toggleHabitCompletion(
    habitId: string,
    date: string = new Date().toISOString().split("T")[0],
  ): void {
    const currentEntries = this.entries();
    const existingEntry = currentEntries.find(
      (entry) => entry.habitId === habitId && entry.date === date,
    );

    if (existingEntry) {
      const updatedEntries = currentEntries.map((entry) =>
        entry.id === existingEntry.id
          ? {
              ...entry,
              completed: !entry.completed,
              completedAt: !entry.completed ? new Date() : undefined,
              count: !entry.completed
                ? entry.count + 1
                : Math.max(0, entry.count - 1),
            }
          : entry,
      );
      this.entriesSignal.set(updatedEntries);
    } else {
      const newEntry: HabitEntry = {
        id: this.generateId(),
        habitId,
        date,
        completed: true,
        count: 1,
        completedAt: new Date(),
      };
      const updatedEntries = [...currentEntries, newEntry];
      this.entriesSignal.set(updatedEntries);
    }

    this.storageService.saveEntries(this.entries());
  }

  updateEntry(entryId: string, updates: Partial<HabitEntry>): void {
    const currentEntries = this.entries();
    const updatedEntries = currentEntries.map((entry) =>
      entry.id === entryId ? { ...entry, ...updates } : entry,
    );

    this.entriesSignal.set(updatedEntries);
    this.storageService.saveEntries(updatedEntries);
  }

  // Statistics
  getHabitStats(habitId: string): HabitStats {
    const entries = this.entries().filter(
      (entry) => entry.habitId === habitId && entry.completed,
    );

    const currentStreak = this.calculateCurrentStreak(habitId);
    const longestStreak = this.calculateLongestStreak(habitId);
    const totalCompleted = entries.length;

    // Calculate completion rate for last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const recentEntries = entries.filter(
      (entry) => new Date(entry.date) >= thirtyDaysAgo,
    );
    const completionRate = recentEntries.length / 30;

    // Weekly progress (current week)
    const startOfWeek = this.getStartOfWeek();
    const weekEntries = entries.filter(
      (entry) => new Date(entry.date) >= startOfWeek,
    );
    const weeklyProgress = weekEntries.length / 7;

    // Monthly progress (current month)
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    const monthEntries = entries.filter(
      (entry) => new Date(entry.date) >= startOfMonth,
    );
    const daysInMonth = new Date(
      startOfMonth.getFullYear(),
      startOfMonth.getMonth() + 1,
      0,
    ).getDate();
    const monthlyProgress = monthEntries.length / daysInMonth;

    return {
      habitId,
      currentStreak,
      longestStreak,
      totalCompleted,
      completionRate,
      weeklyProgress,
      monthlyProgress,
    };
  }

  private calculateCurrentStreak(habitId: string): number {
    const entries = this.entries()
      .filter((entry) => entry.habitId === habitId && entry.completed)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    if (entries.length === 0) return 0;

    let streak = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (let i = 0; i < entries.length; i++) {
      const entryDate = new Date(entries[i].date);
      entryDate.setHours(0, 0, 0, 0);

      const expectedDate = new Date(today);
      expectedDate.setDate(today.getDate() - i);

      if (entryDate.getTime() === expectedDate.getTime()) {
        streak++;
      } else {
        break;
      }
    }

    return streak;
  }

  private calculateLongestStreak(habitId: string): number {
    const entries = this.entries()
      .filter((entry) => entry.habitId === habitId && entry.completed)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    if (entries.length === 0) return 0;

    let longestStreak = 1;
    let currentStreak = 1;

    for (let i = 1; i < entries.length; i++) {
      const prevDate = new Date(entries[i - 1].date);
      const currDate = new Date(entries[i].date);

      const dayDiff = Math.floor(
        (currDate.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24),
      );

      if (dayDiff === 1) {
        currentStreak++;
        longestStreak = Math.max(longestStreak, currentStreak);
      } else {
        currentStreak = 1;
      }
    }

    return longestStreak;
  }

  private getStartOfWeek(): Date {
    const today = new Date();
    const dayOfWeek = today.getDay();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - dayOfWeek + 1); // Monday
    startOfWeek.setHours(0, 0, 0, 0);
    return startOfWeek;
  }

  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  // Utility methods
  getHabitById(id: string): Habit | undefined {
    return this.habits().find((habit) => habit.id === id);
  }

  getEntriesForDate(date: string): HabitEntry[] {
    return this.entries().filter((entry) => entry.date === date);
  }

  getEntriesForHabit(habitId: string): HabitEntry[] {
    return this.entries().filter((entry) => entry.habitId === habitId);
  }

  // Habit templates for quick creation
  getHabitTemplates(): Partial<Habit>[] {
    return [
      {
        name: "Morning Exercise",
        description: "30 minutes of physical activity",
        frequency: { type: "daily" },
        category: "Health",
        color: "#4ade80",
        tags: ["health", "fitness"],
        targetCount: 1,
      },
      {
        name: "Read for 30 min",
        description: "Daily reading habit",
        frequency: { type: "daily" },
        category: "Learning",
        color: "#60a5fa",
        tags: ["learning", "books"],
        targetCount: 1,
      },
      {
        name: "Journal",
        description: "Reflect and write thoughts",
        frequency: { type: "daily" },
        category: "Personal",
        color: "#a78bfa",
        tags: ["reflection", "writing"],
        targetCount: 1,
      },
      {
        name: "Drink Water",
        description: "8 glasses of water",
        frequency: { type: "daily" },
        category: "Health",
        color: "#06b6d4",
        tags: ["health", "hydration"],
        targetCount: 8,
      },
    ];
  }
}
