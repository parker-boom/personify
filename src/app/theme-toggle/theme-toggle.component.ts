import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeService } from '../theme.service';

@Component({
  selector: 'app-theme-toggle',
  standalone: true,
  imports: [CommonModule],
  template: `
    <button
      class="theme-toggle"
      (click)="themeService.toggleTheme()"
      [attr.aria-label]="
        (themeService.isDarkMode$ | async)
          ? 'Switch to light mode'
          : 'Switch to dark mode'
      "
    >
      <svg
        *ngIf="!(themeService.isDarkMode$ | async)"
        class="theme-icon"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
      >
        <circle cx="12" cy="12" r="5"></circle>
        <line x1="12" y1="1" x2="12" y2="3"></line>
        <line x1="12" y1="21" x2="12" y2="23"></line>
        <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
        <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
        <line x1="1" y1="12" x2="3" y2="12"></line>
        <line x1="21" y1="12" x2="23" y2="12"></line>
        <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
        <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
      </svg>
      <svg
        *ngIf="themeService.isDarkMode$ | async"
        class="theme-icon"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
      >
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
      </svg>
    </button>
  `,
  styles: [
    `
      .theme-toggle {
        position: fixed;
        top: 2rem;
        right: 2rem;
        background: none;
        border: none;
        cursor: pointer;
        outline: none;
        z-index: 1000;
        padding: 0.5rem;
        border-radius: 50%;
        transition: background 0.2s;
      }

      .theme-toggle:hover {
        background: rgba(0, 0, 0, 0.06);
      }

      :host-context(.dark-mode) .theme-toggle:hover {
        background: rgba(255, 255, 255, 0.06);
      }

      .theme-icon {
        width: 2rem;
        height: 2rem;
        color: #000;
      }

      :host-context(.dark-mode) .theme-icon {
        color: #fff;
      }
    `,
  ],
})
export class ThemeToggleComponent {
  constructor(public themeService: ThemeService) {}
}
