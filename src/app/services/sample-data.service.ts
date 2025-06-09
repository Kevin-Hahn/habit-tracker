import { Injectable } from "@angular/core";
import { HabitService } from "./habit.service";
import { StorageService } from "./storage.service";
import { Habit, HabitEntry } from "../models/habit.model";
import { HABIT_CATEGORIES, HABIT_COLORS } from "../constants/habit.constants";

@Injectable({
  providedIn: "root",
})
export class SampleDataService {
  constructor(
    private habitService: HabitService,
    private storageService: StorageService,
  ) {}

  initializeSampleData(): void {
    // Only initialize if no habits exist
    const existingHabits = this.storageService.getHabits();
    if (existingHabits.length > 0) {
      return;
    }

    console.log("Initializing sample data...");

    // Create sample habits
    const sampleHabits = [
      {
        name: "Morning Exercise",
        description: "30 minutes of physical activity to start the day",
        frequency: { type: "daily" as const },
        category: HABIT_CATEGORIES[0], // 'Health'
        color: HABIT_COLORS[0], // '#059669'
        tags: ["health", "fitness", "morning"],
        targetCount: 1,
        isActive: true,
      },
      {
        name: "Read for 30 min",
        description: "Daily reading habit for personal growth",
        frequency: { type: "daily" as const },
        category: HABIT_CATEGORIES[1], // 'Learning'
        color: HABIT_COLORS[1], // '#16a34a'
        tags: ["learning", "books", "growth"],
        targetCount: 1,
        isActive: true,
      },
      {
        name: "Drink Water",
        description: "Stay hydrated throughout the day",
        frequency: { type: "daily" as const },
        category: HABIT_CATEGORIES[0], // 'Health'
        color: HABIT_COLORS[12], // '#0891b2'
        tags: ["health", "hydration"],
        targetCount: 8,
        isActive: true,
      },
      {
        name: "Journal",
        description: "Reflect and write down thoughts",
        frequency: { type: "daily" as const },
        category: HABIT_CATEGORIES[2], // 'Personal'
        color: HABIT_COLORS[6], // '#ca8a04'
        tags: ["reflection", "writing", "mindfulness"],
        targetCount: 1,
        isActive: true,
      },
      {
        name: "Meditation",
        description: "10-15 minutes of mindfulness practice",
        frequency: { type: "daily" as const },
        category: HABIT_CATEGORIES[6], // 'Spiritual'
        color: HABIT_COLORS[7], // '#d97706'
        tags: ["mindfulness", "mental-health", "peace"],
        targetCount: 1,
        isActive: true,
      },
      {
        name: "Practice Coding",
        description: "Work on programming skills and projects",
        frequency: { type: "weekly" as const, timesPerWeek: 5 },
        category: HABIT_CATEGORIES[1], // 'Learning'
        color: HABIT_COLORS[2], // '#22c55e'
        tags: ["coding", "skills", "career"],
        targetCount: 1,
        isActive: true,
      },
      {
        name: "Call Family",
        description: "Stay connected with family members",
        frequency: { type: "weekly" as const, timesPerWeek: 2 },
        category: HABIT_CATEGORIES[4], // 'Social'
        color: HABIT_COLORS[8], // '#ea580c'
        tags: ["family", "relationships", "connection"],
        targetCount: 1,
        isActive: true,
      },
    ];

    // Create the habits
    const createdHabits: Habit[] = [];
    sampleHabits.forEach((habitData) => {
      const habit = this.habitService.createHabit(habitData);
      createdHabits.push(habit);
    });

    // Create sample entries for the last 30 days to show some history
    this.createSampleEntries(createdHabits);

    console.log("Sample data initialized successfully!");
  }

  private createSampleEntries(habits: Habit[]): void {
    const entries: HabitEntry[] = [];
    const today = new Date();

    // Generate entries for the last 30 days
    for (let i = 0; i < 30; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      const dateStr = date.toISOString().split("T")[0];

      habits.forEach((habit) => {
        // Create entries with varying completion rates to make it realistic
        const completionProbability = this.getCompletionProbability(habit, i);

        if (Math.random() < completionProbability) {
          const entry: HabitEntry = {
            id: this.generateId(),
            habitId: habit.id,
            date: dateStr,
            completed: true,
            count: 1,
            mood: this.getRandomMood(),
            energy: this.getRandomEnergy(),
            notes: this.getRandomNote(habit.name),
            completedAt: new Date(
              date.getTime() + Math.random() * 24 * 60 * 60 * 1000,
            ), // Random time during the day
          };
          entries.push(entry);
        }
      });
    }

    // Save the sample entries
    this.storageService.saveEntries(entries);
  }

  private getCompletionProbability(habit: Habit, daysAgo: number): number {
    // Base probability based on habit type
    let baseProbability = 0.7;

    // Adjust based on category
    switch (habit.category) {
      case "Health":
        baseProbability = 0.8; // Health habits tend to be more consistent
        break;
      case "Learning":
        baseProbability = 0.65;
        break;
      case "Personal":
        baseProbability = 0.75;
        break;
      case "Social":
        baseProbability = 0.6;
        break;
      case "Spiritual":
        baseProbability = 0.7;
        break;
    }

    // Reduce probability for older dates (people are less consistent over time)
    const timeFactor = Math.max(0.3, 1 - daysAgo * 0.02);

    // Add some weekly patterns (slightly lower on weekends for work-related habits)
    const dayOfWeek = (new Date().getDay() - daysAgo) % 7;
    const weekendFactor =
      (dayOfWeek === 0 || dayOfWeek === 6) && habit.category === "Learning"
        ? 0.8
        : 1;

    return baseProbability * timeFactor * weekendFactor;
  }

  private getRandomMood(): number {
    // Weighted random mood (more likely to be positive)
    const rand = Math.random();
    if (rand < 0.1) return 1; // 10% very low
    if (rand < 0.2) return 2; // 10% low
    if (rand < 0.4) return 3; // 20% neutral
    if (rand < 0.7) return 4; // 30% good
    return 5; // 30% excellent
  }

  private getRandomEnergy(): number {
    // Similar distribution for energy
    const rand = Math.random();
    if (rand < 0.1) return 1; // 10% drained
    if (rand < 0.25) return 2; // 15% low
    if (rand < 0.5) return 3; // 25% moderate
    if (rand < 0.8) return 4; // 30% high
    return 5; // 20% energized
  }

  private getRandomNote(habitName: string): string | undefined {
    // Only add notes occasionally
    if (Math.random() > 0.3) return undefined;

    const notes = [
      "Felt great today!",
      "Struggled a bit but pushed through",
      "Really enjoying this habit",
      "Quick session but effective",
      "Best session this week",
      "Feeling motivated",
      "Challenging but rewarding",
      "Making good progress",
      "Felt energized after",
      "Short but sweet",
    ];

    return notes[Math.floor(Math.random() * notes.length)];
  }

  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  // Method to reset all data and reinitialize
  resetToSampleData(): void {
    this.storageService.clearAllData();
    this.initializeSampleData();
  }
}
