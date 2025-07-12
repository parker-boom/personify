import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import {
  QuestionWithContext,
  FlowProgress,
  FlowState,
  CategoryProgress,
  SubcategoryProgress,
} from '../models/flow.interface';
import { Category, Subcategory } from '../models/category.interface';
import { QuestionFactory } from './question-factory';
import { BaseQuestion, QuestionContext } from '../models/question.interface';
import {
  ONBOARDING_QUESTIONS,
  ONBOARDING_CONTEXT,
  CATEGORY_STATEMENTS,
} from '../config/onboarding-questions';
import { SelectionService } from './selection';

@Injectable({
  providedIn: 'root',
})
export class FlowService {
  private flowState = new BehaviorSubject<FlowState>({
    questions: [],
    currentQuestionIndex: 0,
    answers: new Map(),
    isComplete: false,
    progress: {
      currentQuestionIndex: 0,
      totalQuestions: 0,
      answeredQuestions: 0,
      categoryProgress: [],
    },
  });

  flowState$ = this.flowState.asObservable();

  constructor(
    private questionFactory: QuestionFactory,
    private selectionService: SelectionService
  ) {}

  // Initialize flow with selected subcategories
  initializeFlow(
    selectedSubcategoryIds: string[],
    categories: Category[]
  ): void {
    const questions = this.buildQuestionList(
      selectedSubcategoryIds,
      categories
    );
    const progress = this.buildInitialProgress(
      selectedSubcategoryIds,
      categories
    );

    // Calculate total questions excluding statements
    const totalActualQuestions = questions.filter(
      (q) => q.type !== 'statement'
    ).length;

    this.flowState.next({
      questions,
      currentQuestionIndex: 0,
      answers: new Map(),
      isComplete: false,
      progress: {
        currentQuestionIndex: 0,
        totalQuestions: totalActualQuestions,
        answeredQuestions: 0,
        categoryProgress: progress,
      },
    });
  }

  // Initialize flow from user selections (called from Select page)
  initializeFlowFromSelections(): void {
    const selectedIds = this.selectionService.getSelectedSubcategoryIds();
    const categories = this.selectionService.getCategories();

    // Build linear question list from selected subcategories
    const selectedQuestions = this.buildQuestionList(selectedIds, categories);

    // Add onboarding questions at the beginning
    const onboardingQuestions = this.buildOnboardingQuestions();

    const allQuestions = [...onboardingQuestions, ...selectedQuestions];

    // Build progress tracking
    const progress = this.buildInitialProgress(selectedIds, categories);

    // Find the first non-statement question to start at
    let initialQuestionIndex = 0;
    while (
      initialQuestionIndex < allQuestions.length &&
      allQuestions[initialQuestionIndex].type === 'statement'
    ) {
      initialQuestionIndex++;
    }

    // Calculate total questions excluding statements
    const totalActualQuestions = allQuestions.filter(
      (q) => q.type !== 'statement'
    ).length;

    this.flowState.next({
      questions: allQuestions,
      currentQuestionIndex: initialQuestionIndex,
      answers: new Map(),
      isComplete: initialQuestionIndex >= allQuestions.length,
      progress: {
        currentQuestionIndex: initialQuestionIndex,
        totalQuestions: totalActualQuestions,
        answeredQuestions: 0,
        categoryProgress: progress,
      },
    });
  }

  // Get current question
  getCurrentQuestion(): BaseQuestion | null {
    const state = this.flowState.value;
    if (state.currentQuestionIndex >= state.questions.length) {
      return null;
    }
    return state.questions[state.currentQuestionIndex] || null;
  }

  // Handle user answer: save answer, move to next question, update state
  handleUserAnswer(answer: any, questionId: string): void {
    const state = this.flowState.value;
    const currentQuestion = this.getCurrentQuestion();

    if (!currentQuestion || currentQuestion.id !== questionId) {
      console.warn('🔴 Question not found or not current');
      return;
    }

    // Save answer
    const newAnswers = new Map(state.answers);
    newAnswers.set(questionId, answer);

    // 📊 COMPREHENSIVE ANSWER LOGGING
    console.log('🎯 ==== ANSWER SUBMITTED ====');
    console.log('📝 Question ID:', questionId);
    console.log('📝 Question Prompt:', currentQuestion.prompt);
    console.log('📝 Question Type:', currentQuestion.type);
    console.log('📝 Question CategoryId:', currentQuestion.categoryId);
    console.log('📝 Question SubcategoryId:', currentQuestion.subcategoryId);
    console.log('✅ Answer Value:', answer);
    console.log('📊 ALL ANSWERS SO FAR:');

    // Convert Map to array for better logging
    const answersArray = Array.from(newAnswers.entries()).map(([id, value]) => {
      const question = state.questions.find((q) => q.id === id);
      return {
        questionId: id,
        questionPrompt: question?.prompt || 'Unknown',
        questionType: question?.type || 'Unknown',
        answer: value,
        answerType: typeof value,
        answerLength: Array.isArray(value) ? value.length : undefined,
      };
    });

    console.table(answersArray);
    console.log('🔢 Total Answers:', answersArray.length);
    console.log('🎯 ==== END ANSWER LOG ====');

    // Move to next question and advance through any consecutive statements
    let nextIndex = state.currentQuestionIndex + 1;

    // Skip through any consecutive statements
    while (
      nextIndex < state.questions.length &&
      state.questions[nextIndex].type === 'statement'
    ) {
      nextIndex++;
    }

    const isComplete = nextIndex >= state.questions.length;

    // Update progress (only for actual questions, not statements)
    let newProgress = state.progress;
    if (currentQuestion.type !== 'statement') {
      newProgress = this.updateProgress(state.progress, currentQuestion);
      console.log('🔄 Progress updated for question:', currentQuestion.id);
    } else {
      console.log(
        '⏭️  Skipping progress update for statement:',
        currentQuestion.id
      );
    }

    // Update state
    this.flowState.next({
      ...state,
      currentQuestionIndex: nextIndex,
      answers: newAnswers,
      isComplete,
      progress: {
        ...newProgress,
        currentQuestionIndex: nextIndex,
      },
    });
  }

  // Move to next question
  nextQuestion(): boolean {
    const state = this.flowState.value;
    const nextIndex = state.currentQuestionIndex + 1;

    if (nextIndex >= state.questions.length) {
      return false; // Flow complete
    }

    this.flowState.next({
      ...state,
      currentQuestionIndex: nextIndex,
      progress: {
        ...state.progress,
        currentQuestionIndex: nextIndex,
      },
    });

    return true;
  }

  // Move to previous question
  previousQuestion(): boolean {
    const state = this.flowState.value;
    const prevIndex = state.currentQuestionIndex - 1;

    if (prevIndex < 0) {
      return false;
    }

    this.flowState.next({
      ...state,
      currentQuestionIndex: prevIndex,
      progress: {
        ...state.progress,
        currentQuestionIndex: prevIndex,
      },
    });

    return true;
  }

  // Get all answers for API call
  getAllAnswers(): Map<string, any> {
    return this.flowState.value.answers;
  }

  // Check if flow is complete
  isFlowComplete(): boolean {
    return this.flowState.value.isComplete;
  }

  // Get current state for component access
  getCurrentState(): FlowState {
    return this.flowState.value;
  }

  // Set current question index (for navigation)
  setCurrentQuestionIndex(index: number): void {
    const state = this.flowState.value;
    if (index >= 0 && index < state.questions.length) {
      const isComplete = index >= state.questions.length;
      const newState = {
        ...state,
        currentQuestionIndex: index,
        isComplete,
        progress: {
          ...state.progress,
          currentQuestionIndex: index,
        },
      };
      this.flowState.next(newState);
    }
  }

  // Answer current question (legacy method for compatibility)
  answerQuestion(answer: any): void {
    const currentQuestion = this.getCurrentQuestion();
    if (currentQuestion) {
      this.handleUserAnswer(answer, currentQuestion.id);
    }
  }

  // Private helper methods
  private buildQuestionList(
    selectedSubcategoryIds: string[],
    categories: Category[]
  ): BaseQuestion[] {
    const questions: BaseQuestion[] = [];

    // Track which categories have questions to avoid empty category statements
    const categoriesWithQuestions = new Set<string>();

    // First pass: collect all questions and track which categories have questions
    categories.forEach((category) => {
      let categoryHasQuestions = false;

      category.subcategories.forEach((subcategory) => {
        if (selectedSubcategoryIds.includes(subcategory.id)) {
          categoryHasQuestions = true;
        }
      });

      if (categoryHasQuestions) {
        categoriesWithQuestions.add(category.name);
      }
    });

    // Second pass: build questions with category statements
    let questionOrder = 0;
    categories.forEach((category) => {
      // Only add category statement if this category has questions
      if (categoriesWithQuestions.has(category.name)) {
        const categoryStatement = CATEGORY_STATEMENTS.find(
          (stmt) => stmt.categoryId === category.name
        );

        if (categoryStatement) {
          const statementContext: QuestionContext = {
            categoryId: category.name,
            subcategoryId: 'statement',
            order: questionOrder++,
          };

          const statement = this.questionFactory.createQuestion(
            categoryStatement,
            statementContext
          );
          questions.push(statement);
        }

        // Add questions from selected subcategories
        category.subcategories.forEach((subcategory) => {
          if (selectedSubcategoryIds.includes(subcategory.id)) {
            const subcategoryContext: QuestionContext = {
              categoryId: category.name,
              subcategoryId: subcategory.id,
              order: questionOrder,
            };

            const subcategoryQuestions =
              this.questionFactory.createQuestionsFromJson(
                subcategory.questions,
                subcategoryContext
              );
            questions.push(...subcategoryQuestions);
            questionOrder += subcategoryQuestions.length;
          }
        });
      }
    });

    return questions;
  }

  private buildOnboardingQuestions(): BaseQuestion[] {
    return ONBOARDING_QUESTIONS.map((question, index) => {
      const context: QuestionContext = {
        ...ONBOARDING_CONTEXT,
        order: index,
      };
      return this.questionFactory.createQuestion(question, context);
    });
  }

  private buildInitialProgress(
    selectedSubcategoryIds: string[],
    categories: Category[]
  ): CategoryProgress[] {
    const progress: CategoryProgress[] = [];

    // Add onboarding progress - only count actual questions, not statements
    const onboardingActualQuestions = ONBOARDING_QUESTIONS.filter(
      (q) => q.type !== 'statement'
    ).length;
    progress.push({
      categoryId: 'onboarding',
      categoryLabel: 'Introduction',
      categoryEmoji: '👋',
      subcategories: [
        {
          subcategoryId: 'introduction',
          subcategoryLabel: 'Getting Started',
          totalQuestions: onboardingActualQuestions,
          answeredQuestions: 0,
          isComplete: false,
        },
      ],
    });

    // Add progress for each selected category
    categories.forEach((category) => {
      const selectedSubcategories = category.subcategories.filter((sub) =>
        selectedSubcategoryIds.includes(sub.id)
      );

      if (selectedSubcategories.length > 0) {
        const categoryProgress: CategoryProgress = {
          categoryId: category.name,
          categoryLabel: category.label,
          categoryEmoji: category.emoji,
          subcategories: selectedSubcategories.map((sub) => ({
            subcategoryId: sub.id,
            subcategoryLabel: sub.label,
            totalQuestions: sub.questions.length,
            answeredQuestions: 0,
            isComplete: false,
          })),
        };
        progress.push(categoryProgress);
      }
    });

    return progress;
  }

  private updateProgress(
    progress: FlowProgress,
    answeredQuestion: QuestionWithContext
  ): FlowProgress {
    console.log('🔍 ==== PROGRESS MATCHING DEBUG ====');
    console.log('🎯 Answered Question:', {
      categoryId: answeredQuestion.categoryId,
      subcategoryId: answeredQuestion.subcategoryId,
      id: answeredQuestion.id,
    });
    console.log('📊 Available Progress Categories:');
    progress.categoryProgress.forEach((cat) => {
      console.log(`  📂 ${cat.categoryLabel} (${cat.categoryId})`);
      cat.subcategories.forEach((sub) => {
        console.log(
          `    📁 ${sub.subcategoryLabel} (${sub.subcategoryId}) - ${sub.answeredQuestions}/${sub.totalQuestions}`
        );
      });
    });
    console.log('🔍 ==== END PROGRESS DEBUG ====');

    const newCategoryProgress = progress.categoryProgress.map((cat) => ({
      ...cat,
      subcategories: cat.subcategories.map((sub) => {
        // Special handling for onboarding questions - they all count toward "Getting Started"
        const isOnboardingMatch =
          answeredQuestion.categoryId === 'onboarding' &&
          cat.categoryId === 'onboarding' &&
          sub.subcategoryId === 'introduction';

        // Normal matching for other questions
        const isNormalMatch =
          answeredQuestion.categoryId !== 'onboarding' &&
          sub.subcategoryId === answeredQuestion.subcategoryId;

        if (isOnboardingMatch || isNormalMatch) {
          const newAnsweredQuestions = sub.answeredQuestions + 1;
          const isComplete = newAnsweredQuestions >= sub.totalQuestions;

          // 📊 PROGRESS LOGGING
          console.log('🎯 ==== PROGRESS UPDATE ====');
          console.log('📂 Category:', cat.categoryLabel);
          console.log('📁 Subcategory:', sub.subcategoryLabel);
          console.log(
            '🔍 Match Type:',
            isOnboardingMatch ? 'Onboarding' : 'Normal'
          );
          console.log('📝 Question Category:', answeredQuestion.categoryId);
          console.log(
            '📝 Question Subcategory:',
            answeredQuestion.subcategoryId
          );
          console.log(
            '📊 Progress:',
            `${newAnsweredQuestions}/${sub.totalQuestions}`
          );
          console.log('✅ Complete:', isComplete);
          console.log('🎯 ==== END PROGRESS LOG ====');

          return {
            ...sub,
            answeredQuestions: newAnsweredQuestions,
            isComplete,
          };
        }
        return sub;
      }),
    }));

    return {
      ...progress,
      answeredQuestions: progress.answeredQuestions + 1,
      categoryProgress: newCategoryProgress,
    };
  }

  // Get current subcategory being worked on
  getCurrentSubcategoryId(): string | null {
    const state = this.flowState.value;
    const currentQuestion = this.getCurrentQuestion();
    if (!currentQuestion) return null;

    // Handle onboarding questions
    if (currentQuestion.categoryId === 'onboarding') {
      return 'introduction';
    }

    return currentQuestion.subcategoryId;
  }

  // Check if a subcategory is currently being worked on
  isSubcategoryCurrent(subcategoryId: string): boolean {
    return this.getCurrentSubcategoryId() === subcategoryId;
  }
}
