import { Component, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  BaseQuestionComponent,
  QuestionComponentConfig,
} from '../base-question/base-question';
import { TextBubbleWrapper } from '../text-bubble-wrapper/text-bubble-wrapper';

@Component({
  selector: 'app-long-text-question',
  standalone: true,
  imports: [CommonModule, FormsModule, TextBubbleWrapper],
  template: `
    <app-text-bubble-wrapper [config]="bubbleConfig" (onSend)="handleSend()">
      <div class="long-text-container">
        <!-- Unsent Mode: Input Field -->
        <div *ngIf="!config.isSent" class="input-container">
          <textarea
            [(ngModel)]="answer"
            (ngModelChange)="onAnswerChange()"
            (input)="onTextareaInput($event)"
            placeholder="Type your answer..."
            class="long-text-input"
            [disabled]="config.isSent || false"
            rows="1"
          ></textarea>
        </div>

        <!-- Sent Mode: Display Text -->
        <div *ngIf="config.isSent" class="sent-text">
          {{ answer || 'Your answer here' }}
        </div>
      </div>
    </app-text-bubble-wrapper>
  `,
  styleUrls: ['./long-text-question.scss'],
})
export class LongTextQuestionComponent
  extends BaseQuestionComponent
  implements OnInit, OnChanges
{
  override ngOnInit() {
    this.updateBubbleConfig();
    this.initializeQuestion();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['config']) {
      this.updateBubbleConfig();
    }
  }

  private updateBubbleConfig(): void {
    this.bubbleConfig.isSent = this.config.isSent || false;
    this.bubbleConfig.sendButtonDisabled = !this.isSendEnabled;

    if (this.config.isSent) {
      this.bubbleConfig.maxWidth = '620px';
    } else {
      this.bubbleConfig.maxWidth = '550px';
    }
  }

  protected initializeQuestion(): void {
    // Initialize with empty answer
    this.answer = '';
    this.updateSendButtonState();
  }

  protected override handleSend(): void {
    if (this.answer && this.answer.trim()) {
      this.submitAnswer();
    }
  }

  // Override to check if send button should be enabled
  protected get isSendEnabled(): boolean {
    return !!(this.answer && this.answer.trim());
  }

  private updateSendButtonState(): void {
    this.bubbleConfig.sendButtonDisabled = !this.isSendEnabled;
  }

  onAnswerChange(): void {
    this.updateSendButtonState();
  }

  onTextareaInput(event: Event): void {
    const textarea = event.target as HTMLTextAreaElement;
    textarea.rows = 1; // Reset rows to 1
    if (textarea.scrollHeight > textarea.offsetHeight) {
      textarea.rows = Math.ceil(textarea.scrollHeight / textarea.offsetHeight); // Expand rows if content exceeds height
    }
  }
}
