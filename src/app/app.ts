import { Component, OnInit } from "@angular/core";
import { RouterOutlet } from "@angular/router";
import { ThemeService } from "./services/theme.service";
import { SampleDataService } from "./services/sample-data.service";

@Component({
  selector: "app-root",
  imports: [RouterOutlet],
  templateUrl: "./app.html",
  styleUrl: "./app.css",
})
export class App implements OnInit {
  protected title = "Habit Tracker";

  constructor(
    private themeService: ThemeService,
    private sampleDataService: SampleDataService,
  ) {}

  ngOnInit() {
    // Initialize theme service (dark mode by default)
    // Theme service is initialized automatically through DI

    // Initialize sample data if this is the first time running the app
    this.sampleDataService.initializeSampleData();
  }
}
