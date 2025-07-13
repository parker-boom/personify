/**
 * Flow State Models
 *
 * Defines the structure for managing the conversational flow state,
 * progress tracking, and question context. Used by FlowService to
 * coordinate between user selections and the chat interface.
 */

import { BaseQuestion } from './question.interface';

/**
 * Question with additional flow context
 * Currently extends BaseQuestion without additional properties
 */
export interface QuestionWithContext extends BaseQuestion {
  // This interface now extends BaseQuestion, so it inherits all the properties
  // We can add any additional properties specific to the flow context here if needed
}

/**
 * Overall progress tracking for the flow
 * Provides completion status and category breakdown
 */
export interface FlowProgress {
  currentQuestionIndex: number;
  totalQuestions: number;
  answeredQuestions: number;
  categoryProgress: CategoryProgress[];
}

/**
 * Progress tracking for individual categories
 * Shows completion status of subcategories within each category
 */
export interface CategoryProgress {
  categoryId: string;
  categoryLabel: string;
  categoryEmoji?: string;
  subcategories: SubcategoryProgress[];
}

/**
 * Progress tracking for individual subcategories
 * Tracks question completion within each subcategory
 */
export interface SubcategoryProgress {
  subcategoryId: string;
  subcategoryLabel: string;
  totalQuestions: number;
  answeredQuestions: number;
  isComplete: boolean;
}

/**
 * Complete flow state managed by FlowService
 * Contains all questions, current position, answers, and progress
 */
export interface FlowState {
  questions: BaseQuestion[];
  currentQuestionIndex: number;
  answers: Map<string, any>;
  isComplete: boolean;
  progress: FlowProgress;
}
