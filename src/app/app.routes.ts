import { Routes } from "@angular/router";

export const routes: Routes = [
  {
    path: "",
    loadComponent: () =>
      import("./components/habit-dashboard/habit-dashboard.component").then(
        (m) => m.HabitDashboardComponent,
      ),
  },
  {
    path: "stats",
    loadComponent: () =>
      import("./components/habit-stats/habit-stats.component").then(
        (m) => m.HabitStatsComponent,
      ),
  },
  {
    path: "**",
    redirectTo: "",
  },
];
