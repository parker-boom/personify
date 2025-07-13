import {
  Component,
  OnInit,
  OnChanges,
  SimpleChanges,
  ViewChild,
  ElementRef,
  AfterViewInit,
} from '@angular/core';
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
      <div
        #containerRef
        class="toggle-question-container"
        tabindex="0"
        (keydown)="onContainerKeyDown($event)"
      >
        <!-- Unsent Mode: Interactive Toggle -->
        <div *ngIf="!config.isSent" class="toggle-interactive">
          <div class="toggle-options">
            <button
              class="toggle-option left"
              [class.selected]="selectedValue === false"
              (click)="selectValue(false)"
              type="button"
            >
              {{ leftOption }}
            </button>
            <button
              class="toggle-option right"
              [class.selected]="selectedValue === true"
              (click)="selectValue(true)"
              type="button"
            >
              {{ rightOption }}
            </button>
          </div>
        </div>
        <!-- Sent Mode: Display Selected Value -->
        <div *ngIf="config.isSent" class="sent-text">
          {{ selectedValue ? rightOption : leftOption }}
        </div>
      </div>
    </app-text-bubble-wrapper>
  `,
  styleUrls: ['./toggle-question.scss'],
})
export class ToggleQuestionComponent
  extends BaseQuestionComponent
  implements OnInit, OnChanges, AfterViewInit
{
  @ViewChild('containerRef') containerRef!: ElementRef<HTMLDivElement>;

  leftOption = 'Yes';
  rightOption = 'No';
  selectedValue: boolean | null = null;

  override ngOnInit() {
    this.updateBubbleConfig();
    this.initializeQuestion();
  }

  ngAfterViewInit() {
    // Auto-focus the container when it's available and not in sent mode
    if (this.containerRef && !this.config.isSent) {
      setTimeout(() => {
        this.containerRef.nativeElement.focus();
      }, 100);
    }
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
    // If in sent mode and we have an answer, set the selected value
    if (this.config.isSent && this.config.answer) {
      this.selectedValue = this.config.answer === 'YES';
    } else {
      this.selectedValue = null;
    }
    this.updateSendButtonState();
  }

  selectValue(value: boolean): void {
    this.selectedValue = value;
    this.updateSendButtonState();
  }

  protected override handleSend(): void {
    if (this.selectedValue !== null) {
      this.submitAnswer();
    }
  }

  private updateSendButtonState(): void {
    this.bubbleConfig.sendButtonDisabled = !this.isSendEnabled;
  }

  protected get isSendEnabled(): boolean {
    return this.selectedValue !== null;
  }

  protected override submitAnswer(): void {
    this.answer = this.selectedValue ? 'YES' : 'NO';
    super.submitAnswer();
  }

  onContainerKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      event.preventDefault();
      if (this.isSendEnabled) {
        this.handleSend();
      }
    }
  }
}
