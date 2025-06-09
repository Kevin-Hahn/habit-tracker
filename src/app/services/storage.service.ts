import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class StorageService {
  private readonly STORAGE_KEYS = {
    HABITS: "habit-tracker-habits",
    ENTRIES: "habit-tracker-entries",
    SETTINGS: "habit-tracker-settings",
    REFLECTIONS: "habit-tracker-reflections",
  };

  // Storage change notifications
  private storageChange$ = new BehaviorSubject<{ key: string; data: any }>({
    key: "",
    data: null,
  });

  constructor() {
    // Listen for storage changes across tabs
    window.addEventListener("storage", (e) => {
      if (e.key && e.key.startsWith("habit-tracker-") && e.newValue) {
        try {
          const data = JSON.parse(e.newValue);
          this.storageChange$.next({ key: e.key, data });
        } catch (error) {
          console.error("Error parsing storage data:", error);
        }
      }
    });
  }

  // Generic storage methods
  setItem<T>(key: string, data: T): void {
    try {
      const serialized = JSON.stringify(data);
      localStorage.setItem(key, serialized);
      this.storageChange$.next({ key, data });
    } catch (error) {
      console.error("Error saving to localStorage:", error);
    }
  }

  getItem<T>(key: string): T | null {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error("Error reading from localStorage:", error);
      return null;
    }
  }

  removeItem(key: string): void {
    localStorage.removeItem(key);
    this.storageChange$.next({ key, data: null });
  }

  // Specific storage methods
  saveHabits(habits: any[]): void {
    this.setItem(this.STORAGE_KEYS.HABITS, habits);
  }

  getHabits(): any[] {
    return this.getItem(this.STORAGE_KEYS.HABITS) || [];
  }

  saveEntries(entries: any[]): void {
    this.setItem(this.STORAGE_KEYS.ENTRIES, entries);
  }

  getEntries(): any[] {
    return this.getItem(this.STORAGE_KEYS.ENTRIES) || [];
  }

  saveSettings(settings: any): void {
    this.setItem(this.STORAGE_KEYS.SETTINGS, settings);
  }

  getSettings(): any {
    return (
      this.getItem(this.STORAGE_KEYS.SETTINGS) || this.getDefaultSettings()
    );
  }

  saveReflections(reflections: any[]): void {
    this.setItem(this.STORAGE_KEYS.REFLECTIONS, reflections);
  }

  getReflections(): any[] {
    return this.getItem(this.STORAGE_KEYS.REFLECTIONS) || [];
  }

  // Storage change observable
  onStorageChange(): Observable<{ key: string; data: any }> {
    return this.storageChange$.asObservable();
  }

  // Clear all data
  clearAllData(): void {
    Object.values(this.STORAGE_KEYS).forEach((key) => {
      this.removeItem(key);
    });
  }

  // Export data for backup
  exportData(): string {
    const data = {
      habits: this.getHabits(),
      entries: this.getEntries(),
      settings: this.getSettings(),
      reflections: this.getReflections(),
      exportDate: new Date().toISOString(),
    };
    return JSON.stringify(data, null, 2);
  }

  // Import data from backup
  importData(jsonData: string): boolean {
    try {
      const data = JSON.parse(jsonData);

      if (data.habits) this.saveHabits(data.habits);
      if (data.entries) this.saveEntries(data.entries);
      if (data.settings) this.saveSettings(data.settings);
      if (data.reflections) this.saveReflections(data.reflections);

      return true;
    } catch (error) {
      console.error("Error importing data:", error);
      return false;
    }
  }

  private getDefaultSettings(): any {
    return {
      theme: "dark",
      notifications: {
        enabled: true,
        reminderTime: "09:00",
        soundEnabled: true,
      },
      layout: "card",
      startOfWeek: 1, // Monday
    };
  }
}
