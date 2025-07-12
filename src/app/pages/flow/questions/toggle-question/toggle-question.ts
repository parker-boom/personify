import { Component, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  BaseQuestionComponent,
  QuestionComponentConfig,
} from '../base-question/base-question';
import { TextBubbleWrapper } from '../text-bubble-wrapper/text-bubble-wrapper';
import { ToggleQuestion } from '../../../../shared/models/question.interface';

@Component({
  selector: 'app-toggle-question',
  standalone: true,
  imports: [CommonModule, TextBubbleWrapper],
  template: `
    <app-text-bubble-wrapper [config]="bubbleConfig" (onSend)="handleSend()">
      <div class="toggle-question-container">
        <!-- Unsent Mode: Interactive Toggle -->
        <div *ngIf="!config.isSent" class="toggle-interactive">
          <div class="toggle-box">
            <div
              class="toggle-option yes"
              [class.selected]="selected === true"
              (click)="select(true)"
            >
              YES
            </div>
            <div class="toggle-divider"></div>
            <div
              class="toggle-option no"
              [class.selected]="selected === false"
              (click)="select(false)"
            >
              NO
            </div>
          </div>
        </div>
        <!-- Sent Mode: Display Selected Value -->
        <div *ngIf="config.isSent" class="sent-text">
          {{ selected === true ? 'YES' : selected === false ? 'NO' : '' }}
        </div>
      </div>
    </app-text-bubble-wrapper>
  `,
  styleUrls: ['./toggle-question.scss'],
})
export class ToggleQuestionComponent
  extends BaseQuestionComponent
  implements OnInit, OnChanges
{
  selected: boolean | null = null;

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
    this.bubbleConfig.maxWidth = '350px';
  }

  protected initializeQuestion(): void {
    this.selected = null;
    this.updateSendButtonState();
  }

  select(value: boolean): void {
    this.selected = value;
    this.updateSendButtonState();
  }

  protected override handleSend(): void {
    if (this.selected !== null) {
      this.submitAnswer();
    }
  }

  private updateSendButtonState(): void {
    this.bubbleConfig.sendButtonDisabled = !this.isSendEnabled;
  }

  protected get isSendEnabled(): boolean {
    return this.selected !== null;
  }

  protected override submitAnswer(): void {
    this.answer = this.selected ? 'YES' : 'NO';
    super.submitAnswer();
  }
}
