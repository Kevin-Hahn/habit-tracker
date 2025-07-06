import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import type { Habit } from '../../../models/Habit';
import { HabitService } from '../../../services/habit.service';
import { HabitCalendarComponent } from '../../habit-calendar/habit-calendar.component';

@Component({
    selector: 'app-habit-card-calendar',
    imports: [HabitCalendarComponent],
    template: `
    <habit-calendar
      [habitId]="habit().id"
      [completedDates]="completedDates()"
      (markDone)="onMarkDone($event)"
    />
  `,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HabitCardCalendarContainer {
    habit = input.required<Habit>();
    private readonly habitService = inject(HabitService);

    completedDates = computed(() =>
        this.habitService.entries().filter(e => e.habitId === this.habit().id && e.completed).map(e => e.date)
    );

    onMarkDone(date: string) {
        this.habitService.toggleHabitCompletion(this.habit().id, date);
    }
}
