/**
 * Selection Service
 *
 * Manages user selections of categories and subcategories throughout the app.
 * Provides reactive state management with BehaviorSubject for real-time updates.
 * Supports both global selection tracking and per-category selection state.
 * Used by Select page for UI state and FlowService for question generation.
 */

import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import {
  Category,
  Subcategory,
  SelectionState,
} from '../models/category.interface';

/**
 * Per-category selection state mapping
 * Maps category names to arrays of selected subcategory IDs
 */
export interface CategorySelectionState {
  [categoryName: string]: string[]; // category name/id -> selected subcategory ids
}

@Injectable({
  providedIn: 'root',
})
export class SelectionService {
  // Central state management with reactive updates
  public selectionState = new BehaviorSubject<SelectionState>({
    selectedSubcategoryIds: [],
    categories: [],
    categorySelections: {}, // new: per-category selection
  } as any);

  selectionState$ = this.selectionState.asObservable();

  constructor() {}

  /**
   * Load categories from JSON data into state
   * @param categories Array of category data from category.json
   */
  loadCategories(categories: Category[]): void {
    const currentState = this.selectionState.value;
    this.selectionState.next({
      ...currentState,
      categories,
    });
  }

  /**
   * Set selected subcategories for a specific category
   * Updates both per-category and global selection state
   * @param categoryName Name of the category
   * @param subcategoryIds Array of selected subcategory IDs
   */
  setCategorySelection(categoryName: string, subcategoryIds: string[]): void {
    const currentState = this.selectionState.value;
    const newCategorySelections = {
      ...currentState.categorySelections,
      [categoryName]: subcategoryIds,
    };

    // Update the global selectedSubcategoryIds array to include these selections
    const allSelectedIds = Object.values(newCategorySelections).flat();

    this.selectionState.next({
      ...currentState,
      selectedSubcategoryIds: allSelectedIds,
      categorySelections: newCategorySelections,
    });
  }

  /**
   * Get selected subcategories for a specific category
   * @param categoryName Name of the category
   * @returns Array of selected subcategory IDs
   */
  getCategorySelection(categoryName: string): string[] {
    return this.selectionState.value.categorySelections?.[categoryName] || [];
  }

  /**
   * Toggle subcategory selection (global, not per-category)
   * @param subcategoryId ID of subcategory to toggle
   */
  toggleSubcategory(subcategoryId: string): void {
    const currentState = this.selectionState.value;
    const selectedIds = currentState.selectedSubcategoryIds;
    const isSelected = selectedIds.includes(subcategoryId);
    const newSelectedIds = isSelected
      ? selectedIds.filter((id) => id !== subcategoryId)
      : [...selectedIds, subcategoryId];
    this.selectionState.next({
      ...currentState,
      selectedSubcategoryIds: newSelectedIds,
    });
  }

  /**
   * Get all selected subcategories with full data
   * @returns Array of Subcategory objects that are selected
   */
  getSelectedSubcategories(): Subcategory[] {
    const state = this.selectionState.value;
    const selectedIds = state.selectedSubcategoryIds;
    const allSubcategories = state.categories.flatMap(
      (cat) => cat.subcategories
    );
    return allSubcategories.filter((sub) => selectedIds.includes(sub.id));
  }

  /**
   * Get selected subcategory IDs (global)
   * @returns Array of selected subcategory ID strings
   */
  getSelectedSubcategoryIds(): string[] {
    return this.selectionState.value.selectedSubcategoryIds;
  }

  /**
   * Get all loaded categories
   * @returns Array of all Category objects
   */
  getCategories(): Category[] {
    return this.selectionState.value.categories;
  }

  /**
   * Clear all selections (both per-category and global)
   */
  clearSelections(): void {
    const currentState = this.selectionState.value;
    this.selectionState.next({
      ...currentState,
      selectedSubcategoryIds: [],
      categorySelections: {},
    });
  }

  /**
   * Check if a specific subcategory is selected
   * @param subcategoryId ID of subcategory to check
   * @returns Boolean indicating selection status
   */
  isSubcategorySelected(subcategoryId: string): boolean {
    return this.selectionState.value.selectedSubcategoryIds.includes(
      subcategoryId
    );
  }
}
