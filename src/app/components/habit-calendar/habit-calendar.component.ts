import { ChangeDetectionStrategy, Component, computed, input, output, signal } from '@angular/core';

@Component({
    selector: 'habit-calendar',
    templateUrl: './habit-calendar.component.html',
    styleUrls: ['./habit-calendar.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HabitCalendarComponent {
    habitId = input.required<string>();
    completedDates = input.required<string[]>(); // ISO date strings (YYYY-MM-DD)

    readonly today = signal(new Date());
    readonly selectedMonth = signal(new Date());

    readonly daysInMonth = computed(() => {
        const date = new Date(this.selectedMonth());
        date.setDate(1);
        const days: Date[] = [];
        while (date.getMonth() === this.selectedMonth().getMonth()) {
            days.push(new Date(date));
            date.setDate(date.getDate() + 1);
        }
        return days;
    });

    readonly isDone = (date: Date) =>
        this.completedDates().includes(date.toISOString().slice(0, 10));

    readonly isFuture = (date: Date) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const d = new Date(date);
        d.setHours(0, 0, 0, 0);
        return d.getTime() > today.getTime();
    };

    readonly markDone = output<string>();
    readonly markUndone = output<string>();

    onMarkToggle(date: Date) {
        if (this.isFuture(date)) return;
        const dateStr = date.toISOString().slice(0, 10);
        if (this.isDone(date)) {
            this.markUndone.emit(dateStr);
        } else {
            this.markDone.emit(dateStr);
        }
    }

    prevMonth() {
        const d = new Date(this.selectedMonth());
        d.setMonth(d.getMonth() - 1);
        this.selectedMonth.set(d);
    }

    nextMonth() {
        const d = new Date(this.selectedMonth());
        d.setMonth(d.getMonth() + 1);
        this.selectedMonth.set(d);
    }
}
