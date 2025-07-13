/**
 * Sidebar Component
 *
 * Dual-purpose sidebar that adapts based on current page context:
 * - Select page: Shows selected categories/subcategories with remove buttons
 * - Flow page: Shows progress tracking with completion status
 *
 * Uses dependency injection pattern and reactive observables for state management.
 * Provides skip functionality for flow completion.
 *
 * Uses: SelectionService, FlowService, ThemeService, Router
 */

import { Component, inject, EventEmitter, Output } from '@angular/core';
import { SelectionService } from '../../services/selection';
import { FlowService } from '../../services/flow';
import { Category, Subcategory } from '../../models/category.interface';
import { CommonModule } from '@angular/common';
import { Observable, map, combineLatest } from 'rxjs';
import { ThemeService } from '../../../theme.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.scss',
})
export class Sidebar {
  @Output() closeSidebar = new EventEmitter<void>();

  // Dependency injection pattern for services
  private selectionService = inject(SelectionService);
  private flowService = inject(FlowService);
  private router = inject(Router);

  // For Select page: Show selections with remove buttons
  selectedCategories$: Observable<
    Array<Category & { selectedSubs: Subcategory[] }>
  > = this.selectionService.selectionState$.pipe(
    map((state) => {
      return state.categories
        .map((category) => {
          const selectedSubIds = state.categorySelections[category.name] || [];
          const selectedSubs = category.subcategories.filter((sub) =>
            selectedSubIds.includes(sub.id)
          );
          return selectedSubs.length > 0 ? { ...category, selectedSubs } : null;
        })
        .filter(Boolean) as Array<Category & { selectedSubs: Subcategory[] }>;
    })
  );

  // For Flow page: Show progress with completion status
  flowProgress$: Observable<any> = this.flowService.flowState$.pipe(
    map((state) => {
      const progress = state.progress;
      const currentSubcategoryId = this.flowService.getCurrentSubcategoryId();

      // Update category progress to show current subcategory
      const updatedCategoryProgress = progress.categoryProgress.map(
        (cat: any) => ({
          ...cat,
          subcategories: cat.subcategories.map((sub: any) => ({
            ...sub,
            isCurrent:
              sub.subcategoryId === currentSubcategoryId && !sub.isComplete,
          })),
        })
      );

      return {
        ...progress,
        categoryProgress: updatedCategoryProgress,
      };
    })
  );

  // Determine if we're in flow mode (has questions) or selection mode
  isFlowMode$: Observable<boolean> = this.flowService.flowState$.pipe(
    map((state) => state.questions.length > 0)
  );

  constructor(public themeService: ThemeService) {} // Public for template access

  /**
   * Calculate current question number for display
   * @param answeredQuestions Number of questions answered
   * @param totalQuestions Total number of questions
   * @returns Current question number (1-based)
   */
  getCurrentQuestionNumber(
    answeredQuestions: number,
    totalQuestions: number
  ): number {
    return Math.min(answeredQuestions + 1, totalQuestions);
  }

  /**
   * Remove entire category from selections
   * @param category Category to remove
   */
  removeCategory(category: Category) {
    this.selectionService.setCategorySelection(category.name, []);
  }

  /**
   * Remove specific subcategory from category selections
   * @param category Parent category
   * @param subcategory Subcategory to remove
   */
  removeSubcategory(category: Category, subcategory: Subcategory) {
    const current = this.selectionService.getCategorySelection(category.name);
    this.selectionService.setCategorySelection(
      category.name,
      current.filter((id) => id !== subcategory.id)
    );
  }

  /**
   * Skip remaining questions and proceed to results
   * Collects all current answers and navigates to loading page
   */
  skipRest() {
    // Skip the rest of the flow - collect answers and navigate to loading
    console.log('⏭️  User chose to skip the rest of the flow');
    const answersData = this.collectAndLogAnswers();
    this.closeSidebar.emit();
    this.router.navigate(['/loading'], {
      state: { answers: answersData },
    });
  }

  /**
   * Collect all answers and format for API consumption
   * @returns Array of formatted answer data
   */
  private collectAndLogAnswers() {
    const state = this.flowService.getCurrentState();
    const allAnswers = this.flowService.getAllAnswers();

    console.log('🎯 ===== FINAL ANSWER COLLECTION (SKIP) =====');
    console.log('📊 Total Questions:', state.questions.length);
    console.log('📝 Total Answers:', allAnswers.size);
    console.log(
      '📋 Completion Status:',
      this.flowService.isFlowComplete() ? 'Complete' : 'Incomplete (Skipped)'
    );

    // Convert answers to structured format for logging
    const answersArray = Array.from(allAnswers.entries()).map(
      ([questionId, answer]) => {
        const question = state.questions.find((q) => q.id === questionId);
        return {
          questionId,
          questionPrompt: question?.prompt || 'Unknown',
          questionType: question?.type || 'Unknown',
          categoryId: question?.categoryId || 'Unknown',
          subcategoryId: question?.subcategoryId || 'Unknown',
          answer,
          answerType: typeof answer,
          answerLength: Array.isArray(answer) ? answer.length : undefined,
        };
      }
    );

    console.table(answersArray);

    // Log structured data for API consumption
    console.log('📤 API-Ready Data Structure:');
    console.log(
      JSON.stringify(
        {
          totalQuestions: state.questions.length,
          totalAnswers: allAnswers.size,
          isComplete: this.flowService.isFlowComplete(),
          wasSkipped: true,
          answers: answersArray,
        },
        null,
        2
      )
    );

    console.log('🎯 ===== END ANSWER COLLECTION (SKIP) =====');

    return answersArray;
  }
}
