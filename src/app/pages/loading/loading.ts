/**
 * Loading Page Component
 *
 * Orchestrates API processing of user answers with animated loading feedback.
 * Receives answer data via router state, processes through ApiService,
 * and navigates to results page. Features cycling loading messages and
 * error handling with fallback navigation.
 *
 * Uses: ThemeService, Router, ApiService
 */

import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ThemeService } from '../../theme.service';
import { ApiService, AnswerData } from '../../shared/services/api.service';

@Component({
  selector: 'app-loading',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './loading.html',
  styleUrls: ['./loading.scss'],
})
export class LoadingComponent implements OnInit, OnDestroy {
  currentMessageIndex = 0;
  private messageInterval: any;
  private answersData: AnswerData[] = [];

  // Cycling loading messages for user engagement
  loadingMessages = [
    'Personalizing your experience',
    'Crunching the numbers',
    'Gearing up for greatness',
    'Crafting your AI companion',
    'Almost there...',
    'Making magic happen',
  ];

  constructor(
    public themeService: ThemeService, // Public for template access
    private router: Router,
    private apiService: ApiService
  ) {
    // Get answers data from navigation state (passed from flow page)
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras?.state) {
      this.answersData = navigation.extras.state['answers'] || [];
    }
  }

  ngOnInit() {
    this.startMessageCycle();
    this.processAnswers();
  }

  ngOnDestroy() {
    // Clean up interval to prevent memory leaks
    if (this.messageInterval) {
      clearInterval(this.messageInterval);
    }
  }

  /**
   * Start cycling through loading messages every 3 seconds
   */
  private startMessageCycle() {
    this.messageInterval = setInterval(() => {
      this.currentMessageIndex =
        (this.currentMessageIndex + 1) % this.loadingMessages.length;
    }, 3000); // Change message every 3 seconds
  }

  /**
   * Process user answers through API and handle response/errors
   */
  private processAnswers() {
    console.log('🔄 Processing answers:', this.answersData);

    // If no answers data, redirect back to flow
    if (!this.answersData || this.answersData.length === 0) {
      console.warn('⚠️ No answers data found, redirecting to flow');
      this.router.navigate(['/flow']);
      return;
    }

    // Call the API service to process answers
    this.apiService.processAnswers(this.answersData).subscribe({
      next: (response) => {
        console.log('✅ API call successful:', response);

        // Navigate to results page with the response data
        this.router.navigate(['/results'], {
          state: { apiResponse: response },
        });
      },
      error: (error) => {
        console.error('❌ API call failed:', error);

        this.router.navigate(['/flow']);
      },
    });
  }
}
