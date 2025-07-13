import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import categoriesJson from './category.json';
import { Category } from '../../shared/models/category.interface';
import { LayoutComponent } from '../../shared/components/layout/layout';
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

function pastelize(hex: string, amount = 0.75): string {
  const num = parseInt(hex.replace('#', ''), 16);
  const r = (num >> 16) & 0xff;
  const g = (num >> 8) & 0xff;
  const b = num & 0xff;
  const blend = (c: number) => Math.round(c + (255 - c) * amount);
  return `rgb(${blend(r)}, ${blend(g)}, ${blend(b)})`;
}

@Component({
  selector: 'app-select',
  standalone: true,
  imports: [LayoutComponent, CommonModule],
  templateUrl: './select.html',
  styleUrl: './select.scss',
})
export class Select {
  @ViewChild(LayoutComponent) layoutComponent?: LayoutComponent;
  categories: (Category & { color: string })[] = [];
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

    // Load categories into the selection service
    this.selectionService.loadCategories(this.categories);

    // Initialize the hasSelections observable
    this.hasSelections$ = this.selectionService.selectionState$.pipe(
      map((state) => {
        const categorySelections = Object.values(state.categorySelections);
        return categorySelections.some((selections) => selections.length > 0);
      })
    );
  }

  // Weight-based sizing methods
  getCategoryWidth(weight: number): number {
    // Base width: 260px, vary by ±50px based on weight (5-10 range) - reduced from 280px
    const minWeight = 5,
      maxWeight = 10;
    const baseWidth = 260;
    const variation = 50;
    const normalizedWeight = (weight - minWeight) / (maxWeight - minWeight);
    return baseWidth + variation * normalizedWeight;
  }

  getCategoryHeight(weight: number): number {
    // Base height: 110px, vary by ±30px based on weight for more variation
    const minWeight = 5,
      maxWeight = 10;
    const baseHeight = 110;
    const variation = 30;
    const normalizedWeight = (weight - minWeight) / (maxWeight - minWeight);
    return baseHeight + variation * normalizedWeight;
  }

  getCategoryEmojiSize(weight: number): number {
    // Emoji size: 3rem to 4rem based on weight - increased from 2.5-3.2rem
    const minWeight = 5,
      maxWeight = 10;
    const minSize = 3,
      maxSize = 4;
    const normalizedWeight = (weight - minWeight) / (maxWeight - minWeight);
    return minSize + normalizedWeight * (maxSize - minSize);
  }

  getCategoryTitleSize(weight: number): number {
    // Title size: 1.4rem to 1.8rem based on weight - increased from 1.2-1.5rem
    const minWeight = 5,
      maxWeight = 10;
    const minSize = 1.4,
      maxSize = 1.8;
    const normalizedWeight = (weight - minWeight) / (maxWeight - minWeight);
    return minSize + normalizedWeight * (maxSize - minSize);
  }

  getSubcategoryWidth(weight: number): number {
    // Subcategory width should be slightly less than category width
    return this.getCategoryWidth(weight) - 20;
  }

  getSubcategoryColor(categoryColor: string): string {
    return pastelize(categoryColor, 0.8);
  }

  // Subcategory selection methods
  isSubcategorySelected(categoryName: string, subcategoryId: string): boolean {
    const selections = this.selectionService.getCategorySelection(categoryName);
    return selections.includes(subcategoryId);
  }

  toggleSubcategory(categoryName: string, subcategoryId: string): void {
    const currentSelections =
      this.selectionService.getCategorySelection(categoryName);

    // Check if this is the first selection overall
    const allCurrentSelections = Object.values(
      this.selectionService.selectionState.value.categorySelections
    );
    const wasEmpty = allCurrentSelections.every(
      (selections: string[]) => selections.length === 0
    );

    if (currentSelections.includes(subcategoryId)) {
      // Remove from selection
      const newSelections = currentSelections.filter(
        (id) => id !== subcategoryId
      );
      this.selectionService.setCategorySelection(categoryName, newSelections);
    } else {
      // Add to selection
      const newSelections = [...currentSelections, subcategoryId];
      this.selectionService.setCategorySelection(categoryName, newSelections);

      // If this is the first selection, open the sidebar
      if (wasEmpty) {
        setTimeout(() => this.layoutComponent?.openSidebar(), 100);
      }
    }
  }

  startCustomizing(): void {
    // Initialize the flow with user selections before navigating
    this.flowService.initializeFlowFromSelections();
    this.router.navigate(['/flow']);
  }
}
