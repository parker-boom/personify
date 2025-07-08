import { Component, inject, EventEmitter, Output } from '@angular/core';
import { SelectionService } from '../../services/selection';
import { Category, Subcategory } from '../../models/category.interface';
import { CommonModule } from '@angular/common';
import { Observable, map } from 'rxjs';
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

  selectedCategories$: Observable<Array<Category & { selectedSubs: Subcategory[] }>> = this.selectionService.selectionState$.pipe(
    map(state => {
      return state.categories
        .map(category => {
          const selectedSubIds = state.categorySelections[category.name] || [];
          const selectedSubs = category.subcategories.filter(sub => selectedSubIds.includes(sub.id));
          return selectedSubs.length > 0 ? { ...category, selectedSubs } : null;
        })
        .filter(Boolean) as Array<Category & { selectedSubs: Subcategory[] }>;
    })
  );

  constructor(public themeService: ThemeService) {}

  removeCategory(category: Category) {
    this.selectionService.setCategorySelection(category.name, []);
  }

  removeSubcategory(category: Category, subcategory: Subcategory) {
    const current = this.selectionService.getCategorySelection(category.name);
    this.selectionService.setCategorySelection(
      category.name,
      current.filter(id => id !== subcategory.id)
    );
  }
}
