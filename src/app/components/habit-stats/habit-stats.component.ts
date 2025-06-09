import { Component, computed, signal } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { HabitService } from "../../services/habit.service";
import { StatisticsService } from "../../services/statistics.service";

@Component({
  selector: "app-habit-stats",
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="stats-container">
      <!-- Header -->
      <header class="stats-header">
        <div class="header-content">
          <button
            class="back-button"
            routerLink="/"
            aria-label="Go back to dashboard"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <path d="M19 12H6m6-6l-6 6 6 6" />
            </svg>
          </button>
          <div class="header-info">
            <h1 class="stats-title">Statistics</h1>
            <p class="stats-subtitle">Track your progress and insights</p>
          </div>
        </div>
      </header>

      <!-- Overview Cards -->
      <div class="overview-section">
        <div class="overview-grid">
          <div class="overview-card">
            <div class="card-icon">📊</div>
            <div class="card-content">
              <div class="card-value">{{ totalHabits() }}</div>
              <div class="card-label">Active Habits</div>
            </div>
          </div>

          <div class="overview-card">
            <div class="card-icon">🔥</div>
            <div class="card-content">
              <div class="card-value">{{ longestStreak() }}</div>
              <div class="card-label">Longest Streak</div>
            </div>
          </div>

          <div class="overview-card">
            <div class="card-icon">📈</div>
            <div class="card-content">
              <div class="card-value">{{ completionRate() }}%</div>
              <div class="card-label">Completion Rate</div>
            </div>
          </div>

          <div class="overview-card">
            <div class="card-icon">⚡</div>
            <div class="card-content">
              <div class="card-value">{{ activeStreaks() }}</div>
              <div class="card-label">Current Streaks</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Charts Section -->
      <div class="charts-section">
        <!-- Completion Trend -->
        <div class="chart-card">
          <div class="chart-header">
            <h3 class="chart-title">30-Day Completion Trend</h3>
            <div class="chart-legend">
              <div class="legend-item">
                <div class="legend-color trend-line"></div>
                <span>Completion Rate</span>
              </div>
            </div>
          </div>
          <div class="chart-container">
            <div class="trend-chart">
              @for (point of trendData(); track point.date; let i = $index) {
                <div
                  class="trend-point"
                  [style.left.%]="(i / (trendData().length - 1)) * 100"
                  [style.bottom.%]="point.rate * 100"
                  [attr.data-date]="point.date"
                  [attr.data-rate]="(point.rate * 100).toFixed(0) + '%'"
                ></div>
              }
              <svg
                class="trend-line-svg"
                viewBox="0 0 100 100"
                preserveAspectRatio="none"
              >
                <polyline
                  [attr.points]="trendLinePoints()"
                  fill="none"
                  stroke="var(--accent-primary)"
                  stroke-width="2"
                />
              </svg>
            </div>
          </div>
        </div>

        <!-- Category Performance -->
        <div class="chart-card">
          <div class="chart-header">
            <h3 class="chart-title">Category Performance</h3>
          </div>
          <div class="chart-container">
            <div class="category-chart">
              @for (category of categoryStats(); track category.category) {
                <div class="category-row">
                  <div class="category-info">
                    <span class="category-name">{{ category.category }}</span>
                    <span class="category-count"
                      >{{ category.totalHabits }} habits</span
                    >
                  </div>
                  <div class="category-progress">
                    <div class="progress-bar">
                      <div
                        class="progress-fill"
                        [style.width.%]="category.completionRate * 100"
                      ></div>
                    </div>
                    <span class="progress-value"
                      >{{ (category.completionRate * 100).toFixed(0) }}%</span
                    >
                  </div>
                </div>
              }
            </div>
          </div>
        </div>
      </div>

      <!-- Streaks Section -->
      <div class="streaks-section">
        <div class="section-header">
          <h2 class="section-title">Current Streaks</h2>
        </div>

        @if (streakData().length === 0) {
          <div class="empty-streaks">
            <div class="empty-icon">🎯</div>
            <p class="empty-text">
              No active streaks yet. Start completing habits to build streaks!
            </p>
          </div>
        } @else {
          <div class="streaks-grid">
            @for (streak of streakData(); track streak.habitId) {
              <div class="streak-card">
                <div class="streak-header">
                  <h4 class="streak-habit-name">{{ streak.habitName }}</h4>
                  <div class="streak-badge">
                    <span class="streak-number">{{
                      streak.currentStreak
                    }}</span>
                    <span class="streak-unit">days</span>
                  </div>
                </div>
                <div class="streak-progress">
                  <div class="streak-bar">
                    <div
                      class="streak-fill"
                      [style.width.%]="
                        (streak.currentStreak / streak.longestStreak) * 100
                      "
                    ></div>
                  </div>
                  <div class="streak-info">
                    <span class="streak-best"
                      >Best: {{ streak.longestStreak }} days</span
                    >
                  </div>
                </div>
              </div>
            }
          </div>
        }
      </div>

      <!-- Heatmap Section -->
      <div class="heatmap-section">
        <div class="section-header">
          <h2 class="section-title">Activity Heatmap</h2>
          <p class="section-subtitle">Last 12 weeks of habit completion</p>
        </div>

        <div class="heatmap-container">
          <div class="heatmap-grid">
            @for (week of heatmapData(); track $index; let weekIndex = $index) {
              <div class="heatmap-week">
                @for (day of week; track day.date) {
                  <div
                    class="heatmap-day"
                    [class]="'level-' + day.level"
                    [attr.data-date]="day.date"
                    [attr.title]="
                      day.date +
                      ': ' +
                      (day.value * 100).toFixed(0) +
                      '% completion'
                    "
                  ></div>
                }
              </div>
            }
          </div>

          <div class="heatmap-legend">
            <span class="legend-text">Less</span>
            <div class="legend-scale">
              @for (level of [0, 1, 2, 3, 4]; track level) {
                <div class="legend-square" [class]="'level-' + level"></div>
              }
            </div>
            <span class="legend-text">More</span>
          </div>
        </div>
      </div>

      <!-- Insights Section -->
      <div class="insights-section">
        <div class="section-header">
          <h2 class="section-title">Personal Insights</h2>
        </div>

        <div class="insights-grid">
          @for (insight of insights(); track insight) {
            <div class="insight-card">
              <div class="insight-icon">💡</div>
              <p class="insight-text">{{ insight }}</p>
            </div>
          }
        </div>
      </div>
    </div>
  `,
  styleUrls: ["./habit-stats.component.css"],
})
export class HabitStatsComponent {
  totalHabits = computed(() => this.habitService.activeHabits().length);

  longestStreak = computed(() => {
    const streaks = this.habitService
      .activeHabits()
      .map((habit) => this.habitService.getHabitStats(habit.id).longestStreak);
    return streaks.length > 0 ? Math.max(...streaks) : 0;
  });

  completionRate = computed(() => {
    const trends = this.statisticsService.getCompletionTrend(30);
    const average =
      trends.reduce((sum, day) => sum + day.rate, 0) / trends.length;
    return Math.round(average * 100);
  });

  activeStreaks = computed(() => {
    return this.habitService
      .activeHabits()
      .filter(
        (habit) => this.habitService.getHabitStats(habit.id).currentStreak > 0,
      ).length;
  });

  trendData = computed(() => {
    return this.statisticsService.getCompletionTrend(30);
  });

  trendLinePoints = computed(() => {
    const data = this.trendData();
    return data
      .map((point, index) => {
        const x = (index / (data.length - 1)) * 100;
        const y = 100 - point.rate * 100;
        return `${x},${y}`;
      })
      .join(" ");
  });

  categoryStats = computed(() => {
    return this.statisticsService.getCategoryStats();
  });

  streakData = computed(() => {
    return this.statisticsService
      .getAllStreaks()
      .filter((streak) => streak.currentStreak > 0)
      .sort((a, b) => b.currentStreak - a.currentStreak);
  });

  heatmapData = computed(() => {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - 12 * 7); // 12 weeks

    const data = this.statisticsService.getHeatmapData(startDate, endDate);

    // Group into weeks
    const weeks: Array<Array<{ date: string; value: number; level: number }>> =
      [];
    for (let i = 0; i < data.length; i += 7) {
      weeks.push(data.slice(i, i + 7));
    }

    return weeks;
  });

  insights = computed(() => {
    return this.statisticsService.getPersonalInsights();
  });

  constructor(
    private habitService: HabitService,
    private statisticsService: StatisticsService,
  ) {}
}
