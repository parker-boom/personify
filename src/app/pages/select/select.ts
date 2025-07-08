import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import categoriesJson from './example.json';
import { Category } from '../../shared/models/category.interface';
import { LayoutComponent } from '../../shared/components/layout/layout';
import { CategoryCircle } from './components/category-circle/category-circle';
import { SubcategoryOverview } from './components/subcategory-overview/subcategory-overview';
import { JsonPipe } from '@angular/common';
import { SelectionService } from '../../shared/services/selection';

const BRAND_COLORS = [
  '#ff6a00', // orange
  '#ff2ecd', // pink
  '#6a5cff', // purple
  '#00eaff', // cyan (extra for variety)
  '#00ffb8', // greenish (extra)
];

@Component({
  selector: 'app-select',
  standalone: true,
  imports: [LayoutComponent, CategoryCircle, SubcategoryOverview, JsonPipe, CommonModule],
  templateUrl: './select.html',
  styleUrl: './select.scss',
})
export class Select {
  @ViewChild(LayoutComponent) layoutComponent?: LayoutComponent;
  categories: (Category & { color: string })[] = [];
  selectedCategory: Category | null = null;
  debugCategories: any;

  constructor(private selectionService: SelectionService) {
    // Debug: Log the raw JSON import
    console.debug('Imported categoriesJson:', categoriesJson);

    // Assign a color to each category, cycling through the palette
    this.categories = (categoriesJson as Category[]).map((cat, i) => ({
      ...cat,
      color: BRAND_COLORS[i % BRAND_COLORS.length],
    }));

    // Debug: Log the mapped categories
    console.debug('Mapped categories with color:', this.categories);
    this.debugCategories = this.categories;

    // Load categories into the selection service
    this.selectionService.loadCategories(this.categories);
  }

  onCategoryClick(category: Category): void {
    console.debug('Category clicked:', category.label);
    this.selectedCategory = category;
  }

  onSubcategorySave(selectedIds: string[]): void {
    // Update the selection service with the selected subcategories
    selectedIds.forEach(id => {
      if (!this.selectionService.isSubcategorySelected(id)) {
        this.selectionService.toggleSubcategory(id);
      }
    });
    // Remove any subcategories that were previously selected but are not in selectedIds
    this.selectionService.getSelectedSubcategoryIds().forEach(id => {
      if (!selectedIds.includes(id)) {
        this.selectionService.toggleSubcategory(id);
      }
    });
    this.selectedCategory = null;
    // Open the sidebar
    setTimeout(() => this.layoutComponent?.openSidebar(), 0);
  }

  onBackToCategories(): void {
    this.selectedCategory = null;
  }
}
