import {
  Component,
  signal,
  computed,
  Input,
  Output,
  EventEmitter,
} from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { HabitService } from "../../services/habit.service";
import { Habit, HabitFrequency } from "../../models/habit.model";

interface HabitFormData {
  name: string;
  description: string;
  frequency: HabitFrequency;
  category: string;
  color: string;
  tags: string[];
  targetCount: number;
}

@Component({
  selector: "app-habit-form",
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="habit-form-overlay" (click)="onOverlayClick($event)">
      <div class="habit-form-container" (click)="$event.stopPropagation()">
        <div class="form-header">
          <h2 class="form-title">
            {{ editingHabit ? "Edit" : "Create New" }} Habit
          </h2>
          <button
            class="close-button"
            (click)="onClose()"
            aria-label="Close form"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form class="habit-form" (ngSubmit)="onSubmit()">
          <!-- Quick Templates -->
          @if (!editingHabit) {
            <div class="form-section">
              <label class="section-label">Quick Start</label>
              <div class="templates-grid">
                @for (template of templates; track template.name) {
                  <button
                    type="button"
                    class="template-card"
                    (click)="applyTemplate(template)"
                  >
                    <div
                      class="template-color"
                      [style.background-color]="template.color"
                    ></div>
                    <div class="template-info">
                      <div class="template-name">{{ template.name }}</div>
                      <div class="template-category">
                        {{ template.category }}
                      </div>
                    </div>
                  </button>
                }
              </div>
            </div>
          }

          <!-- Basic Info -->
          <div class="form-section">
            <label class="section-label">Basic Information</label>

            <div class="form-group">
              <label for="habit-name" class="form-label">Habit Name *</label>
              <input
                id="habit-name"
                type="text"
                class="form-input"
                [(ngModel)]="formData.name"
                name="name"
                placeholder="e.g., Morning Exercise"
                required
                maxlength="50"
              />
            </div>

            <div class="form-group">
              <label for="habit-description" class="form-label"
                >Description</label
              >
              <textarea
                id="habit-description"
                class="form-textarea"
                [(ngModel)]="formData().description"
                name="description"
                placeholder="Optional details about your habit..."
                rows="3"
                maxlength="200"
              ></textarea>
            </div>
          </div>

          <!-- Frequency -->
          <div class="form-section">
            <label class="section-label">Frequency</label>

            <div class="frequency-tabs">
              <button
                type="button"
                class="frequency-tab"
                [class.active]="formData().frequency.type === 'daily'"
                (click)="setFrequencyType('daily')"
              >
                Daily
              </button>
              <button
                type="button"
                class="frequency-tab"
                [class.active]="formData.frequency.type === 'weekly'"
                (click)="setFrequencyType('weekly')"
              >
                Weekly
              </button>
              <button
                type="button"
                class="frequency-tab"
                [class.active]="formData.frequency.type === 'custom'"
                (click)="setFrequencyType('custom')"
              >
                Custom
              </button>
            </div>

            @if (formData.frequency.type === "weekly") {
              <div class="form-group">
                <label class="form-label">Times per week</label>
                <div class="number-input-container">
                  <button
                    type="button"
                    class="number-button"
                    (click)="adjustTimesPerWeek(-1)"
                    [disabled]="formData.frequency.timesPerWeek <= 1"
                  >
                    -
                  </button>
                  <input
                    type="number"
                    class="number-input"
                    [(ngModel)]="formData.frequency.timesPerWeek"
                    name="timesPerWeek"
                    min="1"
                    max="7"
                  />
                  <button
                    type="button"
                    class="number-button"
                    (click)="adjustTimesPerWeek(1)"
                    [disabled]="formData.frequency.timesPerWeek >= 7"
                  >
                    +
                  </button>
                </div>
              </div>
            }

            @if (formData.frequency.type === "custom") {
              <div class="form-group">
                <label class="form-label">Select days</label>
                <div class="days-grid">
                  @for (day of weekDays; track day.value; let i = $index) {
                    <button
                      type="button"
                      class="day-button"
                      [class.selected]="isDaySelected(day.value)"
                      (click)="toggleDay(day.value)"
                    >
                      {{ day.short }}
                    </button>
                  }
                </div>
              </div>
            }
          </div>

          <!-- Category & Color -->
          <div class="form-section">
            <label class="section-label">Category & Color</label>

            <div class="form-row">
              <div class="form-group flex-1">
                <label for="habit-category" class="form-label">Category</label>
                <select
                  id="habit-category"
                  class="form-select"
                  [(ngModel)]="formData.category"
                  name="category"
                >
                  @for (category of categories; track category) {
                    <option [value]="category">{{ category }}</option>
                  }
                </select>
              </div>

              <div class="form-group">
                <label class="form-label">Color</label>
                <div class="color-picker">
                  @for (color of colors; track color) {
                    <button
                      type="button"
                      class="color-option"
                      [class.selected]="formData.color === color"
                      [style.background-color]="color"
                      (click)="formData.color = color"
                      [attr.aria-label]="'Select color ' + color"
                    ></button>
                  }
                </div>
              </div>
            </div>
          </div>

          <!-- Target Count -->
          @if (formData.frequency.type === "daily") {
            <div class="form-section">
              <label class="section-label">Target Count</label>
              <div class="form-group">
                <label class="form-label">How many times per day?</label>
                <div class="number-input-container">
                  <button
                    type="button"
                    class="number-button"
                    (click)="adjustTargetCount(-1)"
                    [disabled]="formData.targetCount <= 1"
                  >
                    -
                  </button>
                  <input
                    type="number"
                    class="number-input"
                    [(ngModel)]="formData.targetCount"
                    name="targetCount"
                    min="1"
                    max="10"
                  />
                  <button
                    type="button"
                    class="number-button"
                    (click)="adjustTargetCount(1)"
                    [disabled]="formData.targetCount >= 10"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
          }

          <!-- Tags -->
          <div class="form-section">
            <label class="section-label">Tags</label>
            <div class="form-group">
              <input
                type="text"
                class="form-input"
                placeholder="Add a tag and press Enter"
                (keydown.enter)="addTag($event)"
                #tagInput
              />

              @if (formData.tags.length > 0) {
                <div class="tags-list">
                  @for (tag of formData.tags; track tag; let i = $index) {
                    <span class="tag">
                      {{ tag }}
                      <button
                        type="button"
                        class="tag-remove"
                        (click)="removeTag(i)"
                        aria-label="Remove tag"
                      >
                        ×
                      </button>
                    </span>
                  }
                </div>
              }
            </div>
          </div>

          <!-- Form Actions -->
          <div class="form-actions">
            <button type="button" class="button-secondary" (click)="onClose()">
              Cancel
            </button>
            <button
              type="submit"
              class="button-primary"
              [disabled]="!isFormValid()"
            >
              {{ editingHabit ? "Update" : "Create" }} Habit
            </button>
          </div>
        </form>
      </div>
    </div>
  `,
  styleUrls: ["./habit-form.component.css"],
})
export class HabitFormComponent {
  @Input() editingHabit: Habit | null = null;
  @Output() close = new EventEmitter<void>();
  @Output() habitCreated = new EventEmitter<Habit>();
  @Output() habitUpdated = new EventEmitter<Habit>();

  formData = signal<HabitFormData>({
    name: "",
    description: "",
    frequency: { type: "daily" },
    category: "Health",
    color: "#4ade80",
    tags: [],
    targetCount: 1,
  });

  templates!: ReturnType<typeof this.habitService.getHabitTemplates>;

  categories = [
    "Health",
    "Learning",
    "Personal",
    "Work",
    "Social",
    "Creative",
    "Spiritual",
    "Other",
  ];

  colors = [
    "#4ade80",
    "#60a5fa",
    "#a78bfa",
    "#f472b6",
    "#fb7185",
    "#f59e0b",
    "#10b981",
    "#3b82f6",
    "#8b5cf6",
    "#ec4899",
    "#ef4444",
    "#f97316",
    "#06b6d4",
    "#84cc16",
    "#6366f1",
    "#d946ef",
    "#ff6b6b",
    "#ffd93d",
  ];

  weekDays = [
    { value: 1, short: "Mon", full: "Monday" },
    { value: 2, short: "Tue", full: "Tuesday" },
    { value: 3, short: "Wed", full: "Wednesday" },
    { value: 4, short: "Thu", full: "Thursday" },
    { value: 5, short: "Fri", full: "Friday" },
    { value: 6, short: "Sat", full: "Saturday" },
    { value: 0, short: "Sun", full: "Sunday" },
  ];

  constructor(private habitService: HabitService) {
    this.templates = this.habitService.getHabitTemplates();

    // Initialize form data if editing
    if (this.editingHabit) {
      this.formData.set({
        name: this.editingHabit.name,
        description: this.editingHabit.description || "",
        frequency: { ...this.editingHabit.frequency },
        category: this.editingHabit.category,
        color: this.editingHabit.color,
        tags: [...this.editingHabit.tags],
        targetCount: this.editingHabit.targetCount,
      });
    }
  }

  applyTemplate(template: Partial<Habit>): void {
    this.formData.update((current) => ({
      ...current,
      name: template.name || "",
      description: template.description || "",
      frequency: template.frequency || { type: "daily" },
      category: template.category || "Health",
      color: template.color || "#4ade80",
      tags: template.tags ? [...template.tags] : [],
      targetCount: template.targetCount || 1,
    }));
  }

  setFrequencyType(type: "daily" | "weekly" | "custom"): void {
    this.formData.update((current) => ({
      ...current,
      frequency: {
        type,
        timesPerWeek: type === "weekly" ? 3 : undefined,
        daysOfWeek: type === "custom" ? [] : undefined,
      },
    }));
  }

  adjustTimesPerWeek(delta: number): void {
    this.formData.update((current) => ({
      ...current,
      frequency: {
        ...current.frequency,
        timesPerWeek: Math.max(
          1,
          Math.min(7, (current.frequency.timesPerWeek || 3) + delta),
        ),
      },
    }));
  }

  adjustTargetCount(delta: number): void {
    this.formData.update((current) => ({
      ...current,
      targetCount: Math.max(1, Math.min(10, current.targetCount + delta)),
    }));
  }

  isDaySelected(day: number): boolean {
    return this.formData().frequency.daysOfWeek?.includes(day) || false;
  }

  toggleDay(day: number): void {
    this.formData.update((current) => {
      const daysOfWeek = current.frequency.daysOfWeek || [];
      const newDays = daysOfWeek.includes(day)
        ? daysOfWeek.filter((d) => d !== day)
        : [...daysOfWeek, day];

      return {
        ...current,
        frequency: {
          ...current.frequency,
          daysOfWeek: newDays,
        },
      };
    });
  }

  addTag(event: Event): void {
    event.preventDefault();
    const input = event.target as HTMLInputElement;
    const tag = input.value.trim().toLowerCase();

    if (tag && !this.formData().tags.includes(tag)) {
      this.formData.update((current) => ({
        ...current,
        tags: [...current.tags, tag],
      }));
      input.value = "";
    }
  }

  removeTag(index: number): void {
    this.formData.update((current) => ({
      ...current,
      tags: current.tags.filter((_, i) => i !== index),
    }));
  }

  isFormValid(): boolean {
    const data = this.formData();
    const hasName = data.name.trim().length > 0;
    const hasValidFrequency =
      data.frequency.type === "daily" ||
      (data.frequency.type === "weekly" && data.frequency.timesPerWeek! > 0) ||
      (data.frequency.type === "custom" &&
        data.frequency.daysOfWeek!.length > 0);

    return hasName && hasValidFrequency;
  }

  onSubmit(): void {
    if (!this.isFormValid()) return;

    const data = this.formData();
    const habitData = {
      name: data.name.trim(),
      description: data.description.trim(),
      frequency: data.frequency,
      category: data.category,
      color: data.color,
      tags: data.tags,
      targetCount: data.targetCount,
      isActive: true,
    };

    if (this.editingHabit) {
      this.habitService.updateHabit(this.editingHabit.id, habitData);
      this.habitUpdated.emit({ ...this.editingHabit, ...habitData });
    } else {
      const newHabit = this.habitService.createHabit(habitData);
      this.habitCreated.emit(newHabit);
    }

    this.onClose();
  }

  onClose(): void {
    this.close.emit();
  }

  onOverlayClick(event: Event): void {
    if (event.target === event.currentTarget) {
      this.onClose();
    }
  }
}
