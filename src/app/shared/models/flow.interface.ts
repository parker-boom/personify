import { BaseQuestion } from './question.interface';

export interface QuestionWithContext extends BaseQuestion {
  // This interface now extends BaseQuestion, so it inherits all the properties
  // We can add any additional properties specific to the flow context here if needed
}

export interface FlowProgress {
  currentQuestionIndex: number;
  totalQuestions: number;
  answeredQuestions: number;
  categoryProgress: CategoryProgress[];
}

export interface CategoryProgress {
  categoryId: string;
  categoryLabel: string;
  subcategories: SubcategoryProgress[];
}

export interface SubcategoryProgress {
  subcategoryId: string;
  subcategoryLabel: string;
  totalQuestions: number;
  answeredQuestions: number;
  isComplete: boolean;
}

export interface FlowState {
  questions: BaseQuestion[];
  answers: Map<string, any>;
  progress: FlowProgress;
} 