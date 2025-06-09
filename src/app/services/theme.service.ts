import { Injectable, signal, effect } from "@angular/core";
import { StorageService } from "./storage.service";

@Injectable({
  providedIn: "root",
})
export class ThemeService {
  private themeSignal = signal<"light" | "dark" | "auto">("dark");

  theme = this.themeSignal.asReadonly();

  constructor(private storageService: StorageService) {
    // Load saved theme preference
    const settings = this.storageService.getSettings();
    this.themeSignal.set(settings.theme || "dark");

    // Apply theme when it changes
    effect(() => {
      this.applyTheme(this.theme());
    });

    // Listen for system theme changes
    if (window.matchMedia) {
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
      mediaQuery.addEventListener("change", () => {
        if (this.theme() === "auto") {
          this.applyTheme("auto");
        }
      });
    }

    // Initial theme application
    this.applyTheme(this.theme());
  }

  setTheme(theme: "light" | "dark" | "auto"): void {
    this.themeSignal.set(theme);

    // Save to storage
    const settings = this.storageService.getSettings();
    settings.theme = theme;
    this.storageService.saveSettings(settings);
  }

  private applyTheme(theme: "light" | "dark" | "auto"): void {
    const root = document.documentElement;
    const actualTheme = this.resolveTheme(theme);

    // Remove existing theme classes
    root.classList.remove("light-theme", "dark-theme");

    // Add new theme class
    root.classList.add(`${actualTheme}-theme`);

    // Update meta theme color for mobile browsers
    this.updateMetaThemeColor(actualTheme);
  }

  private resolveTheme(theme: "light" | "dark" | "auto"): "light" | "dark" {
    if (theme === "auto") {
      return window.matchMedia &&
        window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
    }
    return theme;
  }

  private updateMetaThemeColor(theme: "light" | "dark"): void {
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      metaThemeColor.setAttribute(
        "content",
        theme === "dark" ? "#1a1611" : "#faf8f3",
      );
    }
  }

  isDark(): boolean {
    return this.resolveTheme(this.theme()) === "dark";
  }

  toggleTheme(): void {
    const currentTheme = this.theme();
    const newTheme = currentTheme === "dark" ? "light" : "dark";
    this.setTheme(newTheme);
  }
}
