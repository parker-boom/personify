/**
 * Select Page Component
 *
 * Category and subcategory selection interface with unified 4-column layout.
 * Loads categories from category.json, applies dynamic sizing based on weights,
 * and manages selection state through SelectionService. Features real-time
 * selection updates and conditional "Start customizing" button.
 *
 * Uses: SelectionService, FlowService, ThemeService, Router
 */

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import categoriesJson from './category.json';
import { Category } from '../../shared/models/category.interface';
import { SelectionService } from '../../shared/services/selection';
import { FlowService } from '../../shared/services/flow';
import { ThemeService } from '../../theme.service';
import { Observable, map } from 'rxjs';

// Brand color palette for category headers
const BRAND_COLORS = [
  '#ff6a00', // orange
  '#ff2ecd', // pink
  '#6a5cff', // purple
  '#00eaff', // cyan (extra for variety)
  '#00ffb8', // greenish (extra)
];

/**
 * Convert hex color to pastel version for subcategories
 * @param hex Original hex color
 * @param amount Blend amount (0-1, higher = more pastel)
 * @returns RGB string with pastel version
 */
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
  imports: [CommonModule],
  templateUrl: './select.html',
  styleUrl: './select.scss',
})
export class Select {
  categories: (Category & { color: string })[] = [];
  hasSelections$!: Observable<boolean>;

  constructor(
    private selectionService: SelectionService,
    private flowService: FlowService,
    public themeService: ThemeService, // Public for template access
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

    // Initialize the hasSelections observable for conditional button display
    this.hasSelections$ = this.selectionService.selectionState$.pipe(
      map((state) => {
        const categorySelections = Object.values(state.categorySelections);
        return categorySelections.some((selections) => selections.length > 0);
      })
    );
  }

  // Dynamic sizing methods based on category weight

  /**
   * Calculate category header width based on weight
   * @param weight Category weight (5-10 range)
   * @returns Width in pixels
   */
  getCategoryWidth(weight: number): number {
    // Base width: 260px, vary by ±50px based on weight (5-10 range) - reduced from 280px
    const minWeight = 5,
      maxWeight = 10;
    const baseWidth = 230;
    const variation = 30;
    const normalizedWeight = (weight - minWeight) / (maxWeight - minWeight);
    return baseWidth + variation * normalizedWeight;
  }

  /**
   * Calculate category header height based on weight
   * @param weight Category weight (5-10 range)
   * @returns Height in pixels
   */
  getCategoryHeight(weight: number): number {
    // Base height: 110px, vary by ±30px based on weight for more variation
    const minWeight = 5,
      maxWeight = 10;
    const baseHeight = 110;
    const variation = 30;
    const normalizedWeight = (weight - minWeight) / (maxWeight - minWeight);
    return baseHeight + variation * normalizedWeight;
  }

  /**
   * Calculate emoji size based on category weight
   * @param weight Category weight (5-10 range)
   * @returns Size in rem units
   */
  getCategoryEmojiSize(weight: number): number {
    // Emoji size: 3rem to 4rem based on weight - increased from 2.5-3.2rem
    const minWeight = 5,
      maxWeight = 10;
    const minSize = 3,
      maxSize = 4;
    const normalizedWeight = (weight - minWeight) / (maxWeight - minWeight);
    return minSize + normalizedWeight * (maxSize - minSize);
  }

  /**
   * Calculate title size based on category weight
   * @param weight Category weight (5-10 range)
   * @returns Size in rem units
   */
  getCategoryTitleSize(weight: number): number {
    // Title size: 1.4rem to 1.8rem based on weight - increased from 1.2-1.5rem
    const minWeight = 5,
      maxWeight = 10;
    const minSize = 1.4,
      maxSize = 1.8;
    const normalizedWeight = (weight - minWeight) / (maxWeight - minWeight);
    return minSize + normalizedWeight * (maxSize - minSize);
  }

  /**
   * Calculate subcategory width (slightly smaller than category)
   * @param weight Category weight
   * @returns Width in pixels
   */
  getSubcategoryWidth(weight: number): number {
    // Subcategory width should be slightly less than category width
    return this.getCategoryWidth(weight) - 20;
  }

  /**
   * Get pastel version of category color for subcategories
   * @param categoryColor Original category color
   * @returns Pastel RGB color string
   */
  getSubcategoryColor(categoryColor: string): string {
    return pastelize(categoryColor, 0.8);
  }

  // Subcategory selection methods

  /**
   * Check if a subcategory is selected within a category
   * @param categoryName Name of the category
   * @param subcategoryId ID of the subcategory
   * @returns Boolean indicating selection status
   */
  isSubcategorySelected(categoryName: string, subcategoryId: string): boolean {
    const selections = this.selectionService.getCategorySelection(categoryName);
    return selections.includes(subcategoryId);
  }

  /**
   * Toggle subcategory selection within a category
   * @param categoryName Name of the category
   * @param subcategoryId ID of the subcategory to toggle
   */
  toggleSubcategory(categoryName: string, subcategoryId: string): void {
    const currentSelections =
      this.selectionService.getCategorySelection(categoryName);

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
    }
  }

  /**
   * Initialize flow and navigate to flow page
   * Triggered by "Start customizing" button
   */
  startCustomizing(): void {
    // Initialize the flow with user selections before navigating
    this.flowService.initializeFlowFromSelections();
    this.router.navigate(['/flow']);
  }
}
