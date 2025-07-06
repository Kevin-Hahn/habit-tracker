import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-habit-stats-overview',
  templateUrl: './habit-stats-overview.component.html',
  styleUrls: ['./habit-stats-overview.component.css'],
})
export class HabitStatsOverviewComponent {
  @Input() totalHabits!: number;
  @Input() longestStreak!: number;
  @Input() completionRate!: number;
  @Input() activeStreaks!: number;
}
