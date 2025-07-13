/**
 * Home Page Component
 *
 * Landing page with call-to-action to start the personalization flow.
 * Uses ThemeService for dark/light mode support and Router for navigation.
 * Simple component with minimal logic - just navigation to select page.
 */

import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ThemeService } from '../../theme.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {
  constructor(
    public themeService: ThemeService, // Public for template access
    private router: Router
  ) {}

  /**
   * Navigate to the category selection page
   * Triggered by "Get Started" button click
   */
  getStarted() {
    this.router.navigate(['/select']);
  }
}
