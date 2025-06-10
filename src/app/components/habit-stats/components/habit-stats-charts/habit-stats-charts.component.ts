import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-habit-stats-charts',
  templateUrl: './habit-stats-charts.component.html',
  styleUrls: ['./habit-stats-charts.component.css'],
})
export class HabitStatsChartsComponent {
  @Input() trendData!: any[];
  @Input() trendLinePoints!: string;
  @Input() categoryStats!: any[];
}
