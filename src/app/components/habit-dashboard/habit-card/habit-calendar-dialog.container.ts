import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, input, signal } from '@angular/core';
import type { Habit } from '../../../models/Habit';
import { HabitService } from '../../../services/habit.service';
import { HabitCalendarComponent } from '../../habit-calendar/habit-calendar.component';

@Component({
    selector: 'app-habit-calendar-dialog',
    imports: [CommonModule, HabitCalendarComponent],
    template: `
    <div class="dialog-backdrop" (click)="close()()"></div>
    <div class="dialog-content" (click)="$event.stopPropagation()">
      <h2 class="dialog-title">{{ habit().name }}</h2>
      <div class="dialog-streak">Current streak: <span class="streak-count">{{ currentStreak() }}</span></div>
      
      <p class="habit-correction-text">Mark days where the habit was fulfilled.</p>

      <div class="habit-calender">
        
        <habit-calendar
            [habitId]="habit().id"
            [completedDates]="completedDates()"
            (markDone)="onMarkDoneAndUpdateStreak($event)"
            (markUndone)="onMarkUndoneAndUpdateStreak($event)"
        />
    </div>
      <button class="close-btn" (click)="close()()">Close</button>
    </div>
  `,
    styleUrls: ['./habit-calendar-dialog.container.css'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HabitCalendarDialogContainer {
    habit = input.required<Habit>();
    completedDates = input.required<string[]>();
    onMarkDone = input.required<((date: string) => void)>();
    close = input.required<() => void>();

    private readonly habitService = inject(HabitService);
    private readonly streakSignal = signal(0);

    currentStreak = computed(() => {
        return this.streakSignal() || this.habitService.getHabitStats(this.habit().id).currentStreak;
    });

    onMarkDoneAndUpdateStreak(date: string) {
        this.onMarkDone()(date);
        this.streakSignal.set(this.habitService.getHabitStats(this.habit().id).currentStreak);
    }

    onMarkUndoneAndUpdateStreak(date: string) {
        this.habitService.toggleHabitCompletion(this.habit().id, date);
        this.streakSignal.set(this.habitService.getHabitStats(this.habit().id).currentStreak);
    }
}
