import { CommonModule } from "@angular/common";
import { Component, EventEmitter, Input, Output } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { ENERGY_LEVELS, MOOD_OPTIONS } from "../../constants/habit.constants";

interface MoodStats {
  average: number;
  highest: number;
  lowest: number;
}

interface TrendData {
  date: string;
  value: number;
}

interface RecentMood {
  date: string;
  mood: number;
  energy: number;
}

@Component({
  selector: "app-mood-tracker",

  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: "./mood-tracker.component.html",
  styleUrls: ["./mood-tracker.component.css"],
})
export class MoodTrackerComponent {
  @Input() todayMood!: number;
  @Input() todayEnergy!: number;
  @Input() recentMoods!: RecentMood[];
  @Input() moodTrend!: TrendData[];
  @Input() energyTrend!: TrendData[];
  @Input() moodStats!: MoodStats;
  @Input() energyStats!: MoodStats;

  @Output() updateMood = new EventEmitter<number>();
  @Output() updateEnergy = new EventEmitter<number>();
  @Output() saveMoodEntry = new EventEmitter<string | undefined>();

  moods = MOOD_OPTIONS;
  energyLevels = ENERGY_LEVELS;
  currentDate = new Date();

  getMoodEmoji(mood: number): string {
    const moodData = this.moods.find((m) => m.value === mood);
    return moodData?.emoji || "😐";
  }

  getEnergyIcon(energy: number): string {
    const energyData = this.energyLevels.find((e) => e.value === energy);
    return energyData?.icon || "🔋";
  }
}
