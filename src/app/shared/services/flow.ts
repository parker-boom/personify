import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { QuestionWithContext, FlowProgress, FlowState, CategoryProgress, SubcategoryProgress } from '../models/flow.interface';
import { Category, Subcategory } from '../models/category.interface';

@Injectable({
  providedIn: 'root'
})
export class FlowService {
  private flowState = new BehaviorSubject<FlowState>({
    questions: [],
    answers: new Map(),
    progress: {
      currentQuestionIndex: 0,
      totalQuestions: 0,
      answeredQuestions: 0,
      categoryProgress: []
    }
  });

  flowState$ = this.flowState.asObservable();

  constructor() {}

  // Initialize flow with selected subcategories
  initializeFlow(selectedSubcategoryIds: string[], categories: Category[]): void {
    const questions = this.buildQuestionList(selectedSubcategoryIds, categories);
    const progress = this.buildInitialProgress(selectedSubcategoryIds, categories);
    
    this.flowState.next({
      questions,
      answers: new Map(),
      progress: {
        currentQuestionIndex: 0,
        totalQuestions: questions.length,
        answeredQuestions: 0,
        categoryProgress: progress
      }
    });
  }

  // Get current question
  getCurrentQuestion(): QuestionWithContext | null {
    const state = this.flowState.value;
    return state.questions[state.progress.currentQuestionIndex] || null;
  }

  // Answer current question
  answerQuestion(answer: any): void {
    const state = this.flowState.value;
    const currentQuestion = this.getCurrentQuestion();
    
    if (!currentQuestion) return;

    const newAnswers = new Map(state.answers);
    newAnswers.set(currentQuestion.id, answer);

    const newProgress = this.updateProgress(state.progress, currentQuestion);

    this.flowState.next({
      ...state,
      answers: newAnswers,
      progress: newProgress
    });
  }

  // Move to next question
  nextQuestion(): boolean {
    const state = this.flowState.value;
    const nextIndex = state.progress.currentQuestionIndex + 1;
    
    if (nextIndex >= state.questions.length) {
      return false; // Flow complete
    }

    this.flowState.next({
      ...state,
      progress: {
        ...state.progress,
        currentQuestionIndex: nextIndex
      }
    });

    return true;
  }

  // Move to previous question
  previousQuestion(): boolean {
    const state = this.flowState.value;
    const prevIndex = state.progress.currentQuestionIndex - 1;
    
    if (prevIndex < 0) {
      return false;
    }

    this.flowState.next({
      ...state,
      progress: {
        ...state.progress,
        currentQuestionIndex: prevIndex
      }
    });

    return true;
  }

  // Get all answers for API call
  getAllAnswers(): Map<string, any> {
    return this.flowState.value.answers;
  }

  // Check if flow is complete
  isFlowComplete(): boolean {
    const state = this.flowState.value;
    return state.progress.currentQuestionIndex >= state.questions.length - 1;
  }

  // Private helper methods
  private buildQuestionList(selectedSubcategoryIds: string[], categories: Category[]): QuestionWithContext[] {
    const questions: QuestionWithContext[] = [];
    
    categories.forEach(category => {
      category.subcategories.forEach(subcategory => {
        if (selectedSubcategoryIds.includes(subcategory.id)) {
          subcategory.questions.forEach((question, questionIndex) => {
            questions.push({
              id: `${subcategory.id}-q${questionIndex}`,
              subcategoryId: subcategory.id,
              categoryId: category.name,
              ...question
            });
          });
        }
      });
    });

    return questions;
  }

  private buildInitialProgress(selectedSubcategoryIds: string[], categories: Category[]): CategoryProgress[] {
    return categories.map(category => ({
      categoryId: category.name,
      categoryLabel: category.label,
      subcategories: category.subcategories
        .filter(sub => selectedSubcategoryIds.includes(sub.id))
        .map(sub => ({
          subcategoryId: sub.id,
          subcategoryLabel: sub.label,
          totalQuestions: sub.questions.length,
          answeredQuestions: 0,
          isComplete: false
        }))
    }));
  }

  private updateProgress(progress: FlowProgress, answeredQuestion: QuestionWithContext): FlowProgress {
    const newCategoryProgress = progress.categoryProgress.map(cat => ({
      ...cat,
      subcategories: cat.subcategories.map(sub => {
        if (sub.subcategoryId === answeredQuestion.subcategoryId) {
          const newAnsweredQuestions = sub.answeredQuestions + 1;
          return {
            ...sub,
            answeredQuestions: newAnsweredQuestions,
            isComplete: newAnsweredQuestions >= sub.totalQuestions
          };
        }
        return sub;
      })
    }));

    return {
      ...progress,
      answeredQuestions: progress.answeredQuestions + 1,
      categoryProgress: newCategoryProgress
    };
  }
}
