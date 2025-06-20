import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { RouterModule } from '@angular/router';
import { PROGRESS_RING_CONFIG } from '../../constants/PROGRESS_RING_CONFIG';
import { Habit } from '../../models/Habit';
import { HabitStats } from '../../models/HabitStats';
import { HabitCardComponent } from '../habit-card/habit-card.component';

@Component({
  selector: 'app-habit-dashboard',

  imports: [CommonModule, RouterModule, HabitCardComponent],
  templateUrl: './habit-dashboard.component.html',
  styleUrls: ['./habit-dashboard.component.css'],
})
export class HabitDashboardComponent {
  @Input() todayDate!: Date;
  @Input() completedToday!: number;
  @Input() totalHabitsToday!: number;
  @Input() progressOffset!: number;
  @Input() longestStreak!: number;
  @Input() currentStreaks!: number;
  @Input() weeklyCompletion!: number;
  @Input() activeHabits!: Habit[];
  @Input() isDarkTheme!: boolean;
  @Input() showHabitForm!: boolean;
  @Input() editingHabit!: Habit | null;

  // Function inputs for complex logic
  @Input() isHabitCompleted!: (habitId: string) => boolean;
  @Input() getHabitStats!: (habitId: string) => HabitStats;
  @Input() getWeeklyProgress!: (habitId: string) => number;

  @Output() toggleTheme = new EventEmitter<void>();
  @Output() toggleHabit = new EventEmitter<string>();
  @Output() openHabitForm = new EventEmitter<Habit | undefined>();
  @Output() closeHabitForm = new EventEmitter<void>();
  @Output() habitCreated = new EventEmitter<Habit>();
  @Output() habitUpdated = new EventEmitter<Habit>();
  @Output() openMoodTracker = new EventEmitter<void>();
  @Output() deleteHabit = new EventEmitter<string>();

  circumference = PROGRESS_RING_CONFIG.circumference;
}
