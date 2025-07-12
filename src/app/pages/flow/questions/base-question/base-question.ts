import { Component, Input, Output, EventEmitter } from '@angular/core';
import { BaseQuestion } from '../../../../shared/models/question.interface';
import {
  TextBubbleWrapper,
  TextBubbleConfig,
} from '../text-bubble-wrapper/text-bubble-wrapper';

export interface QuestionComponentConfig {
  question: BaseQuestion;
  isSent?: boolean;
  onAnswer?: (answer: any) => void;
  answer?: any; // Add answer property for sent mode
}

@Component({
  template: '',
  standalone: true,
})
export abstract class BaseQuestionComponent {
  @Input() config!: QuestionComponentConfig;
  @Output() answerSubmitted = new EventEmitter<any>();

  protected bubbleConfig: TextBubbleConfig = {
    isBotMessage: false,
    isSent: false,
    showProfilePicture: false,
    maxWidth: '400px',
    showSendButton: true,
  };

  protected answer: any = null;

  ngOnInit() {
    this.bubbleConfig.isSent = this.config.isSent || false;
    // Initialize answer from config.answer if present
    if (typeof this.config.answer !== 'undefined') {
      this.answer = this.config.answer;
    }
    this.initializeQuestion();
  }

  protected abstract initializeQuestion(): void;

  protected submitAnswer(): void {
    if (this.answer !== null && this.answer !== undefined) {
      this.answerSubmitted.emit(this.answer);
      if (this.config.onAnswer) {
        this.config.onAnswer(this.answer);
      }
    }
  }

  protected handleSend(): void {
    this.submitAnswer();
  }
}
