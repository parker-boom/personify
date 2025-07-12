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
import { ChatMessage } from '../models/chat-message.interface';

@Injectable({
  providedIn: 'root',
})
export class FlowService {
  private flowState = new BehaviorSubject<FlowState>({
    questions: [],
    answers: new Map(),
    progress: {
      currentQuestionIndex: 0,
      totalQuestions: 0,
      answeredQuestions: 0,
      categoryProgress: [],
    },
    messages: [], // Chat message history
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

    this.flowState.next({
      questions,
      answers: new Map(),
      progress: {
        currentQuestionIndex: 0,
        totalQuestions: questions.length,
        answeredQuestions: 0,
        categoryProgress: progress,
      },
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
        categoryProgress: progress,
      },
      messages: [],
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
      progress: newProgress,
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
        currentQuestionIndex: nextIndex,
      },
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
          currentQuestionIndex: index,
        },
      };
      this.flowState.next(newState);
    }
  }

  // Private helper methods
  private buildQuestionList(
    selectedSubcategoryIds: string[],
    categories: Category[]
  ): BaseQuestion[] {
    const questions: BaseQuestion[] = [];

    console.log('buildQuestionList - Selected IDs:', selectedSubcategoryIds);
    console.log('buildQuestionList - Categories:', categories);

    // Track which categories have questions to avoid empty category statements
    const categoriesWithQuestions = new Set<string>();

    // First pass: collect all questions and track which categories have questions
    categories.forEach((category) => {
      console.log(`Processing category: ${category.name}`);
      let categoryHasQuestions = false;

      category.subcategories.forEach((subcategory) => {
        console.log(
          `  Checking subcategory: ${subcategory.id} (${subcategory.name})`
        );
        if (selectedSubcategoryIds.includes(subcategory.id)) {
          console.log(
            `    ✓ Selected! Adding ${subcategory.questions.length} questions`
          );
          categoryHasQuestions = true;
        } else {
          console.log(`    ✗ Not selected`);
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
          console.log(`Adding category statement for ${category.name}`);
          const statementContext: QuestionContext = {
            categoryId: category.name,
            subcategoryId: 'category-intro',
            order: questionOrder++,
          };

          const statementQuestion = this.questionFactory.createQuestion(
            categoryStatement,
            statementContext
          );
          questions.push(statementQuestion);
        }
      }

      // Add questions for this category
      category.subcategories.forEach((subcategory) => {
        if (selectedSubcategoryIds.includes(subcategory.id)) {
          console.log(
            `    ✓ Adding ${subcategory.questions.length} questions for ${subcategory.name}`
          );
          const context: QuestionContext = {
            categoryId: category.name,
            subcategoryId: subcategory.id,
            order: questionOrder,
          };

          const categoryQuestions =
            this.questionFactory.createQuestionsFromJson(
              subcategory.questions,
              context
            );
          questions.push(...categoryQuestions);
          questionOrder += categoryQuestions.length;
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

  private buildInitialProgress(
    selectedSubcategoryIds: string[],
    categories: Category[]
  ): CategoryProgress[] {
    const progress: CategoryProgress[] = [];

    // Add Introduction category for onboarding questions
    const onboardingQuestions = this.buildOnboardingQuestions();
    if (onboardingQuestions.length > 0) {
      progress.push({
        categoryId: 'introduction',
        categoryLabel: 'Introduction',
        categoryEmoji: '👋',
        subcategories: [
          {
            subcategoryId: 'introduction',
            subcategoryLabel: 'Getting to know you',
            totalQuestions: onboardingQuestions.length,
            answeredQuestions: 0,
            isComplete: false,
          },
        ],
      });
    }

    // Add categories with selected subcategories
    categories.forEach((category) => {
      const selectedSubs = category.subcategories.filter((sub) =>
        selectedSubcategoryIds.includes(sub.id)
      );

      if (selectedSubs.length > 0) {
        progress.push({
          categoryId: category.name,
          categoryLabel: category.label,
          categoryEmoji: category.emoji,
          subcategories: selectedSubs.map((sub) => ({
            subcategoryId: sub.id,
            subcategoryLabel: sub.label,
            totalQuestions: sub.questions.length,
            answeredQuestions: 0,
            isComplete: false,
          })),
        });
      }
    });

    return progress;
  }

  private updateProgress(
    progress: FlowProgress,
    answeredQuestion: QuestionWithContext
  ): FlowProgress {
    const newCategoryProgress = progress.categoryProgress.map((cat) => ({
      ...cat,
      subcategories: cat.subcategories.map((sub) => {
        // Handle both regular subcategories and introduction category
        const isMatchingSubcategory =
          sub.subcategoryId === answeredQuestion.subcategoryId;
        const isIntroductionQuestion =
          answeredQuestion.categoryId === 'onboarding' &&
          cat.categoryId === 'introduction';

        if (isMatchingSubcategory || isIntroductionQuestion) {
          const newAnsweredQuestions = sub.answeredQuestions + 1;
          return {
            ...sub,
            answeredQuestions: newAnsweredQuestions,
            isComplete: newAnsweredQuestions >= sub.totalQuestions,
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

  // NEW: Add a method to push a message to the chat history
  private addMessage(message: ChatMessage) {
    const state = this.flowState.value;
    const messages = state.messages ? [...state.messages] : [];
    messages.push(message);
    this.flowState.next({
      ...state,
      messages,
    });
  }

  // NEW: Add a method to clear/reset messages (for new flow)
  private clearMessages() {
    const state = this.flowState.value;
    this.flowState.next({
      ...state,
      messages: [],
    });
  }

  // NEW: Start the chat flow with initial messages
  startChatFlow(): void {
    this.clearMessages();
    const state = this.flowState.value;

    if (state.questions.length === 0) {
      console.warn('No questions available for chat flow');
      return;
    }

    // Schedule the first question(s) to appear
    this.scheduleNextBotMessages();
  }

  // NEW: Handle user answer and schedule next bot messages
  handleUserAnswer(answer: any, questionId: string): void {
    const state = this.flowState.value;
    const currentQuestion = this.getCurrentQuestion();

    if (!currentQuestion || currentQuestion.id !== questionId) {
      console.warn('Question not found or not current');
      return;
    }

    // Add user answer to chat history
    const userMessage: ChatMessage = {
      id: `answer-${questionId}`,
      sender: 'user',
      type: 'answer',
      content: answer,
      relatedQuestionId: questionId,
      isSent: true,
      timestamp: Date.now(),
    };
    this.addMessage(userMessage);

    // Store answer in state
    const newAnswers = new Map(state.answers);
    newAnswers.set(questionId, answer);

    // Update progress
    const newProgress = this.updateProgress(state.progress, currentQuestion);

    // Update state
    this.flowState.next({
      ...state,
      answers: newAnswers,
      progress: newProgress,
    });

    // Move to next question
    const hasNext = this.nextQuestion();

    if (hasNext) {
      // Schedule next bot messages after 1 second delay
      setTimeout(() => {
        this.scheduleNextBotMessages();
      }, 1000);
    } else {
      // Flow complete - could trigger completion logic here
      console.log('Chat flow complete');
    }
  }

  // NEW: Schedule bot messages to appear with delays
  private scheduleNextBotMessages(): void {
    const state = this.flowState.value;
    const currentQuestion = this.getCurrentQuestion();

    if (!currentQuestion) {
      console.warn('No current question to schedule');
      return;
    }

    // Check if there's a statement before this question
    const currentIndex = state.progress.currentQuestionIndex;
    const previousQuestion =
      currentIndex > 0 ? state.questions[currentIndex - 1] : null;

    let messagesToSchedule: ChatMessage[] = [];
    let totalDelay = 0;

    // If previous question was a statement, schedule it first
    if (previousQuestion && previousQuestion.type === 'statement') {
      const statementMessage: ChatMessage = {
        id: `statement-${previousQuestion.id}`,
        sender: 'bot',
        type: 'statement',
        content: previousQuestion.prompt,
        isSent: false,
        timestamp: Date.now(),
        showProfilePicture: false, // Will be set later
      };
      messagesToSchedule.push(statementMessage);
      totalDelay += 2000; // 2 second delay for statement
    }

    // Schedule the current question
    const questionMessage: ChatMessage = {
      id: `question-${currentQuestion.id}`,
      sender: 'bot',
      type: 'question',
      content: currentQuestion.prompt,
      questionType: currentQuestion.type,
      isSent: false,
      timestamp: Date.now(),
      showProfilePicture: true, // Always show profile pic on last bot message
    };
    messagesToSchedule.push(questionMessage);

    // Add messages to chat history (unsent)
    messagesToSchedule.forEach((message) => {
      this.addMessage(message);
    });

    // Schedule message sending with delays
    messagesToSchedule.forEach((message, index) => {
      const delay = index === 0 ? 2000 : 2000; // 2s for first, 2s for second

      setTimeout(() => {
        this.markMessageAsSent(message.id);

        // If this is the last bot message, schedule user input after 2 seconds
        if (index === messagesToSchedule.length - 1) {
          setTimeout(() => {
            this.scheduleUserInput(currentQuestion);
          }, 2000);
        }
      }, delay);
    });
  }

  // NEW: Schedule user input to appear
  private scheduleUserInput(question: BaseQuestion): void {
    const userInputMessage: ChatMessage = {
      id: `input-${question.id}`,
      sender: 'user',
      type: 'question',
      content: question.prompt,
      questionType: question.type,
      relatedQuestionId: question.id,
      isSent: false,
      timestamp: Date.now(),
    };

    this.addMessage(userInputMessage);
  }

  // NEW: Mark a message as sent (visible in chat)
  private markMessageAsSent(messageId: string): void {
    const state = this.flowState.value;
    const messages = state.messages ? [...state.messages] : [];

    const messageIndex = messages.findIndex((msg) => msg.id === messageId);
    if (messageIndex !== -1) {
      messages[messageIndex] = {
        ...messages[messageIndex],
        isSent: true,
      };

      this.flowState.next({
        ...state,
        messages,
      });
    }
  }

  // NEW: Update profile picture visibility for bot messages
  private updateProfilePictureVisibility(): void {
    const state = this.flowState.value;
    const messages = state.messages ? [...state.messages] : [];

    // Find the last bot message and ensure it has profile picture
    for (let i = messages.length - 1; i >= 0; i--) {
      if (messages[i].sender === 'bot') {
        messages[i] = {
          ...messages[i],
          showProfilePicture: true,
        };
        break;
      }
    }

    this.flowState.next({
      ...state,
      messages,
    });
  }
}
