import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { Category, Subcategory } from '../../../../shared/models/category.interface';
import { CommonModule, NgStyle } from '@angular/common';
import { SelectionService } from '../../../../shared/services/selection';
import { ThemeService } from '../../../../theme.service';

function pastelize(hex: string, amount = 0.7): string {
  const num = parseInt(hex.replace('#', ''), 16);
  const r = (num >> 16) & 0xff;
  const g = (num >> 8) & 0xff;
  const b = num & 0xff;
  const blend = (c: number) => Math.round(c + (255 - c) * amount);
  return `rgb(${blend(r)}, ${blend(g)}, ${blend(b)})`;
}

const BRAND_COLORS = [
  '#ff6a00', '#ff2ecd', '#6a5cff', '#00eaff', '#00ffb8'
];

@Component({
  selector: 'app-subcategory-overview',
  standalone: true,
  imports: [NgStyle, CommonModule],
  templateUrl: './subcategory-overview.html',
  styleUrl: './subcategory-overview.scss'
})
export class SubcategoryOverview implements OnInit {
  @Input() category!: Category;
  @Output() save = new EventEmitter<string[]>();

  subcategories: (Subcategory & { color: string; pastelColor: string })[] = [];
  selectedIds: Set<string> = new Set();

  constructor(
    private selectionService: SelectionService,
    public themeService: ThemeService
  ) {}

  ngOnInit() {
    this.subcategories = this.category.subcategories.map((sub, i) => {
      const color = BRAND_COLORS[i % BRAND_COLORS.length];
      const pastelColor = pastelize(color, 0.7);
      return { ...sub, color, pastelColor };
    });
    // Load selection state for this category
    const saved = this.selectionService.getCategorySelection(this.category.name);
    if (saved && saved.length > 0) {
      this.selectedIds = new Set(saved);
    } else {
      // Use suggested as default
      this.subcategories.forEach(sub => {
        if (sub.suggested) this.selectedIds.add(sub.id);
      });
    }
  }

  toggleSubcategory(id: string) {
    if (this.selectedIds.has(id)) {
      this.selectedIds.delete(id);
    } else {
      this.selectedIds.add(id);
    }
  }

  onSave() {
    // Save to service
    this.selectionService.setCategorySelection(this.category.name, Array.from(this.selectedIds));
    this.save.emit(Array.from(this.selectedIds));
  }

  isSelected(id: string): boolean {
    return this.selectedIds.has(id);
  }
}
