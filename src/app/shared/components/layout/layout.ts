import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeService } from '../../../theme.service';
import { ThemeToggleComponent } from '../../../theme-toggle/theme-toggle.component';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [CommonModule, ThemeToggleComponent],
  templateUrl: './layout.html',
  styleUrl: './layout.scss',
})
export class LayoutComponent {
  isSidebarOpen = false;

  constructor(public themeService: ThemeService) {}

  toggleSidebar(): void {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  closeSidebar(): void {
    this.isSidebarOpen = false;
  }
}
