import { Component, computed, inject } from "@angular/core";
import { ThemeService } from "../../services/theme.service";

@Component({
    selector: "app-theme-toggle",
    templateUrl: "./theme-toggle.component.html",
    styleUrls: ["./theme-toggle.component.css"],
})
export class ThemeToggleComponent {
    protected readonly themeService = inject(ThemeService);
    isDarkTheme = computed(() => this.themeService.isDark());
}