import { Component, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  BaseQuestionComponent,
  QuestionComponentConfig,
} from '../base-question/base-question';
import { TextBubbleWrapper } from '../text-bubble-wrapper/text-bubble-wrapper';
import { MultiSelectQuestion } from '../../../../shared/models/question.interface';

interface MultiSelectOption {
  value: string;
  selected: boolean;
}

@Component({
  selector: 'app-multi-select-question',
  standalone: true,
  imports: [CommonModule, TextBubbleWrapper],
  template: `
    <app-text-bubble-wrapper [config]="bubbleConfig" (onSend)="handleSend()">
      <div class="multi-select-container">
        <!-- Unsent Mode: Interactive Options -->
        <div *ngIf="!config.isSent" class="options-container">
          <div class="select-all-text">SELECT ALL THAT APPLY</div>
          <div class="options-grid">
            <button
              *ngFor="let option of options"
              class="option-button"
              [class.selected]="option.selected"
              (click)="toggleOption(option)"
              type="button"
            >
              {{ option.value }}
            </button>
          </div>
        </div>

        <!-- Sent Mode: Display Selected Options -->
        <div *ngIf="config.isSent" class="sent-options">
          <div class="options-grid">
            <div *ngFor="let option of selectedOptions" class="option-display">
              {{ option.value }}
            </div>
          </div>
        </div>
      </div>
    </app-text-bubble-wrapper>
  `,
  styleUrls: ['./multi-select-question.scss'],
})
export class MultiSelectQuestionComponent
  extends BaseQuestionComponent
  implements OnInit, OnChanges
{
  options: MultiSelectOption[] = [];
  selectedOptions: MultiSelectOption[] = [];

  override ngOnInit() {
    this.updateBubbleConfig();
    this.initializeQuestion();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['config']) {
      this.updateBubbleConfig();
      this.updateSelectedOptions();
    }
  }

  private updateBubbleConfig(): void {
    this.bubbleConfig.isSent = this.config.isSent || false;
    this.bubbleConfig.sendButtonDisabled = !this.isSendEnabled;

    // Set max-width for multiselect
    this.bubbleConfig.maxWidth = '650px';
  }

  protected initializeQuestion(): void {
    // Initialize options from question data
    const multiSelectQuestion = this.config.question as MultiSelectQuestion;
    if (multiSelectQuestion.options) {
      this.options = multiSelectQuestion.options.map((option: string) => ({
        value: option,
        selected: false,
      }));
    }

    // If in sent mode and we have an answer, select the appropriate options
    if (
      this.config.isSent &&
      this.config.answer &&
      Array.isArray(this.config.answer)
    ) {
      const savedAnswers = this.config.answer as string[];
      this.options.forEach((option) => {
        option.selected = savedAnswers.includes(option.value);
      });
    }

    this.updateSelectedOptions();
    this.updateSendButtonState();
  }

  protected override handleSend(): void {
    if (this.selectedOptions.length > 0) {
      this.submitAnswer();
    }
  }

  toggleOption(option: MultiSelectOption): void {
    option.selected = !option.selected;
    this.updateSelectedOptions();
    this.updateSendButtonState();
  }

  private updateSelectedOptions(): void {
    this.selectedOptions = this.options.filter((option) => option.selected);
  }

  private updateSendButtonState(): void {
    this.bubbleConfig.sendButtonDisabled = !this.isSendEnabled;
  }

  // Override to check if send button should be enabled
  protected get isSendEnabled(): boolean {
    return this.selectedOptions.length > 0;
  }

  // Override submitAnswer to send selected values
  protected override submitAnswer(): void {
    const selectedValues = this.selectedOptions.map((option) => option.value);
    this.answer = selectedValues;
    super.submitAnswer();
  }
}
