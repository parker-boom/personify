import { Component, inject, EventEmitter, Output } from '@angular/core';
import { SelectionService } from '../../services/selection';
import { FlowService } from '../../services/flow';
import { Category, Subcategory } from '../../models/category.interface';
import { CommonModule } from '@angular/common';
import { Observable, map, combineLatest } from 'rxjs';
import { ThemeService } from '../../../theme.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.scss',
})
export class Sidebar {
  @Output() closeSidebar = new EventEmitter<void>();

  private selectionService = inject(SelectionService);
  private flowService = inject(FlowService);

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

  constructor(public themeService: ThemeService) {}

  removeCategory(category: Category) {
    this.selectionService.setCategorySelection(category.name, []);
  }

  removeSubcategory(category: Category, subcategory: Subcategory) {
    const current = this.selectionService.getCategorySelection(category.name);
    this.selectionService.setCategorySelection(
      category.name,
      current.filter((id) => id !== subcategory.id)
    );
  }
}
