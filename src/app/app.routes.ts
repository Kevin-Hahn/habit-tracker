import { Routes } from "@angular/router";

export const routes: Routes = [
  {
    path: "",
    loadComponent: () =>
      import("./components/habit-dashboard/habit-dashboard.container").then(
        (m) => m.HabitDashboardContainerComponent,
      ),
  },
  {
    path: "stats",
    loadComponent: () =>
      import("./components/habit-stats/habit-stats.container").then(
        (m) => m.HabitStatsContainerComponent,
      ),
  },
  {
    path: "mood",
    loadComponent: () =>
      import("./components/mood-tracker/mood-tracker.container").then(
        (m) => m.MoodTrackerContainerComponent,
      ),
  },
  {
    path: "reflection",
    loadComponent: () =>
      import("./components/reflection/reflection.container").then(
        (m) => m.ReflectionContainerComponent,
      ),
  },
  {
    path: "**",
    redirectTo: "",
  },
];
