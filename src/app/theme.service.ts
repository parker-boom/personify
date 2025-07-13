/**
 * Theme Service
 *
 * Manages global dark/light mode state with localStorage persistence.
 * Provides reactive theme updates through BehaviorSubject and automatically
 * applies theme classes to document body. Supports system preference detection
 * as fallback when no stored preference exists.
 */

import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private isDarkModeSubject = new BehaviorSubject<boolean>(false);
  isDarkMode$ = this.isDarkModeSubject.asObservable();

  constructor() {
    this.initializeTheme();
  }

  /**
   * Initialize theme from localStorage or system preference
   */
  private initializeTheme(): void {
    // Check localStorage first for user preference
    const stored = localStorage.getItem('personify-theme');
    if (stored) {
      this.setDarkMode(stored === 'dark');
    } else {
      // Fall back to system preference
      const prefersDark = window.matchMedia(
        '(prefers-color-scheme: dark)'
      ).matches;
      this.setDarkMode(prefersDark);
    }
  }

  /**
   * Get current theme state (synchronous)
   * @returns Boolean indicating if dark mode is active
   */
  get isDarkMode(): boolean {
    return this.isDarkModeSubject.value;
  }

  /**
   * Toggle between dark and light mode
   */
  toggleTheme(): void {
    this.setDarkMode(!this.isDarkMode);
  }

  /**
   * Set specific theme mode
   * @param isDark Boolean indicating dark mode preference
   */
  setDarkMode(isDark: boolean): void {
    this.isDarkModeSubject.next(isDark);
    localStorage.setItem('personify-theme', isDark ? 'dark' : 'light');
    this.updateBodyClass(isDark);
  }

  /**
   * Update document body class for global theme styling
   * @param isDark Boolean indicating dark mode
   */
  private updateBodyClass(isDark: boolean): void {
    if (isDark) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }
}
