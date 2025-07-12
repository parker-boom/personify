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
import { SliderQuestion } from '../../../../shared/models/question.interface';

@Component({
  selector: 'app-slider-question',
  standalone: true,
  imports: [CommonModule, TextBubbleWrapper],
  template: `
    <app-text-bubble-wrapper [config]="bubbleConfig" (onSend)="handleSend()">
      <div
        #containerRef
        class="slider-question-container"
        tabindex="0"
        (keydown)="onContainerKeyDown($event)"
      >
        <!-- Unsent Mode: Interactive Slider -->
        <div *ngIf="!config.isSent" class="slider-interactive">
          <div class="slider-row">
            <div class="slider-value">{{ value }}</div>
            <div class="slider-track-container">
              <div class="slider-track">
                <div
                  *ngFor="let pos of positions; let i = index"
                  class="slider-tick"
                  [class.selected]="i + 1 === value"
                >
                  <div
                    class="slider-dot"
                    [class.selected]="i + 1 === value"
                  ></div>
                </div>
                <div
                  class="slider-thumb"
                  [style.left.%]="thumbPosition"
                  (mousedown)="startDrag($event)"
                  (touchstart)="startDrag($event)"
                  tabindex="0"
                  (keydown)="onKeyDown($event)"
                ></div>
              </div>
              <div class="slider-labels">
                <span class="slider-label left">A little</span>
                <span class="slider-label right">A lot</span>
              </div>
            </div>
          </div>
        </div>
        <!-- Sent Mode: Display Value -->
        <div *ngIf="config.isSent" class="slider-sent">
          <span class="sent-value">{{ value }}</span>
          <span class="sent-outof">out of</span>
          <span class="sent-max">10</span>
        </div>
      </div>
    </app-text-bubble-wrapper>
  `,
  styleUrls: ['./slider-question.scss'],
})
export class SliderQuestionComponent
  extends BaseQuestionComponent
  implements OnInit, OnChanges, AfterViewInit
{
  @ViewChild('containerRef') containerRef!: ElementRef<HTMLDivElement>;

  value = 5;
  min = 1;
  max = 10;
  positions = Array(10).fill(0);
  dragging = false;

  get thumbPosition(): number {
    // Returns the left % for the thumb based on value
    return ((this.value - this.min) / (this.max - this.min)) * 100;
  }

  override ngOnInit() {
    this.updateBubbleConfig();
    this.initializeQuestion();
    document.addEventListener('mousemove', this.onDragMove);
    document.addEventListener('mouseup', this.stopDrag);
    document.addEventListener('touchmove', this.onDragMove);
    document.addEventListener('touchend', this.stopDrag);
  }

  ngAfterViewInit() {
    // Auto-focus the container when it's available and not in sent mode
    if (this.containerRef && !this.config.isSent) {
      setTimeout(() => {
        this.containerRef.nativeElement.focus();
      }, 100);
    }
  }

  ngOnDestroy() {
    document.removeEventListener('mousemove', this.onDragMove);
    document.removeEventListener('mouseup', this.stopDrag);
    document.removeEventListener('touchmove', this.onDragMove);
    document.removeEventListener('touchend', this.stopDrag);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['config']) {
      this.updateBubbleConfig();
    }
  }

  private updateBubbleConfig(): void {
    this.bubbleConfig.isSent = this.config.isSent || false;
    this.bubbleConfig.sendButtonDisabled = false; // Always enabled
    this.bubbleConfig.maxWidth = '650px';
  }

  protected initializeQuestion(): void {
    const sliderQ = this.config.question as SliderQuestion;
    this.min = sliderQ.range?.min ?? 1;
    this.max = sliderQ.range?.max ?? 10;
    this.value = sliderQ.default ?? Math.round((this.min + this.max) / 2);
    this.positions = Array(this.max - this.min + 1).fill(0);
  }

  protected override handleSend(): void {
    this.submitAnswer();
  }

  protected override submitAnswer(): void {
    this.answer = this.value;
    super.submitAnswer();
  }

  startDrag(event: MouseEvent | TouchEvent): void {
    event.preventDefault();
    this.dragging = true;
    document.body.style.userSelect = 'none';
    this.onDragMove(event);
  }

  onDragMove = (event: MouseEvent | TouchEvent): void => {
    if (!this.dragging) return;
    let clientX: number;
    if (event instanceof MouseEvent) {
      clientX = event.clientX;
    } else {
      clientX = event.touches[0].clientX;
    }
    const track = document.querySelector('.slider-track') as HTMLElement;
    if (!track) return;
    const rect = track.getBoundingClientRect();
    const percent = Math.min(
      Math.max((clientX - rect.left) / rect.width, 0),
      1
    );
    const rawValue = this.min + percent * (this.max - this.min);
    this.value = Math.round(rawValue);
  };

  stopDrag = (): void => {
    if (this.dragging) {
      this.dragging = false;
      document.body.style.userSelect = '';
    }
  };

  onKeyDown(event: KeyboardEvent): void {
    if (event.key === 'ArrowLeft' && this.value > this.min) {
      this.value--;
    } else if (event.key === 'ArrowRight' && this.value < this.max) {
      this.value++;
    }
  }

  onContainerKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      event.preventDefault();
      this.handleSend();
    }
  }
}
