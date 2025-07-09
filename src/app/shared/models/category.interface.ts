import { QuestionType } from './question.interface';

export interface Question {
  prompt: string;
  type: QuestionType;
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
  emoji: string; // Added for sidebar display
  subcategories: Subcategory[];
}

export interface SelectionState {
  selectedSubcategoryIds: string[];
  categories: Category[];
  categorySelections: { [categoryName: string]: string[] };
} 