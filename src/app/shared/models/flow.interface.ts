export interface QuestionWithContext {
  id: string;
  subcategoryId: string;
  categoryId: string;
  prompt: string;
  type: 'slider' | 'short_text' | 'long_text' | 'multi_select' | 'dropdown' | 'toggle' | 'select';
  range?: { min: number; max: number };
  default?: number;
  options?: string[];
  answer?: any;
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
  questions: QuestionWithContext[];
  answers: Map<string, any>;
  progress: FlowProgress;
} 