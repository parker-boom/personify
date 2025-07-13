/**
 * Mobile Message Component
 *
 * Displays desktop-only message when accessed on mobile devices.
 * Conditionally shown by app component based on MobileDetectionService.
 * Uses ThemeService for dark/light mode styling.
 */

import { Component } from '@angular/core';
import { ThemeService } from '../../../theme.service';

@Component({
  selector: 'app-mobile-message',
  standalone: true,
  templateUrl: './mobile-message.component.html',
  styleUrl: './mobile-message.component.scss',
})
export class MobileMessageComponent {
  constructor(public themeService: ThemeService) {} // Public for template access
}
