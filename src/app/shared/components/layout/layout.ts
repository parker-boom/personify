/**
 * Layout Component
 *
 * Provides consistent page structure with sidebar management for flow and select pages.
 * Handles sidebar toggle state and automatically opens sidebar when flow is active.
 * Contains sidebar component and provides toggle controls for child components.
 *
 * Uses: ThemeService, Router, FlowService, Sidebar component
 */

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
    public themeService: ThemeService, // Public for template access
    private router: Router,
    private flowService: FlowService
  ) {}

  ngOnInit() {
    // Check if we're on the flow page and open sidebar automatically
    this.flowService.flowState$.subscribe((state) => {
      if (state.questions.length > 0) {
        // We're in flow mode, open sidebar to show progress
        this.isSidebarOpen = true;
      }
    });
  }

  /**
   * Toggle sidebar open/closed state
   */
  toggleSidebar(): void {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  /**
   * Close sidebar (called by sidebar close button)
   */
  closeSidebar(): void {
    this.isSidebarOpen = false;
  }

  /**
   * Open sidebar (called when needed)
   */
  openSidebar(): void {
    this.isSidebarOpen = true;
  }
}
