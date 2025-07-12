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
      map((state) => state.messages || [])
    );
  }

  ngOnInit() {
    // Initialize flow from user selections
    this.flowService.initializeFlowFromSelections();

    // Start the chat flow after a brief delay to ensure initialization
    setTimeout(() => {
      this.flowService.startChatFlow();
    }, 100);
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
    return {
      question: {
        id: message.relatedQuestionId || message.id,
        prompt: message.content,
        type,
        order: (message as any).order ?? 0,
        categoryId: (message as any).categoryId ?? 'unknown',
        subcategoryId: (message as any).subcategoryId ?? 'unknown',
        // Add more fields as needed for each question type
        ...((message as any).options
          ? { options: (message as any).options }
          : {}),
        ...((message as any).range ? { range: (message as any).range } : {}),
        ...((message as any).default
          ? { default: (message as any).default }
          : {}),
      },
      isSent: message.isSent,
      answer: message.answer, // Use the answer property for sent mode
      onAnswer: (answer: any) => this.onAnswerSubmitted(answer, message),
    };
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
    }
  }

  getCurrentQuestion(): BaseQuestion | null {
    return this.flowService.getCurrentQuestion();
  }

  getCurrentQuestionIndex(): number {
    const state = this.flowService.getCurrentState();
    return state.progress.currentQuestionIndex;
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

  // Answer current question and move to next
  answerCurrentQuestion(): void {
    const currentQuestion = this.getCurrentQuestion();
    if (!currentQuestion) return;

    // For now, just store a placeholder answer
    const placeholderAnswer = `Answer to: ${currentQuestion.prompt}`;
    this.flowService.answerQuestion(placeholderAnswer);

    // Move to next question
    this.nextQuestion();
  }

  // Move to next question
  nextQuestion(): void {
    const success = this.flowService.nextQuestion();
    if (!success) {
      // Flow is complete
      this.completeFlow();
    }
  }

  // Navigate back to select page
  goToSelect(): void {
    this.router.navigate(['/select']);
  }

  completeFlow() {
    this.router.navigate(['/loading']);
  }
}
