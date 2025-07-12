import { Component, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  BaseQuestionComponent,
  QuestionComponentConfig,
} from '../base-question/base-question';
import { TextBubbleWrapper } from '../text-bubble-wrapper/text-bubble-wrapper';
import { DropdownQuestion } from '../../../../shared/models/question.interface';

@Component({
  selector: 'app-dropdown-question',
  standalone: true,
  imports: [CommonModule, TextBubbleWrapper],
  template: `
    <app-text-bubble-wrapper [config]="bubbleConfig" (onSend)="handleSend()">
      <div class="dropdown-question-container">
        <!-- Unsent Mode: Interactive Dropdown -->
        <div *ngIf="!config.isSent" class="dropdown-interactive">
          <div
            class="dropdown-box"
            [class.open]="dropdownOpen"
            (click)="toggleDropdown()"
          >
            <span class="dropdown-selected">
              {{ selectedOption || 'SELECT ▼' }}
            </span>
          </div>
          <div class="dropdown-options" *ngIf="dropdownOpen">
            <div
              class="dropdown-option"
              *ngFor="let option of options"
              (click)="selectOption(option); $event.stopPropagation()"
            >
              {{ option }}
            </div>
          </div>
        </div>
        <!-- Sent Mode: Display Selected Value -->
        <div *ngIf="config.isSent" class="sent-text">
          {{ selectedOption }}
        </div>
      </div>
    </app-text-bubble-wrapper>
  `,
  styleUrls: ['./dropdown-question.scss'],
})
export class DropdownQuestionComponent
  extends BaseQuestionComponent
  implements OnInit, OnChanges
{
  options: string[] = [];
  selectedOption: string = '';
  dropdownOpen = false;

  override ngOnInit() {
    this.updateBubbleConfig();
    this.initializeQuestion();
    document.addEventListener('click', this.closeDropdownOnClick);
  }

  ngOnDestroy() {
    document.removeEventListener('click', this.closeDropdownOnClick);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['config']) {
      this.updateBubbleConfig();
    }
  }

  private updateBubbleConfig(): void {
    this.bubbleConfig.isSent = this.config.isSent || false;
    this.bubbleConfig.sendButtonDisabled = !this.isSendEnabled;
    this.bubbleConfig.maxWidth = '400px';
  }

  protected initializeQuestion(): void {
    const dropdownQ = this.config.question as DropdownQuestion;
    this.options = dropdownQ.options || [];
    this.selectedOption = '';
    this.dropdownOpen = false;
    this.updateSendButtonState();
  }

  protected override handleSend(): void {
    if (this.selectedOption) {
      this.submitAnswer();
    }
  }

  selectOption(option: string): void {
    this.selectedOption = option;
    this.dropdownOpen = false;
    this.updateSendButtonState();
  }

  toggleDropdown(): void {
    this.dropdownOpen = !this.dropdownOpen;
  }

  closeDropdownOnClick = (event: MouseEvent): void => {
    if (
      !(event.target as HTMLElement).closest('.dropdown-question-container')
    ) {
      this.dropdownOpen = false;
    }
  };

  private updateSendButtonState(): void {
    this.bubbleConfig.sendButtonDisabled = !this.isSendEnabled;
  }

  protected get isSendEnabled(): boolean {
    return !!this.selectedOption;
  }

  protected override submitAnswer(): void {
    this.answer = this.selectedOption;
    super.submitAnswer();
  }
}
