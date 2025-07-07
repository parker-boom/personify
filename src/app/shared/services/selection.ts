import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Category, Subcategory, SelectionState } from '../models/category.interface';

@Injectable({
  providedIn: 'root'
})
export class SelectionService {
  private selectionState = new BehaviorSubject<SelectionState>({
    selectedSubcategoryIds: [],
    categories: []
  });

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

  // Toggle subcategory selection
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

  // Get selected subcategories
  getSelectedSubcategories(): Subcategory[] {
    const state = this.selectionState.value;
    const selectedIds = state.selectedSubcategoryIds;
    const allSubcategories = state.categories.flatMap(cat => cat.subcategories);
    
    return allSubcategories.filter(sub => selectedIds.includes(sub.id));
  }

  // Get selected subcategory IDs
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
      selectedSubcategoryIds: []
    });
  }

  // Check if subcategory is selected
  isSubcategorySelected(subcategoryId: string): boolean {
    return this.selectionState.value.selectedSubcategoryIds.includes(subcategoryId);
  }
}
