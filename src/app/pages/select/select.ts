import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import categoriesJson from './category.json';
import { Category } from '../../shared/models/category.interface';
import { LayoutComponent } from '../../shared/components/layout/layout';
import { CategoryCircle } from './components/category-circle/category-circle';
import { SubcategoryOverview } from './components/subcategory-overview/subcategory-overview';
import { SelectionService } from '../../shared/services/selection';
import { FlowService } from '../../shared/services/flow';
import { ThemeService } from '../../theme.service';
import { Observable, map } from 'rxjs';

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
  imports: [LayoutComponent, CategoryCircle, SubcategoryOverview, CommonModule],
  templateUrl: './select.html',
  styleUrl: './select.scss',
})
export class Select {
  @ViewChild(LayoutComponent) layoutComponent?: LayoutComponent;
  categories: (Category & { color: string })[] = [];
  selectedCategory: Category | null = null;
  debugCategories: any;
  hasSelections$!: Observable<boolean>;

  constructor(
    private selectionService: SelectionService,
    private flowService: FlowService,
    public themeService: ThemeService,
    private router: Router
  ) {
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

    // Initialize the hasSelections observable after selectionService is available
    this.hasSelections$ = this.selectionService.selectionState$.pipe(
      map((state) => {
        const categorySelections = Object.values(state.categorySelections);
        return categorySelections.some((selections) => selections.length > 0);
      })
    );
  }

  onCategoryClick(category: Category): void {
    console.debug('Category clicked:', category.label);
    this.selectedCategory = category;
  }

  onSubcategorySave(selectedIds: string[]): void {
    if (this.selectedCategory) {
      // Update the selection service with the selected subcategories for this specific category
      this.selectionService.setCategorySelection(
        this.selectedCategory.name,
        selectedIds
      );
    }
    this.selectedCategory = null;
    // Open the sidebar
    setTimeout(() => this.layoutComponent?.openSidebar(), 0);
  }

  onBackToCategories(): void {
    this.selectedCategory = null;
  }

  startCustomizing(): void {
    // Initialize the flow with user selections before navigating
    this.flowService.initializeFlowFromSelections();
    this.router.navigate(['/flow']);
  }
}
