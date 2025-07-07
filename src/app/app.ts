import { Component } from '@angular/core';
import { ThemeService } from './theme.service';
import { RouterOutlet } from '@angular/router';
import { ThemeToggleComponent } from './theme-toggle/theme-toggle.component';

@Component({
  selector: 'app-root',
  imports: [ThemeToggleComponent, RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected title = 'personify';

  constructor(public themeService: ThemeService) {}

  getStarted() {
    // Placeholder for navigation or onboarding start
    alert('Get Started clicked! (Replace with onboarding flow)');
  }
}
