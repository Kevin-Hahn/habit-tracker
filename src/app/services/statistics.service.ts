import { Injectable } from "@angular/core";
import { DayStats, HeatmapData, WeekStats } from "../models/stats.model";
import { HabitService } from "./habit.service";

@Injectable({
  providedIn: "root",
})
export class StatisticsService {
  constructor(private habitService: HabitService) { }

  getDayStats(date: string): DayStats {
    const activeHabits = this.habitService.activeHabits();
    const dayEntries = this.habitService.getEntriesForDate(date);
    const completedEntries = dayEntries.filter((entry) => entry.completed);

    const totalMood = dayEntries.reduce(
      (sum, entry) => sum + (entry.mood || 0),
      0,
    );
    const totalEnergy = dayEntries.reduce(
      (sum, entry) => sum + (entry.energy || 0),
      0,
    );
    const entriesWithMood = dayEntries.filter((entry) => entry.mood).length;
    const entriesWithEnergy = dayEntries.filter((entry) => entry.energy).length;

    return {
      date,
      completedHabits: completedEntries.length,
      totalHabits: activeHabits.length,
      completionRate:
        activeHabits.length > 0
          ? completedEntries.length / activeHabits.length
          : 0,
      mood: entriesWithMood > 0 ? totalMood / entriesWithMood : undefined,
      energy:
        entriesWithEnergy > 0 ? totalEnergy / entriesWithEnergy : undefined,
    };
  }

  getWeekStats(startDate: Date): WeekStats {
    const weekDates = this.getWeekDates(startDate);
    const activeHabits = this.habitService.activeHabits();

    let totalCompleted = 0;
    let totalMood = 0;
    let totalEnergy = 0;
    let moodCount = 0;
    let energyCount = 0;

    weekDates.forEach((date) => {
      const dayStats = this.getDayStats(date);
      totalCompleted += dayStats.completedHabits;

      if (dayStats.mood) {
        totalMood += dayStats.mood;
        moodCount++;
      }

      if (dayStats.energy) {
        totalEnergy += dayStats.energy;
        energyCount++;
      }
    });

    const totalPossibleHabits = activeHabits.length * 7;

    return {
      week: this.formatWeek(startDate),
      completedHabits: totalCompleted,
      totalPossibleHabits,
      completionRate:
        totalPossibleHabits > 0 ? totalCompleted / totalPossibleHabits : 0,
      averageMood: moodCount > 0 ? totalMood / moodCount : undefined,
      averageEnergy: energyCount > 0 ? totalEnergy / energyCount : undefined,
    };
  }

  getHeatmapData(startDate: Date, endDate: Date): HeatmapData[] {
    const data: HeatmapData[] = [];
    const currentDate = new Date(startDate);

    while (currentDate <= endDate) {
      const dateStr = currentDate.toISOString().split("T")[0];
      const dayStats = this.getDayStats(dateStr);

      // Calculate intensity level (0-4) based on completion rate
      let level = 0;
      if (dayStats.completionRate > 0) {
        if (dayStats.completionRate >= 1) level = 4;
        else if (dayStats.completionRate >= 0.75) level = 3;
        else if (dayStats.completionRate >= 0.5) level = 2;
        else level = 1;
      }

      data.push({
        date: dateStr,
        value: dayStats.completionRate,
        level,
      });

      currentDate.setDate(currentDate.getDate() + 1);
    }

    return data;
  }

  getAllStreaks(): {
    habitId: string;
    habitName: string;
    currentStreak: number;
    longestStreak: number;
  }[] {
    return this.habitService.activeHabits().map((habit) => {
      const stats = this.habitService.getHabitStats(habit.id);
      return {
        habitId: habit.id,
        habitName: habit.name,
        currentStreak: stats.currentStreak,
        longestStreak: stats.longestStreak,
      };
    });
  }

  getCompletionTrend(days: number = 30): { date: string; rate: number }[] {
    const trend: { date: string; rate: number }[] = [];
    const endDate = new Date();

    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(endDate);
      date.setDate(endDate.getDate() - i);
      const dateStr = date.toISOString().split("T")[0];
      const dayStats = this.getDayStats(dateStr);

      trend.push({
        date: dateStr,
        rate: dayStats.completionRate,
      });
    }

    return trend;
  }

  getCategoryStats(): {
    category: string;
    completionRate: number;
    totalHabits: number;
  }[] {
    const habits = this.habitService.activeHabits();
    const categories = new Map<string, { total: number; completed: number }>();

    habits.forEach((habit) => {
      const stats = this.habitService.getHabitStats(habit.id);
      const category = habit.category;

      if (!categories.has(category)) {
        categories.set(category, { total: 0, completed: 0 });
      }

      const categoryStats = categories.get(category)!;
      categoryStats.total++;
      categoryStats.completed += stats.completionRate;
    });

    return Array.from(categories.entries()).map(([category, stats]) => ({
      category,
      completionRate: stats.total > 0 ? stats.completed / stats.total : 0,
      totalHabits: stats.total,
    }));
  }

  getMoodEnergyCorrelation(): {
    moodVsCompletion: number;
    energyVsCompletion: number;
    moodVsEnergy: number;
  } {
    const entries = this.habitService.entries();
    const validEntries = entries.filter(
      (entry) => entry.mood && entry.energy && entry.completed !== undefined,
    );

    if (validEntries.length < 2) {
      return { moodVsCompletion: 0, energyVsCompletion: 0, moodVsEnergy: 0 };
    }

    // Calculate correlations (simplified Pearson correlation)
    const moodVsCompletion = this.calculateCorrelation(
      validEntries.map((e) => e.mood!),
      validEntries.map((e) => (e.completed ? 1 : 0)),
    );

    const energyVsCompletion = this.calculateCorrelation(
      validEntries.map((e) => e.energy!),
      validEntries.map((e) => (e.completed ? 1 : 0)),
    );

    const moodVsEnergy = this.calculateCorrelation(
      validEntries.map((e) => e.mood!),
      validEntries.map((e) => e.energy!),
    );

    return { moodVsCompletion, energyVsCompletion, moodVsEnergy };
  }

  getPersonalInsights(): string[] {
    const insights: string[] = [];
    const trends = this.getCompletionTrend(7);
    const streaks = this.getAllStreaks();
    const correlation = this.getMoodEnergyCorrelation();
    const habits = this.habitService.activeHabits();
    const categoryStats = this.getCategoryStats();

    // Trend insights
    if (trends.length > 0) {
      const recentTrend =
        trends.slice(-3).reduce((sum, day) => sum + day.rate, 0) / 3;
      const earlierTrend =
        trends.slice(0, 3).reduce((sum, day) => sum + day.rate, 0) / 3;

      if (recentTrend > earlierTrend + 0.1) {
        insights.push(
          "🚀 You're on an upward trend! Your consistency has improved recently.",
        );
      } else if (recentTrend < earlierTrend - 0.1) {
        insights.push(
          "📉 Your completion rate has dipped recently. Consider adjusting your routine.",
        );
      } else {
        insights.push(
          "📊 Your habit completion has been steady. Consistency is key to success!",
        );
      }
    }

    // Streak insights
    const activeStreaks = streaks.filter((s) => s.currentStreak > 0);
    if (activeStreaks.length > 0) {
      const longestActive = activeStreaks.reduce((max, current) =>
        current.currentStreak > max.currentStreak ? current : max,
      );
      insights.push(
        `🔥 Great job maintaining your ${longestActive.habitName} streak for ${longestActive.currentStreak} days!`,
      );
    } else if (habits.length > 0) {
      insights.push(
        "🎯 Start building streaks by completing habits consistently. Even one day makes a difference!",
      );
    }

    // Category performance insights
    if (categoryStats.length > 0) {
      const bestCategory = categoryStats.reduce((best, current) =>
        current.completionRate > best.completionRate ? current : best,
      );
      if (bestCategory.completionRate > 0.7) {
        insights.push(
          `⭐ You're excelling in ${bestCategory.category} habits with ${(bestCategory.completionRate * 100).toFixed(0)}% completion rate!`,
        );
      }

      const needsWork = categoryStats.find(
        (cat) => cat.completionRate < 0.3 && cat.totalHabits > 0,
      );
      if (needsWork) {
        insights.push(
          `💪 Consider focusing more on your ${needsWork.category} habits to improve overall balance.`,
        );
      }
    }

    // Mood correlation insights
    if (correlation.moodVsCompletion > 0.3) {
      insights.push(
        "😊 Your mood seems to improve when you complete more habits. Keep it up!",
      );
    }

    if (correlation.energyVsCompletion > 0.3) {
      insights.push(
        "⚡ Higher energy levels correlate with better habit completion.",
      );
    }

    // General motivational insights if no specific insights
    if (insights.length === 0) {
      const motivationalInsights = [
        "🌱 Every small step counts towards building lasting habits.",
        "🎨 Customize your habits to match your lifestyle and goals.",
        "📈 Track your progress regularly to stay motivated and accountable.",
        "🌟 Celebrate small wins - they add up to big changes over time.",
        "🔄 Consistency beats perfection. Focus on showing up daily.",
        "🎯 Set realistic goals and gradually increase difficulty as you improve.",
      ];
      insights.push(
        motivationalInsights[
        Math.floor(Math.random() * motivationalInsights.length)
        ],
      );
    }

    // Ensure we always have at least 2-3 insights
    if (insights.length === 1) {
      insights.push(
        "🏆 Remember: building habits is a marathon, not a sprint. Stay consistent!",
      );
    }

    return insights;
  }

  // Helper methods
  private getWeekDates(startDate: Date): string[] {
    const dates: string[] = [];
    const currentDate = new Date(startDate);

    for (let i = 0; i < 7; i++) {
      dates.push(currentDate.toISOString().split("T")[0]);
      currentDate.setDate(currentDate.getDate() + 1);
    }

    return dates;
  }

  private formatWeek(startDate: Date): string {
    const year = startDate.getFullYear();
    const firstDayOfYear = new Date(year, 0, 1);
    const pastDaysOfYear =
      (startDate.getTime() - firstDayOfYear.getTime()) / 86400000;
    const weekNumber = Math.ceil(
      (pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7,
    );
    return `${year}-W${weekNumber.toString().padStart(2, "0")}`;
  }

  private calculateCorrelation(x: number[], y: number[]): number {
    const n = x.length;
    if (n !== y.length || n < 2) return 0;

    const sumX = x.reduce((a, b) => a + b, 0);
    const sumY = y.reduce((a, b) => a + b, 0);
    const sumXY = x.reduce((sum, xi, i) => sum + xi * y[i], 0);
    const sumXX = x.reduce((sum, xi) => sum + xi * xi, 0);
    const sumYY = y.reduce((sum, yi) => sum + yi * yi, 0);

    const numerator = n * sumXY - sumX * sumY;
    const denominator = Math.sqrt(
      (n * sumXX - sumX * sumX) * (n * sumYY - sumY * sumY),
    );

    return denominator === 0 ? 0 : numerator / denominator;
  }
}
