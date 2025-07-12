import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ThemeService } from '../../../theme.service';
import { Sidebar } from '../sidebar/sidebar';
import { FlowService } from '../../services/flow';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [CommonModule, Sidebar],
  templateUrl: './layout.html',
  styleUrl: './layout.scss',
})
export class LayoutComponent implements OnInit {
  isSidebarOpen = false;

  constructor(
    public themeService: ThemeService,
    private router: Router,
    private flowService: FlowService
  ) {}

  ngOnInit() {
    // Check if we're on the flow page and open sidebar automatically
    this.flowService.flowState$.subscribe((state) => {
      if (state.questions.length > 0) {
        // We're in flow mode, open sidebar
        this.isSidebarOpen = true;
      }
    });
  }

  toggleSidebar(): void {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  closeSidebar(): void {
    this.isSidebarOpen = false;
  }

  openSidebar(): void {
    this.isSidebarOpen = true;
  }
}
