import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-habit-stats-streaks',
  templateUrl: './habit-stats-streaks.component.html',
  styleUrls: ['./habit-stats-streaks.component.css'],
})
export class HabitStatsStreaksComponent {
  @Input() streakData!: any[];
}
