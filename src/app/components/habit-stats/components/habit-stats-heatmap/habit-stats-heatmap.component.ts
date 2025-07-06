import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-habit-stats-heatmap',
  templateUrl: './habit-stats-heatmap.component.html',
  styleUrls: ['./habit-stats-heatmap.component.css'],
})
export class HabitStatsHeatmapComponent {
  @Input() heatmapData!: any[];
  @Input() chartLevels!: readonly number[];
}
