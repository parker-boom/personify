import { Component } from '@angular/core';
import { ThemeService } from './theme.service';
import { MobileDetectionService } from './shared/services/mobile-detection.service';
import { RouterOutlet } from '@angular/router';
import { ThemeToggleComponent } from './theme-toggle/theme-toggle.component';
import { MobileMessageComponent } from './shared/components/mobile-message/mobile-message.component';
import { AsyncPipe, NgIf } from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [
    ThemeToggleComponent,
    RouterOutlet,
    MobileMessageComponent,
    AsyncPipe,
    NgIf,
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected title = 'personify';

  constructor(
    public themeService: ThemeService,
    public mobileDetectionService: MobileDetectionService
  ) {}

  getStarted() {
    // Placeholder for navigation or onboarding start
    alert('Get Started clicked! (Replace with onboarding flow)');
  }
}
