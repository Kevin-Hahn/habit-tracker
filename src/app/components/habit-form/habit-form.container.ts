import { CommonModule } from "@angular/common";
import { Component, EventEmitter, Input, Output, signal } from "@angular/core";
import { Habit, HabitFrequency } from "../../models/habit.model";
import { HabitService } from "../../services/habit.service";
import { HabitFormComponent } from "./habit-form.component";

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
  selector: "app-habit-form-container",
  standalone: true,
  imports: [CommonModule, HabitFormComponent],
  template: `
    <app-habit-form
      [formData]="formData()"
      [templates]="templates"
      [editingHabit]="editingHabit"
      (updateFormData)="updateFormData($event)"
      (submit)="onSubmit()"
      (close)="onClose()"
    >
    </app-habit-form>
  `,
})
export class HabitFormContainerComponent {
  @Input() set editingHabit(habit: Habit | null) {
    if (habit) {
      this.formData.set({
        name: habit.name,
        description: habit.description || "",
        frequency: { ...habit.frequency },
        category: habit.category,
        color: habit.color,
        tags: [...habit.tags],
        targetCount: habit.targetCount,
      });
    } else {
      this.formData.set({
        name: "",
        description: "",
        frequency: { type: "daily" },
        category: "Health",
        color: "#4ade80",
        tags: [],
        targetCount: 1,
      });
    }
    this._editingHabit = habit;
  }
  private _editingHabit: Habit | null = null;
  get editingHabit(): Habit | null {
    return this._editingHabit;
  }

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

  templates: ReturnType<typeof HabitService.prototype.getHabitTemplates> = [];

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

  updateFormData(updates: Partial<HabitFormData>): void {
    this.formData.update((current) => ({
      ...current,
      ...updates,
    }));
  }

  isFormValid(): boolean {
    const data = this.formData();
    const hasName = data.name.trim().length > 0;
    const hasValidFrequency =
      data.frequency.type === "daily" ||
      (data.frequency.type === "weekly" &&
        (data.frequency.timesPerWeek || 0) > 0) ||
      (data.frequency.type === "custom" &&
        (data.frequency.daysOfWeek?.length || 0) > 0);

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
}
