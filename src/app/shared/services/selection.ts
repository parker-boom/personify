import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Category, Subcategory, SelectionState } from '../models/category.interface';

export interface CategorySelectionState {
  [categoryName: string]: string[]; // category name/id -> selected subcategory ids
}

@Injectable({
  providedIn: 'root'
})
export class SelectionService {
  private selectionState = new BehaviorSubject<SelectionState>({
    selectedSubcategoryIds: [],
    categories: [],
    categorySelections: {} // new: per-category selection
  } as any);

  selectionState$ = this.selectionState.asObservable();

  constructor() {}

  // Load categories from JSON data
  loadCategories(categories: Category[]): void {
    const currentState = this.selectionState.value;
    this.selectionState.next({
      ...currentState,
      categories
    });
  }

  // Set selected subcategories for a category
  setCategorySelection(categoryName: string, subcategoryIds: string[]): void {
    const currentState = this.selectionState.value;
    const newCategorySelections = { ...currentState.categorySelections, [categoryName]: subcategoryIds };
    this.selectionState.next({
      ...currentState,
      categorySelections: newCategorySelections
    });
  }

  // Get selected subcategories for a category
  getCategorySelection(categoryName: string): string[] {
    return this.selectionState.value.categorySelections?.[categoryName] || [];
  }

  // Toggle subcategory selection (global, not per-category)
  toggleSubcategory(subcategoryId: string): void {
    const currentState = this.selectionState.value;
    const selectedIds = currentState.selectedSubcategoryIds;
    const isSelected = selectedIds.includes(subcategoryId);
    const newSelectedIds = isSelected 
      ? selectedIds.filter(id => id !== subcategoryId)
      : [...selectedIds, subcategoryId];
    this.selectionState.next({
      ...currentState,
      selectedSubcategoryIds: newSelectedIds
    });
  }

  // Get selected subcategories (global)
  getSelectedSubcategories(): Subcategory[] {
    const state = this.selectionState.value;
    const selectedIds = state.selectedSubcategoryIds;
    const allSubcategories = state.categories.flatMap(cat => cat.subcategories);
    return allSubcategories.filter(sub => selectedIds.includes(sub.id));
  }

  // Get selected subcategory IDs (global)
  getSelectedSubcategoryIds(): string[] {
    return this.selectionState.value.selectedSubcategoryIds;
  }

  // Get all categories
  getCategories(): Category[] {
    return this.selectionState.value.categories;
  }

  // Clear all selections
  clearSelections(): void {
    const currentState = this.selectionState.value;
    this.selectionState.next({
      ...currentState,
      selectedSubcategoryIds: [],
      categorySelections: {}
    });
  }

  // Check if subcategory is selected (global)
  isSubcategorySelected(subcategoryId: string): boolean {
    return this.selectionState.value.selectedSubcategoryIds.includes(subcategoryId);
  }
}
