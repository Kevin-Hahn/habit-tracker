import { Component, OnInit } from "@angular/core";
import { RouterOutlet } from "@angular/router";
import { ThemeService } from "./services/theme.service";

@Component({
  selector: "app-root",
  imports: [RouterOutlet],
  templateUrl: "./app.html",
  styleUrl: "./app.css",
})
export class App implements OnInit {
  protected title = "Habit Tracker";

  constructor(private themeService: ThemeService) {}

  ngOnInit() {
    // Theme service is initialized automatically through DI
    // This ensures dark mode is applied on app startup
  }
}
