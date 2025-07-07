export interface Question {
  prompt: string;
  type: 'slider' | 'short_text' | 'long_text' | 'multi_select' | 'dropdown' | 'toggle' | 'select';
  range?: { min: number; max: number };
  default?: number;
  options?: string[];
}

export interface Subcategory {
  name: string;
  label: string;
  weight: number;
  order: number;
  suggested: boolean;
  id: string;
  questions: Question[];
}

export interface Category {
  name: string;
  label: string;
  weight: number;
  subcategories: Subcategory[];
}

export interface SelectionState {
  selectedSubcategoryIds: string[];
  categories: Category[];
} 