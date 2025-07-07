import { Component } from '@angular/core';
import { ThemeService } from '../../theme.service';
import { ThemeToggleComponent } from '../../theme-toggle/theme-toggle.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [ThemeToggleComponent],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {
  constructor(public themeService: ThemeService) {}

  getStarted() {
    // Placeholder for navigation or onboarding start
    alert('Get Started clicked! (Replace with onboarding flow)');
  }
}
