import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { QuestionWithContext, FlowProgress, FlowState, CategoryProgress, SubcategoryProgress } from '../models/flow.interface';
import { Category, Subcategory } from '../models/category.interface';
import { QuestionFactory } from './question-factory';
import { BaseQuestion, QuestionContext } from '../models/question.interface';
import { ONBOARDING_QUESTIONS, ONBOARDING_CONTEXT } from '../config/onboarding-questions';
import { SelectionService } from './selection';

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

  constructor(
    private questionFactory: QuestionFactory,
    private selectionService: SelectionService
  ) {}

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

  // NEW: Initialize flow from user selections (called from Select page)
  initializeFlowFromSelections(): void {
    const selectedIds = this.selectionService.getSelectedSubcategoryIds();
    const categories = this.selectionService.getCategories();
    
    console.log('FlowService - Selected IDs:', selectedIds);
    console.log('FlowService - Categories:', categories);
    
    // Build linear question list from selected subcategories
    const selectedQuestions = this.buildQuestionList(selectedIds, categories);
    console.log('FlowService - Selected Questions:', selectedQuestions);
    
    // Add onboarding questions at the beginning
    const onboardingQuestions = this.buildOnboardingQuestions();
    console.log('FlowService - Onboarding Questions:', onboardingQuestions);
    
    const allQuestions = [...onboardingQuestions, ...selectedQuestions];
    console.log('FlowService - All Questions:', allQuestions);
    
    // Build progress tracking
    const progress = this.buildInitialProgress(selectedIds, categories);
    
    this.flowState.next({
      questions: allQuestions,
      answers: new Map(),
      progress: {
        currentQuestionIndex: 0,
        totalQuestions: allQuestions.length,
        answeredQuestions: 0,
        categoryProgress: progress
      }
    });
  }

  // Get current question
  getCurrentQuestion(): BaseQuestion | null {
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

  // Get current state for component access
  getCurrentState(): FlowState {
    return this.flowState.value;
  }

  // Set current question index (for navigation)
  setCurrentQuestionIndex(index: number): void {
    const state = this.flowState.value;
    if (index >= 0 && index < state.questions.length) {
      const newState = {
        ...state,
        progress: {
          ...state.progress,
          currentQuestionIndex: index
        }
      };
      this.flowState.next(newState);
    }
  }

  // Private helper methods
  private buildQuestionList(selectedSubcategoryIds: string[], categories: Category[]): BaseQuestion[] {
    const questions: BaseQuestion[] = [];
    
    console.log('buildQuestionList - Selected IDs:', selectedSubcategoryIds);
    console.log('buildQuestionList - Categories:', categories);
    
    categories.forEach(category => {
      console.log(`Processing category: ${category.name}`);
      category.subcategories.forEach(subcategory => {
        console.log(`  Checking subcategory: ${subcategory.id} (${subcategory.name})`);
        if (selectedSubcategoryIds.includes(subcategory.id)) {
          console.log(`    ✓ Selected! Adding ${subcategory.questions.length} questions`);
          const context: QuestionContext = {
            categoryId: category.name,
            subcategoryId: subcategory.id,
            order: 0
          };
          
          const categoryQuestions = this.questionFactory.createQuestionsFromJson(
            subcategory.questions, 
            context
          );
          questions.push(...categoryQuestions);
        } else {
          console.log(`    ✗ Not selected`);
        }
      });
    });

    console.log('buildQuestionList - Final questions:', questions);
    return questions;
  }

  private buildOnboardingQuestions(): BaseQuestion[] {
    return this.questionFactory.createQuestionsFromJson(
      ONBOARDING_QUESTIONS, 
      ONBOARDING_CONTEXT
    );
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
