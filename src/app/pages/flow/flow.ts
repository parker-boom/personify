import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FlowService } from '../../shared/services/flow';
import {
  BaseQuestion,
  QuestionType,
} from '../../shared/models/question.interface';
import { Observable, map } from 'rxjs';
import { LayoutComponent } from '../../shared/components/layout/layout';
import { ShortTextQuestionComponent } from './questions/short-text-question/short-text-question';
import { LongTextQuestionComponent } from './questions/long-text-question/long-text-question';
import { MultiSelectQuestionComponent } from './questions/multi-select-question/multi-select-question';
import { SliderQuestionComponent } from './questions/slider-question/slider-question';
import { DropdownQuestionComponent } from './questions/dropdown-question/dropdown-question';
import { ToggleQuestionComponent } from './questions/toggle-question/toggle-question';
import { ChatMessage } from '../../shared/models/chat-message.interface';
import { TextBubbleWrapper } from './questions/text-bubble-wrapper/text-bubble-wrapper';
import { FlowState } from '../../shared/models/flow.interface';

@Component({
  selector: 'app-flow',
  standalone: true,
  imports: [
    CommonModule,
    LayoutComponent,
    ShortTextQuestionComponent,
    LongTextQuestionComponent,
    MultiSelectQuestionComponent,
    SliderQuestionComponent,
    DropdownQuestionComponent,
    ToggleQuestionComponent,
    TextBubbleWrapper,
  ],
  templateUrl: './flow.html',
  styleUrl: './flow.scss',
})
export class Flow implements OnInit {
  messages$: Observable<ChatMessage[]>;

  constructor(private flowService: FlowService, private router: Router) {
    this.messages$ = this.flowService.flowState$.pipe(
      map((state) => this.generateChatMessages(state))
    );
  }

  ngOnInit() {
    // Initialize flow from user selections
    this.flowService.initializeFlowFromSelections();
  }

  // Generate chat messages from FlowService state
  private generateChatMessages(state: FlowState): ChatMessage[] {
    const messages: ChatMessage[] = [];

    // Defensive checks
    if (!state || !state.questions || state.questions.length === 0) {
      console.warn('FlowService state not properly initialized:', state);
      return messages;
    }

    // Generate messages for all questions up to and including current
    // FlowService now handles advancing through statements automatically
    for (
      let i = 0;
      i <= state.currentQuestionIndex && i < state.questions.length;
      i++
    ) {
      const question = state.questions[i];
      const hasAnswer = state.answers.has(question.id);
      const answer = state.answers.get(question.id);
      const isCurrentQuestion = i === state.currentQuestionIndex;

      if (question.type === 'statement') {
        // Statement messages are always from bot and always sent
        messages.push({
          id: `statement-${question.id}`,
          sender: 'bot',
          type: 'statement',
          content: question.prompt,
          isSent: true,
          timestamp: Date.now(),
          showProfilePicture:
            i === 0 || state.questions[i - 1]?.type !== 'statement',
        });
      } else {
        // Bot question message
        messages.push({
          id: `question-${question.id}`,
          sender: 'bot',
          type: 'question',
          content: question.prompt,
          questionType: question.type,
          isSent: true,
          timestamp: Date.now(),
          showProfilePicture: true,
        });

        // User response message
        const userMessage: ChatMessage = {
          id: `input-${question.id}`,
          sender: 'user',
          type: 'question',
          content: question.prompt,
          questionType: question.type,
          relatedQuestionId: question.id,
          isSent: !isCurrentQuestion, // Current question is unsent, others are sent
          answer: hasAnswer ? answer : undefined,
          timestamp: Date.now(),
        };

        messages.push(userMessage);
      }
    }

    return messages;
  }

  // Returns the config for a chat bubble (bot/user, sent, profile pic, etc.)
  getBubbleConfig(message: ChatMessage, index: number) {
    return {
      isBotMessage: message.sender === 'bot',
      isSent: message.sender === 'bot' ? true : message.isSent, // Bot messages are always "sent"
      showProfilePicture: message.showProfilePicture,
      maxWidth: message.sender === 'bot' ? '420px' : '340px',
      showSendButton: message.sender === 'user' && !message.isSent,
      sendButtonDisabled: false, // Let the question component handle this
    };
  }

  // Returns the config for a question component (for user input or sent answer)
  getQuestionConfig(message: ChatMessage) {
    // Ensure type is always a valid QuestionType
    const type: QuestionType =
      (message.questionType as QuestionType) || 'short_text';

    const config = {
      question: {
        id: message.relatedQuestionId || message.id,
        prompt: message.content,
        type,
        order: 0, // Order not needed for display
        categoryId: 'unknown', // Category not needed for display
        subcategoryId: 'unknown', // Subcategory not needed for display
        // Add more fields as needed for each question type
        ...this.getQuestionTypeSpecificConfig(message),
      },
      isSent: message.isSent,
      answer: message.answer, // Use the answer property for sent mode
    };

    return config;
  }

  // Get question type specific configuration from FlowService
  private getQuestionTypeSpecificConfig(message: ChatMessage): any {
    if (!message.relatedQuestionId) return {};

    const state = this.flowService.getCurrentState();
    const question = state.questions.find(
      (q) => q.id === message.relatedQuestionId
    );

    if (!question) return {};

    // Extract type-specific properties
    const config: any = {};

    // Add options for multi-select, dropdown, select questions
    if ('options' in question && question.options) {
      config.options = question.options;
    }

    // Add range for slider questions
    if ('range' in question && question.range) {
      config.range = question.range;
    }

    // Add default values
    if ('default' in question && question.default !== undefined) {
      config.default = question.default;
    }

    // Add placeholder for text questions
    if ('placeholder' in question && question.placeholder) {
      config.placeholder = question.placeholder;
    }

    // Add validation constraints
    if ('maxLength' in question && question.maxLength) {
      config.maxLength = question.maxLength;
    }

    if ('minSelections' in question && question.minSelections) {
      config.minSelections = question.minSelections;
    }

    if ('maxSelections' in question && question.maxSelections) {
      config.maxSelections = question.maxSelections;
    }

    return config;
  }

  // Called when the user clicks the send button on a draft message
  onSend(message: ChatMessage) {
    // The question component should handle answer submission
  }

  // Called when a user submits an answer to a question
  onAnswerSubmitted(answer: any, message: ChatMessage) {
    // Handle the answer through the FlowService
    if (message.relatedQuestionId) {
      this.flowService.handleUserAnswer(answer, message.relatedQuestionId);
    } else {
      console.error('No relatedQuestionId found in message:', message);
    }
  }

  getCurrentQuestion(): BaseQuestion | null {
    return this.flowService.getCurrentQuestion();
  }

  getCurrentQuestionIndex(): number {
    const state = this.flowService.getCurrentState();
    return state.currentQuestionIndex;
  }

  getTotalQuestions(): number {
    const state = this.flowService.getCurrentState();
    return state.questions.length;
  }

  getAllQuestions(): BaseQuestion[] {
    const state = this.flowService.getCurrentState();
    return state.questions;
  }

  isFlowComplete(): boolean {
    return this.flowService.isFlowComplete();
  }

  // Navigate back to select page
  goToSelect(): void {
    this.router.navigate(['/select']);
  }

  completeFlow() {
    this.router.navigate(['/loading']);
  }
}
