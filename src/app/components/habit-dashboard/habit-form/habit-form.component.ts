import { CommonModule } from "@angular/common";
import { Component, EventEmitter, Input, Output } from "@angular/core";
import { FormsModule } from "@angular/forms";
import {
  HABIT_CATEGORIES,
  HABIT_COLORS,
  WEEK_DAYS,
} from "../../../constants/habit.constants";
import { Habit, HabitFrequency } from "../../../models/habit.model";

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
  imports: [CommonModule, FormsModule],
  templateUrl: "./habit-form.component.html",
  styleUrls: ["./habit-form.component.css"],
})
export class HabitFormComponent {
  @Input() formData!: HabitFormData;
  @Input() templates: Partial<Habit>[] = [];
  @Input() editingHabit: Habit | null = null;

  @Output() updateFormData = new EventEmitter<Partial<HabitFormData>>();
  @Output() submit = new EventEmitter<void>();
  @Output() close = new EventEmitter<void>();

  categories = HABIT_CATEGORIES;
  colors = HABIT_COLORS;
  weekDays = WEEK_DAYS;

  updateField<K extends keyof HabitFormData>(
    field: K,
    value: HabitFormData[K],
  ): void {
    this.updateFormData.emit({ [field]: value });
  }

  updateFrequencyField<K extends keyof HabitFrequency>(
    field: K,
    value: HabitFrequency[K],
  ): void {
    this.updateFormData.emit({
      frequency: {
        ...this.formData.frequency,
        [field]: value,
      },
    });
  }

  applyTemplate(template: Partial<Habit>): void {
    this.updateFormData.emit({
      name: template.name || "",
      description: template.description || "",
      frequency: template.frequency || { type: "daily" },
      category: template.category || "Health",
      color: template.color || "#4ade80",
      tags: template.tags ? [...template.tags] : [],
      targetCount: template.targetCount || 1,
    });
  }

  setFrequencyType(type: "daily" | "weekly" | "custom"): void {
    this.updateFormData.emit({
      frequency: {
        type,
        timesPerWeek: type === "weekly" ? 3 : undefined,
        daysOfWeek: type === "custom" ? [] : undefined,
      },
    });
  }

  adjustTimesPerWeek(delta: number): void {
    const current = this.formData.frequency.timesPerWeek || 3;
    this.updateFrequencyField(
      "timesPerWeek",
      Math.max(1, Math.min(7, current + delta)),
    );
  }

  adjustTargetCount(delta: number): void {
    this.updateField(
      "targetCount",
      Math.max(1, Math.min(10, this.formData.targetCount + delta)),
    );
  }

  isDaySelected(day: number): boolean {
    return this.formData.frequency.daysOfWeek?.includes(day) || false;
  }

  toggleDay(day: number): void {
    const daysOfWeek = this.formData.frequency.daysOfWeek || [];
    const newDays = daysOfWeek.includes(day)
      ? daysOfWeek.filter((d) => d !== day)
      : [...daysOfWeek, day];

    this.updateFrequencyField("daysOfWeek", newDays);
  }

  addTag(event: Event): void {
    event.preventDefault();
    const input = event.target as HTMLInputElement;
    const tag = input.value.trim().toLowerCase();

    if (tag && !this.formData.tags.includes(tag)) {
      this.updateField("tags", [...this.formData.tags, tag]);
      input.value = "";
    }
  }

  removeTag(index: number): void {
    this.updateField(
      "tags",
      this.formData.tags.filter((_, i) => i !== index),
    );
  }

  isFormValid(): boolean {
    const hasName = this.formData.name.trim().length > 0;
    const hasValidFrequency =
      this.formData.frequency.type === "daily" ||
      (this.formData.frequency.type === "weekly" &&
        (this.formData.frequency.timesPerWeek || 0) > 0) ||
      (this.formData.frequency.type === "custom" &&
        (this.formData.frequency.daysOfWeek?.length || 0) > 0);

    return hasName && hasValidFrequency;
  }

  onOverlayClick(event: Event): void {
    if (event.target === event.currentTarget) {
      this.close.emit();
    }
  }
}
