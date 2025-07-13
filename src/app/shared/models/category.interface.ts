/**
 * Category Data Models
 *
 * Defines the structure for categories, subcategories, and selection state
 * used throughout the personalization flow. Categories are loaded from
 * category.json and managed by SelectionService.
 */

import { QuestionType } from './question.interface';

/**
 * Individual question within a subcategory
 * Simplified version for category.json - gets converted to BaseQuestion classes
 */
export interface Question {
  prompt: string;
  type: QuestionType;
  range?: { min: number; max: number };
  default?: number;
  options?: string[];
}

/**
 * Subcategory containing related questions
 * Users select subcategories which generate questions in the flow
 */
export interface Subcategory {
  name: string;
  label: string;
  weight: number;
  order: number;
  suggested: boolean; // Shows star indicator in UI
  id: string;
  questions: Question[];
}

/**
 * Top-level category containing subcategories
 * Displayed as colored headers in the select page
 */
export interface Category {
  name: string;
  label: string;
  weight: number; // Used for dynamic sizing in UI
  emoji: string; // Added for sidebar display
  subcategories: Subcategory[];
}

/**
 * Global selection state managed by SelectionService
 * Tracks both overall selections and per-category selections
 */
export interface SelectionState {
  selectedSubcategoryIds: string[];
  categories: Category[];
  categorySelections: { [categoryName: string]: string[] };
}
