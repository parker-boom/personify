import { Component, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  BaseQuestionComponent,
  QuestionComponentConfig,
} from '../base-question/base-question';
import { TextBubbleWrapper } from '../text-bubble-wrapper/text-bubble-wrapper';

@Component({
  selector: 'app-short-text-question',
  standalone: true,
  imports: [CommonModule, FormsModule, TextBubbleWrapper],
  template: `
    <app-text-bubble-wrapper [config]="bubbleConfig" (onSend)="handleSend()">
      <div class="short-text-container">
        <!-- Unsent Mode: Input Field -->
        <div *ngIf="!config.isSent" class="input-container">
          <input
            type="text"
            [(ngModel)]="answer"
            (ngModelChange)="onAnswerChange()"
            (keyup.enter)="handleSend()"
            placeholder="Type your answer..."
            class="short-text-input"
            [disabled]="config.isSent || false"
          />
        </div>

        <!-- Sent Mode: Display Text -->
        <div *ngIf="config.isSent" class="sent-text">
          {{ answer || 'Your answer here' }}
        </div>
      </div>
    </app-text-bubble-wrapper>
  `,
  styleUrls: ['./short-text-question.scss'],
})
export class ShortTextQuestionComponent
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

    // Set max-width based on sent state
    if (this.config.isSent) {
      // sent
      this.bubbleConfig.maxWidth = '620px';
    } else {
      // not sent
      this.bubbleConfig.maxWidth = '300px';
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
}
